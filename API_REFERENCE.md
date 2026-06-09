# Quick API Reference Guide

## 🚀 Getting Started

```bash
# 1. Install packages
npm install bcryptjs jsonwebtoken

# 2. Run setup (Windows)
setup.bat

# OR Setup (Linux/Mac)
bash setup.sh

# 3. Start server
npm run dev
```

Server will run on: `http://localhost:9999`

---

## 📚 API Endpoints

### Authentication (Public)
| Method | Endpoint | Body | Notes |
|--------|----------|------|-------|
| POST | `/api/auth/register` | email, password, full_name, phone | Creates owner account |
| POST | `/api/auth/login` | email, password | Returns access + refresh token |
| POST | `/api/auth/refresh` | refreshToken | Get new access token |
| GET | `/api/auth/me` | - | 🔐 Get current user |
| PATCH | `/api/auth/me` | full_name, phone, avatar_url | 🔐 Update profile |
| PATCH | `/api/auth/me/password` | oldPassword, newPassword | 🔐 Change password |
| POST | `/api/auth/logout` | - | 🔐 Logout |

### Homepage (Public)
| Method | Endpoint | Query | Notes |
|--------|----------|-------|-------|
| GET | `/api/homepage/services` | - | List all services |
| GET | `/api/homepage/services/:id` | - | Get service details |
| GET | `/api/homepage/doctors` | - | List all doctors |
| GET | `/api/homepage/doctors/:id` | - | Get doctor details |
| GET | `/api/homepage/available-slots` | doctor_id, date | Get available times |

### Pets (Owner Only)
| Method | Endpoint | Body | Notes |
|--------|----------|------|-------|
| POST | `/api/pets` | name, breed, gender, dob, weight, microchip_id | 🔐 Create pet |
| GET | `/api/pets` | - | 🔐 List user's pets |
| GET | `/api/pets/:id` | - | 🔐 Get pet details |
| PATCH | `/api/pets/:id` | name, breed, weight, notes | 🔐 Update pet |
| DELETE | `/api/pets/:id` | - | 🔐 Delete pet (soft) |
| GET | `/api/pets/:id/medical-records` | - | 🔐 Get medical records |
| GET | `/api/pets/:id/vaccinations` | - | 🔐 Get vaccinations |
| GET | `/api/pets/:id/appointments` | - | 🔐 Get appointments |

### Appointments (Owner)
| Method | Endpoint | Body | Query | Notes |
|--------|----------|------|-------|-------|
| POST | `/api/appointments` | pet_id, service_id, scheduled_at, notes | - | 🔐 Book appointment |
| GET | `/api/appointments` | - | status, date | 🔐 List appointments |
| GET | `/api/appointments/:id` | - | - | 🔐 Get appointment |
| PATCH | `/api/appointments/:id/cancel` | cancelled_reason | - | 🔐 Cancel appointment |

### Doctor Operations (Doctor Only)
| Method | Endpoint | Body/Query | Notes |
|--------|----------|-----------|-------|
| GET | `/api/doctor/appointments` | ?date=, ?status= | 👨‍⚕️ List appointments |
| PATCH | `/api/doctor/appointments/:id/status` | status | 👨‍⚕️ Update status |
| POST | `/api/doctor/medical-records` | pet_id, diagnosis, treatment, symptoms | 👨‍⚕️ Create record |
| GET | `/api/doctor/medical-records/:petId` | - | 👨‍⚕️ Get records |
| PATCH | `/api/doctor/medical-records/:id` | diagnosis, treatment | 👨‍⚕️ Update record |
| POST | `/api/doctor/vaccinations` | pet_id, vaccine_name, administered_date | 👨‍⚕️ Record vaccine |
| GET | `/api/doctor/vaccinations/:petId` | - | 👨‍⚕️ Get vaccines |
| GET | `/api/doctor/patients` | - | 👨‍⚕️ Get patients |

