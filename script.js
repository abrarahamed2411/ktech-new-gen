/**
 * KTECH Home Appliances - Main Frontend Engine
 * Phase 1: Shared Layout, Navigation, Category Dropdowns, Modal Dialogs & Lead Management
 */

const SITE_CONFIG = {
  companyName: 'KTECH Home Appliances',
  phone: '+91 77088 78603',
  phoneRaw: '917708878603',
  email: 'sales@ktechappliances.com',
  address: 'KTech Factory & Direct Dispatch Hub, Coimbatore, Tamil Nadu 641001',
  whatsappLink: 'https://wa.me/917708878603'
};

// Universal image URL normalizer (handles both /images/ and images/ safely)
window.normalizeImg = function(img, fallback = '/images/10-cookware.jpg') {
  if (!img) return fallback;
  if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:')) return img;
  return img.startsWith('/') ? img : '/' + img;
};

// Default Catalogue Seed Data (backed by SQLite via /api/products)
const defaultCategories = [
  ['Cookware', '/images/10-cookware.jpg', 'cookware'],
  ['Non-Stick Cookware', '/images/02-non-stick-cookware.jpg', 'non-stick-cookware'],
  ['LPG Gas Stoves', '/images/03-lpg-gas-stove.jpg', 'lpg-gas-stoves'],
  ['Mixer & Grinders', '/images/01-mixer-grinder.jpg', 'mixer-grinders'],
  ['Electronic Appliances', '/images/06-electronic-appliance.jpg', 'electronic-appliances'],
  ['Dining & Serving', '/images/11-dining-serving.jpg', 'dining-serving'],
  ['Dinner Sets', '/images/04-dinner-set.jpg', 'dinner-sets'],
  ['Combo Gift Sets', '/images/05-combo-gift-set.jpg', 'combo-gift-sets'],
  ['Pressure Cookers', '/images/07-pressure-cooker.jpg', 'pressure-cookers'],
  ['Corporate Gifting Boxes', '/images/08-corporate-gifting-boxes.jpg', 'corporate-gifting'],
  ['Festival Gifting Sets', '/images/09-festival-gifting-mixer.jpg', 'festival-gifting']
];

// Helper: Open Modal Dialog for Request Quote
function openQuoteModal(productName = '') {
  let modal = document.getElementById('ktech-quote-modal');
  if (!modal) {
    createQuoteModalElement();
    modal = document.getElementById('ktech-quote-modal');
  }
  const prodInput = modal.querySelector('input[name="product"]');
  if (prodInput && productName) {
    prodInput.value = productName;
  }
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

// Helper: Close all modals
function closeModals() {
  document.querySelectorAll('.ktech-modal-backdrop').forEach(m => m.classList.remove('open'));
  document.body.style.overflow = '';
}

// Helper: Create Quote Modal DOM
function createQuoteModalElement() {
  const div = document.createElement('div');
  div.id = 'ktech-quote-modal';
  div.className = 'ktech-modal-backdrop';
  div.innerHTML = `
    <div class="ktech-modal-box">
      <button class="modal-close-btn" aria-label="Close dialog" onclick="closeModals()">✕</button>
      <span class="eyebrow">✦ COMMERCIAL & BULK PRICING</span>
      <h2 style="font-family:'Playfair Display',Georgia,serif; margin:12px 0 8px; color:var(--color-heading);">Request Quotation</h2>
      <p style="color:var(--color-muted); font-size:13.5px; margin-bottom:20px;">
        Share your product requirements and delivery destination. Our wholesale commercial desk responds within 24 hours with official B2B pricing.
      </p>
      <form id="modal-quote-form" class="contact-form" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <input name="customerName" placeholder="Your Name / Contact Person *" required>
        <input name="phone" type="tel" placeholder="Mobile / WhatsApp Number *" required>
        <input name="companyName" placeholder="Company / Business Name (Optional)">
        <input name="email" type="email" placeholder="Official Email Address">
        <input name="product" placeholder="Product Required (e.g. 5L Pressure Cooker)">
        <input name="quantity" placeholder="Estimated Quantity (e.g. 50 pcs / 100 sets)">
        <textarea name="customizationNotes" placeholder="Delivery destination, customization needs (e.g. logo engraving, special gift packaging) *" required style="grid-column:1/-1;"></textarea>
        <div style="grid-column:1/-1; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <button type="submit" class="btn btn-primary" id="modal-quote-submit">Submit Quote Request ↗</button>
          <a href="${SITE_CONFIG.whatsappLink}" target="_blank" class="whatsapp-chat-link" style="margin-top:0;">💬 Quote via WhatsApp</a>
        </div>
      </form>
      <div class="form-status" id="modal-quote-status"></div>
    </div>
  `;
  document.body.appendChild(div);

  // Close when clicking outside modal box
  div.addEventListener('click', e => {
    if (e.target === div) closeModals();
  });

  // Modal Form Submission
  const form = div.querySelector('#modal-quote-form');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const statusEl = div.querySelector('#modal-quote-status');
    const submitBtn = div.querySelector('#modal-quote-submit');
    const formData = new FormData(form);

    statusEl.className = 'form-status show loading';
    statusEl.textContent = 'Submitting quotation request to KTECH sales desk...';
    submitBtn.disabled = true;

    try {
      const payload = {
        customerName: formData.get('customerName')?.toString().trim(),
        phone: formData.get('phone')?.toString().trim(),
        companyName: formData.get('companyName')?.toString().trim(),
        email: formData.get('email')?.toString().trim(),
        product: formData.get('product')?.toString().trim(),
        quantity: formData.get('quantity')?.toString().trim(),
        customizationNotes: formData.get('customizationNotes')?.toString().trim()
      };

      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        statusEl.className = 'form-status show success';
        statusEl.innerHTML = `
          <div>✓ Thank you, <strong>${payload.customerName}</strong>! Your quote request has been recorded. <span class="ref-badge">Ref: ${data.referenceId}</span></div>
          <div style="margin-top:6px; font-size:12px;">Our team will email or call you with pricing. You can also chat directly:</div>
          <a href="${data.whatsappUrl}" target="_blank" class="whatsapp-chat-link">💬 Open WhatsApp with Reference ↗</a>
        `;
        form.reset();
      } else {
        throw new Error(data.error || 'Failed to submit quote request.');
      }
    } catch (err) {
      statusEl.className = 'form-status show error';
      statusEl.textContent = 'Unable to connect to server. Please call +91 77088 78603 or use WhatsApp.';
    } finally {
      submitBtn.disabled = false;
    }
  });
}

