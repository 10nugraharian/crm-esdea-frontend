"use client";

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  Edit2,
  RefreshCw,
  UserCheck,
  ChevronDown,
  Columns,
  X
} from "lucide-react";
import Modal from "@/components/Modal";

interface UserProfile {
  id: string;
  no: number;
  userId: string;
  namaLengkap: string;
  gender: "Laki-laki" | "Perempuan";
  tanggalLahir: string;
  noRekening: string;
  namaBank: string;
  namaLeader: string | null;
  namaManager: string | null;
  username: string;
  role: string;
}

const initialUsers: UserProfile[] = [
  { 
    id: "USR-001", no: 1, 
    userId: "829103",
    namaLengkap: "Rian Nugraha", 
    gender: "Laki-laki",
    tanggalLahir: "1990-05-15",
    noRekening: "1234567890",
    namaBank: "BCA",
    namaLeader: "Budi Santoso",
    namaManager: "Agus Salim",
    username: "rian.nugraha",
    role: "Director / BOD"
  },
  { 
    id: "USR-002", no: 2, 
    userId: "472819",
    namaLengkap: "Siti Aminah", 
    gender: "Perempuan",
    tanggalLahir: "1992-08-21",
    noRekening: "0987654321",
    namaBank: "Mandiri",
    namaLeader: "Budi Santoso",
    namaManager: "Agus Salim",
    username: "siti.aminah",
    role: "Sales"
  },
  { 
    id: "USR-003", no: 3, 
    userId: "103948",
    namaLengkap: "Budi Santoso", 
    gender: "Laki-laki",
    tanggalLahir: "1988-11-30",
    noRekening: "1122334455",
    namaBank: "BNI",
    namaLeader: null,
    namaManager: "Agus Salim",
    username: "budi.santoso",
    role: "Sales Leader"
  },
  { 
    id: "USR-004", no: 4, 
    userId: "551234",
    namaLengkap: "Agus Salim", 
    gender: "Laki-laki",
    tanggalLahir: "1985-02-10",
    noRekening: "555666777",
    namaBank: "BRI",
    namaLeader: null,
    namaManager: null,
    username: "agus.salim",
    role: "Sales Manager"
  },
  { 
    id: "USR-005", no: 5, 
    userId: "998877",
    namaLengkap: "Diana Putri", 
    gender: "Perempuan",
    tanggalLahir: "1995-12-05",
    noRekening: "999888777",
    namaBank: "BCA",
    namaLeader: null,
    namaManager: null,
    username: "diana.finance",
    role: "Finance"
  }
];

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [resettingUser, setResettingUser] = useState<UserProfile | null>(null);

  // Form states
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  const filteredUsers = users.filter(u => 
    u.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.userId.includes(searchQuery) ||
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white rounded-tl-[16px] overflow-hidden">
      {/* Page Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Master Data Tim</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola data profil tim, role, dan struktur (Leader/Manager).</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            className="flex items-center px-4 py-1.5 text-[13px] font-medium text-white bg-brand-700 rounded hover:bg-brand-800 transition-colors shadow-sm" 
            onClick={() => {
              setFormData({});
              setIsAddModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Pengguna
          </button>
        </div>
      </div>

      {/* Advanced Filter Toolbar (HubSpot style) */}
      <div className="flex flex-wrap items-center justify-between px-6 py-2.5 bg-white border-b border-gray-200 shrink-0 gap-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 text-[13px] border border-gray-300 rounded bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 w-56 transition-all"
            />
          </div>
          
          <div className="h-4 w-px bg-gray-300 mx-1"></div>

          <button className="flex items-center px-3 py-1 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
            Role: Any <ChevronDown className="w-3.5 h-3.5 ml-1 text-gray-400" />
          </button>
          <button className="flex items-center px-3 py-1 text-[13px] font-medium text-brand-700 hover:bg-brand-50 rounded-full transition-colors">
            <Plus className="w-3.5 h-3.5 mr-1" /> Add filter
          </button>
        </div>

        <div className="flex items-center gap-2 text-gray-500">
          <button className="flex items-center px-2 py-1 text-[13px] font-medium hover:text-gray-900 transition-colors rounded hover:bg-gray-100">
            <Columns className="w-3.5 h-3.5 mr-1.5" /> Columns
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto bg-gray-50 flex flex-col">
        <div className="flex-1 overflow-x-auto bg-white border-t border-gray-200">
          <table className="w-full text-left text-[13px] text-gray-600 whitespace-nowrap">
            <thead className="bg-[#f5f8fa] border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 font-medium text-gray-600 w-10 text-center border-b border-gray-200">
                  <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                </th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">User ID</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Nama Lengkap</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Role</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Gender / TTL</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Rekening</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Struktur (L/M)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 align-top">
              {filteredUsers.map((u) => (
                <tr 
                  key={u.id} 
                  className="hover:bg-brand-50/40 group transition-colors cursor-pointer"
                  onClick={(e) => {
                    if ((e.target as HTMLElement).tagName !== 'INPUT') {
                      setFormData(u);
                      setEditingUser(u);
                      setIsDetailModalOpen(true);
                    }
                  }}
                >
                  <td className="px-4 py-2.5 text-center align-middle">
                    <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500 opacity-50 group-hover:opacity-100" />
                  </td>
                  <td className="px-4 py-2.5 align-middle font-mono text-xs text-brand-600 font-medium">
                    <span className="hover:underline cursor-pointer">{u.userId}</span>
                  </td>
                  <td className="px-4 py-2.5 align-middle">
                    <div className="font-medium text-gray-900">{u.namaLengkap}</div>
                    <div className="text-xs text-gray-500 mt-0.5">@{u.username}</div>
                  </td>
                  <td className="px-4 py-2.5 align-middle">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium bg-brand-50 text-brand-700 border border-brand-200">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 align-middle">
                    <div className="text-gray-800">{u.gender}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{u.tanggalLahir}</div>
                  </td>
                  <td className="px-4 py-2.5 align-middle">
                    <div className="font-medium text-gray-700">{u.namaBank}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{u.noRekening}</div>
                  </td>
                  <td className="px-4 py-2.5 align-middle">
                    <div className="text-xs text-gray-700"><span className="text-gray-400 font-semibold">L:</span> {u.namaLeader || "-"}</div>
                    <div className="text-xs text-gray-700 mt-0.5"><span className="text-gray-400 font-semibold">M:</span> {u.namaManager || "-"}</div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    Tidak ada data pengguna yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL TIM SLIDE-OVER -> MODAL */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Detail Anggota Tim"
        maxWidth="max-w-2xl"
        footer={
          <button 
            onClick={() => setIsDetailModalOpen(false)}
            className="px-4 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors shadow-sm"
          >
            Tutup Detail
          </button>
        }
      >
        {formData && (
          <div className="p-2 text-[13px] text-gray-700">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <div className="text-xs text-brand-600 font-mono font-medium">{formData.userId}</div>
                  <h3 className="text-xl font-bold text-gray-900 mt-1">{formData.namaLengkap}</h3>
                  <div className="text-gray-500 mt-0.5">@{formData.username}</div>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[11px] font-medium bg-brand-50 text-brand-700 border border-brand-200">
                    {formData.role}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      setIsEditModalOpen(true);
                    }}
                    className="flex items-center justify-center px-3 py-1.5 bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200 rounded text-[13px] font-medium transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1.5" /> Edit Profile
                  </button>
                  <button 
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      setResettingUser(editingUser);
                      setIsResetPasswordModalOpen(true);
                    }}
                    className="flex items-center justify-center px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded text-[13px] font-medium transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Reset Password
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500">Gender</div>
                    <div className="font-medium text-gray-900">{formData.gender || "-"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Tanggal Lahir</div>
                    <div className="font-medium text-gray-900">{formData.tanggalLahir || "-"}</div>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">Informasi Rekening</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-500">Bank</div>
                      <div className="font-medium text-gray-900">{formData.namaBank || "-"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">No. Rekening</div>
                      <div className="font-medium text-gray-900">{formData.noRekening || "-"}</div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">Struktur Organisasi</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-500">Leader</div>
                      <div className="font-medium text-gray-900">{formData.namaLeader || "-"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Manager</div>
                      <div className="font-medium text-gray-900">{formData.namaManager || "-"}</div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        )}
      </Modal>

      {/* MODALS */}

      {/* 1. Modal Tambah/Edit Pengguna */}
      <Modal 
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
        }}
        title={isEditModalOpen ? "Edit Pengguna" : "Tambah Pengguna Baru"}
        maxWidth="max-w-2xl"
        footer={
          <>
            <button 
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
              }}
              className="px-4 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              Batal
            </button>
            <button 
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
              }}
              className="px-4 py-2 text-[13px] font-medium text-white bg-brand-700 rounded hover:bg-brand-800"
            >
              Simpan
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" value={formData.namaLengkap || ''} onChange={e => setFormData({...formData, namaLengkap: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Username</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" value={formData.username || ''} onChange={e => setFormData({...formData, username: e.target.value})} />
          </div>
          {isAddModalOpen && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
              <input type="password" placeholder="Password untuk akun ini" className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" />
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" value={formData.role || ''} onChange={e => setFormData({...formData, role: e.target.value})}>
              <option value="">Pilih Role...</option>
              <option value="Sales">Sales</option>
              <option value="Sales Leader">Sales Leader</option>
              <option value="Sales Manager">Sales Manager</option>
              <option value="Finance">Finance</option>
              <option value="Director / BOD">Director / BOD</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" value={formData.gender || ''} onChange={e => setFormData({...formData, gender: e.target.value as "Laki-laki" | "Perempuan"})}>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nama Bank</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" value={formData.namaBank || ''} onChange={e => setFormData({...formData, namaBank: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nomor Rekening</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" value={formData.noRekening || ''} onChange={e => setFormData({...formData, noRekening: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Leader (Opsional)</label>
            <input type="text" placeholder="Nama Leader" className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" value={formData.namaLeader || ''} onChange={e => setFormData({...formData, namaLeader: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Manager (Opsional)</label>
            <input type="text" placeholder="Nama Manager" className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" value={formData.namaManager || ''} onChange={e => setFormData({...formData, namaManager: e.target.value})} />
          </div>
        </div>
      </Modal>

      {/* 2. Modal Reset Password */}
      <Modal 
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
        title="Konfirmasi Reset Password"
        footer={
          <>
            <button 
              onClick={() => setIsResetPasswordModalOpen(false)}
              className="px-4 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              Batal
            </button>
            <button 
              onClick={() => {
                alert("Password berhasil di-reset ke default: esdea123");
                setIsResetPasswordModalOpen(false);
              }}
              className="px-4 py-2 text-[13px] font-medium text-white bg-red-600 rounded hover:bg-red-700"
            >
              Ya, Reset Password
            </button>
          </>
        }
      >
        <div className="text-[13px] text-gray-600">
          Apakah Anda yakin ingin mereset kata sandi untuk pengguna <strong className="text-gray-900">{resettingUser?.namaLengkap}</strong>? 
          Kata sandi akan dikembalikan ke nilai bawaan (default). Pengguna ini akan diminta untuk mengganti kata sandi pada saat login berikutnya.
        </div>
      </Modal>

    </div>
  );
}
