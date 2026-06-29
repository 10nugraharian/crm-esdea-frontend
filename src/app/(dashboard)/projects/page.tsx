"use client";

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  Edit2,
  FileText,
  UserPlus,
  CheckCircle2,
  Clock,
  UploadCloud,
  Settings,
  ChevronDown,
  Columns,
  Plus,
  X
} from "lucide-react";
import Link from "next/link";
import Modal from "@/components/Modal";

type StatusSpk = "Draft" | "Pengumpulan Dokumen" | "On Process" | "Selesai";
type StatusPembayaranVendor = "Unpaid" | "Partial" | "Paid";

interface ProjectItem {
  id: string;
  namaLayanan: string;
  qty: number;
  vendor: string | null;
  tanggalSpk: string | null;
  noSpk: string | null;
  statusSpk: StatusSpk;
  pembayaranVendor: StatusPembayaranVendor;
}

interface Project {
  id: string;
  no: number;
  noInvoice: string;
  namaPerusahaan: string;
  items: ProjectItem[];
}

const initialProjects: Project[] = [
  { 
    id: "PRJ-001", no: 1, noInvoice: "001/INV-DP/ESDEA/VI/2026",
    namaPerusahaan: "PT. Tambang Alpha", 
    items: [
      {
        id: "ITM-001",
        namaLayanan: "Pengurusan SBU Jasa Konstruksi",
        qty: 1,
        vendor: "PT. Mitra Sertifikasi Utama",
        tanggalSpk: "2026-06-29",
        noSpk: "SPK-001/ESDEA/VI/2026",
        statusSpk: "On Process",
        pembayaranVendor: "Partial"
      },
      {
        id: "ITM-002",
        namaLayanan: "Pendaftaran BPJS Ketenagakerjaan",
        qty: 1,
        vendor: "Biro Jasa Mandiri",
        tanggalSpk: "2026-06-30",
        noSpk: "SPK-002/ESDEA/VI/2026",
        statusSpk: "Pengumpulan Dokumen",
        pembayaranVendor: "Unpaid"
      }
    ]
  },
  { 
    id: "PRJ-002", no: 2, noInvoice: "002/INV-DP/ESDEA/VI/2026",
    namaPerusahaan: "PT. Migas Beta", 
    items: [
      {
        id: "ITM-003",
        namaLayanan: "ISO 9001 & 14001",
        qty: 1,
        vendor: null,
        tanggalSpk: null,
        noSpk: null,
        statusSpk: "Draft",
        pembayaranVendor: "Unpaid"
      }
    ]
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const filteredProjects = projects.filter(p => 
    p.namaPerusahaan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.noInvoice.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.items.some(item => 
      item.namaLayanan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.vendor && item.vendor.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  return (
    <div className="flex flex-col h-full bg-white rounded-tl-[16px] overflow-hidden">
      {/* Page Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Projects & SPK (Operations)</h1>
          <p className="text-sm text-gray-500 mt-1">Delegasi layanan ke Vendor, pantau status pengerjaan, dan cetak Surat Perintah Kerja (SPK).</p>
        </div>
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
              placeholder="Search projects or vendors..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 text-[13px] border border-gray-300 rounded bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 w-64 transition-all"
            />
          </div>
          
          <div className="h-4 w-px bg-gray-300 mx-1"></div>

          <button className="flex items-center px-3 py-1 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
            Status SPK: Any <ChevronDown className="w-3.5 h-3.5 ml-1 text-gray-400" />
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
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200 w-10 text-center">No</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200 min-w-[200px]">Project (Perusahaan)</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200 min-w-[200px]">Layanan</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200 min-w-[150px]">Vendor</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Tanggal SPK</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">No SPK</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200 text-center">Status SPK</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200 text-center">Pembayaran Vendor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 align-top">
              {filteredProjects.map((p, pIdx) => (
                <React.Fragment key={p.id}>
                  {p.items.map((item, iIdx) => (
                    <tr 
                      key={item.id} 
                      className="hover:bg-brand-50/40 transition-colors group cursor-pointer"
                      onClick={(e) => {
                        if ((e.target as HTMLElement).tagName !== 'BUTTON' && (e.target as HTMLElement).tagName !== 'A') {
                          setSelectedProject(p);
                          setIsDetailModalOpen(true);
                        }
                      }}
                    >
                      
                      {/* Hanya render kolom Project di baris pertama item (Rowspan) */}
                      {iIdx === 0 && (
                        <td className="px-4 py-2.5 border-r border-gray-100 align-middle text-center" rowSpan={p.items.length}>
                          {p.no}
                        </td>
                      )}
                      
                      {iIdx === 0 && (
                        <td className="px-4 py-2.5 border-r border-gray-100 align-middle" rowSpan={p.items.length}>
                          <div className="font-medium text-gray-900">{p.namaPerusahaan}</div>
                          <div className="font-mono text-xs text-brand-600 mt-0.5">{p.noInvoice}</div>
                        </td>
                      )}

                      <td className="px-4 py-2.5 align-middle">
                        <div className="font-medium text-gray-800 truncate max-w-[200px]" title={item.namaLayanan}>
                          {item.namaLayanan} <span className="text-xs text-gray-400 font-normal">({item.qty}x)</span>
                        </div>
                      </td>

                      <td className="px-4 py-2.5 align-middle">
                        {item.vendor ? (
                          <span className="text-[11px] font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
                            {item.vendor}
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Belum di-assign
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-2.5 align-middle">{item.tanggalSpk || "-"}</td>
                      <td className="px-4 py-2.5 align-middle font-mono text-xs text-brand-600">
                        {item.noSpk ? <span className="hover:underline cursor-pointer">{item.noSpk}</span> : "-"}
                      </td>
                      
                      <td className="px-4 py-2.5 align-middle text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border
                          ${item.statusSpk === "Selesai" ? "bg-green-50 text-green-700 border-green-200" : 
                            item.statusSpk === "On Process" ? "bg-blue-50 text-blue-700 border-blue-200" : 
                            item.statusSpk === "Pengumpulan Dokumen" ? "bg-purple-50 text-purple-700 border-purple-200" : 
                            "bg-gray-100 text-gray-600 border-gray-200"}`}
                        >
                          {item.statusSpk}
                        </span>
                      </td>

                      <td className="px-4 py-2.5 align-middle text-center">
                        {item.vendor ? (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border
                            ${item.pembayaranVendor === "Paid" ? "bg-green-50 text-green-700 border-green-200" : 
                              item.pembayaranVendor === "Partial" ? "bg-amber-50 text-amber-700 border-amber-200" : 
                              "bg-red-50 text-red-700 border-red-200"}`}
                          >
                            {item.pembayaranVendor === "Paid" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                            {item.pembayaranVendor === "Partial" && <Clock className="w-3 h-3 mr-1" />}
                            {item.pembayaranVendor}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs italic">-</span>
                        )}
                      </td>

                    </tr>
                  ))}
                </React.Fragment>
              ))}
              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    Tidak ada project yang ditemukan.
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
        title={selectedProject ? `Assign Vendor & SPK - ${selectedProject.namaPerusahaan}` : "Assign Vendor & SPK"}
        maxWidth="max-w-5xl"
        footer={
          <>
            <button 
              onClick={() => setIsDetailModalOpen(false)}
              className="px-4 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors shadow-sm"
            >
              Tutup Detail
            </button>
            <button 
              onClick={() => {
                if (selectedProject) {
                  setProjects(projects.map(p => p.id === selectedProject.id ? selectedProject : p));
                }
                alert('Data vendor dan SPK berhasil di-update');
                setIsDetailModalOpen(false);
              }}
              className="px-4 py-2 text-[13px] font-medium text-white bg-brand-700 rounded hover:bg-brand-800 transition-colors shadow-sm"
            >
              Simpan Perubahan
            </button>
          </>
        }
      >
        {selectedProject && (
          <div className="p-2">
              <div className="bg-blue-50 border border-blue-100 p-3 rounded-md mb-6 flex items-start gap-2 text-blue-800 text-xs">
                <span className="text-[14px]">ℹ️</span>
                <span>Isi kolom Vendor pada layanan terkait. Nomor SPK dan Tanggal SPK dapat di-generate secara otomatis.</span>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-[12px] text-gray-700">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-3 py-2 font-medium">Layanan</th>
                      <th className="px-3 py-2 font-medium w-48">Vendor</th>
                      <th className="px-3 py-2 font-medium w-32">Tgl SPK</th>
                      <th className="px-3 py-2 font-medium w-40">No SPK</th>
                      <th className="px-3 py-2 font-medium w-28 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedProject.items.map((item, idx) => (
                      <tr key={item.id} className="bg-white">
                        <td className="px-3 py-3 align-top">
                          <div className="font-medium text-gray-900">{item.namaLayanan}</div>
                          <div className="text-gray-500 mt-0.5">Qty: {item.qty}</div>
                        </td>
                        <td className="px-3 py-3 align-top">
                          <input 
                            type="text" 
                            value={item.vendor || ""} 
                            onChange={(e) => {
                              const newItems = [...selectedProject.items];
                              newItems[idx].vendor = e.target.value;
                              
                              // Auto-generate SPK if vendor is filled and SPK is empty
                              if (e.target.value && !newItems[idx].tanggalSpk) {
                                newItems[idx].tanggalSpk = new Date().toISOString().split('T')[0];
                                newItems[idx].noSpk = `SPK-${Math.floor(Math.random()*1000)}/ESDEA/VI/2026`;
                                newItems[idx].statusSpk = "On Process";
                              }
                              
                              setSelectedProject({...selectedProject, items: newItems});
                            }}
                            placeholder="Nama Vendor..."
                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-[11px] focus:ring-1 focus:ring-brand-500" 
                          />
                        </td>
                        <td className="px-3 py-3 align-top">
                          <div className="flex flex-col gap-1">
                            <input 
                              type="date" 
                              value={item.tanggalSpk || ""}
                              onChange={(e) => {
                                const newItems = [...selectedProject.items];
                                newItems[idx].tanggalSpk = e.target.value;
                                setSelectedProject({...selectedProject, items: newItems});
                              }}
                              className="w-full px-2 py-1.5 border border-gray-300 rounded text-[11px] focus:ring-1 focus:ring-brand-500" 
                            />
                            {!item.tanggalSpk && (
                              <button 
                                onClick={() => {
                                  const newItems = [...selectedProject.items];
                                  newItems[idx].tanggalSpk = new Date().toISOString().split('T')[0];
                                  newItems[idx].noSpk = `SPK-${Math.floor(Math.random()*1000)}/ESDEA/VI/2026`;
                                  setSelectedProject({...selectedProject, items: newItems});
                                }}
                                className="text-[10px] text-brand-600 hover:underline text-left"
                              >
                                Auto-generate
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3 align-top">
                          <input 
                            type="text" 
                            value={item.noSpk || ""}
                            onChange={(e) => {
                              const newItems = [...selectedProject.items];
                              newItems[idx].noSpk = e.target.value;
                              setSelectedProject({...selectedProject, items: newItems});
                            }}
                            placeholder="No SPK..."
                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-[11px] focus:ring-1 focus:ring-brand-500" 
                          />
                        </td>
                        <td className="px-3 py-3 align-top">
                          <select 
                            value={item.statusSpk || "Draft"}
                            onChange={(e) => {
                              const newItems = [...selectedProject.items];
                              newItems[idx].statusSpk = e.target.value as StatusSpk;
                              setSelectedProject({...selectedProject, items: newItems});
                            }}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-[11px] focus:ring-1 focus:ring-brand-500"
                          >
                            <option value="Draft">Draft</option>
                            <option value="Pengumpulan Dokumen">Pengumpulan Dok</option>
                            <option value="On Process">On Process</option>
                            <option value="Selesai">Selesai</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </div>
        )}
      </Modal>


    </div>
  );
}
