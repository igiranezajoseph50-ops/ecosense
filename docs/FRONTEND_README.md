# EcoSense Rwanda — Frontend

A futuristic cyberpunk-themed frontend for the EcoSense Rwanda Smart Waste Management System built with HTML, CSS, and Three.js.

---

## Tech Stack

- **3D Graphics:** Three.js (r128)
- **Charts:** Chart.js (v4.4.0)
- **Styling:** Pure CSS with CSS Variables
- **Language:** Vanilla JavaScript (ES6+)
- **API Communication:** Fetch API

---

## Folder Structure

```
frontend/
├── pages/
│   ├── landing.html       # Landing page with 3D city scene
│   ├── login.html         # Login page
│   ├── dashboard.html     # Main dashboard
│   ├── bins.html          # Bin monitoring page
│   ├── analytics.html     # Analytics & charts
│   ├── routes.html        # Collection routes
│   └── admin.html         # Admin control panel
├── css/
│   ├── main.css           # Global styles & variables
│   ├── landing.css        # Landing page styles
│   ├── login.css          # Login page styles
│   ├── dashboard.css      # Dashboard & sidebar styles
│   ├── bins.css           # Bin monitoring styles
│   ├── analytics.css      # Analytics page styles
│   ├── routes.css         # Routes page styles
│   └── admin.css          # Admin page styles
├── js/
│   ├── api.js             # API helper (fetch wrapper)
│   ├── auth.js            # Login logic + background scene
│   ├── landing.js         # Three.js city scene + cursor
│   ├── dashboard.js       # Dashboard stats + mini 3D scene
│   ├── bins.js            # Bin grid + modal + 3D bin viewer
│   ├── analytics.js       # Chart.js charts + sensor table
│   ├── routes.js          # Schedule management
│   └── admin.js           # Admin CRUD operations
└── assets/                # Images and icons
```

---

## Getting Started

### 1. Make sure the backend is running

Start MongoDB:
```bash
mongod --dbpath /var/data/db
```

Start the backend server:
```bash
cd ../backend
npm run dev
```

### 2. Open the frontend

Open the landing page in your browser:
```
frontend/pages/landing.html
```

Or use Live Server in VS Code for best experience.

---

## Page Flow

```
Landing Page
    ↓
Login Page  →  (JWT token saved to localStorage)
    ↓
Dashboard
    ↓
Bin Monitoring / Analytics / Routes / Admin
    ↓ (logout)
Login Page  ←  (localStorage cleared)
```

---

## Pages

### Landing Page
- Futuristic cyberpunk 3D city scene with Three.js
- Smart bins scattered across the city
- Glowing grid ground, building wireframes
- Animated radar scan ring
- Custom glowing cursor
- HUD corners with live clock and coordinates
- Animated counters (bins online, routes, alerts)
- Glitch effect on title

### Login Page
- Connects to backend `POST /api/auth/login`
- Saves token and user to localStorage
- Redirects to dashboard on success
- Three.js animated background

### Dashboard
- Real-time bin stats (total, green, yellow, red)
- Mini 3D Earth with orbiting bins
- Recent bin alerts list
- Sidebar navigation to all pages

### Bin Monitoring
- Responsive grid of all bins
- Filter by status (All / Green / Yellow / Red)
- Click any bin to open detail modal
- Modal shows fill level, weight, gas, status
- Spinning 3D bin in modal

### Analytics
- Bar chart: fill level per bin
- Doughnut chart: status distribution
- Summary cards (total logs, avg fill, gas alerts, critical events)
- Sensor data table (last 20 readings)

### Routes
- Create new collection schedules
- Assign bins and drivers
- Filter schedules by status
- Start / Complete / Cancel schedule actions
- Stats: total, pending, completed, in-progress

### Admin
- 3 tabs: Manage Bins / Manage Users / Add Sensor Data
- Add and delete bins
- Add and delete users with roles
- Manually submit sensor readings to any bin

---

## Authentication

Every page (except landing and login) checks for a valid token in localStorage:

```javascript
const user = JSON.parse(localStorage.getItem('user'));
if (!user) window.location.href = '../pages/login.html';
```

If no token is found, the user is redirected to the login page.

---

## API Configuration

All API calls go through `js/api.js`:

```javascript
const API_URL = 'http://localhost:5000/api';
```

To change the backend URL (e.g. for deployment), update this one line.

---

## Color Palette

| Variable | Value | Usage |
|----------|-------|-------|
| --primary | #00ff88 | Green accent, highlights |
| --secondary | #00ccff | Cyan accent |
| --dark | #050a0e | Main background |
| --dark2 | #0a1628 | Card background |
| --text | #e0e0e0 | Main text |
| --text-muted | #7a8a9a | Subtle text |
| --border | rgba(0,255,136,0.15) | Card borders |

---

## Three.js Scenes

| Page | Scene |
|------|-------|
| Landing | Cyberpunk city, smart bins, radar ring, grid |
| Login | Floating particles + wireframe sphere |
| Dashboard | Earth with orbiting bins |
| Bin Modal | Spinning individual 3D bin |

---

## Browser Requirements

- Modern browser (Chrome, Firefox, Edge)
- WebGL support (for Three.js)
- JavaScript enabled
- Backend running on localhost:5000