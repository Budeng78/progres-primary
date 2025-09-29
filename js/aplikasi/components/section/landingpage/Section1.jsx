// resources/js/aplikasi/components/section/landingpage/Section1.jsx

import { Link } from 'react-router-dom';

const Section1 = () => {
    return (
        // Hapus padding dari <section>
        // Batas kanan kiri akan diatur oleh p-4 di <main> dari DefaultLayout
        <section className="mt-1 mb-1 text-blue-800">
            <div className="w-full bg-white bg-opacity-80 rounded-xl shadow-xl p-6">
                <div className="grid grid-cols-5 gap-4 justify-center items-center">
                    {[
                        { icon: '🛒', label: 'Visi-Misi', path: '/section1/visi-misi' },
                        { icon: '🗂️', label: 'Archive', path: '#' },
                        { icon: '🎁', label: 'Promo', path: '#' },
                        { icon: '💬', label: 'Chat', path: '#' },
                        { icon: '📍', label: 'Lokasi', path: '#' },
                    ].map((item, index) => (
                        item.path ? (
                            <Link key={index} to={item.path} className="flex flex-col items-center">
                                <div className="text-xl border border-blue-400 bg-white/30 rounded-full px-4 py-3 shadow-md hover:scale-105 transition">
                                    {item.icon}
                                </div>
                                <span className="mt-1 text-[11px] sm:text-xs text-blue-900 font-medium">{item.label}</span>
                            </Link>
                        ) : (
                            <div key={index} className="flex flex-col items-center">
                                <div className="text-xl border border-blue-400 bg-white/30 rounded-full px-4 py-3 shadow-md hover:scale-105 transition">
                                    {item.icon}
                                </div>
                                <span className="mt-1 text-[11px] sm:text-xs text-blue-900 font-medium">{item.label}</span>
                            </div>
                        )
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Section1;