// Pre-fill contact form with specific enquiry
function selectProductForEnquiry(productName) {
  const form = document.querySelector('#contact-form');
  const subjectInput = form?.querySelector('input[name="subject"]');
  const messageInput = form?.querySelector('textarea[name="message"]');
  const nameInput = form?.querySelector('input[name="name"]');

  if (subjectInput) {
    subjectInput.value = `Enquiry: ${productName}`;
    subjectInput.classList.add('highlight-field');
    setTimeout(() => subjectInput.classList.remove('highlight-field'), 1800);
  }

  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      if (nameInput && !nameInput.value) {
        nameInput.focus();
      } else if (messageInput) {
        messageInput.focus();
      }
    }, 600);
  } else {
    // If on a page without in-page contact section, open Quote Modal
    openQuoteModal(productName);
  }
}

// Render Category / Product Cards
function renderCards(target, items) {
  const el = document.getElementById(target);
  if (!el) return;
  el.innerHTML = items
    .map(
      ([name, img, slug]) => {
        const imgSrc = img ? (img.startsWith('/') || img.startsWith('http') ? img : '/' + img) : '/images/10-cookware.jpg';
        return `
      <article class="category-card" data-category="${name}" style="overflow:hidden; min-width:0; display:flex; flex-direction:column;">
        <a href="${slug ? '/categories/' + slug : '/products'}" style="display:block;">
          <img loading="lazy" src="${imgSrc}" alt="${name}">
        </a>
        <div class="card-bottom" style="display:flex; justify-content:space-between; align-items:center; gap:8px; width:100%; box-sizing:border-box; min-width:0; padding:12px 6px 4px;">
          <h3 style="margin:0; font-size:14px; line-height:1.35; white-space:normal; overflow-wrap:break-word; word-wrap:break-word; flex:1; min-width:0;">
            <a href="${slug ? '/categories/' + slug : '/products'}" style="white-space:normal!important; overflow-wrap:break-word; word-wrap:break-word; word-break:normal; line-height:1.35; display:block; color:var(--color-heading); font-size:14px;">${name}</a>
          </h3>
          <a href="#contact" class="enquire-card-link" data-item="${name}" style="white-space:nowrap!important; flex-shrink:0;" aria-label="Enquire about ${name}">Enquire ↗</a>
        </div>
      </article>`;
      }
    )
    .join('');
}

