"use client";

import React, { use } from "react";
import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Roman numeral converter for months
function toRoman(num: number): string {
  const romanNumerals: [number, string][] = [
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]
  ];
  let result = "";
  for (const [value, symbol] of romanNumerals) {
    while (num >= value) {
      result += symbol;
      num -= value;
    }
  }
  return result;
}

// Auto-generate quotation number: {counter}/Esdea/{roman_month}/{year}
// Counter resets every month, roman numeral = current month
function generateQuotationNumber(sequenceNumber: number): string {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const year = now.getFullYear();
  const romanMonth = toRoman(month);
  const paddedSeq = String(sequenceNumber).padStart(4, "0");
  return `${paddedSeq}/Esdea/${romanMonth}/${year}`;
}

// Format date in Indonesian
function formatTanggalIndonesia(date: Date): string {
  const bulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  return `${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
}

// Calculate validity date (14 days from now)
function getValidityDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return formatTanggalIndonesia(d);
}

function PageHeader() {
  return (
    <div className="w-full mb-8">
      <img src="/header-doc.png" alt="Esdea Header" className="w-full h-auto block" />
    </div>
  );
}

function PageFooter() {
  return (
    <div className="w-full mt-auto pt-8">
      <img src="/footer-doc.png" alt="Esdea Footer" className="w-full h-auto block" />
    </div>
  );
}

export default function QuotationPreviewPage(props: PageProps) {
  const params = use(props.params);
  const isQ1 = params.id === "Q-001";

  const now = new Date();
  const tanggalSekarang = formatTanggalIndonesia(now);
  const tanggalBerlaku = getValidityDate();

  const quotationData = {
    tanggal: tanggalSekarang,
    noSurat: generateQuotationNumber(isQ1 ? 1045 : 1046),
    namaPerusahaan: isQ1 ? "PT. Tambang Alpha" : "PT. Migas Beta",
    namaPic: "Rian Nugraha",
    noTelpPic: isQ1 ? "081234567890" : "089876543210",
    sales: "Budi Sales",
    items: [
      {
        nama_produk: isQ1 ? "Pengurusan SBU Jasa Konstruksi" : "ISO 9001 & 14001",
        keterangan: "Sertifikasi Badan Usaha & Pendampingan",
        qty: 1,
        harga_jual: isQ1 ? 15000000 : 25000000,
        sub_total: isQ1 ? 15000000 : 25000000
      }
    ],
    total: isQ1 ? 15000000 : 25000000,
    diskon: 0,
    grand_total: isQ1 ? 15000000 : 25000000
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
  };

    const downloadPdfServer = async () => {
    try {
      if (isQ1) {
        // Untuk data demo/dummy, jalankan print browser biasa
        window.print();
        return;
      }
      
      const Cookies = (await import('js-cookie')).default;
      const token = Cookies.get('auth_token');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const res = await fetch(`${baseUrl}/quotations/${params.id}/pdf`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) throw new Error('Gagal mengunduh PDF');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Quotation-${params.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert('Gagal mengunduh PDF dari server.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-300 py-8 print:py-0 print:bg-white font-[Tahoma] text-[12px] text-gray-900">
      
      {/* Floating Action Bar (Hidden on Print) */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 flex gap-4 bg-white px-6 py-3 rounded-full shadow-lg print:hidden z-50">
        <Link href="/quotations" className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Link>
        <div className="w-px h-5 bg-gray-300"></div>
        <button 
          onClick={downloadPdfServer}
          className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print / Download PDF (Server)
        </button>
      </div>

      {/* A4 PAGES CONTAINER */}
      <div className="flex flex-col gap-8 print:gap-0 items-center mt-12 print:mt-0">

        {/* ==================== PAGE 1: DYNAMIC QUOTATION LETTER ==================== */}
        <div className="w-[210mm] min-h-[297mm] bg-white shadow-md print:shadow-none relative box-border flex flex-col break-after-page">
          <PageHeader />

          <div className="flex-1 flex flex-col px-[15mm] py-[6mm]">

          <h2 className="text-base font-bold text-center underline mb-6">Quotation Letter</h2>

          <div className="text-[12px] leading-relaxed mb-1 text-right">{quotationData.tanggal}</div>

          <table className="text-[12px] leading-relaxed mb-4">
            <tbody>
              <tr><td className="pr-2 align-top">No</td><td className="pr-2 align-top">:</td><td>{quotationData.noSurat}</td></tr>
              <tr><td className="pr-2 align-top">Lamp</td><td className="pr-2 align-top">:</td><td>3 (tiga) halaman</td></tr>
              <tr><td className="pr-2 align-top">Hal</td><td className="pr-2 align-top">:</td><td>Penawaran Legalitas Perusahaan</td></tr>
              <tr><td className="pr-2 align-top">Rev</td><td className="pr-2 align-top">:</td><td>01</td></tr>
              <tr><td className="pr-2 align-top">Sales</td><td className="pr-2 align-top">:</td><td>{quotationData.sales}</td></tr>
            </tbody>
          </table>

          <div className="text-[12px] mb-4 leading-relaxed">
            <p>Kepada Yth,</p>
            <p className="font-bold">{quotationData.namaPerusahaan}</p>
            <p>Up. {quotationData.namaPic} - {quotationData.noTelpPic}</p>
          </div>

          <div className="text-[12px] mb-3 leading-relaxed text-justify">
            <p>Dengan Hormat,</p>
            <p className="mt-2">Menindaklanjuti pembicaraan sebelumnya mengenai adanya kebutuhan untuk pengurusan Legalitas Perusahaan, maka Kami bermaksud mengajukan penawaran harga jasa dimaksud.</p>
            <p className="mt-2">Berikut penawaran harga jasa pengerjaan dari Kami :</p>
          </div>

          {/* Dynamic Table */}
          <table className="w-full text-[12px] border-collapse border border-gray-700 mb-3">
            <thead>
              <tr className="bg-gray-100 font-bold text-center">
                <th className="border border-gray-700 py-1.5 w-8">No</th>
                <th className="border border-gray-700 py-1.5">Item</th>
                <th className="border border-gray-700 py-1.5">Keterangan</th>
                <th className="border border-gray-700 py-1.5 w-10">QTY</th>
                <th className="border border-gray-700 py-1.5 w-28">Harga</th>
                <th className="border border-gray-700 py-1.5 w-28">Sub Total</th>
              </tr>
            </thead>
            <tbody>
              {quotationData.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="border border-gray-700 py-1.5 text-center">{idx + 1}</td>
                  <td className="border border-gray-700 py-1.5 px-2">{item.nama_produk}</td>
                  <td className="border border-gray-700 py-1.5 px-2 text-[11px]">{item.keterangan}</td>
                  <td className="border border-gray-700 py-1.5 text-center">{item.qty}</td>
                  <td className="border border-gray-700 py-1.5 px-2 text-right">{formatRupiah(item.harga_jual)}</td>
                  <td className="border border-gray-700 py-1.5 px-2 text-right">{formatRupiah(item.sub_total)}</td>
                </tr>
              ))}
              {/* Empty rows */}
              {[...Array(Math.max(0, 5 - quotationData.items.length))].map((_, i) => (
                <tr key={`empty-${i}`}>
                  <td className="border border-gray-700 py-3"></td>
                  <td className="border border-gray-700"></td>
                  <td className="border border-gray-700"></td>
                  <td className="border border-gray-700"></td>
                  <td className="border border-gray-700"></td>
                  <td className="border border-gray-700"></td>
                </tr>
              ))}
              <tr className="font-bold">
                <td colSpan={5} className="border border-gray-700 py-1.5 px-2 text-right">Total</td>
                <td className="border border-gray-700 py-1.5 px-2 text-right">{formatRupiah(quotationData.total)}</td>
              </tr>
              <tr className="font-bold">
                <td colSpan={5} className="border border-gray-700 py-1.5 px-2 text-right">Diskon</td>
                <td className="border border-gray-700 py-1.5 px-2 text-right">{formatRupiah(quotationData.diskon)}</td>
              </tr>
              <tr className="font-bold bg-gray-100">
                <td colSpan={5} className="border border-gray-700 py-1.5 px-2 text-right">Grand Total</td>
                <td className="border border-gray-700 py-1.5 px-2 text-right">{formatRupiah(quotationData.grand_total)}</td>
              </tr>
            </tbody>
          </table>

          <p className="text-[12px] font-bold italic text-center mb-3">(Penawaran ini hanya berlaku selama 14 hari sampai dengan {tanggalBerlaku})</p>
          <p className="text-[12px] text-justify mb-4">Demikian hal ini Kami sampaikan dan atas perhatiannya serta kesempatan yang telah diberikan, Kami ucapkan terimakasih.</p>

          <p className="text-[12px] mb-6">Bekasi, {quotationData.tanggal}</p>

          {/* Dual Signature Block */}
          <div className="flex justify-between text-[12px] mb-4">
            {/* Esdea Signature */}
            <div className="text-center w-[45%]">
              <p className="font-bold">Esdea Assistance Management</p>
              <div className="h-[80px] flex items-center justify-center">
                <Image src="/ttd-esdea.png" alt="Tanda Tangan Esdea" width={150} height={80} className="h-[70px] w-auto object-contain" />
              </div>
              <p className="font-bold border-b border-gray-800 pb-1 inline-block">PT. Esdea Assistance Management</p>
            </div>
            
            {/* Client Signature */}
            <div className="text-center w-[45%]">
              <p className="font-bold">Menyetujui,</p>
              <div className="h-[80px] flex items-center justify-center">
                {/* Blank space for client signature */}
              </div>
              <p className="font-bold border-b border-gray-800 pb-1 inline-block">{quotationData.namaPerusahaan}</p>
            </div>
          </div>

          {/* Notes */}
          <div className="text-[11px] border-t border-gray-300 pt-3 leading-relaxed mt-auto">
            <p className="font-bold">Note :</p>
            <ul className="list-disc pl-5">
              <li>Pembayaran DP 50% setelah data awal dikirimkan &amp; dinyatakan layak proses dan pelunasan 50% setelah proses selesai.</li>
              <li>Pembayaran melalui rekening Bank Mandiri a/n PT Esdea Assistance Management 1670007013526.</li>
            </ul>
            <p className="mt-1">Cc : File Internal</p>
          </div>

          </div>{/* end content padding wrapper */}

          <PageFooter />
        </div>

        {/* ==================== PAGE 2: SEKILAS TENTANG ==================== */}
        <div className="w-[210mm] min-h-[297mm] bg-white shadow-md print:shadow-none relative box-border flex flex-col break-before-page break-after-page">
          <PageHeader />
          <div className="flex-1 flex flex-col px-[15mm] py-[6mm]">
          <h2 className="text-base font-bold text-center mb-6 mt-2">SEKILAS TENTANG PT ESDEA ASSISTANCE MANAGEMENT</h2>
          
          <div className="text-[12px] text-justify leading-loose space-y-3 flex-1">
            <p>
              PT Esdea Assistance Management berdiri sejak tahun 2023 dan kini telah mengumpulkan pengalaman yang luas dalam mengurus berbagai jenis sertifikasi dan dokumen legalitas/perizinan. Tim profesional yang berpengalaman di bidangnya menjamin bahwa setiap langkah pengurusan dilakukan dengan tingkat keahlian yang tinggi.
            </p>
            <p>
              PT Esdea Assistance Management mengutamakan kualitas dan integritas dalam setiap layanan yang diberikan, tidak hanya membantu klien dalam memenuhi persyaratan hukum yang berlaku, tetapi juga memastikan bahwa semua proses dilakukan dengan standar etika yang tinggi.
            </p>
            <p>
              Dari sertifikasi kompetensi kerja hingga pengurusan perizinan dan legalitas badan usaha, PT Esdea Assistance Management menyediakan beragam layanan yang mencakup berbagai sektor industri. Ini memungkinkan perusahaan dari berbagai bidang untuk mendapatkan bantuan yang sesuai dengan kebutuhan mereka.
            </p>
            <p>
              PT Esdea Assistance Management membangun kemitraan yang kuat dengan berbagai lembaga terkait dan asosiasi profesional. Hal ini memastikan bahwa PT Esdea Assistance Management selalu terhubung dengan perkembangan terbaru dalam regulasi dan dapat memberikan layanan yang selalu terkini dan relevan. PT Esdea Assistance Management juga merupakan mitra terpercaya bagi perusahaan-perusahaan di Indonesia dalam mengurus sertifikasi dan dokumen legalitas.
            </p>
            <p>
              Sehingga dengan komitmen pada profesionalisme, integritas dan kualitas, serta berbagai layanan unggulan yang kami tawarkan, PT Esdea Assistance Management telah membuktikan diri sebagai salah satu yang terbaik di industri ini. Jika Anda mencari solusi terbaik untuk kebutuhan sertifikasi dan legalitas/perizinan perusahaan Anda, PT Esdea Assistance Management adalah pilihan yang tepat.
            </p>
          </div>

          </div>{/* end content padding wrapper */}

          <PageFooter />
        </div>

        {/* ==================== PAGE 3: PRODUK LAYANAN ==================== */}
        <div className="w-[210mm] min-h-[297mm] bg-white shadow-md print:shadow-none relative box-border flex flex-col break-before-page break-after-page">
          <PageHeader />
          <div className="flex-1 flex flex-col px-[15mm] py-[6mm]">
          <h2 className="text-base font-bold text-center mb-6 mt-2">PRODUK LAYANAN PT ESDEA ASSISTANCE MANAGEMENT</h2>
          
          <div className="flex-1 text-[12px]">
            {/* 3-column layout matching DOCX */}
            <div className="grid grid-cols-3 gap-6">
              
              {/* Column 1: Legalitas Badan Usaha */}
              <div className="border border-gray-300 rounded-md p-4">
                <h3 className="font-bold text-center mb-3 text-[12px] pb-2 border-b border-gray-300">Legalitas Badan Usaha</h3>
                <ul className="space-y-1.5 text-[11px]">
                  <li>• Pendirian PT/CV/PMA/Yayasan</li>
                  <li>• Perubahan Akta PT/CV/PMA/Yayasan</li>
                  <li>• Buka Blokir AHU</li>
                  <li>• NIB OSS RBA</li>
                  <li>• Sertifikat Standar Terverifikasi / IUJ</li>
                  <li>• PKKPR KBLI</li>
                  <li>• Penyampaian LKPM</li>
                  <li>• Akuntan Publik (Audit Keuangan)</li>
                  <li>• Lapor Pajak Bulanan/Tahunan</li>
                </ul>
              </div>

              {/* Column 2: Sertifikasi Perusahaan */}
              <div className="border border-gray-300 rounded-md p-4">
                <h3 className="font-bold text-center mb-3 text-[12px] pb-2 border-b border-gray-300">Sertifikasi Perusahaan</h3>
                <ul className="space-y-1.5 text-[11px]">
                  <li>• Sertifikat Badan Usaha (SBU)
                    <br/><span className="pl-2">- SBU Jasa Konstruksi</span>
                    <br/><span className="pl-2">- SBU Jasa Konsultan</span>
                    <br/><span className="pl-2">- SBU JPTL / DJK ESDM</span>
                    <br/><span className="pl-2">- SBU KADIN</span>
                  </li>
                  <li>• ISO (Lokal, Akreditasi IAS / IAF / UAF / KAN) 9001, 14001, 45001, 37001, 27001, 22001</li>
                  <li>• Manual Mutu (9001 QMS, 14001 EMS, 45001 OHSAS, 37001 ABMS)</li>
                  <li>• SNI, TKDN, Halal, BPOM</li>
                  <li>• SKUP MIGAS</li>
                  <li>• INU, COI, PLO MIGAS</li>
                  <li>• Penyusunan Dokumen CSMS</li>
                  <li>• SMK3</li>
                  <li>• PBG (IMB), SLF</li>
                  <li>• Riksa Uji Alat</li>
                  <li>• SLO ESDM</li>
                </ul>
              </div>

              {/* Column 3: Sertifikasi Personil */}
              <div className="border border-gray-300 rounded-md p-4">
                <h3 className="font-bold text-center mb-3 text-[12px] pb-2 border-b border-gray-300">Sertifikasi Personil</h3>
                <ul className="space-y-1.5 text-[11px]">
                  <li>• SKK (Jenjang 1-9)</li>
                  <li>• SKK Tata Lingkungan</li>
                  <li>• SKK Arsitek Landscape</li>
                  <li>• SERKOM DJK ESDM (Level 2-6)</li>
                  <li>• Ahli K3 Umum</li>
                  <li>• Ahli K3 Listrik</li>
                  <li>• Operator K3 Listrik</li>
                  <li>• Auditor SMK3</li>
                  <li>• Supervisor K3 Konstruksi</li>
                  <li>• Ahli K3 Konstruksi</li>
                  <li>• Ahli K3 Bekerja di Ketinggian</li>
                  <li>• Ahli K3 Ruang Terbatas</li>
                  <li>• Teknisi K3 Ruang Terbatas</li>
                  <li>• POP / POM / POU</li>
                  <li>• Operator K3 MIGAS</li>
                  <li>• Pengawas K3 MIGAS</li>
                  <li>• Pengawas Utama K3 Industri MIGAS</li>
                  <li>• Ahli K3 Pertambangan</li>
                  <li>• Sertifikat Welder / Juru Las</li>
                  <li>• Sertifikat WPS, PQR</li>
                </ul>
              </div>
            </div>

            {/* Free Konsultasi Banner */}
            <div className="bg-gray-900 text-white py-6 px-8 rounded-md text-center mt-8">
              <h2 className="text-xl font-bold mb-1">FREE KONSULTASI</h2>
              <p className="text-sm">Kami Akan Bantu Selesaikan Kebutuhan Anda Menjadi<br/>Lebih Mudah, Cepat dan Aman</p>
            </div>
          </div>

          </div>{/* end content padding wrapper */}

          <PageFooter />
        </div>

        {/* ==================== PAGE 4: MITRA DAN CLIENT ==================== */}
        <div className="w-[210mm] min-h-[297mm] bg-white shadow-md print:shadow-none relative box-border flex flex-col break-before-page">
          <PageHeader />
          <div className="flex-1 flex flex-col px-[15mm] py-[6mm]">
          <h2 className="text-base font-bold text-center mb-8 mt-2">MITRA DAN CLIENT KAMI</h2>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="grid grid-cols-3 gap-6 w-full max-w-[160mm]">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="aspect-[3/2] bg-white border border-gray-200 rounded-md flex items-center justify-center p-2">
                  <img src={`/images/clients/logo-client-${i + 1}.png`} alt={`Client ${i + 1}`} className="max-w-full max-h-full object-contain" />
                </div>
              ))}
            </div>
          </div>

          </div>{/* end content padding wrapper */}

          <PageFooter />
        </div>

      </div>
    </div>
  );
}
