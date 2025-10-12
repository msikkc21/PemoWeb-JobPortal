import React from 'react';
import { useForm, Link } from '@inertiajs/react';

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    nama: '',
    jenis_kelamin: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    telepon: '',
    alamat: '',
    pendidikan: '',
    pengalaman: '',
    deskripsi: '',
    linkedin: '',
    github: '',
    portfolio: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('jobseeker_profiles.store'));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Buat Profil Pencari Kerja</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(data).map((field) => (
          <div key={field}>
            <label className="block font-semibold capitalize">{field.replace('_', ' ')}</label>
            <input
              type="text"
              value={data[field]}
              onChange={(e) => setData(field, e.target.value)}
              className="w-full border p-2 rounded"
            />
            {errors[field] && <div className="text-red-500 text-sm">{errors[field]}</div>}
          </div>
        ))}

        <button type="submit" disabled={processing} className="bg-blue-600 text-white px-4 py-2 rounded">
          Simpan
        </button>
        <Link href={route('jobseeker_profiles.index')} className="ml-3 text-gray-600 hover:underline">
          Batal
        </Link>
      </form>
    </div>
  );
}
