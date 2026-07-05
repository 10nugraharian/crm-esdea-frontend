import React, { useState, useEffect } from "react";
import { Plus, Trash2, Info, AlertTriangle, CheckCircle, ChevronDown } from "lucide-react";
import Modal from "./Modal";
import { fetchApi } from "@/lib/api";

interface Layanan {
  id: string;
  nama_layanan: string;
  kategori: string;
  harga_pokok: number;
}

interface Lead {
  id: string;
  nama_perusahaan: string;
  nama_pic: string;
}

interface QuotationItem {
  uid: string;
  layanan_id: string;
  qty: number;
  harga_jual_input: number;
}

const MAX_UPPING = 500000;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function CreateQuotationModal({ isOpen, onClose, onSave }: Props) {
  const [masterLayanan, setMasterLayanan] = useState<Layanan[]>([]);
  const [masterLeads, setMasterLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [items, setItems] = useState<QuotationItem[]>([
    { uid: crypto.randomUUID(), layanan_id: "", qty: 1, harga_jual_input: 0 }
  ]);
  const [diskon, setDiskon] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      loadData();
    } else {
      // Reset state when closed
      setSelectedLeadId("");
      setItems([{ uid: crypto.randomUUID(), layanan_id: "", qty: 1, harga_jual_input: 0 }]);
      setDiskon(0);
    }
  }, [isOpen]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [resLeads, resLayanan] = await Promise.all([
        fetchApi('/leads'),
        fetchApi('/layanans')
      ]);
      setMasterLeads(resLeads.data || []);
      setMasterLayanan(resLayanan.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const getLayanan = (id: string) => masterLayanan.find(l => l.id === id);
  const selectedLead = masterLeads.find(l => l.id === selectedLeadId);

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);

  const addItem = () => {
    setItems(prev => [...prev, { uid: crypto.randomUUID(), layanan_id: "", qty: 1, harga_jual_input: 0 }]);
  };

  const removeItem = (uid: string) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter(i => i.uid !== uid));
  };

  const updateItem = (uid: string, field: keyof QuotationItem, value: string | number) => {
    setItems(prev => prev.map(item => {
      if (item.uid !== uid) return item;
      const updated = { ...item, [field]: value };
      if (field === "layanan_id") {
        const lay = masterLayanan.find(l => l.id === value);
        if (lay) updated.harga_jual_input = lay.harga_pokok;
      }
      return updated;
    }));
  };

  const calculations = items.map(item => {
    const layanan = getLayanan(item.layanan_id);
    const harga_pokok = layanan ? layanan.harga_pokok : 0;
    const margin = item.harga_jual_input - harga_pokok;
    const subTotal = item.harga_jual_input * item.qty;
    const isValid = item.layanan_id !== "";
    const withinLimit = item.harga_jual_input >= harga_pokok && margin <= MAX_UPPING;
    return { harga_pokok, margin, subTotal, isValid, withinLimit };
  });

  const totalAmount = calculations.reduce((sum, c) => sum + c.subTotal, 0);
  const grandTotal = totalAmount - diskon;

  const allItemsValid = items.every(item => item.layanan_id !== "");
  const allWithinLimit = calculations.every(c => !c.isValid || c.withinLimit);
  const canAutoGenerate = allItemsValid && allWithinLimit && selectedLeadId !== "";
  const needsApproval = allItemsValid && !allWithinLimit && selectedLeadId !== "";

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        lead_id: selectedLeadId,
        items: items.map(item => ({
          layanan_id: item.layanan_id,
          qty: item.qty,
          harga_jual_input: item.harga_jual_input
        }))
      };

      await fetchApi('/quotations', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      alert("Quotation berhasil dibuat!");
      onSave(); // Refresh the list in parent
      onClose();
    } catch (e: any) {
      alert("Gagal membuat Quotation: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            disabled={(!canAutoGenerate && !needsApproval) || isSubmitting}
            onClick={handleSubmit}
            className={`px-4 py-2 text-[13px] font-medium text-white rounded shadow-sm ${
              isSubmitting ? "bg-gray-400 cursor-wait" :
              canAutoGenerate ? "bg-brand-600 hover:bg-brand-700" :
              needsApproval ? "bg-yellow-600 hover:bg-yellow-700" :
              "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Menyimpan..." : (canAutoGenerate ? "Buat Quotation" : "Request Approval")}
          </button>
        </>
      }
    >
      {isLoading ? (
        <div className="p-8 text-center text-gray-500">Memuat data...</div>
      ) : (
        <div className="space-y-6">
          {/* Client Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Pilih Leads / Client <span className="text-red-500">*</span></label>
              <div className="relative">
                <select 
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                  className="w-full px-3 py-2 text-[13px] text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm appearance-none cursor-pointer"
                >
                  <option value="" disabled>-- Pilih Perusahaan --</option>
                  {masterLeads.map(lead => (
                    <option key={lead.id} value={lead.id}>{lead.nama_perusahaan}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
            {selectedLead && (
              <div className="flex items-center bg-brand-50 border border-brand-200 rounded-md px-4 py-2 text-[13px] mt-5">
                <Info className="w-4 h-4 text-brand-500 mr-2 shrink-0" />
                <span>PIC: <strong>{selectedLead.nama_pic || '-'}</strong> — {selectedLead.nama_perusahaan}</span>
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
                    const layanan = getLayanan(item.layanan_id);
                    return (
                      <tr key={item.uid}>
                        <td className="px-3 py-2 text-center align-middle">{idx + 1}</td>
                        <td className="px-3 py-2 align-middle">
                          <div className="relative">
                            <select 
                              value={item.layanan_id} 
                              onChange={(e) => updateItem(item.uid, "layanan_id", e.target.value)}
                              className="w-full px-2 py-1.5 pr-8 text-[13px] text-gray-900 border border-gray-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 appearance-none cursor-pointer"
                            >
                              <option value="" disabled>-- Pilih Layanan --</option>
                              {masterLayanan.map(l => (
                                <option key={l.id} value={l.id}>{l.nama_layanan}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                          </div>
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
                          {layanan ? formatRupiah(calc.harga_pokok) : "-"}
                        </td>
                        <td className="px-3 py-2 align-middle">
                          <input 
                            type="number" 
                            min="0"
                            value={item.harga_jual_input || ""}
                            onChange={(e) => updateItem(item.uid, "harga_jual_input", parseInt(e.target.value) || 0)}
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
        </div>
      )}
    </Modal>
  );
}
