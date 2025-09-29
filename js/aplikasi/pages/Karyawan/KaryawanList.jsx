import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaEllipsisV,
  FaPencilAlt,
  FaEye,
  FaTrashAlt,
  FaPlus,
  FaSearch,
} from "react-icons/fa";

const KaryawanList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const navigate = useNavigate();
  const dropdownRefs = useRef({});

  // daftar kolom dinamis
  const columns = [
    { key: "no", label: "No" },
    { key: "nama", label: "Nama" },
    { key: "sub_bagian", label: "Sub Bagian" },
    { key: "kelompok_kerja", label: "Kelompok Kerja" },
    { key: "masuk_kerja", label: "Tanggal Masuk" },
    { key: "ditetapkan", label: "Ditetapkan" },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    } catch {
      return dateString;
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 5000);
  };

  const getEmployees = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Anda tidak memiliki token otentikasi. Silakan login.");
      setLoading(false);
      navigate("/auth/login");
      return;
    }

    try {
      const response = await axios.get("/api/karyawan", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;
      if (Array.isArray(data)) {
        const formatted = data.map((employee) => ({
          ...employee,
          masuk_kerja: formatDate(employee.masuk_kerja),
          ditetapkan: formatDate(employee.ditetapkan),
        }));
        setEmployees(formatted);
        setFilteredEmployees(formatted);
      } else {
        throw new Error("Format data tidak sesuai, bukan array.");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Sesi Anda telah berakhir atau token tidak valid.");
        navigate("/auth/login");
      } else {
        setError("Gagal mengambil data karyawan. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    const filtered = employees.filter((emp) =>
      Object.values(emp).some((field) =>
        String(field).toLowerCase().includes(value)
      )
    );

    setFilteredEmployees(filtered);
  };

  const handleDeleteClick = (id) => {
    setEmployeeToDelete(id);
    setShowDeleteModal(true);
    setOpenDropdownId(null);
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false);
    if (!employeeToDelete) return;

    const token = localStorage.getItem("token");
    if (!token) {
      showNotification("Anda tidak memiliki token otentikasi.", "error");
      navigate("/auth/login");
      return;
    }

    try {
      await axios.delete(`/api/karyawan/${employeeToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = employees.filter(
        (emp) => emp.no_id !== employeeToDelete
      );
      setEmployees(updated);
      setFilteredEmployees(updated);
      showNotification("Data karyawan berhasil dihapus!", "success");
    } catch (err) {
      if (err.response?.status === 401) {
        showNotification("Sesi Anda telah berakhir.", "error");
        navigate("/auth/login");
      } else {
        showNotification("Gagal menghapus data karyawan.", "error");
      }
    } finally {
      setEmployeeToDelete(null);
    }
  };

  const handleDetail = (id) => {
    if (!id) return;
    navigate(`/karyawan/detail/${id}`);
    setOpenDropdownId(null);
  };

  const handleEdit = (id) => {
    navigate(`/karyawan/edit/${id}`);
    setOpenDropdownId(null);
  };

  const handleAdd = () => {
    navigate("/karyawan/create");
  };

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openDropdownId &&
        dropdownRefs.current[openDropdownId] &&
        !dropdownRefs.current[openDropdownId].contains(event.target)
      ) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdownId]);

  useEffect(() => {
    getEmployees();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
        <p className="ml-4 text-gray-700">Memuat data karyawan...</p>
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

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="bg-white shadow-xl rounded-2xl p-6 md:p-10 overflow-visible">
        <h1 className="text-lg font-bold text-center mb-6 text-black">
          Daftar Karyawan Primary
        </h1>

        {/* Search + Add */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
          <div className="flex items-center w-full md:w-1/3 bg-gray-100 rounded-full px-3 py-2 shadow-inner">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Cari karyawan..."
              value={search}
              onChange={handleSearch}
              className="bg-transparent w-full outline-none text-gray-700"
            />
          </div>

          <button
            onClick={handleAdd}
            className="flex items-center px-5 py-2 bg-indigo-600 text-white font-semibold text-base rounded-full shadow-md hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            <FaPlus className="mr-2" /> Karyawan
          </button>
        </div>

        {/* Notifikasi */}
        {notification.message && (
          <div
            className={`p-4 mb-4 rounded-lg text-center ${
              notification.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {notification.message}
          </div>
        )}

        {/* Tabel */}
        {filteredEmployees.length === 0 ? (
          <p className="text-center text-gray-500">
            Tidak ada data karyawan yang tersedia.
          </p>
        ) : (
          <div className="overflow-x-auto overflow-visible relative">
            <table className="min-w-full bg-white rounded-lg border-collapse text-sm relative overflow-visible">
              <thead className="bg-gray-100">
                <tr className="text-black uppercase font-semibold leading-normal">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="py-3 px-4 text-left border-b border-gray-300"
                    >
                      {col.label}
                    </th>
                  ))}
                  <th className="py-3 px-4 text-left border-b border-gray-300">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="text-black divide-y divide-gray-200">
                {filteredEmployees.map((employee, index) => (
                  <tr
                    key={employee.no_id || index}
                    className="hover:bg-gray-50 font-semibold"
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="py-3 px-4">
                        {col.key === "no"
                          ? index + 1
                          : employee[col.key] || "-"}
                      </td>
                    ))}

                    {/* Dropdown Aksi */}
                    <td className="py-3 px-4">
                      <div
                        className="relative"
                        ref={(el) => (dropdownRefs.current[employee.no_id] = el)}
                      >
                        <button
                          onClick={() => toggleDropdown(employee.no_id)}
                          className="p-1 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <FaEllipsisV className="w-4 h-4 text-gray-500" />
                        </button>
                        {openDropdownId === employee.no_id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                            <div className="py-1">
                              <button
                                onClick={() => handleDetail(employee.no_id)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <FaEye className="w-4 h-4 mr-2 text-blue-500" />{" "}
                                Detail
                              </button>
                              <button
                                onClick={() => handleEdit(employee.no_id)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <FaPencilAlt className="w-4 h-4 mr-2 text-yellow-500" />{" "}
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteClick(employee.no_id)
                                }
                                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                              >
                                <FaTrashAlt className="w-4 h-4 mr-2 text-red-600" />{" "}
                                Hapus
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Konfirmasi Delete */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Konfirmasi Hapus</h2>
            <p className="text-gray-700 mb-6">
              Apakah Anda yakin ingin menghapus data karyawan ini?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition duration-300"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KaryawanList;
