"use client";

import React, { useState } from "react";
import { ArrowLeft, Plus, Trash2, Info, AlertTriangle, CheckCircle } from "lucide-react";
import Link from "next/link";

// ---- Master Data Layanan (dummy, would come from API /layanan) ----
interface Layanan {
  id: string;
  namaLayanan: string;
  kategori: string;
  hargaPokok: number;
  komisiSales: number;
}

const masterLayanan: Layanan[] = [
  { id: "LY-001", namaLayanan: "Pendirian PT", kategori: "Legalitas Badan Usaha", hargaPokok: 5000000, komisiSales: 250000 },
  { id: "LY-002", namaLayanan: "Pendirian CV", kategori: "Legalitas Badan Usaha", hargaPokok: 3000000, komisiSales: 150000 },
  { id: "LY-003", namaLayanan: "NIB OSS RBA", kategori: "Legalitas Badan Usaha", hargaPokok: 1500000, komisiSales: 100000 },
  { id: "LY-004", namaLayanan: "SBU Jasa Konstruksi", kategori: "Sertifikasi Perusahaan", hargaPokok: 8000000, komisiSales: 400000 },
  { id: "LY-005", namaLayanan: "SBU Jasa Konsultan", kategori: "Sertifikasi Perusahaan", hargaPokok: 7500000, komisiSales: 375000 },
  { id: "LY-006", namaLayanan: "ISO 9001", kategori: "Sertifikasi Perusahaan", hargaPokok: 12000000, komisiSales: 600000 },
  { id: "LY-007", namaLayanan: "ISO 14001", kategori: "Sertifikasi Perusahaan", hargaPokok: 12000000, komisiSales: 600000 },
  { id: "LY-008", namaLayanan: "SMK3", kategori: "Sertifikasi Perusahaan", hargaPokok: 10000000, komisiSales: 500000 },
  { id: "LY-009", namaLayanan: "SKK Jenjang 1-9", kategori: "Sertifikasi Personil", hargaPokok: 2000000, komisiSales: 100000 },
  { id: "LY-010", namaLayanan: "Ahli K3 Umum", kategori: "Sertifikasi Personil", hargaPokok: 4000000, komisiSales: 200000 },
];

// ---- Dummy Leads (would come from API /leads) ----
const dummyLeads = [
  { id: "LD-001", namaPerusahaan: "PT. Tambang Alpha", namaPic: "Andi" },
  { id: "LD-002", namaPerusahaan: "PT. Migas Beta", namaPic: "Budi" },
  { id: "LD-003", namaPerusahaan: "PT. Konstruksi Delta", namaPic: "Cici" },
];

// ---- Types ----
interface QuotationItem {
  uid: string;
  layananId: string;
  qty: number;
  hargaJual: number;
}

const MAX_UPPING = 500000;

