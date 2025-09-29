import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const KaryawanCreate = () => {
    // Hook untuk navigasi
    const navigate = useNavigate();

    // State untuk menyimpan data formulir
    const [formData, setFormData] = useState({
        no_induk_absen: '',
        nama: '',
        status_upah: '',
        status_karyawan: '',
        masuk_kerja: '',
        masa_kerja: '',
        ditetapkan: '',
        bagian: '',
        sub_bagian: '',
        kelompok_kerja: '',
        pekerjaan: '',
        alamat_rt_rw: '',
        alamat_desa: '',
        alamat_kecamatan: '',
        alamat_kabupaten: '',
        no_nik: '',
        no_kk: '',
        kelamin: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        umur: '',
        pendidikan: '',
        disabilitas: '',
        kpi: '',
        no_bpjs_kes: '',
        no_kpj: '',
        no_hp: '',
        email: '',
        bank: '',
        no_bank: '',
        vaksin: '',
        riwayat_kesehatan: '',
    });

    // State untuk mengelola status loading, error, dan success message
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Fungsi untuk menangani perubahan pada input formulir
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        // Reset pesan error/success saat pengguna mulai mengetik
        if (error) setError(null);
        if (successMessage) setSuccessMessage(null);
    };

    // Fungsi untuk menangani pengiriman formulir
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        // Validasi kustom untuk memastikan semua bidang terisi
        const requiredFields = [
            'nama', 'kelompok_kerja', 'sub_bagian', 'masuk_kerja', 'ditetapkan', 
            'no_induk_absen', 'status_upah', 'status_karyawan', 'masa_kerja', 
            'bagian', 'pekerjaan', 'alamat_rt_rw', 'alamat_desa', 'alamat_kecamatan', 
            'alamat_kabupaten', 'no_nik', 'no_kk', 'kelamin', 'tempat_lahir', 
            'tanggal_lahir', 'umur', 'pendidikan', 'disabilitas', 'kpi', 
            'no_bpjs_kes', 'no_kpj', 'no_hp', 'email', 'bank', 'no_bank', 
            'vaksin', 'riwayat_kesehatan'
        ];
        
        for (const field of requiredFields) {
            if (!formData[field]) {
                setError(`Bidang ${field.replace(/_/g, ' ')} harus diisi.`);
                setLoading(false);
                return;
            }
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Autentikasi gagal. Silakan login kembali.');
            setLoading(false);
            navigate('/auth/login');
            return;
        }

        try {
            const response = await axios.post('/api/karyawan', formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (response.status === 201) {
                setSuccessMessage('Data karyawan berhasil ditambahkan!');
                // Mengosongkan formulir setelah berhasil
                setFormData({
                    no_induk_absen: '', nama: '', status_upah: '', status_karyawan: '',
                    masuk_kerja: '', masa_kerja: '', ditetapkan: '', bagian: '',
                    sub_bagian: '', kelompok_kerja: '', pekerjaan: '', alamat_rt_rw: '',
                    alamat_desa: '', alamat_kecamatan: '', alamat_kabupaten: '', no_nik: '',
                    no_kk: '', kelamin: '', tempat_lahir: '', tanggal_lahir: '',
                    umur: '', pendidikan: '', disabilitas: '', kpi: '', no_bpjs_kes: '',
                    no_kpj: '', no_hp: '', email: '', bank: '', no_bank: '', vaksin: '',
                    riwayat_kesehatan: '',
                });
            } else {
                setError('Gagal menambahkan data karyawan. Mohon coba lagi.');
            }
        } catch (err) {
            console.error("Error creating employee:", err.response ? err.response.data : err.message);
            if (err.response && err.response.status === 401) {
                setError('Sesi Anda telah berakhir. Silakan login kembali.');
                navigate('/auth/login');
            } else if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Terjadi kesalahan saat menyimpan data. Periksa koneksi atau coba lagi.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container h-16 mx-auto p-4 md:p-8">
            <div className="bg-white shadow-xl rounded-2xl p-6 md:p-10">
                <h1 className="text-2xl font-bold text-center mb-6 text-black">Tambah Data Karyawan</h1>
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => navigate('/karyawan/list')}
                        className="flex items-center px-5 py-2 bg-indigo-600 text-white font-semibold text-base rounded-full shadow-md hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z" />
                        </svg>
                        Kembali
                    </button>
                </div>
                {error && (
                    <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg text-center" role="alert">
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg text-center" role="alert">
                        {successMessage}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Input No Induk Absen */}
                        <div>
                            <label htmlFor="no_induk_absen" className="block text-sm font-medium text-gray-700">No Induk Absen</label>
                            <input type="text" id="no_induk_absen" name="no_induk_absen" value={formData.no_induk_absen} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        {/* Input Nama */}
                        <div>
                            <label htmlFor="nama" className="block text-sm font-medium text-gray-700">Nama</label>
                            <input type="text" id="nama" name="nama" value={formData.nama} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        {/* Input Status Upah */}
                        <div>
                            <label htmlFor="status_upah" className="block text-sm font-medium text-gray-700">Status Upah</label>
                            <input type="text" id="status_upah" name="status_upah" value={formData.status_upah} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        {/* Input Status Karyawan */}
                        <div>
                            <label htmlFor="status_karyawan" className="block text-sm font-medium text-gray-700">Status Karyawan</label>
                            <input type="text" id="status_karyawan" name="status_karyawan" value={formData.status_karyawan} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        {/* Input Tanggal Masuk */}
                        <div>
                            <label htmlFor="masuk_kerja" className="block text-sm font-medium text-gray-700">Tanggal Masuk</label>
                            <input type="date" id="masuk_kerja" name="masuk_kerja" value={formData.masuk_kerja} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        {/* Input Masa Kerja */}
                        <div>
                            <label htmlFor="masa_kerja" className="block text-sm font-medium text-gray-700">Masa Kerja</label>
                            <input type="text" id="masa_kerja" name="masa_kerja" value={formData.masa_kerja} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        {/* Input Ditetapkan */}
                        <div>
                            <label htmlFor="ditetapkan" className="block text-sm font-medium text-gray-700">Ditetapkan</label>
                            <input type="date" id="ditetapkan" name="ditetapkan" value={formData.ditetapkan} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        {/* Input Bagian */}
                        <div>
                            <label htmlFor="bagian" className="block text-sm font-medium text-gray-700">Bagian</label>
                            <input type="text" id="bagian" name="bagian" value={formData.bagian} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        {/* Input Sub Bagian */}
                        <div>
                            <label htmlFor="sub_bagian" className="block text-sm font-medium text-gray-700">Sub Bagian</label>
                            <input type="text" id="sub_bagian" name="sub_bagian" value={formData.sub_bagian} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        {/* Input Kelompok Kerja */}
                        <div>
                            <label htmlFor="kelompok_kerja" className="block text-sm font-medium text-gray-700">Kelompok Kerja</label>
                            <input type="text" id="kelompok_kerja" name="kelompok_kerja" value={formData.kelompok_kerja} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        {/* Input Pekerjaan */}
                        <div>
                            <label htmlFor="pekerjaan" className="block text-sm font-medium text-gray-700">Pekerjaan</label>
                            <input type="text" id="pekerjaan" name="pekerjaan" value={formData.pekerjaan} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        {/* Input Alamat RT/RW */}
                        <div>
                            <label htmlFor="alamat_rt_rw" className="block text-sm font-medium text-gray-700">Alamat RT/RW</label>
                            <input type="text" id="alamat_rt_rw" name="alamat_rt_rw" value={formData.alamat_rt_rw} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        {/* Input Alamat Desa */}
                        <div>
                            <label htmlFor="alamat_desa" className="block text-sm font-medium text-gray-700">Alamat Desa</label>
                            <input type="text" id="alamat_desa" name="alamat_desa" value={formData.alamat_desa} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        {/* Input Alamat Kecamatan */}
                        <div>
                            <label htmlFor="alamat_kecamatan" className="block text-sm font-medium text-gray-700">Alamat Kecamatan</label>
                            <input type="text" id="alamat_kecamatan" name="alamat_kecamatan" value={formData.alamat_kecamatan} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        {/* Input Alamat Kabupaten */}
                        <div>
                            <label htmlFor="alamat_kabupaten" className="block text-sm font-medium text-gray-700">Alamat Kabupaten</label>
                            <input type="text" id="alamat_kabupaten" name="alamat_kabupaten" value={formData.alamat_kabupaten} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        {/* Input No. NIK */}
                        <div>
                            <label htmlFor="no_nik" className="block text-sm font-medium text-gray-700">No. NIK</label>
                            <input type="text" id="no_nik" name="no_nik" value={formData.no_nik} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        {/* Input No. KK */}
                        <div>
                            <label htmlFor="no_kk" className="block text-sm font-medium text-gray-700">No. KK</label>
                            <input type="text" id="no_kk" name="no_kk" value={formData.no_kk} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        {/* Input Kelamin */}
                        <div>
                            <label htmlFor="kelamin" className="block text-sm font-medium text-gray-700">Kelamin</label>
                            <input type="text" id="kelamin" name="kelamin" value={formData.kelamin} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        {/* Input Tempat Lahir */}
                        <div>
                            <label htmlFor="tempat_lahir" className="block text-sm font-medium text-gray-700">Tempat Lahir</label>
                            <input type="text" id="tempat_lahir" name="tempat_lahir" value={formData.tempat_lahir} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        {/* Input Tanggal Lahir */}
                        <div>
                            <label htmlFor="tanggal_lahir" className="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
                            <input type="date" id="tanggal_lahir" name="tanggal_lahir" value={formData.tanggal_lahir} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        {/* Input Umur */}
                        <div>
                            <label htmlFor="umur" className="block text-sm font-medium text-gray-700">Umur</label>
                            <input type="number" id="umur" name="umur" value={formData.umur} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        {/* Input Pendidikan */}
                        <div>
                            <label htmlFor="pendidikan" className="block text-sm font-medium text-gray-700">Pendidikan</label>
                            <input type="text" id="pendidikan" name="pendidikan" value={formData.pendidikan} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        {/* Input Disabilitas */}
                        <div>
                            <label htmlFor="disabilitas" className="block text-sm font-medium text-gray-700">Disabilitas</label>
                            <input type="text" id="disabilitas" name="disabilitas" value={formData.disabilitas} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        {/* Input KPI */}
                        <div>
                            <label htmlFor="kpi" className="block text-sm font-medium text-gray-700">KPI</label>
                            <input type="text" id="kpi" name="kpi" value={formData.kpi} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        {/* Input No BPJS Kes */}
                        <div>
                            <label htmlFor="no_bpjs_kes" className="block text-sm font-medium text-gray-700">No. BPJS Kes</label>
                            <input type="text" id="no_bpjs_kes" name="no_bpjs_kes" value={formData.no_bpjs_kes} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        {/* Input No KPJ */}
                        <div>
                            <label htmlFor="no_kpj" className="block text-sm font-medium text-gray-700">No. KPJ</label>
                            <input type="text" id="no_kpj" name="no_kpj" value={formData.no_kpj} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        {/* Input No HP */}
                        <div>
                            <label htmlFor="no_hp" className="block text-sm font-medium text-gray-700">No. HP</label>
                            <input type="text" id="no_hp" name="no_hp" value={formData.no_hp} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        {/* Input Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        {/* Input Bank */}
                        <div>
                            <label htmlFor="bank" className="block text-sm font-medium text-gray-700">Bank</label>
                            <input type="text" id="bank" name="bank" value={formData.bank} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        {/* Input No Bank */}
                        <div>
                            <label htmlFor="no_bank" className="block text-sm font-medium text-gray-700">No. Rekening Bank</label>
                            <input type="text" id="no_bank" name="no_bank" value={formData.no_bank} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        {/* Input Vaksin */}
                        <div>
                            <label htmlFor="vaksin" className="block text-sm font-medium text-gray-700">Vaksin</label>
                            <input type="text" id="vaksin" name="vaksin" value={formData.vaksin} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        {/* Input Riwayat Kesehatan */}
                        <div>
                            <label htmlFor="riwayat_kesehatan" className="block text-sm font-medium text-gray-700">Riwayat Kesehatan</label>
                            <textarea id="riwayat_kesehatan" name="riwayat_kesehatan" value={formData.riwayat_kesehatan} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
                        </div>
                    </div>
                    <div className="flex justify-end mt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300`}
                        >
                            <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                            {loading ? 'Menyimpan...' : 'Simpan Data'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default KaryawanCreate;
