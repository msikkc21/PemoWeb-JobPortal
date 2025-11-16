# 📚 DOKUMENTASI LENGKAP - ADMIN MODULE (DEV A)

## 🎯 RINGKASAN: APA YANG SUDAH DIPERBAIKI & DITAMBAHKAN

Saya telah memperbaiki dan melengkapi **Admin Module** Anda. Berikut adalah list lengkap perubahan:

---

## 📋 TABEL: MASALAH vs SOLUSI

| # | FILE | MASALAH LAMA | SOLUSI YANG DITERAPKAN | ALASAN PENTING |
|---|---|---|---|---|
| **1** | `Lowongan.php` | ❌ Tidak ada primary key explicit | ✅ Set `protected $primaryKey = 'id_lowongan'` | Table lowongans menggunakan `id_lowongan` bukan `id` |
| **1** | `Lowongan.php` | ❌ Tidak ada relationships | ✅ Tambah `company()`, `skills()`, `lamarans()` | Untuk eager loading & access data relasi |
| **1** | `Lowongan.php` | ❌ Field `rejection_reason` belum ada | ✅ Tambah ke fillable | Untuk menyimpan alasan tolak lowongan |
| **2** | `Keahlian.php` | ❌ Table name salah (`keahlian` bukan `keahlians`) | ✅ Ubah jadi `protected $table = 'keahlians'` | Sesuai dengan migration file |
| **2** | `Keahlian.php` | ❌ Tidak ada relationships | ✅ Tambah `lowongans()`, `jobSeekers()` | Untuk query relasi skills |
| **3** | `CompanyProfile.php` | ❌ Primary key salah (`id_perusahaan` bukan `id`) | ✅ Ubah jadi `protected $primaryKey = 'id'` | Sesuai dengan migration & foreign key |
| **3** | `CompanyProfile.php` | ❌ Tidak ada relationships | ✅ Tambah `lowongans()` | Untuk eager load lowongan perusahaan |
| **4** | `JobController.php` | ❌ Pakai model `JobPost` yang tidak ada | ✅ Ubah pakai `Lowongan` model | Model yang benar & sesuai database |
| **4** | `JobController.php` | ❌ Field query pakai `title`, `name` | ✅ Ubah jadi `judul`, `nama_perusahaan` | Sesuai dengan nama kolom database |
| **4** | `JobController.php` | ❌ Method names: `reviewIndex`, `historyIndex` | ✅ Ubah jadi `review`, `history` | Agar match dengan route definitions |
| **4** | `JobController.php` | ❌ Response pakai `id` bukan `id_lowongan` | ✅ Ubah response jadi `id_lowongan` | Return field yang sesuai primary key |
| **5** | `SkillController.php` | ❌ Field query pakai `name` bukan `nama_keahlian` | ✅ Ubah ke `nama_keahlian` | Sesuai database column |
| **5** | `SkillController.php` | ❌ Validasi table name salah (`keahlian` bukan `keahlians`) | ✅ Ubah jadi `keahlians` | Sesuai migration |
| **5** | `SkillController.php` | ❌ Tidak ada pengecekan skill masih dipakai | ✅ Tambah check untuk `lowongans()` & `jobSeekers()` | Cegah delete skill yang masih digunakan |
| **6** | `routes/modules/admin.php` | ❌ Kurang dokumentasi & penjelasan | ✅ Tambah komentar lengkap setiap route | Agar mudah dipahami orang lain |
| **7** | `routes/web.php` | ❌ Punya duplikat route admin | ✅ Hapus, pindah semua ke `modules/admin.php` | Hindari konflik & routing lebih bersih |
| **8** | `migration: rejection_reason` | ❌ Belum dibuat | ✅ Create migration baru untuk `rejection_reason` column | Untuk menyimpan alasan tolak lowongan |

---

## 🔍 PENJELASAN DETAIL: KENAPA SETIAP PERUBAHAN DIPERLUKAN

