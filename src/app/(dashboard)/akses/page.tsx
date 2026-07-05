"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  Save, 
  RefreshCw,
  Search,
  Check,
  Plus
} from "lucide-react";
import Modal from "@/components/Modal";
import { fetchApi } from "@/lib/api";

interface RoleAccess {
  id: string;
  role: string;
  permissions: {
    [module: string]: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    }
  }
}

const modules = [
  "Dashboard",
  "Leads",
  "Distribusi Leads",
  "Quotations",
  "Invoices",
  "Finance",
  "Layanan",
  "Projects",
  "Vendors",
  "Komisi",
  "Tim",
  "Hak Akses"
];

export default function AksesPage() {
  const [roles, setRoles] = useState<RoleAccess[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");

  const activeRole = roles.find(r => r.id === selectedRole);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const data = await fetchApi('/roles');
      setRoles(data);
      if (data.length > 0 && !selectedRole) {
        setSelectedRole(data[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      alert("Gagal mengambil data role dari server.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePermission = (mod: string, action: "view" | "create" | "edit" | "delete") => {
    setRoles(prev => prev.map(r => {
      if (r.id === selectedRole) {
        return {
          ...r,
          permissions: {
            ...r.permissions,
            [mod]: {
              ...r.permissions[mod],
              [action]: !r.permissions[mod][action]
            }
          }
        };
      }
      return r;
    }));
  };

  const handleSave = async () => {
    if (!activeRole) return;
    setIsSaving(true);
    try {
      await fetchApi(`/roles/${activeRole.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          permissions: activeRole.permissions
        })
      });
      alert("Pengaturan hak akses berhasil disimpan.");
    } catch (error) {
      console.error("Failed to save permissions:", error);
      alert("Gagal menyimpan pengaturan hak akses.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return;
    setIsSaving(true);
    try {
      const defaultPermissions = modules.reduce((acc, mod) => {
        acc[mod] = { view: false, create: false, edit: false, delete: false };
        return acc;
      }, {} as RoleAccess["permissions"]);

      const response = await fetchApi('/roles', {
        method: 'POST',
        body: JSON.stringify({
          role: newRoleName,
          permissions: defaultPermissions
        })
      });
      
      alert(`Role "${newRoleName}" berhasil ditambahkan.`);
      setNewRoleName("");
      setIsAddRoleModalOpen(false);
      await fetchRoles(); // Refresh data
    } catch (error) {
      console.error("Failed to create role:", error);
      alert("Gagal membuat role baru. Nama role mungkin sudah ada.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-tl-[16px] overflow-hidden">
      {/* Page Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Pengaturan Hak Akses</h1>
          <p className="text-sm text-gray-500 mt-1">Atur wewenang (view, create, edit, delete) per module untuk setiap Role.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave}
            disabled={isSaving || !activeRole}
            className="flex items-center px-4 py-1.5 text-[13px] font-medium text-white bg-brand-700 border border-brand-700 rounded hover:bg-brand-800 transition-colors disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Roles */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Daftar Role</h3>
            <button 
              onClick={() => setIsAddRoleModalOpen(true)}
              className="p-1 rounded text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
              title="Tambah Role"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-gray-500">Memuat...</div>
            ) : (
              roles.map(r => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRole(r.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-md text-[13px] font-medium transition-colors flex items-center justify-between ${
                    selectedRole === r.id 
                      ? "bg-brand-50 text-brand-700" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span>{r.role}</span>
                  {selectedRole === r.id && <ShieldAlert className="w-3.5 h-3.5 text-brand-600" />}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Matrix Table */}
        <div className="flex-1 overflow-auto bg-white">
          <div className="p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-brand-600" />
                Matriks Akses: {activeRole?.role || "Pilih Role"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">Centang box di bawah untuk memberikan akses pada modul yang dipilih.</p>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-[13px] text-gray-700 whitespace-nowrap">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-gray-600">Modul / Menu</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-center w-24">Lihat (View)</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-center w-24">Buat (Create)</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-center w-24">Ubah (Edit)</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-center w-24">Hapus (Delete)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activeRole ? modules.map(mod => {
                    const perm = activeRole.permissions[mod];
                    if (!perm) return null;
                    return (
                      <tr key={mod} className="hover:bg-brand-50/20 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-800">{mod}</td>
                        
                        <td className="px-4 py-3 text-center">
                          <label className="inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={perm.view} 
                              onChange={() => togglePermission(mod, "view")}
                              className="rounded border-gray-300 text-brand-600 focus:ring-brand-500 w-4 h-4" 
                            />
                          </label>
                        </td>
                        
                        <td className="px-4 py-3 text-center">
                          <label className="inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={perm.create} 
                              onChange={() => togglePermission(mod, "create")}
                              className="rounded border-gray-300 text-brand-600 focus:ring-brand-500 w-4 h-4" 
                            />
                          </label>
                        </td>

                        <td className="px-4 py-3 text-center">
                          <label className="inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={perm.edit} 
                              onChange={() => togglePermission(mod, "edit")}
                              className="rounded border-gray-300 text-brand-600 focus:ring-brand-500 w-4 h-4" 
                            />
                          </label>
                        </td>

                        <td className="px-4 py-3 text-center">
                          <label className="inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={perm.delete} 
                              onChange={() => togglePermission(mod, "delete")}
                              className="rounded border-gray-300 text-brand-600 focus:ring-brand-500 w-4 h-4" 
                            />
                          </label>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        {isLoading ? "Memuat..." : "Silakan pilih role dari menu sebelah kiri."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* MODAL TAMBAH ROLE */}
      <Modal 
        isOpen={isAddRoleModalOpen}
        onClose={() => setIsAddRoleModalOpen(false)}
        title="Tambah Role Baru"
        footer={
          <>
            <button 
              onClick={() => setIsAddRoleModalOpen(false)}
              className="px-4 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              Batal
            </button>
            <button 
              onClick={handleCreateRole}
              disabled={isSaving || !newRoleName.trim()}
              className="px-4 py-2 text-[13px] font-medium text-white bg-brand-700 rounded hover:bg-brand-800 disabled:opacity-50"
            >
              {isSaving ? "Menyimpan..." : "Simpan Role"}
            </button>
          </>
        }
      >
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-1">Nama Role</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" 
            value={newRoleName} 
            onChange={e => setNewRoleName(e.target.value)} 
            placeholder="Contoh: Supervisor"
            autoFocus
          />
        </div>
      </Modal>
    </div>
  );
}
