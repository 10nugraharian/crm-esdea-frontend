"use client";

import React, { useState } from "react";
import { User, Mail, Shield, Briefcase, Phone, MapPin, Key, Save } from "lucide-react";
import Modal from "@/components/Modal";

// In a real application, this data would come from the authentication context/session.
const currentUser = {
  id: "USR-001",
  userId: "829103",
  namaLengkap: "BOD User",
  username: "bod.user",
  email: "bod@esdea.co.id",
  role: "Director / BOD",
  gender: "Laki-laki",
  tanggalLahir: "1990-05-15",
  noRekening: "1234567890",
  namaBank: "BCA",
  phone: "081234567890",
  address: "Graha ESDEA, Jakarta Selatan",
  department: "Management",
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(currentUser);
  
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    alert("Profil berhasil diperbarui!");
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-tl-[16px] overflow-hidden overflow-y-auto">
      
      {/* Page Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Profil Saya</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola informasi pribadi dan keamanan akun Anda.</p>
        </div>
      </div>

      {/* Profile Content */}
      <div className="px-8 pb-12 max-w-5xl mx-auto w-full flex-1">
        
        {/* Profile Card Top */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row items-center md:items-end gap-6 mb-8">
          <div className="w-32 h-32 bg-white rounded-full p-1 shadow-md shrink-0">
            <div className="w-full h-full bg-brand-50 rounded-full flex items-center justify-center text-brand-600">
              <User className="w-16 h-16" />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-900">{formData.namaLengkap}</h1>
            <p className="text-gray-500 font-medium">@{formData.username}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                <Briefcase className="w-3.5 h-3.5 mr-1" /> {formData.role}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                <Shield className="w-3.5 h-3.5 mr-1" /> {formData.department}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            {isEditing ? (
              <button 
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-brand-700 text-white text-[13px] font-medium rounded-lg hover:bg-brand-800 transition-colors shadow-sm"
              >
                <Save className="w-4 h-4 mr-2" /> Simpan
              </button>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 text-[13px] font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                Edit Profil
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-4 mb-6">Informasi Pribadi</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Nama Lengkap</label>
                  {isEditing ? (
                    <input 
                      type="text" name="namaLengkap" value={formData.namaLengkap} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-500 focus:border-brand-500"
                    />
                  ) : (
                    <div className="text-gray-900 font-medium">{formData.namaLengkap}</div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                  {isEditing ? (
                    <input 
                      type="email" name="email" value={formData.email} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-500 focus:border-brand-500"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900 font-medium">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" /> {formData.email}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Nomor Telepon</label>
                  {isEditing ? (
                    <input 
                      type="text" name="phone" value={formData.phone} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-500 focus:border-brand-500"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900 font-medium">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" /> {formData.phone}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Tanggal Lahir</label>
                  {isEditing ? (
                    <input 
                      type="date" name="tanggalLahir" value={formData.tanggalLahir} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-500 focus:border-brand-500"
                    />
                  ) : (
                    <div className="text-gray-900 font-medium">{formData.tanggalLahir}</div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Alamat</label>
                  {isEditing ? (
                    <input 
                      type="text" name="address" value={formData.address} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-500 focus:border-brand-500"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900 font-medium">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" /> {formData.address}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-4 mb-6">Data Perbankan</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Nama Bank</label>
                  {isEditing ? (
                    <input 
                      type="text" name="namaBank" value={formData.namaBank} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-500 focus:border-brand-500"
                    />
                  ) : (
                    <div className="text-gray-900 font-medium">{formData.namaBank}</div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Nomor Rekening</label>
                  {isEditing ? (
                    <input 
                      type="text" name="noRekening" value={formData.noRekening} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-500 focus:border-brand-500"
                    />
                  ) : (
                    <div className="font-mono text-gray-900 font-medium">{formData.noRekening}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Account Security Settings */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-4 mb-6">Keamanan Akun</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <div className="font-medium text-gray-800">Password</div>
                    <div className="text-xs text-gray-500 mt-1">Ganti kata sandi untuk login</div>
                  </div>
                  <button 
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="p-2 text-gray-500 hover:text-brand-600 hover:bg-brand-50 rounded-md transition-colors"
                  >
                    <Key className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <div className="font-medium text-gray-800">2-Factor Auth</div>
                    <div className="text-xs text-gray-500 mt-1">Tidak aktif</div>
                  </div>
                  <button 
                    onClick={() => alert("Mengaktifkan 2FA")}
                    className="text-[13px] font-medium text-brand-600 hover:text-brand-800"
                  >
                    Aktifkan
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* MODAL GANTI PASSWORD */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Ganti Password"
        maxWidth="max-w-md"
        footer={
          <>
            <button 
              onClick={() => setIsPasswordModalOpen(false)}
              className="px-4 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              Batal
            </button>
            <button 
              onClick={() => {
                alert("Password berhasil diperbarui!");
                setIsPasswordModalOpen(false);
              }}
              className="px-4 py-2 text-[13px] font-medium text-white bg-brand-700 rounded hover:bg-brand-800"
            >
              Simpan Password Baru
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Password Saat Ini</label>
            <input type="password" placeholder="••••••••" className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Password Baru</label>
            <input type="password" placeholder="••••••••" className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
            <input type="password" placeholder="••••••••" className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:ring-brand-500 focus:border-brand-500" />
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Password harus minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka.
          </div>
        </div>
      </Modal>

    </div>
  );
}