// Enhance Header with Categories Dropdown and Active Links
function enhanceHeader() {
  const currentPath = window.location.pathname.toLowerCase();
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href')?.toLowerCase();
    if (href === currentPath || (currentPath === '/' && (href === 'index.html' || href === '/'))) {
      a.classList.add('active');
    }
  });

  // Add Categories Dropdown Menu if not present
  const catLink = document.querySelector('.nav-links a[href="products.html"], .nav-links a[href="/products"], .nav-links a[href="/categories"]');
  if (catLink && !catLink.parentElement.classList.contains('nav-dropdown')) {
    const wrapper = document.createElement('div');
    wrapper.className = 'nav-dropdown';
    catLink.parentNode.insertBefore(wrapper, catLink);
    wrapper.appendChild(catLink);

    catLink.className = 'nav-dropdown-toggle' + (catLink.classList.contains('active') ? ' active' : '');
    catLink.innerHTML = `${catLink.textContent}`;

    const dropdown = document.createElement('div');
    dropdown.className = 'nav-dropdown-menu';
    dropdown.innerHTML = `
      <div style="font-size:11px; font-weight:800; color:var(--color-primary); padding:6px 14px 4px; text-transform:uppercase; letter-spacing:0.08em;">Browse Categories</div>
      <a href="/categories"><img src="/images/10-cookware.jpg" alt="All"> All Categories ↗</a>
      <a href="/categories/cookware"><img src="/images/10-cookware.jpg" alt="Cookware"> Stainless Steel Cookware</a>
      <a href="/categories/pressure-cookers"><img src="/images/07-pressure-cooker.jpg" alt="Pressure Cookers"> Pressure Cookers</a>
      <a href="/categories/non-stick-cookware"><img src="/images/02-non-stick-cookware.jpg" alt="Non-Stick"> Non-Stick Cookware</a>
      <a href="/categories/lpg-gas-stoves"><img src="/images/03-lpg-gas-stove.jpg" alt="Gas Stoves"> LPG Gas Stoves</a>
      <a href="/categories/mixer-grinders"><img src="/images/01-mixer-grinder.jpg" alt="Mixers"> Mixer & Grinders</a>
      <a href="/categories/electronic-appliances"><img src="/images/06-electronic-appliance.jpg" alt="Appliances"> Electronic Appliances</a>
      <a href="/categories/dinner-sets"><img src="/images/04-dinner-set.jpg" alt="Dinner Sets"> Dinner Sets & Dining</a>
      <a href="/categories/corporate-gifting"><img src="/images/08-corporate-gifting-boxes.jpg" alt="Bulk Gifting"> Bulk & Corporate Gifting</a>
    `;
    wrapper.appendChild(dropdown);
  }
}

// Initialise Card Grids
renderCards('home-categories', defaultCategories);
renderCards('product-category-grid', defaultCategories);

// Try loading live categories from SQLite /api/categories
fetch('/api/categories')
  .then(res => res.json())
  .then(data => {
    if (data.success && data.categories?.length > 0) {
      const liveItems = data.categories.map(c => [c.name, c.image, c.slug]);
      renderCards('home-categories', liveItems);
      renderCards('product-category-grid', liveItems);
    }
  })
  .catch(err => console.log('Serving default catalogue data'));

// Click Handler: Enquiry Links & CTA triggers
document.addEventListener('click', e => {
  const link = e.target.closest('.enquire-card-link');
  if (link) {
    e.preventDefault();
    const itemName = link.getAttribute('data-item') || 'Product';
    selectProductForEnquiry(itemName);
  }

  // Handle CTA buttons
  const btn = e.target.closest('a');
  if (btn) {
    const text = btn.textContent.trim().toLowerCase();
    if (text.includes('request quote') || text.includes('get bulk quote')) {
      if (btn.getAttribute('href') === '#contact' || btn.getAttribute('href') === '/request-quote') {
        e.preventDefault();
        openQuoteModal('Bulk & Corporate Quotation');
      }
    } else if (text.includes('request catalogue') && btn.getAttribute('href') === '#contact') {
      e.preventDefault();
      selectProductForEnquiry('Product Catalogue & Price List');
    }
  }
});

// Mobile Navigation Toggle
const menuToggle = document.querySelector('.menu-toggle');
if (menuToggle) {
  menuToggle.addEventListener('click', function () {
    const menu = document.querySelector('.nav-links');
    const open = menu.classList.toggle('open');
    this.setAttribute('aria-expanded', String(open));
    this.textContent = open ? '✕' : '☰';
  });
}

document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    document.querySelector('.nav-links')?.classList.remove('open');
    document.querySelector('.menu-toggle')?.setAttribute('aria-expanded', 'false');
    const mt = document.querySelector('.menu-toggle');
    if (mt) mt.textContent = '☰';
  });
});

