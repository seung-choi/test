import type { Metadata } from "next";
import "./globals.scss";
import { ClientLayout } from "@/app/ClientLayout";

export const metadata: Metadata = {
  title: "Vgolf",
  description: "Vgolf admin page",
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
