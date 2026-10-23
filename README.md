# Nepali Font Converter & Utility Suite

A modern, fast, and feature-rich web application built with **React**, **TypeScript**, and **Tailwind CSS**. It provides comprehensive Nepali text conversion utilities, a live Hamro Patro calendar widget, a full Bikram Sambat (B.S.) to Gregorian (A.D.) date converter, font download management, and a secure administration dashboard.

---

## 🌟 Key Features

### 1. ⚡ Preeti ↔ Unicode Converters
- **Preeti to Unicode**: Real-time, instant conversion from legacy Preeti font text to standard Unicode Nepali script.
- **Unicode to Preeti**: Reliable reverse conversion for legacy document typing, printing, and desktop publishing.
- **Tools**: One-click copy, text clear, character/word counters, and `.txt` file export.
- **100% Client-Side Privacy**: All conversions happen locally in your browser. No private text is ever uploaded to a server.

### 2. 📅 हाम्रो पात्रो (Live Hamro Patro Calendar)
- Embedded official Hamro Patro modern calendar widget with auto-fitting responsive dimensions.
- Live Nepal Standard Time (NPT) digital clock with date and weekday.
- Daily Tithi, auspicious events, and upcoming festivals (चाडपर्वहरू).

### 3. 📆 Nepali Date Converter (B.S. ↔ A.D.)
- **Bi-directional Conversion**: Convert between Bikram Sambat (2000–2090 B.S.) and Gregorian (1944–2033 A.D.).
- **Convenient Dropdowns**: Effortless year, month, and day selection via intuitive dropdown menus.
- **Date Difference Calculator**: Calculate the exact duration (years, months, and days) between two Nepali or English dates.
- **Age Calculator**: Discover exact age, total days lived, weekday of birth, and countdown to your next birthday.

### 4. 🔤 Nepali Font Manager & Downloads
- Browse and download popular Nepali fonts (Kantipur, Sagarmatha, Himali, Mangal, etc.).
- Direct single font download or batch `.zip` bundle downloads.

### 5. 🛡️ Secure Admin Panel
- **Hero & Content Management**: Update homepage slogans, subtitles, badges, and company details.
- **Dynamic Logo Upload**: Upload, preview, and apply a custom logo image directly from the dashboard.
- **Batch ZIP Font Upload**: Upload a ZIP archive of fonts; the system automatically extracts and catalogs all font files.
- **Inquiries Inbox**: View and manage messages received through the Contact Us form.
- **Credentials & Password Manager**: Update admin username, email, and password securely.

---

## 🔒 Security Architecture

The application implements defense-in-depth security best practices:

- **Bcrypt Password Hashing**: Passwords are encrypted using salted bcrypt hashing with zero plaintext fallbacks or hardcoded bypasses.
- **Brute-Force Rate Limiting**: Consecutive failed login attempts are tracked. After 5 failed attempts, the login form activates a 60-second security lockout with a live countdown timer.
- **Session Lifespan & Timeout**: Admin sessions automatically expire after 4 hours of inactivity to prevent unauthorized access on shared devices.
- **No Public Credential Exposure**: Login credentials are kept private and never rendered on public-facing screens.
- **Hidden Admin Linkage**: The admin dashboard route is unlinked from the public navigation and footer menus.
- **Input Sanitization**: All user inputs are strictly trimmed and validated to prevent injection attacks.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Engine**: `nepali-date-converter`
- **ZIP Processing**: `jszip`
- **Security**: `bcryptjs`
- **Routing**: `react-router-dom`

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (version 18 or higher) and `npm` installed.

### Installation
1. Clone the repository or navigate to the project root:
   ```bash
   cd f:\1myapps\my_converter
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
Start the development server:
```bash
npm run dev
```
Open your browser and visit: `http://localhost:5173/`

### Building for Production
Create an optimized production bundle:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

---

## 🔑 Initial Admin Credentials

To access the Admin Panel, visit `/login` in your browser:

- **Default Username:** `admin`
- **Default Email:** `dbsthakuree123@gmail.com`
- **Default Password:** `admin123`

> ⚠️ **Important:** After your first login, please navigate to **Admin Panel → Settings** and change your password to a strong, unique password (minimum 6 characters).

---

## 📂 Project Structure

```
my_converter/
├── public/                 # Static assets & font downloads
├── src/
│   ├── components/         # Reusable UI components (Navbar, Footer, SiteLogo, etc.)
│   ├── context/            # AuthContext, SiteSettingsContext, ToastContext
│   ├── pages/              # Application pages:
│   │   ├── Home.tsx            # Preeti ↔ Unicode converter homepage
│   │   ├── PreetiToUnicode.tsx # Dedicated Preeti converter
│   │   ├── UnicodeToPreeti.tsx # Dedicated Unicode converter
│   │   ├── HamroPatro.tsx      # Live Nepali calendar widget & NPT clock
│   │   ├── DateConverter.tsx   # BS ↔ AD converter & Age calculator
│   │   ├── Downloads.tsx       # Downloadable Nepali fonts
│   │   ├── AboutUs.tsx         # About the project
│   │   ├── ContactUs.tsx       # Contact form
│   │   ├── Login.tsx           # Hardened Admin Login
│   │   └── Admin.tsx           # Admin Dashboard & Settings
│   ├── utils/              # Conversion algorithms (preetiToUnicode, unicodeToPreeti)
│   ├── App.tsx             # Application routes & layout
│   └── main.tsx            # React application entrypoint
├── index.html              # HTML document template
├── package.json            # Project dependencies & scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build configuration
```

---

## 📄 License & Attribution

© 2026. All rights reserved.
Built with dedication for the Nepali digital community.
