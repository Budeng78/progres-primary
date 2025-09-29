import React, { useState, useEffect } from "react";
import axios from "@/aplikasi/utils/axios"; // pastikan path sesuai
import { FaSpinner } from "react-icons/fa";

const UserInfo = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post("/api/UserInfo");
      setUser(res.data); // pastikan API mengembalikan object
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data user.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-3xl text-purple-600" />
        <p className="ml-4 text-gray-700">Memuat data user...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        <p>Data user tidak tersedia.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="bg-white shadow-xl rounded-2xl p-6 md:p-10">
        <h1 className="text-lg font-bold text-center mb-6">Informasi User</h1>

        <div className="mb-4">
          <p>
            <span className="font-semibold">Nama:</span> {user.name || "-"}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {user.email || "-"}
          </p>
        </div>

        <div className="mb-4">
          <h2 className="font-semibold mb-2">Roles:</h2>
          {user.roles && user.roles.length > 0 ? (
            <ul className="list-disc list-inside">
              {user.roles.map((role, idx) => (
                <li key={idx}>{role}</li>
              ))}
            </ul>
          ) : (
            <p>-</p>
          )}
        </div>

        <div className="mb-4">
          <h2 className="font-semibold mb-2">Permissions:</h2>
          {user.permissions && user.permissions.length > 0 ? (
            <ul className="list-disc list-inside">
              {user.permissions.map((perm, idx) => (
                <li key={idx}>{perm}</li>
              ))}
            </ul>
          ) : (
            <p>-</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
