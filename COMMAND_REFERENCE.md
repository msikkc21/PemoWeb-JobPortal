# 🔧 COMMAND REFERENCE - Copy & Paste untuk Jalankan

## 📋 PERSIAPAN AWAL (Jalankan ini terlebih dahulu!)

```powershell
# Clear semua cache
php artisan cache:clear

# Clear routes
php artisan route:clear

# Clear config
php artisan config:clear
```

**Output yang diharapkan:**
```
Application cache cleared.
Route cache cleared.
Configuration cache cleared.
```

---

## 🚀 MIGRATION (WAJIB!)

```powershell
# Run all pending migrations
php artisan migrate
```

**Output yang diharapkan:**
```
Migrating: 2025_11_16_add_rejection_reason_to_lowongans
Migrated: 2025_11_16_add_rejection_reason_to_lowongans (xx ms)
```

---

## ✅ VERIFIKASI

### Check Routes (Optional - untuk verifikasi)
```powershell
# Lihat semua admin routes
php artisan route:list | grep admin
```

**Output yang diharapkan (harus ada 11 routes):**
```
GET       /admin/dashboard                               → admin.dashboard
GET       /admin/skills                                  → admin.skills.index
POST      /admin/skills                                  → admin.skills.store
GET       /admin/skills/{id}/edit                        → admin.skills.edit
PUT       /admin/skills/{id}                             → admin.skills.update
DELETE    /admin/skills/{id}                             → admin.skills.destroy
GET       /admin/jobs/review                             → admin.jobs.review
GET       /admin/jobs/{id}                               → admin.jobs.show
POST      /admin/jobs/{id}/approve                       → admin.jobs.approve
POST      /admin/jobs/{id}/reject                        → admin.jobs.reject
GET       /admin/jobs/history                            → admin.jobs.history
```

### Check Database (Optional - untuk debug)
```powershell
# Buka tinker shell
php artisan tinker

# Lihat list of tables
> Schema::getTables();

# Check apakah migration berhasil
> Schema::getColumnListing('lowongans');

# Cek ada column rejection_reason?
> Schema::hasColumn('lowongans', 'rejection_reason');

# Cek data ada?
> App\Models\Lowongan::count();
> App\Models\Keahlian::count();
> App\Models\CompanyProfile::count();

# Exit tinker
> exit()
```

---

## 🧪 TEST DI BROWSER

### Test 1: Access Dashboard (Tanpa login - harus redirect)
```
URL: http://localhost:8000/admin/dashboard
Expected: Redirect ke login page
```

### Test 2: Login sebagai Admin
```
1. Go to: http://localhost:8000/login
2. Email: admin@jobportal.com
3. Password: password123
```

### Test 3: Access Dashboard (Setelah login)
```
URL: http://localhost:8000/admin/dashboard
Expected: 
├─ Total Perusahaan: 3
├─ Total Lowongan: 5
├─ Total Lamaran: 12
└─ Pending Review: 2
```

### Test 4: Skills Management
```
GET http://localhost:8000/admin/skills
├─ Expected: List of skills dengan pagination

POST http://localhost:8000/admin/skills
├─ Form: nama_keahlian, kategori, deskripsi
├─ Expected: Skill baru ditambah

PUT http://localhost:8000/admin/skills/{id}
├─ Expected: Skill di-update

DELETE http://localhost:8000/admin/skills/{id}
├─ Expected: Skill dihapus (jika tidak dipakai)
```

### Test 5: Job Review
```
GET http://localhost:8000/admin/jobs/review
├─ Expected: List pending jobs

POST http://localhost:8000/admin/jobs/{id}/approve
├─ Expected: Job status jadi 'approved'

POST http://localhost:8000/admin/jobs/{id}/reject
├─ Body: { "rejection_reason": "Deskripsi kurang lengkap..." }
├─ Expected: Job status jadi 'rejected' dengan reason

GET http://localhost:8000/admin/jobs/history
├─ Expected: List approved/rejected jobs
```

---

## 🔍 DEBUG COMMANDS

### Jika ada error, coba ini:

```powershell
# 1. Fresh cache clear
php artisan cache:clear
php artisan cache:forget "*"

# 2. Fresh routes
php artisan route:clear
php artisan route:cache

# 3. Fresh config
php artisan config:clear
php artisan config:cache

# 4. Check untuk error syntax
composer require laravel/framework --update-deep

# 5. Lihat error log
tail -f storage/logs/laravel.log

# 6. Run migration ulang (jika sudah run sebelumnya)
php artisan migrate:refresh --step=1

# 7. Seed database (jika perlu data test)
php artisan db:seed
```

---

## 🗄️ DATABASE COMMANDS