### Admin Panel (Admin Only)
#### Users
| Method | Endpoint | Body/Query | Notes |
|--------|----------|-----------|-------|
| GET | `/api/admin/users` | ?role=, ?is_active= | 👨‍💼 List users |
| POST | `/api/admin/users` | email, password, role, full_name | 👨‍💼 Create admin/doctor |
| GET | `/api/admin/users/:id` | - | 👨‍💼 Get user |
| PATCH | `/api/admin/users/:id` | full_name, phone, doctor_profile | 👨‍💼 Update user |
| PATCH | `/api/admin/users/:id/role` | role | 👨‍💼 Change role |
| PATCH | `/api/admin/users/:id/status` | is_active | 👨‍💼 Lock/unlock |

#### Services
| Method | Endpoint | Body | Notes |
|--------|----------|------|-------|
| GET | `/api/admin/services` | - | 👨‍💼 List services |
| POST | `/api/admin/services` | name, price, category, duration_minutes | 👨‍💼 Create service |
| PATCH | `/api/admin/services/:id` | name, price, is_active | 👨‍💼 Update service |
| DELETE | `/api/admin/services/:id` | - | 👨‍💼 Delete service |

#### Appointments & Invoices
| Method | Endpoint | Query | Notes |
|--------|----------|-------|-------|
| GET | `/api/admin/appointments` | ?status=, ?date=, ?doctor_id= | 👨‍💼 List appointments |
| GET | `/api/admin/appointments/:id` | - | 👨‍💼 Get appointment |
| POST | `/api/admin/invoices` | appointment_id, amount, discount | 👨‍💼 Create invoice |
| GET | `/api/admin/invoices` | ?status=, ?from=, ?to= | 👨‍💼 List invoices |
| PATCH | `/api/admin/invoices/:id/status` | status, payment_method | 👨‍💼 Update payment |

#### Statistics
| Method | Endpoint | Query | Notes |
|--------|----------|-------|-------|
| GET | `/api/admin/stats/overview` | - | 👨‍💼 Overview stats |
| GET | `/api/admin/stats/appointments` | ?period= | 👨‍💼 Appointment stats |
| GET | `/api/admin/stats/revenue` | ?from=, ?to= | 👨‍💼 Revenue stats |
| GET | `/api/admin/stats/top-services` | - | 👨‍💼 Top 10 services |
| GET | `/api/admin/stats/doctors` | - | 👨‍💼 Doctor performance |

### Notifications
| Method | Endpoint | Query | Notes |
|--------|----------|-------|-------|
| GET | `/api/notifications` | ?is_read= | 🔐 List notifications |
| PATCH | `/api/notifications/:id/read` | - | 🔐 Mark read |
| PATCH | `/api/notifications/read-all` | - | 🔐 Mark all read |

---

## 🔐 Authentication

### Get Access Token
```bash
curl -X POST http://localhost:9999/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Use Token in Requests
```bash
curl -X GET http://localhost:9999/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 💡 Common Examples

### Register & Login
```bash
# Register
curl -X POST http://localhost:9999/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"owner@example.com",
    "password":"Pass123!@",
    "full_name":"John Doe",
    "phone":"0123456789"
  }'

# Login
curl -X POST http://localhost:9999/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@example.com","password":"Pass123!@"}'
```

### Create Pet
```bash
curl -X POST http://localhost:9999/api/pets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Max",
    "breed":"Golden Retriever",
    "gender":"male",
    "weight":30,
    "dob":"2020-01-15T00:00:00Z"
  }'
```

### Book Appointment
```bash
curl -X POST http://localhost:9999/api/appointments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pet_id":"VALID_PET_ID",
    "service_id":"VALID_SERVICE_ID",
    "scheduled_at":"2024-07-15T10:00:00Z",
    "notes":"Pet has allergy to X"
  }'
```

---

## 📊 Response Format

### Success (200-201)
```json
{
  "message": "Operation successful",
  "data": { /* resource data */ }
}
```

### Error (400-500)
```json
{
  "message": "Error description",
  "error": "Detailed error message"
}
```

---

## 🔑 Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## 📝 Notes

- 🔐 = Requires authentication (add Authorization header)
| Role | Access |
|------|--------|
| owner | Pets, Appointments, Notifications |
| doctor | Appointments, Medical Records, Vaccinations |
| admin | Users, Services, Invoices, Statistics |

**See CONTROLLERS_SUMMARY.md for detailed implementation details!**
