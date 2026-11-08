/**
 * KTECH Home Appliances - Database Seed Script
 * Populates all categories, products, stores, blogs, and settings
 */

const db = require('./db');

function seedDatabase() {
  console.log('Seeding KTECH database...');

  // 1. Settings
  const settings = [
    ['company_name', 'KTECH Home Appliances'],
    ['tagline', 'Quality Kitchen Solutions for Everyday Living'],
    ['phone', '+91 77088 78603'],
    ['phone_raw', '917708878603'],
    ['whatsapp', '+91 77088 78603'],
    ['whatsapp_link', 'https://wa.me/917708878603'],
    ['email', 'sales@ktechappliances.com'],
    ['address', 'KTech Factory & Direct Dispatch Hub, Coimbatore, Tamil Nadu 641001'],
    ['experience_years', '21+'],
    ['products_count', '500+'],
    ['happy_customers', '10,000+'],
    ['retail_partners', '500+'],
    ['corporate_clients', '250+']
  ];

  const insertSetting = db.prepare(`
    INSERT INTO settings (key, value, updated_at)
    VALUES (?, ?, datetime('now'))
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')
  `);

  settings.forEach(([k, v]) => insertSetting.run(k, v));

  // 2. Categories
  const categories = [
    {
      id: 'cookware',
      name: 'Cookware',
      slug: 'cookware',
      description: 'Tri-Ply and heavy gauge food-grade stainless steel cookware designed for uniform heat distribution and lasting durability.',
      image: '/images/10-cookware.jpg',
      featured: 1,
      order_num: 1
    },
    {
      id: 'nonstick',
      name: 'Non-Stick Cookware',
      slug: 'non-stick-cookware',
      description: 'Multi-layer granite and scratch-resistant non-stick fry pans, kadai, and dosa tawas with ergonomic cool-touch handles.',
      image: '/images/02-non-stick-cookware.jpg',
      featured: 1,
      order_num: 2
    },
    {
      id: 'gas-stoves',
      name: 'LPG Gas Stoves',
      slug: 'lpg-gas-stoves',
      description: 'High-thermal efficiency 2, 3 and 4 burner gas stoves with shatterproof toughened glass tops and heavy brass burners.',
      image: '/images/03-lpg-gas-stove.jpg',
      featured: 1,
      order_num: 3
    },
    {
      id: 'mixer-grinders',
      name: 'Mixer & Grinders',
      slug: 'mixer-grinders',
      description: 'Powerful 750W to 1000W 100% copper motor mixer grinders with heavy-gauge stainless steel flow-breaker jars.',
      image: '/images/01-mixer-grinder.jpg',
      featured: 1,
      order_num: 4
    },
    {
      id: 'appliances',
      name: 'Electronic Appliances',
      slug: 'electronic-appliances',
      description: 'Energy-saving electric kettles, induction cooktops, food processors and modern electrical kitchen aids.',
      image: '/images/06-electronic-appliance.jpg',
      featured: 1,
      order_num: 5
    },
    {
      id: 'dining-serving',
      name: 'Dining & Serving',
      slug: 'dining-serving',
      description: 'Insulated casseroles, hotpot serving containers, tableware, and food warmers for elegant home dining.',
      image: '/images/11-dining-serving.jpg',
      featured: 1,
      order_num: 6
    },
    {
      id: 'dinner-sets',
      name: 'Dinner Sets',
      slug: 'dinner-sets',
      description: 'Elegant stainless steel family dinner sets, serving bowls, drinkware, and dining tableware sets.',
      image: '/images/04-dinner-set.jpg',
      featured: 1,
      order_num: 7
    },
    {
      id: 'combo-gifts',
      name: 'Combo Gift Sets',
      slug: 'combo-gift-sets',
      description: 'Curated home and kitchenware combination sets packed in premium gift-ready presentation boxes.',
      image: '/images/05-combo-gift-set.jpg',
      featured: 1,
      order_num: 8
    },
    {
      id: 'pressure-cookers',
      name: 'Pressure Cookers',
      slug: 'pressure-cookers',
      description: 'Precision safety engineered inner and outer lid pressure cookers in heavy-gauge stainless steel and hard anodized aluminium.',
      image: '/images/07-pressure-cooker.jpg',
      featured: 1,
      order_num: 9
    },
    {
      id: 'corporate-gifting',
      name: 'Corporate & Bulk Gifting',
      slug: 'corporate-gifting',
      description: 'Custom-branded executive kitchenware and appliance gift boxes for businesses, festivals, and institutions.',
      image: '/images/08-corporate-gifting-boxes.jpg',
      featured: 1,
      order_num: 10
    },
    {
      id: 'festival-gifting',
      name: 'Festival Celebration Sets',
      slug: 'festival-gifting',
      description: 'High-demand celebration combo packs for Diwali, Pongal, weddings, and institutional employee gifting.',
      image: '/images/09-festival-gifting-mixer.jpg',
      featured: 1,
      order_num: 11
    }
  ];

  const insertCategory = db.prepare(`
    INSERT INTO categories (id, name, slug, description, image, featured, order_num)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      slug = excluded.slug,
      description = excluded.description,
      image = excluded.image,
      featured = excluded.featured,
      order_num = excluded.order_num
  `);

  categories.forEach(c => insertCategory.run(c.id, c.name, c.slug, c.description, c.image, c.featured, c.order_num));

  // 3. Products
  const products = [
    {
      id: 'prod-01',
      name: 'KTECH 750W Heavy Duty Mixer Grinder with 3 SS Jars',
      slug: 'ktech-750w-heavy-duty-mixer-grinder',
      sku: 'KT-MG-750',
      category_id: 'mixer-grinders',
      short_description: 'Pure 100% copper motor mixer grinder with 3 heavy stainless steel jars for wet, dry and chutney grinding.',
      full_description: 'Designed for South Indian cooking and heavy-duty daily tasks, the KTECH 750W Mixer Grinder features an overload protector, air-channel cooling technology, and precision-engineered razor-sharp stainless steel blades.',
      image: '/images/01-mixer-grinder.jpg',
      gallery: JSON.stringify(['/images/01-mixer-grinder.jpg', '/images/09-festival-gifting-mixer.jpg']),
      specifications: JSON.stringify({
        'Motor Power': '750 Watts Pure Copper Motor',
        'Speed Settings': '3 Speed Control with Incher Pulse Function',
        'Jars Included': '3 SS Jars (1.5L Wet, 1.0L Dry, 0.4L Chutney)',
        'Blade Material': 'Food Grade Stainless Steel 304',
        'Safety': 'Overload Protector with Reset Button',
        'Warranty': '2 Years Manufacturer Warranty'
      }),
      features: JSON.stringify([
        '100% Copper Heavy Duty Motor',
        'Air Channel Cooling Technology',
        'Leakproof Flow-Breaker Jars',
        'Anti-Skid Vacuum Rubber Feet'
      ]),
      variants: JSON.stringify(['Teal & White', 'Gloss Black', 'Silver Grey']),
      featured: 1
    },
    {
      id: 'prod-02',
      name: 'KTECH 3-Piece Granite Finish Non-Stick Cookware Set',
      slug: 'ktech-3-piece-granite-non-stick-cookware-set',
      sku: 'KT-NS-3PC',
      category_id: 'nonstick',
      short_description: 'Tough 5-layer scratch resistant granite non-stick set including Kadai with glass lid, Dosa Tawa, and Fry Pan.',
      full_description: 'Cook delicious meals with minimal oil. The KTECH Granite Cookware collection features an induction and gas compatible spiral base, heavy-gauge virgin aluminium body, and soft-touch heat-resistant bakelite handles.',
      image: '/images/02-non-stick-cookware.jpg',
      gallery: JSON.stringify(['/images/02-non-stick-cookware.jpg', '/images/10-cookware.jpg']),
      specifications: JSON.stringify({
        'Coating': '5-Layer German Greblon Non-Stick Coating',
        'Thickness': '3.2 mm Heavy Gauge Body',
        'Base': 'Induction & Gas Stove Compatible',
        'Items Included': '24cm Kadai + Glass Lid, 28cm Dosa Tawa, 24cm Fry Pan',
        'PFOA Free': '100% PFOA & Heavy Metal Free',
        'Warranty': '1 Year Warranty'
      }),
      features: JSON.stringify([
        '5-Layer Scratch Resistant Coating',
        'Requires 80% Less Cooking Oil',
        'Ergonomic Soft-Touch Handles',
        'Induction & Gas Friendly Base'
      ]),
      variants: JSON.stringify(['Granite Grey', 'Granite Red', 'Granite Green']),
      featured: 1
    },
    {
      id: 'prod-03',
      name: 'KTECH 3-Burner Toughened Glass Top LPG Gas Stove',
      slug: 'ktech-3-burner-toughened-glass-lpg-gas-stove',
      sku: 'KT-GS-3B',
      category_id: 'gas-stoves',
      short_description: '7mm shatterproof toughened black glass cooktop with high thermal efficiency forged brass burners.',
      full_description: 'Engineered for Indian homes and modern kitchen countertops. Features spill-proof stainless steel drip trays, high-precision brass gas valves for smooth flame regulation, and sturdy powder-coated pan supports.',
      image: '/images/03-lpg-gas-stove.jpg',
      gallery: JSON.stringify(['/images/03-lpg-gas-stove.jpg']),
      specifications: JSON.stringify({
        'Burners': '3 Tri-Pin Forged Brass Burners (1 Small, 1 Medium, 1 Jumbo)',
        'Top Material': '7mm Thermal Shatterproof Toughened Glass',
        'Ignition': 'Manual Rotary High-Precision Valve',
        'Body': 'Rust-Resistant Powder Coated Base Frame',
        'Pan Support': 'Heavy-Gauge Euro-Coated Pan Supports',
        'Certification': 'ISI Certified for LPG'
      }),
      features: JSON.stringify([
        'High Thermal Efficiency Brass Burners',
        'Easy-Clean Shatterproof Glass Top',
        '360° Revolving Gas Inlet Nozzle',
        'Sturdy Non-Slip Rubber Base'
      ]),
      variants: JSON.stringify(['Black Glass 3-Burner', 'Black Glass 2-Burner', 'Black Glass 4-Burner']),
      featured: 1
    },
    {
      id: 'prod-04',
      name: 'KTECH 32-Piece Stainless Steel Royal Family Dinner Set',
      slug: 'ktech-32-piece-stainless-steel-royal-dinner-set',
      sku: 'KT-DS-32',
      category_id: 'dinner-sets',
      short_description: 'Complete 32-piece food-grade mirror polish stainless steel dinner service set for 6 persons.',
      full_description: 'Crafted from premium 200/304 series heavy-gauge stainless steel with high mirror luster. Resistant to corrosion and dents, perfect for everyday family dining as well as wedding and housewarming gifts.',
      image: '/images/04-dinner-set.jpg',
      gallery: JSON.stringify(['/images/04-dinner-set.jpg']),
      specifications: JSON.stringify({
        'Material': 'Food Grade Heavy Gauge Stainless Steel',
        'Finish': 'Ultra Mirror Polish',
        'Set Count': '32 Pieces (6 Dinner Plates, 6 Side Plates, 12 Bowls, 6 Tumblers, 2 Serving Spoons)',
        'Dishwasher Safe': '100% Dishwasher Safe',
        'Packaging': 'Deluxe Printed Gift Box'
      }),
      features: JSON.stringify([
        'Rust-Proof Food Grade Steel',
        'Smooth Rolled Edges for Comfort',
        'Ideal for Gifting & Everyday Meals',
        'Stackable Space-Saving Design'
      ]),
      variants: JSON.stringify(['32-Piece Set', '24-Piece Set', '51-Piece Grand Set']),
      featured: 1
    },
    {
      id: 'prod-05',
      name: 'KTECH 5-Piece Kitchen Combo Gift Set in Presentation Box',
      slug: 'ktech-5-piece-kitchen-combo-gift-set',
      sku: 'KT-CG-5PC',
      category_id: 'combo-gifts',
      short_description: 'Curated combination of insulated casserole, non-stick tawa, saucepan, and kitchen essentials.',
      full_description: 'An all-in-one kitchen starter combo designed for celebrations, wedding gifts, and promotional gifting. Includes essential daily cookware and insulated dining ware made with top-tier materials.',
      image: '/images/05-combo-gift-set.jpg',
      gallery: JSON.stringify(['/images/05-combo-gift-set.jpg']),
      specifications: JSON.stringify({
        'Set Contents': '1x Insulated Hotpack, 1x Non-Stick Tawa, 1x SS Saucepan, 2x Serving Accessories',
        'Material Combination': 'Stainless Steel & Non-Stick Aluminium',
        'Packaging': 'High-Durability Laminated Gift Box',
        'Customization': 'Corporate Branding & Custom Sleeves Available for Bulk Orders'
      }),
      features: JSON.stringify([
        'Ready-to-Gift Luxury Packaging',
        'Practical Everyday Kitchen Mix',
        'Lightweight Yet Sturdy Build',
        'Direct Factory Wholesale Pricing'
      ]),
      variants: JSON.stringify(['Standard 5-Piece', 'Deluxe 7-Piece']),
      featured: 1
    },
    {
      id: 'prod-06',
      name: 'KTECH 2000W Preset Induction Cooktop & 1.8L Electric Kettle',
      slug: 'ktech-2000w-induction-cooktop-electric-kettle',
      sku: 'KT-EA-2000',
      category_id: 'appliances',
      short_description: 'High-speed electromagnetic induction cooktop with Indian preset menus and rapid-boil cordless electric kettle.',
      full_description: 'Save cooking gas and cut boiling time in half with this energy-efficient duo. The induction cooktop features touch control with auto-shutoff safety, paired with a food-grade 1.8L stainless steel auto-cut electric kettle.',
      image: '/images/06-electronic-appliance.jpg',
      gallery: JSON.stringify(['/images/06-electronic-appliance.jpg']),
      specifications: JSON.stringify({
        'Induction Power': '2000 Watts Fast Heating',
        'Presets': '8 Indian Cooking Menu Presets (Dosa, Roti, Milk, Curry, etc.)',
        'Kettle Capacity': '1.8 Litres SS 304 Interior',
        'Safety': 'Voltage Fluctuation Protection & Dry-Boil Auto Cutoff',
        'Cord Length': '1.2 Metres Heavy Duty Copper Cord'
      }),
      features: JSON.stringify([
        'Dual High-Utility Appliance Combo',
        'Fast Heating with 90% Thermal Transfer',
        'Cool-Touch Exterior on Kettle',
        'Child Lock & Timer on Induction'
      ]),
      variants: JSON.stringify(['Induction + Kettle Set', 'Induction Solo', 'Kettle Solo']),
      featured: 1
    },
    {
      id: 'prod-07',
      name: 'KTECH 5L Tri-Ply Stainless Steel Pressure Cooker (Inner Lid)',
      slug: 'ktech-5l-tri-ply-stainless-steel-pressure-cooker',
      sku: 'KT-PC-SS5',
      category_id: 'pressure-cookers',
      short_description: '3-layer clad stainless steel and aluminium core pressure cooker for 20% faster and safe cooking.',
      full_description: 'Crafted with a sandwich of SS 304 interior, aluminium core, and magnetic SS 430 exterior base. Eliminates hot spots, retains vitamins, and handles pressure with a precision weight valve and gasket release system.',
      image: '/images/07-pressure-cooker.jpg',
      gallery: JSON.stringify(['/images/07-pressure-cooker.jpg', '/images/10-cookware.jpg']),
      specifications: JSON.stringify({
        'Capacity': '5.0 Litres (Available in 2L, 3L, 5L, 7.5L)',
        'Construction': 'Tri-Ply Base to Rim (SS 304 + Alu Core + SS 430)',
        'Lid Type': 'Inner Lid Safety Locking System',
        'Base': 'Induction, Gas, Ceramic & Electric Cooktop Compatible',
        'Safety Devices': 'Lead-Free Safety Valve, Precision Vent Weight, Gasket Release'
      }),
      features: JSON.stringify([
        'Tri-Ply Base to Rim Uniform Heating',
        'Zero Food Burning / Sticking',
        'Heavy Gauge Ergonomic Stay-Cool Handles',
        '5 Years Manufacturer Replacement Warranty'
      ]),
      variants: JSON.stringify(['3 Litre', '5 Litre', '7.5 Litre']),
      featured: 1
    },
    {
      id: 'prod-08',
      name: 'KTECH Executive Corporate Gifting Box with Custom Insignia',
      slug: 'ktech-executive-corporate-gifting-box',
      sku: 'KT-BG-CORP',
      category_id: 'corporate-gifting',
      short_description: 'Premium curated executive kitchenware boxes designed for employee rewards, clients, and VIP gifting.',
      full_description: 'From Diwali corporate hampers to festive annual bonuses, KTECH supplies ready-to-dispatch gift sets directly from our Coimbatore hub. Custom branding, corporate logo engraving, and special packaging options available for orders of 50+ units.',
      image: '/images/08-corporate-gifting-boxes.jpg',
      gallery: JSON.stringify(['/images/08-corporate-gifting-boxes.jpg', '/images/05-combo-gift-set.jpg']),
      specifications: JSON.stringify({
        'Min Order Quantity': '50 Units for Custom Branding',
        'Customization': 'Laser Logo Engraving, Custom Outer Sleeve, Greeting Card',
        'Dispatch Lead Time': '3-7 Business Days across South India',
        'Packaging': 'Rigid Magnetic Flip Box with Velvet / Satin Insert',
        'GST Invoice': 'B2B GST Compliant Invoicing Provided'
      }),
      features: JSON.stringify([
        'Factory Direct Volume Pricing',
        'Dedicated Corporate Account Manager',
        'PAN India Safe Courier Dispatch',
        'Highest Quality Food Grade Standards'
      ]),
      variants: JSON.stringify(['Gold Tier Hamper', 'Silver Tier Hamper', 'Custom Configuration']),
      featured: 1
    },
    {
      id: 'prod-09',
      name: 'KTECH Festive Celebration Kitchen Gift Set with Mixer & Pan',
      slug: 'ktech-festive-celebration-kitchen-gift-set',
      sku: 'KT-FG-FEST',
      category_id: 'festival-gifting',
      short_description: 'Complete festival gift bundle featuring copper motor mixer grinder and multi-purpose non-stick pan.',
      full_description: 'Celebrate Pongal, Diwali, and milestone celebrations with a practical, high-value gift that every household cherishes. Packed in festive vibrant graphics with tamper-evident sealing.',
      image: '/images/09-festival-gifting-mixer.jpg',
      gallery: JSON.stringify(['/images/09-festival-gifting-mixer.jpg', '/images/01-mixer-grinder.jpg']),
      specifications: JSON.stringify({
        'Bundle Contents': '1x KTECH 500W/750W Mixer, 1x Granite Tawa, 1x Recipe Book',
        'Packaging': 'Celebration Box with Handle',
        'Bulk Available': 'Volume supply for cooperatives, retail chains and associations',
        'Warranty': 'Individual Product Warranty Cards Included'
      }),
      features: JSON.stringify([
        'High Perceived Gift Value',
        'Long Lasting Household Utility',
        'Factory Direct Price Advantage',
        'Quick Turnaround on Bulk Dispatches'
      ]),
      variants: JSON.stringify(['Festival Standard', 'Festival Premium']),
      featured: 1
    },
    {
      id: 'prod-10',
      name: 'KTECH Professional 5-Piece Tri-Ply Stainless Steel Cookware Collection',
      slug: 'ktech-professional-tri-ply-stainless-steel-cookware-collection',
      sku: 'KT-CW-TRIPLY',
      category_id: 'cookware',
      short_description: 'Chef-grade 3-layer stainless steel cookware ensemble: Kadai, Saucepan, Casserole, Fry Pan, and Steam Basket.',
      full_description: 'The pinnacle of KTECH cookware craftsmanship. Whole-body 3-ply construction ensures zero hotspots, uniform heat conduction, and a lifelong mirror stainless finish. Induction compatible with cast stainless stay-cool riveted handles.',
      image: '/images/10-cookware.jpg',
      gallery: JSON.stringify(['/images/10-cookware.jpg', '/images/07-pressure-cooker.jpg', '/images/02-non-stick-cookware.jpg']),
      specifications: JSON.stringify({
        'Construction': '3-Ply Full Body (SS 304 Food Grade + Heavy Aluminium Core + SS 430 Magnetic Base)',
        'Handles': 'Heavy Cast Stainless Steel Riveted Handles',
        'Lids': 'Shatter-Resistant Tempered Glass with Steam Vent',
        'Compatibility': 'Induction, Gas, Radiant, Oven Safe up to 250°C',
        'Pieces': '5 Essential Cookware Vessels with 3 Matching Lids'
      }),
      features: JSON.stringify([
        'Even Heat Distribution Across Bottom & Sides',
        'Zero Hot Spots & Minimal Oil Requirement',
        'Dishwasher Safe & Acid/Salt Corrosion Proof',
        '10 Years Comprehensive Manufacturer Warranty'
      ]),
      variants: JSON.stringify(['5-Piece Master Set', '3-Piece Essential Set']),
      featured: 1
    },
    {
      id: 'prod-11',
      name: 'KTECH Insulated Stainless Steel Casserole & Hotpot Serving Set',
      slug: 'ktech-insulated-casserole-hotpot-serving-set',
      sku: 'KT-DS-HOTPOT',
      category_id: 'dining-serving',
      short_description: 'Double-wall PUF insulated food warmer casserole with twist-lock lid keeps rotis, rice, and curries hot for 6+ hours.',
      full_description: 'Designed for gracious everyday serving and family feasts. High-grade mirror-polished stainless steel interior is completely non-reactive and odorless, while the stylish ribbed exterior brings elegance to any dining table.',
      image: '/images/11-dining-serving.jpg',
      gallery: JSON.stringify(['/images/11-dining-serving.jpg', '/images/04-dinner-set.jpg']),
      specifications: JSON.stringify({
        'Capacity': '2500 ml & 1500 ml Double Pack',
        'Insulation': 'High-Density Polyurethane Foam (PUF) Thermal Barrier',
        'Interior': 'Food Grade SS 304 Stainless Steel Inner Lining',
        'Thermal Retention': 'Keeps Food Hot or Cold for up to 6 Hours',
        'Locking': 'Ergonomic Twist & Lock Airtight Lid with Steam Escape Guard'
      }),
      features: JSON.stringify([
        'Dual-Tone Ribbed Body for Grip & Style',
        'Airtight Twist Lock Lid Prevents Spills',
        '100% Odor-Free Food Grade Stainless Core',
        'Preserves Freshness, Taste and Aroma'
      ]),
      variants: JSON.stringify(['Pastel Teal 2500ml', 'Pastel Teal 1500ml', 'Twin Pack (1500ml + 2500ml)']),
      featured: 1
    }
  ];

  const insertProduct = db.prepare(`
    INSERT INTO products (
      id, name, slug, sku, category_id, short_description, full_description,
      image, gallery, specifications, features, variants, featured, status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published')
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      slug = excluded.slug,
      sku = excluded.sku,
      category_id = excluded.category_id,
      short_description = excluded.short_description,
      full_description = excluded.full_description,
      image = excluded.image,
      gallery = excluded.gallery,
      specifications = excluded.specifications,
      features = excluded.features,
      variants = excluded.variants,
      featured = excluded.featured
  `);

  products.forEach(p => {
    insertProduct.run(
      p.id, p.name, p.slug, p.sku, p.category_id, p.short_description, p.full_description,
      p.image, p.gallery, p.specifications, p.features, p.variants, p.featured
    );
  });

  // 4. Retail Stores
  const stores = [
    {
      id: 'store-theni',
      name: 'KTECH – Theni New Home Appliances',
      slug: 'theni-new-home',
      city: 'Theni',
      address: 'No. 42, Madurai Road, Near Central Bus Stand, Theni, Tamil Nadu 625531',
      phone: '+91 77088 78603',
      email: 'theni@ktechappliances.com',
      timings: 'Mon - Sun: 9:30 AM – 9:00 PM',
      map_link: 'https://maps.google.com/?q=Theni+Tamil+Nadu',
      image: 'assets/storefront-facade.png',
      is_hub: 0,
      order_num: 1
    },
    {
      id: 'store-paradise',
      name: 'KTECH – Paradise Appliances',
      slug: 'paradise-appliances',
      city: 'Coimbatore',
      address: 'Shop 18, Cross Cut Road, Gandhipuram, Coimbatore, Tamil Nadu 641012',
      phone: '+91 77088 78603',
      email: 'coimbatore@ktechappliances.com',
      timings: 'Mon - Sun: 10:00 AM – 9:30 PM',
      map_link: 'https://maps.google.com/?q=Gandhipuram+Coimbatore',
      image: 'assets/storefront-facade.png',
      is_hub: 0,
      order_num: 2
    },
    {
      id: 'store-kps',
      name: 'KTECH – KPS Home Appliances',
      slug: 'kps-home-appliances',
      city: 'Madurai',
      address: '104, West Veli Street, Near Railway Junction, Madurai, Tamil Nadu 625001',
      phone: '+91 77088 78603',
      email: 'madurai@ktechappliances.com',
      timings: 'Mon - Sun: 9:30 AM – 9:00 PM',
      map_link: 'https://maps.google.com/?q=West+Veli+Street+Madurai',
      image: 'assets/storefront-facade.png',
      is_hub: 0,
      order_num: 3
    },
    {
      id: 'store-coimbatore-hub',
      name: 'KTECH – Coimbatore Factory & Direct Dispatch Hub',
      slug: 'coimbatore-hub',
      city: 'Coimbatore',
      address: 'KTech Manufacturing & Central Dispatch Division, Sathy Road, Coimbatore, Tamil Nadu 641035',
      phone: '+91 77088 78603',
      email: 'sales@ktechappliances.com',
      timings: 'Mon - Sat: 9:00 AM – 7:00 PM (Direct Wholesale & Dispatch)',
      map_link: 'https://maps.google.com/?q=Sathy+Road+Coimbatore',
      image: 'assets/storefront-facade.png',
      is_hub: 1,
      order_num: 4
    }
  ];

  const insertStore = db.prepare(`
    INSERT INTO stores (id, name, slug, city, address, phone, email, timings, map_link, image, is_hub, order_num)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      slug = excluded.slug,
      city = excluded.city,
      address = excluded.address,
      phone = excluded.phone,
      email = excluded.email,
      timings = excluded.timings,
      map_link = excluded.map_link,
      image = excluded.image,
      is_hub = excluded.is_hub,
      order_num = excluded.order_num
  `);

  stores.forEach(s => insertStore.run(s.id, s.name, s.slug, s.city, s.address, s.phone, s.email, s.timings, s.map_link, s.image, s.is_hub, s.order_num));

  // 5. Blogs
  const blogs = [
    {
      id: 'blog-01',
      title: 'How to Choose the Right Pressure Cooker for Your Home',
      slug: 'how-to-choose-the-right-pressure-cooker-for-your-home',
      category: 'BUYING GUIDE',
      excerpt: 'Everything you need to know about Tri-Ply vs Hard Anodized pressure cookers, inner vs outer lids, and safety features for daily family cooking.',
      content: 'Pressure cookers are the workhorses of every Indian kitchen. When choosing between stainless steel and aluminium, consider that Tri-Ply stainless steel provides uniform base heating without hotspot burning while resisting food acids. Inner lid cookers offer an additional layer of mechanical safety under pressure.',
      image: '/images/07-pressure-cooker.jpg',
      author: 'KTECH Kitchen Specialists',
      read_time: '4 min read'
    },
    {
      id: 'blog-02',
      title: 'Best Kitchenware Gift Ideas for Corporate & Bulk Gifting',
      slug: 'best-kitchenware-gift-ideas-for-corporate-and-bulk-gifting',
      category: 'GIFTING IDEAS',
      excerpt: 'Discover why high-utility kitchen appliances, Tri-ply pans, and insulated casseroles leave a permanent positive impression with employees and business partners.',
      content: 'Unlike perishable food boxes or generic diaries, premium cookware and kitchen appliances are used daily for decades. Gifting high-grade stainless steel items signals enduring appreciation and utility value for clients and teams.',
      image: '/images/08-corporate-gifting-boxes.jpg',
      author: 'KTECH Corporate Gifting Division',
      read_time: '5 min read'
    },
    {
      id: 'blog-03',
      title: 'Easy Care Tips to Keep Your LPG Gas Stove Long Lasting',
      slug: 'easy-care-tips-to-keep-your-lpg-gas-stove-long-lasting',
      category: 'PRODUCT GUIDE',
      excerpt: 'Simple maintenance steps, burner cleaning methods, and glass care habits to maintain peak thermal efficiency and ensure kitchen safety.',
      content: 'Routine cleaning of brass burner ports ensures a clean blue flame and saves up to 15% LPG gas. Always allow toughened glass stovetops to cool to room temperature before wiping with a damp microfiber cloth to avoid thermal stress.',
      image: '/images/03-lpg-gas-stove.jpg',
      author: 'KTECH Technical Service Team',
      read_time: '3 min read'
    }
  ];

  const insertBlog = db.prepare(`
    INSERT INTO blogs (id, title, slug, category, excerpt, content, image, author, read_time, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'published')
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      slug = excluded.slug,
      category = excluded.category,
      excerpt = excluded.excerpt,
      content = excluded.content,
      image = excluded.image,
      author = excluded.author,
      read_time = excluded.read_time
  `);

  blogs.forEach(b => insertBlog.run(b.id, b.title, b.slug, b.category, b.excerpt, b.content, b.image, b.author, b.read_time));

  console.log(`Database seeded successfully!`);
  console.log(`- Categories: ${categories.length}`);
  console.log(`- Products:   ${products.length}`);
  console.log(`- Stores:     ${stores.length}`);
  console.log(`- Blogs:      ${blogs.length}`);
  console.log(`- Settings:   ${settings.length}`);
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;

