import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate untuk navigasi

// Komponen modal peringatan login yang lebih sederhana
const LoginRequiredModal = ({ isOpen, onClose }) => {
    // Gunakan hook useNavigate untuk mendapatkan fungsi navigasi
    const navigate = useNavigate();

    // Jika prop isOpen bernilai false, komponen ini tidak akan dirender
    if (!isOpen) {
        return null;
    }

    // Fungsi untuk menangani penutupan modal dan navigasi
    const handleCloseAndNavigate = () => {
        onClose(); // Panggil fungsi onClose untuk menutup modal
        navigate('/'); // Arahkan pengguna ke halaman utama (dianggap sebagai pages/LandingPage.jsx)
    };

    return (
        // Overlay yang menutupi layar dan membuat latar belakang blur
        <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
            // Mencegah modal menutup saat mengklik di area luar konten modal
            onClick={e => e.stopPropagation()}
        >
            {/* Konten utama modal */}
            <div
                className="relative p-6 bg-white rounded-lg shadow-xl max-w-sm mx-auto transform transition-all z-10"
                onClick={e => e.stopPropagation()}
            >
                {/* Ikon peringatan */}
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.332 16.5c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    {/* Judul modal */}
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mt-3">Akses Dibatasi</h3>
                    {/* Pesan modal */}
                    <div className="mt-2 px-7 py-3">
                        <p className="text-sm text-gray-500">
                            Maaf, halaman ini diharuskan Login terlebih dahulu.
                        </p>
                    </div>
                </div>
                {/* Tombol untuk menutup modal dan navigasi */}
                <div className="mt-4 text-center">
                    <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none"
                        onClick={handleCloseAndNavigate} // Panggil fungsi baru
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginRequiredModal;
