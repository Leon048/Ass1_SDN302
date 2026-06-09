# API Testing Guide - After Authentication Removal

This guide shows how to test the Dog Care API now that authentication has been removed. All endpoints are public and require explicit user IDs in request parameters.

## 📋 Testing Prerequisites

1. Ensure MongoDB is running and connected
2. Ensure the server is running: `npm start` (should listen on `http://localhost:9999`)
3. You have a MongoDB user ID (format: ObjectId)
4. Use Postman, curl, or any HTTP client

## 🏠 Homepage Routes (No IDs Required)

These routes are fully public and don't require any IDs.

### Get All Services
```bash
curl -X GET http://localhost:9999/api/homepage/services
```

**Response:**
```json
{
  "message": "Services retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Grooming",
      "category": "grooming",
      "description": "Pet grooming service",
      "price": 50,
      "duration_minutes": 60,
      "is_active": true
    }
  ]
}
```

### Get Service by ID
```bash
curl -X GET http://localhost:9999/api/homepage/services/507f1f77bcf86cd799439011
```

### Get All Doctors
```bash
curl -X GET http://localhost:9999/api/homepage/doctors
```

### Get Doctor by ID
```bash
curl -X GET http://localhost:9999/api/homepage/doctors/507f1f77bcf86cd799439012
```

### Get Available Slots for a Doctor
```bash
curl -X GET "http://localhost:9999/api/homepage/available-slots?doctor_id=507f1f77bcf86cd799439012&date=2024-01-15"
```

---

## 🐾 Pet Routes

All pet endpoints now require `owner_id` as a query parameter or in request body.

### Create a Pet
```bash
curl -X POST http://localhost:9999/api/pets \
  -H "Content-Type: application/json" \
  -d '{
    "owner_id": "507f1f77bcf86cd799439013",
    "name": "Max",
    "breed": "Golden Retriever",
    "dob": "2020-05-15",
    "gender": "male",
    "weight": 30,
    "microchip_id": "ABC123456",
    "notes": "Friendly and energetic"
  }'
```

**Response:** Status 201
```json
{
  "message": "Pet created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "owner_id": "507f1f77bcf86cd799439013",
    "name": "Max",
    "breed": "Golden Retriever",
    "is_active": true,
    "created_at": "2024-01-10T10:30:00Z"
  }
}
```

### Get Pets (By Owner)
```bash
curl -X GET "http://localhost:9999/api/pets?owner_id=507f1f77bcf86cd799439013"
```

**Response:**
```json
{
  "message": "Pets retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "owner_id": "507f1f77bcf86cd799439013",
      "name": "Max",
      "breed": "Golden Retriever"
    }
  ]
}
```

### Get Pet by ID
```bash
curl -X GET http://localhost:9999/api/pets/507f1f77bcf86cd799439014
```

### Update Pet
```bash
curl -X PATCH http://localhost:9999/api/pets/507f1f77bcf86cd799439014 \
  -H "Content-Type: application/json" \
  -d '{
    "weight": 32,
    "notes": "Now weighs 32kg"
  }'
```

### Delete Pet (Soft Delete)
```bash
curl -X DELETE http://localhost:9999/api/pets/507f1f77bcf86cd799439014
```

### Get Pet's Medical Records
```bash
curl -X GET http://localhost:9999/api/pets/507f1f77bcf86cd799439014/medical-records
```

### Get Pet's Vaccination History
```bash
curl -X GET http://localhost:9999/api/pets/507f1f77bcf86cd799439014/vaccinations
```

### Get Pet's Appointments
```bash
curl -X GET http://localhost:9999/api/pets/507f1f77bcf86cd799439014/appointments
```

---

## 📅 Appointment Routes

All appointment endpoints require `owner_id` in query parameter or request body.

### Create Appointment
```bash
curl -X POST http://localhost:9999/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "owner_id": "507f1f77bcf86cd799439013",
    "pet_id": "507f1f77bcf86cd799439014",
    "doctor_id": "507f1f77bcf86cd799439012",
    "service_id": "507f1f77bcf86cd799439011",
    "scheduled_at": "2024-01-15T10:00:00Z",
    "notes": "Regular checkup"
  }'
```

**Response:** Status 201
```json
{
  "message": "Appointment created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "owner_id": "507f1f77bcf86cd799439013",
    "pet_id": "507f1f77bcf86cd799439014",
    "doctor_id": "507f1f77bcf86cd799439012",
    "status": "pending",
    "scheduled_at": "2024-01-15T10:00:00Z",
    "created_at": "2024-01-10T10:30:00Z"
  }
}
```

### Get Appointments (By Owner)
```bash
curl -X GET "http://localhost:9999/api/appointments?owner_id=507f1f77bcf86cd799439013"
```

### Get Appointment by ID
```bash
curl -X GET http://localhost:9999/api/appointments/507f1f77bcf86cd799439015
```