### **MASALAH 1: Route Conflict di web.php vs modules/admin.php**

**Sebelum:**
```
routes/web.php:
  - Route::get('/admin/dashboard', ...) → menggunakan middleware auth, verified
  - Route::get('/admin/skills', ...) → method reviewIndex()
  - dst

routes/modules/admin.php:
  - Route::get('/admin/dashboard', ...) → menggunakan middleware auth, check.permission:admin
  - Route::get('/admin/jobs/review', ...) → method review()
  - dst
```

**Problem:** Ada 2 route `/admin/dashboard` dengan middleware berbeda!
- web.php pakai middleware: `auth`, `verified`
- modules/admin.php pakai middleware: `auth`, `check.permission:admin`

**Solusi:** 
- ❌ Hapus SEMUA admin routes dari web.php
- ✅ Pakai HANYA routes dari modules/admin.php
- ✅ RouteServiceProvider sudah loading modules/admin.php otomatis

**Hasil akhir:**
- Admin dashboard hanya accessible untuk user dengan role `admin`
- Middleware `check.permission:admin` memastikan security

---

### **MASALAH 2: Model Primary Key & Table Name Salah**

#### Lowongan.php
```php
// SALAH (before):
class Lowongan extends Model {
    // Tidak define primary key → Laravel asumsikan 'id'
    // Tapi database punya 'id_lowongan'
}

// BENAR (after):
class Lowongan extends Model {
    protected $primaryKey = 'id_lowongan';  // ← PENTING!
    protected $table = 'lowongans';
}
```

**Kenapa penting?**
- Ketika query `Lowongan::find(5)` → Laravel cari `WHERE id_lowongan = 5`
- Kalau tidak di-set, Laravel cari `WHERE id = 5` → error!

#### Keahlian.php
```php
// SALAH (before):
protected $table = 'keahlian';  // ← Nama table salah!

// BENAR (after):
protected $table = 'keahlians'; // ← Sesuai migration file
```

#### CompanyProfile.php
```php
// SALAH (before):
protected $primaryKey = 'id_perusahaan';  // ← WRONG!

// BENAR (after):
protected $primaryKey = 'id';  // ← Foreign key di lowongans juga pakai 'id'
```

---

### **MASALAH 3: Database Field Names Tidak Konsisten**

**Controller query pakai nama field yang salah:**
```php
// SALAH (before):
$query->where('title', 'like', '%' . $search . '%');
// Tapi database punya 'judul', bukan 'title'

// BENAR (after):
$query->where('judul', 'like', '%' . $search . '%');
```

**Ini penting karena:**
- Database punya column `judul`, bukan `title`
- Query dengan field yang tidak ada = SQL error!

**List field database yang digunakan:**
| Model | Database Column | Bukan |
|---|---|---|
| Lowongan | `judul` | title ❌ |
| Lowongan | `deskripsi` | description ❌ |
| Lowongan | `id_lowongan` | id ❌ |
| Keahlian | `nama_keahlian` | name ❌ |
| Keahlian | `kategori` | category ❌ |
| CompanyProfile | `nama_perusahaan` | name ❌ |
| CompanyProfile | `id` | id_perusahaan ❌ |

---

### **MASALAH 4: Method Names Tidak Match Route**

```php
// routes/modules/admin.php:
Route::get('/jobs/review', [JobController::class, 'review'])

// JobController.php SALAH (before):
public function reviewIndex() { ... }  // ← Method name beda!

// JobController.php BENAR (after):
public function review() { ... }  // ← Match dengan route
```

**Error yang terjadi:**
```
MethodNotAllowedHttpException: The GET method is not supported for route admin.jobs.review
```

---

### **MASALAH 5: Middleware Check Permission**

**Route di modules/admin.php:**
```php
Route::middleware(['auth', 'check.permission:admin'])
```

**Ini berarti:**
1. `auth` → User harus login
2. `check.permission:admin` → User harus punya permission 'admin'

