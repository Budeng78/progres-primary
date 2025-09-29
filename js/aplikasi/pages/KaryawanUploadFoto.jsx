// resources/js/aplikasi/pages/KaryawanUploadFoto.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Komponen Notifikasi
const Message = ({ message, type }) => {
  if (!message) return null;
  return (
    <div
      className={`mt-4 p-3 rounded-lg font-bold text-center ${
        type === "success"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {message}
    </div>
  );
};

const KaryawanUploadFoto = () => {
  const [profileFile, setProfileFile] = useState(null);
  const [formalFile, setFormalFile] = useState(null);

  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();

  // helper pesan
  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 3000);
  };

  // Upload Foto Profil
  const handleUploadProfile = async (e) => {
    e.preventDefault();
    if (!profileFile) {
      showMessage("Pilih file foto profil terlebih dahulu!", "error");
      return;
    }

    const no_id = localStorage.getItem("no_id");
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("no_id", no_id);
    formData.append("foto_profile", profileFile);

    try {
      setIsUploading(true);
      const response = await fetch(
        "http://192.168.3.253:81/api/karyawan/upload-profile-photo",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        showMessage("✅ Foto profil berhasil diunggah!", "success");
        console.log("Foto profil:", data);
      } else {
        showMessage(data.message || "❌ Gagal upload foto profil", "error");
      }
    } catch (err) {
      console.error(err);
      showMessage("⚠️ Terjadi kesalahan jaringan saat upload foto profil.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  // Upload Foto Formal
  const handleUploadFormal = async (e) => {
    e.preventDefault();
    if (!formalFile) {
      showMessage("Pilih file foto formal terlebih dahulu!", "error");
      return;
    }

    const no_id = localStorage.getItem("no_id");
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("no_id", no_id);
    formData.append("foto_formal", formalFile);

    try {
      setIsUploading(true);
      const response = await fetch(
        "http://192.168.3.253:81/api/karyawan/upload-formal-photo",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        showMessage("✅ Foto formal berhasil diunggah!", "success");
        console.log("Foto formal:", data);
      } else {
        showMessage(data.message || "❌ Gagal upload foto formal", "error");
      }
    } catch (err) {
      console.error(err);
      showMessage("⚠️ Terjadi kesalahan jaringan saat upload foto formal.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          Uji API Unggah Foto
        </h1>
        <p className="text-gray-600 mb-6">
          Unggah foto profil & formal karyawan.
        </p>

        {/* Form Upload Foto Profil */}
        <form onSubmit={handleUploadProfile} className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Foto Profil</h2>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => setProfileFile(e.target.files[0])}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
          />
          <button
            type="submit"
            disabled={isUploading}
            className="w-full py-2 px-4 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700"
          >
            {isUploading ? "Mengunggah..." : "Unggah Foto Profil"}
          </button>
        </form>

        {/* Form Upload Foto Formal */}
        <form onSubmit={handleUploadFormal} className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Foto Formal</h2>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => setFormalFile(e.target.files[0])}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
          />
          <button
            type="submit"
            disabled={isUploading}
            className="w-full py-2 px-4 rounded-md font-semibold text-white bg-green-600 hover:bg-green-700"
          >
            {isUploading ? "Mengunggah..." : "Unggah Foto Formal"}
          </button>
        </form>

        {/* Notifikasi */}
        <Message message={message} type={messageType} />
      </div>
    </div>
  );
};

export default KaryawanUploadFoto;
