# Dog Care System — MongoDB & API Documentation

> Stack: Node.js (Express/Fastify) · MongoDB (Mongoose) · JWT Auth  
> Roles: `admin` · `doctor` · `owner`

---

## MongoDB Collections

### 1. `users`
Collection trung tâm cho tất cả 3 role.

```js
{
  _id: ObjectId,
  email: String,           // unique, required
  password_hash: String,   // bcrypt
  role: String,            // enum: ['admin', 'doctor', 'owner']
  full_name: String,
  phone: String,
  avatar_url: String,
  is_active: Boolean,      // default: true — admin có thể khoá
  refresh_token: String,   // lưu refresh token hiện tại
  created_at: Date,
  updated_at: Date,

  // Embed thêm tùy role để tránh join nhiều:
  // Nếu role = 'owner':
  owner_profile: {
    address: String,
    emergency_contact: String
  },

  // Nếu role = 'doctor':
  doctor_profile: {
    license_number: String,
    specialization: String,
    bio: String,
    working_hours: {       // lịch làm việc theo ngày
      mon: { start: "08:00", end: "17:00" },
      tue: { start: "08:00", end: "17:00" },
      // ...
    }
  }
}
```

> **Lý do embed profile vào `users`:** Với dự án học tập/MVP, tránh $lookup nhiều collection. Admin query users theo role là đủ.

---

### 2. `pets`
Thông tin chó, thuộc về một owner.

```js
{
  _id: ObjectId,
  owner_id: ObjectId,      // ref: users
  name: String,
  breed: String,           // giống chó
  dob: Date,               // ngày sinh
  gender: String,          // enum: ['male', 'female']
  weight: Number,          // kg
  microchip_id: String,
  avatar_url: String,
  notes: String,           // ghi chú thêm
  is_active: Boolean,      // default: true
  created_at: Date,
  updated_at: Date
}
```

---

### 3. `services`
Danh mục dịch vụ — do admin quản lý, hiển thị trên homepage.

```js
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  duration_minutes: Number,
  category: String,        // enum: ['grooming', 'vaccination', 'checkup', 'surgery', 'other']
  image_url: String,
  is_active: Boolean,      // default: true
  created_at: Date,
  updated_at: Date
}
```

---

### 4. `appointments`
Lịch hẹn đặt bởi owner.

```js
{
  _id: ObjectId,
  pet_id: ObjectId,        // ref: pets
  owner_id: ObjectId,      // ref: users (denormalize để query nhanh)
  doctor_id: ObjectId,     // ref: users (role: doctor)
  service_id: ObjectId,    // ref: services

  scheduled_at: Date,      // ngày giờ hẹn
  status: String,          // enum: ['pending', 'confirmed', 'in_progress', 'done', 'cancelled']
  notes: String,           // ghi chú của owner khi đặt

  // Snapshot tại thời điểm đặt (tránh thay đổi service ảnh hưởng lịch cũ)
  service_snapshot: {
    name: String,
    price: Number,
    duration_minutes: Number
  },

  cancelled_reason: String,
  created_at: Date,
  updated_at: Date
}
```

---

### 5. `medical_records`
Bệnh án — bác sĩ tạo sau buổi khám.

```js
{
  _id: ObjectId,
  appointment_id: ObjectId, // ref: appointments
  pet_id: ObjectId,          // ref: pets (denormalize)
  doctor_id: ObjectId,       // ref: users

  diagnosis: String,         // chẩn đoán
  treatment: String,         // phác đồ điều trị
  symptoms: [String],        // ['sốt', 'bỏ ăn', ...]

  prescriptions: [
    {
      medicine_name: String,
      dosage: String,        // "2 viên/ngày"
      duration_days: Number,
      notes: String
    }
  ],

  lab_results: [
    {
      test_name: String,
      result: String,
      unit: String,
      reference_range: String,
      is_abnormal: Boolean
    }
  ],

  attachments: [String],     // URLs file/ảnh đính kèm
  follow_up_date: Date,      // ngày tái khám
  created_at: Date,
  updated_at: Date
}
```

---

### 6. `vaccinations`
Lịch sử tiêm chủng — tách riêng để query nhanh không cần lọc qua medical_records.

```js
{
  _id: ObjectId,
  pet_id: ObjectId,         // ref: pets
  doctor_id: ObjectId,      // ref: users
  appointment_id: ObjectId, // ref: appointments (nếu tiêm trong lịch hẹn)

  vaccine_name: String,     // "Rabies", "DHPP", ...
  batch_number: String,     // số lô vaccine
  administered_date: Date,
  next_due_date: Date,      // ngày tiêm nhắc lại
  notes: String,
  created_at: Date
}
```

