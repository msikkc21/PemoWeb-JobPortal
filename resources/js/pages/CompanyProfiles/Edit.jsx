import React from 'react';
import { useForm, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Edit({ auth }) {
  console.log(auth.user);
  const { profile } = usePage().props;
  const { data, setData, put, processing, errors } = useForm({
    company_name: profile?.company_name ?? '',
    industry: profile?.industry ?? '',
    description: profile?.description ?? '',
    location: profile?.location ?? '',
    website: profile?.website ?? '',
    company_email: profile?.company_email ?? '',
    phone: profile?.phone ?? '',
    address: profile?.address ?? '',
    employee_count: profile?.employee_count ?? '',
    founded_year: profile?.founded_year ?? '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route('company_profiles.update'), { preserveScroll: true });
  };

  const fieldLabels = {
    company_name: 'Nama Perusahaan',
    industry: 'Industri',
    description: 'Deskripsi',
    location: 'Lokasi',
    website: 'Website',
    company_email: 'Email Perusahaan',
    phone: 'Telepon',
    address: 'Alamat',
    employee_count: 'Jumlah Karyawan',
    founded_year: 'Tahun Berdiri',
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Edit Profil Perusahaan</h2>}
    >
      <Head title="Edit Profil Perusahaan" />

      <div className="py-6">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {Object.keys(data).map((field) => (
                    <div key={field} className={field === 'description' || field === 'address' ? 'sm:col-span-2' : ''}>
                      <InputLabel htmlFor={field} value={fieldLabels[field]} />
                      {field === 'description' || field === 'address' ? (
                        <textarea
                          id={field}
                          value={data[field] || ''}
                          onChange={(e) => setData(field, e.target.value)}
                          className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                          rows="4"
                        />
                      ) : (
                        <TextInput
                          id={field}
                          type={field === 'company_email' ? 'email' : field === 'employee_count' || field === 'founded_year' ? 'number' : 'text'}
                          value={data[field] || ''}
                          onChange={(e) => setData(field, e.target.value)}
                          className="mt-1 block w-full"
                        />
                      )}
                      <InputError message={errors[field]} className="mt-2" />
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <PrimaryButton disabled={processing}>
                    Update
                  </PrimaryButton>
                  <Link href={route('company_profiles.index')}>
                    <SecondaryButton type="button">
                      Batal
                    </SecondaryButton>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
