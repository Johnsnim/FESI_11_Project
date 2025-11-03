import type { Metadata } from "next";
import "./globals.css";

import { Header } from "@/shared/components/header";
import Providers from "@/shared/providers";

export const metadata: Metadata = {
  title: "같이달램",
  description: "다같이 화이팅",
  icons: {
    icon: "/image/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* 중요한 폰트만 preload */}
        <link
          rel="preload"
          href="/fonts/Pretendard-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Pretendard-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="min-h-screen bg-[#f6f7f9]">
        <Providers>
          <Header />
          <main className="mx-auto max-w-[1280px]">{children}</main>
        </Providers>
      </body>
    </html>
  );
}