import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./provider";
import { Header } from "@/shared/components/header";

export const metadata: Metadata = {
  title: "team4",
  description: "다같이 화이팅",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-[#f6f7f9]">
        <Providers>
          <Header />
          <main className="mx-auto max-w-[1280px]">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
