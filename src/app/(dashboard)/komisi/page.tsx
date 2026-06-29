"use client";

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  CheckCircle,
  Clock,
  Wallet,
  Edit2,
  X,
  Columns,
  ChevronDown,
  FileSpreadsheet
} from "lucide-react";
import Modal from "@/components/Modal";
import * as XLSX from 'xlsx';

interface KomisiItem {
  id: string;
  namaLayanan: string;
  hargaJual: number;
  hargaPokok: number;
  hargaModal: number;
  refund: number;
  komisiSales: number;
  komisiLeader: number;
  komisiManager: number;
}

interface KomisiData {
  id: string;
  noInvoice: string;
  namaSales: string;
  namaPerusahaan: string;
  items: KomisiItem[];
  statusKomisi: "Pending" | "Ready to Pay" | "Paid";
  isBelowPokok?: boolean;
}

const initialKomisi: KomisiData[] = [
  {
    id: "KOM-001",
    noInvoice: "INV-001/Esdea/VI/2026",
    namaSales: "Rian Nugraha",
    namaPerusahaan: "PT. Tambang Alpha",
    items: [
      {
        id: "ITM-1",
        namaLayanan: "Pengurusan SBU Jasa Konstruksi",
        hargaJual: 15000000,
        hargaPokok: 12000000,
        hargaModal: 10000000,
        refund: 500000,
        komisiSales: 1250000,
        komisiLeader: 250000,
        komisiManager: 100000
      }
    ],
    statusKomisi: "Ready to Pay",
    isBelowPokok: false
  },
  {
    id: "KOM-002",
    noInvoice: "INV-002/Esdea/VI/2026",
    namaSales: "Siti Aminah",
    namaPerusahaan: "PT. Migas Beta",
    items: [
      {
        id: "ITM-2",
        namaLayanan: "ISO 9001",
        hargaJual: 10000000,
        hargaPokok: 15000000,
        hargaModal: 12000000,
        refund: 0,
        komisiSales: 0,
        komisiLeader: 0,
        komisiManager: 0
      },
      {
        id: "ITM-3",
        namaLayanan: "ISO 14001",
        hargaJual: 10000000,
        hargaPokok: 10000000,
        hargaModal: 10000000,
        refund: 0,
        komisiSales: 500000,
        komisiLeader: 100000,
        komisiManager: 50000
      }
    ],
    statusKomisi: "Pending",
    isBelowPokok: true // Jual di bawah harga pokok, finance set komisi
  },
  {
    id: "KOM-003",
    noInvoice: "INV-003/Esdea/VII/2026",
    namaSales: "Rian Nugraha",
    namaPerusahaan: "PT. Konstruksi Delta",
    items: [
      {
        id: "ITM-4",
        namaLayanan: "NIB & Akta Pendirian",
        hargaJual: 8000000,
        hargaPokok: 6000000,
        hargaModal: 5000000,
        refund: 150000,
        komisiSales: 350000,
        komisiLeader: 50000,
        komisiManager: 25000
      }
    ],
    statusKomisi: "Pending",
    isBelowPokok: false
  }
];

