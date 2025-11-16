# 🎨 REACT COMPONENTS - STATUS & NEXT STEPS

## 📌 CURRENT STATUS

Backend adalah **100% SELESAI** ✅
Frontend components masih perlu **sync dengan database field names** ⚠️

---

## 🔄 REACT COMPONENTS YANG PERLU DI-CHECK

### 1. Skills Components

#### ❓ `resources/js/pages/Admin/Skills/Index.jsx`

**Current Issue:**
```javascript
// Kemungkinan masih pakai field names yang salah
{skills.map(skill => (
  <tr>
    <td>{skill.name}</td>           // ❌ Harus: skill.nama_keahlian
    <td>{skill.description}</td>    // ❌ Harus: skill.deskripsi
  </tr>
))}
```

**Harus Diubah Jadi:**
```javascript
{skills.map(skill => (
  <tr>
    <td>{skill.nama_keahlian}</td>
    <td>{skill.kategori}</td>
    <td>{skill.deskripsi}</td>
  </tr>
))}
```

**Form Input:**
```javascript
// SEBELUM:
const { data, setData } = useForm({
  name: '',
  description: '',
});

// SESUDAH:
const { data, setData } = useForm({
  nama_keahlian: '',
  kategori: '',
  deskripsi: '',
});
```

---

#### ❓ `resources/js/pages/Admin/Skills/Edit.jsx`

**Current Issue:**
```javascript
const { data, setData, put } = useForm({
  name: skill.name || '',              // ❌ Harus: skill.nama_keahlian
  description: skill.description || '',  // ❌ Harus: skill.deskripsi
});
```

**Harus Diubah Jadi:**
```javascript
const { data, setData, put } = useForm({
  nama_keahlian: skill.nama_keahlian || '',
  kategori: skill.kategori || '',
  deskripsi: skill.deskripsi || '',
});
```

---

### 2. Job Components

#### ❓ `resources/js/pages/Admin/Jobs/Review.jsx`

**Current Issue:**
```javascript
{jobs.map(job => (
  <tr>
    <td>{job.title}</td>                    // ❌ Harus: job.judul
    <td>{job.description}</td>              // ❌ Harus: job.deskripsi
    <td>{job.company.name}</td>             // ❌ Harus: job.company.nama_perusahaan
    <td>{job.id}</td>                       // ❌ Harus: job.id_lowongan
    <button onClick={() => approve(job.id)}>  // ❌ Harus: job.id_lowongan
  </tr>
))}
```

**Harus Diubah Jadi:**
```javascript
{jobs.map(job => (
  <tr>
    <td>{job.judul}</td>
    <td>{job.deskripsi}</td>
    <td>{job.company.nama_perusahaan}</td>
    <td>{job.id_lowongan}</td>
    <button onClick={() => approve(job.id_lowongan)}>
  </tr>
))}
```

**Modal Detail:**
```javascript
// SEBELUM:
<p>Title: {selectedJob.title}</p>
<p>Description: {selectedJob.description}</p>
<p>Requirements: {selectedJob.requirements}</p>
<p>Company: {selectedJob.company.name}</p>
{selectedJob.skills.map(skill => (
  <span>{skill.name}</span>
))}

// SESUDAH:
<p>Title: {selectedJob.judul}</p>
<p>Description: {selectedJob.deskripsi}</p>
<p>Requirements: {selectedJob.persyaratan}</p>
<p>Company: {selectedJob.company.nama_perusahaan}</p>
{selectedJob.skills.map(skill => (
  <span>{skill.nama_keahlian}</span>
))}
```

**Approve Button:**
```javascript
// SEBELUM:
const handleApprove = (job) => {
  post(route('admin.jobs.approve', job.id), {
    onSuccess: () => alert('Approved: ' + job.title),
  });
};

// SESUDAH:
const handleApprove = (job) => {
  post(route('admin.jobs.approve', job.id_lowongan), {
    onSuccess: () => alert('Approved: ' + job.judul),
  });
};
```

---

#### ❓ `resources/js/pages/Admin/Jobs/ApprovalHistory.jsx`

**Current Issue:**
```javascript
{jobs.map(job => (
  <tr>
    <td>{job.title}</td>              // ❌ Harus: job.judul
    <td>{job.company.name}</td>       // ❌ Harus: job.company.nama_perusahaan
    <td>{job.status}</td>
    <td>{job.id}</td>                 // ❌ Harus: job.id_lowongan
  </tr>
))}
```

**Harus Diubah Jadi:**
```javascript
{jobs.map(job => (
  <tr>
    <td>{job.judul}</td>
    <td>{job.company.nama_perusahaan}</td>
    <td>{job.status}</td>
    <td>{job.id_lowongan}</td>
  </tr>
))}
```

---

