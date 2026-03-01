import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kumink - Kumpulan Link Apapun",
  description:
    "Kumink adalah tempat semua link pentingmu dalam satu tempat yang simpel dan modern.",
  keywords: [
    "Kumink",
    "Kumpulan Link",
    "Link Download",
    "Bookmark Manager",
  ],
  authors: [{ name: "Kumink Team" }],

  icons: {
    icon: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234ba3f7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><line x1='2' y1='12' x2='22' y2='12'/><path d='M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20z'/></svg>",
  },

  openGraph: {
    title: "Kumink - Kumpulan Link Apapun",
    description:
      "Semua link pentingmu dalam satu tempat yang simpel dan modern.",
    url: "https://kumink.vercel.app/",
    siteName: "Kumink",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Kumink - Kumpulan Link Apapun",
    description:
      "Semua link pentingmu dalam satu tempat yang simpel dan modern.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
