"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  FileText,
  ChevronDown,
  UploadCloud,
  CheckCircle2,
  Columns,
  Plus
} from "lucide-react";
import Link from "next/link";
import Modal from "@/components/Modal";
import { fetchApi } from "@/lib/api";

type PaymentStatus = "UNPAID" | "PARTIAL" | "PAID";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Any");
  const [dateFilter, setDateFilter] = useState("Any");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  
  // Upload State
  const [uploadType, setUploadType] = useState<"DP" | "BP">("DP");
  const [selectedBank, setSelectedBank] = useState<"Mandiri" | "BCA">("Mandiri");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchApi('/invoices');
      setInvoices(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUploadBukti = async () => {
    if (!selectedInvoice || !uploadFile) return;
    
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('type', uploadType);
      formData.append('bank', selectedBank);
      // We pass _method=PUT to simulate a PUT request for file upload in Laravel
      formData.append('_method', 'PUT');

      const token = document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1] || '';
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/invoices/${selectedInvoice.id}`, {
        method: 'POST', // Use POST with _method=PUT
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) throw new Error("Gagal upload file");
      
      alert(`Bukti bayar ${uploadType} berhasil diupload.`);
      setIsDetailModalOpen(false);
      setUploadFile(null);
      loadData();
    } catch (error: any) {
      alert("Gagal mengupload bukti bayar: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = !searchQuery || 
                          inv.quotation?.lead?.nama_perusahaan?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inv.quotation?.no_quotation?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "Any" || inv.status_pembayaran === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== "Any" && inv.created_at) {
      const invDate = new Date(inv.created_at);
      const today = new Date();
      
      if (dateFilter === "Hari Ini") {
        matchesDate = invDate.toDateString() === today.toDateString();
      } else if (dateFilter === "Minggu Ini") {
        const firstDay = new Date(today);
        firstDay.setDate(today.getDate() - today.getDay());
        const lastDay = new Date(today);
        lastDay.setDate(today.getDate() - today.getDay() + 6);
        matchesDate = invDate >= firstDay && invDate <= lastDay;
      } else if (dateFilter === "Bulan Ini") {
        matchesDate = invDate.getMonth() === today.getMonth() && invDate.getFullYear() === today.getFullYear();
      } else if (dateFilter === "Custom") {
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (invDate < start) matchesDate = false;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (invDate > end) matchesDate = false;
        }
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="flex flex-col h-full bg-white rounded-tl-[16px] overflow-hidden">
      {/* Page Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0">
        <h1 className="text-xl font-semibold text-gray-800">Invoices</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center px-4 py-1.5 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2 text-gray-500" />
            Export Data
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
              placeholder="Search invoices..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 text-[13px] border border-gray-300 rounded bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 w-56 transition-all"
            />
          </div>
          
          <div className="h-4 w-px bg-gray-300 mx-1"></div>

          <div className="relative group">
            <button className="flex items-center px-3 py-1 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
              Tanggal: {dateFilter} <ChevronDown className="w-3.5 h-3.5 ml-1 text-gray-400" />
            </button>
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
              {['Any', 'Hari Ini', 'Minggu Ini', 'Bulan Ini', 'Custom'].map(opt => (
                <button key={opt} onClick={() => setDateFilter(opt)} className="block w-full text-left px-4 py-1.5 text-[13px] hover:bg-gray-50">{opt}</button>
              ))}
              {dateFilter === "Custom" && (
                <div className="px-3 py-2 border-t border-gray-100 mt-1">
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full text-xs mb-1 border-gray-300 rounded" />
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full text-xs border-gray-300 rounded" />
                </div>
              )}
            </div>
          </div>

          <div className="relative group">
            <button className="flex items-center px-3 py-1 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
              Status: {statusFilter.replace('_', ' ')} <ChevronDown className="w-3.5 h-3.5 ml-1 text-gray-400" />
            </button>
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
              {['Any', 'UNPAID', 'PARTIAL', 'PAID'].map(opt => (
                <button key={opt} onClick={() => setStatusFilter(opt)} className="block w-full text-left px-4 py-1.5 text-[13px] hover:bg-gray-50">{opt}</button>
              ))}
            </div>
          </div>
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
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Tanggal</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">No Invoice</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Perusahaan / Layanan</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Total (Rp)</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Status DP</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Status BP</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Status Pembayaran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 align-top">
              {isLoading ? (
                <tr><td colSpan={8} className="p-8 text-center text-gray-500">Loading data...</td></tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    Tidak ada data invoice yang ditemukan.
                  </td>
                </tr>
              ) : filteredInvoices.map((inv) => {
                const baseNoQuotation = inv.quotation?.no_quotation || "";
                const isProforma = (Number(inv.persentase_dp) || 0) < 100;
                let displayNoSurat = baseNoQuotation;
                if (baseNoQuotation.startsWith("QT-")) {
                  displayNoSurat = baseNoQuotation.replace("QT-", isProforma ? "PI-" : "IN-");
                }
                const summaryLayanan = inv.quotation?.items?.map((i: any) => i.layanan?.nama_layanan).join(', ') || '-';

                return (
                  <tr 
                    key={inv.id} 
                    className="hover:bg-brand-50/40 group transition-colors cursor-pointer"
                    onClick={(e) => {
                      if ((e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'BUTTON' && (e.target as HTMLElement).tagName !== 'A') {
                        setSelectedInvoice({ ...inv, displayNoSurat, summaryLayanan, isProforma });
                        setIsDetailModalOpen(true);
                      }
                    }}
                  >
                    <td className="px-4 py-2.5 text-center align-middle">
                      <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500 opacity-50 group-hover:opacity-100" />
                    </td>
                    <td className="px-4 py-2.5 align-middle">{new Date(inv.created_at).toLocaleDateString('id-ID')}</td>
                    <td className="px-4 py-2.5 align-middle font-mono text-xs text-brand-600 font-medium">
                      <Link href={`/invoices/preview/${inv.id}?type=${isProforma ? 'proforma' : 'invoice'}-dp`} className="hover:underline">{displayNoSurat}</Link>
                    </td>
                    <td className="px-4 py-2.5 align-middle">
                      <div className="font-medium text-gray-900">{inv.quotation?.lead?.nama_perusahaan}</div>
                      <div className="text-[11px] text-gray-500 truncate max-w-[200px]" title={summaryLayanan}>{summaryLayanan}</div>
                    </td>
                    <td className="px-4 py-2.5 align-middle font-medium text-gray-900">{formatRupiah(inv.total_amount)}</td>
                    <td className="px-4 py-2.5 align-middle">
                      <div className="flex flex-col gap-1">
                        {inv.tanggal_dp ? (
                          <div className="text-xs text-green-700 flex items-center">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> {new Date(inv.tanggal_dp).toLocaleDateString('id-ID')}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-400 italic">Belum Dibayar</div>
                        )}
                        {inv.bukti_dp_file && (
                          <a href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/storage/${inv.bukti_dp_file}`} target="_blank" className="inline-flex items-center text-[10px] text-brand-600 hover:underline bg-brand-50 px-2 py-0.5 rounded w-fit border border-brand-200">
                            <FileText className="w-3 h-3 mr-1" /> Bukti_DP
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 align-middle">
                      <div className="flex flex-col gap-1">
                        {inv.tanggal_bp ? (
                          <div className="text-xs text-green-700 flex items-center">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> {new Date(inv.tanggal_bp).toLocaleDateString('id-ID')}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-400 italic">Belum Dibayar</div>
                        )}
                        {inv.bukti_bp_file && (
                          <a href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/storage/${inv.bukti_bp_file}`} target="_blank" className="inline-flex items-center text-[10px] text-brand-600 hover:underline bg-brand-50 px-2 py-0.5 rounded w-fit border border-brand-200">
                            <FileText className="w-3 h-3 mr-1" /> Bukti_BP
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 align-middle">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium border
                        ${inv.status_pembayaran === 'PAID' ? 'bg-green-50 text-green-700 border-green-200' : 
                          inv.status_pembayaran === 'PARTIAL' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                          'bg-red-50 text-red-700 border-red-200'}`}>
                        {inv.status_pembayaran}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL INVOICE MODAL */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Detail Invoice"
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
        {selectedInvoice && (
          <div className="p-2 text-[13px] text-gray-700">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <div className="text-xs text-brand-600 font-mono font-medium">{selectedInvoice.displayNoSurat}</div>
                  <h3 className="text-xl font-bold text-gray-900 mt-1">{selectedInvoice.quotation?.lead?.nama_perusahaan}</h3>
                  <span className={`inline-flex items-center px-2 py-0.5 mt-2 rounded text-[11px] font-medium border
                    ${selectedInvoice.status_pembayaran === 'PAID' ? 'bg-green-50 text-green-700 border-green-200' : 
                      selectedInvoice.status_pembayaran === 'PARTIAL' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                      'bg-red-50 text-red-700 border-red-200'}`}>
                    {selectedInvoice.status_pembayaran}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">Informasi Umum</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-500">Tanggal Invoice</div>
                      <div className="font-medium text-gray-900">{new Date(selectedInvoice.created_at).toLocaleDateString('id-ID')}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Total Biaya</div>
                      <div className="font-bold text-gray-900">{formatRupiah(selectedInvoice.total_amount)}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs text-gray-500">Summary Layanan</div>
                      <div className="font-medium text-gray-900">{selectedInvoice.summaryLayanan}</div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">Download Berkas (PDF)</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Link href={`/invoices/preview/${selectedInvoice.id}?type=${selectedInvoice.isProforma ? 'proforma' : 'invoice'}-dp`} className="flex items-center justify-center px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded text-xs font-medium transition-colors">
                      <FileText className="w-3.5 h-3.5 mr-1.5" /> Preview DP (50%)
                    </Link>
                    <Link href={`/invoices/preview/${selectedInvoice.id}?type=${selectedInvoice.isProforma ? 'proforma' : 'invoice'}-bp`} className="flex items-center justify-center px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded text-xs font-medium transition-colors">
                      <FileText className="w-3.5 h-3.5 mr-1.5" /> Preview Pelunasan
                    </Link>
                    <a href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/invoices/${selectedInvoice.id}/pdf`} target="_blank" className="col-span-2 flex items-center justify-center px-3 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 rounded text-xs font-medium transition-colors">
                      <Download className="w-3.5 h-3.5 mr-1.5" /> Unduh PDF
                    </a>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mt-6">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">Upload Bukti Bayar</h4>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Jenis Pembayaran</label>
                      <select 
                        value={uploadType} 
                        onChange={(e) => setUploadType(e.target.value as "DP" | "BP")}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500"
                      >
                        <option value="DP">DP (Down Payment)</option>
                        <option value="BP">BP (Pelunasan)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Rekening Tujuan</label>
                      <select 
                        value={selectedBank} 
                        onChange={(e) => setSelectedBank(e.target.value as "Mandiri" | "BCA")}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500"
                      >
                        <option value="Mandiri">Bank Mandiri</option>
                        <option value="BCA">Bank BCA</option>
                      </select>
                    </div>
                  </div>

                  <label className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer mb-4 block relative">
                    <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadFile(e.target.files[0]);
                      }
                    }} />
                    <UploadCloud className="w-6 h-6 text-gray-400 mb-2" />
                    <div className="font-medium text-gray-900 mb-1 text-[13px]">
                      {uploadFile ? uploadFile.name : "Pilih File Bukti Bayar"}
                    </div>
                    <div className="text-[11px] text-gray-500">Max. ukuran file: 5MB (PDF/JPG/PNG)</div>
                  </label>

                  <button 
                    onClick={handleUploadBukti}
                    disabled={isUploading || !uploadFile}
                    className="w-full flex justify-center items-center px-4 py-2 text-[13px] font-medium text-white bg-brand-700 rounded hover:bg-brand-800 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isUploading ? 'Mengunggah...' : 'Simpan & Update Status'}
                  </button>
                </div>
              </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
