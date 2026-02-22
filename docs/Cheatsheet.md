# EcoSense Rwanda — Cheatsheet
> Quick reference for commands and API endpoints

---

## START THE PROJECT

### Step 1 — Start MongoDB
```bash
mongod --dbpath /var/data/db
```

### Step 2 — Start Backend (new terminal)
```bash
cd ~/Documents/ecosense/backend
npm run dev
```

### Step 3 — Open Frontend
```
Open: ~/Documents/ecosense/frontend/pages/landing.html
```

---

## TEST THE SERVER

```
GET http://localhost:5000/
```
Expected:
```json
{ "message": "EcoSense Rwanda API is running..." }
```

---

## AUTH ENDPOINTS

### Register
```
POST http://localhost:5000/api/auth/register
```
```json
{
  "name": "Admin User",
  "email": "admin@ecosense.rw",
  "password": "123456",
  "role": "admin"
}
```

### Login
```
POST http://localhost:5000/api/auth/login
```
```json
{
  "email": "admin@ecosense.rw",
  "password": "123456"
}
```

### Get Current User
```
GET http://localhost:5000/api/auth/me
Headers: Authorization: Bearer YOUR_TOKEN
```

---

## BIN ENDPOINTS

### Get All Bins
```
GET http://localhost:5000/api/bins
Headers: Authorization: Bearer YOUR_TOKEN
```

### Get Single Bin
```
GET http://localhost:5000/api/bins/:id
Headers: Authorization: Bearer YOUR_TOKEN
```

### Get Bins by Status
```
GET http://localhost:5000/api/bins/status/green
GET http://localhost:5000/api/bins/status/yellow
GET http://localhost:5000/api/bins/status/red
Headers: Authorization: Bearer YOUR_TOKEN
```

### Create Bin
```
POST http://localhost:5000/api/bins
Headers: Authorization: Bearer YOUR_TOKEN
```
```json
{
  "binId": "BIN-001",
  "location": {
    "name": "Kigali City Tower",
    "lat": -1.9441,
    "lng": 30.0619
  },
  "fillLevel": 45,
  "weight": 20,
  "gasLevel": 5,
  "status": "yellow"
}
```

### Update Bin
```
PUT http://localhost:5000/api/bins/:id
Headers: Authorization: Bearer YOUR_TOKEN
```
```json
{
  "fillLevel": 80,
  "status": "red"
}
```

### Delete Bin
```
DELETE http://localhost:5000/api/bins/:id
Headers: Authorization: Bearer YOUR_TOKEN
```

---

## SENSOR ENDPOINTS

### Get All Sensor Data
```
GET http://localhost:5000/api/sensors
Headers: Authorization: Bearer YOUR_TOKEN
```

### Get Latest Data (all bins)
```
GET http://localhost:5000/api/sensors/latest
Headers: Authorization: Bearer YOUR_TOKEN
```

### Get Sensor History for a Bin
```
GET http://localhost:5000/api/sensors/bin/:binId
Headers: Authorization: Bearer YOUR_TOKEN
```

### Add Sensor Reading
```
POST http://localhost:5000/api/sensors
Headers: Authorization: Bearer YOUR_TOKEN
```
```json
{
  "bin": "BIN_OBJECT_ID",
  "fillLevel": 75,
  "weight": 30,
  "gasLevel": 12,
  "temperature": 28
}
```

### Delete Sensor Data
```
DELETE http://localhost:5000/api/sensors/:id
Headers: Authorization: Bearer YOUR_TOKEN
```

---

## SCHEDULE ENDPOINTS

### Get All Schedules
```
GET http://localhost:5000/api/schedules
Headers: Authorization: Bearer YOUR_TOKEN
```

### Get Single Schedule
```
GET http://localhost:5000/api/schedules/:id
Headers: Authorization: Bearer YOUR_TOKEN
```

### Get Schedules by Status
```
GET http://localhost:5000/api/schedules/status/pending
GET http://localhost:5000/api/schedules/status/in-progress
GET http://localhost:5000/api/schedules/status/completed
GET http://localhost:5000/api/schedules/status/cancelled
Headers: Authorization: Bearer YOUR_TOKEN
```

### Get Schedules by Driver
```
GET http://localhost:5000/api/schedules/driver/:driverId
Headers: Authorization: Bearer YOUR_TOKEN
```

### Create Schedule
```
POST http://localhost:5000/api/schedules
Headers: Authorization: Bearer YOUR_TOKEN
```
```json
{
  "bin": "BIN_OBJECT_ID",
  "driver": "USER_OBJECT_ID",
  "scheduledDate": "2024-12-25T09:00:00.000Z",
  "notes": "Priority collection - bin is critical"
}
```

### Update Schedule Status
```
PUT http://localhost:5000/api/schedules/:id
Headers: Authorization: Bearer YOUR_TOKEN
```
```json
{
  "status": "completed"
}
```

### Delete Schedule
```
DELETE http://localhost:5000/api/schedules/:id
Headers: Authorization: Bearer YOUR_TOKEN
```

---

## STATUS REFERENCE

| Status | Meaning |
|--------|---------|
| 🟢 green | Fill level 0–49% |
| 🟡 yellow | Fill level 50–79% |
| 🔴 red | Fill level 80–100% |

| Schedule Status | Meaning |
|----------------|---------|
| pending | Not started yet |
| in-progress | Driver is collecting |
| completed | Collection done, bin reset to green |
| cancelled | Schedule was cancelled |

| User Role | Access |
|-----------|--------|
| admin | Full access |
| operator | Dashboard & monitoring |
| driver | Assigned routes only |

---

## QUICK TEST FLOW

```
1. Register user      → POST /api/auth/register
2. Login              → POST /api/auth/login  (copy token)
3. Create a bin       → POST /api/bins
4. Add sensor data    → POST /api/sensors (bin auto-updates status)
5. Create schedule    → POST /api/schedules
6. Update schedule    → PUT /api/schedules/:id { status: "completed" }
7. Check bin reset    → GET /api/bins/:id (fillLevel should be 0)
```