export default function CreateQuotationPage() {
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [items, setItems] = useState<QuotationItem[]>([
    { uid: crypto.randomUUID(), layananId: "", qty: 1, hargaJual: 0 }
  ]);
  const [diskon, setDiskon] = useState<number>(0);

  // ---- Helpers ----
  const getLayanan = (id: string) => masterLayanan.find(l => l.id === id);
  const selectedLead = dummyLeads.find(l => l.id === selectedLeadId);

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);

  // ---- Item CRUD ----
  const addItem = () => {
    setItems(prev => [...prev, { uid: crypto.randomUUID(), layananId: "", qty: 1, hargaJual: 0 }]);
  };

  const removeItem = (uid: string) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter(i => i.uid !== uid));
  };

  const updateItem = (uid: string, field: keyof QuotationItem, value: string | number) => {
    setItems(prev => prev.map(item => {
      if (item.uid !== uid) return item;
      const updated = { ...item, [field]: value };
      // Auto-fill harga jual with harga pokok when layanan changes
      if (field === "layananId") {
        const lay = masterLayanan.find(l => l.id === value);
        if (lay) updated.hargaJual = lay.hargaPokok;
      }
      return updated;
    }));
  };

  // ---- Calculations ----
  const calculations = items.map(item => {
    const layanan = getLayanan(item.layananId);
    const hargaPokok = layanan ? layanan.hargaPokok : 0;
    const margin = item.hargaJual - hargaPokok;
    const subTotal = item.hargaJual * item.qty;
    const isValid = item.layananId !== "";
    const withinLimit = item.hargaJual >= hargaPokok && margin <= MAX_UPPING;
    return { hargaPokok, margin, subTotal, isValid, withinLimit };
  });

  const totalAmount = calculations.reduce((sum, c) => sum + c.subTotal, 0);
  const grandTotal = totalAmount - diskon;
  const totalRefund = calculations.reduce((sum, c) => sum + (c.margin * items[calculations.indexOf(c)].qty), 0);

  // Rule check: all items must be valid and within limit for auto-generate
  const allItemsValid = items.every(item => item.layananId !== "");
  const allWithinLimit = calculations.every(c => !c.isValid || c.withinLimit);
  const canAutoGenerate = allItemsValid && allWithinLimit && selectedLeadId !== "";
  const needsApproval = allItemsValid && !allWithinLimit && selectedLeadId !== "";

  // Group layanan by kategori for select dropdown
  const groupedLayanan = masterLayanan.reduce((acc, l) => {
    if (!acc[l.kategori]) acc[l.kategori] = [];
    acc[l.kategori].push(l);
    return acc;
  }, {} as Record<string, Layanan[]>);

  return (
    <div className="flex flex-col h-full bg-white rounded-tl-[16px] overflow-hidden">
      {/* Page Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/quotations" className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-semibold text-gray-800">Buat Quotation Baru</h1>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-auto bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Client / Lead Selection */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Informasi Client</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Pilih Leads / Client <span className="text-red-500">*</span></label>
                <select 
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Pilih Perusahaan --</option>
                  {dummyLeads.map(lead => (
                    <option key={lead.id} value={lead.id}>{lead.namaPerusahaan} (PIC: {lead.namaPic})</option>
                  ))}
                </select>
              </div>
              {selectedLead && (
                <div className="flex items-center bg-blue-50 border border-blue-200 rounded-md px-4 py-2 text-sm">
                  <Info className="w-4 h-4 text-blue-500 mr-2 shrink-0" />
                  <span>PIC: <strong>{selectedLead.namaPic}</strong> — {selectedLead.namaPerusahaan}</span>
                </div>
              )}
            </div>
          </div>

          {/* Rincian Layanan Table */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Rincian Layanan</h2>
              <button
                onClick={addItem}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                Tambah Layanan
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 w-10">#</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 min-w-[220px]">Layanan</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-700 w-20">QTY</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700 w-36">Harga Pokok</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700 w-44">Harga Jual</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700 w-36">Margin / Refund</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700 w-36">Sub Total</th>
                    <th className="px-4 py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item, idx) => {
                    const calc = calculations[idx];
                    const layanan = getLayanan(item.layananId);
                    return (
                      <tr key={item.uid} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                        <td className="px-4 py-3">
                          <select 
                            value={item.layananId} 
                            onChange={(e) => updateItem(item.uid, "layananId", e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">Pilih layanan...</option>
                            {Object.entries(groupedLayanan).map(([kategori, layananList]) => (
                              <optgroup key={kategori} label={kategori}>
                                {layananList.map(l => (
                                  <option key={l.id} value={l.id}>{l.namaLayanan}</option>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="number" 
                            min="1" 
                            value={item.qty}
                            onChange={(e) => updateItem(item.uid, "qty", Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3 text-right text-gray-500">
                          {layanan ? formatRupiah(calc.hargaPokok) : "-"}
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="number" 
                            min="0"
                            value={item.hargaJual || ""}
                            onChange={(e) => updateItem(item.uid, "hargaJual", parseInt(e.target.value) || 0)}
                            placeholder="Masukkan harga jual"
                            className={`w-full px-2 py-1.5 text-sm border rounded text-right focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                              calc.isValid && !calc.withinLimit ? "border-red-400 bg-red-50" : "border-gray-300"
                            }`}
                          />
                        </td>
                        <td className="px-4 py-3 text-right">
                          {calc.isValid ? (
                            <span className={`font-medium ${calc.margin >= 0 ? "text-green-600" : "text-red-600"}`}>
                              {calc.margin >= 0 ? "+" : ""}{formatRupiah(calc.margin)}
                            </span>
                          ) : <span className="text-gray-400">-</span>}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-gray-800">
                          {calc.isValid ? formatRupiah(calc.subTotal) : "-"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button 
                            onClick={() => removeItem(item.uid)} 
                            disabled={items.length <= 1}
                            className="p-1 text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Hapus baris"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex justify-end">
                <div className="w-80 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total</span>
                    <span className="font-medium text-gray-800">{formatRupiah(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Diskon</span>
                    <input 
                      type="number" 
                      min="0" 
                      value={diskon || ""}
                      onChange={(e) => setDiskon(parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="w-36 px-2 py-1 text-sm border border-gray-300 rounded text-right focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex justify-between border-t border-gray-300 pt-2">
                    <span className="font-bold text-gray-800">Grand Total</span>
                    <span className="font-bold text-gray-900 text-base">{formatRupiah(grandTotal)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span className="font-medium">Total Refund Sales</span>
                    <span className="font-medium">+{formatRupiah(totalRefund)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rule Info Banner */}
          {allItemsValid && (
            <div className={`flex items-start gap-3 p-4 rounded-lg border text-sm ${
              allWithinLimit 
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-yellow-50 border-yellow-200 text-yellow-800"
            }`}>
              {allWithinLimit ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Margin dalam batas aman</p>
                    <p className="text-green-700 mt-0.5">Semua harga jual berada dalam batas maksimal upping Rp 500.000 dari harga pokok. Quotation dapat langsung di-generate secara otomatis.</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Margin di luar batas standar</p>
                    <p className="text-yellow-700 mt-0.5">Terdapat layanan dengan selisih harga jual melebihi Rp 500.000 dari harga pokok, atau harga jual di bawah harga pokok. Quotation ini membutuhkan <strong>Approval Finance</strong>.</p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pb-4">
            <Link 
              href="/quotations"
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Batal
            </Link>

            {canAutoGenerate && (
              <button className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm">
                <CheckCircle className="w-4 h-4 inline mr-2 -mt-0.5" />
                Buat Quotation
              </button>
            )}

            {needsApproval && (
              <button className="px-6 py-2.5 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700 transition-colors shadow-sm">
                <AlertTriangle className="w-4 h-4 inline mr-2 -mt-0.5" />
                Request Approval Finance
              </button>
            )}

            {!canAutoGenerate && !needsApproval && (
              <button 
                disabled
                className="px-6 py-2.5 text-sm font-medium text-white bg-gray-400 rounded-md cursor-not-allowed"
              >
                Buat Quotation
              </button>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
