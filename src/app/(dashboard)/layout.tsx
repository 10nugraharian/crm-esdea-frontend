"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Search, 
  Bell, 
  User, 
  LayoutDashboard, 
  Users, 
  FileText, 
  DollarSign, 
  FolderKanban,
  Package,
  Receipt,
  Briefcase,
  UserCircle,
  Banknote,
  UsersRound,
  ShieldAlert,
  Network,
  BookOpen
} from "lucide-react";
import Link from "next/link";
import { useNotification } from "@/context/NotificationContext";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotification();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-full bg-[#333333] font-sans flex flex-col overflow-hidden text-sm">
        {/* 44px HEADER */}
        <header className="h-[44px] shrink-0 bg-[#333333] text-white flex items-center justify-between px-4 z-50">
          <div className="flex items-center">
            <img src="/logo-esdea-putih.png" alt="Esdea Logo" className="h-6" />
          </div>
          
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 stroke-[1.5]" />
              <input 
                type="text" 
                placeholder="Global Search" 
                className="w-full bg-[#404040] text-gray-200 placeholder-gray-400 rounded-md pl-9 pr-3 py-1.5 text-[13px] focus:outline-none focus:bg-[#4a4a4a] focus:ring-1 focus:ring-brand-500 border border-[#4a4a4a] hover:border-[#555] transition-all duration-200 ease-in-out"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Dropdown */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-1 hover:bg-[#444] rounded text-gray-300 hover:text-white transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-[#333333]"></span>
                )}
              </button>
              
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden text-gray-800">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-semibold text-sm">Notifikasi</h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="text-xs text-brand-600 hover:text-brand-800 font-medium">
                        Tandai dibaca
                      </button>
                    )}
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500">Tidak ada notifikasi</div>
                    ) : (
                      notifications.map(notif => (
                        <div 
                          key={notif.id} 
                          onClick={() => {
                            if (!notif.isRead) markAsRead(notif.id);
                          }}
                          className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${!notif.isRead ? 'bg-brand-50/30' : ''}`}
                        >
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-medium text-[13px] text-gray-900">{notif.title}</h4>
                            <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{notif.time}</span>
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-2">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <div 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 cursor-pointer hover:bg-[#444] px-2 py-1 rounded transition-colors"
              >
                <div className="w-6 h-6 bg-[#555] rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium hidden sm:inline-block">BOD User</span>
              </div>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 text-gray-800 py-1">
                  <div className="px-4 py-3 border-b border-gray-100 mb-1">
                    <div className="font-semibold text-sm truncate">BOD User</div>
                    <div className="text-xs text-gray-500 truncate">bod.user@esdea.co.id</div>
                  </div>
                  <Link 
                    href="/profile" 
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <UserCircle className="w-4 h-4 mr-2 text-gray-400" />
                    Lihat Profil
                  </Link>
                  <div className="h-px bg-gray-100 my-1"></div>
                  <button 
                    onClick={() => {
                      import('js-cookie').then(Cookies => {
                        Cookies.default.remove('auth_token');
                        Cookies.default.remove('user_data');
                        window.location.href = '/login';
                      });
                    }}
                    className="flex items-center w-full px-4 py-2 text-[13px] text-red-600 hover:bg-red-50 transition-colors text-left"
                  >
                    <UsersRound className="w-4 h-4 mr-2 text-red-400" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* MAIN WRAPPER */}
        <div className="flex flex-1 relative overflow-hidden">
          
          {/* SIDEBAR PLACEHOLDER */}
          <div className="w-[44px] shrink-0 bg-[#333333]"></div>

          {/* SIDEBAR ACTUAL (Absolute for hover expansion) */}
          <aside className="absolute left-0 top-0 bottom-0 w-[44px] hover:w-[240px] bg-[#333333] text-gray-300 transition-all duration-200 ease-in-out z-40 flex flex-col overflow-hidden group border-r border-[#444444]">
            <nav className="flex flex-col py-4 gap-1">
              {[
                { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
                { name: 'Leads', icon: Users, href: '/leads' },
                { name: 'Distribusi Leads', icon: Network, href: '/distribusi-leads' },
                { name: 'Quotations', icon: FileText, href: '/quotations' },
                { name: 'Invoices', icon: Receipt, href: '/invoices' },
                { name: 'Layanan', icon: Package, href: '/layanan' },
                { name: 'Finance', icon: DollarSign, href: '/finance' },
                { name: 'Projects', icon: FolderKanban, href: '/projects' },
                { name: 'Vendors', icon: Briefcase, href: '/vendors' },
                { name: 'Komisi', icon: Banknote, href: '/komisi' },
                { name: 'Tim', icon: UsersRound, href: '/users' },
                { name: 'Hak Akses', icon: ShieldAlert, href: '/akses' },
                { name: 'Pusat Bantuan', icon: BookOpen, href: '/panduan' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.name}
                    href={item.href} 
                    className={`flex items-center h-[36px] mx-1 px-[11px] rounded-md hover:bg-[#444] hover:text-white transition-all duration-200 ease-in-out whitespace-nowrap`}
                  >
                    <Icon className="w-5 h-5 shrink-0 stroke-[1.5]" />
                    <span className="ml-3 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out text-[13px] font-medium tracking-wide">
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 bg-[#F9FAFB] rounded-tl-[16px] overflow-auto shadow-[-4px_0_24px_rgba(51,51,51,0.08)] relative z-0">
            {children}
          </main>
          
        </div>
      </div>
  );
}
