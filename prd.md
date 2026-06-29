PRODUCT REQUIREMENTS DOCUMENT (PRD)
Project Name: SaaS CRM PT. Esdea Assistance Management
Version: 1.1
Target Platform: Web Application (Prioritas Desktop/Laptop, Responsive untuk Mobile)
1. Executive Summary
Aplikasi SaaS CRM ini dibangun secara khusus untuk PT. Esdea Assistance Management guna mengatasi masalah manajemen leads, efisiensi pembuatan quotation dan penagihan, transparansi perhitungan komisi/margin (Refund Sales), serta manajemen proyek pasca-closing. Aplikasi ini mengadopsi standar UI/UX dari HubSpot untuk memberikan pengalaman pengguna yang intuitif, bersih, dan profesional.
2. User Roles & Permissions
Sistem ini menggunakan Role-Based Access Control (RBAC) dengan tingkatan sebagai berikut:
Sales: Menerima/menginput leads, memindahkan status leads, membuat quotation (dengan simulasi margin), mengajukan proforma invoice, input pembayaran.
SSO (Sales Support Officer): Mengimport leads secara massal, mendistribusikan leads ke Sales, mendapatkan komisi khusus dari leads yang close won.
Leader: Memantau aktivitas leads, performa, dan pencapaian tim Sales di bawahnya.
Manager: Memantau performa seluruh tim (lintas Leader).
Finance: Melakukan approval untuk quotation yang di luar standar (harga atas/bawah), approval Proforma Invoice dengan DP < 50%, validasi pembayaran, dan memproses pencairan komisi.
BOD (Board of Directors): Akses view-only ke level tertinggi untuk laporan dan dashboard komprehensif.
Admin: Manajemen user, pengaturan master data (layanan, harga pokok, komisi standar), dan pembuatan Template Pesan (WA/Email).
3. Application Flow (Alur Sistem)
Lead Generation & Distribution: SSO mengunggah (import) data leads dan melakukan bulk-assign kepada Sales melalui menu khusus SSO. (Sales juga dapat menambah leads mandiri).
Lead Nurturing: Sales menindaklanjuti leads dan memperbarui status (New -> Contacted -> Response). Sales menggunakan Template WA/Email yang bisa diedit sebelum dikirim.
Quotation Creation: Sales membuat Quotation. Sistem menampilkan Harga Pokok. Sales menginput Harga Jual. Margin (Refund Sales) otomatis terlihat.
Rule A: Jika harga jual >= Harga Pokok DAN upping harga <= Rp 500.000, tombol "Buat Quotation" aktif (Auto-generate).
Rule B: Jika di luar batas, tombol berubah menjadi "Request Approval" (Notifikasi/Alert masuk ke Finance).
Invoicing & Payment: Leads sepakat, Sales mengajukan Proforma Invoice.
Rule A: Jika DP >= 50%, Proforma Invoice otomatis terbit.
Rule B: Jika DP < 50%, butuh Approval Finance.
Sales input bukti pembayaran dari klien -> Finance memvalidasi -> Sistem otomatis generate Actual Invoice (DP/Pelunasan).
Project Initiation: Saat status pembayaran menjadi "Paid DP" atau "Approved Tanpa DP", data leads/invoice otomatis dikonversi masuk ke modul Project.
Vendor & SPK Management: Admin/Tim Operasional memecah proyek tersebut dan melakukan assign ke beberapa Vendor. Sistem mencetak SPK (Surat Perintah Kerja) untuk vendor terkait.
Commission Distribution: Sistem secara otomatis menghitung Refund Sales (selisih harga) + Komisi per produk untuk Sales, serta Komisi Rp 50.000 untuk SSO (jika leads berasal dari SSO).
4. Core Features
4.1. Modul SSO & Distribusi Leads
Menu Khusus SSO: Halaman Import (CSV/Excel) dengan tabel data. Terdapat Checkbox di kolom paling kiri untuk memilih banyak leads sekaligus (Bulk action) guna di-assign ke Sales tertentu.
4.2. Modul Leads (HubSpot Style View)
Tampilan: Tersedia Table View (default) dan Kanban View.
Status Pipeline (Kanban): New Leads > Contacted > Response > Quotation > Close Won > Close Lost.
Status Kualifikasi: Hot, Warm, Cold, Unqualified.
4.3. Smart Quotation Builder
Form Dinamis: Terdapat dropdown layanan. Saat dipilih, Harga Pokok muncul otomatis.
Transparansi Margin: Kolom input Harga Jual dan Qty. Sistem menampilkan prediksi kalkulasi margin (Refund Sales) secara real-time di layar agar Sales tidak bingung.
Smart Buttons: Tombol Submit menyesuaikan dengan batasan Harga Jual (Generate vs Request Approval).
4.4. Finance Alerts & Approval
Notifikasi Push dan Badge merah pada menu Finance ketika ada Quotation atau Request Proforma Invoice (DP <50%) yang membutuhkan Approval. Klik notifikasi akan langsung mengarah ke detail dokumen.
4.5. Template Komunikasi
Sistem menyimpan template copywriting WA/Email buatan Admin.
Saat Sales klik "Hubungi Leads", popup berisi template muncul dan editable sebelum diarahkan ke WhatsApp Web/Email Client.
4.6. Project & Multi-Vendor Management
Fitur memecah satu Invoice/Proyek menjadi beberapa Sub-project untuk didistribusikan ke Vendor yang berbeda-beda.
Tracking status pengerjaan vendor dan tracking pembayaran dari perusahaan ke vendor.
5. UI/UX & Design Guidelines
Tema Utama: Desain minimalis dan bersih meniru struktur HubSpot.
Warna Dasar:
Header & Sidebar Background: #33333 (Gelap).
Aksen Warna: Monokrom (Turunan lebih terang/gelap dari #33333). Tidak ada warna vibrant lain.
Main Content Background: White (#FFFFFF).
Layout & Geometri:
Header Height: 44px.
Sidebar Width: 44px (Kondisi collapsed / icon only, bisa diexpand jika di-hover).
Area Main Content: Memiliki sudut melengkung (border-radius) HANYA di bagian Kiri Atas.
Komponen Tabel (HubSpot Clone):
Fitur wajib di setiap tabel: Global Search, Advanced Filter (Hari ini, Minggu ini, Bulan ini, Custom Range).
Tombol aksi (Import CSV, Export Excel, Tambah, Edit) berada di kanan atas area tabel.
6. Database Schema (Struktur Tabel Utama)
1. Table Users/Profil
No, Edit (Action), User ID (Random 6 Digit), Nama Lengkap, Gender, Tanggal Lahir, No Rekening, Nama Bank, Nama Leader, Nama Manager, Username, Reset Password
2. Table Layanan
No, Edit, Layanan ID, Nama Layanan, Kategori, Harga Modal, Harga Pokok, Komisi Sales, Komisi Leader, Komisi Manager, Komisi SSO (Fix Rp 50.000 jika close won)
3. Table Leads
No, Edit, Tanggal Leads, Leads ID, Status Leads (New, Contacted, Response, Quotation, Close Won, Close Lost), Status (Hot, Warm, Cold, Unqualified), Nama Perusahaan, Jenis Perusahaan, Wilayah (JSON), Alamat, No Telepon, Email, Nama PIC, Kualifikasi, Subklasifikasi, Tanggal Expired, Nama Sales
4. Table Quotation
No, Edit, Tanggal Quotation, No Quotation, Nama Perusahaan, Summary Layanan (List), Total Amount, Status Approval, Action: Download, Request Proforma Invoice
5. Table Invoice
No, Edit, Tanggal Invoice, Nama Perusahaan, Summary Layanan, Total Amount, Tanggal DP, Tanggal BP, Status Pembayaran (Unpaid, Paid DP, Full Paid), Action: Download Invoice/Proforma
6. Table Komisi
Nama Sales, Nama Perusahaan, Summary Layanan, Total Refund (Selisih harga), Total Komisi (Fix Layanan), Status Komisi (Pending, Disbursed)
7. Table Project
No, Edit, Nama Perusahaan, Summary Layanan, Vendor, Tanggal SPK, No SPK, Action: Download SPK
8. Table Vendor
No, Edit, Vendor ID, Nama Perusahaan, Alamat, No Telepon, Email, Nama PIC
7. Dashboard & Reporting
Fokus KPI utama pada peluncuran pertama:
Leaderboard Revenue Closing: (Keseluruhan dan Per Team Leader)
Leaderboard Pembuatan Quotation: (Keseluruhan dan Per Team Leader)
8. Mermaid Flowchart: Alur Sistem (End-to-End)
flowchart TD
    A([Start: Leads Masuk]) --> B{Sumber Leads?}
    B -->|SSO| C[SSO Import & Bulk Assign]
    B -->|Mandiri| D[Sales Input Leads]
    
    C --> E(Status: New Leads)
    D --> E
    
    E --> F[Sales Nurturing & Follow Up]
    F -->|Update Status| G(Contacted / Response)
    
    G --> H[Sales Buat Quotation]
    H --> I{Sesuai Batas Harga?}
    
    I -->|Ya: Margin Sesuai| J[Auto-Generate Quotation]
    I -->|Tidak: Upping >500rb| K[Request Approval Finance]
    
    K --> L{Finance Approval}
    L -->|Rejected| H
    L -->|Approved| J
    
    J --> M[Kirim ke Leads]
    M --> N{Leads Deal?}
    
    N -->|No| O(Status: Close Lost)
    N -->|Yes| P[Sales Request Proforma Invoice]
    
    P --> Q{DP >= 50% ?}
    Q -->|Ya| R[Auto-Generate Proforma Invoice]
    Q -->|Tidak| S[Approval Finance]
    S -->|Approved| R
    S -->|Rejected| P
    
    R --> T[Klien Membayar & Sales Input Bukti]
    T --> U[Finance Validasi]
    U --> V(Generate Invoice - Status: Paid DP/Full)
    
    V --> W((Masuk Modul Project))
    V --> X((Hitung Komisi & Refund Sales))
    
    W --> Y[Pecah Project & Assign Vendor]
    Y --> Z(Generate SPK Vendor)


9. UI/UX Wireframe & Layout Architecture
Berikut adalah ilustrasi tata letak (wireframe) berbasis ASCII yang merepresentasikan permintaan UI/UX bergaya HubSpot dengan spesifikasi geometri warna dan lekukan (rounded corner).
================================================================================
[ 44px HEADER - BG: #33333 ]   Logo Esdea    [Global Search]       [Profile/BOD]
================================================================================
[ 44px ] .=====================================================================.
[ SIDE ] | [MAIN CONTENT AREA - BG: #FFFFFF]                                   |
[ BAR  ] |                                                                     |
[      ] |   Dashboard / Table View Leads                                      |
[ BG:  ] |   ---------------------------------------------------------------   |
[ #33  ] |   [ + Tambah Lead ] [ Import CSV ] [ Export Excel ]                 |
[ 333  ] |                                                                     |
[      ] |   Filter: [ Hari Ini | Minggu Ini | Bulan Ini | Custom Range ]      |
[ Icon ] |                                                                     |
[ Only ] |   +-------------------------------------------------------------+   |
[      ] |   | No | Nama Perusahaan | Status    | Margin | Action          |   |
[ Hover] |   |----|-----------------|-----------|--------|-----------------|   |
[ To   ] |   | 1  | PT. Tambang A   | Close Won | 500k   | [Edit] [View]   |   |
[ Open ] |   | 2  | PT. Migas B     | Quotation | 200k   | [Edit] [View]   |   |
[      ] |   +-------------------------------------------------------------+   |
[      ] |                                                                     |
[      ] | * Catatan Desain:                                                   |
[      ] | - Sudut Kiri Atas konten berwarna putih INI dibuat melengkung       |
[      ] |   (border-top-left-radius: 12px/16px) menimpa background utama.     |
[      ] | - Akses warna action button menggunakan gradasi abu/monokrom #333.  |
[      ] | - Data tabel mendukung Advanced Search persis HubSpot.              |
================================================================================













Frontend Implementation Plan: UI & Navigation
Project: SaaS CRM PT. Esdea Assistance Management
Dokumen ini merinci rencana pengembangan frontend, berfokus pada arsitektur antarmuka, struktur navigasi, dan prioritas implementasi halaman.
1. UI Architecture & Styling Rules
Sesuai dengan guidelines, frontend akan dibangun dengan kerangka kerja (misalnya React.js / Next.js) dikombinasikan dengan Tailwind CSS untuk mempercepat penyesuaian gaya (styling) yang sangat spesifik.
Global CSS Variables & Layout Rules:
Header Height: 44px (Fix, lengket di atas / sticky).
Sidebar Width: 44px (Kondisi collapsed). Jika di-hover, memanjang menjadi 240px menimpa (overlay) atau mendorong konten.
Primary Color (Dark): #33333 (Digunakan untuk background Header, Sidebar, dan elemen teks utama).
Main Content Area: Berwarna putih (#FFFFFF) dengan lengkungan di kiri atas (border-top-left-radius: 20px). Area ini berada tepat di bawah Header dan di sebelah kanan Sidebar.
Typography: Menggunakan font Sans-Serif modern dan bersih (seperti Inter atau Lexend yang mirip dengan gaya HubSpot).
Components: Tabel, tombol, form input, dan filter meniru presisi padding, margin, dan gaya border HubSpot.
2. Mermaid Flowchart: Navigation & Sitemap
Berikut adalah peta navigasi (Sitemap) yang menunjukkan bagaimana pengguna bergerak di dalam aplikasi setelah Login.
graph TD
    A[Login Screen] -->|Authentication| B[Main Layout Shell]
    B --> C[Dashboard]
    C --> C1(Leaderboard Revenue)
    C --> C2(Leaderboard Quotation)
    
    B --> D[Leads Module]
    D --> D1(Table View & Filters)
    D --> D2(Kanban Board View)
    D --> D3(Detail Lead & Activity History)
    
    B --> E[Quotation Module]
    E --> E1(List Quotations)
    E --> E2(Smart Quotation Builder)
    
    B --> F[Finance & Invoicing]
    F --> F1(List Invoices)
    F --> F2(Approval Finance / Alert)
    F --> F3(Input Pembayaran)
    
    B --> G[Post-Sales / Operation]
    G --> G1(Project Board)
    G --> G2(Vendor Management)
    
    B --> H[Commissions]
    H --> H1(Refund Sales & SSO Commission)
    
    B --> I[Admin & Master Data]
    I --> I1(User & Roles Management)
    I --> I2(Master Layanan & Harga Pokok)
    I --> I3(Template Pesan WA/Email)


3. UI/UX ASCII Wireframes
Wireframe A: Global Layout & Dashboard
Menggambarkan aturan 44px dan lengkungan konten utama.
==================================================================================
[ 44px H | BG: #33333 ] (Logo)      [ Global Search Bar ]      [ Alert ] [ Profile ]
==================================================================================
[ 44px ] .=======================================================================.
[ W    ] | [MAIN CONTENT AREA - BG: #FFFFFF]                                     |
[ S    ] |                                                                       |
[ I    ] |   Dashboard > Leaderboard                                             |
[ D    ] |   -----------------------------------------------------------------   |
[ E    ] |   [ Range: Bulan Ini v ]                                              |
[ B    ] |                                                                       |
[ A    ] |   +---------------------------------+ +-----------------------------+ |
[ R    ] |   | REVENUE CLOSING (TEAM A)        | | QUOTATION CREATED           | |
[      ] |   | 1. Budi Sales     Rp 50.000.000 | | 1. Budi Sales     15 Quotes | |
[ B    ] |   | 2. Andi Sales     Rp 30.000.000 | | 2. Siti Sales     12 Quotes | |
[ G    ] |   | 3. Siti Sales     Rp 25.000.000 | | 3. Andi Sales      8 Quotes | |
[ :    ] |   +---------------------------------+ +-----------------------------+ |
[ #33  ] |                                                                       |
[ 333  ] | * Note: Ujung kiri atas area putih ini memiliki border-radius (melengkung)
==================================================================================


Wireframe B: Modul Leads (Kanban View)
Menampilkan transisi antar status leads.
==================================================================================
[ HEADER AREA #33333 ] 
==================================================================================
[ SIDE ] .=======================================================================.
[ BAR  ] | Leads > Kanban View                                                   |
[      ] | --------------------------------------------------------------------- |
[      ] | [ View: Kanban v ]  [ Filter: My Leads v ]       [ + Tambah Lead ]    |
[      ] |                                                                       |
[      ] |  [ NEW LEADS (2) ]  [ CONTACTED (1) ]  [ QUOTATION (1) ]  [ WON (0) ] |
[      ] |  +---------------+  +---------------+  +---------------+  +---------+ |
[      ] |  | PT. Alpha     |  | PT. Gamma     |  | PT. Delta     |  |         | |
[      ] |  | Hot           |  | Warm          |  | Rp 15.000.000 |  |         | |
[      ] |  | Sales: Budi   |  | Sales: Budi   |  | Pending Apprv |  |         | |
[      ] |  +---------------+  +---------------+  +---------------+  +---------+ |
[      ] |  +---------------+                                                    |
[      ] |  | PT. Beta      |                                                    |
[      ] |  | Cold          |                                                    |
[      ] |  +---------------+                                                    |
==================================================================================


Wireframe C: Smart Quotation Builder
Fokus pada transparansi margin/refund sales untuk Sales.
==================================================================================
[ HEADER AREA #33333 ] 
==================================================================================
[ SIDE ] .=======================================================================.
[ BAR  ] | Buat Quotation Baru                                                   |
[      ] | --------------------------------------------------------------------- |
[      ] | Client: [ Pilih Leads: PT. Alpha v ]                                  |
[      ] |                                                                       |
[      ] | Rincian Layanan:                                                      |
[      ] | +-------------------------------------------------------------------+ |
[      ] | | Layanan          | Qty | Harga Pokok | Harga Jual   | Margin/Refund | |
[      ] | |------------------|-----|-------------|--------------|---------------| |
[      ] | | [ Konsultasi v ] | [1] | Rp 2.000.000| [Rp 2.400.000] | + Rp 400.000  | |
[      ] | +-------------------------------------------------------------------+ |
[      ] | [ + Tambah Layanan ]                                                  |
[      ] |                                                                       |
[      ] | Info Rule:                                                            |
[      ] | (i) Margin Rp 400.000 masih dalam batas aman (Maks Upping Rp 500.000) |
[      ] |                                                                       |
[      ] |                                   [ Batal ] [ BUAT QUOTATION (Auto) ] |
==================================================================================


4. Frontend Development Phases (Action Plan)
Untuk membangun sistem ini secara efisien, pengerjaan frontend akan dibagi menjadi beberapa fase (Sprint):
Phase 1: Foundation & Layouting (Minggu 1)
Setup repository dan konfigurasi Tailwind CSS.
Membangun komponen dasar: Header (44px), Sidebar Collapsible (44px), dan Main Layout dengan lengkungan kiri atas.
Membangun UI Components (HubSpot-style): Buttons, Inputs, Select Dropdowns, Modal/Dialogs.
Phase 2: Data Tables & Master Data (Minggu 2)
Membangun komponen Data Table universal (mendukung Search, Pagination, dan desain selaras).
Implementasi halaman Master Data (Users, Layanan, Vendor).
Phase 3: Core CRM - Leads & Kanban (Minggu 3)
Implementasi halaman Leads (Table View).
Implementasi fitur Advanced Filter (Hari ini, Minggu ini, Custom Range).
Membangun Kanban Board dengan fitur Drag & Drop untuk memindahkan kartu leads antar kolom status.
Phase 4: Quotation & Invoicing (Minggu 4)
Membangun form dinamis Smart Quotation Builder beserta logika frontend kalkulasi margin secara real-time.
Implementasi alert/indikator visual jika harga di atas batas (tombol berubah menjadi "Request Approval").
Halaman tabel Invoices dan Modal validasi pembayaran.
Phase 5: Post-Sales & Dashboards (Minggu 5)
Halaman Manajemen Project & pembuatan SPK Vendor.
Pembuatan grafik dan Leaderboard di halaman Dashboard.
Finishing & Cross-browser/Mobile responsiveness testing.
















Backend Implementation Plan: Database & API Endpoints
Project: SaaS CRM PT. Esdea Assistance Management
Dokumen ini mendefinisikan arsitektur backend, berfokus pada desain relasi basis data (Entity Relationship Diagram) dan daftar spesifikasi API Endpoints yang akan dikonsumsi oleh Frontend.
1. Tech Stack Recommendation
Language & Framework: Node.js (Express/NestJS) atau Python (Django/FastAPI) atau Go. (Pilih sesuai keahlian tim).
Database: PostgreSQL (Direkomendasikan untuk integritas data finansial/transaksi).
Authentication: JSON Web Tokens (JWT) dengan Role-Based Access Control (RBAC).
2. Database Schema (Mermaid ERD)
Berikut adalah Entity Relationship Diagram (ERD) yang menggambarkan bagaimana tabel-tabel saling terhubung.
erDiagram
    USERS ||--o{ LEADS : "assigned to (Sales)"
    USERS ||--o{ LEADS : "imported by (SSO)"
    USERS {
        uuid id PK
        string role "Enum: Sales, SSO, Leader, Manager, Finance, BOD, Admin"
        string nama_lengkap
        string user_id "6 digit random"
        string no_rekening
        string nama_bank
        uuid leader_id FK "Self-referencing"
    }

    LAYANAN ||--o{ QUOTATION_ITEMS : "included in"
    LAYANAN {
        uuid id PK
        string nama_layanan
        decimal harga_modal
        decimal harga_pokok
        decimal komisi_sales
        decimal komisi_sso "Fix 50.000"
    }

    LEADS ||--o{ QUOTATIONS : "has"
    LEADS {
        uuid id PK
        uuid sales_id FK
        uuid sso_id FK
        string status_leads "Enum: New, Contacted, Response, Quotation, Won, Lost"
        string kualifikasi "Enum: Hot, Warm, Cold, Unqualified"
        string nama_perusahaan
        json wilayah "Provinsi & Kota"
    }

    QUOTATIONS ||--o{ QUOTATION_ITEMS : "contains"
    QUOTATIONS ||--o| INVOICES : "generates"
    QUOTATIONS {
        uuid id PK
        uuid lead_id FK
        uuid sales_id FK
        string no_quotation
        decimal total_amount
        string status_approval "Enum: Approved, Pending_Finance, Rejected"
    }

    QUOTATION_ITEMS {
        uuid id PK
        uuid quotation_id FK
        uuid layanan_id FK
        int qty
        decimal harga_jual_input
        decimal refund_sales_margin "Kalkulasi: Harga Jual - Harga Pokok"
    }

    INVOICES ||--o| PROJECTS : "converts to"
    INVOICES ||--o{ KOMISI : "triggers"
    INVOICES {
        uuid id PK
        uuid quotation_id FK
        decimal total_amount
        decimal persentase_dp
        string status_pembayaran "Enum: Unpaid, Paid_DP, Full_Paid"
        string status_approval "Enum: Approved, Pending_Finance (if DP < 50%)"
    }

    PROJECTS ||--o{ SPK : "divided into"
    PROJECTS {
        uuid id PK
        uuid invoice_id FK
        string nama_project
        string status
    }

    VENDORS ||--o{ SPK : "receives"
    VENDORS {
        uuid id PK
        string nama_vendor
        string kontak
    }

    SPK {
        uuid id PK
        uuid project_id FK
        uuid vendor_id FK
        string no_spk
        decimal nilai_pekerjaan
    }

    KOMISI {
        uuid id PK
        uuid sales_id FK
        uuid invoice_id FK
        decimal total_refund_sales
        decimal total_komisi_fix
        string status_pencairan "Enum: Pending, Disbursed"
    }


3. Core API Endpoints
Semua endpoint dilindungi oleh middleware Autentikasi (JWT) yang akan mengecek Role pengguna. Base URL: /api/v1
3.1. Authentication & Users
POST /auth/login
Body: username, password
Response: JWT Token, User Data & Role.
GET /users (Role: Admin)
Query: role, search
Response: List of users.
3.2. Leads & SSO Bulk Actions
GET /leads
Query: status, date_range, sales_id.
Rule: Sales hanya melihat leads-nya. Leader melihat leads timnya. Manager/BOD melihat semua.
POST /leads
Body: Data perusahaan, PIC, Kualifikasi.
PUT /leads/:id/status
Body: status_leads (Untuk memindahkan kartu di Kanban view).
POST /leads/bulk-import (Role: SSO)
Body: File CSV/Excel.
POST /leads/bulk-assign (Role: SSO)
Body: lead_ids (Array), sales_id. Men-trigger notifikasi ke Sales.
3.3. Quotation Builder & Logic
GET /layanan
Mengambil daftar layanan beserta harga_pokok untuk dropdown di form.
POST /quotations (Role: Sales)
Body: lead_id, items: [{layanan_id, qty, harga_jual}]
Backend Logic:
Loop items, ambil harga_pokok dari DB.
Cek batasan: (harga_jual >= harga_pokok) AND (harga_jual - harga_pokok <= 500000).
Jika sesuai batas: Set status_approval = Approved. Return URL PDF.
Jika di luar batas: Set status_approval = Pending_Finance. Trigger Notifikasi ke Finance.
PUT /quotations/:id/approve (Role: Finance)
Body: status (Approved/Rejected), notes.
3.4. Invoicing & Finance
POST /invoices/request-proforma (Role: Sales)
Body: quotation_id, persentase_dp.
Backend Logic: Jika persentase_dp >= 50, auto-approve. Jika < 50, set Pending_Finance.
PUT /invoices/:id/validate-payment (Role: Finance)
Body: amount_paid, bukti_transfer.
Backend Logic: Jika valid dan status menjadi Paid_DP atau Full_Paid, sistem otomatis:
Men-generate data di tabel PROJECTS.
Men-generate kalkulasi di tabel KOMISI untuk Sales (dan SSO jika lead dari SSO).
3.5. Project & Vendor Management
GET /projects
Menampilkan data project hasil dari invoice yang sudah dibayar.
POST /projects/:id/spk (Role: Admin/Ops)
Body: vendor_id, nilai_pekerjaan, detail_pekerjaan.
Response: Generate No SPK dan dokumen SPK.
3.6. Dashboard & Reporting
GET /reports/leaderboard/revenue
Query: timeframe (today, this_week, this_month), group_by (sales, leader).
Logic: Sum(total_amount) dari INVOICES yang berstatus Full_Paid atau Paid_DP, di-join ke tabel Users.
GET /reports/leaderboard/quotation
Query: timeframe.
Logic: Count(id) dari QUOTATIONS yang dibuat, di-grouping berdasarkan Sales/Leader.
4. Background Jobs & Automation (Cron/Workers)
Notifikasi Expired Leads: Job harian untuk mengecek tanggal_expired pada tabel LEADS. Jika sisa 1 hari atau sudah lewat, kirim alert ke Sales terkait.
PDF Generator Service: Fungsi terpisah (misalnya menggunakan Puppeteer atau PDFKit) untuk membuat dokumen Quotation, Invoice, dan SPK secara on-the-fly ketika diminta, mencegah penyimpanan file statis berlebihan.