// Render Unified Footer
const footer = document.getElementById('site-footer');
if (footer) {
  footer.innerHTML = `
    <footer id="contact" class="footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <a class="logo" href="/" aria-label="KTECH Home Appliances">
              <img src="/assets/ktech-logo.webp" alt="KTECH Home Appliances" class="logo-img footer-logo-img" style="height:32px!important;max-height:32px!important;width:auto!important;object-fit:contain!important;" height="32">
            </a>
            <p>Quality kitchenware, home appliances and corporate gifting solutions for modern homes, retailers and businesses.</p>
            <div class="contact-details" style="margin-top:15px; font-size:13px; line-height:1.7;">
              <div class="contact-item"><strong>📞 Phone:</strong> <a href="tel:${SITE_CONFIG.phoneRaw}" style="color:var(--color-primary-dark);">${SITE_CONFIG.phone}</a></div>
              <div class="contact-item"><strong>💬 WhatsApp:</strong> <a href="${SITE_CONFIG.whatsappLink}" target="_blank" style="color:var(--color-primary); font-weight:700;">+91 77088 78603</a></div>
              <div class="contact-item"><strong>✉ Email:</strong> <a href="mailto:${SITE_CONFIG.email}" style="color:var(--color-primary-dark);">${SITE_CONFIG.email}</a></div>
              <div class="contact-item"><strong>📍 Hub:</strong> <span>${SITE_CONFIG.address}</span></div>
            </div>
          </div>
          <div>
            <h3>Quick Links</h3>
            <a href="/">Home</a>
            <a href="/about-us">About Us</a>
            <a href="/categories">Categories</a>
            <a href="/products">All Products</a>
            <a href="/bulk-solutions">Bulk Solutions</a>
            <a href="/our-stores">Our Stores</a>
            <a href="/blogs">Blogs & Guides</a>
            <a href="/contact">Contact Us</a>
          </div>
          <div>
            <h3>Product Categories</h3>
            <a href="/categories/cookware">Stainless Steel Cookware</a>
            <a href="/categories/pressure-cookers">Pressure Cookers</a>
            <a href="/categories/non-stick-cookware">Non-Stick Cookware</a>
            <a href="/categories/lpg-gas-stoves">LPG Gas Stoves</a>
            <a href="/categories/mixer-grinders">Mixer & Grinders</a>
            <a href="/categories/electronic-appliances">Electronic Appliances</a>
            <a href="/categories/dinner-sets">Dinner Sets & Dining</a>
            <a href="/categories/combo-gift-sets">Combo Gift Sets</a>
            <a href="/categories/corporate-gifting">Corporate Gifting</a>
          </div>
          <div>
            <h3>Customer Support</h3>
            <a href="/request-quote" onclick="event.preventDefault(); openQuoteModal('Catalogue Request');">Request Catalogue</a>
            <a href="/request-quote" onclick="event.preventDefault(); openQuoteModal('Bulk Wholesale Enquiry');">Bulk Wholesale Enquiry</a>
            <a href="/request-quote" onclick="event.preventDefault(); openQuoteModal('Corporate Gifting');">Corporate Gifting</a>
            <a href="${SITE_CONFIG.whatsappLink}" target="_blank">Direct WhatsApp Assistance</a>
            <h3 style="margin-top:20px;">Direct Dispatch</h3>
            <p style="font-size:12px; margin:0;">Direct factory pricing and rapid dispatch across South India and pan-India.</p>
          </div>
        </div>

        <div class="contact-panel">
          <h3>Request a Catalogue or Bulk Quote</h3>
          <p class="contact-note">Submit your requirements below or contact our sales division directly. We respond within 24 hours.</p>
          <form class="contact-form" id="contact-form">
            <input name="name" placeholder="Your Full Name *" required>
            <input name="phone" type="tel" placeholder="Phone / WhatsApp Number *" required>
            <input name="email" type="email" placeholder="Email Address">
            <input name="subject" placeholder="Product / Enquiry Type (e.g. Tri-Ply Cookware, Bulk Gifting)" required>
            <textarea name="message" placeholder="Tell us your requirements (product models, estimated quantities, delivery destination) *" required></textarea>
            <button class="btn btn-primary" id="submit-btn" type="submit">Send Enquiry ↗</button>
          </form>
          <div class="form-status" role="status"></div>
        </div>

        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} KTECH Home Appliances. All rights reserved.</span>
          <div style="display:flex; gap:16px;">
            <a href="/privacy-policy" style="color:inherit;">Privacy Policy</a>
            <a href="/terms-of-use" style="color:inherit;">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}

// Add Floating WhatsApp Widget
if (!document.querySelector('.floating-whatsapp')) {
  const wa = document.createElement('a');
  wa.href = `${SITE_CONFIG.whatsappLink}?text=${encodeURIComponent('Hello KTECH team, I am interested in your products and would like more details.')}`;
  wa.target = '_blank';
  wa.rel = 'noopener noreferrer';
  wa.className = 'floating-whatsapp';
  wa.setAttribute('aria-label', 'Chat with KTECH on WhatsApp');
  wa.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm.01 18.06c-1.49 0-2.94-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.03 8.03 0 0 1-1.24-4.29c0-4.47 3.64-8.11 8.12-8.11 2.17 0 4.21.85 5.74 2.38a8.08 8.08 0 0 1 2.38 5.73c-.01 4.47-3.65 8.05-8.21 8.05zm4.46-6.07c-.24-.12-1.44-.71-1.66-.79-.23-.08-.39-.12-.56.12-.17.24-.64.79-.79.95-.14.16-.29.18-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.14-.24-.02-.38.11-.49.11-.11.25-.29.37-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.56-1.35-.77-1.84-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.42.06-.64.3-.23.24-.87.85-.87 2.07s.89 2.4 1.01 2.57c.13.16 1.76 2.68 4.26 3.76.6.26 1.06.41 1.42.53.6.19 1.15.16 1.58.1.48-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.23-.16-.48-.28z"/>
    </svg>
    <span>WhatsApp Us</span>
  `;
  document.body.appendChild(wa);
}

