// resources/js/aplikasi/components/modal/showWelcomeModal.jsx

import React, { useContext } from 'react';
import AuthContext from '@/aplikasi/auth/AuthContext'; // Impor AuthContext

const ShowWelcomeModal = ({ isOpen, onClose }) => {
    // Gunakan useContext untuk mengakses user dari AuthContext
    const { user } = useContext(AuthContext);
    // Hapus console.log untuk membersihkan output konsol
    // console.log("Nilai user di showWelcomeModal:", user);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl text-center">
                <h2 className="text-2xl font-bold text-green-600 mb-2">Selamat Datang!</h2>
                {/* Tampilkan nama pengguna jika tersedia */}
                {user && (
                    <p className="text-gray-700 font-medium mb-4">{user.name}</p>
                )}
                <p className="text-gray-700">Login berhasil.</p>
                {/* Tombol OK untuk menutup modal secara manual */}
                <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    OK
                </button>
            </div>
        </div>
    );
};

export default ShowWelcomeModal;