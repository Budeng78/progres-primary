// resources/js/aplikasi/pages/system/PermissionList.jsx

import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { FaPlus, FaPrint, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import {
  fetchPermissions,
  createPermission,
  updatePermission,
  deletePermission,
} from "@/aplikasi/utils/system/permission";
import ModalWrapper from "@/aplikasi/components/modal/ModalWrapper";
import ActionDropdown from "@/aplikasi/components/dropdown/ActionDropdown";
import "@/aplikasi/css/standar-print.css";

// =======================
// Form Permission (create/edit/detail)
// =======================
const PermissionForm = ({ data = {}, readOnly = false, onSubmit }) => {
  const [form, setForm] = useState({
    name: data.name || "",
    guard_name: data.guard_name || "",
    deskripsi: data.deskripsi || "",
  });

  useEffect(() => {
    setForm({
      name: data.name || "",
      guard_name: data.guard_name || "",
      deskripsi: data.deskripsi || "",
    });
  }, [data]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (!readOnly) onSubmit(form);
  };

  if (readOnly) {
    return (
      <div className="space-y-3 text-gray-700">
        <p><b>Nama:</b> {form.name}</p>
        <p><b>Guard:</b> {form.guard_name}</p>
        <p><b>Deskripsi:</b> {form.deskripsi}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Nama Permission"
        className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-400"
      />
      <input
        name="guard_name"
        value={form.guard_name}
        onChange={handleChange}
        placeholder="Guard"
        className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-400"
      />
      <textarea
        name="deskripsi"
        value={form.deskripsi}
        onChange={handleChange}
        placeholder="Deskripsi"
        className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-400"
      />
      <button
        type="submit"
        className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl shadow-md hover:shadow-lg transition-transform hover:scale-105"
      >
        Simpan
      </button>
    </form>
  );
};

// =======================
// Table Permission
// =======================
const PermissionTable = React.forwardRef(({ permissions, onAction }, ref) => (
  <div
    ref={ref}
    className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-6 printable border border-gray-100"
  >
    <h2 className="text-center font-bold text-lg mb-6 text-gray-700">
      Laporan Daftar Permission
    </h2>
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-sm rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="border px-4 py-3 text-left">No</th>
            <th className="border px-4 py-3 text-left">Nama Permission</th>
            <th className="border px-4 py-3 text-left">Guard</th>
            <th className="border px-4 py-3 text-left">Deskripsi</th>
            <th className="border px-4 py-3 text-center no-print">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {permissions.length > 0 ? (
            permissions.map((perm, idx) => (
              <tr key={perm.id} className="hover:bg-gray-50 transition-colors">
                <td className="border px-4 py-2">{idx + 1}</td>
                <td className="border px-4 py-2 font-medium text-gray-800">
                  {perm.name}
                </td>
                <td className="border px-4 py-2">{perm.guard_name}</td>
                <td className="border px-4 py-2">{perm.deskripsi}</td>
                <td className="border px-4 py-2 text-center no-print">
                  <ActionDropdown
                    actions={[
                      { label: "Detail", icon: FaEye, onClick: () => onAction("detail", perm) },
                      { label: "Edit", icon: FaEdit, onClick: () => onAction("edit", perm) },
                      { label: "Hapus", icon: FaTrash, danger: true, onClick: () => onAction("delete", perm) },
                    ]}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="border px-4 py-4 text-center text-gray-500">
                Tidak ada data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
));
PermissionTable.displayName = "PermissionTable";

// =======================
// Halaman utama
// =======================
export default function PermissionList() {
  const [search, setSearch] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [modal, setModal] = useState({ open: false, type: "", data: {} });
  const componentRef = useRef();

  useEffect(() => { loadPermissions(); }, []);

  const loadPermissions = async () => {
    try {
      const data = await fetchPermissions();
      setPermissions(data);
    } catch (err) {
      console.error("Gagal ambil permissions:", err);
    }
  };

  const handleAction = (type, data) => setModal({ open: true, type, data });
  const closeModal = () => setModal({ open: false, type: "", data: {} });

  const handleCreate = async (payload) => { await createPermission(payload); closeModal(); loadPermissions(); };
  const handleEdit = async (id, payload) => { await updatePermission(id, payload); closeModal(); loadPermissions(); };
  const handleDelete = async (id) => { await deletePermission(id); closeModal(); loadPermissions(); };

  const handlePrint = useReactToPrint({ contentRef: componentRef, documentTitle: "Daftar Permission" });
  const filteredPermissions = permissions.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8">
      {/* Toolbar */}
      <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 no-print border border-gray-100">
        <input
          type="text"
          placeholder="🔍 Cari permission..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 focus:ring-2 focus:ring-indigo-400 rounded-xl px-4 py-2 w-full md:w-1/3 transition"
        />
        <div className="flex gap-3">
          <button
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md hover:shadow-lg transition-transform hover:scale-105"
            onClick={() => setModal({ open: true, type: "create", data: {} })}
          >
            <FaPlus className="inline mr-2" /> Tambah Permission
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl shadow-md hover:shadow-lg transition-transform hover:scale-105"
          >
            <FaPrint className="inline mr-2" /> Print
          </button>
        </div>
      </div>

      {/* Table */}
      <PermissionTable ref={componentRef} permissions={filteredPermissions} onAction={handleAction} />

      {/* Modal */}
      {modal.open && (
        <ModalWrapper
          isOpen={modal.open}
          onClose={closeModal}
          title={
            modal.type === "detail" ? "👀 Detail Permission" :
            modal.type === "edit" ? "✏️ Edit Permission" :
            modal.type === "delete" ? "🗑️ Hapus Permission" :
            "➕ Tambah Permission"
          }
          animate
        >
          {modal.type === "delete" ? (
            <div className="space-y-4">
              <p className="text-gray-700">Yakin hapus permission <b>{modal.data?.name}</b>?</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => handleDelete(modal.data.id)}
                  className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md hover:shadow-lg transition-transform hover:scale-105"
                >
                  Hapus
                </button>
              </div>
            </div>
          ) : (
            <PermissionForm
              data={modal.data}
              readOnly={modal.type === "detail"}
              onSubmit={(payload) =>
                modal.type === "create"
                  ? handleCreate(payload)
                  : handleEdit(modal.data.id, payload)
              }
            />
          )}
        </ModalWrapper>
      )}
    </div>
  );
}