### Cancel Appointment
```bash
curl -X PATCH http://localhost:9999/api/appointments/507f1f77bcf86cd799439015/cancel
```

---

## 👨‍⚕️ Doctor Routes

All doctor endpoints require `doctor_id` as query parameter or in request body.

### Get Doctor's Appointments
```bash
curl -X GET "http://localhost:9999/api/doctor/appointments?doctor_id=507f1f77bcf86cd799439012&status=pending"
```

### Update Appointment Status
```bash
curl -X PATCH http://localhost:9999/api/doctor/appointments/507f1f77bcf86cd799439015/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress",
    "doctor_id": "507f1f77bcf86cd799439012"
  }'
```

### Create Medical Record
```bash
curl -X POST http://localhost:9999/api/doctor/medical-records \
  -H "Content-Type: application/json" \
  -d '{
    "appointment_id": "507f1f77bcf86cd799439015",
    "pet_id": "507f1f77bcf86cd799439014",
    "doctor_id": "507f1f77bcf86cd799439012",
    "diagnosis": "Ear infection",
    "treatment": "Antibiotics and cleaning",
    "symptoms": ["Ear discharge", "Itching"],
    "prescriptions": [
      {
        "medication": "Amoxicillin",
        "dosage": "500mg",
        "frequency": "2x daily",
        "duration_days": 7
      }
    ],
    "follow_up_date": "2024-01-22"
  }'
```

**Response:** Status 201
```json
{
  "message": "Medical record created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439016",
    "appointment_id": "507f1f77bcf86cd799439015",
    "pet_id": "507f1f77bcf86cd799439014",
    "doctor_id": "507f1f77bcf86cd799439012",
    "diagnosis": "Ear infection",
    "treatment": "Antibiotics and cleaning",
    "is_active": true,
    "created_at": "2024-01-10T11:00:00Z"
  }
}
```

### Get Medical Records for Pet
```bash
curl -X GET http://localhost:9999/api/doctor/medical-records/507f1f77bcf86cd799439014
```

### Update Medical Record
```bash
curl -X PATCH http://localhost:9999/api/doctor/medical-records/507f1f77bcf86cd799439016 \
  -H "Content-Type: application/json" \
  -d '{
    "treatment": "Antibiotics, cleaning, and ear drops"
  }'
```

### Create Vaccination Record
```bash
curl -X POST http://localhost:9999/api/doctor/vaccinations \
  -H "Content-Type: application/json" \
  -d '{
    "pet_id": "507f1f77bcf86cd799439014",
    "doctor_id": "507f1f77bcf86cd799439012",
    "vaccine_name": "DHPP",
    "batch_number": "BATCH123456",
    "administered_date": "2024-01-10",
    "next_due_date": "2025-01-10",
    "notes": "Annual vaccination"
  }'
```

### Get Vaccination History
```bash
curl -X GET http://localhost:9999/api/doctor/vaccinations/507f1f77bcf86cd799439014
```

### Get Doctor's Patients
```bash
curl -X GET "http://localhost:9999/api/doctor/patients?doctor_id=507f1f77bcf86cd799439012"
```

---

## 🔔 Notification Routes

All notification endpoints require `user_id` in query parameter or request body.

### Get Notifications
```bash
curl -X GET "http://localhost:9999/api/notifications?user_id=507f1f77bcf86cd799439013"
```

### Get Unread Notifications Only
```bash
curl -X GET "http://localhost:9999/api/notifications?user_id=507f1f77bcf86cd799439013&is_read=false"
```

**Response:**
```json
{
  "message": "Notifications retrieved successfully",
  "unreadCount": 3,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439017",
      "user_id": "507f1f77bcf86cd799439013",
      "type": "appointment_confirmed",
      "title": "Appointment Confirmed",
      "message": "Your appointment with Dr. John has been confirmed",
      "is_read": false,
      "created_at": "2024-01-10T09:30:00Z"
    }
  ]
}
```

### Mark Notification as Read
```bash
curl -X PATCH http://localhost:9999/api/notifications/507f1f77bcf86cd799439017/read
```

### Mark All Notifications as Read
```bash
curl -X PATCH http://localhost:9999/api/notifications/read-all \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "507f1f77bcf86cd799439013"
  }'
```

---

## 👑 Admin Routes

Admin endpoints now require explicit IDs (no role-based access control).

### Get All Users
```bash
curl -X GET "http://localhost:9999/api/admin/users?role=doctor&is_active=true"
```

### Get Specific User
```bash
curl -X GET http://localhost:9999/api/admin/users/507f1f77bcf86cd799439012
```

### Create User (Doctor or Admin)
```bash
curl -X POST http://localhost:9999/api/admin/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dr.jane@clinic.com",
    "password": "SecurePass123",
    "full_name": "Dr. Jane Smith",
    "phone": "+1234567890",
    "role": "doctor",
    "doctor_profile": {
      "specialization": "Small Animals",
      "license_number": "VET123456",
      "experience_years": 5
    }
  }'
```

