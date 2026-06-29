import React, { useState } from "react";
import { Plus, Trash2, Info, AlertTriangle, CheckCircle } from "lucide-react";
import Modal from "./Modal";

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
  { id: "LY-006", namaLayanan: "Sertifikasi ISO", kategori: "Sertifikasi Perusahaan", hargaPokok: 2000000, komisiSales: 100000 },
];

const dummyLeads = [
  { id: "LD-001", namaPerusahaan: "PT. Tambang Alpha", namaPic: "Andi" },
  { id: "LD-002", namaPerusahaan: "PT. Migas Beta", namaPic: "Budi" },
  { id: "LD-003", namaPerusahaan: "PT. Konstruksi Delta", namaPic: "Cici" },
];

interface QuotationItem {
  uid: string;
  layananId: string;
  qty: number;
  hargaJual: number;
}

const MAX_UPPING = 500000;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function CreateQuotationModal({ isOpen, onClose, onSave }: Props) {
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [items, setItems] = useState<QuotationItem[]>([
    { uid: crypto.randomUUID(), layananId: "", qty: 1, hargaJual: 0 }
  ]);
  const [diskon, setDiskon] = useState<number>(0);

  const getLayanan = (id: string) => masterLayanan.find(l => l.id === id);
  const selectedLead = dummyLeads.find(l => l.id === selectedLeadId);

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);

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
      if (field === "layananId") {
        const lay = masterLayanan.find(l => l.id === value);
        if (lay) updated.hargaJual = lay.hargaPokok;
      }
      return updated;
    }));
  };

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

  const allItemsValid = items.every(item => item.layananId !== "");
  const allWithinLimit = calculations.every(c => !c.isValid || c.withinLimit);
  const canAutoGenerate = allItemsValid && allWithinLimit && selectedLeadId !== "";
  const needsApproval = allItemsValid && !allWithinLimit && selectedLeadId !== "";

  const groupedLayanan = masterLayanan.reduce((acc, l) => {
    if (!acc[l.kategori]) acc[l.kategori] = [];
    acc[l.kategori].push(l);
    return acc;
  }, {} as Record<string, Layanan[]>);

  if (!isOpen) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Buat Quotation Baru" 
      maxWidth="max-w-4xl"
      footer={
        <>
          <button 
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            Batal
          </button>
          <button 
            disabled={!canAutoGenerate && !needsApproval}
            onClick={() => { onSave(); onClose(); }}
            className={`px-4 py-2 text-[13px] font-medium text-white rounded shadow-sm ${
              canAutoGenerate ? "bg-brand-600 hover:bg-brand-700" :
              needsApproval ? "bg-yellow-600 hover:bg-yellow-700" :
              "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {canAutoGenerate ? "Buat Quotation" : "Request Approval"}
          </button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Client Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Pilih Leads / Client <span className="text-red-500">*</span></label>
            <input 
              type="text"
              list="leads-list"
              value={dummyLeads.find(l => l.id === selectedLeadId)?.namaPerusahaan || selectedLeadId}
              onChange={(e) => {
                const lead = dummyLeads.find(l => l.namaPerusahaan === e.target.value);
                setSelectedLeadId(lead ? lead.id : e.target.value);
              }}
              className="w-full px-3 py-2 text-[13px] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="-- Ketik atau Pilih Perusahaan --"
            />
            <datalist id="leads-list">
              {dummyLeads.map(lead => (
                <option key={lead.id} value={lead.namaPerusahaan}>{lead.namaPic}</option>
              ))}
            </datalist>
          </div>
          {selectedLead && (
            <div className="flex items-center bg-brand-50 border border-brand-200 rounded-md px-4 py-2 text-[13px] mt-5">
              <Info className="w-4 h-4 text-brand-500 mr-2 shrink-0" />
              <span>PIC: <strong>{selectedLead.namaPic}</strong> — {selectedLead.namaPerusahaan}</span>
            </div>
          )}
        </div>

        {/* Rincian Layanan Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px] text-gray-600">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-2 font-medium w-10">#</th>
                  <th className="px-3 py-2 font-medium min-w-[200px]">Layanan</th>
                  <th className="px-3 py-2 text-center font-medium w-16">QTY</th>
                  <th className="px-3 py-2 text-right font-medium w-32">Hrg Pokok</th>
                  <th className="px-3 py-2 text-right font-medium w-36">Hrg Jual</th>
                  <th className="px-3 py-2 text-right font-medium w-32">Sub Total</th>
                  <th className="px-3 py-2 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item, idx) => {
                  const calc = calculations[idx];
                  const layanan = getLayanan(item.layananId);
                  return (
                    <tr key={item.uid}>
                      <td className="px-3 py-2 text-center align-middle">{idx + 1}</td>
                      <td className="px-3 py-2 align-middle">
                        <input 
                          type="text"
                          list="layanan-list"
                          value={layanan?.namaLayanan || item.layananId} 
                          onChange={(e) => {
                            const l = masterLayanan.find(lay => lay.namaLayanan === e.target.value);
                            updateItem(item.uid, "layananId", l ? l.id : e.target.value);
                          }}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white focus:ring-1 focus:ring-brand-500"
                          placeholder="Pilih atau ketik layanan..."
                        />
                      </td>
                      <td className="px-3 py-2 align-middle">
                        <input 
                          type="number" 
                          min="1" 
                          value={item.qty}
                          onChange={(e) => updateItem(item.uid, "qty", Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded text-center focus:ring-1 focus:ring-brand-500"
                        />
                      </td>
                      <td className="px-3 py-2 text-right align-middle text-gray-500">
                        {layanan ? formatRupiah(calc.hargaPokok) : "-"}
                      </td>
                      <td className="px-3 py-2 align-middle">
                        <input 
                          type="number" 
                          min="0"
                          value={item.hargaJual || ""}
                          onChange={(e) => updateItem(item.uid, "hargaJual", parseInt(e.target.value) || 0)}
                          className={`w-full px-2 py-1.5 border rounded text-right focus:ring-1 focus:ring-brand-500 ${
                            calc.isValid && !calc.withinLimit ? "border-red-400 bg-red-50" : "border-gray-300"
                          }`}
                        />
                      </td>
                      <td className="px-3 py-2 text-right align-middle font-medium text-gray-800">
                        {calc.isValid ? formatRupiah(calc.subTotal) : "-"}
                      </td>
                      <td className="px-3 py-2 text-center align-middle">
                        <button 
                          onClick={() => removeItem(item.uid)} 
                          disabled={items.length <= 1}
                          className="p-1 text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed"
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
          
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <button
              onClick={addItem}
              className="flex items-center text-brand-700 font-medium text-[13px] hover:underline"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Tambah Layanan
            </button>
          </div>
        </div>

        {/* Totals Section */}
        <div className="flex justify-end">
          <div className="w-72 space-y-2 text-[13px]">
            <div className="flex justify-between">
              <span className="text-gray-600">Total</span>
              <span className="font-medium text-gray-800">{formatRupiah(totalAmount)}</span>
            </div>
            <div className="flex justify-between items-center border-t border-gray-100 pt-2">
              <span className="font-bold text-gray-800">Grand Total</span>
              <span className="font-bold text-gray-900 text-sm">{formatRupiah(grandTotal)}</span>
            </div>
          </div>
        </div>

        <datalist id="layanan-list">
          {masterLayanan.map(l => (
            <option key={l.id} value={l.namaLayanan}>{l.kategori}</option>
          ))}
        </datalist>
      </div>
    </Modal>
  );
}
