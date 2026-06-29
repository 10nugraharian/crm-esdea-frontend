"use client";

import React, { useState, useMemo } from "react";
import { 
  Key, Lock, LogOut, ShieldAlert, Search, Filter, 
  UserPlus, Edit2, LayoutDashboard, FileSpreadsheet, 
  FileUp, Network, FileText, CheckCircle, Banknote, 
  FileDown, Briefcase, Coins, UsersRound, AlertCircle, 
  X, HelpCircle 
} from "lucide-react";

interface Guide {
  id: number;
  category: string;
  title: string;
  icon: React.ElementType;
  content: React.ReactNode;
}

export default function PanduanPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);

  const guides: Guide[] = [
    // Akun & Keamanan
    {
      id: 1, category: "Akun & Keamanan", title: "Login Aplikasi", icon: Key,
      content: (
        <div className="space-y-3">
          <p>Fitur ini digunakan untuk mengakses dasbor utama aplikasi sesuai dengan hak akses Anda.</p>
          <p className="font-semibold text-gray-800 mt-2">Langkah-langkah praktis:</p>
          <ol className="list-decimal pl-5 space-y-1 text-gray-700">
            <li>Buka halaman login aplikasi CRM ESDEA di peramban (browser) Anda.</li>
            <li>Ketikkan <strong>Alamat Email</strong> yang telah didaftarkan oleh Administrator.</li>
            <li>Masukkan <strong>Kata Sandi (Password)</strong> Anda dengan benar.</li>
            <li>Klik tombol <strong>Masuk / Sign In</strong> untuk masuk ke Dasbor.</li>
          </ol>
        </div>
      )
    },
    {
      id: 2, category: "Akun & Keamanan", title: "Lupa Password", icon: Lock,
      content: (
        <div className="space-y-3">
          <p>Jika Anda lupa kata sandi, ikuti langkah berikut untuk meresetnya tanpa bantuan Admin.</p>
          <p className="font-semibold text-gray-800 mt-2">Langkah-langkah praktis:</p>
          <ol className="list-decimal pl-5 space-y-1 text-gray-700">
            <li>Di halaman Login, klik tautan <strong>"Lupa Password?"</strong> di bawah form kata sandi.</li>
            <li>Sistem akan meminta Anda memasukkan email yang terdaftar.</li>
            <li>Periksa kotak masuk (Inbox) email Anda dan cari email dari ESDEA.</li>
            <li>Klik tombol <strong>Reset Password</strong> di dalam email tersebut.</li>
            <li>Masukkan kata sandi baru Anda dan simpan.</li>
          </ol>
        </div>
      )
    },
    {
      id: 3, category: "Akun & Keamanan", title: "Sign Out (Logout)", icon: LogOut,
      content: (
        <div className="space-y-3">
          <p>Sangat disarankan untuk selalu keluar (logout) jika Anda menggunakan komputer publik.</p>
          <p className="font-semibold text-gray-800 mt-2">Langkah-langkah praktis:</p>
          <ol className="list-decimal pl-5 space-y-1 text-gray-700">
            <li>Di halaman manapun, lihat ke sudut <strong>Kanan Atas</strong> layar Anda.</li>
            <li>Klik pada <strong>Ikon Profil / Nama Anda</strong> untuk membuka menu _dropdown_.</li>
            <li>Pilih dan klik menu <strong>Sign Out (Keluar)</strong>.</li>
            <li>Anda akan dikembalikan secara aman ke halaman Login.</li>
          </ol>
        </div>
      )
    },
    {
      id: 4, category: "Akun & Keamanan", title: "Pengaturan Hak Akses", icon: ShieldAlert,
      content: (
        <div className="space-y-3">
          <p>Admin memiliki kontrol penuh atas apa yang bisa dilihat oleh staf lain.</p>
          <p className="font-semibold text-gray-800 mt-2">Langkah-langkah praktis (Hanya untuk Admin):</p>
          <ol className="list-decimal pl-5 space-y-1 text-gray-700">
            <li>Masuk ke menu navigasi <strong>Hak Akses</strong> di panel kiri.</li>
            <li>Pilih grup pengguna (Sales, SSO, Finance, atau BOD).</li>
            <li>Beri centang (checklist) pada modul atau fitur yang diizinkan (misal: <em>Export Leads, View All Finance</em>).</li>
            <li>Klik <strong>Simpan Perubahan</strong>. Pengguna terkait akan otomatis menerima pembaruan akses.</li>
          </ol>
        </div>
      )
    },
    
    // Navigasi & Pencarian
    {
      id: 5, category: "Navigasi & Pencarian", title: "Global Search", icon: Search,
      content: (
        <div className="space-y-3">
          <p>Cari data klien atau dokumen secara instan dari halaman mana saja.</p>
          <p className="font-semibold text-gray-800 mt-2">Langkah-langkah praktis:</p>
          <ol className="list-decimal pl-5 space-y-1 text-gray-700">
            <li>Klik pada <strong>Kolom Pencarian (Search Bar)</strong> di baris paling atas layar.</li>
            <li>Ketikkan kata kunci, seperti <em>Nama Perusahaan</em> (contoh: PT. Maju), <em>Nomor Quotation</em>, atau <em>Nama PIC</em>.</li>
            <li>Tekan <strong>Enter</strong>. Hasil akan muncul di bawah layar secara instan.</li>
            <li>Klik hasil pencarian untuk langsung melompat ke detail data tersebut.</li>
          </ol>
        </div>
      )
    },
    {
      id: 6, category: "Navigasi & Pencarian", title: "Penggunaan Filter Data", icon: Filter,
      content: (
        <div className="space-y-3">
          <p>Fitur filter ini berguna untuk menampilkan laporan sesuai rentang waktu spesifik (Mingguan, Bulanan, dll).</p>
          <p className="font-semibold text-gray-800 mt-2">Langkah-langkah praktis:</p>
          <ol className="list-decimal pl-5 space-y-1 text-gray-700">
            <li>Buka halaman yang memiliki daftar data (misal: Dasbor atau Invoices).</li>
            <li>Temukan tombol dropdown <strong>Filter Waktu</strong> di pojok kanan atas.</li>
            <li>Pilih prasetel cepat seperti: <em>Hari Ini, Minggu Ini, Bulan Ini</em>.</li>
            <li>Untuk tanggal spesifik, pilih <strong>Custom Range</strong>, lalu masukkan <em>Tanggal Mulai</em> dan <em>Tanggal Selesai</em>.</li>
            <li>Grafik dan tabel akan secara otomatis memperbarui angkanya sesuai pilihan Anda.</li>
          </ol>
        </div>
      )
    },

    // Manajemen Leads
    {
      id: 7, category: "Manajemen Leads", title: "Tambah Data Leads", icon: UserPlus,
      content: (
        <div className="space-y-3">
          <p>Setiap prospek baru harus diinput agar riwayat komunikasi tercatat rapi.</p>
          <p className="font-semibold text-gray-800 mt-2">Langkah-langkah praktis:</p>
          <ol className="list-decimal pl-5 space-y-1 text-gray-700">
            <li>Klik menu <strong>Leads</strong> di bar kiri.</li>
            <li>Klik tombol <strong>+ Tambah Lead</strong> berwarna biru di kanan atas.</li>
            <li>Formulir akan muncul. Isi nama perusahaan, bidang usaha, PIC, dan nomor HP/WhatsApp.</li>
            <li>Klik <strong>Simpan</strong>. Kartu lead baru akan muncul di kolom Kanban "New Leads".</li>
          </ol>
        </div>
      )
    },
    {
      id: 8, category: "Manajemen Leads", title: "Edit Data Leads", icon: Edit2,
      content: (
        <div className="space-y-3">
          <p>Data lead seringkali perlu diperbarui ketika klien memberikan informasi tambahan.</p>
          <p className="font-semibold text-gray-800 mt-2">Langkah-langkah praktis:</p>
          <ol className="list-decimal pl-5 space-y-1 text-gray-700">
            <li>Di halaman <strong>Leads</strong>, klik kartu/baris perusahaan klien yang ingin diubah.</li>
            <li>Modal pop-up detail akan terbuka. Klik tombol <strong>Edit Leads</strong>.</li>
            <li>Perbarui data (misalnya: mengganti nomor telepon atau menambahkan catatan minat).</li>
            <li>Klik tombol <strong>Simpan Perubahan</strong>.</li>
          </ol>
        </div>
      )
    },
    {
      id: 9, category: "Manajemen Leads", title: "Merubah Status Leads", icon: LayoutDashboard,
      content: (
        <div className="space-y-3">
          <p>Papan Kanban adalah jantung operasional Sales. Anda memindahkan klien sesuai sejauh mana negosiasi berjalan.</p>
          <p className="font-semibold text-gray-800 mt-2">Langkah-langkah praktis (Drag & Drop):</p>
          <ol className="list-decimal pl-5 space-y-1 text-gray-700">
            <li>Buka halaman <strong>Leads</strong> (pastikan tampilan berada di mode Kanban, bukan Tabel).</li>
            <li>Arahkan kursor ke salah satu kartu klien. Klik dan <strong>Tahan (Hold)</strong> tombol kiri mouse Anda.</li>
            <li>Geser/seret (Drag) kartu tersebut ke kolom selanjutnya:</li>
            <ul className="list-disc pl-5 my-1 text-sm text-gray-600">
              <li><strong>Contacted:</strong> Jika Anda sudah menyapa mereka.</li>
              <li><strong>Response:</strong> Jika klien membalas dan tertarik.</li>
              <li><strong>Quotation:</strong> Jika surat penawaran sudah terkirim.</li>
              <li><strong className="text-green-600">Close Won:</strong> Deal / Berhasil bayar!</li>
              <li><strong className="text-red-600">Close Lost:</strong> Batal / Gagal.</li>
            </ul>
            <li>Lepaskan (Drop) mouse. Sistem otomatis menyimpan status baru.</li>
          </ol>
        </div>
      )
    },
    {
      id: 10, category: "Manajemen Leads", title: "Export Excel Leads", icon: FileSpreadsheet,
      content: (
        <div className="space-y-3">
          <p>Tarik data dari sistem menjadi file Excel untuk diolah di luar aplikasi (misal untuk presentasi bulanan).</p>
          <p className="font-semibold text-gray-800 mt-2">Langkah-langkah praktis:</p>
          <ol className="list-decimal pl-5 space-y-1 text-gray-700">
            <li>Akses menu <strong>Leads</strong>. Pastikan Anda telah mengatur filter jika hanya ingin mengekspor data tertentu.</li>
            <li>Klik tombol <strong>Export</strong> (ikon unduh/Excel).</li>
            <li>Pilih opsi format (CSV atau XLSX).</li>
            <li>File akan otomatis terunduh. Catatan: Nilai transaksi (seperti biaya <strong>Sertifikasi ISO</strong>) akan terekspor sebagai <em>angka murni</em> agar dapat langsung dijumlahkan di Excel.</li>
          </ol>
        </div>
      )
    },

    // Modul SSO
    {
      id: 11, category: "Modul SSO", title: "Import CSV/Excel", icon: FileUp,
      content: (
        <div className="space-y-3">
          <p>Memasukkan data ratusan klien secara instan tanpa perlu mengetik satu per satu (Khusus SSO).</p>
          <p className="font-semibold text-gray-800 mt-2">Langkah-langkah praktis:</p>
          <ol className="list-decimal pl-5 space-y-1 text-gray-700">
            <li>Di halaman <strong>Distribusi Leads</strong>, klik tombol <strong>Import</strong>.</li>
            <li>Unduh dahulu <em>Template Import</em> jika Anda belum memilikinya. Sesuaikan kolom di Excel Anda.</li>
            <li>Pilih file Excel/CSV dari komputer Anda dan unggah.</li>
            <li>Sistem akan memvalidasi data dan memproses penyisipan dalam *batch* (tanpa membuat browser *hang*).</li>
            <li>Notifikasi sukses akan muncul setelah selesai.</li>
          </ol>
        </div>
      )
    },
    {
      id: 12, category: "Modul SSO", title: "Distribusi Leads (Assign)", icon: Network,
      content: (
        <div className="space-y-3">
          <p>SSO bertanggung jawab membagi prospek (leads) yang masuk ke masing-masing anggota tim Sales.</p>
          <p className="font-semibold text-gray-800 mt-2">Langkah-langkah praktis:</p>
          <ol className="list-decimal pl-5 space-y-1 text-gray-700">
            <li>Buka menu <strong>Distribusi Leads</strong>.</li>
            <li>Centang kotak kecil (_checkbox_) di sebelah kiri pada satu atau banyak nama klien sekaligus (Bulk Assign).</li>
            <li>Di atas tabel, akan muncul tombol <strong>Assign Sales</strong>. Klik tombol tersebut.</li>
            <li>Pilih nama agen Sales dari daftar _dropdown_.</li>
            <li>Klik Konfirmasi. Prospek otomatis berpindah ke dasbor Sales yang ditunjuk.</li>
          </ol>
        </div>
      )
    },

    // Quotation & Invoice
    {
      id: 13, category: "Quotation & Invoice", title: "Membuat Quotation", icon: FileText,
      content: (
        <div className="space-y-3">
          <p>Sistem ini menggunakan kecerdasan automasi (Smart Quotation Builder) agar Anda tidak perlu lagi repot menghitung margin/laba secara manual.</p>
          <p className="font-semibold text-gray-800 mt-2">Langkah-langkah praktis:</p>
          <ol className="list-decimal pl-5 space-y-1 text-gray-700">
            <li>Di menu <strong>Quotations</strong>, klik <strong>+ Buat Quotation</strong>.</li>
            <li>Pilih klien (Lead) yang dituju.</li>
            <li>Tambahkan item layanan (Misalnya: <em>Sertifikasi ISO</em>). Sistem akan memunculkan "Harga Pokok" rahasia.</li>
            <li>Ketik nominal <strong>Harga Jual</strong>.</li>
            <li>Secara ajaib, aplikasi langsung mengkalkulasi dan menampilkan nilai <strong>Margin Laba</strong> (Selisih) secara _real-time_.</li>
            <li>Klik <strong>Simpan & Terbitkan</strong>.</li>
          </ol>
        </div>
      )
    },
    {
      id: 14, category: "Quotation & Invoice", title: "Approval Quotation & Invoice", icon: CheckCircle,
      content: (
        <div className="space-y-3">
          <p>Mekanisme ini dibuat untuk menjaga batas wajar negosiasi perusahaan.</p>
          <p className="font-semibold text-gray-800 mt-2">Aturan Automasi Approval:</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Saat membuat Quotation, jika Anda menaikkan (upping) margin di atas <strong>Rp 500.000</strong> dari margin batas standar, tombol "Buat" otomatis berubah menjadi <strong>Request Approval</strong>.</li>
            <li>Permintaan ini akan terkirim ke divisi Finance/BOD untuk diperiksa. Anda harus menunggu statusnya berubah menjadi <em>Approved</em> sebelum PDF bisa dicetak.</li>
            <li>Aturan yang sama berlaku jika Anda menginput kesepakatan <strong>DP di bawah 50%</strong>.</li>
          </ul>
        </div>
      )
    },
    {
      id: 15, category: "Quotation & Invoice", title: "Validasi Pembayaran", icon: Banknote,
      content: (
        <div className="space-y-3">
          <p>Fitur krusial bagi tim Finance untuk mengonfirmasi pergerakan dana klien masuk ke rekening Esdea.</p>
          <p className="font-semibold text-gray-800 mt-2">Langkah-langkah praktis:</p>
          <ol className="list-decimal pl-5 space-y-1 text-gray-700">
            <li>Pihak Finance masuk ke menu <strong>Invoices</strong>.</li>
            <li>Pilih Invoice klien yang mengirimkan bukti transfer.</li>
            <li>Klik tombol <strong>Ubah Status Pembayaran</strong>.</li>
            <li>Pilih status menjadi <strong>Paid DP</strong> (jika bayar sebagian) atau <strong>Full Paid</strong> (Lunas).</li>
            <li>Setelah divalidasi, sistem otomatis memperbolehkan proyek tersebut berjalan di modul <em>Projects</em>.</li>
          </ol>
        </div>
      )
    },
    {
      id: 16, category: "Quotation & Invoice", title: "Download Dokumen PDF", icon: FileDown,
      content: (
        <div className="space-y-3">
          <p>Kirimkan dokumen resmi yang rapi dan _high-resolution_ kepada klien.</p>
          <p className="font-semibold text-gray-800 mt-2">Langkah-langkah praktis:</p>
          <ol className="list-decimal pl-5 space-y-1 text-gray-700">
            <li>Buka halaman rincian (Preview) dari Quotation atau Invoice.</li>
            <li>Di pojok kanan atas, klik tombol berlogo mesin tik/printer bertuliskan <strong>Download PDF</strong>.</li>
            <li>Aplikasi akan me-<em>render</em> dokumen tersebut di server dan mengunduhnya ke perangkat Anda.</li>
            <li>Dokumen PDF ini sudah terjamin memakai identitas visual resmi <strong>ABADI</strong> dan dilindungi dari kerusakan format logo.</li>
          </ol>
        </div>
      )
    },

    // Operasional & Tim
    {
      id: 17, category: "Operasional & Tim", title: "Manajemen Projects & SPK", icon: Briefcase,
      content: (
        <div className="space-y-3">
          <p>Sistem ini menghubungkan transaksi pembayaran langsung ke ruang kerja eksekusi proyek vendor.</p>
          <p className="font-semibold text-gray-800 mt-2">Langkah-langkah praktis:</p>
          <ol className="list-decimal pl-5 space-y-1 text-gray-700">
            <li>Modul <strong>Projects</strong> hanya akan memunculkan proyek jika Invoicenya sudah <em>Paid DP / Full Paid</em>.</li>
            <li>Klik pada Proyek klien, lalu klik tombol <strong>Assign Vendor</strong>.</li>
            <li>Pilih mitra Vendor yang akan mengerjakan perizinan tersebut.</li>
            <li>Klik tombol <strong>Generate SPK</strong> (Surat Perintah Kerja).</li>
            <li>Anda bisa mendownload PDF SPK tersebut dan mengirimkannya ke Vendor sebagai dasar hukum pengerjaan.</li>
          </ol>
        </div>
      )
    },
    {
      id: 18, category: "Operasional & Tim", title: "Pencairan Komisi", icon: Coins,
      content: (
        <div className="space-y-3">
          <p>Sistem mencatat komisi harian secara otomatis tanpa Excel eksternal.</p>
          <p className="font-semibold text-gray-800 mt-2">Langkah-langkah praktis:</p>
          <ol className="list-decimal pl-5 space-y-1 text-gray-700">
            <li>Buka menu <strong>Komisi</strong>.</li>
            <li>Anda akan melihat rangkuman saldo Anda terbagi dalam dua kategori:</li>
            <ul className="list-disc pl-5 my-1 text-sm text-gray-600">
              <li><strong>Komisi Tetap:</strong> Bonus standar dari item layanan.</li>
              <li><strong>Refund Sales:</strong> Keuntungan ekstra dari hasil <em>Upping</em> margin (mark-up harga).</li>
            </ul>
            <li>Finance akan memproses Slip Komisi ini setiap akhir periode melalui sistem pencairan.</li>
          </ol>
        </div>
      )
    },
    {
      id: 19, category: "Operasional & Tim", title: "Daftar Tim", icon: UsersRound,
      content: (
        <div className="space-y-3">
          <p>Akses direktori kontak dan manajemen akun staf.</p>
          <p className="font-semibold text-gray-800 mt-2">Langkah-langkah praktis:</p>
          <ol className="list-decimal pl-5 space-y-1 text-gray-700">
            <li>Buka menu <strong>Tim / Users</strong> di sidebar.</li>
            <li>Admin dapat menggunakan tombol <strong>Tambah User</strong> untuk membuatkan akun pegawai baru.</li>
            <li>Di sini, Admin menentukan <em>Role</em> (Peran) seperti Sales, Leader, atau SSO, yang akan berdampak langsung ke izin akses mereka.</li>
          </ol>
        </div>
      )
    },

    // Standar Komunikasi
    {
      id: 20, category: "Standar Komunikasi", title: "Prosedur Layanan (SOP)", icon: AlertCircle,
      content: (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 text-red-900 p-4 rounded-xl shadow-sm">
            <p className="font-bold mb-2 flex items-center gap-2"><AlertCircle className="w-5 h-5"/> [ATURAN MUTLAK] - Wajib Dipatuhi Seluruh Tim</p>
            <p className="text-[15px] leading-relaxed">
              Demi menjaga profesionalitas institusi, setiap pesan, surat menyurat, maupun kolom status aplikasi <strong>WAJIB</strong> menggunakan istilah:
              <br/><br/>
              <span className="text-xl font-extrabold bg-red-100 px-3 py-1 rounded inline-block text-red-700 border border-red-300">Pengechekan Dokumen</span>
              <br/><br/>
              Sebagai staf CRM ESDEA, Anda secara ketat <strong>DILARANG</strong> menggunakan kata <em>"pelacakan"</em> saat mendeskripsikan aktivitas peninjauan atau verifikasi layanan!
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
            <h4 className="font-bold text-blue-900 mb-2">Sistem Automasi Follow-Up</h4>
            <p className="text-sm text-blue-800">
              Jangan terkejut jika sistem kadang mengirimkan WhatsApp/Email ke klien yang isinya menyertakan kalimat "Salam, Rian". Ini adalah fitur <strong>Follow-up Eksekutif</strong> otomatis yang mensimulasikan kepedulian dari pihak pimpinan kepada klien Anda untuk mempercepat keputusan <em>Deal</em>.
            </p>
          </div>
        </div>
      )
    }
  ];

  const filteredGuides = useMemo(() => {
    if (!searchQuery.trim()) return guides;
    return guides.filter(g => 
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      g.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="min-h-full bg-[#F9FAFB] p-6 md:p-10 font-sans custom-scrollbar overflow-y-auto relative">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER & SEARCH */}
        <div className="mb-10 text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 text-blue-700 rounded-xl shadow-sm mb-2">
            <HelpCircle className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Pusat Bantuan & Panduan Pengguna</h1>
          
          <div className="max-w-2xl mx-auto mt-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari panduan fitur (contoh: export, approval, reset password)..." 
              className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-[15px] bg-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* GUIDES GRID (ATOMIC CARDS) */}
        {filteredGuides.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            Pencarian tidak ditemukan. Coba gunakan kata kunci lain.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredGuides.map((guide) => {
              const Icon = guide.icon;
              return (
                <div 
                  key={guide.id}
                  onClick={() => setSelectedGuide(guide)}
                  className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center gap-3 group h-36"
                >
                  <div className="bg-gray-50 p-3 rounded-full text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <Icon className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-[13px] leading-snug group-hover:text-blue-700 transition-colors">
                    {guide.title}
                  </h3>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* MODAL POPUP */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <selectedGuide.icon className="w-5 h-5 stroke-[1.5]" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-lg leading-tight">{selectedGuide.title}</h2>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{selectedGuide.category}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedGuide(null)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="px-6 py-6 text-gray-700 text-[15px] leading-relaxed max-h-[70vh] overflow-y-auto">
              {selectedGuide.content}
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 text-right">
              <button 
                onClick={() => setSelectedGuide(null)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
