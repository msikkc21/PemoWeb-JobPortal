# 🎯 RINGKASAN VISUAL - ADMIN MODULE

## 📊 DIAGRAM ALUR NAVIGASI

```
LOGIN
  ↓
http://localhost:8000/admin/dashboard
  ↓
  ├─── DASHBOARD (Stats)
  │     ├─ Total Perusahaan: 3
  │     ├─ Total Lowongan: 5
  │     ├─ Total Lamaran: 12
  │     └─ Pending Review: 2
  │
  ├─── SKILLS MANAGEMENT
  │     ├─ GET /admin/skills → List all skills (with search)
  │     ├─ POST /admin/skills → Create new skill
  │     ├─ GET /admin/skills/{id}/edit → Show edit form
  │     ├─ PUT /admin/skills/{id} → Update skill
  │     └─ DELETE /admin/skills/{id} → Delete skill (cek usage)
  │
  └─── JOB REVIEW
        ├─ GET /admin/jobs/review → List pending jobs
        ├─ GET /admin/jobs/{id} → Show job detail
        ├─ POST /admin/jobs/{id}/approve → Approve & set date
        ├─ POST /admin/jobs/{id}/reject → Reject with reason
        └─ GET /admin/jobs/history → View approved/rejected jobs
```

---

## 🔗 DATABASE RELATIONSHIPS

```
CompanyProfile (id)
    ↓ 1:N
    ├─→ Lowongan (id_lowongan)
            ↓ N:N
            ├─→ Keahlian (id) via lowongan_keahlians pivot table
            │
            └─→ Lamaran (id_lamaran)

Keahlian (id)
    ↓ N:N
    ├─→ Lowongan via lowongan_keahlians
    └─→ JobSeekerProfile via pencari_kerja_keahlians
```

---

## 📋 API ENDPOINTS

### DASHBOARD
```
GET /admin/dashboard
├─ Auth: Required
├─ Permission: admin
└─ Response:
   {
     "stats": {
       "total_perusahaan": 3,
       "total_lowongan": 5,
       "total_lamaran": 12,
       "pending_review": 2
     }
   }
```

### SKILLS - LIST
```
GET /admin/skills?search=PHP&page=1
├─ Auth: Required
├─ Permission: admin
└─ Response:
   {
     "skills": [
       {
         "id": 1,
         "nama_keahlian": "PHP",
         "kategori": "Bahasa Pemrograman",
         "deskripsi": "Server-side language",
         "created_at": "2025-11-16 10:00:00"
       }
     ],
     "filters": { "search": "PHP" }
   }
```

### SKILLS - CREATE
```
POST /admin/skills
├─ Auth: Required
├─ Permission: admin
├─ Body:
│  {
│    "nama_keahlian": "React",          (required, unique)
│    "kategori": "Frontend Framework",  (optional)
│    "deskripsi": "JavaScript library"  (optional)
│  }
└─ Response: 201 Created
   { "message": "Keahlian berhasil ditambahkan." }
```

### JOBS - REVIEW LIST
```
GET /admin/jobs/review?search=PHP
├─ Auth: Required
├─ Permission: admin
├─ Status Filter: only status = 'pending_review'
└─ Response:
   {
     "jobs": [
       {
         "id_lowongan": 1,
         "judul": "Backend Developer",
         "deskripsi": "Cari backend dev...",
         "status": "pending_review",
         "company": {
           "id": 1,
           "nama_perusahaan": "PT Tech"
         },
         "skills": [
           { "id": 1, "nama_keahlian": "PHP" }
         ]
       }
     ]
   }
```

### JOBS - APPROVE
```
POST /admin/jobs/1/approve
├─ Auth: Required
├─ Permission: admin
├─ Body: {} (empty)
└─ Response: 200 OK
   {
     "id_lowongan": 1,
     "status": "approved",
     "tanggal_posting": "2025-11-16",
     "message": "Lowongan berhasil disetujui!"
   }
```

