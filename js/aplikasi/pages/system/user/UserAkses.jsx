import React, { useState, useEffect, useRef } from "react";
import {
  FaPlus,
  FaSearch,
  FaEllipsisV,
  FaEye,
  FaPencilAlt,
  FaTrashAlt,
  FaPrint,
} from "react-icons/fa";
import { fetchUserAkses, deleteUserAkses, updateUserAkses } from "@/aplikasi/utils/apiUtils";
import ModalWrapper from "@/aplikasi/components/modal/ModalWrapper";

const UserAksesList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [modal, setModal] = useState({ type: null, data: null });

  // Dropdown state
  const [dropdown, setDropdown] = useState({ id: null, x: 0, y: 0 });
  const dropdownRef = useRef(null);

  const columns = [
    { key: "no", label: "No" },
    { key: "name", label: "Nama User" },
    { key: "email", label: "Email" },
    { key: "roles", label: "Roles" },
    { key: "permissions", label: "Permissions" },
  ];

  const getUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUserAkses();
      setUsers(data);
      setFilteredUsers(data);
    } catch {
      setError("Gagal mengambil data user.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // Close dropdown jika klik di luar
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdown({ id: null, x: 0, y: 0 });
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = users.filter((user) =>
      Object.values(user).some((field) =>
        field && typeof field === "object"
          ? Object.values(field).some(val => String(val).toLowerCase().includes(value))
          : String(field).toLowerCase().includes(value)
      )
    );
    setFilteredUsers(filtered);
  };

  const openModal = (type, data = null) => {
    setModal({ type, data });
    setDropdown({ id: null, x: 0, y: 0 });
  };
  const closeModal = () => setModal({ type: null, data: null });

  const confirmDelete = async () => {
    try {
      await deleteUserAkses(modal.data.id);
      const updated = users.filter((u) => u.id !== modal.data.id);
      setUsers(updated);
      setFilteredUsers(updated);
      closeModal();
    } catch {
      alert("Gagal menghapus user.");
    }
  };

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
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

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-black">Daftar User Sistem</h1>
      </div>

      <div className="bg-white shadow-xl rounded-2xl p-6 md:p-10 overflow-visible">
        {/* Search + Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3 no-print">
          <div className="flex items-center w-full md:w-1/3 bg-gray-100 rounded-full px-3 py-2 shadow-inner">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Cari user..."
              value={search}
              onChange={handleSearch}
              className="bg-transparent w-full outline-none text-gray-700"
            />
          </div>
          <div className="flex gap-3">
            <button
              className="flex items-center px-5 py-2 bg-indigo-600 text-white font-semibold text-base rounded-full shadow-md hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105"
            >
              <FaPlus className="mr-2" /> User
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center px-5 py-2 bg-green-600 text-white font-semibold text-base rounded-full shadow-md hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
            >
              <FaPrint className="mr-2" /> Print
            </button>
          </div>
        </div>

        {/* Table */}
        {filteredUsers.length === 0 ? (
          <p className="text-center text-gray-500">Tidak ada data user yang tersedia.</p>
        ) : (
          <div className="overflow-x-auto overflow-visible relative">
            <table className="min-w-full bg-white rounded-lg border-collapse text-sm relative overflow-visible">
              <thead className="bg-gray-100">
                <tr className="text-black uppercase font-semibold leading-normal">
                  {columns.map((col) => (
                    <th key={col.key} className="py-3 px-4 text-left border-b border-gray-300">
                      {col.label}
                    </th>
                  ))}
                  <th className="py-3 px-4 text-left border-b border-gray-300 no-print">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-black divide-y divide-gray-200">
                {filteredUsers.map((user, index) => (
                  <tr key={user.id || index} className="hover:bg-gray-50 font-semibold">
                    {columns.map((col) => (
                      <td key={col.key} className="py-3 px-4">
                        {col.key === "no"
                          ? index + 1
                          : Array.isArray(user[col.key])
                          ? user[col.key].join(", ")
                          : user[col.key] && typeof user[col.key] === "object"
                          ? Object.values(user[col.key]).join(", ")
                          : user[col.key] || "-"}
                      </td>
                    ))}
                    <td className="py-3 px-4 text-right relative no-print">
                      <button
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setDropdown({
                            id: user.id,
                            x: rect.right + window.scrollX - 160,
                            y: rect.bottom + window.scrollY + 5,
                          });
                        }}
                        className="p-2 rounded hover:bg-gray-200"
                      >
                        <FaEllipsisV />
                      </button>
                      {dropdown.id === user.id && (
                        <div
                          ref={dropdownRef}
                          className="fixed z-50 w-40 bg-white text-gray-900 shadow-xl rounded-xl py-2"
                          style={{ top: dropdown.y, left: dropdown.x }}
                        >
                          <button
                            onClick={() => openModal("detail", user)}
                            className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
                          >
                            <FaEye /> Detail
                          </button>
                          <button
                            onClick={() => openModal("edit", user)}
                            className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
                          >
                            <FaPencilAlt /> Edit
                          </button>
                          <button
                            onClick={() => openModal("delete", user)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50"
                          >
                            <FaTrashAlt /> Hapus
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Detail */}
      {modal.type === "detail" && (
        <ModalWrapper title="Detail User" onClose={closeModal} animate>
          <p><strong>Nama:</strong> {modal.data?.name}</p>
          <p><strong>Email:</strong> {modal.data?.email}</p>
          <p><strong>Roles:</strong> {Array.isArray(modal.data?.roles) ? modal.data.roles.join(", ") : "-"}</p>
          <p><strong>Permissions:</strong> {Array.isArray(modal.data?.permissions) ? modal.data.permissions.join(", ") : "-"}</p>
        </ModalWrapper>
      )}

      {/* Modal Edit */}
      {modal.type === "edit" && (
        <ModalWrapper title="Edit User" onClose={closeModal} animate>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const updated = {
                name: formData.get("name"),
                email: formData.get("email"),
                roles: formData.get("roles")?.split(",").map(r => r.trim()) || [],
                permissions: formData.get("permissions")?.split(",").map(p => p.trim()) || [],
              };
              await updateUserAkses(modal.data.id, updated);
              await getUsers();
              closeModal();
            }}
          >
            <input type="text" name="name" defaultValue={modal.data?.name} className="w-full border px-3 py-2 rounded mb-3" />
            <input type="email" name="email" defaultValue={modal.data?.email} className="w-full border px-3 py-2 rounded mb-3" />
            <input type="text" name="roles" defaultValue={modal.data?.roles?.join(", ")} placeholder="Roles (comma separated)" className="w-full border px-3 py-2 rounded mb-3" />
            <input type="text" name="permissions" defaultValue={modal.data?.permissions?.join(", ")} placeholder="Permissions (comma separated)" className="w-full border px-3 py-2 rounded mb-3" />
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Simpan</button>
          </form>
        </ModalWrapper>
      )}

      {/* Modal Delete */}
      {modal.type === "delete" && (
        <ModalWrapper title="Konfirmasi Hapus" onClose={closeModal} animate>
          <p className="text-gray-700 mb-6">Apakah Anda yakin ingin menghapus user <b>{modal.data?.name}</b>?</p>
          <div className="flex justify-end space-x-4">
            <button onClick={closeModal} className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400">Batal</button>
            <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700">Hapus</button>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
};

export default UserAksesList;
