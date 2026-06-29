"use client";

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  Edit2,
  FileText,
  ChevronDown,
  UploadCloud,
  CheckCircle2,
  Columns,
  Plus,
  X
} from "lucide-react";
import Link from "next/link";
import Modal from "@/components/Modal";

type PaymentStatus = "Unpaid" | "Partial (DP Paid)" | "Paid";
type InvoiceType = "proforma-dp" | "proforma-bp" | "invoice-dp" | "invoice-bp";

interface Invoice {
  id: string;
  no: number;
  noInvoice: string;
  tanggalInvoice: string;
  namaPerusahaan: string;
  summaryLayanan: string;
  totalAmount: number;
  tanggalDp: string | null;
  tanggalBp: string | null;
  buktiDpFile: string | null;
  buktiBpFile: string | null;
  statusPembayaran: PaymentStatus;
}

const initialInvoices: Invoice[] = [
  { 
    id: "INV-001", no: 1, noInvoice: "001/INV-DP/ESDEA/VI/2026", tanggalInvoice: "2026-06-28", 
    namaPerusahaan: "PT. Tambang Alpha", summaryLayanan: "Pengurusan SBU Jasa Konstruksi", 
    totalAmount: 15000000, tanggalDp: "2026-06-28", tanggalBp: null, 
    buktiDpFile: "bukti-dp.pdf", buktiBpFile: null,
    statusPembayaran: "Partial (DP Paid)"
  },
  { 
    id: "INV-002", no: 2, noInvoice: "002/INV-BP/ESDEA/VI/2026", tanggalInvoice: "2026-06-29", 
    namaPerusahaan: "PT. Migas Beta", summaryLayanan: "ISO 9001 & 14001", 
    totalAmount: 25000000, tanggalDp: "2026-06-29", tanggalBp: "2026-07-05", 
    buktiDpFile: "bukti-dp.pdf", buktiBpFile: "bukti-bp.pdf",
    statusPembayaran: "Paid"
  },
  { 
    id: "INV-003", no: 3, noInvoice: "003/INV-DP/ESDEA/VII/2026", tanggalInvoice: "2026-07-01", 
    namaPerusahaan: "PT. Konstruksi Delta", summaryLayanan: "NIB & Akta Pendirian", 
    totalAmount: 8000000, tanggalDp: null, tanggalBp: null, 
    buktiDpFile: null, buktiBpFile: null,
    statusPembayaran: "Unpaid"
  }
];

