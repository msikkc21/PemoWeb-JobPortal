import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

/**
 * Route Integration:
 * 
 * Add this to routes/web.php:
 * Route::get('/admin/users', function () {
 *     return Inertia::render('Admin/Users/Index', [
 *         'auth' => [
 *             'user' => Auth::user(),
 *         ],
 *     ]);
 * })->middleware(['auth', 'verified'])->name('admin.users');
 * 
 * NOTE: This is a view-only page using mock data, no API calls are made.
 */

export default function UsersIndex({ auth, users = null, meta = null, filters = {} }) {
    const { user } = auth || usePage().props.auth || {};
    
    // Mock data for development (will be replaced by real data from the backend)
    const mockUsers = [
        { id: 1, name: 'Admin User', email: 'admin@example.com', peran: 'Admin', status: 'active', created_at: '2025-09-01' },
        { id: 2, name: 'John Doe', email: 'john@example.com', peran: 'Pencari Kerja', status: 'active', created_at: '2025-09-02' },
        { id: 3, name: 'Jane Smith', email: 'jane@example.com', peran: 'Pencari Kerja', status: 'inactive', created_at: '2025-09-03' },
        { id: 4, name: 'ABC Company', email: 'company@example.com', peran: 'Perusahaan', status: 'pending', created_at: '2025-09-04' },
        { id: 5, name: 'XYZ Inc', email: 'xyz@example.com', peran: 'Perusahaan', status: 'active', created_at: '2025-09-05' },
    ];

    const mockMeta = {
        page: 1,
        perPage: 10,
        total: mockUsers.length
    };

    // Use provided data or fallback to mock data
    const displayUsers = users || mockUsers;
    const displayMeta = meta || mockMeta;

    // Filter state
    const [searchQuery, setSearchQuery] = useState(filters.q || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [roleFilter, setRoleFilter] = useState(filters.role || 'all');

    // Handle search and filter
    const handleSearch = (e) => {
        e.preventDefault();
        console.log({ q: searchQuery, status: statusFilter, role: roleFilter });
        // In a real application, this would trigger a request to the server
    };

    // Reset filters
    const handleReset = () => {
        setSearchQuery('');
        setStatusFilter('all');
        setRoleFilter('all');
        console.log('Filters reset');
    };

    // Handle pagination
    const handlePrevPage = () => {
        console.log('prev');
        // In a real application, this would navigate to the previous page
    };

    const handleNextPage = () => {
        console.log('next');
        // In a real application, this would navigate to the next page
    };

    // Handle user activation/deactivation
    const handleToggleStatus = (id, currentStatus, name) => {
        const action = currentStatus === 'active' ? 'deactivate' : 'activate';
        const confirmMessage = `Are you sure you want to ${action} user ${name}?`;
        
        if (window.confirm(confirmMessage)) {
            console.log({ action, id_pengguna: id });
            // In a real application, this would send a request to the server
        }
    };

    // Calculate total pages for pagination
    const totalPages = Math.ceil(displayMeta.total / displayMeta.perPage);

    // Admin access guard
    if (user?.role_id !== 1) {
        return (
            <AuthenticatedLayout
                header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Access Restricted</h2>}
            >
                <Head title="Admin - Users" />
                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                Akses terbatas (Admin saja)
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Admin - Users</h2>}
        >
            <Head title="Admin - Users" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Search and Filters */}
                            <div className="mb-6">
                                <form onSubmit={handleSearch} className="grid gap-4 md:grid-cols-4">
                                    <div>
                                        <label htmlFor="search" className="mb-1 block text-sm font-medium text-gray-700">
                                            Cari Nama / Email
                                        </label>
                                        <input
                                            type="text"
                                            id="search"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            aria-label="Search by name or email"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700">
                                            Status
                                        </label>
                                        <select
                                            id="status"
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            aria-label="Filter by status"
                                        >
                                            <option value="all">Semua</option>
                                            <option value="active">Aktif</option>
                                            <option value="inactive">Tidak Aktif</option>
                                            <option value="pending">Pending</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="role" className="mb-1 block text-sm font-medium text-gray-700">
                                            Peran
                                        </label>
                                        <select
                                            id="role"
                                            value={roleFilter}
                                            onChange={(e) => setRoleFilter(e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            aria-label="Filter by role"
                                        >
                                            <option value="all">Semua</option>
                                            <option value="Admin">Admin</option>
                                            <option value="Pencari Kerja">Pencari Kerja</option>
                                            <option value="Perusahaan">Perusahaan</option>
                                        </select>
                                    </div>
                                    
                                    <div className="flex items-end space-x-2">
                                        <button 
                                            type="submit"
                                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            Cari
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={handleReset}
                                            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </form>
                            </div>
                            
                            {/* Users Table */}
                            {displayUsers.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 border">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    No
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Nama
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Email
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Peran
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Status
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Dibuat
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {displayUsers.map((user, index) => (
                                                <tr key={user.id}>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {(displayMeta.page - 1) * displayMeta.perPage + index + 1}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                        {user.name}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {user.email}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {user.peran}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                                                            ${user.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                                                            ${user.status === 'inactive' ? 'bg-gray-100 text-gray-800' : ''}
                                                            ${user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                        `}>
                                                            {user.status === 'active' && 'Aktif'}
                                                            {user.status === 'inactive' && 'Tidak Aktif'}
                                                            {user.status === 'pending' && 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {user.created_at}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                        <div className="flex space-x-2">
                                                            {user.status !== 'active' && (
                                                                <button
                                                                    onClick={() => handleToggleStatus(user.id, user.status, user.name)}
                                                                    className="rounded bg-green-500 px-2 py-1 text-xs font-medium text-white hover:bg-green-600"
                                                                    aria-label={`Aktifkan pengguna ${user.name}`}
                                                                >
                                                                    Aktifkan
                                                                </button>
                                                            )}
                                                            {user.status !== 'inactive' && (
                                                                <button
                                                                    onClick={() => handleToggleStatus(user.id, user.status, user.name)}
                                                                    className="rounded bg-gray-500 px-2 py-1 text-xs font-medium text-white hover:bg-gray-600"
                                                                    aria-label={`Nonaktifkan pengguna ${user.name}`}
                                                                >
                                                                    Nonaktifkan
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="py-8 text-center">
                                    <p className="text-lg font-medium text-gray-700">Belum ada data</p>
                                    <p className="text-sm text-gray-500">Coba ubah filter atau cek kembali nanti.</p>
                                </div>
                            )}
                            
                            {/* Pagination */}
                            {displayUsers.length > 0 && (
                                <div className="mt-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Halaman {displayMeta.page} dari {totalPages}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={handlePrevPage}
                                            disabled={displayMeta.page <= 1}
                                            className={`rounded-md px-4 py-2 text-sm font-medium
                                                ${displayMeta.page <= 1
                                                    ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                                            `}
                                        >
                                            Prev
                                        </button>
                                        <button
                                            onClick={handleNextPage}
                                            disabled={displayMeta.page >= totalPages}
                                            className={`rounded-md px-4 py-2 text-sm font-medium
                                                ${displayMeta.page >= totalPages
                                                    ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                                            `}
                                        >
                                            Next
                                        </button>
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
