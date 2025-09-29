
// resources/js/aplikasi/pages/system/RoleList.jsx

import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { FaPlus, FaPrint, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import {
  fetchRoles,
  createRole,
  updateRole,
  deleteRole,
} from "@/aplikasi/utils/system/roles";
import Modal from "@/aplikasi/components/modal/Modal";
import ActionDropdown from "@/aplikasi/components/dropdown/ActionDropdown";
import "@/aplikasi/css/standar-print.css";

// =======================
// Komponen untuk tabel
// =======================
const RoleTable = React.forwardRef(({ roles, onAction }, ref) => (
  <div
    ref={ref}
    className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-6 printable border border-gray-100"
  >
    <h2 className="text-center font-bold text-lg mb-6 text-gray-700">
      Laporan Daftar Role
    </h2>
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-sm rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="border px-4 py-3 text-left">No</th>
            <th className="border px-4 py-3 text-left">Nama Role</th>
            <th className="border px-4 py-3 text-left">Guard</th>
            <th className="border px-4 py-3 text-left">Deskripsi</th>
            <th className="border px-4 py-3 text-center no-print">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {roles.length > 0 ? (
            roles.map((role, idx) => (
              <tr key={role.id} className="hover:bg-gray-50 transition-colors">
                <td className="border px-4 py-2">{idx + 1}</td>
                <td className="border px-4 py-2 font-medium text-gray-800">
                  {role.name}
                </td>
                <td className="border px-4 py-2">{role.guard_name}</td>
                <td className="border px-4 py-2">{role.description}</td>
                <td className="border px-4 py-2 text-center no-print">
                  <ActionDropdown
                    actions={[
                      {
                        label: "Detail",
                        icon: FaEye,
                        onClick: () => onAction("detail", role),
                      },
                      {
                        label: "Edit",
                        icon: FaEdit,
                        onClick: () => onAction("edit", role),
                      },
                      {
                        label: "Hapus",
                        icon: FaTrash,
                        danger: true,
                        onClick: () => onAction("delete", role),
                      },
                    ]}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="5"
                className="border px-4 py-4 text-center text-gray-500"
              >
                Tidak ada data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
));
RoleTable.displayName = "RoleTable";

// =======================
// Halaman utama
// =======================
export default function RoleList() {
  const [search, setSearch] = useState("");
  const [roles, setRoles] = useState([]);
  const [modal, setModal] = useState({ open: false, type: "", role: null });
  const componentRef = useRef();

  // Load data
  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const data = await fetchRoles();
      setRoles(data);
    } catch (err) {
      console.error("Gagal ambil roles:", err);
    }
  };

  const handleAction = (type, role) => {
    setModal({ open: true, type, role });
  };

  const closeModal = () => setModal({ open: false, type: "", role: null });

  const handleCreate = async (payload) => {
    try {
      await createRole(payload);
      closeModal();
      loadRoles();
    } catch (err) {
      console.error("Create error:", err);
    }
  };

  const handleEdit = async (id, payload) => {
    try {
      await updateRole(id, payload);
      closeModal();
      loadRoles();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRole(id);
      closeModal();
      loadRoles();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Daftar Role",
  });

  const filteredRoles = roles.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Toolbar */}
      <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 no-print border border-gray-100">
        <input
          type="text"
          placeholder="🔍 Cari role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 focus:ring-2 focus:ring-indigo-400 rounded-xl px-4 py-2 w-full md:w-1/3 transition"
        />
        <div className="flex gap-3">
          <button
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md hover:shadow-lg transition-transform hover:scale-105"
            onClick={() => setModal({ open: true, type: "create", role: null })}
          >
            <FaPlus className="inline mr-2" /> Tambah Role
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
      <RoleTable
        ref={componentRef}
        roles={filteredRoles}
        onAction={handleAction}
      />

      {/* Modal */}
      <Modal
        isOpen={modal.open}
        onClose={closeModal}
        title={
          modal.type === "detail"
            ? "👀 Detail Role"
            : modal.type === "edit"
            ? "✏️ Edit Role"
            : modal.type === "delete"
            ? "🗑️ Hapus Role"
            : "➕ Tambah Role"
        }
      >
        {modal.type === "detail" && (
          <div className="space-y-3 text-gray-700">
            <p>
              <b>Nama:</b> {modal.role?.name}
            </p>
            <p>
              <b>Guard:</b> {modal.role?.guard_name}
            </p>
            <p>
              <b>Deskripsi:</b> {modal.role?.description}
            </p>
          </div>
        )}

        {modal.type === "edit" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const payload = {
                name: e.target.name.value,
                guard_name: e.target.guard.value,
                description: e.target.desc.value,
              };
              handleEdit(modal.role.id, payload);
            }}
            className="space-y-4"
          >
            <input
              name="name"
              defaultValue={modal.role?.name}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400"
            />
            <input
              name="guard"
              defaultValue={modal.role?.guard_name}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400"
            />
            <textarea
              name="desc"
              defaultValue={modal.role?.description}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400"
            />
            <button className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl shadow-md hover:shadow-lg transition-transform hover:scale-105">
              Simpan
            </button>
          </form>
        )}

        {modal.type === "delete" && (
          <div className="space-y-4">
            <p className="text-gray-700">
              Yakin hapus role <b>{modal.role?.name}</b>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => handleDelete(modal.role.id)}
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md hover:shadow-lg transition-transform hover:scale-105"
              >
                Hapus
              </button>
            </div>
          </div>
        )}

        {modal.type === "create" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const payload = {
                name: e.target.name.value,
                guard_name: e.target.guard.value,
                description: e.target.desc.value,
              };
              handleCreate(payload);
            }}
            className="space-y-4"
          >
            <input
              name="name"
              placeholder="Nama Role"
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-400"
            />
            <input
              name="guard"
              placeholder="Guard"
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-400"
            />
            <textarea
              name="desc"
              placeholder="Deskripsi"
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-400"
            />
            <button className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md hover:shadow-lg transition-transform hover:scale-105">
              Simpan
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}