export default function InvoicesPage() {
  const [invoices] = useState<Invoice[]>(initialInvoices);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  
  // Upload State
  const [uploadType, setUploadType] = useState<"DP" | "BP">("DP");
  const [selectedBank, setSelectedBank] = useState<"Mandiri" | "BCA">("Mandiri");

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);

  const filteredInvoices = invoices.filter(inv => 
    inv.namaPerusahaan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.summaryLayanan.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      {/* Advanced Filter Toolbar (HubSpot style) */}
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

          <button className="flex items-center px-3 py-1 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
            Status: Any <ChevronDown className="w-3.5 h-3.5 ml-1 text-gray-400" />
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
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 align-top">
              {filteredInvoices.map((inv) => (
                <tr 
                  key={inv.id} 
                  className="hover:bg-brand-50/40 group transition-colors cursor-pointer"
                  onClick={(e) => {
                    if ((e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'BUTTON') {
                      setSelectedInvoice(inv);
                      setIsDetailModalOpen(true);
                    }
                  }}
                >
                  <td className="px-4 py-2.5 text-center align-middle">
                    <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500 opacity-50 group-hover:opacity-100" />
                  </td>
                  <td className="px-4 py-2.5 align-middle">{inv.tanggalInvoice}</td>
                  <td className="px-4 py-2.5 align-middle font-mono text-xs text-brand-600 font-medium">
                    <span className="hover:underline cursor-pointer">{inv.noInvoice}</span>
                  </td>
                  <td className="px-4 py-2.5 align-middle">
                    <div className="font-medium text-gray-900">{inv.namaPerusahaan}</div>
                    <div className="text-[11px] text-gray-500 truncate max-w-[200px]" title={inv.summaryLayanan}>{inv.summaryLayanan}</div>
                  </td>
                  <td className="px-4 py-2.5 align-middle font-medium text-gray-900">{formatRupiah(inv.totalAmount)}</td>
                  <td className="px-4 py-2.5 align-middle">
                    <div className="flex flex-col gap-1">
                      {inv.tanggalDp ? (
                        <div className="text-xs text-green-700 flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> {inv.tanggalDp}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400 italic">Belum Dibayar</div>
                      )}
                      {inv.buktiDpFile && (
                        <button className="inline-flex items-center text-[10px] text-brand-600 hover:underline bg-brand-50 px-2 py-0.5 rounded w-fit border border-brand-200">
                          <FileText className="w-3 h-3 mr-1" /> Bukti_DP.pdf
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 align-middle">
                    <div className="flex flex-col gap-1">
                      {inv.tanggalBp ? (
                        <div className="text-xs text-green-700 flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> {inv.tanggalBp}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400 italic">Belum Dibayar</div>
                      )}
                      {inv.buktiBpFile && (
                        <button className="inline-flex items-center text-[10px] text-brand-600 hover:underline bg-brand-50 px-2 py-0.5 rounded w-fit border border-brand-200">
                          <FileText className="w-3 h-3 mr-1" /> Bukti_BP.pdf
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 align-middle">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium border
                      ${inv.statusPembayaran === 'Paid' ? 'bg-green-50 text-green-700 border-green-200' : 
                        inv.statusPembayaran === 'Partial (DP Paid)' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                        'bg-red-50 text-red-700 border-red-200'}`}>
                      {inv.statusPembayaran}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                    Tidak ada data invoice yang ditemukan.
                  </td>
                </tr>
              )}
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
                  <div className="text-xs text-brand-600 font-mono font-medium">{selectedInvoice.noInvoice}</div>
                  <h3 className="text-xl font-bold text-gray-900 mt-1">{selectedInvoice.namaPerusahaan}</h3>
                  <span className={`inline-flex items-center px-2 py-0.5 mt-2 rounded text-[11px] font-medium border
                    ${selectedInvoice.statusPembayaran === 'Paid' ? 'bg-green-50 text-green-700 border-green-200' : 
                      selectedInvoice.statusPembayaran === 'Partial (DP Paid)' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                      'bg-red-50 text-red-700 border-red-200'}`}>
                    {selectedInvoice.statusPembayaran}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">Informasi Umum</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-500">Tanggal Invoice</div>
                      <div className="font-medium text-gray-900">{selectedInvoice.tanggalInvoice}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Total Biaya</div>
                      <div className="font-bold text-gray-900">{formatRupiah(selectedInvoice.totalAmount)}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs text-gray-500">Summary Layanan</div>
                      <div className="font-medium text-gray-900">{selectedInvoice.summaryLayanan}</div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">Download Berkas</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Link href={`/invoices/proforma/${selectedInvoice.id}?type=dp`} className="flex items-center justify-center px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded text-xs font-medium transition-colors">
                      <Download className="w-3.5 h-3.5 mr-1.5" /> Proforma DP
                    </Link>
                    <Link href={`/invoices/proforma/${selectedInvoice.id}?type=bp`} className="flex items-center justify-center px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded text-xs font-medium transition-colors">
                      <Download className="w-3.5 h-3.5 mr-1.5" /> Proforma BP
                    </Link>
                    <Link href={`/invoices/generate/${selectedInvoice.id}?type=dp`} className="flex items-center justify-center px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded text-xs font-medium transition-colors">
                      <Download className="w-3.5 h-3.5 mr-1.5" /> Invoice DP
                    </Link>
                    <Link href={`/invoices/generate/${selectedInvoice.id}?type=bp`} className="flex items-center justify-center px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded text-xs font-medium transition-colors">
                      <Download className="w-3.5 h-3.5 mr-1.5" /> Invoice Pelunasan
                    </Link>
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

                  <label className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer mb-4 block">
                    <input type="file" className="hidden" onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        alert(`File ${e.target.files[0].name} dipilih`);
                      }
                    }} />
                    <UploadCloud className="w-6 h-6 text-gray-400 mb-2" />
                    <div className="font-medium text-gray-900 mb-1 text-[13px]">Pilih File Bukti Bayar</div>
                    <div className="text-[11px] text-gray-500">Max. ukuran file: 5MB (PDF/JPG/PNG)</div>
                  </label>

                  <button 
                    onClick={() => {
                      alert(`Bukti bayar ${uploadType} ke rekening ${selectedBank} berhasil diupload.`);
                      setIsDetailModalOpen(false);
                    }}
                    className="w-full flex justify-center items-center px-4 py-2 text-[13px] font-medium text-white bg-brand-700 rounded hover:bg-brand-800 transition-colors shadow-sm"
                  >
                    Simpan & Update Status
                  </button>
                </div>
              </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
