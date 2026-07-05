"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  Upload, 
  Download, 
  MoreVertical,
  LayoutGrid,
  List,
  Edit2,
  ChevronDown,
  Columns,
  X,
  MessageCircle,
  FileSpreadsheet,
  Trash2
} from "lucide-react";
import Link from "next/link";
import Modal from "@/components/Modal";
import { fetchApi } from "@/lib/api";
import * as XLSX from "xlsx";

type LeadStatus = "NEW" | "CONTACTED" | "RESPONSE" | "QUOTATION" | "WON" | "LOST";
type QualificationStatus = "HOT" | "WARM" | "COLD" | "UNQUALIFIED";

interface Lead {
  id: string;
  status_leads: LeadStatus;
  kualifikasi: QualificationStatus;
  nama_perusahaan: string;
  wilayah: string;
  sales_id?: string;
  sso_id?: string;
  sales?: { name: string };
  sso?: { name: string };
  created_at: string;
  // mapped fields for UI
  no_telepon?: string;
  nama_pic?: string;
  jenis_perusahaan?: string;
  tingkat_kualifikasi?: string;
  sub_klasifikasi?: string;
  tanggal_expired?: string;
  alamat?: string;
  email?: string;
  legalitas?: { id: number, nama: string, keterangan: string, expired: string }[];
}

const KANBAN_COLUMNS: LeadStatus[] = ["NEW", "CONTACTED", "RESPONSE", "QUOTATION", "WON", "LOST"];

