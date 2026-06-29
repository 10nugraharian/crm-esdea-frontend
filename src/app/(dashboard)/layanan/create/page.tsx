"use client";

import React, { useState } from "react";
import { ArrowLeft, Save, Plus, Trash2, Info } from "lucide-react";
import Link from "next/link";

const KATEGORI_OPTIONS = [
  "General",
  "Legalitas Badan Usaha",
  "Sertifikasi Perusahaan",
  "Sertifikasi Personil",
  "K3 & Safety",
  "Lainnya",
];

const KOMISI_SSO_FIX = 50000;

export default function CreateLayananPage() {
  const [namaLayanan, setNamaLayanan] = useState("");
  const [kategori, setKategori] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [hargaModal, setHargaModal] = useState<number>(0);
  const [hargaPokok, setHargaPokok] = useState<number>(0);
  const [komisiSales, setKomisiSales] = useState<number>(0);
  const [komisiLeader, setKomisiLeader] = useState<number>(0);
  const [komisiManager, setKomisiManager] = useState<number>(0);

  const margin = hargaPokok - hargaModal;

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);

  const isFormValid =
    namaLayanan.trim() !== "" &&
    kategori !== "" &&
    hargaPokok > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Layanan "${namaLayanan}" berhasil disimpan!`);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-tl-[16px] overflow-hidden">
      {/* Page Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/layanan" className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-semibold text-gray-800">Tambah Layanan Baru</h1>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-auto bg-gray-50 p-6">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">

          {/* Informasi Layanan */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-5">Informasi Layanan</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Nama Layanan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={namaLayanan}
                  onChange={(e) => setNamaLayanan(e.target.value)}
                  placeholder="Contoh: SKK - JENJANG 9"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Pilih Kategori --</option>
                  {KATEGORI_OPTIONS.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Keterangan</label>
                <input
                  type="text"
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="Contoh: SKK & KTA Asosiasi"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Harga */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-5">Harga</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Harga Modal</label>
                <input
                  type="number"
                  min="0"
                  value={hargaModal || ""}
                  onChange={(e) => setHargaModal(parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Harga Pokok <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={hargaPokok || ""}
                  onChange={(e) => setHargaPokok(parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Margin (Otomatis)</label>
                <div className="px-3 py-2 text-sm border border-gray-200 bg-gray-100 rounded-md text-gray-700 font-medium">
                  {formatRupiah(margin)}
                </div>
              </div>
            </div>
          </div>

          {/* Komisi */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-5">Struktur Komisi</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Komisi Sales</label>
                <input
                  type="number"
                  min="0"
                  value={komisiSales || ""}
                  onChange={(e) => setKomisiSales(parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Komisi Leader</label>
                <input
                  type="number"
                  min="0"
                  value={komisiLeader || ""}
                  onChange={(e) => setKomisiLeader(parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Komisi Manager</label>
                <input
                  type="number"
                  min="0"
                  value={komisiManager || ""}
                  onChange={(e) => setKomisiManager(parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Komisi SSO</label>
                <div className="px-3 py-2 text-sm border border-gray-200 bg-amber-50 rounded-md text-amber-800 font-medium flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-500" />
                  Fix {formatRupiah(KOMISI_SSO_FIX)} — Hanya diberikan jika leads dari SSO dan status Close Won
                </div>
              </div>
            </div>
          </div>

          {/* Preview Card */}
          {isFormValid && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Preview</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-green-700 text-white text-xs uppercase">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">Nama Layanan</th>
                      <th className="px-3 py-2 text-left font-medium">Kategori</th>
                      <th className="px-3 py-2 text-right font-medium">Harga Pokok</th>
                      <th className="px-3 py-2 text-right font-medium">K. Sales</th>
                      <th className="px-3 py-2 text-right font-medium">K. Leader</th>
                      <th className="px-3 py-2 text-right font-medium">K. Manager</th>
                      <th className="px-3 py-2 text-right font-medium">K. SSO</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="px-3 py-2.5 font-medium">{namaLayanan}</td>
                      <td className="px-3 py-2.5"><span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">{kategori}</span></td>
                      <td className="px-3 py-2.5 text-right font-medium">{formatRupiah(hargaPokok)}</td>
                      <td className="px-3 py-2.5 text-right text-green-700">{formatRupiah(komisiSales)}</td>
                      <td className="px-3 py-2.5 text-right text-blue-700">{formatRupiah(komisiLeader)}</td>
                      <td className="px-3 py-2.5 text-right text-purple-700">{formatRupiah(komisiManager)}</td>
                      <td className="px-3 py-2.5 text-right text-amber-700">{formatRupiah(KOMISI_SSO_FIX)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pb-4">
            <Link href="/layanan" className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              Batal
            </Link>
            <button
              type="submit"
              disabled={!isFormValid}
              className="flex items-center px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Simpan Layanan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
