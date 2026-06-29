import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "@/context/NotificationContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CRM PT. Esdea Assistance Management",
  description: "SaaS CRM Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased h-full`}>
      <body className="h-full bg-gray-50 font-sans text-[13px]">
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}
