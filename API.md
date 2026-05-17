# API Reference — Grama-Angana Backend

Base URL: `http://localhost:3000`

All protected routes require the header:
```
Authorization: Bearer <firebase_id_token>
```

---

## Auth

### POST /api/auth/register
Create a PostgreSQL user record after Firebase signup. Call this once after the user creates a Firebase account.

**Protected:** Yes

**Body:**
```json
{ "name": "Rahul Kumar" }
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Rahul Kumar",
    "email": "rahul@example.com",
    "role": "USER"
  }
}
```

---

### GET /api/auth/me
Get the current user's profile from the database.

**Protected:** Yes

**Response:**
```json
{
  "success": true,
  "data": { "id": 1, "name": "Rahul Kumar", "email": "...", "role": "USER" }
}
```

---

## Halls

### GET /api/halls
List all community halls. Public.

### GET /api/halls/:id
Get a single hall with its approved bookings and events.

### POST /api/halls
Create a hall. Admin only.

**Body:**
```json
{ "name": "Main Cultural Center", "location": "Central Block, 1st Floor", "capacity": 200 }
```

### PATCH /api/halls/:id
Update a hall. Admin only.

### DELETE /api/halls/:id
Delete a hall. Admin only.

---

## Bookings

### GET /api/bookings
List bookings. Admins see all bookings. Regular users see only their own.

**Protected:** Yes

### GET /api/bookings/:id
Get a single booking with user and hall details.

**Protected:** Yes

### POST /api/bookings
Create a new booking request.

**Protected:** Yes

**Body:**
```json
{
  "hallId": 1,
  "purpose": "Sports Practice",
  "bookingDate": "2025-08-15T00:00:00.000Z"
}
```

**Error (409):** Hall already booked on that date.

### PATCH /api/bookings/:id/status
Approve or reject a booking. When approved, an Event is automatically created.

**Protected:** Yes (Admin)

**Body:**
```json
{
  "status": "APPROVED",
  "eventTitle": "Football Training Camp",
  "eventDescription": "Annual sports training event"
}
```

Status values: `PENDING`, `APPROVED`, `REJECTED`

---

## Events

### GET /api/events
List all events. Public.

### GET /api/events/upcoming
List only future events. Public. Used for calendar view.

### GET /api/events/:id
Get event details. Public.

---

## Maintenance

### GET /api/maintenance
List all maintenance items with overall fund stats.

**Response:**
```json
{
  "success": true,
  "data": [...],
  "stats": {
    "totalRequired": 18000,
    "totalCollected": 14250,
    "percentage": 79
  }
}
```

### GET /api/maintenance/:id
Get a single maintenance item.

### POST /api/maintenance
Create a maintenance item. Admin only.

**Body:**
```json
{ "itemName": "Roof Repair", "requiredFunds": 5000 }
```

### PATCH /api/maintenance/:id/funds
Add funds to a maintenance item. Protected.

**Body:**
```json
{ "amount": 500 }
```

### DELETE /api/maintenance/:id
Delete a maintenance item. Admin only.

---

## Error Responses

All errors follow:
```json
{ "success": false, "message": "Description of error" }
```

| Status | Meaning |
|---|---|
| 400 | Bad request — missing or invalid fields |
| 401 | Unauthorized — missing or invalid Firebase token |
| 404 | Resource not found |
| 409 | Conflict — double booking attempt |
| 500 | Internal server error |