---

### 7. `invoices`
Hoá đơn thanh toán.

```js
{
  _id: ObjectId,
  appointment_id: ObjectId, // ref: appointments
  owner_id: ObjectId,       // ref: users (denormalize)

  amount: Number,           // tổng tiền gốc
  discount: Number,         // số tiền giảm, default: 0
  final_amount: Number,     // amount - discount

  status: String,           // enum: ['unpaid', 'paid', 'refunded']
  payment_method: String,   // enum: ['cash', 'transfer', 'card']
  paid_at: Date,
  notes: String,
  created_at: Date,
  updated_at: Date
}
```

---

### 8. `notifications`
Thông báo hệ thống.

```js
{
  _id: ObjectId,
  user_id: ObjectId,        // ref: users
  title: String,
  body: String,
  type: String,             // enum: ['appointment_confirmed', 'appointment_reminder',
                            //        'appointment_cancelled', 'invoice_created', 'system']
  ref_id: ObjectId,         // ID đối tượng liên quan (appointment, invoice...)
  ref_type: String,         // 'appointment' | 'invoice'
  is_read: Boolean,         // default: false
  created_at: Date
}
```

---

## Mongoose Indexes (nên tạo)

```js
// users
users.index({ email: 1 }, { unique: true })
users.index({ role: 1 })

// pets
pets.index({ owner_id: 1 })

// appointments
appointments.index({ owner_id: 1, status: 1 })
appointments.index({ doctor_id: 1, scheduled_at: 1 })
appointments.index({ pet_id: 1 })

// medical_records
medical_records.index({ pet_id: 1, created_at: -1 })
medical_records.index({ doctor_id: 1 })

// vaccinations
vaccinations.index({ pet_id: 1, administered_date: -1 })
vaccinations.index({ next_due_date: 1 })  // nhắc lịch tiêm

// invoices
invoices.index({ owner_id: 1, status: 1 })
invoices.index({ appointment_id: 1 }, { unique: true })

// notifications
notifications.index({ user_id: 1, is_read: 1, created_at: -1 })
```

---

## API Endpoints

### 🔐 Auth — `/api/auth`

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/register` | Đăng ký tài khoản (role: owner) | ❌ |
| POST | `/login` | Đăng nhập → access + refresh token | ❌ |
| POST | `/logout` | Xoá refresh token | ✅ |
| POST | `/refresh` | Cấp lại access token | ✅ |
| GET | `/me` | Lấy thông tin user hiện tại | ✅ |
| PATCH | `/me` | Cập nhật profile cá nhân | ✅ |
| PATCH | `/me/password` | Đổi mật khẩu | ✅ |

---

### 🏠 Homepage — `/api/homepage` (public)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/services` | Danh sách dịch vụ đang active | ❌ |
| GET | `/services/:id` | Chi tiết dịch vụ | ❌ |
| GET | `/doctors` | Danh sách bác sĩ (tên, ảnh, chuyên khoa) | ❌ |
| GET | `/doctors/:id` | Chi tiết bác sĩ | ❌ |
| GET | `/available-slots` | Slot trống theo bác sĩ & ngày `?doctor_id=&date=` | ❌ |

---

### 🐶 Pets — `/api/pets` (Owner)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/` | Danh sách chó của owner đang đăng nhập | ✅ owner |
| POST | `/` | Thêm chó mới | ✅ owner |
| GET | `/:id` | Chi tiết chó | ✅ owner |
| PATCH | `/:id` | Cập nhật thông tin chó | ✅ owner |
| DELETE | `/:id` | Xoá (soft delete `is_active=false`) | ✅ owner |
| GET | `/:id/medical-records` | Lịch sử bệnh án của chó | ✅ owner |
| GET | `/:id/vaccinations` | Lịch sử tiêm chủng | ✅ owner |
| GET | `/:id/appointments` | Lịch sử lịch hẹn | ✅ owner |

---

