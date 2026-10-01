import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { CartProvider } from "@/app/components/cart-provider";
import { ScrollReveal } from "@/app/components/scroll-reveal";
import { SiteHeader } from "@/app/components/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Вкусно Суши — японская кухня в новой глубине",
  description: "Премиальные роллы ручной работы, доставка и бронирование столика в Москве.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" data-scroll-behavior="smooth" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <CartProvider>
          <SiteHeader />
          {children}
          <ScrollReveal />
        </CartProvider>
      </body>
    </html>
  );
}