// In-Page Contact Form Submission Handler (Connects to /api/enquiries)
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = e.currentTarget;
    const statusEl = document.querySelector('.form-status');
    const submitBtn = form.querySelector('#submit-btn');

    const formData = new FormData(form);
    const payload = {
      name: formData.get('name')?.toString().trim(),
      phone: formData.get('phone')?.toString().trim(),
      email: formData.get('email')?.toString().trim(),
      subject: formData.get('subject')?.toString().trim(),
      message: formData.get('message')?.toString().trim()
    };

    if (statusEl) {
      statusEl.className = 'form-status show loading';
      statusEl.textContent = 'Submitting your enquiry...';
    }
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
    }

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        if (statusEl) {
          statusEl.className = 'form-status show success';
          const refBadge = result.referenceId ? `<span class="ref-badge">Ref: ${result.referenceId}</span>` : '';
          const waUrl = result.whatsappUrl || `${SITE_CONFIG.whatsappLink}?text=${encodeURIComponent(`Hi KTech, I submitted an enquiry regarding: ${payload.subject}`)}`;

          statusEl.innerHTML = `
            <div>✓ Thank you, <strong>${payload.name}</strong>! Your enquiry has been received successfully. ${refBadge}</div>
            <div style="margin-top:6px; font-size:12px; color:#03685c;">Our team will get back to you via phone or email shortly.</div>
            <div>
              <a href="${waUrl}" target="_blank" class="whatsapp-chat-link">
                💬 Continue enquiry on WhatsApp ↗
              </a>
            </div>
          `;
        }
        form.reset();
      } else {
        throw new Error(result.error || 'Unable to submit enquiry.');
      }
    } catch (err) {
      console.warn('Backend API submission fallback:', err);
      if (statusEl) {
        statusEl.className = 'form-status show error';
        const mailBody = `Name: ${payload.name}\nPhone: ${payload.phone}\nEmail: ${payload.email}\nSubject: ${payload.subject}\nMessage:\n${payload.message}`;
        const mailUrl = `mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent('KTECH Enquiry: ' + payload.subject)}&body=${encodeURIComponent(mailBody)}`;
        const waUrl = `${SITE_CONFIG.whatsappLink}?text=${encodeURIComponent(`Hi KTech, my name is ${payload.name} (${payload.phone}). I would like to enquire about: ${payload.subject}. Message: ${payload.message}`)}`;

        statusEl.innerHTML = `
          <div>Enquiry prepared! Click below to send directly via Email or WhatsApp:</div>
          <div style="margin-top:8px; display:flex; gap:10px; flex-wrap:wrap;">
            <a href="${mailUrl}" class="btn btn-outline btn-small" style="background:#fff;">Send via Email App ↗</a>
            <a href="${waUrl}" target="_blank" class="whatsapp-chat-link" style="margin-top:0;">Send via WhatsApp ↗</a>
          </div>
        `;
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Enquiry ↗';
      }
    }
  });
}

// Check URL hash for modal trigger
if (window.location.hash === '#request-quote' || window.location.hash === '#quote') {
  setTimeout(() => openQuoteModal('Quick Quotation'), 300);
}

// Enhance Header when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', enhanceHeader);
} else {
  enhanceHeader();
}