### 📅 Appointments — `/api/appointments`

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/` | Đặt lịch hẹn | ✅ owner |
| GET | `/` | Lịch hẹn của owner `?status=&date=` | ✅ owner |
| GET | `/:id` | Chi tiết lịch hẹn | ✅ owner/doctor |
| PATCH | `/:id/cancel` | Huỷ lịch hẹn | ✅ owner |

---

### 🩺 Doctor — `/api/doctor`

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/appointments` | Lịch hẹn của bác sĩ `?date=&status=` | ✅ doctor |
| PATCH | `/appointments/:id/status` | Xác nhận / từ chối / bắt đầu khám | ✅ doctor |
| POST | `/medical-records` | Tạo bệnh án sau buổi khám | ✅ doctor |
| GET | `/medical-records/:petId` | Toàn bộ bệnh án của một con chó | ✅ doctor |
| PATCH | `/medical-records/:id` | Cập nhật bệnh án | ✅ doctor |
| POST | `/vaccinations` | Ghi nhận tiêm vaccine | ✅ doctor |
| GET | `/vaccinations/:petId` | Lịch sử tiêm của chó | ✅ doctor |
| GET | `/patients` | Danh sách chó đã từng khám | ✅ doctor |

---

### 👤 Admin — `/api/admin`

#### Users

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/users` | Danh sách users `?role=&is_active=` | ✅ admin |
| POST | `/users` | Tạo tài khoản doctor hoặc admin | ✅ admin |
| GET | `/users/:id` | Chi tiết user | ✅ admin |
| PATCH | `/users/:id` | Cập nhật thông tin user | ✅ admin |
| PATCH | `/users/:id/role` | Đổi role | ✅ admin |
| PATCH | `/users/:id/status` | Khoá / mở khoá tài khoản | ✅ admin |

#### Services

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/services` | Tất cả dịch vụ (kể cả inactive) | ✅ admin |
| POST | `/services` | Tạo dịch vụ mới | ✅ admin |
| PATCH | `/services/:id` | Cập nhật dịch vụ | ✅ admin |
| DELETE | `/services/:id` | Xoá dịch vụ (soft delete) | ✅ admin |

#### Appointments

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/appointments` | Tất cả lịch hẹn `?status=&date=&doctor_id=` | ✅ admin |
| GET | `/appointments/:id` | Chi tiết lịch hẹn | ✅ admin |

#### Invoices

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/invoices` | Tất cả hoá đơn `?status=&from=&to=` | ✅ admin |
| GET | `/invoices/:id` | Chi tiết hoá đơn | ✅ admin |
| POST | `/invoices` | Tạo hoá đơn cho lịch hẹn | ✅ admin |
| PATCH | `/invoices/:id/status` | Cập nhật trạng thái thanh toán | ✅ admin |

#### Thống kê

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/stats/overview` | Tổng: users, pets, lịch hẹn, doanh thu tháng | ✅ admin |
| GET | `/stats/appointments` | Lịch hẹn theo ngày/tuần/tháng `?period=` | ✅ admin |
| GET | `/stats/revenue` | Doanh thu theo khoảng thời gian `?from=&to=` | ✅ admin |
| GET | `/stats/top-services` | Top dịch vụ được đặt nhiều nhất | ✅ admin |
| GET | `/stats/doctors` | Thống kê lịch hẹn theo từng bác sĩ | ✅ admin |

---

### 🔔 Notifications — `/api/notifications`

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/` | Danh sách thông báo của user | ✅ |
| PATCH | `/:id/read` | Đánh dấu đã đọc | ✅ |
| PATCH | `/read-all` | Đánh dấu tất cả đã đọc | ✅ |

---

## Middleware

```js
// Áp dụng theo thứ tự:
authMiddleware          // verify JWT → gắn req.user
roleGuard('admin')      // chỉ admin
roleGuard('doctor')     // chỉ bác sĩ
roleGuard('owner')      // chỉ owner
ownerPetGuard           // kiểm tra pet thuộc owner đang login
```

---

## Cấu trúc thư mục gợi ý

```
src/
├── config/
│   ├── db.js              # MongoDB connection
│   └── env.js
├── models/
│   ├── User.js
│   ├── Pet.js
│   ├── Service.js
│   ├── Appointment.js
│   ├── MedicalRecord.js
│   ├── Vaccination.js
│   ├── Invoice.js
│   └── Notification.js
├── routes/
│   ├── auth.routes.js
│   ├── homepage.routes.js
│   ├── pet.routes.js
│   ├── appointment.routes.js
│   ├── doctor.routes.js
│   ├── admin.routes.js
│   └── notification.routes.js
├── controllers/           # logic xử lý
├── middlewares/
│   ├── auth.middleware.js
│   └── role.middleware.js
├── services/              # business logic tách riêng
└── app.js
```
