/**
 * KTECH Home Appliances - Web Server & Dynamic Routing Engine
 * High-performance full-stack Node.js server powered by native SQLite
 * Runs locally on http://localhost:5001
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const db = require('./db');
const seedDatabase = require('./seed');

const PORT = parseInt(process.env.PORT, 10) || 5001;
const BASE_DIR = __dirname;
const DATA_DIR = path.join(BASE_DIR, 'data');

// Ensure database is populated on start
try {
  const catCount = db.prepare('SELECT COUNT(*) as count FROM categories').get();
  if (!catCount || catCount.count === 0) {
    seedDatabase();
  }
} catch (err) {
  console.warn('Seeding check warning:', err.message);
  seedDatabase();
}

// MIME types dictionary
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// Helper: Parse request body (JSON or URL-encoded)
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 10 * 1024 * 1024) {
        reject(new Error('Request entity too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      const contentType = req.headers['content-type'] || '';
      if (contentType.includes('application/json')) {
        try {
          resolve(JSON.parse(body));
        } catch (err) {
          reject(new Error('Invalid JSON format'));
        }
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        const params = new URLSearchParams(body);
        const obj = {};
        for (const [key, val] of params.entries()) {
          obj[key] = val;
        }
        resolve(obj);
      } else {
        try {
          resolve(JSON.parse(body));
        } catch (_) {
          resolve({ raw: body });
        }
      }
    });
    req.on('error', reject);
  });
}

// Helper: Set CORS headers
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Helper: Send JSON response
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

// Request Handler
const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // ==========================================
  // REST API ROUTES
  // ==========================================
  if (pathname.startsWith('/api/')) {
    // Health check
    if (pathname === '/api/health' && req.method === 'GET') {
      return sendJson(res, 200, {
        status: 'ok',
        app: 'KTECH Home Appliances',
        database: 'SQLite (node:sqlite)',
        port: PORT,
        time: new Date().toISOString()
      });
    }

    // Site Configuration
    if (pathname === '/api/config' && req.method === 'GET') {
      try {
        const rows = db.prepare('SELECT key, value FROM settings').all();
        const config = {};
        rows.forEach(r => config[r.key] = r.value);
        return sendJson(res, 200, { success: true, config });
      } catch (err) {
        return sendJson(res, 500, { success: false, error: err.message });
      }
    }

    // Categories List
    if (pathname === '/api/categories' && req.method === 'GET') {
      try {
        const categories = db.prepare(`
          SELECT c.*, COUNT(p.id) as product_count
          FROM categories c
          LEFT JOIN products p ON p.category_id = c.id
          GROUP BY c.id
          ORDER BY c.order_num ASC
        `).all();
        return sendJson(res, 200, { success: true, count: categories.length, categories });
      } catch (err) {
        return sendJson(res, 500, { success: false, error: err.message });
      }
    }

    // Single Category with Products
    if (pathname.startsWith('/api/categories/') && req.method === 'GET') {
      const slug = pathname.replace('/api/categories/', '').trim();
      try {
        const category = db.prepare('SELECT * FROM categories WHERE slug = ? OR id = ?').get(slug, slug);
        if (!category) {
          return sendJson(res, 404, { success: false, error: 'Category not found' });
        }
        const products = db.prepare("SELECT * FROM products WHERE category_id = ? AND status = 'published' ORDER BY featured DESC, name ASC").all(category.id);
        return sendJson(res, 200, { success: true, category, products });
      } catch (err) {
        return sendJson(res, 500, { success: false, error: err.message });
      }
    }

    // Products List (supports ?category=, ?search=, ?featured=1)
    if (pathname === '/api/products' && req.method === 'GET') {
      try {
        let sql = `
          SELECT p.*, c.name as category_name, c.slug as category_slug
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE p.status = 'published'
        `;
        const params = [];

        if (query.category) {
          sql += ` AND (p.category_id = ? OR c.slug = ?)`;
          params.push(query.category, query.category);
        }

        if (query.featured) {
          sql += ` AND p.featured = 1`;
        }

        if (query.search) {
          sql += ` AND (p.name LIKE ? OR p.short_description LIKE ? OR p.sku LIKE ?)`;
          const term = `%${query.search.trim()}%`;
          params.push(term, term, term);
        }

        sql += ` ORDER BY p.featured DESC, p.created_at DESC`;

        const products = db.prepare(sql).all(...params);
        return sendJson(res, 200, { success: true, count: products.length, products });
      } catch (err) {
        return sendJson(res, 500, { success: false, error: err.message });
      }
    }

    // Single Product Detail
    if (pathname.startsWith('/api/products/') && req.method === 'GET') {
      const slug = pathname.replace('/api/products/', '').trim();
      try {
        const product = db.prepare(`
          SELECT p.*, c.name as category_name, c.slug as category_slug
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE p.slug = ? OR p.id = ?
        `).get(slug, slug);

        if (!product) {
          return sendJson(res, 404, { success: false, error: 'Product not found' });
        }

        // Related products in the same category
        const related = db.prepare(`
          SELECT id, name, slug, image, sku, short_description
          FROM products
          WHERE category_id = ? AND id != ? AND status = 'published'
          LIMIT 4
        `).all(product.category_id, product.id);

        return sendJson(res, 200, {
          success: true,
          product: {
            ...product,
            gallery: product.gallery ? JSON.parse(product.gallery) : [product.image],
            specifications: product.specifications ? JSON.parse(product.specifications) : {},
            features: product.features ? JSON.parse(product.features) : [],
            variants: product.variants ? JSON.parse(product.variants) : []
          },
          related
        });
      } catch (err) {
        return sendJson(res, 500, { success: false, error: err.message });
      }
    }

    // Retail Stores List
    if (pathname === '/api/stores' && req.method === 'GET') {
      try {
        const stores = db.prepare('SELECT * FROM stores ORDER BY order_num ASC').all();
        return sendJson(res, 200, { success: true, count: stores.length, stores });
      } catch (err) {
        return sendJson(res, 500, { success: false, error: err.message });
      }
    }

    // Blogs List
    if (pathname === '/api/blogs' && req.method === 'GET') {
      try {
        const blogs = db.prepare("SELECT * FROM blogs WHERE status = 'published' ORDER BY created_at DESC").all();
        return sendJson(res, 200, { success: true, count: blogs.length, blogs });
      } catch (err) {
        return sendJson(res, 500, { success: false, error: err.message });
      }
    }

    // Submit Enquiry (POST /api/enquiries or /api/contact)
    if ((pathname === '/api/enquiries' || pathname === '/api/contact') && req.method === 'POST') {
      try {
        const data = await parseRequestBody(req);
        const { name, phone, email, subject, message, enquiryType, categoryId, productId, city, sourceUrl } = data;

        if (!name || !phone || !message) {
          return sendJson(res, 400, {
            success: false,
            error: 'Full Name, Phone Number, and Message / Requirement are required.'
          });
        }

        const referenceId = 'KT-ENQ-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(100 + Math.random() * 900);

        const stmt = db.prepare(`
          INSERT INTO enquiries (
            reference_id, name, phone, email, city, enquiry_type,
            category_id, product_id, subject, message, source_url
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
          referenceId,
          String(name).trim(),
          String(phone).trim(),
          email ? String(email).trim() : null,
          city ? String(city).trim() : null,
          enquiryType ? String(enquiryType).trim() : 'Product Enquiry',
          categoryId ? String(categoryId).trim() : null,
          productId ? String(productId).trim() : null,
          subject ? String(subject).trim() : 'Website Product Enquiry',
          String(message).trim(),
          sourceUrl ? String(sourceUrl).trim() : null
        );

        console.log(`[${new Date().toLocaleTimeString()}] New Enquiry: ${name} (${phone}) - Ref: ${referenceId}`);

        return sendJson(res, 201, {
          success: true,
          message: 'Thank you! Your enquiry has been received successfully. Our sales team will connect with you within 24 hours.',
          referenceId,
          whatsappUrl: `https://wa.me/917708878603?text=${encodeURIComponent(`Hello KTECH, I submitted enquiry ref ${referenceId} regarding: ${subject || 'Product Catalogue'}`)}`
        });
      } catch (err) {
        console.error('Enquiry insertion error:', err);
        return sendJson(res, 500, { success: false, error: 'Database error saving enquiry: ' + err.message });
      }
    }

    // View Enquiries (GET /api/enquiries)
    if (pathname === '/api/enquiries' && req.method === 'GET') {
      try {
        const enquiries = db.prepare('SELECT * FROM enquiries ORDER BY created_at DESC').all();
        return sendJson(res, 200, { success: true, count: enquiries.length, enquiries });
      } catch (err) {
        return sendJson(res, 500, { success: false, error: err.message });
      }
    }

    // Submit Quote Request (POST /api/quotes)
    if (pathname === '/api/quotes' && req.method === 'POST') {
      try {
        const data = await parseRequestBody(req);
        const {
          customerName, companyName, phone, email, customerType,
          categoryId, productId, quantity, budgetRange, deliveryLocation,
          requiredDate, customizationNotes
        } = data;

        if (!customerName || !phone) {
          return sendJson(res, 400, {
            success: false,
            error: 'Full Name and Phone Number are required to request a quote.'
          });
        }

        const referenceId = 'KT-QUO-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(100 + Math.random() * 900);

        const stmt = db.prepare(`
          INSERT INTO quotes (
            reference_id, customer_name, company_name, phone, email,
            customer_type, category_id, product_id, quantity, budget_range,
            delivery_location, required_date, customization_notes
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
          referenceId,
          String(customerName).trim(),
          companyName ? String(companyName).trim() : null,
          String(phone).trim(),
          email ? String(email).trim() : null,
          customerType ? String(customerType).trim() : 'Corporate',
          categoryId ? String(categoryId).trim() : null,
          productId ? String(productId).trim() : null,
          quantity ? String(quantity).trim() : 'Standard Bulk',
          budgetRange ? String(budgetRange).trim() : null,
          deliveryLocation ? String(deliveryLocation).trim() : null,
          requiredDate ? String(requiredDate).trim() : null,
          customizationNotes ? String(customizationNotes).trim() : null
        );

        console.log(`[${new Date().toLocaleTimeString()}] New Quote Request: ${customerName} (${companyName || 'Individual'}) - Ref: ${referenceId}`);

        return sendJson(res, 201, {
          success: true,
          message: 'Quotation request submitted successfully! Our B2B commercial desk will prepare your quotation and dispatch pricing within 24 hours.',
          referenceId,
          whatsappUrl: `https://wa.me/917708878603?text=${encodeURIComponent(`Hello KTECH, I submitted bulk quotation request ref ${referenceId} for ${quantity || 'bulk supply'}.`)}`
        });
      } catch (err) {
        console.error('Quote insertion error:', err);
        return sendJson(res, 500, { success: false, error: 'Database error saving quotation: ' + err.message });
      }
    }

    // View Quotes (GET /api/quotes)
    if (pathname === '/api/quotes' && req.method === 'GET') {
      try {
        const quotes = db.prepare('SELECT * FROM quotes ORDER BY created_at DESC').all();
        return sendJson(res, 200, { success: true, count: quotes.length, quotes });
      } catch (err) {
        return sendJson(res, 500, { success: false, error: err.message });
      }
    }

    // Unknown API endpoint
    return sendJson(res, 404, { success: false, error: 'API endpoint not found' });
  }

  // ==========================================
  // PUBLIC PAGE ROUTING & STATIC FILE SERVING
  // ==========================================
  // Clean URL Mappings
  const ROUTE_MAP = {
    '/': '/index.html',
    '/home': '/index.html',
    '/categories': '/categories.html',
    '/products': '/products.html',
    '/about': '/about.html',
    '/about-us': '/about.html',
    '/bulk': '/bulk.html',
    '/bulk-solutions': '/bulk.html',
    '/stores': '/stores.html',
    '/our-stores': '/stores.html',
    '/blogs': '/blogs.html',
    '/contact': '/contact.html',
    '/contact-us': '/contact.html',
    '/request-quote': '/quote.html',
    '/quote': '/quote.html',
    '/enquire': '/enquire.html',
    '/privacy-policy': '/privacy.html',
    '/privacy': '/privacy.html',
    '/terms-of-use': '/terms.html',
    '/terms': '/terms.html',
    '/admin': '/admin.html'
  };

  // Check if requested pathname matches a clean route
  if (ROUTE_MAP[pathname]) {
    pathname = ROUTE_MAP[pathname];
  } else if (pathname.startsWith('/products/') && !path.extname(pathname)) {
    // Dynamic Product Detail Page (/products/[product-slug])
    pathname = '/product-detail.html';
  } else if (pathname.startsWith('/categories/') && !path.extname(pathname)) {
    // Dynamic Category Detail Page (/categories/[category-slug])
    pathname = '/categories.html';
  } else if (pathname.startsWith('/blogs/') && !path.extname(pathname)) {
    // Dynamic Blog Detail Page (/blogs/[blog-slug])
    pathname = '/blogs.html';
  }

  // Prevent directory traversal attacks
  const safePath = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(BASE_DIR, safePath);

  // Check if file is inside BASE_DIR
  if (!filePath.startsWith(BASE_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Return custom styled 404 page
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!doctype html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <title>404 - Page Not Found | KTECH Home Appliances</title>
          <link rel="stylesheet" href="/styles.css">
          <style>
            .error-box { max-width: 600px; margin: 90px auto; text-align: center; padding: 40px 24px; background: #fff; border-radius: 24px; border: 1px solid var(--color-border); box-shadow: var(--shadow-card); }
            .error-code { font-family: 'Playfair Display', Georgia, serif; font-size: 72px; color: var(--color-primary); margin: 0; line-height: 1; }
            .error-box p { margin: 15px 0 25px; color: var(--color-muted); }
          </style>
        </head>
        <body class="section-waves">
          <div class="container">
            <div class="error-box">
              <h1 class="error-code">404</h1>
              <h2>Page Not Found</h2>
              <p>The page <code>${pathname}</code> could not be found or may have been moved.</p>
              <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
                <a href="/" class="btn btn-primary">Return to Homepage ↗</a>
                <a href="/products" class="btn btn-outline">Explore Products ↗</a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': (ext === '.html' || ext === '.css' || ext === '.js') ? 'no-cache, no-store, must-revalidate' : 'public, max-age=86400'
    });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  });
});

if (require.main === module) {
  server.listen(PORT, '0.0.0.0', () => {
    console.log('====================================================');
    console.log(` KTECH Home Appliances Web Server Running!`);
    console.log(` Local URL:     http://localhost:${PORT}`);
    console.log(` Categories:    http://localhost:${PORT}/categories`);
    console.log(` Products:      http://localhost:${PORT}/products`);
    console.log(` Request Quote: http://localhost:${PORT}/request-quote`);
    console.log(` REST API:      http://localhost:${PORT}/api/products`);
    console.log('====================================================');
  });
}

module.exports = server;
