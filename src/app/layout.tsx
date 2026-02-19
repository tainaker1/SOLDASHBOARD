import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SOL Intraday Dashboard",
  description: "Educational intraday trade idea dashboard for SOL"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
