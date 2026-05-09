import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Invoice",
  description: "Invoice generator",
  openGraph: {
    title: "Invoice",
    description: "Invoice generator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Invoice",
    description: "Invoice generator",
  },
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