export default function KomisiPage() {
  const [data, setData] = useState<KomisiData[]>(initialKomisi);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKomisi, setSelectedKomisi] = useState<KomisiData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [isDisburseModalOpen, setIsDisburseModalOpen] = useState(false);
  const [disburseData, setDisburseData] = useState<KomisiData | null>(null);

  const filteredData = data.filter(k => 
    k.namaSales.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.namaPerusahaan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.noInvoice.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="flex flex-col h-full bg-white rounded-tl-[16px] overflow-hidden">
      {/* Page Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Daftar Komisi & Refund</h1>
          <p className="text-sm text-gray-500 mt-1">Pantau pencairan komisi sales dan pengeluaran refund.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center px-4 py-1.5 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">
            <Download className="w-3.5 h-3.5 mr-2 text-gray-500" />
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
              placeholder="Cari sales atau perusahaan..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 text-[13px] border border-gray-300 rounded bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 w-64 transition-all"
            />
          </div>
          
          <div className="h-4 w-px bg-gray-300 mx-1"></div>

          <button className="flex items-center px-3 py-1 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
            Status: Any <ChevronDown className="w-3.5 h-3.5 ml-1 text-gray-400" />
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
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200 w-10 text-center">
                  <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                </th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">No Invoice</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Nama Sales</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Nama Perusahaan</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200 text-right">Harga Modal</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200 text-right">Harga Jual</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200 text-right">Refund</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200 text-right">Total Komisi</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200 text-center">Status Komisi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 align-top">
              {filteredData.map((k, idx) => {
                const items = k.items || [];
                const totalModal = items.reduce((sum, it) => sum + (it.hargaModal || 0), 0);
                const totalJual = items.reduce((sum, it) => sum + (it.hargaJual || 0), 0);
                const totalRefund = items.reduce((sum, it) => sum + (it.refund || 0), 0);
                const totalKomisiSales = items.reduce((sum, it) => sum + (it.komisiSales || 0), 0);

                return (
                  <tr 
                    key={k.id} 
                    className={`${k.isBelowPokok ? "bg-red-50/50 hover:bg-red-50" : "hover:bg-brand-50/40"} group transition-colors cursor-pointer`}
                    onClick={(e) => {
                      if ((e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'BUTTON') {
                        setSelectedKomisi(k);
                        setIsDetailModalOpen(true);
                      }
                    }}
                  >
                    <td className="px-4 py-2.5 text-center align-middle">
                      <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500 opacity-50 group-hover:opacity-100" />
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-brand-600 font-medium align-middle">
                      <span className="hover:underline cursor-pointer">{k.noInvoice}</span>
                    </td>
                    <td className="px-4 py-2.5 font-medium text-gray-900 align-middle">{k.namaSales}</td>
                    <td className="px-4 py-2.5 truncate max-w-[150px] align-middle">{k.namaPerusahaan}</td>
                    <td className="px-4 py-2.5 text-right align-middle">
                      <span className="font-medium text-gray-700">{formatRupiah(totalModal)}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right align-middle">{formatRupiah(totalJual)}</td>
                    <td className="px-4 py-2.5 text-right text-red-600 align-middle">
                      {totalRefund > 0 ? formatRupiah(totalRefund) : "-"}
                    </td>
                    <td className="px-4 py-2.5 text-right align-middle">
                      <span className="font-medium text-green-700">{formatRupiah(totalKomisiSales)}</span>
                    </td>
                    <td className="px-4 py-2.5 text-center align-middle">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                        ${k.statusKomisi === "Paid" ? "bg-green-50 text-green-700 border-green-200" : 
                          k.statusKomisi === "Ready to Pay" ? "bg-blue-50 text-blue-700 border-blue-200" : 
                          "bg-yellow-50 text-yellow-700 border-yellow-200"}`}
                      >
                        {k.statusKomisi === "Pending" && <Clock className="w-3 h-3 mr-1" />}
                        {k.statusKomisi === "Ready to Pay" && <Wallet className="w-3 h-3 mr-1" />}
                        {k.statusKomisi === "Paid" && <CheckCircle className="w-3 h-3 mr-1" />}
                        {k.statusKomisi}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-gray-500">
                    Tidak ada data komisi yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL SLIDE-OVER -> MODAL */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Detail Komisi & Refund"
        maxWidth="max-w-5xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <div>
              {selectedKomisi?.statusKomisi === "Ready to Pay" && (
                <button 
                  onClick={() => {
                    setDisburseData(selectedKomisi);
                    setIsDisburseModalOpen(true);
                    setIsDetailModalOpen(false);
                  }}
                  className="inline-flex items-center px-4 py-2 text-[13px] font-medium text-white bg-green-600 rounded hover:bg-green-700 transition-colors shadow-sm"
                >
                  Tandai Dibayar
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  if (selectedKomisi) {
                    setData(data.map(k => k.id === selectedKomisi.id ? selectedKomisi : k));
                  }
                  alert("Data komisi berhasil diperbarui!");
                  setIsDetailModalOpen(false);
                }}
                className="px-4 py-2 text-[13px] font-medium text-white bg-brand-700 rounded hover:bg-brand-800 transition-colors"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        }
      >
        {selectedKomisi && (
          <div className="p-2">
              <div className="mb-6 flex gap-3">
                <button 
                  onClick={() => {
                    // Generate Excel Slip Komisi
                    const wb = XLSX.utils.book_new();
                    const wsData: any[][] = [
                      ["SLIP KOMISI SALES"],
                      [""],
                      ["No Invoice", selectedKomisi.noInvoice],
                      ["Nama Perusahaan", selectedKomisi.namaPerusahaan],
                      ["Nama Sales", selectedKomisi.namaSales],
                      [""],
                      ["Layanan", "Harga Jual", "Harga Pokok", "Harga Modal", "Refund", "Komisi Sales"],
                    ];
                    
                    selectedKomisi.items.forEach(it => {
                      wsData.push([
                        it.namaLayanan,
                        it.hargaJual,
                        it.hargaPokok,
                        it.hargaModal,
                        it.refund,
                        it.komisiSales
                      ]);
                    });

                    wsData.push([""]);
                    wsData.push([
                      "TOTAL", 
                      selectedKomisi.items.reduce((s,i)=>s+i.hargaJual,0), 
                      "", "", "", 
                      selectedKomisi.items.reduce((s,i)=>s+i.komisiSales,0)
                    ]);

                    const ws = XLSX.utils.aoa_to_sheet(wsData);
                    XLSX.utils.book_append_sheet(wb, ws, "Slip Komisi");
                    XLSX.writeFile(wb, `Slip_Komisi_${selectedKomisi.namaSales.replace(/\s+/g, '_')}_${selectedKomisi.id}.xlsx`);
                  }}
                  className="flex items-center px-4 py-2 text-[13px] font-medium text-brand-700 bg-brand-50 border border-brand-200 rounded hover:bg-brand-100 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Download Slip Komisi (Excel A5)
                </button>
              </div>

              {/* Invoice Info (Read Only) */}
              <div className="mb-6 bg-blue-50/50 p-4 rounded-lg border border-blue-100 flex flex-wrap gap-8">
                <div>
                  <span className="text-gray-500 block text-xs">No Invoice</span>
                  <span className="font-medium text-gray-800">{selectedKomisi.noInvoice}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs">Nama Perusahaan</span>
                  <span className="font-medium text-gray-800">{selectedKomisi.namaPerusahaan}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs">Nama Sales</span>
                  <span className="font-medium text-gray-800">{selectedKomisi.namaSales}</span>
                </div>
              </div>

              {/* Loop over items for editing in a Table */}
              <div className="border border-gray-200 rounded-lg overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-700 whitespace-nowrap min-w-[900px]">
                  <thead className="bg-gray-100 border-b border-gray-200 text-gray-600 uppercase tracking-wider">
                    <tr>
                      <th className="px-3 py-2 font-semibold">No</th>
                      <th className="px-3 py-2 font-semibold min-w-[150px]">Nama Layanan</th>
                      <th className="px-3 py-2 font-semibold text-right">Harga Jual</th>
                      <th className="px-3 py-2 font-semibold text-right">Harga Pokok</th>
                      <th className="px-3 py-2 font-semibold text-right">Harga Modal</th>
                      <th className="px-3 py-2 font-semibold text-right">Margin</th>
                      <th className="px-3 py-2 font-semibold text-right">Refund</th>
                      <th className="px-3 py-2 font-semibold text-right">K. Sales</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {(selectedKomisi.items || []).map((item, index) => {
                      const margin = item.hargaJual - item.hargaModal;
                      return (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-3 py-3 text-center">{index + 1}</td>
                          <td className="px-3 py-3 font-medium whitespace-normal leading-tight">{item.namaLayanan}</td>
                          <td className="px-3 py-3 text-right text-gray-500">{formatRupiah(item.hargaJual)}</td>
                          <td className="px-3 py-3 text-right text-gray-500">{formatRupiah(item.hargaPokok)}</td>
                          <td className="px-3 py-3">
                            <input 
                              type="number" 
                              value={item.hargaModal}
                              onChange={(e) => {
                                const newItems = [...selectedKomisi.items];
                                newItems[index].hargaModal = Number(e.target.value);
                                setSelectedKomisi({...selectedKomisi, items: newItems});
                              }}
                              className={`w-28 text-right px-2 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-500 ml-auto block ${
                                item.hargaModal > item.hargaJual ? "border-red-300 bg-red-50 text-red-700" : "border-gray-300"
                              }`}
                            />
                          </td>
                          <td className="px-3 py-3 text-right font-medium text-gray-800">
                            {formatRupiah(margin)}
                          </td>
                          <td className="px-3 py-3">
                            <input 
                              type="number" 
                              value={item.refund}
                              onChange={(e) => {
                                const newItems = [...selectedKomisi.items];
                                newItems[index].refund = Number(e.target.value);
                                setSelectedKomisi({...selectedKomisi, items: newItems});
                              }}
                              className="w-24 text-right px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-500 ml-auto block"
                            />
                          </td>
                          <td className="px-3 py-3">
                            <input 
                              type="number" 
                              value={item.komisiSales}
                              onChange={(e) => {
                                const newItems = [...selectedKomisi.items];
                                newItems[index].komisiSales = Number(e.target.value);
                                setSelectedKomisi({...selectedKomisi, items: newItems});
                              }}
                              className="w-24 text-right px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-500 ml-auto block"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
          </div>
        )}
      </Modal>

      {/* Disburse Modal */}
      <Modal
        isOpen={isDisburseModalOpen}
        onClose={() => setIsDisburseModalOpen(false)}
        title="Konfirmasi Pencairan Komisi"
        footer={
          <>
            <button 
              onClick={() => setIsDisburseModalOpen(false)}
              className="px-4 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              Batal
            </button>
            <button 
              onClick={() => {
                if (disburseData) {
                  setData(data.map(k => k.id === disburseData.id ? { ...k, statusKomisi: "Paid" } : k));
                }
                alert("Komisi berhasil ditandai dibayar!");
                setIsDisburseModalOpen(false);
              }}
              className="px-4 py-2 text-[13px] font-medium text-white bg-green-600 rounded hover:bg-green-700"
            >
              Ya, Tandai Dibayar
            </button>
          </>
        }
      >
        <div className="text-[13px] text-gray-600 space-y-4">
          <p>
            Anda akan menandai komisi untuk sales <strong className="text-gray-900">{disburseData?.namaSales}</strong> sebagai <strong>Dibayar (Paid)</strong>.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded p-4">
            <div className="grid grid-cols-2 gap-y-2">
              <div className="text-gray-500">No Invoice:</div>
              <div className="font-medium text-gray-900 text-right">{disburseData?.noInvoice}</div>
              
              <div className="text-gray-500">Perusahaan:</div>
              <div className="font-medium text-gray-900 text-right">{disburseData?.namaPerusahaan}</div>
              
              <div className="text-gray-500 mt-2 pt-2 border-t border-gray-200">Total Komisi:</div>
              <div className="font-bold text-green-700 text-right text-base mt-2 pt-2 border-t border-gray-200">
                {formatRupiah(disburseData?.items.reduce((sum, it) => sum + (it.komisiSales || 0), 0) || 0)}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Catatan Tambahan (Opsional)</label>
            <textarea className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" rows={2} placeholder="No referensi transfer, dsb..."></textarea>
          </div>
        </div>
      </Modal>

    </div>
  );
}
