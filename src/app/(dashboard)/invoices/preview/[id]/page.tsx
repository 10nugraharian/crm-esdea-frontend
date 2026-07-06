"use client";

import React, { use, useState, useEffect } from "react";
import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { fetchApi } from "@/lib/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Format date in Indonesian
function formatTanggalIndonesia(dateString: string): string {
  const date = new Date(dateString);
  const bulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  return `${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
}

export default function InvoicePreviewPage(props: PageProps) {
  const params = use(props.params);
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "proforma-dp"; // proforma-dp, proforma-bp, invoice-dp, invoice-bp

  const isProforma = type.startsWith("proforma");
  const isDp = type.endsWith("dp");

  const title = isProforma ? "PROFORMA INVOICE" : "INVOICE";
  
  const [invoice, setInvoice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const res = await fetchApi(`/invoices/${params.id}`);
        setInvoice(res.data || res);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [params.id]);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
  };

  const downloadPdfServer = async () => {
    try {
      const Cookies = (await import('js-cookie')).default;
      const token = Cookies.get('auth_token');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const res = await fetch(`${baseUrl}/invoices/${params.id}/pdf`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) throw new Error('Gagal mengunduh PDF');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice-${invoice?.quotation?.no_quotation || params.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert('Gagal mengunduh PDF dari server.');
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">Memuat data...</div>;
  }

  if (error || !invoice || !invoice.quotation) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-red-600">Error: {error || 'Data tidak ditemukan'}</div>;
  }

  const tanggalSekarang = formatTanggalIndonesia(invoice.created_at);
  
  const quotation = invoice.quotation;
  const baseNoQuotation = quotation.no_quotation || "";
  
  // Format no surat: replace "QT-" with "PI-" or "IN-"
  let noSurat = baseNoQuotation;
  if (baseNoQuotation.startsWith("QT-")) {
    noSurat = baseNoQuotation.replace("QT-", isProforma ? "PI-" : "IN-");
  } else {
    // Fallback if the old format is still there (should not happen since we migrated)
    noSurat = (isProforma ? "PI-" : "IN-") + baseNoQuotation;
  }

  const grandTotal = parseFloat(quotation.total_amount) || 0;
  const persentaseDp = parseFloat(invoice.persentase_dp) || 50;
  
  const dpAmount = (grandTotal * persentaseDp) / 100;
  const bpAmount = grandTotal - dpAmount;

  const amountToPay = isDp ? dpAmount : bpAmount;
  const paymentLabel = isDp ? `Down Payment (DP ${persentaseDp}%)` : `Pelunasan (BP ${100 - persentaseDp}%)`;

  const PageHeader = () => (
    <div className="w-full shrink-0">
      <img src="/header-doc.png" alt="Esdea Header" className="w-full h-auto block" />
    </div>
  );

  const PageFooter = () => (
    <div className="w-full mt-auto shrink-0">
      <img src="/footer-doc.png" alt="Esdea Footer" className="w-full h-auto block" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-300 py-8 print:py-0 print:bg-white font-sans text-gray-900">
      
      {/* Floating Action Bar (Hidden on Print) */}
      <div className="fixed top-16 left-1/2 -translate-x-1/2 flex gap-4 bg-white px-6 py-3 rounded-full shadow-lg print:hidden z-50 border border-gray-100">
        <Link href="/invoices" className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Link>
        <div className="w-px h-5 bg-gray-300"></div>
        <button 
          onClick={() => window.print()}
          className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print / Download PDF
        </button>
      </div>

      <div className="flex flex-col gap-8 print:gap-0 items-center mt-12 print:mt-0">

        {/* ==================== INVOICE PAGE ==================== */}
        <div className="w-[210mm] min-h-[297mm] bg-white shadow-md print:shadow-none relative box-border flex flex-col break-after-page">
          <PageHeader />

          <div className="flex-1 flex flex-col px-[15mm] py-[6mm]">

            <h2 className="text-lg font-bold text-center mb-6">{title}</h2>

            <div className="text-[11px] leading-relaxed mb-1 text-right">{tanggalSekarang}</div>

            <table className="text-[11px] leading-relaxed mb-4">
              <tbody>
                <tr><td className="pr-2 align-top">No Invoice</td><td className="pr-2 align-top">:</td><td>{noSurat}</td></tr>
                <tr><td className="pr-2 align-top">Hal</td><td className="pr-2 align-top">:</td><td>Tagihan {paymentLabel}</td></tr>
              </tbody>
            </table>

            <div className="text-[11px] mb-6 leading-relaxed">
              <p>Kepada Yth,</p>
              <p className="font-bold">{quotation.lead?.nama_perusahaan}</p>
              <p>Up. {quotation.lead?.nama_pic || '-'} {quotation.lead?.no_wa ? `(${quotation.lead.no_wa})` : ''}</p>
            </div>

            {/* Dynamic Table */}
            <table className="w-full text-[11px] border-collapse border border-gray-700 mb-6">
              <thead>
                <tr className="bg-gray-100 font-bold text-center">
                  <th className="border border-gray-700 py-1.5 w-8">No</th>
                  <th className="border border-gray-700 py-1.5">Deskripsi Tagihan</th>
                  <th className="border border-gray-700 py-1.5 w-36">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {quotation.items?.map((item: any, idx: number) => {
                  const harga = parseFloat(item.harga_jual_input);
                  const qty = parseInt(item.qty);
                  const subTotal = harga * qty;
                  return (
                    <tr key={idx}>
                      <td className="border border-gray-700 py-2.5 text-center align-top">{idx + 1}</td>
                      <td className="border border-gray-700 py-2.5 px-3 align-top">
                        <strong>{item.layanan?.nama_layanan}</strong><br/>
                        <span className="text-[10px]">{item.layanan?.kategori}</span>
                      </td>
                      <td className="border border-gray-700 py-2.5 px-3 text-right align-top">
                        {formatRupiah(subTotal)}
                      </td>
                    </tr>
                  );
                })}
                
                {/* Calculations */}
                <tr className="font-bold">
                  <td colSpan={2} className="border border-gray-700 py-1.5 px-3 text-right">Grand Total Keseluruhan</td>
                  <td className="border border-gray-700 py-1.5 px-3 text-right">{formatRupiah(grandTotal)}</td>
                </tr>
                <tr className="font-bold bg-yellow-50">
                  <td colSpan={2} className="border border-gray-700 py-2 px-3 text-right">
                    Tagihan Saat Ini: {paymentLabel}
                  </td>
                  <td className="border border-gray-700 py-2 px-3 text-right text-[12px] text-blue-800">
                    {formatRupiah(amountToPay)}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="text-[11px] text-justify mb-8">
              <p>Pembayaran dapat ditransfer melalui salah satu rekening kami:</p>
              <div className="flex gap-4 mt-2">
                <div className="font-bold p-3 border border-gray-300 bg-gray-50 rounded-sm w-[200px]">
                  Bank Mandiri<br/>
                  No. Rekening : 1670007013526<br/>
                  A/n PT Esdea Assistance Management
                </div>
                <div className="font-bold p-3 border border-gray-300 bg-gray-50 rounded-sm w-[200px]">
                  Bank Central Asia<br/>
                  No. Rekening : 6755907760<br/>
                  A/n Donny Ruswandi (Direktur)
                </div>
              </div>
            </div>

            <p className="text-[11px] mb-6">Bekasi, {tanggalSekarang}</p>

            {/* Signature Block - Only Esdea for invoice */}
            <div className="flex justify-start text-[11px] mb-4">
              <div className="text-center w-[45%]">
                <p className="font-bold">Hormat Kami,</p>
                <div className="h-[80px] flex items-center justify-center">
                  <Image src="/ttd-esdea.png" alt="Tanda Tangan Esdea" width={150} height={80} className="h-[70px] w-auto object-contain" />
                </div>
                <p className="font-bold border-b border-gray-800 pb-1 inline-block">PT. Esdea Assistance Management</p>
                <p className="mt-1">Finance Dept.</p>
              </div>
            </div>

          </div>{/* end content padding wrapper */}

          <PageFooter />
        </div>

      </div>
    </div>
  );
}
