"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  Plus,
  Upload,
  Download,
  Edit2,
  Info,
  ChevronDown,
  Columns,
  X,
  FileSpreadsheet
} from "lucide-react";
import Link from "next/link";
import Modal from "@/components/Modal";
import { fetchApi } from "@/lib/api";

interface Layanan {
  id: string;
  no?: number;
  layananId: string;
  namaLayanan: string;
  kategori: string;
  keterangan: string;
  hargaModal: number;
  margin: number;
  hargaPokok: number;
  komisiSales: number;
  komisiLeader: number;
  komisiManager: number;
  komisiSso: number;
}

export default function LayananPage() {
  const [layananList, setLayananList] = useState<Layanan[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [categories, setCategories] = useState<string[]>(["Semua"]);
  const [isLoading, setIsLoading] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Layanan>>({});

  const fetchLayanan = async () => {
    try {
      setIsLoading(true);
      const res = await fetchApi("/layanans");
      if (res.data) {
        const mapped = res.data.map((item: any, index: number) => ({
          id: item.id,
          no: index + 1,
          layananId: item.layanan_id || "-",
          namaLayanan: item.nama_layanan || "-",
          kategori: item.kategori || "-",
          keterangan: item.keterangan || "-",
          hargaModal: parseFloat(item.harga_modal) || 0,
          margin: parseFloat(item.margin) || 0,
          hargaPokok: parseFloat(item.harga_pokok) || 0,
          komisiSales: parseFloat(item.komisi_sales) || 0,
          komisiLeader: parseFloat(item.komisi_leader) || 0,
          komisiManager: parseFloat(item.komisi_manager) || 0,
          komisiSso: parseFloat(item.komisi_sso) || 0,
        }));
        setLayananList(mapped);
        
        // Extract unique categories
        const cats = new Set(mapped.map((m: any) => m.kategori).filter(Boolean));
        setCategories(["Semua", ...Array.from(cats) as string[]]);
      }
    } catch (error) {
      console.error("Error fetching layanan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLayanan();
  }, []);

  const handleExportCsv = () => {
    if (layananList.length === 0) return;
    const headers = [
      "Layanan ID", "Kategori", "Nama Layanan", "Keterangan", 
      "Harga Modal", "Margin", "Harga Pokok", 
      "Komisi Sales", "Komisi Leader", "Komisi Manager", "Komisi SSO"
    ];
    const rows = layananList.map(l => [
      l.layananId,
      l.kategori,
      `"${l.namaLayanan}"`,
      `"${l.keterangan}"`,
      l.hargaModal,
      l.margin,
      l.hargaPokok,
      l.komisiSales,
      l.komisiLeader,
      l.komisiManager,
      l.komisiSso
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Master_Layanan_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      await fetchApi("/layanans/import", {
        method: "POST",
        body: formData,
      });
      alert("Data berhasil diimport!");
      setIsImportModalOpen(false);
      fetchLayanan();
    } catch (error) {
      console.error(error);
      alert("Gagal mengimport data!");
    }
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);

  let filteredLayanan = layananList.filter(l =>
    (l.namaLayanan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.layananId.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  if (selectedCategory !== "Semua") {
    filteredLayanan = filteredLayanan.filter(l => l.kategori === selectedCategory);
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-tl-[16px] overflow-hidden">
      {/* Page Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0">
        <h1 className="text-xl font-semibold text-gray-800">Master Layanan</h1>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center px-3 py-1.5 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 mr-2 text-gray-500" />
            Import CSV
          </button>
          <button 
            onClick={handleExportCsv}
            className="flex items-center px-3 py-1.5 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5 mr-2 text-gray-500" />
            Export
          </button>
          <button 
            onClick={() => {
              setFormData({});
              setIsCreateModalOpen(true);
            }} 
            className="flex items-center px-4 py-1.5 text-[13px] font-medium text-white bg-brand-700 rounded hover:bg-brand-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 mr-2" />
            Tambah Layanan
          </button>
        </div>
      </div>

      {/* Advanced Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-6 py-2.5 bg-white border-b border-gray-200 shrink-0 gap-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari layanan..."
              className="pl-8 pr-3 py-1 text-[13px] border border-gray-300 rounded bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 w-56 transition-all"
            />
          </div>
          
          <div className="h-4 w-px bg-gray-300 mx-1"></div>

          <div className="relative group">
            <button className="flex items-center px-3 py-1 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
              Kategori: {selectedCategory} <ChevronDown className="w-3.5 h-3.5 ml-1 text-gray-400" />
            </button>
            <div className="absolute left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg hidden group-hover:block z-50 py-1">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-4 py-1.5 text-[13px] hover:bg-gray-50 ${selectedCategory === cat ? 'font-semibold text-brand-600' : 'text-gray-700'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <button className="flex items-center px-3 py-1 text-[13px] font-medium text-brand-700 hover:bg-brand-50 rounded-full transition-colors">
            <Plus className="w-3.5 h-3.5 mr-1" /> Add filter
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center px-2 py-1 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors rounded hover:bg-gray-100">
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
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200 text-center w-10">
                  <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                </th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Layanan ID</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Kategori</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200 min-w-[280px]">Nama Layanan</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Keterangan</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200 text-right">Harga Modal</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200 text-right">Margin</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200 text-right">Harga Pokok</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200 text-right">Komisi Sales</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200 text-right">Komisi L/M/S</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 align-top">
              {filteredLayanan.map((l) => (
                <tr 
                  key={l.id} 
                  className="hover:bg-brand-50/40 group transition-colors cursor-pointer"
                  onClick={(e) => {
                    // Prevent row click if clicking checkbox
                    if ((e.target as HTMLElement).tagName !== 'INPUT') {
                      setFormData(l);
                      setIsDetailModalOpen(true);
                    }
                  }}
                >
                  <td className="px-4 py-2.5 text-center align-middle">
                    <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500 opacity-50 group-hover:opacity-100" />
                  </td>
                  <td className="px-4 py-2.5 align-middle font-mono text-xs text-brand-600 font-medium">
                    <span className="hover:underline cursor-pointer">{l.layananId}</span>
                  </td>
                  <td className="px-4 py-2.5 align-middle">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200">{l.kategori}</span>
                  </td>
                  <td className="px-4 py-2.5 align-middle font-medium text-gray-900">{l.namaLayanan}</td>
                  <td className="px-4 py-2.5 align-middle text-gray-500">{l.keterangan}</td>
                  <td className="px-4 py-2.5 align-middle text-right">{l.hargaModal > 0 ? formatRupiah(l.hargaModal) : "-"}</td>
                  <td className="px-4 py-2.5 align-middle text-right">{l.margin > 0 ? formatRupiah(l.margin) : "-"}</td>
                  <td className="px-4 py-2.5 align-middle text-right font-medium text-gray-900">{formatRupiah(l.hargaPokok)}</td>
                  <td className="px-4 py-2.5 align-middle text-right text-green-700">{formatRupiah(l.komisiSales)}</td>
                  <td className="px-4 py-2.5 align-middle text-right text-xs">
                    <div className="text-gray-600"><span className="font-semibold text-gray-400">L:</span> {formatRupiah(l.komisiLeader)}</div>
                    <div className="text-gray-600 mt-0.5"><span className="font-semibold text-gray-400">M:</span> {formatRupiah(l.komisiManager)}</div>
                    <div className="text-amber-600 mt-0.5"><span className="font-semibold text-amber-300">S:</span> {formatRupiah(l.komisiSso)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL LAYANAN SLIDE-OVER -> MODAL */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Detail Layanan"
        maxWidth="max-w-3xl"
        footer={
          <button 
            onClick={() => setIsDetailModalOpen(false)} 
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-[13px] font-medium hover:bg-gray-50 flex items-center transition-colors shadow-sm"
          >
            Tutup Detail
          </button>
        }
      >
        {formData && (
          <div className="p-2 text-[13px] text-gray-700">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <div className="text-xs text-brand-600 font-mono font-medium">{formData.layananId}</div>
                  <h3 className="text-xl font-bold text-gray-900 mt-1">{formData.namaLayanan}</h3>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 border border-gray-200">
                    {formData.kategori}
                  </span>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-5 rounded-lg border border-gray-200 shadow-sm mt-4">
                <div className="md:col-span-2">
                  <div className="text-xs text-gray-500 mb-1">Nama Layanan</div>
                  <div className="font-medium text-gray-900 text-[13px]">{formData.namaLayanan || "-"}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Kategori</div>
                  <div className="font-medium text-gray-900 text-[13px]">{formData.kategori || "-"}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Keterangan</div>
                  <div className="font-medium text-gray-900 text-[13px]">{formData.keterangan || "-"}</div>
                </div>
                
                <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">Struktur Harga & Komisi</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Harga Modal</div>
                      <div className="font-medium text-gray-900 text-[13px]">{formatRupiah(formData.hargaModal || 0)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Harga Pokok</div>
                      <div className="font-medium text-gray-900 text-[13px]">{formatRupiah(formData.hargaPokok || 0)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Komisi Sales</div>
                      <div className="font-medium text-green-700 text-[13px]">{formatRupiah(formData.komisiSales || 0)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Komisi Leader</div>
                      <div className="font-medium text-gray-900 text-[13px]">{formatRupiah(formData.komisiLeader || 0)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Komisi Manager</div>
                      <div className="font-medium text-gray-900 text-[13px]">{formatRupiah(formData.komisiManager || 0)}</div>
                    </div>
                  </div>
                </div>
                </div>
            </div>
        )}
      </Modal>

      {/* MODAL EDIT LAYANAN */}
      <Modal 
        isOpen={isEditModalOpen || isCreateModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setIsCreateModalOpen(false);
        }}
        title={isCreateModalOpen ? "Tambah Layanan" : "Edit Layanan"}
        maxWidth="max-w-3xl"
        footer={
          <>
            <button 
              onClick={() => {
                setIsEditModalOpen(false);
                setIsCreateModalOpen(false);
              }}
              className="px-4 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              Batal
            </button>
            <button 
              onClick={async () => {
                try {
                  const payload = {
                    layanan_id: formData.layananId,
                    nama_layanan: formData.namaLayanan,
                    kategori: formData.kategori,
                    keterangan: formData.keterangan,
                    harga_modal: formData.hargaModal || 0,
                    margin: formData.margin || 0,
                    harga_pokok: formData.hargaPokok || 0,
                    komisi_sales: formData.komisiSales || 0,
                    komisi_leader: formData.komisiLeader || 0,
                    komisi_manager: formData.komisiManager || 0,
                    komisi_sso: formData.komisiSso || 50000,
                  };
                  
                  if (isCreateModalOpen) {
                    await fetchApi("/layanans", { method: "POST", body: JSON.stringify(payload) });
                    alert("Layanan baru berhasil ditambahkan!");
                  } else {
                    await fetchApi(`/layanans/${formData.id}`, { method: "PUT", body: JSON.stringify(payload) });
                    alert("Layanan berhasil diperbarui!");
                  }
                  
                  setIsEditModalOpen(false);
                  setIsCreateModalOpen(false);
                  fetchLayanan();
                } catch (error: any) {
                  alert(error.message || "Gagal menyimpan data layanan");
                }
              }}
              className="px-4 py-2 text-[13px] font-medium text-white bg-brand-700 rounded hover:bg-brand-800"
            >
              Simpan Perubahan
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Layanan ID</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" value={formData.layananId || ''} onChange={e => setFormData({...formData, layananId: e.target.value})} placeholder="Misal: LY-001" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Nama Layanan</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" value={formData.namaLayanan || ''} onChange={e => setFormData({...formData, namaLayanan: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Kategori</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" value={formData.kategori || ''} onChange={e => setFormData({...formData, kategori: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Keterangan</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" value={formData.keterangan || ''} onChange={e => setFormData({...formData, keterangan: e.target.value})} />
          </div>
          
          <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Struktur Harga & Komisi</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Harga Modal</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[13px]">Rp</span>
                  <input type="number" className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" value={formData.hargaModal || 0} onChange={e => setFormData({...formData, hargaModal: Number(e.target.value)})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Harga Pokok</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[13px]">Rp</span>
                  <input type="number" className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" value={formData.hargaPokok || 0} onChange={e => setFormData({...formData, hargaPokok: Number(e.target.value)})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Komisi Sales</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[13px]">Rp</span>
                  <input type="number" className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" value={formData.komisiSales || 0} onChange={e => setFormData({...formData, komisiSales: Number(e.target.value)})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Komisi Leader</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[13px]">Rp</span>
                  <input type="number" className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" value={formData.komisiLeader || 0} onChange={e => setFormData({...formData, komisiLeader: Number(e.target.value)})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Komisi Manager</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[13px]">Rp</span>
                  <input type="number" className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" value={formData.komisiManager || 0} onChange={e => setFormData({...formData, komisiManager: Number(e.target.value)})} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* MODAL IMPORT */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Layanan dari CSV/Excel"
        footer={
          <>
            <button 
              onClick={() => setIsImportModalOpen(false)}
              className="px-4 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              Batal
            </button>
            <button 
              onClick={() => {
                alert("Data berhasil diimport. Layanan yang sama akan diupdate.");
                setIsImportModalOpen(false);
              }}
              className="px-4 py-2 text-[13px] font-medium text-white bg-brand-700 rounded hover:bg-brand-800"
            >
              Import Data
            </button>
          </>
        }
      >
        <div className="text-[13px] text-gray-600 space-y-4">
          <p>
            Gunakan format template di bawah untuk memastikan data yang diimport sesuai. 
            Jika "Layanan ID" pada file Anda sama dengan data yang sudah ada, data tersebut akan di-update secara otomatis.
          </p>
          <button onClick={() => alert("Mengunduh Template_Import_Layanan.xlsx")} className="flex items-center text-brand-600 font-medium hover:underline text-[13px]">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Download Template Import
          </button>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-md p-8 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <div className="font-medium text-gray-900 mb-1">Pilih File CSV atau Excel</div>
            <div className="text-xs text-gray-500">Max. ukuran file: 10MB</div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept=".csv, .xlsx, .xls"
            />
          </div>
        </div>
      </Modal>

    </div>
  );
}
