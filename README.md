# KTECH Website & Localhost Server (Port 5001)

Responsive website and backend server for **KTECH Home Appliances**.

## Localhost Server (Port 5001)

Start the local server at `http://localhost:5001`:

```bash
# Using Node.js
npm start
# or
node server.js
```

Then open your browser at:
👉 **`http://localhost:5001`**

---

## Server Endpoints (`server.js`)

- **`http://localhost:5001/`** — Homepage (`index.html`)
- **`http://localhost:5001/products`** — Products Page (`products.html`)
- **`http://localhost:5001/api/health`** — Server health check
- **`http://localhost:5001/api/products`** — Full category & products JSON API
- **`http://localhost:5001/api/config`** — Company details, phone, address, and social links
- **`POST /api/contact`** — Lead & quote enquiry submission (stores automatically in `data/enquiries.json`)
- **`GET /api/enquiries`** — View submitted customer enquiries

---

## Features Added

1. **Localhost HTTP Server**: Zero-dependency Node.js server configured on port `5001` with static file serving, MIME handling, and CORS.
2. **Interactive Lead & Enquiry Form**: Connects directly to `/api/contact` via AJAX, auto-generates reference IDs (e.g. `KT-...`), and saves leads to `data/enquiries.json`.
3. **Product Pre-filling**: Clicking "Enquire ↗" on any product, category card, or store automatically pre-selects that product in the contact form and smooth-scrolls to the form.
4. **Catalogue & Bulk Quote Triggers**: "Request Catalogue" and "Get Bulk Quote" buttons dynamically adjust the subject line and focus on user input.
5. **WhatsApp Integration**: Floating WhatsApp widget and direct chat fallback buttons with pre-filled enquiry text.
6. **Business Contact Details**: Real contact numbers (`+91 77088 78603`), sales email (`sales@ktechappliances.com`), and factory dispatch hub in Coimbatore, Tamil Nadu.