### Change User Role
```bash
curl -X PATCH http://localhost:9999/api/admin/users/507f1f77bcf86cd799439012/role \
  -H "Content-Type: application/json" \
  -d '{
    "new_role": "admin"
  }'
```

### Activate/Deactivate User
```bash
curl -X PATCH http://localhost:9999/api/admin/users/507f1f77bcf86cd799439012/status \
  -H "Content-Type: application/json" \
  -d '{
    "is_active": false
  }'
```

### Get All Services
```bash
curl -X GET http://localhost:9999/api/admin/services
```

### Create Service
```bash
curl -X POST http://localhost:9999/api/admin/services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Surgery",
    "category": "surgery",
    "description": "Surgical procedures",
    "price": 500,
    "duration_minutes": 120
  }'
```

### Get Overview Statistics
```bash
curl -X GET http://localhost:9999/api/admin/stats/overview
```

**Response:**
```json
{
  "message": "Overview statistics retrieved successfully",
  "data": {
    "total_users": 45,
    "total_pets": 120,
    "total_appointments": 250,
    "total_revenue": 15000,
    "pending_appointments": 12
  }
}
```

---

## 🧪 Complete User Flow Test

Here's a complete test scenario:

### 1. Create Owner User
Create a MongoDB document for an owner (or use existing ID)

### 2. Create a Pet
```bash
curl -X POST http://localhost:9999/api/pets \
  -H "Content-Type: application/json" \
  -d '{
    "owner_id": "YOUR_OWNER_ID",
    "name": "Bella",
    "breed": "Labrador",
    "dob": "2021-06-20",
    "gender": "female",
    "weight": 28
  }'
# Save pet_id from response
```

### 3. Get Available Doctor
```bash
curl -X GET http://localhost:9999/api/homepage/doctors
# Save doctor_id from response
```

### 4. Get Service
```bash
curl -X GET http://localhost:9999/api/homepage/services
# Save service_id from response
```

### 5. Create Appointment
```bash
curl -X POST http://localhost:9999/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "owner_id": "YOUR_OWNER_ID",
    "pet_id": "SAVED_PET_ID",
    "doctor_id": "SAVED_DOCTOR_ID",
    "service_id": "SAVED_SERVICE_ID",
    "scheduled_at": "2024-01-20T14:00:00Z"
  }'
# Save appointment_id from response
```

### 6. Doctor Confirms Appointment
```bash
curl -X PATCH http://localhost:9999/api/doctor/appointments/SAVED_APPOINTMENT_ID/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "confirmed",
    "doctor_id": "SAVED_DOCTOR_ID"
  }'
```

### 7. Create Medical Record After Appointment
```bash
curl -X POST http://localhost:9999/api/doctor/medical-records \
  -H "Content-Type: application/json" \
  -d '{
    "appointment_id": "SAVED_APPOINTMENT_ID",
    "pet_id": "SAVED_PET_ID",
    "doctor_id": "SAVED_DOCTOR_ID",
    "diagnosis": "Healthy",
    "treatment": "Regular checkup completed",
    "symptoms": []
  }'
```

### 8. Create Vaccination Record
```bash
curl -X POST http://localhost:9999/api/doctor/vaccinations \
  -H "Content-Type: application/json" \
  -d '{
    "pet_id": "SAVED_PET_ID",
    "doctor_id": "SAVED_DOCTOR_ID",
    "vaccine_name": "DHPP",
    "batch_number": "BATCH001",
    "administered_date": "2024-01-20",
    "next_due_date": "2025-01-20"
  }'
```

### 9. View Owner's Notifications
```bash
curl -X GET "http://localhost:9999/api/notifications?user_id=YOUR_OWNER_ID"
```

---

## ✅ Expected Results

If all endpoints work correctly, you should:
- ✅ Create pets without authentication
- ✅ Book appointments without authentication
- ✅ Create medical records and vaccinations without authentication
- ✅ View all data by providing appropriate IDs
- ✅ Receive proper error responses for invalid IDs (404)
- ✅ Receive proper error responses for missing required fields (400)

---

## 🚨 Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| 400 Bad Request | Missing required field (owner_id, doctor_id, etc.) | Add the required field to request |
| 404 Not Found | Invalid ID format or ID doesn't exist | Check ID format and verify it exists in DB |
| 500 Internal Server Error | Server error | Check server logs for details |

---

## 📊 Testing Checklist

- [ ] Homepage routes work (get services, doctors)
- [ ] Can create pet with owner_id
- [ ] Can create appointment with owner_id
- [ ] Doctor can update appointment status
- [ ] Doctor can create medical records
- [ ] Can view notifications with user_id
- [ ] Can perform admin operations
- [ ] All errors return appropriate HTTP status codes

---

**All endpoints are now public!** 🎉 Test them by providing user IDs directly in requests.
