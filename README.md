# 🦚 Rajvilas Heritage Palace & Resort — Full-Stack Hotel Management System

> **Udaipur, Rajasthan • GSTIN: `08AAACL7891F1Z2`**  
> An enterprise-grade Indian heritage luxury property management system (PMS) built with React 19, Tailwind CSS, Express, and MongoDB, fortified with a zero-install native cryptography security suite.

---

## 🌟 Key Features

### 1. 🦚 Indian Heritage Luxury Operations
- **Indian Pricing & GST Invoicing:** Real-time Indian Rupee (`₹ INR`) calculations with statutory 12% GST breakdown (6% CGST + 6% SGST).
- **UIDAI Privacy Compliance:** Automatic masking of guest government IDs (Aadhaar `XXXX-XXXX-1234`).
- **GSTR-1 Tax Export:** 1-click official accountant GSTR-1 CSV report export.

### 2. 📱 Dynamic Indian BHIM UPI QR Code & NPCI Settlement
- **VPA:** `rajvilas.palace@icici`
- Generates standard NPCI intent URI (`upi://pay?pa=...`) with dynamic QR code for instant guest payments via Google Pay, PhonePe, Paytm, or BHIM.
- Real-time NPCI settlement simulation generating 12-digit UTR reference numbers (`UPI/2026/...`).

### 3. 👑 Guest CRM & "Maharaja Club" VIP Directory
- Tracks repeat guest history, lifetime spend in ₹ INR, stay nights, and cultural/satvik dietary preferences (e.g. Jain, Gujarati, Navratri satvik).
- Categorizes guests into tiers: **Maharaja Club**, **Gold Royal**, and **Silver Heritage**.

### 4. 🎟️ Royal Promo Codes & Dynamic Seasonal Discounts
- Active seasonal privilege vouchers: `ROYAL10` (10% off), `PALACE2026` (₹5,000 off), `WEDDINGVIP` (₹15,000 off), and `MAHARAJA20` (20% off).
- Real-time recalculation of gross tariff, promo savings, and 12% GST.

### 5. 💬 Palace WhatsApp Stay Confirmation Pass
- Pre-filled royal palace welcome passes formatted with authentic Rajasthani hospitality (*"Namaste... Padharo Mhare Desh! 🙏🦚"*).
- Instant 1-click clipboard copy and direct WhatsApp Web dispatch.

### 6. 🚣 Curated Palace Experiences Desk
- Lake Pichola Sunset Solar Boat Charter, Mewari Royal Gala Banquet, Jiva Ayurvedic Spa, and 1948 Rolls-Royce Vintage Chauffeur.
- Bookings automatically post to the in-house guest's room folio with GST.

### 7. 📱 Guest Digital Keycard & Self Check-In Pass
- Apple/Google Wallet-style digital room pass with NFC/RFID door tap unlock simulation.
- Wi-Fi credentials (`Rajvilas_Palace_5G`) and direct WhatsApp Butler speed-dial.

### 8. 🌙 Automated Midnight Night Audit & GM Operating Report
- 4-step automated audit sequence posting midnight tariffs, reconciling ledger folios, and sealing with a cryptographic audit hash (`AUDIT-XXXXXX`).
- Generates a printable General Manager's Daily Revenue Summary with **Occupancy %**, **ADR**, and **RevPAR**.

---

## 🔒 Zero-Install Native Security Architecture

Implemented with 100% native Node.js `node:crypto` with zero third-party npm packages:
- **Salted Scrypt Hashing:** 16-byte cryptographically random salt per password.
- **Timing-Attack Resistance:** Native `crypto.timingSafeEqual` prevents side-channel analysis.
- **Tamper-Proof Session Tokens:** HMAC-SHA256 signed session tokens (`payload.signature`).
- **Server-Side RBAC Guards:** Native Express middleware blocks unauthorized roles at API boundaries.
- **In-Memory Rate Limiter:** Locks IP for 15 minutes after 5 consecutive failed login attempts.

---

## 📐 Architecture & Reverse Engineering Specifications

Full UML diagrams (Actor Hierarchy, Use Case Diagrams, Class Diagrams, and Layered Architecture) are available in:
📁 **[`docs/ARCHITECTURE_UML.md`](./docs/ARCHITECTURE_UML.md)**

---

## 🔑 Demo Staff Logins

| Role | Username | Password | Staff Member | Access Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | Vikram Rathore (GM) | Full access across all modules & database reset |
| **Receptionist** | `reception` | `reception123` | Sneha Kulkarni (Front Office) | Timeline, Bookings, Guest CRM, Billing, Experiences |
| **Housekeeping** | `housekeeping` | `clean123` | Ramesh Yadav (Exec. Housekeeper) | Confined strictly to Room Turnover Matrix & Stock |

---

## 🚀 Getting Started

### 1. Clone the repository:
```bash
git clone https://github.com/Shreya22-hub/rajvilas-hotel-management.git
cd rajvilas-hotel-management
```

### 2. Install dependencies:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Run the development servers:
```bash
# Terminal 1: Start Backend (Port 5000)
cd server
node server.js

# Terminal 2: Start Frontend (Port 5173)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.
