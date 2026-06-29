"use client";

import React, { useState } from "react";
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
  FileSpreadsheet
} from "lucide-react";
import Modal from "@/components/Modal";

// Dummy data for distribution
const dummyLeads = [
  { id: "1", leadsId: "LD-001", namaPerusahaan: "PT. Tambang Alpha", status: "New Leads", lastActivity: "2026-06-25", assignedTo: "-", isIdle: false },
  { id: "2", leadsId: "LD-002", namaPerusahaan: "PT. Migas Beta", status: "Contacted", lastActivity: "2026-05-10", assignedTo: "Budi Sales", isIdle: true },
  { id: "3", leadsId: "LD-003", namaPerusahaan: "PT. Konstruksi Delta", status: "Response", lastActivity: "2026-06-20", assignedTo: "Siti Sales", isIdle: false },
  { id: "4", leadsId: "LD-004", namaPerusahaan: "CV. Makmur Jaya", status: "New Leads", lastActivity: "2026-04-15", assignedTo: "Andi Sales", isIdle: true },
];

const salesList = ["Budi Sales", "Siti Sales", "Andi Sales", "Rian Nugraha"];

export default function DistribusiLeadsPage() {
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedSales, setSelectedSales] = useState("");

  const filteredLeads = dummyLeads.filter(l => 
    l.namaPerusahaan.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.leadsId.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleAssign = () => {
    if (!selectedSales) {
      alert("Pilih sales terlebih dahulu.");
      return;
    }
    alert(`Berhasil assign ${selectedLeads.length} leads ke ${selectedSales}`);
    setSelectedLeads([]);
    setIsAssignModalOpen(false);
  };

  const handleTarikData = () => {
    alert(`Berhasil menarik (unassign) ${selectedLeads.length} leads terpilih.`);
    setSelectedLeads([]);
  };

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

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
            onClick={() => alert("Mengekspor data distribusi leads ke CSV...")}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2 text-gray-500" />
            Export
          </button>
          <button 
            disabled={selectedLeads.length === 0}
            onClick={handleTarikData}
            className={`flex items-center px-4 py-1.5 text-[13px] font-medium rounded transition-colors ${
              selectedLeads.length > 0 
                ? "text-brand-700 bg-brand-50 border border-brand-200 hover:bg-brand-100 shadow-sm" 
                : "text-gray-400 bg-gray-100 cursor-not-allowed border border-gray-200"
            }`}
          >
            <Undo2 className="w-4 h-4 mr-2" />
            Tarik Data ({selectedLeads.length})
          </button>
          <button 
            disabled={selectedLeads.length === 0}
            onClick={() => setIsAssignModalOpen(true)}
            className={`flex items-center px-4 py-1.5 text-[13px] font-medium rounded transition-colors ${
              selectedLeads.length > 0 
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

          <button className="flex items-center px-3 py-1 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
            Status: Any <ChevronDown className="w-3.5 h-3.5 ml-1 text-gray-400" />
          </button>
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
              {filteredLeads.map((lead) => (
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
                    {lead.leadsId}
                  </td>
                  <td className="px-4 py-2.5 align-middle">
                    <div className="font-medium text-gray-900">{lead.namaPerusahaan}</div>
                  </td>
                  <td className="px-4 py-2.5 align-middle">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 align-middle">
                    {lead.assignedTo}
                  </td>
                  <td className="px-4 py-2.5 align-middle">
                    {lead.lastActivity}
                  </td>
                  <td className="px-4 py-2.5 align-middle">
                    {lead.isIdle ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-red-50 text-red-700 border border-red-200">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        &gt; 1 Bulan
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
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
              className="px-4 py-2 text-[13px] font-medium text-white bg-brand-700 rounded hover:bg-brand-800"
            >
              Assign Leads
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
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </Modal>

      {/* MODAL IMPORT */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Data Distribusi dari CSV/Excel"
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
                alert("Data berhasil diimport.");
                setIsImportModalOpen(false);
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
            Pastikan kolom pada file CSV/Excel Anda mencakup format standar (Leads ID, Sales Assignee).
          </p>
          <button onClick={() => alert("Mengunduh Template_Distribusi_Leads.xlsx")} className="flex items-center text-brand-600 font-medium hover:underline text-[13px]">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Download Template Import Distribusi
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
