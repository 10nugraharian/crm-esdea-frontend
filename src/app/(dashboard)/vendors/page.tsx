"use client";

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  Edit2,
  MapPin,
  Phone,
  Mail,
  User,
  Columns,
  ChevronDown,
  X
} from "lucide-react";
import Link from "next/link";
import Modal from "@/components/Modal";

interface Vendor {
  id: string;
  no: number;
  vendorId: string;
  namaPerusahaan: string;
  alamat: string;
  noTelepon: string;
  email: string;
  namaPic: string;
}

const initialVendors: Vendor[] = [
  { 
    id: "VND-001", no: 1, 
    vendorId: "V-1001",
    namaPerusahaan: "PT. Mitra Sertifikasi Utama", 
    alamat: "Jl. Jendral Sudirman No. 45, Jakarta Selatan",
    noTelepon: "021-5551234",
    email: "info@mitrasertifikasi.com",
    namaPic: "Bapak Agus"
  },
  { 
    id: "VND-002", no: 2, 
    vendorId: "V-1002",
    namaPerusahaan: "CV. Legalitas Cepat", 
    alamat: "Komp. Ruko Bekasi Mas Blok B/12, Bekasi",
    noTelepon: "021-8889999",
    email: "legal@cepat.co.id",
    namaPic: "Ibu Siti"
  },
];

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Vendor>>({});

  const filteredVendors = vendors.filter(v => 
    v.namaPerusahaan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.namaPic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.vendorId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white rounded-tl-[16px] overflow-hidden">
      {/* Page Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Master Data Vendor</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola data mitra/vendor yang bekerja sama dengan perusahaan.</p>
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
            Tambah Vendor
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
              placeholder="Cari vendor, PIC, atau ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 text-[13px] border border-gray-300 rounded bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 w-56 transition-all"
            />
          </div>
          
          <div className="h-4 w-px bg-gray-300 mx-1"></div>

          <button className="flex items-center px-3 py-1 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
            Location: Any <ChevronDown className="w-3.5 h-3.5 ml-1 text-gray-400" />
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
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Vendor ID</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200 min-w-[200px]">Nama Perusahaan</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200 min-w-[250px]">Alamat</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Kontak Info</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Nama PIC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 align-top">
              {filteredVendors.map((v) => (
                <tr 
                  key={v.id} 
                  className="hover:bg-brand-50/40 group transition-colors cursor-pointer"
                  onClick={(e) => {
                    if ((e.target as HTMLElement).tagName !== 'INPUT') {
                      setFormData(v);
                      setIsDetailModalOpen(true);
                    }
                  }}
                >
                  <td className="px-4 py-2.5 text-center align-middle">
                    <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500 opacity-50 group-hover:opacity-100" />
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-brand-600 font-medium align-middle">
                    <span className="hover:underline cursor-pointer">{v.vendorId}</span>
                  </td>
                  <td className="px-4 py-2.5 font-medium text-gray-900 align-middle">{v.namaPerusahaan}</td>
                  <td className="px-4 py-2.5 text-gray-500 truncate max-w-[250px] align-middle" title={v.alamat}>
                    <div className="flex items-start">
                      <MapPin className="w-3.5 h-3.5 mr-1.5 mt-0.5 shrink-0 text-gray-400" />
                      <span className="truncate">{v.alamat}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 align-middle">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center text-xs text-gray-600">
                        <Phone className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                        {v.noTelepon}
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <Mail className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                        {v.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 align-middle">
                    <div className="flex items-center font-medium text-gray-700">
                      <User className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                      {v.namaPic}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredVendors.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Tidak ada vendor yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL VENDOR SLIDE-OVER */}
      {isDetailModalOpen && formData && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
          <div className="w-[500px] h-full bg-white shadow-2xl flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">Detail Vendor</h2>
              <button onClick={() => setIsDetailModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 text-[13px] text-gray-700">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <div className="text-xs text-brand-600 font-mono font-medium">{formData.vendorId}</div>
                  <h3 className="text-xl font-bold text-gray-900 mt-1">{formData.namaPerusahaan}</h3>
                </div>
                <button 
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    setIsEditModalOpen(true);
                  }}
                  className="flex items-center px-3 py-1.5 bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200 rounded text-[13px] font-medium transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 mr-1.5" /> Edit
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Alamat</div>
                  <div className="font-medium flex items-start">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400 shrink-0 mt-0.5" />
                    {formData.alamat || "-"}
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">Kontak & PIC</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-500">Nomor Telepon</div>
                      <div className="font-medium flex items-center mt-1">
                        <Phone className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                        {formData.noTelepon || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="font-medium flex items-center mt-1">
                        <Mail className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                        {formData.email || "-"}
                      </div>
                    </div>
                    <div className="col-span-2 mt-2">
                      <div className="text-xs text-gray-500">Nama PIC</div>
                      <div className="font-medium flex items-center mt-1">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        {formData.namaPic || "-"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      <Modal 
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
        }}
        title={isEditModalOpen ? "Edit Vendor" : "Tambah Vendor Baru"}
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
                if (isAddModalOpen) {
                  const newV: Vendor = {
                    id: `VND-00${vendors.length + 1}`,
                    no: vendors.length + 1,
                    vendorId: formData.vendorId || `V-100${vendors.length + 1}`,
                    namaPerusahaan: formData.namaPerusahaan || "Vendor Baru",
                    alamat: formData.alamat || "-",
                    noTelepon: formData.noTelepon || "-",
                    email: formData.email || "-",
                    namaPic: formData.namaPic || "-"
                  };
                  setVendors([newV, ...vendors]);
                  alert("Vendor baru berhasil ditambahkan!");
                } else {
                  setVendors(vendors.map(v => v.id === formData.id ? { ...v, ...formData } as Vendor : v));
                  alert("Vendor berhasil diperbarui!");
                }
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
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Nama Perusahaan</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" value={formData.namaPerusahaan || ''} onChange={e => setFormData({...formData, namaPerusahaan: e.target.value})} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Alamat Lengkap</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" value={formData.alamat || ''} onChange={e => setFormData({...formData, alamat: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nomor Telepon</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" value={formData.noTelepon || ''} onChange={e => setFormData({...formData, noTelepon: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
            <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nama PIC</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" value={formData.namaPic || ''} onChange={e => setFormData({...formData, namaPic: e.target.value})} />
          </div>
        </div>
      </Modal>

    </div>
  );
}
