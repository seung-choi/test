import type { Metadata } from "next";
import { Lexend_Exa } from "next/font/google";
import "./globals.scss";
import { ClientLayout } from "@/app/ClientLayout";

const lexendExa = Lexend_Exa({
  weight: ["100", "800"],
  subsets: ["latin"],
  variable: "--font-lexend-exa",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vgolf",
  description: "Vgolf Admin Site",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={lexendExa.variable}>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
