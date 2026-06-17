import type { Metadata } from "next";
import { DM_Sans, EB_Garamond } from "next/font/google";
import "./globals.css";
import { SessionWrapper } from "@/components/SessionWrapper";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "moneybloom",
  description: "Scholarship discovery for first-gen, low-income students",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${ebGaramond.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-[#f5f0e8]">
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
