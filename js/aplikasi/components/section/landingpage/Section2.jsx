// resources/js/aplikasi/components/section/landingpage/Section2.jsx => untuk gambar gambar iklan

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Pastikan axios sudah terinstal

const Section2 = () => {
    const [iklanList, setIklanList] = useState([]);
    const [currentIklanIndex, setCurrentIklanIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Ambil data iklan dari API saat komponen dimuat
    useEffect(() => {
        const fetchIklan = async () => {
            try {
                // Ganti dengan URL endpoint API Laravel Anda
                const response = await axios.get('/api/iklan');
                setIklanList(response.data);
            } catch (err) {
                setError('Gagal memuat iklan.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchIklan();
    }, []);

    // Rotasi iklan secara acak setiap beberapa detik
    useEffect(() => {
        if (iklanList.length > 1) {
            const interval = setInterval(() => {
                // Pilih indeks acak yang berbeda dari indeks saat ini
                let nextIndex;
                do {
                    nextIndex = Math.floor(Math.random() * iklanList.length);
                } while (nextIndex === currentIklanIndex);

                setCurrentIklanIndex(nextIndex);
            }, 5000); // Ganti setiap 5 detik (5000ms)

            // Bersihkan interval saat komponen di-unmount
            return () => clearInterval(interval);
        }
    }, [iklanList, currentIklanIndex]);

    if (loading) {
        return <div className="text-center p-8">Memuat iklan...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-600">{error}</div>;
    }

    if (iklanList.length === 0) {
        return <div className="text-center p-8 text-gray-500">Tidak ada iklan yang tersedia.</div>;
    }

    const currentIklan = iklanList[currentIklanIndex];

    return (
        <div className="relative w-full h-80 overflow-hidden rounded-xl shadow-xl">
            <a href={currentIklan.link_url} target="_blank" rel="noopener noreferrer">
                <img
                    src={currentIklan.gambar_url}
                    alt={currentIklan.judul}
                    className="w-full h-full object-cover transition-opacity duration-1000"
                    // Anda bisa menambahkan animasi fade-in dengan kelas Tailwind
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-4 transition-opacity">
                    <div className="text-white">
                        <h2 className="text-2xl font-bold">{currentIklan.judul}</h2>
                        <p className="text-sm">{currentIklan.deskripsi}</p>
                    </div>
                </div>
            </a>
        </div>
    );
};

export default Section2;