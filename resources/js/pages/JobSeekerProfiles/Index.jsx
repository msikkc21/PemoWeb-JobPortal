import React from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';

export default function Index() {
  const { profile, flash } = usePage().props;
  const { data, setData, post, processing, errors } = useForm({ resume: null });

  const handleUpload = (e) => {
    e.preventDefault();
    post(route('jobseeker_profiles.upload_resume'));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Profil Pencari Kerja</h1>

      {flash?.success && (
        <div className="bg-green-100 text-green-700 p-2 rounded mb-4">{flash.success}</div>
      )}

      {!profile ? (
        <div>
          <p>Belum ada profil.</p>
          <Link href={route('jobseeker_profiles.create')} className="text-blue-600 hover:underline">
            Buat Profil
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          <p><strong>Nama:</strong> {profile.nama}</p>
          <p><strong>Telepon:</strong> {profile.telepon}</p>
          <p><strong>Pendidikan:</strong> {profile.pendidikan}</p>
          <p><strong>Pengalaman:</strong> {profile.pengalaman}</p>
          <p><strong>Deskripsi:</strong> {profile.deskripsi}</p>

          <Link
            href={route('jobseeker_profiles.edit', profile.id_pencari)}
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded mt-4"
          >
            Edit Profil
          </Link>

          <hr className="my-4" />

          <form onSubmit={handleUpload} className="space-y-3">
            <label className="block font-semibold">Upload Resume (PDF/DOC)</label>
            <input
              type="file"
              onChange={(e) => setData('resume', e.target.files[0])}
              className="border p-2 rounded w-full"
            />
            {errors.resume && <div className="text-red-500">{errors.resume}</div>}
            <button
              type="submit"
              disabled={processing}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Upload & Parse
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
