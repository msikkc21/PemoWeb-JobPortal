import { Head, Link, usePage } from '@inertiajs/react';

export default function About() {
    const { auth } = usePage().props;

    // Dashboard link based on role
    const role = auth?.user?.role?.name?.toLowerCase() || null;
    const dashboardHref =
        role === 'admin'
            ? '/admin/dashboard'
            : role === 'company'
                ? '/company/dashboard'
                : role === 'jobseeker'
                    ? '/jobseeker/dashboard'
                    : '/dashboard';

    const teamMembers = [
        {
            name: 'Ahmad Fauzi',
            role: 'Founder & CEO',
            image: null,
            description: 'Visioner dengan pengalaman 10+ tahun di industri rekrutmen.',
        },
        {
            name: 'Siti Nurhaliza',
            role: 'Head of Product',
            image: null,
            description: 'Product leader yang fokus pada user experience terbaik.',
        },
        {
            name: 'Budi Santoso',
            role: 'Head of Engineering',
            image: null,
            description: 'Tech enthusiast dengan passion di scalable systems.',
        },
    ];

    const stats = [
        { label: 'Tahun Berdiri', value: '2024' },
        { label: 'Perusahaan Partner', value: '500+' },
        { label: 'Lowongan Diposting', value: '10,000+' },
        { label: 'Pelamar Sukses', value: '25,000+' },
    ];

    const values = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            title: 'Kepercayaan',
            desc: 'Kami membangun platform yang transparan dan dapat diandalkan oleh semua pihak.',
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            title: 'Inovasi',
            desc: 'Terus berinovasi untuk memberikan pengalaman rekrutmen terbaik.',
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            title: 'Kolaborasi',
            desc: 'Menghubungkan talenta terbaik dengan perusahaan yang tepat.',
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            ),
            title: 'Kepedulian',
            desc: 'Peduli terhadap kesejahteraan dan perkembangan karier setiap pengguna.',
        },
    ];

    return (
        <>
            <Head title="Tentang Kami - JobPortal" />

            {/* Navbar - Matching Welcome.jsx style */}
            <header className="sticky top-0 z-20 border-b border-gray-100 bg-white/80 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <Link href="/" className="text-lg font-semibold text-gray-900 hover:text-gray-700">
                        <img src="/assets/Images/logo.png" alt="JobPortal" className="h-8 w-auto" />
                    </Link>
                    <div className="flex items-center gap-10">
                        <Link href="/" className="text-md text-gray-900 transition-all duration-200 hover:text-black hover:underline">
                            Homepage
                        </Link>
                        <Link href="/jobs" className="text-md text-gray-900 transition-all duration-200 hover:text-black hover:underline">
                            Jobs
                        </Link>
                        <Link href="/about" className="text-md font-semibold text-indigo-600 transition-all duration-200">
                            About Us
                        </Link>
                    </div>
                    <nav className="flex items-center gap-2 sm:gap-3">
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

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
                <div className="absolute inset-0 bg-[url('/assets/Images/pattern.svg')] opacity-10" />
                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Tentang JobPortal</h1>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                        Kami adalah platform rekrutmen terkemuka yang menghubungkan talenta terbaik Indonesia dengan perusahaan-perusahaan visioner.
                    </p>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <div className="text-4xl font-bold text-indigo-600 mb-2">{stat.value}</div>
                                <div className="text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Misi Kami</h2>
                            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                Mempermudah proses pencarian kerja dan rekrutmen dengan teknologi yang inovatif. Kami percaya bahwa setiap orang berhak mendapatkan pekerjaan yang sesuai dengan passion dan kemampuannya.
                            </p>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Dengan platform kami, perusahaan dapat menemukan kandidat terbaik dengan lebih efisien, sementara pencari kerja dapat mengakses ribuan peluang karier dari berbagai industri.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100 via-indigo-50 to-purple-100 rounded-3xl blur-2xl -z-10" />
                            <div className="bg-white rounded-2xl p-8 shadow-[0_14px_34px_rgba(0,0,0,0.08)] ring-1 ring-black/5">
                                <div className="aspect-video rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                                    <svg className="w-20 h-20 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Nilai-Nilai Kami</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Prinsip-prinsip yang menjadi fondasi dalam setiap langkah kami.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, idx) => (
                            <div
                                key={idx}
                                className="bg-gray-50 rounded-xl p-6 hover:shadow-[0_14px_34px_rgba(0,0,0,0.08)] transition"
                            >
                                <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                                    {value.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                                <p className="text-gray-600 text-sm">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Tim Kami</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Orang-orang hebat di balik kesuksesan JobPortal.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {teamMembers.map((member, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-xl p-6 shadow-[0_14px_34px_rgba(0,0,0,0.06)] ring-1 ring-black/5 text-center"
                            >
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mx-auto mb-4 flex items-center justify-center">
                                    <span className="text-3xl font-bold text-white">
                                        {member.name.charAt(0)}
                                    </span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                                <p className="text-indigo-600 font-medium mb-3">{member.role}</p>
                                <p className="text-gray-600 text-sm">{member.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 sm:p-12">
                        <div className="flex flex-col items-center text-center text-white">
                            <h3 className="text-3xl font-bold mb-4">Siap Memulai Perjalanan Kariermu?</h3>
                            <p className="text-blue-100 mb-8 max-w-2xl">
                                Bergabunglah dengan ribuan profesional yang telah menemukan pekerjaan impian mereka melalui JobPortal.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Link
                                    href="/jobs"
                                    className="rounded-lg bg-white px-6 py-3 font-medium text-gray-900 transition hover:bg-gray-100"
                                >
                                    Jelajahi Lowongan
                                </Link>
                                {!auth?.user && (
                                    <Link
                                        href={route('register')}
                                        className="rounded-lg border border-white/40 px-6 py-3 font-medium text-white backdrop-blur transition hover:bg-white/10"
                                    >
                                        Daftar Sekarang
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Hubungi Kami</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Punya pertanyaan? Tim kami siap membantu Anda.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="text-center">
                            <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                            <p className="text-gray-600">hello@jobportal.id</p>
                        </div>
                        <div className="text-center">
                            <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">Telepon</h3>
                            <p className="text-gray-600">+62 21 1234 5678</p>
                        </div>
                        <div className="text-center">
                            <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">Alamat</h3>
                            <p className="text-gray-600">Jakarta, Indonesia</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-400">© 2025 JobPortal. All rights reserved.</p>
                </div>
            </footer>
        </>
    );
}
