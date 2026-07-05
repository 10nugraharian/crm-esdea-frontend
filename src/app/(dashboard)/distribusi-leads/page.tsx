"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Users, 
  ChevronDown, 
  Columns, 
  Upload, 
  Download,
  AlertCircle,
  Undo2,
  Bell,
  FileSpreadsheet,
  Plus
} from "lucide-react";
import Modal from "@/components/Modal";
import { fetchApi } from "@/lib/api";
import * as XLSX from "xlsx";

const KANBAN_COLUMNS = ["NEW", "CONTACTED", "RESPONSE", "QUOTATION", "WON", "LOST"];

export default function DistribusiLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [salesList, setSalesList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Any");
  const [idleFilter, setIdleFilter] = useState("Any");
  const [dateFilter, setDateFilter] = useState("Any");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedSales, setSelectedSales] = useState("");
  const [importFile, setImportFile] = useState<File | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [resLeads, resUsers] = await Promise.all([
        fetchApi('/leads'),
        fetchApi('/tim-users')
      ]);
      setLeads(resLeads.data || []);
      setSalesList((resUsers.data || []).filter((u: any) => u.role === 'SALES'));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = !searchQuery || 
                          lead.nama_perusahaan?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          lead.id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "Any" || lead.status_leads === statusFilter;
    
    let isIdle = false;
    if (lead.updated_at) {
      const diffTime = Math.abs(Date.now() - new Date(lead.updated_at).getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      isIdle = diffDays > 30;
    }
    const matchesIdle = idleFilter === "Any" || (idleFilter === "Idle" ? isIdle : !isIdle);

    let matchesDate = true;
    if (dateFilter !== "Any" && lead.created_at) {
      const leadDate = new Date(lead.created_at);
      const today = new Date();
      
      if (dateFilter === "Hari Ini") {
        matchesDate = leadDate.toDateString() === today.toDateString();
      } else if (dateFilter === "Minggu Ini") {
        const firstDay = new Date(today);
        firstDay.setDate(today.getDate() - today.getDay());
        const lastDay = new Date(today);
        lastDay.setDate(today.getDate() - today.getDay() + 6);
        matchesDate = leadDate >= firstDay && leadDate <= lastDay;
      } else if (dateFilter === "Bulan Ini") {
        matchesDate = leadDate.getMonth() === today.getMonth() && leadDate.getFullYear() === today.getFullYear();
      } else if (dateFilter === "Custom") {
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (leadDate < start) matchesDate = false;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (leadDate > end) matchesDate = false;
        }
      }
    }

    return matchesSearch && matchesStatus && matchesIdle && matchesDate;
  });

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedLeads(filteredLeads.map(l => l.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const toggleSelectLead = (id: string) => {
    if (selectedLeads.includes(id)) {
      setSelectedLeads(selectedLeads.filter(leadId => leadId !== id));
    } else {
      setSelectedLeads([...selectedLeads, id]);
    }
  };

  const handleAssign = async () => {
    if (!selectedSales) {
      alert("Pilih sales terlebih dahulu.");
      return;
    }
    setIsActionLoading(true);
    try {
      await fetchApi('/leads/bulk-assign', {
        method: 'POST',
        body: JSON.stringify({ lead_ids: selectedLeads, sales_id: selectedSales })
      });
      alert(`Berhasil assign ${selectedLeads.length} leads ke ${salesList.find(s => s.id === selectedSales)?.name}`);
      setSelectedLeads([]);
      setIsAssignModalOpen(false);
      loadData();
    } catch (e: any) {
      alert("Gagal assign: " + e.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleTarikData = async () => {
    if (!confirm(`Tarik data (unassign) ${selectedLeads.length} leads terpilih?`)) return;
    setIsActionLoading(true);
    try {
      await fetchApi('/leads/bulk-unassign', {
        method: 'POST',
        body: JSON.stringify({ lead_ids: selectedLeads })
      });
      alert(`Berhasil menarik ${selectedLeads.length} leads.`);
      setSelectedLeads([]);
      loadData();
    } catch (e: any) {
      alert("Gagal menarik data: " + e.message);
    } finally {
      setIsActionLoading(false);
    }
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
    XLSX.writeFile(workbook, `Export_Distribusi_Leads_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleDownloadTemplate = () => {
    const headers = [['nama_perusahaan', 'jenis_perusahaan', 'wilayah', 'alamat', 'status_leads', 'kualifikasi', 'tingkat_kualifikasi', 'sub_klasifikasi', 'tanggal_expired', 'nama_pic', 'no_telepon', 'email']];
    const worksheet = XLSX.utils.aoa_to_sheet(headers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "Template_Import_Leads.xlsx");
  };

  const handleImport = async () => {
    if (!importFile) return alert("Pilih file terlebih dahulu");
    setIsActionLoading(true);
    try {
      let fileToUpload = importFile;
      
      if (importFile.name.endsWith('.xlsx')) {
        const buffer = await importFile.arrayBuffer();
        const wb = XLSX.read(buffer);
        const ws = wb.Sheets[wb.SheetNames[0]];
        const csvString = XLSX.utils.sheet_to_csv(ws);
        fileToUpload = new File([csvString], "converted.csv", { type: "text/csv" });
      }

      const formData = new FormData();
      formData.append('file', fileToUpload);

      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/leads/import`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) throw new Error(await res.text());
      
      alert("Data leads berhasil diimport.");
      setIsImportModalOpen(false);
      setImportFile(null);
      loadData();
    } catch (error: any) {
      alert("Gagal mengimport: " + error.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-tl-[16px] overflow-hidden">
      {/* Page Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Distribusi Leads</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola pembagian leads ke tim sales. Pantau leads yang idle {'>'} 1 bulan.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            <Upload className="w-4 h-4 mr-2 text-gray-500" />
            Import
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2 text-gray-500" />
            Export
          </button>
          <button 
            disabled={selectedLeads.length === 0 || isActionLoading}
            onClick={handleTarikData}
            className={`flex items-center px-4 py-1.5 text-[13px] font-medium rounded transition-colors ${
              selectedLeads.length > 0 && !isActionLoading
                ? "text-brand-700 bg-brand-50 border border-brand-200 hover:bg-brand-100 shadow-sm" 
                : "text-gray-400 bg-gray-100 cursor-not-allowed border border-gray-200"
            }`}
          >
            <Undo2 className="w-4 h-4 mr-2" />
            {isActionLoading ? "Loading..." : `Tarik Data (${selectedLeads.length})`}
          </button>
          <button 
            disabled={selectedLeads.length === 0 || isActionLoading}
            onClick={() => setIsAssignModalOpen(true)}
            className={`flex items-center px-4 py-1.5 text-[13px] font-medium rounded transition-colors ${
              selectedLeads.length > 0 && !isActionLoading
                ? "text-white bg-brand-700 hover:bg-brand-800 shadow-sm" 
                : "text-gray-400 bg-gray-100 cursor-not-allowed border border-gray-200"
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Bulk Assign ({selectedLeads.length})
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-6 py-2.5 bg-white border-b border-gray-200 shrink-0 gap-3">
        <div className="flex flex-wrap items-center gap-2">
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
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-1 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors focus:outline-none"
          >
            <option value="Any">Tanggal: Any</option>
            <option value="Hari Ini">Hari Ini</option>
            <option value="Minggu Ini">Minggu Ini</option>
            <option value="Bulan Ini">Bulan Ini</option>
            <option value="Custom">Rentang Tanggal</option>
          </select>
          
          {dateFilter === "Custom" && (
            <div className="flex items-center gap-1">
              <input 
                type="date" 
                value={startDate} 
                onChange={e => setStartDate(e.target.value)}
                className="px-2 py-1 text-[13px] border border-gray-300 rounded focus:ring-brand-500 focus:border-brand-500"
              />
              <span className="text-gray-500 text-xs">-</span>
              <input 
                type="date" 
                value={endDate} 
                onChange={e => setEndDate(e.target.value)}
                className="px-2 py-1 text-[13px] border border-gray-300 rounded focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
          )}

          <select 
            value={idleFilter}
            onChange={(e) => setIdleFilter(e.target.value)}
            className="px-3 py-1 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors focus:outline-none"
          >
            <option value="Any">Activity: Any</option>
            <option value="Idle">Activity: Idle &gt; 30 Hari</option>
          </select>

          <button 
            onClick={() => alert("Mengirimkan Idle Alert (Push Notification/Email) ke sales terkait!")}
            className="flex items-center px-3 py-1 text-[13px] font-medium text-red-700 bg-red-50 border border-red-200 rounded-full hover:bg-red-100 transition-colors"
          >
            <Bell className="w-3.5 h-3.5 mr-1" /> Kirim Idle Alert
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
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" 
                    checked={filteredLeads.length > 0 && selectedLeads.length === filteredLeads.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Leads ID</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Nama Perusahaan</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Status</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Assignee</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Last Activity</th>
                <th className="px-4 py-2 font-medium text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">Idle Alert</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 align-top">
              {isLoading ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">Loading data...</td></tr>
              ) : filteredLeads.map((lead) => {
                let isIdle = false;
                let diffDays = 0;
                if (lead.updated_at) {
                  const diffTime = Math.abs(Date.now() - new Date(lead.updated_at).getTime());
                  diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  isIdle = diffDays > 30;
                }

                return (
                  <tr 
                    key={lead.id} 
                    className={`hover:bg-brand-50/40 group transition-colors cursor-pointer ${selectedLeads.includes(lead.id) ? 'bg-brand-50/60' : ''}`}
                    onClick={() => toggleSelectLead(lead.id)}
                  >
                    <td className="px-4 py-2.5 text-center align-middle">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" 
                        checked={selectedLeads.includes(lead.id)}
                        onChange={() => toggleSelectLead(lead.id)}
                        onClick={e => e.stopPropagation()}
                      />
                    </td>
                    <td className="px-4 py-2.5 align-middle font-mono text-xs text-brand-600 font-medium">
                      {lead.id.substring(0,8)}
                    </td>
                    <td className="px-4 py-2.5 align-middle">
                      <div className="font-medium text-gray-900">{lead.nama_perusahaan}</div>
                    </td>
                    <td className="px-4 py-2.5 align-middle">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        {lead.status_leads}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 align-middle">
                      {lead.sales ? lead.sales.name : <span className="text-gray-400 italic">Unassigned</span>}
                    </td>
                    <td className="px-4 py-2.5 align-middle">
                      {lead.updated_at ? new Date(lead.updated_at).toLocaleDateString('id-ID') : "-"}
                    </td>
                    <td className="px-4 py-2.5 align-middle">
                      {isIdle ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-red-50 text-red-700 border border-red-200">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          &gt; 30 Hari
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {!isLoading && filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Tidak ada leads ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Assign */}
      <Modal 
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Bulk Assign Leads"
        footer={
          <>
            <button 
              onClick={() => setIsAssignModalOpen(false)}
              className="px-4 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              Batal
            </button>
            <button 
              onClick={handleAssign}
              disabled={isActionLoading}
              className="px-4 py-2 text-[13px] font-medium text-white bg-brand-700 rounded hover:bg-brand-800 disabled:opacity-50"
            >
              {isActionLoading ? "Menyimpan..." : "Assign Leads"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Anda akan mendistribusikan <strong>{selectedLeads.length} leads</strong> ke sales terpilih.
          </p>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Pilih Sales / Assignee</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500"
              value={selectedSales}
              onChange={(e) => setSelectedSales(e.target.value)}
            >
              <option value="" disabled>-- Pilih Sales --</option>
              {salesList.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
      </Modal>

      {/* MODAL IMPORT */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Data Leads dari CSV/Excel"
        footer={
          <>
            <button 
              onClick={() => setIsImportModalOpen(false)}
              className="px-4 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              Batal
            </button>
            <button 
              onClick={handleImport}
              disabled={isActionLoading || !importFile}
              className="px-4 py-2 text-[13px] font-medium text-white bg-brand-700 rounded hover:bg-brand-800 disabled:opacity-50"
            >
              {isActionLoading ? "Mengimport..." : "Import Data"}
            </button>
          </>
        }
      >
        <div className="text-[13px] text-gray-600 space-y-4">
          <p>
            Pastikan kolom pada file CSV/Excel Anda mencakup format standar (Nama Perusahaan, Jenis, Status, dll).
          </p>
          <button onClick={handleDownloadTemplate} className="flex items-center text-brand-600 font-medium hover:underline text-[13px]">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Download Template Import Leads
          </button>
          <label className="border-2 border-dashed border-gray-300 rounded-md p-8 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
            <input 
              type="file" 
              accept=".csv, .xlsx" 
              onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <div className="font-medium text-gray-900 mb-1">
              {importFile ? importFile.name : "Pilih File CSV atau Excel"}
            </div>
            <div className="text-xs text-gray-500">Max. ukuran file: 10MB</div>
          </label>
        </div>
      </Modal>

    </div>
  );
}
