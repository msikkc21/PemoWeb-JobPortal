import React from 'react';
import { useForm, Link, usePage } from '@inertiajs/react';

export default function Edit() {
  const { profile } = usePage().props;
  const { data, setData, put, processing, errors } = useForm({
    nama_perusahaan: profile.nama_perusahaan || '',
    industri: profile.industri || '',
    deskripsi: profile.deskripsi || '',
    lokasi: profile.lokasi || '',
    website: profile.website || '',
    email_perusahaan: profile.email_perusahaan || '',
    telepon: profile.telepon || '',
    alamat: profile.alamat || '',
    jumlah_karyawan: profile.jumlah_karyawan || '',
    tahun_dibentuk: profile.tahun_dibentuk || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route('company_profiles.update', profile.id_perusahaan));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Profil Perusahaan</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(data).map((field) => (
          <div key={field}>
            <label className="block font-semibold capitalize">{field.replace('_', ' ')}</label>
            <input
              type="text"
              value={data[field] || ''}
              onChange={(e) => setData(field, e.target.value)}
              className="w-full border p-2 rounded"
            />
            {errors[field] && <div className="text-red-500 text-sm">{errors[field]}</div>}
          </div>
        ))}

        <button
          type="submit"
          disabled={processing}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update
        </button>
        <Link href={route('company_profiles.index')} className="ml-3 text-gray-600 hover:underline">
          Batal
        </Link>
      </form>
    </div>
  );
}
