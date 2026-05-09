import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dubbing Invoice Generator",
  description: "Aesthetic and minimalist invoice generator for dubbing artists",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} antialiased min-h-screen relative overflow-x-hidden`}
      >
        <div className="fixed inset-0 z-[-1] bg-[#0a0a0a]"></div>
        {children}
      </body>
    </html>
  );
}
