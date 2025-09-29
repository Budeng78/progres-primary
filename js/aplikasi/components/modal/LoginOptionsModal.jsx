// resources/js/aplikasi/components/modal/LoginOptionsModal.jsx

import React from 'react';

// Tambahkan onOtp ke daftar props
const LoginOptionsModal = ({ isOpen, onClose, onLogin, onRegister, onOtp }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            ></div>
            <div className="relative bg-white rounded-lg p-6 w-80 shadow-lg z-10">
                <h2 className="text-lg font-semibold mb-4 text-center">Pilih Aksi</h2>
                <div className="space-y-3">
                    <button
                        onClick={onLogin}
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Login
                    </button>
                    <button
                        onClick={onRegister}
                        className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Register
                    </button>
                    {/* Tambahkan onClick handler untuk tombol OTP */}
                    <button
                        onClick={onOtp}
                        className="w-full py-2 px-4 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                        OTP
                    </button>
                </div>
                <button
                    onClick={onClose}
                    className="mt-4 text-sm text-gray-500 hover:text-gray-700 block mx-auto"
                >
                    Tutup
                </button>
            </div>
        </div>
    );
};

export default LoginOptionsModal;