**Tanpa ini:**
- Siapa saja yang login bisa akses admin panel
- Database akan kacau karena siapa saja bisa ubah data

---

## 🚀 LANGKAH IMPLEMENTASI

### **STEP 1: Run Migration (WAJIB!)**
```bash
php artisan migrate
```

**Apa yang terjadi:**
- Tambah column `rejection_reason` ke table `lowongans`
- Column ini nullable (tidak wajib ada untuk setiap lowongan)

---

### **STEP 2: Verify Routes**
```bash
php artisan route:list | grep admin
```

**Output yang benar:** Should show 11 routes:
```
GET       /admin/dashboard             → admin.dashboard
GET       /admin/skills                → admin.skills.index
POST      /admin/skills                → admin.skills.store
GET       /admin/skills/{id}/edit      → admin.skills.edit
PUT       /admin/skills/{id}           → admin.skills.update
DELETE    /admin/skills/{id}           → admin.skills.destroy
GET       /admin/jobs/review           → admin.jobs.review
GET       /admin/jobs/{id}             → admin.jobs.show
POST      /admin/jobs/{id}/approve     → admin.jobs.approve
POST      /admin/jobs/{id}/reject      → admin.jobs.reject
GET       /admin/jobs/history          → admin.jobs.history
```

---

### **STEP 3: Test Navigate to Admin Dashboard**

**Di browser:**
```
http://localhost:8000/admin/dashboard
```

**Apa yang harus terjadi:**
1. ✅ Jika user login & punya role admin → tampilkan dashboard dengan stats
2. ❌ Jika user login tapi bukan admin → show error 403 (Forbidden)
3. ❌ Jika user belum login → redirect ke login page

---

### **STEP 4: Verify Database**

Check apakah migration jalan & column ada:
```bash
php artisan tinker
> Schema::getColumnListing('lowongans')
```

**Output harus include:**
```
"rejection_reason"  ← Column ini yang baru ditambah
```

---

## 📝 CHECKLIST: HAL-HAL YANG SUDAH BENAR

✅ **Models:**
- [x] Lowongan.php - Primary key, relationships, fields sesuai
- [x] Keahlian.php - Table name, relationships sesuai
- [x] CompanyProfile.php - Primary key, relationships sesuai

✅ **Controllers:**
- [x] DashboardController - Return stats dengan field yang benar
- [x] SkillController - CRUD dengan field database yang benar
- [x] JobController - Review/approve/reject/history dengan field database yang benar

✅ **Routes:**
- [x] routes/modules/admin.php - All routes defined with correct middleware
- [x] routes/web.php - Cleaned up (no duplicate admin routes)
- [x] RouteServiceProvider - Already loading modules/admin.php

✅ **Database:**
- [x] Migration for rejection_reason - Ready to run

---

## ⚠️ JIKA MASIH ADA ERROR

### Error 1: "MethodNotAllowedHttpException"
**Penyebab:** Cache route tidak ter-update
```bash
php artisan route:cache
php artisan route:clear
php artisan cache:clear
```

### Error 2: "SQLSTATE[42S22]: Column not found"
**Penyebab:** Migration belum di-run
```bash
php artisan migrate
```

### Error 3: "Access to admin denied (403)"
**Penyebab:** User tidak punya permission 'admin'
- Check database: `SELECT * FROM pengguna WHERE name = 'admin@jobportal.com'`
- Verify user punya role dengan permission 'admin'

### Error 4: "Model not found"
**Penyebab:** Model namespace salah atau file tidak ada
```bash
php artisan make:model ModelName -m  # Buat model baru
```

---

## 🎓 KESIMPULAN

Semua file sudah diperbaiki & siap digunakan. Yang perlu Anda lakukan:
1. **Run migration** → `php artisan migrate`
2. **Clear cache** → `php artisan cache:clear && php artisan route:clear`
3. **Test navigate** → Go to `/admin/dashboard`
4. **Cek database** → Pastikan tables & columns ada

Selamat! Admin module Anda sudah siap digunakan! 🎉
