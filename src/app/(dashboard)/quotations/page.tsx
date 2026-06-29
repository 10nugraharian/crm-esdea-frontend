"use client";

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  Upload, 
  Download, 
  Edit2,
  FileText,
  FileCheck,
  X,
  ChevronDown,
  Columns
} from "lucide-react";
import Link from "next/link";
import CreateQuotationModal from "@/components/CreateQuotationModal";
import Modal from "@/components/Modal";

type ApprovalStatus = "Approved" | "Pending Finance" | "Rejected" | "Proforma Invoice Issued";

interface Quotation {
  id: string;
  no: number;
  tanggalQuotation: string;
  noQuotation: string;
  namaPerusahaan: string;
  summaryLayanan: string;
  totalAmount: number;
  statusApproval: ApprovalStatus;
}

const initialQuotations: Quotation[] = [
  { 
    id: "Q-001", no: 1, tanggalQuotation: "2026-06-28", noQuotation: "1045/Esdea/VI/2026", 
    namaPerusahaan: "PT. Tambang Alpha", summaryLayanan: "Pengurusan SBU Jasa Konstruksi", 
    totalAmount: 15000000, statusApproval: "Approved"
  },
  { 
    id: "Q-002", no: 2, tanggalQuotation: "2026-06-29", noQuotation: "1046/Esdea/VI/2026", 
    namaPerusahaan: "PT. Migas Beta", summaryLayanan: "ISO 9001 & 14001", 
    totalAmount: 25000000, statusApproval: "Pending Finance"
  }
];

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>(initialQuotations);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRequestPIModalOpen, setIsRequestPIModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  
  // Modal State
  const [dpPercent, setDpPercent] = useState<string>("50");
  const bpPercent = 100 - (Number(dpPercent) || 0);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
  };

  const openRequestModal = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setDpPercent("50");
    setIsRequestPIModalOpen(true);
  };

  const handleRequestProforma = () => {
    if (!selectedQuotation) return;
    const dp = Number(dpPercent) || 0;
    
    let newStatus: ApprovalStatus = "Proforma Invoice Issued";
    if (dp < 50) {
      newStatus = "Pending Finance";
    }

    setQuotations(prev => prev.map(q => 
      q.id === selectedQuotation.id ? { ...q, statusApproval: newStatus } : q
    ));
    
    setIsRequestPIModalOpen(false);
    setIsDetailModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-tl-[16px] overflow-hidden">
      {/* Page Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-800">Quotations</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center px-4 py-1.5 text-[13px] font-medium text-white bg-brand-700 rounded hover:bg-brand-800 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Buat Quotation
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
              placeholder="Search quotations..." 
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
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Tanggal</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">No Quotation</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Perusahaan</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Layanan</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Total (Rp)</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 align-top">
              {quotations.map((q) => (
                <tr 
                  key={q.id} 
                  className="hover:bg-brand-50/40 group transition-colors cursor-pointer"
                  onClick={(e) => {
                    if ((e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'A') {
                      setSelectedQuotation(q);
                      setIsDetailModalOpen(true);
                    }
                  }}
                >
                  <td className="px-4 py-2.5 text-center align-middle">
                    <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500 opacity-50 group-hover:opacity-100" />
                  </td>
                  <td className="px-4 py-2.5 align-middle">{q.tanggalQuotation}</td>
                  <td className="px-4 py-2.5 align-middle font-mono text-xs text-brand-600 font-medium">
                    <Link href={`/quotations/preview/${q.id}`} className="hover:underline">{q.noQuotation}</Link>
                  </td>
                  <td className="px-4 py-2.5 align-middle font-medium text-gray-900">{q.namaPerusahaan}</td>
                  <td className="px-4 py-2.5 align-middle max-w-[200px] truncate" title={q.summaryLayanan}>{q.summaryLayanan}</td>
                  <td className="px-4 py-2.5 align-middle font-medium text-gray-900">{formatRupiah(q.totalAmount)}</td>
                  <td className="px-4 py-2.5 align-middle">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border
                      ${q.statusApproval === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' : 
                        q.statusApproval === 'Pending Finance' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                        q.statusApproval === 'Proforma Invoice Issued' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                        'bg-red-50 text-red-700 border-red-200'}`}>
                      {q.statusApproval}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL QUOTATION SLIDE-OVER -> MODAL */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Detail Quotation"
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
        {selectedQuotation && (
          <div className="p-2 text-[13px] text-gray-700">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <div className="text-xs text-brand-600 font-mono font-medium">{selectedQuotation.noQuotation}</div>
                  <h3 className="text-xl font-bold text-gray-900 mt-1">{selectedQuotation.namaPerusahaan}</h3>
                  <span className={`inline-flex items-center px-2 py-0.5 mt-2 rounded text-[11px] font-medium border
                    ${selectedQuotation.statusApproval === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' : 
                      selectedQuotation.statusApproval === 'Pending Finance' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                      selectedQuotation.statusApproval === 'Proforma Invoice Issued' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                      'bg-red-50 text-red-700 border-red-200'}`}>
                    {selectedQuotation.statusApproval}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <Link 
                    href={`/quotations/preview/${selectedQuotation.id}`}
                    className="flex items-center justify-center px-3 py-1.5 bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200 rounded text-[13px] font-medium transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 mr-1.5" /> Preview PDF
                  </Link>
                  <Link 
                    href={`/quotations/preview/${selectedQuotation.id}`} 
                    className="flex items-center justify-center px-3 py-1.5 bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-300 rounded text-[13px] font-medium transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 mr-1.5" /> Download
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">Informasi Quotation</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-500">Tanggal Quotation</div>
                      <div className="font-medium text-gray-900">{selectedQuotation.tanggalQuotation}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Total Biaya</div>
                      <div className="font-bold text-gray-900">{formatRupiah(selectedQuotation.totalAmount)}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs text-gray-500">Summary Layanan</div>
                      <div className="font-medium text-gray-900">{selectedQuotation.summaryLayanan}</div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mt-6">
                  {selectedQuotation.statusApproval === "Approved" ? (
                    <button 
                      onClick={() => openRequestModal(selectedQuotation)}
                      className="w-full flex justify-center items-center px-4 py-2 text-[13px] font-medium text-white bg-green-600 rounded hover:bg-green-700 transition-colors shadow-sm"
                    >
                      <FileCheck className="w-4 h-4 mr-2" /> Ajukan Proforma Invoice
                    </button>
                  ) : (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded text-center text-gray-500 text-xs">
                      Quotation belum di-approve atau Proforma Invoice sudah diajukan.
                    </div>
                  )}
                </div>
              </div>
          </div>
        )}
      </Modal>

      {/* MODAL AJUKAN INVOICE / REQUEST PROFORMA */}
      <Modal
        isOpen={isRequestPIModalOpen}
        onClose={() => setIsRequestPIModalOpen(false)}
        title="Request Proforma Invoice"
        maxWidth="max-w-md"
        footer={
          <>
            <button 
              onClick={() => setIsRequestPIModalOpen(false)} 
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-[13px] font-medium hover:bg-gray-50"
            >
              Batal
            </button>
            <button 
              onClick={handleRequestProforma}
              className="px-4 py-2 bg-brand-700 text-white rounded-md text-[13px] font-medium hover:bg-brand-800 shadow-sm"
            >
              Submit Request
            </button>
          </>
        }
      >
        {selectedQuotation && (
          <div className="p-2">
              <div className="mb-4 bg-gray-50 p-3 rounded border border-gray-200 text-sm">
                <p><span className="text-gray-500">Perusahaan:</span> <span className="font-medium text-gray-800">{selectedQuotation.namaPerusahaan}</span></p>
                <p><span className="text-gray-500">Total:</span> <span className="font-medium text-gray-800">{formatRupiah(selectedQuotation.totalAmount)}</span></p>
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Persentase Down Payment (DP %)
              </label>
              <div className="flex items-center gap-2 mb-4">
                <input 
                  type="number" 
                  min="0" 
                  max="100"
                  value={dpPercent}
                  onChange={(e) => setDpPercent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-500 font-medium">%</span>
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sisa Pembayaran (BP %)
              </label>
              <div className="flex items-center gap-2 mb-6">
                <input 
                  type="number" 
                  value={bpPercent}
                  disabled
                  className="w-full px-3 py-2 border border-gray-200 bg-gray-100 rounded text-gray-600"
                />
                <span className="text-gray-500 font-medium">%</span>
              </div>

              {Number(dpPercent) >= 50 ? (
                <div className="p-3 mb-6 bg-green-50 text-green-700 text-sm rounded border border-green-200 flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
                  <p>DP memenuhi syarat (&ge;50%). Proforma Invoice akan diterbitkan secara <strong>Otomatis</strong>.</p>
                </div>
              ) : (
                <div className="p-3 mb-6 bg-yellow-50 text-yellow-700 text-sm rounded border border-yellow-200 flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 shrink-0"></div>
                  <p>DP di bawah standar (&lt;50%). Pengajuan ini memerlukan <strong>Approval Finance</strong>.</p>
                </div>
              )}

          </div>
        )}
      </Modal>
      {/* MODAL CREATE QUOTATION */}
      <CreateQuotationModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={() => {
          const newQ: Quotation = {
            id: `Q-00${quotations.length + 1}`,
            no: quotations.length + 1,
            tanggalQuotation: new Date().toISOString().split('T')[0],
            noQuotation: `104${quotations.length + 5}/Esdea/VI/2026`,
            namaPerusahaan: "Perusahaan Baru",
            summaryLayanan: "Layanan Baru (Auto-generated)",
            totalAmount: 12500000,
            statusApproval: "Approved"
          };
          setQuotations([newQ, ...quotations]);
          alert("Quotation berhasil dibuat!");
          setIsCreateModalOpen(false);
        }}
      />
    </div>
  );
}