## 📝 FIELD MAPPING REFERENCE

**Untuk Copy-Paste:**

```javascript
// Lowongan fields
job.id_lowongan          (bukan: job.id)
job.judul                (bukan: job.title)
job.deskripsi            (bukan: job.description)
job.persyaratan          (bukan: job.requirements)
job.gaji                 (bukan: job.salary)
job.lokasi               (bukan: job.location)
job.jenis_pekerjaan      (bukan: job.job_type)
job.level_pekerjaan      (bukan: job.level)
job.status               (OK - sama)
job.tanggal_posting      (bukan: job.posted_date)
job.tanggal_berakhir     (bukan: job.end_date)
job.rejection_reason     (bukan: job.reason)

// Company fields
job.company.id           (bukan: job.company.id_perusahaan)
job.company.nama_perusahaan  (bukan: job.company.name)
job.company.industri     (bukan: job.company.industry)
job.company.alamat       (bukan: job.company.address)
job.company.website      (OK - sama)

// Skill fields
skill.id                 (OK - sama)
skill.nama_keahlian      (bukan: skill.name)
skill.kategori           (bukan: skill.category)
skill.deskripsi          (bukan: skill.description)
```

---

## 🚀 PRIORITY: Mana Yang Harus Di-Update Dulu?

### HIGH PRIORITY ⭐⭐⭐
1. **`Admin/Jobs/Review.jsx`** - Yang paling sering dipakai admin
2. **`Admin/Jobs/ApprovalHistory.jsx`** - History tracking

### MEDIUM PRIORITY ⭐⭐
3. **`Admin/Skills/Index.jsx`** - Daftar skill
4. **`Admin/Skills/Edit.jsx`** - Edit skill

---

## ✋ JANGAN LUPA

### Ketika update form input:

```javascript
// SEBELUM FORM PAKAI:
const { data, setData, post } = useForm({
  name: '',
  description: '',
});

// SETELAH UBAH KE:
const { data, setData, post } = useForm({
  nama_keahlian: '',
  kategori: '',
  deskripsi: '',
});

// MAKA JUGA UBAH INPUT BINDING:
<input 
  value={data.name}              // ❌ SALAH
  onChange={e => setData('name', e.target.value)}
/>

// JADI:
<input 
  value={data.nama_keahlian}     // ✅ BENAR
  onChange={e => setData('nama_keahlian', e.target.value)}
/>
```

---

## 🔗 ROUTE NAMES TO USE

```javascript
// Skill routes
route('admin.skills.index')      // GET /admin/skills
route('admin.skills.store')      // POST /admin/skills
route('admin.skills.edit', id)   // GET /admin/skills/{id}/edit
route('admin.skills.update', id) // PUT /admin/skills/{id}
route('admin.skills.destroy', id) // DELETE /admin/skills/{id}

// Job routes
route('admin.jobs.review')            // GET /admin/jobs/review
route('admin.jobs.show', id)          // GET /admin/jobs/{id}
route('admin.jobs.approve', id)       // POST /admin/jobs/{id}/approve
route('admin.jobs.reject', id)        // POST /admin/jobs/{id}/reject
route('admin.jobs.history')           // GET /admin/jobs/history
route('admin.dashboard')              // GET /admin/dashboard
```

---

## ⚠️ COMMON MISTAKES TO AVOID

❌ **DON'T:**
```javascript
job.id              // Wrong primary key
job.title           // Wrong field name
skill.name          // Wrong field name
job.company.name    // Wrong field name
```

✅ **DO:**
```javascript
job.id_lowongan              // Correct primary key
job.judul                    // Correct field name
skill.nama_keahlian          // Correct field name
job.company.nama_perusahaan  // Correct field name
```

❌ **DON'T:**
```javascript
post(route('admin.jobs.approve', job.id))
```

✅ **DO:**
```javascript
post(route('admin.jobs.approve', job.id_lowongan))
```

---

## 📋 UPDATE CHECKLIST

- [ ] Update `Admin/Skills/Index.jsx` - all field references
- [ ] Update `Admin/Skills/Edit.jsx` - form fields & display
- [ ] Update `Admin/Jobs/Review.jsx` - table & modal
- [ ] Update `Admin/Jobs/ApprovalHistory.jsx` - table & filter
- [ ] Test all CRUD operations
- [ ] Verify no console errors
- [ ] Check data displays correctly

---

## 🎯 SUMMARY

**Backend:** ✅ 100% Done & Fixed
- Models with correct primary keys & relationships
- Controllers with correct field names
- Routes properly configured & protected
- Migration ready to run

**Frontend:** ⚠️ Ready to Update
- All field names need to be synced with database
- Use mapping guide above for reference
- Test each component after update

**Next Action:** Update React components with field names from mapping guide!
