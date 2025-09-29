import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "@/aplikasi/components/ui/Card";
import CardContent from "@/aplikasi/components/ui/CardContent";

export default function KaryawanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth/login");
      return;
    }

    fetch(`/api/karyawan/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        setError("Gagal memuat detail karyawan");
        setLoading(false);
      });
  }, [id, navigate]);

  if (loading)
    return <p className="text-center mt-6 text-gray-600">Memuat data...</p>;
  if (error)
    return <p className="text-red-500 text-center mt-6 font-medium">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <Card className="shadow-xl rounded-2xl p-6 bg-white">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">{data.nama}</h1>

        {/* Foto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center items-center mb-6">
          {/* Foto Profil */}
          <div className="text-center">
            <img
              src={data.foto_profile || "/default-avatar.png"}
              alt="Foto Profil"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border shadow"
            />
            <p className="mt-2 text-gray-500 font-medium">Foto Profil</p>
          </div>

          {/* Foto Formal */}
          <div className="text-center">
            <img
              src={data.foto_formal || "/default-avatar.png"}
              alt="Foto Formal"
              className="w-32 h-32 md:w-40 md:h-40 rounded-lg object-cover border shadow"
            />
            <p className="mt-2 text-gray-500 font-medium">Foto Formal</p>
          </div>
        </div>

        {/* Detail */}
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(data).map(([key, value]) => {
              if (["foto_profile", "foto_formal", "id", "no_id"].includes(key))
                return null;
              return (
                <div key={key} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <span className="text-gray-500 text-sm">{key.replace(/_/g, " ")}</span>
                  <p className="text-gray-800 font-medium">{value || "-"}</p>
                </div>
              );
            })}
          </div>
        </CardContent>

        {/* Tombol Kembali */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => navigate("/karyawan/list")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Kembali
          </button>
        </div>
      </Card>
    </div>
  );
}
