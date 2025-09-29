import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundModal = ({ onClose }) => {
    const navigate = useNavigate();

    const handleClose = () => {
        if (onClose) {
            onClose();
        } else {
            // Kembali ke halaman utama jika tidak ada fungsi onClose yang diberikan
            navigate('/');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* The backdrop blur effect */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose} // Optional: You can add an onClick handler here to close the modal when clicking outside the content area.
            ></div>

            {/* The modal content container */}
            <div className="relative bg-white rounded-lg p-6 w-80 shadow-lg z-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Mohan Maaf</h2>
                <p className="text-gray-600 mb-6 text-2xl">
                    Maaf, halaman yang Anda tuju dalam proses pengembangan.
                </p>
                <button
                    onClick={handleClose}
                    className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
                >
                    Kembali ke Beranda
                </button>
            </div>
        </div>
    );
};

export default NotFoundModal;
