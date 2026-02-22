# EcoSense Rwanda — Backend

A REST API for the EcoSense Rwanda Smart Waste Management System built with Node.js, Express.js, and MongoDB.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Environment Variables:** dotenv
- **Dev Tool:** Nodemon

---

## Folder Structure

```
backend/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js      # Register, Login, Get Me
│   ├── binController.js       # CRUD for bins
│   ├── sensorController.js    # CRUD for sensor data
│   └── scheduleController.js  # CRUD for schedules
├── middleware/
│   └── authMiddleware.js      # JWT protect middleware
├── models/
│   ├── User.js                # User schema
│   ├── Bin.js                 # Bin schema
│   ├── SensorData.js          # Sensor data schema
│   └── CollectionSchedule.js  # Schedule schema
├── routes/
│   ├── authRoutes.js          # Auth routes
│   ├── binRoutes.js           # Bin routes
│   ├── sensorRoutes.js        # Sensor routes
│   └── scheduleRoutes.js      # Schedule routes
├── .env                       # Environment variables
├── server.js                  # Entry point
└── package.json
```

---

## Getting Started

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment Variables

Open `.env` and make sure it has:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecosense
JWT_SECRET=ecosense_secret_key_2024
```

### 3. Start MongoDB

Open a terminal and run:

```bash
mongod --dbpath /var/data/db
```

Keep this terminal open — MongoDB must stay running.

### 4. Start the Server

Open a second terminal and run:

```bash
npm run dev
```

You should see:

```
Server running on port 5000
MongoDB Connected: localhost
```

---

## API Endpoints

### Auth

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login user | No |
| GET | /api/auth/me | Get current user | Yes |

### Bins

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| GET | /api/bins | Get all bins | Yes |
| GET | /api/bins/:id | Get single bin | Yes |
| GET | /api/bins/status/:status | Get bins by status | Yes |
| POST | /api/bins | Create bin | Yes |
| PUT | /api/bins/:id | Update bin | Yes |
| DELETE | /api/bins/:id | Delete bin | Yes |

### Sensors

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| GET | /api/sensors | Get all sensor data | Yes |
| GET | /api/sensors/latest | Get latest data per bin | Yes |
| GET | /api/sensors/bin/:binId | Get history for bin | Yes |
| POST | /api/sensors | Add sensor reading | Yes |
| DELETE | /api/sensors/:id | Delete sensor data | Yes |

### Schedules

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| GET | /api/schedules | Get all schedules | Yes |
| GET | /api/schedules/:id | Get single schedule | Yes |
| GET | /api/schedules/status/:status | Get by status | Yes |
| GET | /api/schedules/driver/:driverId | Get by driver | Yes |
| POST | /api/schedules | Create schedule | Yes |
| PUT | /api/schedules/:id | Update schedule | Yes |
| DELETE | /api/schedules/:id | Delete schedule | Yes |

---

## Authentication

All protected routes require a Bearer token in the request header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

You get the token after logging in via `POST /api/auth/login`.

---

## Bin Status Logic

When new sensor data is posted, the bin status is automatically updated:

- Fill Level 0–49% → **Green**
- Fill Level 50–79% → **Yellow**
- Fill Level 80–100% → **Red**

When a collection schedule is marked as **completed**, the bin is automatically reset to fill level 0 and status Green.

---

## Models

### User
- name, email, password, role (admin / operator / driver)

### Bin
- binId, location (name, lat, lng), fillLevel, weight, gasLevel, status, isActive

### SensorData
- bin (ref), fillLevel, weight, gasLevel, temperature, recordedAt

### CollectionSchedule
- bin (ref), driver (ref), scheduledDate, status, notes

---

## Scripts

```bash
npm run dev    # Start with nodemon (development)
npm start      # Start with node (production)
```