### JOBS - REJECT
```
POST /admin/jobs/1/reject
├─ Auth: Required
├─ Permission: admin
├─ Body:
│  {
│    "rejection_reason": "Deskripsi tidak lengkap..." (min 10 char)
│  }
└─ Response: 200 OK
   {
     "id_lowongan": 1,
     "status": "rejected",
     "rejection_reason": "Deskripsi tidak lengkap...",
     "message": "Lowongan berhasil ditolak!"
   }
```

### JOBS - HISTORY
```
GET /admin/jobs/history?status=approved&date_from=2025-11-01&date_to=2025-11-30
├─ Auth: Required
├─ Permission: admin
├─ Query Params:
│  - search: String (judul or nama_perusahaan)
│  - status: 'approved' atau 'rejected'
│  - date_from: YYYY-MM-DD
│  - date_to: YYYY-MM-DD
└─ Response:
   {
     "jobs": [
       {
         "id_lowongan": 1,
         "judul": "Backend Dev",
         "status": "approved",
         "tanggal_posting": "2025-11-16",
         "company": { "nama_perusahaan": "PT Tech" }
       }
     ],
     "filters": { "status": "approved" }
   }
```

---

## 🗂️ FILE STRUCTURE

```
app/
├── Models/
│   ├── Lowongan.php ...................... ✅ Fixed (pk, relationships, fields)
│   ├── Keahlian.php ....................... ✅ Fixed (table name, relationships)
│   └── CompanyProfile.php ................. ✅ Fixed (pk, relationships)
│
├── Http/
│   └── Controllers/
│       └── Admin/
│           ├── DashboardController.php .... ✅ OK
│           ├── SkillController.php ........ ✅ Fixed (field names, validation)
│           └── JobController.php .......... ✅ Fixed (method names, field names)
│
└── Providers/
    └── RouteServiceProvider.php .......... ✅ Loading modules/admin.php

database/
├── migrations/
│   └── 2025_11_16_add_rejection_reason_to_lowongans.php ✅ Created
│
└── seeders/
    └── (existing seeders) ................ ✅ No changes needed

routes/
├── web.php ............................... ✅ Fixed (removed duplicate admin routes)
├── modules/
│   └── admin.php ......................... ✅ Fixed (method names, comments)
└── auth.php .............................. ✅ No changes

resources/
└── js/pages/
    └── Admin/
        ├── Skills/
        │   ├── index.jsx ................. ⚠️ To be updated (field names)
        │   └── edit.jsx .................. ⚠️ To be updated (field names)
        └── Jobs/
            ├── Review.jsx ................ ⚠️ To be updated (field names)
            └── ApprovalHistory.jsx ....... ⚠️ To be updated (field names)

ADMIN_MODULE_DOCUMENTATION.md ............. ✅ Created (full doc)
QUICK_START.md ............................ ✅ Created (quick guide)
```

---

## 🔐 SECURITY CHECK

✅ **All protected with middleware:**
```php
Route::middleware(['auth', 'check.permission:admin'])
```

This means:
- ✅ User harus login (`auth` middleware)
- ✅ User harus punya permission 'admin' (`check.permission:admin`)
- ✅ Cannot bypass dengan direct URL

---

## 📝 VALIDATION RULES

### Skill Creation/Update
```
nama_keahlian: required | unique:keahlians,nama_keahlian
kategori: nullable | string
deskripsi: nullable | string
```

### Job Rejection
```
rejection_reason: required | string | min:10 characters
```

---

## 🚀 NEXT STEPS

1. **Run Migration**
   ```powershell
   php artisan migrate
   ```

2. **Clear Cache**
   ```powershell
   php artisan cache:clear && php artisan route:clear
   ```

3. **Test in Browser**
   ```
   http://localhost:8000/admin/dashboard
   ```

4. **Verify Routes**
   ```powershell
   php artisan route:list | grep admin
   ```

5. **Update React Components** (jika perlu di-sync dengan field database)
   - resources/js/pages/Admin/Skills/index.jsx
   - resources/js/pages/Admin/Skills/edit.jsx
   - resources/js/pages/Admin/Jobs/Review.jsx
   - resources/js/pages/Admin/Jobs/ApprovalHistory.jsx

---

Done! Your Admin Module is ready! 🎉