export default function LeadsPage() {
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Lead>>({});
  const [wilayahOptions, setWilayahOptions] = useState<{id: string, text: string}[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Any");
  const [ownerFilter, setOwnerFilter] = useState("Any");

  useEffect(() => {
    fetch('/wilayah.json')
      .then(res => res.json())
      .then(data => setWilayahOptions(data))
      .catch(e => console.error(e));
  }, []);

  const loadLeads = async () => {
    setIsLoading(true);
    try {
      const res = await fetchApi('/leads');
      setLeads(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleSaveLead = async () => {
    try {
      if (isCreateModalOpen) {
        await fetchApi('/leads', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
      } else {
        await fetchApi(`/leads/${formData.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
      }
      setIsCreateModalOpen(false);
      setIsEditModalOpen(false);
      loadLeads();
    } catch (error: any) {
      alert("Gagal menyimpan lead: " + (error.message || "Kesalahan API"));
    }
  };

  const [legalitasList, setLegalitasList] = useState([{ id: 1, nama: "", keterangan: "", expired: "" }]);
  const [activityLogs, setActivityLogs] = useState([{ id: 1, date: "2026-06-25", note: "Follow up via WA", user: "Budi Sales" }]);
  const [newLog, setNewLog] = useState("");

  const handleAddLegalitas = () => {
    setLegalitasList([...legalitasList, { id: Date.now(), nama: "", keterangan: "", expired: "" }]);
  };
  const handleRemoveLegalitas = (id: number) => {
    setLegalitasList(legalitasList.filter(l => l.id !== id));
  };

  const handleExport = () => {
    if (leads.length === 0) return alert("Tidak ada data untuk diekspor");
    const worksheet = XLSX.utils.json_to_sheet(leads.map(lead => ({
      ID: lead.id,
      Perusahaan: lead.nama_perusahaan || '',
      PIC: lead.nama_pic || '',
      Telepon: lead.no_telepon || '',
      Status: lead.status_leads,
      Wilayah: Array.isArray(lead.wilayah) ? lead.wilayah.join(', ') : (lead.wilayah || ''),
      Klasifikasi: lead.sub_klasifikasi || ''
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    XLSX.writeFile(workbook, `Export_Leads_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleDownloadTemplate = () => {
    const headers = [['nama_perusahaan', 'jenis_perusahaan', 'status_leads', 'nama_pic', 'no_telepon', 'email']];
    const worksheet = XLSX.utils.aoa_to_sheet(headers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "Template_Import_Leads.xlsx");
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = !searchQuery || 
                          lead.nama_perusahaan?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          lead.nama_pic?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "Any" || lead.status_leads === statusFilter;
    const matchesOwner = ownerFilter === "Any" || (ownerFilter === "Me" ? true : false);
    return matchesSearch && matchesStatus && matchesOwner;
  });

  return (
    <div className="flex flex-col h-full bg-white rounded-tl-[16px] overflow-hidden">
      {/* Page Header (HubSpot style) */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-800">Leads</h1>
          <div className="flex bg-gray-100 rounded-md p-1">
            <button 
              onClick={() => setViewMode("table")}
              className={`flex items-center justify-center p-1.5 rounded-sm transition-colors ${viewMode === 'table' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode("kanban")}
              className={`flex items-center justify-center p-1.5 rounded-sm transition-colors ${viewMode === 'kanban' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              title="Kanban View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            <Upload className="w-4 h-4 mr-2 text-gray-500" />
            Import CSV
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2 text-gray-500" />
            Export
          </button>
          <button 
            onClick={() => {
              setFormData({});
              setIsCreateModalOpen(true);
            }}
            className="flex items-center px-4 py-1.5 text-[13px] font-medium text-white bg-brand-700 rounded hover:bg-brand-800 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Lead
          </button>
        </div>
      </div>

      {/* Advanced Filter Toolbar (HubSpot style) */}
      {viewMode === "table" && (
        <div className="flex flex-wrap items-center justify-between px-6 py-2.5 bg-white border-b border-gray-200 shrink-0 gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search leads..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 text-[13px] border border-gray-300 rounded bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 w-56 transition-all"
              />
            </div>
            
            <div className="h-4 w-px bg-gray-300 mx-1"></div>

            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors focus:outline-none"
            >
              <option value="Any">Status: Any</option>
              {KANBAN_COLUMNS.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            
            <select 
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
              className="px-3 py-1 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors focus:outline-none"
            >
              <option value="Any">Owner: Any</option>
              <option value="Me">Owner: Me</option>
            </select>
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
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto bg-gray-50 flex flex-col">
        {viewMode === "table" ? (
          <div className="flex-1 overflow-x-auto bg-white border-t border-gray-200">
            <table className="w-full text-left text-[13px] text-gray-600 whitespace-nowrap">
              <thead className="bg-[#f5f8fa] border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-2 font-medium text-gray-600 w-10 text-center border-b border-gray-200">
                    <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                  </th>
                  <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Tanggal Leads</th>
                  <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Leads ID</th>
                  <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Status Leads</th>
                  <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Status</th>
                  <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Nama Perusahaan</th>
                  <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Kualifikasi</th>
                  <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Sub Klasifikasi</th>
                  <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Tgl Expired</th>
                  <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Wilayah</th>
                  <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">PIC & Kontak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 align-top">
                {isLoading ? (
                  <tr><td colSpan={11} className="p-8 text-center text-gray-500">Loading leads...</td></tr>
                ) : filteredLeads.map((lead) => (
                  <tr 
                    key={lead.id} 
                    className="hover:bg-brand-50/40 group transition-colors cursor-pointer"
                    onClick={(e) => {
                      if ((e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'A') {
                        setFormData(lead);
                        setLegalitasList(lead.legalitas || [{ id: Date.now(), nama: "", keterangan: "", expired: "" }]);
                        setIsDetailModalOpen(true);
                      }
                    }}
                  >
                    <td className="px-4 py-2.5 text-center align-middle">
                      <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500 opacity-50 group-hover:opacity-100" />
                    </td>
                    <td className="px-4 py-2.5 align-middle">{lead.created_at?.substring(0,10)}</td>
                    <td className="px-4 py-2.5 align-middle font-mono text-xs text-brand-600 font-medium">
                      <span className="hover:underline">{lead.id.substring(0,8)}</span>
                    </td>
                    <td className="px-4 py-2.5 align-middle">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        {lead.status_leads}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 align-middle">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium border
                        ${lead.kualifikasi === 'HOT' ? 'bg-red-50 text-red-700 border-red-200' : 
                          lead.kualifikasi === 'WARM' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                          'bg-gray-50 text-gray-600 border-gray-200'}`}>
                        {lead.kualifikasi}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 align-middle">
                      <div className="font-medium text-gray-900">{lead.nama_perusahaan}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{lead.jenis_perusahaan}</div>
                    </td>
                    <td className="px-4 py-2.5 align-middle">{lead.tingkat_kualifikasi || "-"}</td>
                    <td className="px-4 py-2.5 align-middle">{lead.sub_klasifikasi || "-"}</td>
                    <td className="px-4 py-2.5 align-middle">{lead.tanggal_expired || "-"}</td>
                    <td className="px-4 py-2.5 align-middle text-gray-700 max-w-[150px] truncate" title={Array.isArray(lead.wilayah) ? lead.wilayah.join(', ') : lead.wilayah}>{Array.isArray(lead.wilayah) ? lead.wilayah.join(', ') : lead.wilayah}</td>
                    <td className="px-4 py-2.5 align-middle">
                      <div className="text-gray-900 font-medium">{lead.nama_pic || "-"}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{lead.no_telepon}</div>
                      <div className="text-[11px] text-gray-500">{lead.email}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* KANBAN VIEW */
          <div className="flex gap-4 h-full overflow-x-auto pb-6 items-start snap-x snap-mandatory scroll-smooth px-2 md:px-0 custom-scrollbar">
            {KANBAN_COLUMNS.map((colStatus) => {
              const colLeads = filteredLeads.filter(l => l.status_leads === colStatus);
              return (
                <div key={colStatus} className="w-[85vw] sm:w-72 shrink-0 flex flex-col bg-[#F3F4F6] border border-gray-200 rounded-xl snap-center shadow-sm">
                  {/* Column Header */}
                  <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                    <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wider">{colStatus}</h3>
                    <span className="bg-gray-200 text-gray-600 text-xs py-0.5 px-2 rounded-full font-medium">
                      {colLeads.length}
                    </span>
                  </div>
                  
                  {/* Column Body / Cards */}
                  <div className="p-3 flex flex-col gap-3 min-h-[150px]">
                    {colLeads.map(lead => (
                      <div 
                        key={lead.id} 
                        className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-brand-300 transition-all duration-200 cursor-pointer"
                        onClick={() => {
                          setFormData(lead);
                          setLegalitasList(lead.legalitas || [{ id: Date.now(), nama: "", keterangan: "", expired: "" }]);
                          setIsDetailModalOpen(true);
                        }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-brand-700 text-sm leading-tight">
                            {lead.nama_perusahaan}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider
                            ${lead.kualifikasi === 'HOT' ? 'bg-red-100 text-red-700' : 
                              lead.kualifikasi === 'WARM' ? 'bg-orange-100 text-orange-700' : 
                              lead.kualifikasi === 'COLD' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                            {lead.kualifikasi || "NEW"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center text-[8px] text-white font-bold">
                              {(lead.sales?.name || "U").charAt(0)}
                            </div>
                            <span>{lead.sales?.name || "-"}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DETAIL LEADS SLIDE-OVER -> MODAL */}
      <Modal 
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
        }}
        title="Detail Leads"
        maxWidth="max-w-5xl"
        footer={
          <div className="flex gap-2 justify-end w-full">
            <button 
              onClick={() => {
                setIsDetailModalOpen(false);
              }}
              className="px-4 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors shadow-sm"
            >
              Tutup Detail
            </button>
            <button 
              onClick={() => {
                setLeads(leads.map(l => l.id === formData.id ? { ...l, legalitas: legalitasList } : l));
                alert("Perubahan legalitas berhasil disimpan!");
              }}
              className="px-4 py-2 text-[13px] font-medium text-white bg-brand-700 border border-transparent rounded hover:bg-brand-800 transition-colors shadow-sm"
            >
              Simpan Perubahan
            </button>
          </div>
        }
      >
        {formData && (
          <div className="bg-gray-50/50 p-2">
                {/* Header Section */}
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm mb-6 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-xs text-brand-600 font-mono font-medium">{formData.id?.substring(0,8)}</div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        {formData.status_leads}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{formData.nama_perusahaan}</h3>
                    <div className="text-sm text-gray-500 mt-1">{formData.jenis_perusahaan}</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => {
                        setIsDetailModalOpen(false);
                        setIsEditModalOpen(true);
                      }}
                      className="flex items-center justify-center px-4 py-2 bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200 rounded-md text-[13px] font-medium transition-colors w-full"
                    >
                      <Edit2 className="w-4 h-4 mr-2" /> Edit Leads
                    </button>
                    <a 
                      href={`https://wa.me/${formData.no_telepon?.replace(/^0/, '62')}?text=${encodeURIComponent(`🔔 [PENGINGAT MASA BERLAKU SBU]\n\nYth. Pimpinan di ${formData.nama_perusahaan || 'Perusahaan'}, Saya ${formData.sales?.name || 'Rian'} dari PT. Esdea Assistance Management, Mohon izin menginformasikan status SBU Anda di sistem LPJK:\n\n📄 SBU: ${formData.sub_klasifikasi || '-'}\n📅 Expired: ${formData.tanggal_expired || '-'} (15 Hari Lagi)\n\nTim PT. ESDEA Assistance Management siap men-support proses perpanjangan segera agar administrasi proyek dan portal OSS tidak terhambat.\n\nApakah saya boleh bantu siapkan estimasi biaya & estimasi waktu pengerjaannya?`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center px-4 py-2 bg-[#25D366] text-white hover:bg-[#20b958] rounded-md text-[13px] font-medium transition-colors w-full shadow-sm"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" /> Hubungi via WA
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  {/* Left Column (Info) */}
                  <div className="col-span-2 space-y-6">
                    {/* Legalitas Table */}
                    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                        <h4 className="text-sm font-semibold text-gray-800">Detail Legalitas Perusahaan</h4>
                        <button onClick={handleAddLegalitas} className="text-[12px] font-medium text-brand-600 hover:text-brand-800">
                          + Tambah Baris
                        </button>
                      </div>
                      <table className="w-full text-left text-[13px] text-gray-600">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="pb-2 font-medium w-1/3">Nama Legalitas</th>
                            <th className="pb-2 font-medium w-1/3">Keterangan</th>
                            <th className="pb-2 font-medium">Tgl Expired</th>
                            <th className="pb-2 font-medium w-8"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {legalitasList.map((leg, i) => (
                            <tr key={leg.id}>
                              <td className="py-2 pr-2">
                                <input type="text" value={leg.nama} onChange={(e) => setLegalitasList(legalitasList.map(l => l.id === leg.id ? { ...l, nama: e.target.value } : l))} className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:border-brand-500" placeholder="Misal: NIB" />
                              </td>
                              <td className="py-2 pr-2">
                                <input type="text" value={leg.keterangan} onChange={(e) => setLegalitasList(legalitasList.map(l => l.id === leg.id ? { ...l, keterangan: e.target.value } : l))} className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:border-brand-500" placeholder="..." />
                              </td>
                              <td className="py-2 pr-2">
                                <input type="date" value={leg.expired} onChange={(e) => setLegalitasList(legalitasList.map(l => l.id === leg.id ? { ...l, expired: e.target.value } : l))} className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:border-brand-500" />
                              </td>
                              <td className="py-2">
                                <button onClick={() => handleRemoveLegalitas(leg.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded bg-gray-50 hover:bg-red-50">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Aligned Details */}
                    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                      <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">Informasi Utama</h4>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Nama Perusahaan</div>
                          <div className="font-medium text-gray-900 text-[13px]">{formData.nama_perusahaan || "-"}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Jenis Perusahaan</div>
                          <div className="font-medium text-gray-900 text-[13px]">{formData.jenis_perusahaan || "-"}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Status Leads (Pipeline)</div>
                          <div className="font-medium text-gray-900 text-[13px]">{formData.status_leads || "-"}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Status (QLF)</div>
                          <div className="font-medium text-gray-900 text-[13px]">{formData.kualifikasi || "-"}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Kualifikasi (K,M,B)</div>
                          <div className="font-medium text-gray-900 text-[13px]">{formData.tingkat_kualifikasi || "-"}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Sub Klasifikasi</div>
                          <div className="font-medium text-gray-900 text-[13px]">{formData.sub_klasifikasi || "-"}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Tanggal Expired Legalitas</div>
                          <div className="font-medium text-gray-900 text-[13px]">{formData.tanggal_expired || "-"}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Wilayah</div>
                          <div className="font-medium text-gray-900 text-[13px]">{Array.isArray(formData.wilayah) ? formData.wilayah.join(', ') : formData.wilayah || "-"}</div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-xs text-gray-500 mb-1">Alamat Lengkap</div>
                          <div className="font-medium text-gray-900 text-[13px]">{formData.alamat || "-"}</div>
                        </div>
                      </div>

                      <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">Informasi Kontak & Lokasi</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Nama PIC</div>
                          <div className="font-medium text-gray-900 text-[13px]">{formData.nama_pic || "-"}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Nomor Telepon</div>
                          <div className="font-medium text-gray-900 text-[13px]">{formData.no_telepon || "-"}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Email</div>
                          <div className="font-medium text-gray-900 text-[13px]">{formData.email || "-"}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (Activity Log) */}
                  <div className="col-span-1">
                    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm h-full flex flex-col">
                      <h4 className="text-sm font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">Log Activity (Notes)</h4>
                      
                      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                        {activityLogs.map(log => (
                          <div key={log.id} className="relative pl-4 border-l-2 border-brand-200">
                            <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-brand-500 border-2 border-white"></div>
                            <div className="text-[11px] text-gray-500 mb-0.5">{log.date} - {log.user}</div>
                            <div className="text-xs text-gray-800 bg-gray-50 p-2 rounded-r-md rounded-bl-md border border-gray-100">
                              {log.note}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-auto">
                        <textarea 
                          className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:ring-brand-500 focus:border-brand-500 min-h-[80px] resize-none mb-2" 
                          placeholder="Tambahkan keterangan/notes..."
                          value={newLog}
                          onChange={e => setNewLog(e.target.value)}
                        />
                        <button 
                          className="w-full py-2 bg-gray-900 text-white rounded text-xs font-medium hover:bg-gray-800 transition-colors"
                          onClick={() => {
                            if (newLog) {
                              setActivityLogs([...activityLogs, { id: Date.now(), date: new Date().toISOString().split('T')[0], note: newLog, user: "You" }]);
                              setNewLog("");
                            }
                          }}
                        >
                          Simpan Notes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
          </div>
        )}
      </Modal>
      {/* MODAL EDIT LEADS & CREATE LEADS */}
      <Modal 
        isOpen={isEditModalOpen || isCreateModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setIsCreateModalOpen(false);
        }}
        title={isCreateModalOpen ? "Create Lead" : "Edit Lead"}
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
              onClick={handleSaveLead}
              className="px-4 py-2 text-[13px] font-medium text-white bg-brand-700 rounded hover:bg-brand-800"
            >
              Simpan
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">Informasi Utama</h4>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nama Perusahaan</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" value={formData.nama_perusahaan || ''} onChange={e => setFormData({...formData, nama_perusahaan: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Jenis Perusahaan</label>
            <input type="text" list="jenis-perusahaan-list" className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" value={formData.jenis_perusahaan || ''} onChange={e => setFormData({...formData, jenis_perusahaan: e.target.value})} placeholder="Pilih atau ketik sendiri..." />
            <datalist id="jenis-perusahaan-list">
              <option value="Konstruksi" />
              <option value="Migas" />
              <option value="Pertambangan" />
              <option value="Perdagangan" />
              <option value="Jasa" />
            </datalist>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Wilayah</label>
            <input type="text" list="wilayah-list" className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" value={Array.isArray(formData.wilayah) ? formData.wilayah[0] : (formData.wilayah || '')} onChange={e => setFormData({...formData, wilayah: e.target.value})} placeholder="Pilih wilayah..." />
            <datalist id="wilayah-list">
              {wilayahOptions.map(w => (
                <option key={w.id} value={w.text} />
              ))}
            </datalist>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Alamat Lengkap</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" value={formData.alamat || ''} onChange={e => setFormData({...formData, alamat: e.target.value})} />
          </div>
          
          {!isCreateModalOpen && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status Leads (Pipeline)</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" value={formData.status_leads || 'NEW'} onChange={e => setFormData({...formData, status_leads: e.target.value as any})}>
                  {KANBAN_COLUMNS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status (QLF)</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" value={formData.kualifikasi || 'UNQUALIFIED'} onChange={e => setFormData({...formData, kualifikasi: e.target.value as any})}>
                  <option value="HOT">Hot</option>
                  <option value="WARM">Warm</option>
                  <option value="COLD">Cold</option>
                  <option value="UNQUALIFIED">Unqualified</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Kualifikasi (K,M,B)</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" value={formData.tingkat_kualifikasi || ''} onChange={e => setFormData({...formData, tingkat_kualifikasi: e.target.value})} placeholder="Misal: K/M/B" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Sub Klasifikasi</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" value={formData.sub_klasifikasi || ''} onChange={e => setFormData({...formData, sub_klasifikasi: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Tanggal Expired Legalitas</label>
            <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" value={formData.tanggal_expired || ''} onChange={e => setFormData({...formData, tanggal_expired: e.target.value})} />
          </div>
          
          <div className="md:col-span-2 mt-2">
            <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">Informasi Kontak PIC</h4>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nama PIC</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" value={formData.nama_pic || ''} onChange={e => setFormData({...formData, nama_pic: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nomor Telepon</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" value={formData.no_telepon || ''} onChange={e => setFormData({...formData, no_telepon: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
            <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
        </div>
      </Modal>

      {/* MODAL IMPORT */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Leads dari CSV/Excel"
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
                alert("Data leads berhasil diimport.");
                setIsImportModalOpen(false);
                loadLeads();
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
            Pastikan kolom pada file CSV/Excel Anda mencakup format standar (Nama Perusahaan, PIC, Nomor Telepon, Status).
          </p>
          <button onClick={handleDownloadTemplate} className="flex items-center text-brand-600 font-medium hover:underline text-[13px]">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Download Template Import Leads
          </button>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-8 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <div className="font-medium text-gray-900 mb-1">Pilih File CSV atau Excel</div>
            <div className="text-xs text-gray-500">Max. ukuran file: 10MB</div>
          </div>
        </div>
      </Modal>

    </div>
  );
}
