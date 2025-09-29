import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// Komponen Pesan Notifikasi
const Message = ({ message, type }) => {
  if (!message) return null;

  const style =
    type === 'success'
      ? 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative'
      : 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative';

  return (
    <div className={`mb-4 ${style}`} role="alert">
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

// Helper untuk pastikan URL selalu benar
const getPhotoUrl = (path) => {
  if (!path) return "/default-avatar.png";
  if (path.startsWith("http")) return path; // kalau sudah full URL, langsung pakai
  return `http://192.168.1.102:81/storage/${path}`; // kalau path relatif, tambahin prefix
};

const KaryawanEdit = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();

  // State untuk data formulir
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
    foto_profile: '',
    foto_formal: '',
  });

  const [profileFile, setProfileFile] = useState(null);
  const [formalFile, setFormalFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  // Fungsi untuk pesan sementara
  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 3000);
  };

  // Ambil data karyawan
  useEffect(() => {
    const fetchEmployee = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Anda tidak memiliki token otentikasi. Silakan login.');
        setLoading(false);
        navigate('/auth/login');
        return;
      }

      try {
        const response = await axios.get(`/api/karyawan/${employeeId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          const employeeData = response.data;
          const formattedData = {
            ...employeeData,
            masuk_kerja: employeeData.masuk_kerja
              ? employeeData.masuk_kerja.split('T')[0]
              : '',
            ditetapkan: employeeData.ditetapkan
              ? employeeData.ditetapkan.split('T')[0]
              : '',
            tanggal_lahir: employeeData.tanggal_lahir
              ? employeeData.tanggal_lahir.split('T')[0]
              : '',
          };
          setFormData(formattedData);
        } else {
          setError('Data karyawan tidak ditemukan.');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching employee data:', err);
        setError('Gagal memuat data karyawan. Silakan coba lagi.');
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId, navigate]);

  // Handle input text
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle input file
  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (fileType === 'profile') {
      setProfileFile(file);
    } else if (fileType === 'formal') {
      setFormalFile(file);
    }
  };

  // Upload foto profil
  const handleUploadProfile = async (e) => {
    e.preventDefault();

    if (!profileFile) {
      showMessage('Pilih file foto profil terlebih dahulu!', 'error');
      return;
    }

    const formDataUpload = new FormData();
    formDataUpload.append('no_id', employeeId);
    formDataUpload.append('foto_profile', profileFile);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/karyawan/upload-profile-photo', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataUpload,
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('Foto profil berhasil diunggah!', 'success');
        setFormData((prev) => ({ ...prev, foto_profile: data.path }));
      } else {
        const errorMsg = data.message || 'Gagal upload foto profil';
        showMessage(errorMsg, 'error');
      }
    } catch (err) {
      console.error(err);
      showMessage('Terjadi kesalahan jaringan saat upload foto profil.', 'error');
    }
  };

  // Upload foto formal
  const handleUploadFormal = async (e) => {
    e.preventDefault();

    if (!formalFile) {
      showMessage('Pilih file foto formal terlebih dahulu!', 'error');
      return;
    }

    const formDataUpload = new FormData();
    formDataUpload.append('no_id', employeeId);
    formDataUpload.append('foto_formal', formalFile);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/karyawan/upload-formal-photo', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataUpload,
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('Foto formal berhasil diunggah!', 'success');
        setFormData((prev) => ({ ...prev, foto_formal: data.path }));
      } else {
        const errorMsg = data.message || 'Gagal upload foto formal';
        showMessage(errorMsg, 'error');
      }
    } catch (err) {
      console.error(err);
      showMessage('Terjadi kesalahan jaringan saat upload foto formal.', 'error');
    }
  };

  // Submit form (update data teks)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Anda tidak memiliki token otentikasi. Silakan login.');
      setLoading(false);
      navigate('/auth/login');
      return;
    }

    try {
      // copy formData
      const payload = { ...formData };

      // 🚫 Hapus field foto kalau masih berupa URL (belum ada upload baru)
      if (payload.foto_profile && payload.foto_profile.startsWith("http")) {
        delete payload.foto_profile;
      }
      if (payload.foto_formal && payload.foto_formal.startsWith("http")) {
        delete payload.foto_formal;
      }

      await axios.put(`/api/karyawan/${employeeId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showMessage('Data karyawan berhasil diperbarui!', 'success');
      setLoading(false);
      navigate('/karyawan/list');
    } catch (err) {
      console.error('Error updating employee data:', err);
      showMessage('Gagal memperbarui data karyawan. Silakan coba lagi.', 'error');
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-8">Sedang memuat data...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="bg-white shadow-xl rounded-2xl p-6 md:p-10">
        <h1 className="text-3xl font-bold text-center mb-6 text-black">
          Edit Data Karyawan
        </h1>
        <Message message={message} type={messageType} />

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Foto */}
          <div className="form-group col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Foto Profil */}
            <div className="flex flex-col items-center">
              <label className="block text-gray-700 font-bold mb-2">Foto Profil</label>
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-2 border-gray-300 shadow-md">
                {formData.foto_profile ? (
                  <img
                    src={getPhotoUrl(formData.foto_profile)}
                    alt="Foto Profil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <input
                type="file"
                name="foto_profile"
                onChange={(e) => handleFileChange(e, 'profile')}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
                          file:rounded-full file:border-0 file:text-sm file:font-semibold 
                          file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <button
                type="button"
                onClick={handleUploadProfile}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
              >
                Upload
              </button>
            </div>

            {/* Foto Formal */}
            <div className="flex flex-col items-center">
              <label className="block text-gray-700 font-bold mb-2">Foto Formal</label>
              <div className="w-32 h-32 rounded-lg overflow-hidden mb-4 border-2 border-gray-300 shadow-md">
                {formData.foto_formal ? (
                  <img
                    src={getPhotoUrl(formData.foto_formal)}
                    alt="Foto Formal"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <input
                type="file"
                name="foto_formal"
                onChange={(e) => handleFileChange(e, 'formal')}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
                          file:rounded-full file:border-0 file:text-sm file:font-semibold 
                          file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <button
                type="button"
                onClick={handleUploadFormal}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
              >
                Upload
              </button>
            </div>
          </div>

          {/* Semua field database */}
          {Object.keys(formData)
            .filter(
              (key) =>
                key !== 'foto_profile' &&
                key !== 'foto_formal' &&
                key !== 'riwayat_kesehatan'
            )
            .map((field) => (
              <div key={field} className="form-group">
                <label className="block text-gray-700 font-bold mb-2">
                  {field.replace(/_/g, ' ')}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field] || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

          {/* Riwayat Kesehatan */}
          <div className="form-group col-span-1 md:col-span-2 lg:col-span-3">
            <label className="block text-gray-700 font-bold mb-2">Riwayat Kesehatan</label>
            <textarea
              name="riwayat_kesehatan"
              value={formData.riwayat_kesehatan || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            ></textarea>
          </div>

          {/* Tombol Simpan */}
          <div className="flex justify-end space-x-4 col-span-1 md:col-span-2 lg:col-span-3 mt-6">
            <button
              type="button"
              onClick={() => navigate('/karyawan/list')}
              className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition duration-300"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
              disabled={loading}
            >
              {loading ? 'Memperbarui...' : 'Perbarui Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KaryawanEdit;
