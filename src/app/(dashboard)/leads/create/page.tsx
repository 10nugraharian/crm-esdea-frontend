"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Save, Search } from "lucide-react";
import Link from "next/link";

interface WilayahItem {
  id: string;
  text: string;
}

const JENIS_PERUSAHAAN = [
  "Konstruksi",
  "Migas",
  "Pertambangan",
  "Perdagangan",
  "Jasa",
  "Lainnya",
];

const KUALIFIKASI_OPTIONS = ["Kecil", "Menengah", "Besar"];

export default function CreateLeadPage() {
  // ---- Wilayah data ----
  const [wilayahData, setWilayahData] = useState<WilayahItem[]>([]);
  const [wilayahLoaded, setWilayahLoaded] = useState(false);

  useEffect(() => {
    fetch("/wilayah.json")
      .then((res) => res.json())
      .then((data: WilayahItem[]) => {
        setWilayahData(data);
        setWilayahLoaded(true);
      })
      .catch(() => setWilayahLoaded(true));
  }, []);

  // ---- Form state ----
  const [namaPerusahaan, setNamaPerusahaan] = useState("");
  const [jenisPerusahaan, setJenisPerusahaan] = useState("");
  const [selectedProvinsi, setSelectedProvinsi] = useState("");
  const [selectedKota, setSelectedKota] = useState("");
  const [wilayahSearch, setWilayahSearch] = useState("");
  const [showWilayahDropdown, setShowWilayahDropdown] = useState(false);
  const [alamat, setAlamat] = useState("");
  const [noTelepon, setNoTelepon] = useState("");
  const [email, setEmail] = useState("");
  const [namaPic, setNamaPic] = useState("");
  const [kualifikasi, setKualifikasi] = useState("");
  const [subklasifikasi, setSubklasifikasi] = useState("");
  const [tanggalExpired, setTanggalExpired] = useState("");

  // ---- Derived wilayah data ----
  const provinsiList = useMemo(() => {
    const provs = new Set(wilayahData.map((w) => w.id.split(" - ")[0]));
    return Array.from(provs).sort();
  }, [wilayahData]);

  const kotaList = useMemo(() => {
    if (!selectedProvinsi) return [];
    return wilayahData
      .filter((w) => w.id.startsWith(selectedProvinsi + " - "))
      .map((w) => w.id.split(" - ")[1])
      .sort();
  }, [wilayahData, selectedProvinsi]);

  // Filtered wilayah for search dropdown
  const filteredWilayah = useMemo(() => {
    if (!wilayahSearch.trim()) return wilayahData.slice(0, 50);
    const q = wilayahSearch.toLowerCase();
    return wilayahData.filter((w) => w.text.toLowerCase().includes(q)).slice(0, 50);
  }, [wilayahData, wilayahSearch]);

  const wilayahDisplay = selectedProvinsi && selectedKota
    ? `${selectedProvinsi} - ${selectedKota}`
    : "";

  // ---- Handlers ----
  const handleSelectWilayah = (item: WilayahItem) => {
    const parts = item.id.split(" - ");
    setSelectedProvinsi(parts[0]);
    setSelectedKota(parts[1]);
    setWilayahSearch("");
    setShowWilayahDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would POST to API
    alert(`Lead berhasil disimpan!\n\nPerusahaan: ${namaPerusahaan}\nWilayah: ${wilayahDisplay}`);
  };

  const isFormValid =
    namaPerusahaan.trim() !== "" &&
    jenisPerusahaan !== "" &&
    selectedProvinsi !== "" &&
    selectedKota !== "" &&
    noTelepon.trim() !== "" &&
    namaPic.trim() !== "";

  return (
    <div className="flex flex-col h-full bg-white rounded-tl-[16px] overflow-hidden">
      {/* Page Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/leads"
            className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-semibold text-gray-800">Tambah Lead Baru</h1>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-auto bg-gray-50 p-6">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
          {/* Informasi Perusahaan */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-5">
              Informasi Perusahaan
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Nama Perusahaan */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Nama Perusahaan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={namaPerusahaan}
                  onChange={(e) => setNamaPerusahaan(e.target.value)}
                  placeholder="Contoh: PT. Maju Sejahtera"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Jenis Perusahaan */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Jenis Perusahaan <span className="text-red-500">*</span>
                </label>
                <select
                  value={jenisPerusahaan}
                  onChange={(e) => setJenisPerusahaan(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Pilih Jenis --</option>
                  {JENIS_PERUSAHAAN.map((j) => (
                    <option key={j} value={j}>
                      {j}
                    </option>
                  ))}
                </select>
              </div>

              {/* Wilayah - Searchable */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Wilayah (Provinsi - Kota/Kab) <span className="text-red-500">*</span>
                </label>
                {wilayahDisplay && !showWilayahDropdown ? (
                  <div
                    onClick={() => setShowWilayahDropdown(true)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white cursor-pointer hover:border-blue-400 flex items-center justify-between"
                  >
                    <span>{wilayahDisplay}</span>
                    <span className="text-gray-400 text-xs">Ganti</span>
                  </div>
                ) : (
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={wilayahSearch}
                      onChange={(e) => {
                        setWilayahSearch(e.target.value);
                        setShowWilayahDropdown(true);
                      }}
                      onFocus={() => setShowWilayahDropdown(true)}
                      placeholder={wilayahLoaded ? "Ketik provinsi atau kota..." : "Memuat data wilayah..."}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
                {showWilayahDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowWilayahDropdown(false)} />
                    <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredWilayah.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500">Tidak ditemukan</div>
                      ) : (
                        filteredWilayah.map((w) => (
                          <button
                            key={w.id}
                            type="button"
                            onClick={() => handleSelectWilayah(w)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-gray-50 last:border-b-0"
                          >
                            {w.text}
                          </button>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Alamat */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Alamat</label>
                <textarea
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  rows={2}
                  placeholder="Jl. Contoh No. 123, Kelurahan, Kecamatan"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Kontak PIC */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-5">
              Kontak PIC
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Nama PIC */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Nama PIC <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={namaPic}
                  onChange={(e) => setNamaPic(e.target.value)}
                  placeholder="Nama lengkap"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* No Telepon */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  No Telepon <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={noTelepon}
                  onChange={(e) => setNoTelepon(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@perusahaan.co.id"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Klasifikasi & Expired */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-5">
              Klasifikasi & Masa Berlaku
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Kualifikasi */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Kualifikasi</label>
                <select
                  value={kualifikasi}
                  onChange={(e) => setKualifikasi(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Pilih Kualifikasi --</option>
                  {KUALIFIKASI_OPTIONS.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subklasifikasi */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Subklasifikasi</label>
                <input
                  type="text"
                  value={subklasifikasi}
                  onChange={(e) => setSubklasifikasi(e.target.value)}
                  placeholder="Masukkan subklasifikasi"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Tanggal Expired */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Tanggal Expired</label>
                <input
                  type="date"
                  value={tanggalExpired}
                  onChange={(e) => setTanggalExpired(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pb-4">
            <Link
              href="/leads"
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={!isFormValid}
              className="flex items-center px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Simpan Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
