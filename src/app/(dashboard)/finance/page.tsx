"use client";

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  FileText,
  Download,
  Eye,
  AlertTriangle,
  Receipt,
  Briefcase,
  UploadCloud,
  CheckCircle2,
  Edit2,
  ChevronDown,
  Columns,
  Plus,
  X,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import Modal from "@/components/Modal";

type TabType = "approval-quotation" | "konfirmasi-pembayaran" | "pembayaran-vendor";

// --- Dummy Data ---
const dummyApprovalQuotations = [
  {
    id: "Q-002",
    noSurat: "1046/Esdea/VI/2026",
    tanggal: "2026-06-29",
    namaPerusahaan: "PT. Migas Beta",
    layanan: "ISO 9001 & 14001",
    totalAmount: 25000000,
    marginIssue: "Harga jual Rp 5.000.000 di bawah harga pokok",
    status: "Pending Finance"
  },
  {
    id: "Q-005",
    noSurat: "1049/Esdea/VI/2026",
    tanggal: "2026-06-30",
    namaPerusahaan: "PT. Konstruksi Omega",
    layanan: "SBU Jasa Konstruksi Besar",
    totalAmount: 18000000,
    marginIssue: "Upping margin melebihi batas (Rp 800.000)",
    status: "Pending Finance"
  }
];

const dummyKonfirmasiPembayaran = [
  {
    id: "PAY-001",
    invoiceId: "INV-001",
    tanggal: "2026-06-28",
    namaPerusahaan: "PT. Tambang Alpha",
    tipeTagihan: "DP 50%",
    nominal: 7500000,
    buktiTransfer: "bukti_tf_alpha.jpg",
    status: "Menunggu Verifikasi"
  },
  {
    id: "PAY-002",
    invoiceId: "INV-002",
    tanggal: "2026-06-29",
    namaPerusahaan: "PT. Migas Beta",
    tipeTagihan: "Pelunasan (BP 50%)",
    nominal: 12500000,
    buktiTransfer: "bukti_tf_beta.pdf",
    status: "Menunggu Verifikasi"
  }
];