### Check & Debug Database

```powershell
# Buka tinker (interactive PHP shell)
php artisan tinker

# Di dalam tinker, jalankan ini:

# 1. List all tables
> DB::select("SHOW TABLES");

# 2. Check columns di lowongans
> Schema::getColumnListing('lowongans');

# 3. Check rejection_reason column ada?
> Schema::hasColumn('lowongans', 'rejection_reason');

# 4. Check data count
> App\Models\Lowongan::count();
> App\Models\Keahlian::count();
> App\Models\CompanyProfile::count();

# 5. Check first lowongan
> App\Models\Lowongan::first();

# 6. Check lowongan with company
> App\Models\Lowongan::with('company')->first();

# 7. Check lowongan with skills
> App\Models\Lowongan::with('skills')->first();

# 8. Check admin user
> App\Models\Pengguna::where('name', 'Admin JobPortal')->first();

# 9. Exit tinker
> exit()
```

---

## 📝 MIGRATION TROUBLESHOOTING

### Jika migration gagal:

```powershell
# 1. Check migration history
php artisan migrate:status

# 2. Rollback 1 step (undo last migration)
php artisan migrate:rollback --step=1

# 3. Rollback all
php artisan migrate:reset

# 4. Run migration again
php artisan migrate

# 5. Atau fresh migrate (reset + seed)
php artisan migrate:fresh --seed
```

---

## 🎓 USEFUL ARTISAN COMMANDS

```powershell
# Generate new migration
php artisan make:migration create_table_name --create=table_name

# Generate new model
php artisan make:model ModelName -m

# Generate new controller
php artisan make:controller ControllerName --model=ModelName

# List all routes
php artisan route:list

# Show specific routes
php artisan route:list --name=admin

# Generate API documentation
php artisan route:list --method=GET

# Tinker shell (interactive)
php artisan tinker

# Check Laravel version
php artisan --version

# Composer update
composer update

# Composer install
composer install

# NPM build (untuk assets)
npm run dev

# NPM production build
npm run build
```

---

## 🔐 PERMISSION & ROLE SETUP (Jika belum ada)

```powershell
# Buka tinker
php artisan tinker

# 1. Create Admin Role (jika belum ada)
> use App\Models\Role;
> $adminRole = Role::create(['name' => 'Admin']);

# 2. Create Admin Permission (jika belum ada)
> use App\Models\Permission;
> $permission = Permission::create(['name' => 'admin']);

# 3. Attach permission to role
> $adminRole->permissions()->attach($permission);

# 4. Check admin user
> use App\Models\Pengguna;
> $admin = Pengguna::where('name', 'Admin JobPortal')->first();
> $admin->role_id = $adminRole->id;
> $admin->save();

# 5. Verify
> $admin->role->name;  // Output: Admin
> $admin->role->permissions;  // Output: [Permission admin]

# 6. Exit
> exit()
```

---

## 📊 COMMON ERRORS & SOLUTIONS

### Error: "Column not found: rejection_reason"
```powershell
# Solution:
php artisan migrate
```

### Error: "MethodNotAllowedHttpException"
```powershell
# Solution:
php artisan route:clear
php artisan cache:clear
```

### Error: "Model not found"
```powershell
# Check namespace
php artisan route:list | grep admin

# Check model exists
php artisan tinker
> App\Models\Lowongan::all();
> exit()
```

### Error: "Access denied (403)"
```powershell
# Check user permissions
php artisan tinker
> $user = App\Models\Pengguna::first();
> $user->role->permissions;
> exit()
```

### Error: "SQLSTATE[HY000]: General error"
```powershell
# Try fresh migrate
php artisan migrate:fresh
```

---

## 🚀 PRODUCTION DEPLOYMENT

Sebelum deploy ke production:

```powershell
# 1. Update dependencies
composer update --no-dev

# 2. Install NPM packages
npm ci --production

# 3. Build assets
npm run build

# 4. Clear all cache
php artisan cache:clear
php artisan route:clear
php artisan config:clear
php artisan view:clear

# 5. Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 6. Run migrations (if needed)
php artisan migrate --force

# 7. Set production app key (if new)
php artisan key:generate

# 8. Restart queue/workers (if any)
php artisan queue:restart
```

---

## 📱 QUICK COPY-PASTE SEQUENCE

**Jalankan ini satu persatu:**

```powershell
# Step 1
php artisan cache:clear

# Step 2
php artisan route:clear

# Step 3
php artisan migrate

# Step 4 - Verification
php artisan route:list | grep admin

# Step 5 - Open browser
# http://localhost:8000/admin/dashboard
```

---

**Semua command sudah siap di-copy & di-paste ke terminal!** 🎉
