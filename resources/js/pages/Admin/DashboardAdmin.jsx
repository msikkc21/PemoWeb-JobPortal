import React from 'react';

export default function DashboardAdmin({ stats }) {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Admin</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white shadow rounded-lg text-center">
          <p className="text-gray-500 text-sm">Total Perusahaan</p>
          <p className="text-2xl font-semibold">{stats.total_perusahaan}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg text-center">
          <p className="text-gray-500 text-sm">Total Lowongan</p>
          <p className="text-2xl font-semibold">{stats.total_lowongan}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg text-center">
          <p className="text-gray-500 text-sm">Total Lamaran</p>
          <p className="text-2xl font-semibold">{stats.total_lamaran}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg text-center">
          <p className="text-gray-500 text-sm">Pending Review</p>
          <p className="text-2xl font-semibold text-yellow-600">{stats.pending_review}</p>
        </div>
      </div>
    </div>
  );
}
