import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Index({ auth }) {
  const { profile, flash } = usePage().props;

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Profil Perusahaan</h2>}
    >
      <Head title="Profil Perusahaan" />

      <div className="py-6">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              {flash?.success && (
                <div className="mb-4 rounded-lg bg-green-100 p-4 text-sm text-green-800">
                  {flash.success}
                </div>
              )}

              {!profile ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p className="mt-4 text-sm font-medium text-gray-900">Belum ada profil perusahaan</p>
                  <p className="mt-1 text-sm text-gray-500">Lengkapi profil perusahaan Anda untuk mulai memposting lowongan</p>
                  <div className="mt-6">
                    <Link href={route('company_profiles.create')}>
                      <PrimaryButton>
                        Buat Profil
                      </PrimaryButton>
                    </Link>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{profile.nama_perusahaan}</h3>
                    {profile.is_approved ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                        ✓ Disetujui
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 mt-2">
                        ⏳ Menunggu Persetujuan
                      </span>
                    )}
                  </div>

                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Industri</dt>
                      <dd className="mt-1 text-sm text-gray-900">{profile.industri || '-'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Lokasi</dt>
                      <dd className="mt-1 text-sm text-gray-900">{profile.lokasi || '-'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Website</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {profile.website ? (
                          <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900">
                            {profile.website}
                          </a>
                        ) : '-'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="mt-1 text-sm text-gray-900">{profile.email_perusahaan || '-'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Telepon</dt>
                      <dd className="mt-1 text-sm text-gray-900">{profile.telepon || '-'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Jumlah Karyawan</dt>
                      <dd className="mt-1 text-sm text-gray-900">{profile.jumlah_karyawan || '-'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Tahun Berdiri</dt>
                      <dd className="mt-1 text-sm text-gray-900">{profile.tahun_dibentuk || '-'}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Alamat</dt>
                      <dd className="mt-1 text-sm text-gray-900">{profile.alamat || '-'}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Deskripsi</dt>
                      <dd className="mt-1 text-sm text-gray-900">{profile.deskripsi || '-'}</dd>
                    </div>
                  </dl>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <Link href={route('company_profiles.edit')}>
                      <PrimaryButton>
                        Edit Profil
                      </PrimaryButton>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
