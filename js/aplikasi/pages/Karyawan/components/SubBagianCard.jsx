import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaClipboardList } from 'react-icons/fa';


// Komponen kartu untuk menampilkan rekapitulasi per sub-bagian
const SubBagianCard = ({ sub_bagian, kelompok_kerja, icon }) => {
    // Menghitung total jumlah karyawan dari semua jenis kelamin
    const total = (kelompok_kerja || []).reduce(
        (acc, k) => acc + (k.laki_laki || 0) + (k.perempuan || 0) + (k.lainnya || 0), 
        0
    );

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 transition-transform transform hover:scale-105">
            {/* Header dengan ikon dan judul */}
            <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-gray-100">
                    {icon} {/* Menampilkan ikon yang diterima dari props */}
                </div>
                <div className="ml-4">
                    <h2 className="text-lg font-bold text-black">{sub_bagian}</h2>
                    <p className="text-sm text-gray-500">Total Kelompok Kerja: {(kelompok_kerja || []).length}</p>
                </div>
            </div>

            {/* Detail Kelompok Kerja */}
            <div className="mt-4 border-t pt-4">
                {(kelompok_kerja || []).map((k, i) => {
                    const lakiLaki = k.laki_laki || 0;
                    const perempuan = k.perempuan || 0;
                    const lainnya = k.lainnya || 0;
                    const totalKelompok = lakiLaki + perempuan + lainnya;
                    
                    // Menghitung persentase untuk progress bar
                    const lakiLakiPercentage = totalKelompok > 0 ? (lakiLaki / totalKelompok) * 100 : 0;
                    
                    return (
                        <div key={k.nama || i} className="mb-4"> {/* Menggunakan k.nama sebagai key yang lebih unik */}
                            <h3 className="font-semibold text-gray-700">{k.nama || 'Tidak Diketahui'}</h3>
                            <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                                <span>L: {lakiLaki} | P: {perempuan} | L: {lainnya}</span>
                                <span className="font-bold">Total: {totalKelompok}</span>
                            </div>
                            {/* Progress bar untuk laki-laki */}
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full"
                                    style={{ width: `${lakiLakiPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
             {/* Total Keseluruhan di bagian bawah kartu */}
            <div className="mt-2 font-bold text-black text-right">
                Total: {total}
            </div>
        </div>
    );
};

// Komponen utama
const RekapSubbagianCards = () => {
    // State untuk menyimpan data rekapitulasi dari API
    const [rekapData, setRekapData] = useState([]);
    // State untuk status loading
    const [loading, setLoading] = useState(true);
    // State untuk pesan error
    const [error, setError] = useState(null);

    // Ikon-ikon untuk setiap sub-bagian
    const icons = {
        'Produksi': <FaClipboardList className="h-6 w-6 text-pink-500" />,
        'Web Design': <FaClipboardList className="h-6 w-6 text-green-500" />,
        'Keuangan': <FaClipboardList className="h-6 w-6 text-blue-500" />,
        'HRD': <FaClipboardList className="h-6 w-6 text-yellow-500" />,
        'Tidak Diketahui': <FaClipboardList className="h-6 w-6 text-gray-500" />,
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Panggil endpoint API yang sudah kita buat
                const response = await axios.get('/api/rekap-subbagian');
                setRekapData(response.data);
            } catch (err) {
                // Tangani error jika gagal memuat data
                setError('Gagal memuat data rekapitulasi. Silakan coba lagi nanti.');
                console.error('API Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Tampilan saat data sedang dimuat
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                <p className="ml-4 text-gray-700">Memuat data rekapitulasi...</p>
            </div>
        );
    }

    // Tampilan saat terjadi error
    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    // Tampilan saat tidak ada data
    if (rekapData.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-gray-500">Tidak ada data rekapitulasi untuk ditampilkan.</p>
            </div>
        );
    }

    // Tampilan utama
    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">Rekapitulasi Karyawan per Sub Bagian</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {rekapData.map((subbagian, index) => (
                    // Menggunakan komponen SubBagianCard untuk merender setiap item
                    <SubBagianCard 
                        key={index}
                        sub_bagian={subbagian.sub_bagian}
                        kelompok_kerja={subbagian.kelompok_kerja}
                        icon={icons[subbagian.sub_bagian]}
                    />
                ))}
            </div>
        </div>
    );
};

export default RekapSubbagianCards;
