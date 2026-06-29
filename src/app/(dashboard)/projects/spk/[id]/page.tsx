"use client";

import React, { useEffect, useState } from "react";
import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Dummy data generator for SPK based on Item ID
const getSpkData = (id: string) => {
  return {
    noSpk: `SPK-${id.split("-")[1] || "001"}/ESDEA/VI/2026`,
    tanggal: "Jakarta, 29 Juni 2026",
    vendor: {
      nama: "PT. Mitra Sertifikasi Utama",
      pic: "Bpk. Budi Santoso",
      alamat: "Jl. Sudirman No. 45, Jakarta Selatan"
    },
    esdea: {
      nama: "PT. ESDEA ASSISTANCE MANAGEMENT",
      pic: "Bp. Rian",
      alamat: "Jakarta"
    },
    client: {
      nama: "PT. Tambang Alpha"
    },
    layanan: [
      { id: 1, nama: "Pengurusan SBU Jasa Konstruksi", qty: 1 }
    ]
  };
};

const PageHeader = () => (
  <div className="w-full mb-6">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/header-doc.png" alt="Header" className="w-full h-auto block" />
  </div>
);

const PageFooter = () => (
  <div className="w-full mt-auto">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/footer-doc.png" alt="Footer" className="w-full h-auto block" />
  </div>
);

export default function SpkPreviewPage() {
  const params = useParams();
  const id = params.id as string;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const data = getSpkData(id);

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-gray-100 font-sans print:bg-white flex justify-center pb-20">
      
      {/* ACTION BAR (Hidden on Print) */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between z-50 print:hidden">
        <Link 
          href="/projects" 
          className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Projects
        </Link>
        <button 
          onClick={() => window.print()}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print / Download PDF SPK
        </button>
      </div>

      {/* A4 PAGE CONTAINER */}
      <div className="flex flex-col gap-8 print:gap-0 items-center mt-24 print:mt-0">
        
        <div className="w-[210mm] min-h-[297mm] bg-white shadow-md print:shadow-none relative box-border flex flex-col break-after-page">
          <PageHeader />

          <div className="flex-1 flex flex-col px-[20mm] py-[6mm]">

            <h2 className="text-base font-bold underline mb-1 text-center">Surat Perintah Kerja</h2>
            <div className="text-[12px] mb-4 text-right">{data.tanggal}</div>

            <table className="text-[12px] leading-relaxed mb-6">
              <tbody>
                <tr><td className="w-10 align-top">No</td><td className="w-4 align-top">:</td><td>{data.noSpk}</td></tr>
                <tr><td className="align-top">Hal</td><td className="align-top">:</td><td>SPK Pengurusan Legalitas</td></tr>
                <tr><td className="align-top">Rev</td><td className="align-top">:</td><td>01</td></tr>
              </tbody>
            </table>

            <div className="text-[12px] mb-4 leading-relaxed">
              <p>Kepada Yth,</p>
              <p className="font-bold">{data.vendor.nama}</p>
            </div>

            <div className="text-[12px] mb-6 leading-relaxed text-justify">
              <p>Dengan Hormat,</p>
              <p className="mt-4">Sehubungan dengan kebutuhan klien kami untuk pengurusan dokumen legalitas perusahaan, kami dengan ini memberikan Surat Perintah Kerja untuk melakukan proses pengurusan legalitas dengan rincian sebagai berikut:</p>
            </div>

            <div className="text-[12px] mb-2 leading-relaxed">
              <p>Nama Klien : <strong>{data.client.nama}</strong></p>
            </div>

            <table className="w-full text-[12px] border-collapse mb-8 border border-black">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black px-3 py-2 text-center w-10">No</th>
                  <th className="border border-black px-3 py-2 text-left">Deskripsi</th>
                  <th className="border border-black px-3 py-2 text-left">Keterangan</th>
                  <th className="border border-black px-3 py-2 text-center w-20">QTY</th>
                </tr>
              </thead>
              <tbody>
                {data.layanan.map((l, index) => (
                  <tr key={l.id}>
                    <td className="border border-black px-3 py-2 text-center align-top">{index + 1}</td>
                    <td className="border border-black px-3 py-2 align-top">{l.nama}</td>
                    <td className="border border-black px-3 py-2 align-top">Sesuai SLA</td>
                    <td className="border border-black px-3 py-2 text-center align-top">{l.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-[12px] leading-relaxed mb-12 text-justify">
              <p>Demikian Surat Perintah Kerja ini kami sampaikan agar dapat dilaksanakan dengan penuh tanggung jawab. Apabila ada hal yang perlu diklarifikasi, jangan ragu untuk menghubungi kami.</p>
            </div>

            <div className="text-[12px]">
              <p className="mb-1">{data.tanggal.replace("Jakarta", "Bekasi")}</p>
              
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/ttd-esdea.png" alt="Tanda Tangan Esdea" className="h-16 mt-4 mb-4 object-contain" />
              
              <p><strong>Esdea Assistance Management</strong></p>
              
              <div className="mt-8 pt-4">
                <p>Note : </p>
                <ul className="list-disc pl-5">
                  <li>Pembayaran 100% setelah keseluruhan project telah selesai.</li>
                </ul>
                <p className="mt-2">Cc : File Internal</p>
              </div>
            </div>

          </div>
          <PageFooter />
        </div>

      </div>
    </div>
  );
}
