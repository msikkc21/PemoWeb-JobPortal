import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Index() {
  const { profile, flash } = usePage().props;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Profil Perusahaan</h1>

      {flash?.success && (
        <div className="bg-green-100 text-green-700 p-2 rounded mb-4">
          {flash.success}
        </div>
      )}

      {!profile ? (
        <div className="text-gray-600">
          <p>Belum ada profil perusahaan.</p>
          <Link
            href={route('company_profiles.create')}
            className="text-blue-600 hover:underline"
          >
            Buat Profil
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          <p><strong>Nama:</strong> {profile.nama_perusahaan}</p>
          <p><strong>Industri:</strong> {profile.industri}</p>
          <p><strong>Deskripsi:</strong> {profile.deskripsi}</p>
          <p><strong>Lokasi:</strong> {profile.lokasi}</p>
          <p><strong>Website:</strong> {profile.website}</p>
          <p><strong>Email:</strong> {profile.email_perusahaan}</p>
          <p><strong>Telepon:</strong> {profile.telepon}</p>
          <p><strong>Jumlah Karyawan:</strong> {profile.jumlah_karyawan}</p>
          <p><strong>Tahun Dibentuk:</strong> {profile.tahun_dibentuk}</p>

          <Link
            href={route('company_profiles.edit', profile.id_perusahaan)}
            className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Edit Profil
          </Link>
        </div>
      )}
    </div>
  );
}