const dummyPembayaranVendor = [
  {
    id: "VP-001",
    projectId: "PRJ-001",
    namaPerusahaan: "PT. Tambang Alpha",
    layanan: "Pengurusan SBU Jasa Konstruksi",
    vendor: "PT. Mitra Sertifikasi Utama",
    statusSpk: "On Process",
    hargaModal: 12000000,
    buktiDpFile: "bukti_tf_dp_vendor.pdf",
    buktiBpFile: null,
    status: "Partial (DP Paid)"
  },
  {
    id: "VP-002",
    projectId: "PRJ-001",
    namaPerusahaan: "PT. Tambang Alpha",
    layanan: "Pendaftaran BPJS Ketenagakerjaan",
    vendor: "Biro Jasa Mandiri",
    statusSpk: "Selesai",
    hargaModal: 4500000,
    buktiDpFile: "bukti_tf_dp_vendor.pdf",
    buktiBpFile: "bukti_tf_bp_vendor.pdf",
    status: "Paid"
  }
];

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<TabType>("approval-quotation");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [approvalQuotations, setApprovalQuotations] = useState(dummyApprovalQuotations);
  const [konfirmasiPembayaran, setKonfirmasiPembayaran] = useState(dummyKonfirmasiPembayaran);
  const [pembayaranVendor, setPembayaranVendor] = useState(dummyPembayaranVendor);
  
  // Modal states
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [approvalData, setApprovalData] = useState<{type: "quotation" | "payment", id: string, action: "approve" | "reject" | null}>({type: "quotation", id: "", action: null});

  const [isHargaModalModalOpen, setIsHargaModalModalOpen] = useState(false);
  const [selectedVendorPayment, setSelectedVendorPayment] = useState<any>(null);
  const [hargaModalInput, setHargaModalInput] = useState<number>(0);

  const [isUploadBuktiModalOpen, setIsUploadBuktiModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<"dp" | "bp">("dp");

  // Detail Slide-over states
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="flex flex-col h-full bg-white rounded-tl-[16px] overflow-hidden">
      {/* Page Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Finance Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola approval quotation dan verifikasi pembayaran.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-6 border-b border-gray-200 bg-gray-50 shrink-0">
        <button
          onClick={() => setActiveTab("approval-quotation")}
          className={`flex items-center px-4 py-3 text-[13px] font-medium border-b-2 transition-colors ${
            activeTab === "approval-quotation"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Approval Quotation
          <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">
            {approvalQuotations.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("konfirmasi-pembayaran")}
          className={`flex items-center px-4 py-3 text-[13px] font-medium border-b-2 transition-colors ${
            activeTab === "konfirmasi-pembayaran"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          <Receipt className="w-4 h-4 mr-2" />
          Konfirmasi Pembayaran
          <span className="ml-2 bg-amber-100 text-amber-700 py-0.5 px-2 rounded-full text-xs">
            {konfirmasiPembayaran.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("pembayaran-vendor")}
          className={`flex items-center px-4 py-3 text-[13px] font-medium border-b-2 transition-colors ${
            activeTab === "pembayaran-vendor"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          <Briefcase className="w-4 h-4 mr-2" />
          Pembayaran Vendor
          <span className="ml-2 bg-gray-200 text-gray-700 py-0.5 px-2 rounded-full text-xs">
            {pembayaranVendor.filter(v => v.status !== "Paid").length}
          </span>
        </button>
      </div>

      {/* Advanced Filter Toolbar (HubSpot style) */}
      <div className="flex flex-wrap items-center justify-between px-6 py-2.5 bg-white border-b border-gray-200 shrink-0 gap-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search finance data..." 
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
      <div className="flex-1 overflow-auto bg-gray-50 p-6">
        
        {/* ================= TAB 1: APPROVAL QUOTATION ================= */}
        {activeTab === "approval-quotation" && (
          <div className="flex-1 overflow-x-auto bg-white border-t border-gray-200">
            <table className="w-full text-left text-[13px] text-gray-600 whitespace-nowrap">
              <thead className="bg-[#f5f8fa] border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-2 font-medium text-gray-600 w-10 text-center border-b border-gray-200">
                    <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                  </th>
                  <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Tanggal</th>
                  <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">No Quotation</th>
                  <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Perusahaan</th>
                  <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Layanan</th>
                  <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Total (Rp)</th>
                  <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Margin / Isu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 align-top">
                {approvalQuotations.map((q) => (
                  <tr 
                    key={q.id} 
                    className="hover:bg-brand-50/40 group transition-colors cursor-pointer"
                    onClick={(e) => {
                      if ((e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'A') {
                        setSelectedItem({ ...q, type: "quotation" });
                        setIsDetailModalOpen(true);
                      }
                    }}
                  >
                    <td className="px-4 py-2.5 text-center align-middle">
                      <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500 opacity-50 group-hover:opacity-100" />
                    </td>
                    <td className="px-4 py-2.5 align-middle">{q.tanggal}</td>
                    <td className="px-4 py-2.5 align-middle font-mono text-xs text-brand-600 font-medium">
                      <Link href={`/quotations/preview/${q.id}`} className="hover:underline">{q.noSurat}</Link>
                    </td>
                    <td className="px-4 py-2.5 align-middle font-medium text-gray-900">{q.namaPerusahaan}</td>
                    <td className="px-4 py-2.5 align-middle text-gray-500 max-w-[200px] truncate" title={q.layanan}>{q.layanan}</td>
                    <td className="px-4 py-2.5 align-middle font-medium text-gray-900">{formatRupiah(q.totalAmount)}</td>
                    <td className="px-4 py-2.5 align-middle">
                      <span className="inline-flex items-center text-red-600 text-xs bg-red-50 border border-red-100 px-2 py-0.5 rounded">
                        <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                        {q.marginIssue}
                      </span>
                    </td>
                  </tr>
                ))}
                {approvalQuotations.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      Tidak ada quotation yang membutuhkan approval.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ================= TAB 2: KONFIRMASI PEMBAYARAN ================= */}
        {activeTab === "konfirmasi-pembayaran" && (
          <div className="flex-1 overflow-x-auto bg-white border-t border-gray-200">
            <table className="w-full text-left text-[13px] text-gray-600 whitespace-nowrap">
              <thead className="bg-[#f5f8fa] border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-2 font-medium text-gray-600 w-10 text-center border-b border-gray-200">
                    <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                  </th>
                  <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Tanggal Upload</th>
                  <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Invoice ID</th>
                  <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Perusahaan</th>
                  <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Tipe Tagihan</th>
                  <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Nominal Tagihan</th>
                  <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200 text-center">Bukti Transfer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 align-top">
                {konfirmasiPembayaran.map((p) => (
                  <tr 
                    key={p.id} 
                    className="hover:bg-brand-50/40 group transition-colors cursor-pointer"
                    onClick={(e) => {
                      if ((e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'BUTTON') {
                        setSelectedItem({ ...p, type: "payment" });
                        setIsDetailModalOpen(true);
                      }
                    }}
                  >
                    <td className="px-4 py-2.5 text-center align-middle">
                      <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500 opacity-50 group-hover:opacity-100" />
                    </td>
                    <td className="px-4 py-2.5 align-middle">{p.tanggal}</td>
                    <td className="px-4 py-2.5 align-middle font-mono text-xs text-brand-600 font-medium">
                      <span className="hover:underline cursor-pointer">{p.invoiceId}</span>
                    </td>
                    <td className="px-4 py-2.5 align-middle font-medium text-gray-900">{p.namaPerusahaan}</td>
                    <td className="px-4 py-2.5 align-middle">
                      <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        {p.tipeTagihan}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 align-middle font-medium text-gray-900">{formatRupiah(p.nominal)}</td>
                    <td className="px-4 py-2.5 align-middle text-center">
                      <button className="inline-flex items-center text-[11px] text-brand-600 hover:underline bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                        <FileText className="w-3.5 h-3.5 mr-1" />
                        Lihat Bukti
                      </button>
                    </td>
                  </tr>
                ))}
                {konfirmasiPembayaran.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      Tidak ada pembayaran yang membutuhkan verifikasi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ================= TAB 3: PEMBAYARAN VENDOR ================= */}
        {activeTab === "pembayaran-vendor" && (
          <div className="flex-1 overflow-x-auto bg-white border-t border-gray-200">
            <table className="w-full text-left text-[13px] text-gray-600 whitespace-nowrap">
              <thead className="bg-[#f5f8fa] border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-2 font-medium text-gray-600 w-10 text-center border-b border-gray-200">
                    <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                  </th>
                  <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Project / Perusahaan</th>
                  <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Layanan</th>
                  <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Vendor</th>
                  <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200 text-right">Harga Modal</th>
                  <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200 text-center">Bukti DP</th>
                  <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200 text-center">Bukti BP</th>
                  <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 align-top">
                {pembayaranVendor.map((vp) => (
                  <tr key={vp.id} className="hover:bg-brand-50/40 group transition-colors">
                    <td className="px-4 py-2.5 text-center align-middle">
                      <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500 opacity-50 group-hover:opacity-100" />
                    </td>
                    <td className="px-4 py-2.5 align-middle">
                      <div className="font-medium text-gray-900">{vp.namaPerusahaan}</div>
                      <div className="text-xs text-brand-600 font-mono mt-0.5">{vp.projectId}</div>
                    </td>
                    <td className="px-4 py-2.5 align-middle">
                      <div className="text-gray-500 max-w-[200px] truncate" title={vp.layanan}>{vp.layanan}</div>
                    </td>
                    <td className="px-4 py-2.5 align-middle">
                      <span className="text-[11px] font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
                        {vp.vendor}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 align-middle text-right">
                      {vp.hargaModal ? (
                        <div className="flex items-center justify-end gap-2 group/edit">
                          <span className="font-medium text-gray-900">{formatRupiah(vp.hargaModal)}</span>
                          <button 
                            className="text-gray-400 hover:text-brand-600 opacity-0 group-hover/edit:opacity-100 transition-opacity"
                            onClick={() => {
                              setSelectedVendorPayment(vp);
                              setHargaModalInput(vp.hargaModal);
                              setIsHargaModalModalOpen(true);
                            }}
                            title="Edit Harga Modal"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button 
                          className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium text-brand-700 bg-brand-50 border border-brand-200 rounded hover:bg-brand-100"
                          onClick={() => {
                            setSelectedVendorPayment(vp);
                            setHargaModalInput(0);
                            setIsHargaModalModalOpen(true);
                          }}
                        >
                          <Edit2 className="w-3 h-3 mr-1" /> Input Harga
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-2.5 align-middle text-center">
                      {vp.buktiDpFile ? (
                        <div className="flex flex-col items-center gap-1">
                          <span className="inline-flex items-center text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-200">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Sukses
                          </span>
                          <a href="#" className="text-[10px] text-brand-600 hover:underline flex items-center">
                            Lihat Dokumen
                          </a>
                        </div>
                      ) : (
                        <button 
                          onClick={() => {
                            setSelectedVendorPayment(vp);
                            setUploadType("dp");
                            setIsUploadBuktiModalOpen(true);
                          }}
                          className="inline-flex items-center px-2 py-0.5 text-[11px] text-brand-700 bg-brand-50 border border-brand-200 rounded hover:bg-brand-100 transition-colors"
                        >
                          <UploadCloud className="w-3 h-3 mr-1" /> Upload DP
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-2.5 align-middle text-center">
                      {vp.buktiBpFile ? (
                        <div className="flex flex-col items-center gap-1">
                          <span className="inline-flex items-center text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-200">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Sukses
                          </span>
                          <a href="#" className="text-[10px] text-brand-600 hover:underline flex items-center">
                            Lihat Dokumen
                          </a>
                        </div>
                      ) : (
                        <button 
                          onClick={() => {
                            setSelectedVendorPayment(vp);
                            setUploadType("bp");
                            setIsUploadBuktiModalOpen(true);
                          }}
                          className={`inline-flex items-center px-2 py-0.5 text-[11px] rounded transition-colors border
                            ${!vp.buktiDpFile ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed" : "text-brand-700 bg-brand-50 border-brand-200 hover:bg-brand-100"}
                          `}
                          disabled={!vp.buktiDpFile}
                        >
                          <UploadCloud className="w-3 h-3 mr-1" /> Upload BP
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-2.5 align-middle text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border
                        ${vp.status === "Paid" ? "bg-green-50 text-green-700 border-green-200" : 
                          vp.status === "Partial (DP Paid)" ? "bg-amber-50 text-amber-700 border-amber-200" : 
                          "bg-red-50 text-red-700 border-red-200"}`}
                      >
                        {vp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* DETAIL SLIDE-OVER -> MODAL */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Detail Approval"
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
        {selectedItem && (
          <div className="p-2 text-[13px] text-gray-700">
              {selectedItem.type === "quotation" ? (
                <>
                  <div className="mb-6">
                    <div className="text-xs text-brand-600 font-mono font-medium">{selectedItem.noSurat}</div>
                    <h3 className="text-xl font-bold text-gray-900 mt-1">{selectedItem.namaPerusahaan}</h3>
                    <span className="inline-flex items-center text-red-600 text-[11px] bg-red-50 border border-red-100 px-2 py-0.5 rounded mt-2">
                      <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                      {selectedItem.marginIssue}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div className="border-t border-gray-100 pt-4">
                      <h4 className="text-sm font-semibold text-gray-800 mb-3">Informasi Quotation</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-500">Tanggal</div>
                          <div className="font-medium text-gray-900">{selectedItem.tanggal}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Total Amount</div>
                          <div className="font-bold text-gray-900">{formatRupiah(selectedItem.totalAmount)}</div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-xs text-gray-500">Layanan</div>
                          <div className="font-medium text-gray-900">{selectedItem.layanan}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <div className="text-xs text-brand-600 font-mono font-medium">{selectedItem.invoiceId}</div>
                    <h3 className="text-xl font-bold text-gray-900 mt-1">{selectedItem.namaPerusahaan}</h3>
                    <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200 mt-2">
                      {selectedItem.tipeTagihan}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div className="border-t border-gray-100 pt-4">
                      <h4 className="text-sm font-semibold text-gray-800 mb-3">Informasi Pembayaran</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-500">Tanggal Upload</div>
                          <div className="font-medium text-gray-900">{selectedItem.tanggal}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Nominal Tagihan</div>
                          <div className="font-bold text-gray-900">{formatRupiah(selectedItem.nominal)}</div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-xs text-gray-500 mb-1">Bukti Transfer</div>
                          <button className="inline-flex items-center text-[11px] text-brand-600 hover:underline bg-brand-50 px-3 py-1.5 rounded border border-brand-200 w-fit">
                            <FileText className="w-3.5 h-3.5 mr-1" />
                            {selectedItem.buktiTransfer}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="border-t border-gray-100 pt-4 mt-6">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Dokumen Terkait</h4>
                <div className="flex flex-col gap-2 mb-6">
                  <button className="flex items-center text-[12px] text-gray-600 bg-gray-50 border border-gray-200 p-2.5 rounded-md hover:bg-gray-100 transition-colors">
                    <FileText className="w-4 h-4 mr-2 text-brand-600" />
                    <span className="font-medium">File Quotation</span>
                    <Download className="w-3.5 h-3.5 ml-auto text-gray-400" />
                  </button>
                  {selectedItem.type === "invoice" && (
                    <>
                      <button className="flex items-center text-[12px] text-gray-600 bg-gray-50 border border-gray-200 p-2.5 rounded-md hover:bg-gray-100 transition-colors">
                        <FileText className="w-4 h-4 mr-2 text-green-600" />
                        <span className="font-medium">File Bukti Bayar</span>
                        <Download className="w-3.5 h-3.5 ml-auto text-gray-400" />
                      </button>
                      <button className="flex items-center text-[12px] text-gray-600 bg-gray-50 border border-gray-200 p-2.5 rounded-md hover:bg-gray-100 transition-colors">
                        <FileText className="w-4 h-4 mr-2 text-blue-600" />
                        <span className="font-medium">Surat Perintah Kerja (SPK)</span>
                        <Download className="w-3.5 h-3.5 ml-auto text-gray-400" />
                      </button>
                    </>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setApprovalData({ type: selectedItem.type, id: selectedItem.id, action: "approve" });
                      setIsApprovalModalOpen(true);
                      setIsDetailModalOpen(false);
                    }}
                    className="flex-1 flex justify-center items-center px-4 py-2 text-[13px] font-medium text-white bg-green-600 rounded hover:bg-green-700 transition-colors shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1.5" /> Approve
                  </button>
                  <button 
                    onClick={() => {
                      setApprovalData({ type: selectedItem.type, id: selectedItem.id, action: "reject" });
                      setIsApprovalModalOpen(true);
                      setIsDetailModalOpen(false);
                    }}
                    className="flex-1 flex justify-center items-center px-4 py-2 text-[13px] font-medium text-red-700 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors"
                  >
                    <X className="w-4 h-4 mr-1.5" /> Reject
                  </button>
                </div>
              </div>
          </div>
        )}
      </Modal>

      {/* MODALS */}
      {/* 1. Modal Approval/Reject */}
      <Modal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        title={approvalData.action === "approve" ? "Konfirmasi Persetujuan" : "Konfirmasi Penolakan"}
        footer={
          <>
            <button 
              onClick={() => setIsApprovalModalOpen(false)}
              className="px-4 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              Batal
            </button>
            <button 
              onClick={() => {
                if (approvalData.type === "quotation") {
                  setApprovalQuotations(approvalQuotations.filter(q => q.id !== approvalData.id));
                } else if (approvalData.type === "payment") {
                  setKonfirmasiPembayaran(konfirmasiPembayaran.filter(p => p.id !== approvalData.id));
                }
                alert(approvalData.action === "approve" ? "Data disetujui" : "Data ditolak");
                setIsApprovalModalOpen(false);
              }}
              className={`px-4 py-2 text-[13px] font-medium text-white rounded ${
                approvalData.action === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {approvalData.action === "approve" 
                ? "Ya, Setujui" 
                : approvalData.type === "quotation" 
                  ? "Tolak & Minta Edit Ulang" 
                  : "Ya, Tolak"}
            </button>
          </>
        }
      >
        <div className="text-[13px] text-gray-600">
          Apakah Anda yakin ingin {approvalData.action === "approve" ? "menyetujui" : "menolak"} {approvalData.type === "quotation" ? "Quotation" : "Pembayaran"} ini?
          {approvalData.action === "approve" && approvalData.type === "payment" && (
            <div className="mt-2 text-brand-600 font-medium">
              *Official Invoice akan di-generate secara otomatis setelah persetujuan.
            </div>
          )}
          {approvalData.action === "reject" && (
            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">Alasan Penolakan (Opsional)</label>
              <textarea className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-red-500 focus:border-red-500" rows={3} placeholder="Tuliskan alasan penolakan..."></textarea>
            </div>
          )}
        </div>
      </Modal>

      {/* 2. Modal Input/Edit Harga Modal Vendor */}
      <Modal
        isOpen={isHargaModalModalOpen}
        onClose={() => setIsHargaModalModalOpen(false)}
        title="Input Harga Modal Vendor"
        footer={
          <>
            <button 
              onClick={() => setIsHargaModalModalOpen(false)}
              className="px-4 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              Batal
            </button>
            <button 
              onClick={() => {
                if (selectedVendorPayment) {
                  setPembayaranVendor(pembayaranVendor.map(vp => vp.id === selectedVendorPayment.id ? { ...vp, hargaModal: hargaModalInput } : vp));
                }
                setIsHargaModalModalOpen(false);
              }}
              className="px-4 py-2 text-[13px] font-medium text-white bg-brand-700 rounded hover:bg-brand-800"
            >
              Simpan
            </button>
          </>
        }
      >
        <div className="text-[13px] text-gray-600">
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-1">Vendor</div>
            <div className="font-medium text-gray-900">{selectedVendorPayment?.vendor}</div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Harga Modal (Rp)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
              <input 
                type="number" 
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded focus:ring-brand-500 focus:border-brand-500" 
                value={hargaModalInput}
                onChange={(e) => setHargaModalInput(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* 3. Modal Upload Bukti Transfer DP/BP */}
      <Modal
        isOpen={isUploadBuktiModalOpen}
        onClose={() => setIsUploadBuktiModalOpen(false)}
        title={`Upload Bukti Pembayaran ${uploadType.toUpperCase()}`}
        footer={
          <>
            <button 
              onClick={() => setIsUploadBuktiModalOpen(false)}
              className="px-4 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              Batal
            </button>
            <button 
              onClick={() => {
                if (selectedVendorPayment) {
                  setPembayaranVendor(pembayaranVendor.map(vp => {
                    if (vp.id === selectedVendorPayment.id) {
                      if (uploadType === "dp") {
                        return { ...vp, buktiDpFile: "uploaded_dp.pdf", status: "Partial (DP Paid)" };
                      } else {
                        return { ...vp, buktiBpFile: "uploaded_bp.pdf", status: "Paid" };
                      }
                    }
                    return vp;
                  }));
                }
                setIsUploadBuktiModalOpen(false);
              }}
              className="px-4 py-2 text-[13px] font-medium text-white bg-brand-700 rounded hover:bg-brand-800"
            >
              Upload Bukti
            </button>
          </>
        }
      >
        <div className="text-[13px] text-gray-600">
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-1">Vendor</div>
            <div className="font-medium text-gray-900">{selectedVendorPayment?.vendor}</div>
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center text-center">
            <UploadCloud className="w-8 h-8 text-brand-600 mb-2" />
            <div className="font-medium text-gray-900 mb-1">Pilih atau letakkan file di sini</div>
            <div className="text-xs text-gray-500">Format yang didukung: JPG, PNG, PDF (Max. 5MB)</div>
            <button className="mt-4 px-3 py-1.5 text-xs font-medium text-brand-700 bg-brand-50 border border-brand-200 rounded hover:bg-brand-100">
              Pilih File
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
