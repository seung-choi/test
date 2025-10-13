import type { Metadata } from "next";
import "./globals.scss";
import { ClientLayout } from "@/app/ClientLayout";

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
