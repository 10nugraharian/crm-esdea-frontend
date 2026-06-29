"use client";

import React, { useState, useEffect } from "react";
import { 
  Trophy,
  Medal,
  Award,
  TrendingUp,
  FileText,
  DollarSign,
  ChevronDown,
  Calendar,
  Users,
  PhoneCall,
  MessageCircle,
  FileText as FileTextIcon,
  CheckCircle2,
  BookOpen,
  ShieldCheck,
  GraduationCap
} from "lucide-react";
import { fetchApi } from "@/lib/api";

type TimeFilter = "hari_ini" | "minggu_ini" | "bulan_ini" | "kustom";

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);

const getRankIcon = (index: number) => {
  if (index === 0) return <Trophy className="w-5 h-5 text-yellow-500" />;
  if (index === 1) return <Medal className="w-5 h-5 text-gray-400" />;
  if (index === 2) return <Award className="w-5 h-5 text-amber-600" />;
  return <span className="text-gray-400 font-bold w-5 text-center">{index + 1}</span>;
};

export default function Home() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("bulan_ini");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const [revenueSales, setRevenueSales] = useState<any[]>([]);
  const [quotationSales, setQuotationSales] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const revRes = await fetchApi('/reports?type=revenue');
        setRevenueSales(revRes.data || []);
        
        const qRes = await fetchApi('/reports?type=quotation');
        setQuotationSales(qRes.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-50/50 rounded-tl-[16px] overflow-hidden">
      
      {/* Header & Filter */}
      <div className="flex items-center justify-between px-8 py-6 bg-white border-b border-gray-200 shrink-0 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Kinerja</h1>
          <p className="text-sm text-gray-500 mt-1">Pantau pencapaian tim Sales dan Team Leader secara real-time.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {timeFilter === "kustom" && (
            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-sm border-none bg-transparent focus:ring-0 text-gray-600 outline-none px-2 cursor-pointer"
                title="Tanggal Mulai"
              />
              <span className="text-gray-400 text-xs font-medium">s/d</span>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-sm border-none bg-transparent focus:ring-0 text-gray-600 outline-none px-2 cursor-pointer"
                title="Tanggal Selesai"
              />
            </div>
          )}

          <div className="relative">
            <select 
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
              className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm cursor-pointer"
            >
              <option value="hari_ini">Hari Ini</option>
              <option value="minggu_ini">Minggu Ini</option>
              <option value="bulan_ini">Bulan Ini</option>
              <option value="kustom">Kustom Range...</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Activity Cards (Leads Status) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 px-8 py-6 border-b border-gray-200 bg-white shrink-0">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-500 font-medium text-xs uppercase tracking-wider">New Leads</h3>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">142</div>
          <div className="text-xs text-green-600 mt-1 font-medium">+12 minggu ini</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-500 font-medium text-xs uppercase tracking-wider">Contacted</h3>
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">89</div>
          <div className="text-xs text-green-600 mt-1 font-medium">+5 minggu ini</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-500 font-medium text-xs uppercase tracking-wider">Response</h3>
            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <MessageCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">54</div>
          <div className="text-xs text-gray-500 mt-1 font-medium">Sama seperti minggu lalu</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-500 font-medium text-xs uppercase tracking-wider">Quotation</h3>
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <FileTextIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">32</div>
          <div className="text-xs text-green-600 mt-1 font-medium">+8 minggu ini</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-500 font-medium text-xs uppercase tracking-wider">Close Won</h3>
            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">18</div>
          <div className="text-xs text-green-600 mt-1 font-medium">+3 minggu ini</div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8 space-y-8">
        
        {/* --- LEADERBOARD REVENUE --- */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-700" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Leaderboard Revenue Closing</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Keseluruhan (Sales) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col h-full">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Keseluruhan (Sales)</h3>
              <div className="space-y-1 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {isLoading ? <p className="text-xs text-gray-400">Loading...</p> : revenueSales.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="flex justify-center w-6">
                        {getRankIcon(index)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{item.sales}</p>
                        <p className="text-xs text-gray-500">Sales</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{formatRupiah(item.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Per Team Leader */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col h-full">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Per Team Leader</h3>
              <div className="space-y-1 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {isLoading ? <p className="text-xs text-gray-400">Loading...</p> : revenueSales.slice(0,3).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="flex justify-center w-6">
                        {getRankIcon(index)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{item.sales}</p>
                        <p className="text-xs text-gray-500">Team Leader</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{formatRupiah(item.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* --- LEADERBOARD QUOTATION --- */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-700" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Leaderboard Pembuatan Quotation</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Keseluruhan (Sales) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col h-full">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Keseluruhan (Sales)</h3>
              <div className="space-y-1 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {isLoading ? <p className="text-xs text-gray-400">Loading...</p> : quotationSales.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="flex justify-center w-6">
                        {getRankIcon(index)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{item.sales}</p>
                        <p className="text-xs text-gray-500">Sales</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">{item.totalQuotations} Quotation</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Per Team Leader */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col h-full">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Per Team Leader</h3>
              <div className="space-y-1 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {isLoading ? <p className="text-xs text-gray-400">Loading...</p> : quotationSales.slice(0,3).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="flex justify-center w-6">
                        {getRankIcon(index)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{item.sales}</p>
                        <p className="text-xs text-gray-500">Team Leader</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">{item.totalQuotations} Quotation</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* --- PUSAT PENGETAHUAN --- */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-purple-700" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Pusat Pengetahuan Sales</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Level 1 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:border-purple-200 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-purple-50 p-2 rounded-lg text-purple-600 group-hover:bg-purple-100 transition-colors">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">Dasar Legalitas (Level 1)</h3>
                  <p className="text-xs text-gray-500">Pemula / Junior Sales</p>
                </div>
              </div>
              <ul className="text-xs text-gray-600 space-y-2 mt-4">
                <li className="flex items-center gap-2 hover:text-purple-600"><FileText className="w-3.5 h-3.5"/> <a>Panduan Pendirian PT & CV</a></li>
                <li className="flex items-center gap-2 hover:text-purple-600"><FileText className="w-3.5 h-3.5"/> <a>Syarat Pembuatan NIB OSS</a></li>
                <li className="flex items-center gap-2 hover:text-purple-600"><FileText className="w-3.5 h-3.5"/> <a>Ceklist Dokumen Klien Dasar</a></li>
              </ul>
            </div>

            {/* Level 2 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:border-blue-200 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">Sertifikasi & SBU (Level 2)</h3>
                  <p className="text-xs text-gray-500">Menengah / Middle Sales</p>
                </div>
              </div>
              <ul className="text-xs text-gray-600 space-y-2 mt-4">
                <li className="flex items-center gap-2 hover:text-blue-600"><FileText className="w-3.5 h-3.5"/> <a>Alur Pengurusan SBU Konstruksi</a></li>
                <li className="flex items-center gap-2 hover:text-blue-600"><FileText className="w-3.5 h-3.5"/> <a>Matriks Sertifikasi SKK (Jenjang 1-9)</a></li>
                <li className="flex items-center gap-2 hover:text-blue-600"><FileText className="w-3.5 h-3.5"/> <a>Evaluasi Syarat Tender Pemerintah</a></li>
              </ul>
            </div>

            {/* Level 3 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:border-amber-200 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-amber-50 p-2 rounded-lg text-amber-600 group-hover:bg-amber-100 transition-colors">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">ISO Terapan (Level 3)</h3>
                  <p className="text-xs text-gray-500">Lanjutan / Senior Sales</p>
                </div>
              </div>
              <ul className="text-xs text-gray-600 space-y-2 mt-4">
                <li className="flex items-center gap-2 hover:text-amber-600"><FileText className="w-3.5 h-3.5"/> <a>Panduan Audit ISO 9001 & 14001</a></li>
                <li className="flex items-center gap-2 hover:text-amber-600"><FileText className="w-3.5 h-3.5"/> <a>Pemahaman SMK3 & K3 MIGAS</a></li>
                <li className="flex items-center gap-2 hover:text-amber-600"><FileText className="w-3.5 h-3.5"/> <a>Strategi Closing Proyek Enterprise</a></li>
              </ul>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
