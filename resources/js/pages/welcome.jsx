import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Welcome({ auth }) {
    // Hero search state
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('');

    const onSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        if (location) params.set('loc', location);
        router.visit(`/jobs?${params.toString()}`);
    };

    const features = [
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14.5c-4.418 0-8 2.015-8 4.5v1h16v-1c0-2.485-3.582-4.5-8-4.5z"
                    />
                </svg>
            ),
            title: 'Profil Profesional',
            desc: 'Bangun profil yang dipercaya perusahaan dan dapatkan rekomendasi kerja yang relevan.',
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7h18M3 12h18M3 17h12" />
                </svg>
            ),
            title: 'Pencarian Cepat',
            desc: 'Filter berdasarkan posisi, lokasi, dan tipe kerja untuk temukan lowongan ideal.',
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: 'Perusahaan Terverifikasi',
            desc: 'Koleksi perusahaan tepercaya dengan informasi transparan dan proses yang jelas.',
        },
    ];

    const categories = [
        { name: 'Engineering', param: 'engineering' },
        { name: 'Design', param: 'design' },
        { name: 'Product', param: 'product' },
        { name: 'Marketing', param: 'marketing' },
        { name: 'Finance', param: 'finance' },
        { name: 'Operations', param: 'operations' },
    ];

    // Determine role and dashboard link
    const role = auth?.user?.role || (auth?.admin && 'admin') || (auth?.company && 'company') || (auth?.jobseeker && 'jobseeker') || null;

    const dashboardHref =
        role === 'admin'
            ? '/admin/dashboard'
            : role === 'company'
              ? '/company/dashboard'
              : role === 'jobseeker'
                ? '/jobseeker/dashboard'
                : '/dashboard'; // default/jobseeker

    return (
        <>
            <Head title="JobPortal - Temukan Pekerjaan Impianmu" />

            {/* Navbar */}
            <header className="sticky top-0 z-20 border-b border-gray-100 bg-white/80 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <Link href="/" className="text-lg font-semibold text-gray-900 hover:text-gray-700">
                        <img src="assets/Images/logo.png" alt="JobPortal" className="h-8 w-auto" />
                    </Link>
                    <div className="flex items-center gap-10">
                        <Link href="/" className="text-md text-gray-900 transition-all duration-200 hover:text-black hover:underline">
                            Homepage
                        </Link>
                        <Link href="/jobs" className="text-md text-gray-900 transition-all duration-200 hover:text-black hover:underline">
                            Jobs
                        </Link>
                        <Link href="/about" className="text-md text-gray-900 transition-all duration-200 hover:text-black hover:underline">
                            About Us
                        </Link>
                    </div>
                    <nav className="flex items-center gap-2 sm:gap-3">
                        {/* Left side shows logo and search */}
                        {/* Right side only shows auth actions */}
                        {auth?.user ? (
                            <Link href={dashboardHref} className="rounded-md bg-gray-900 px-3 py-2 text-sm text-white transition hover:bg-gray-800">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
                                >
                                    Login
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            {/* Hero */}
            <section className="relative overflow-hidden bg-gray-50">
                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-gray-50 to-white" />
                <div className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
                    <div className="grid items-center gap-10 lg:grid-cols-2">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Temukan Pekerjaan Impianmu</h1>
                            <p className="mt-4 text-base text-gray-600 sm:text-lg">
                                Jelajahi ribuan lowongan dari perusahaan terkemuka. Lamar cepat, dapatkan notifikasi, dan percepat kariermu.
                            </p>

                            <form
                                onSubmit={onSearch}
                                className="mt-8 rounded-xl bg-white p-3 shadow-[0_14px_34px_rgba(0,0,0,0.08)] ring-1 ring-black/5"
                            >
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <TextInput
                                        id="q"
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Cari posisi atau kata kunci (contoh: Frontend, UI/UX)"
                                        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                    <TextInput
                                        id="loc"
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="Lokasi (contoh: Jakarta, Remote)"
                                        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:max-w-xs"
                                    />
                                    <PrimaryButton type="submit" className="px-5 py-3">
                                        Cari Pekerjaan
                                    </PrimaryButton>
                                </div>
                                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                                    <span>Trending:</span>
                                    {['Backend', 'UI/UX', 'Data Analyst', 'Remote'].map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setQuery(t)}
                                            className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 hover:bg-gray-200"
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </form>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <Link href="/jobs" className="rounded-lg bg-gray-900 px-5 py-3 text-white transition hover:bg-gray-800">
                                    Jelajahi Lowongan
                                </Link>
                                {auth?.user && (
                                    <Link
                                        href={dashboardHref}
                                        className="rounded-lg border border-gray-200 px-5 py-3 text-gray-900 transition hover:bg-gray-50"
                                    >
                                        Ke Dashboard
                                    </Link>
                                )}
                            </div>

                            <div className="mt-8 grid grid-cols-3 gap-6 text-center sm:max-w-md sm:text-left">
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">12K+</div>
                                    <div className="text-sm text-gray-500">Lowongan aktif</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">3K+</div>
                                    <div className="text-sm text-gray-500">Perusahaan</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">98%</div>
                                    <div className="text-sm text-gray-500">Kepuasan pelamar</div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-blue-100 via-indigo-50 to-purple-100 blur-2xl" />
                            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_14px_34px_rgba(0,0,0,0.06)]">
                                <div className="aspect-[4/3] w-full rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 p-6">
                                    <div className="flex h-full w-full items-end justify-between rounded-lg bg-white/10 p-4 backdrop-blur">
                                        <div className="text-white">
                                            <div className="text-sm opacity-90">Contoh Lowongan</div>
                                            <div className="text-xl font-semibold">Frontend Engineer</div>
                                            <div className="text-sm opacity-90">Remote • Full-time</div>
                                        </div>
                                        <div className="rounded-md bg-white/20 px-3 py-1 text-sm text-white">Gaji Kompetitif</div>
                                    </div>
                                </div>
                                <div className="mt-4 grid grid-cols-3 gap-3">
                                    {/* ...mini cards... */}
                                    <div className="rounded-lg border border-gray-100 p-3">
                                        <div className="text-sm font-medium text-gray-900">UI/UX Designer</div>
                                        <div className="text-xs text-gray-500">Jakarta</div>
                                    </div>
                                    <div className="rounded-lg border border-gray-100 p-3">
                                        <div className="text-sm font-medium text-gray-900">Data Analyst</div>
                                        <div className="text-xs text-gray-500">Bandung</div>
                                    </div>
                                    <div className="rounded-lg border border-gray-100 p-3">
                                        <div className="text-sm font-medium text-gray-900">Backend Dev</div>
                                        <div className="text-xs text-gray-500">Remote</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="bg-white">
                <div className="mx-auto max-w-7xl px-6 py-14">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900">Kategori Populer</h2>
                            <p className="mt-1 text-sm text-gray-600">Telusuri lowongan berdasarkan kategori</p>
                        </div>
                        <Link href="/jobs" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                            Lihat semua
                        </Link>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {categories.map((c) => (
                            <Link
                                key={c.param}
                                href={`/jobs?category=${encodeURIComponent(c.param)}`}
                                className="group flex items-center justify-between rounded-lg border border-gray-100 bg-white p-5 transition hover:shadow-[0_14px_34px_rgba(0,0,0,0.06)]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex size-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="size-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{c.name}</div>
                                        <div className="text-xs text-gray-500">Ratusan lowongan</div>
                                    </div>
                                </div>
                                <svg
                                    className="size-5 text-gray-400 transition group-hover:translate-x-1 group-hover:text-gray-600"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="bg-gray-50">
                <div className="mx-auto max-w-7xl px-6 py-14">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">Kenapa JobPortal?</h2>
                        <p className="mt-2 text-gray-600">Alur lamaran yang sederhana, hasil yang maksimal.</p>
                    </div>

                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((f, idx) => (
                            <div
                                key={idx}
                                className="rounded-xl bg-white p-6 shadow-[0_14px_34px_rgba(0,0,0,0.08)] ring-1 ring-black/5 transition hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]"
                            >
                                <div className="flex size-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">{f.icon}</div>
                                <h3 className="mt-4 text-lg font-semibold text-gray-900">{f.title}</h3>
                                <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {/* CTA */}
            <section className="bg-white">
                <div className="mx-auto max-w-7xl px-6 pb-16 pt-6">
                    <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 sm:p-12">
                        <div className="flex flex-col items-start justify-between gap-6 text-white sm:flex-row sm:items-center">
                            <div>
                                <h3 className="text-2xl font-semibold">Mulai kariermu hari ini</h3>
                                <p className="mt-1 text-white/90">Buat akun dan temukan peluang terbaik untukmu.</p>
                            </div>
                            <div className="flex gap-3">
                                <Link href="/jobs" className="rounded-lg bg-white px-5 py-3 font-medium text-gray-900 transition hover:bg-gray-100">
                                    Jelajahi Lowongan
                                </Link>
                                {auth?.user ? (
                                    <Link
                                        href={dashboardHref}
                                        className="rounded-lg border border-white/40 px-5 py-3 font-medium text-white backdrop-blur transition hover:bg-white/10"
                                    >
                                        Ke Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href={route('register')}
                                        className="rounded-lg border border-white/40 px-5 py-3 font-medium text-white backdrop-blur transition hover:bg-white/10"
                                    >
                                        Buat Akun
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
