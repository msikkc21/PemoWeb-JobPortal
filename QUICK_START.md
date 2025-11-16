# ⚡ QUICK START - JALANKAN ADMIN MODULE

## 🔴 PENTING: Jalankan Ini Terlebih Dahulu!

### 1️⃣ CLEAR CACHE (Jangan lewatkan!)
```powershell
php artisan cache:clear
php artisan route:clear
php artisan config:clear
```

### 2️⃣ RUN MIGRATION (Tambah rejection_reason column)
```powershell
php artisan migrate
```

**Expected output:**
```
Migrating: 2025_11_16_add_rejection_reason_to_lowongans
Migrated: 2025_11_16_add_rejection_reason_to_lowongans (xx ms)
```

---

## 🟢 TESTING

### 3️⃣ VERIFY ROUTES
```powershell
php artisan route:list | grep admin
```

**Harus show 11 routes** dengan prefix `/admin`

### 4️⃣ TEST DASHBOARD ACCESS
Buka di browser:
```
http://localhost:8000/admin/dashboard
```

**Apa yang harus terjadi:**
- ✅ Jika sudah login sebagai admin → lihat dashboard dengan stats
- ❌ Jika belum login → redirect ke login
- ❌ Jika bukan admin → error 403

---

## 📂 FILES YANG SUDAH DIUBAH/DIBUAT

| File | Status | Perubahan |
|---|---|---|
| `app/Models/Lowongan.php` | ✅ UPDATED | Primary key, relationships, fields |
| `app/Models/Keahlian.php` | ✅ UPDATED | Table name, relationships |
| `app/Models/CompanyProfile.php` | ✅ UPDATED | Primary key, relationships |
| `app/Http/Controllers/Admin/DashboardController.php` | ✅ OK | Sudah benar |
| `app/Http/Controllers/Admin/JobController.php` | ✅ UPDATED | Method names, field names, model |
| `app/Http/Controllers/Admin/SkillController.php` | ✅ UPDATED | Field names, validation, checks |
| `routes/modules/admin.php` | ✅ UPDATED | Added comments & fixed method names |
| `routes/web.php` | ✅ UPDATED | Removed duplicate admin routes |
| `database/migrations/2025_11_16_add_rejection_reason_to_lowongans.php` | ✅ CREATED | New migration |
| `ADMIN_MODULE_DOCUMENTATION.md` | ✅ CREATED | Full documentation |

---

## 🛠️ TROUBLESHOOTING

### ❓ Error: "No Application Found" saat run migration
**Solusi:**
```powershell
# Pastikan terminal di folder project root
cd "d:\KULIAH\SEMESTER 5\PEMROGRAMAN WEB\New folder\PemoWeb-JobPortal"
php artisan migrate
```

### ❓ Error: "SQLSTATE[42S22]: Column 'rejection_reason' not found"
**Solusi:**
```powershell
php artisan migrate:fresh  # Jalankan ulang semua migration
# ATAU jika tidak mau reset database:
php artisan migrate --force
```

### ❓ Dashboard masih tidak bisa diakses
**Debug:**
```powershell
# Check apakah middleware 'check.permission:admin' ada
grep -r "check.permission" app/
```

---

## ✅ DONE!

Sekarang Anda sudah punya:
- ✅ Admin Dashboard dengan statistik
- ✅ Skills CRUD (Tambah/Edit/Hapus Keahlian)
- ✅ Job Review (Approve/Reject Lowongan)
- ✅ Job History (Lihat riwayat approval)

Semua sudah terintegrasi dengan database & route yang benar! 🎉
