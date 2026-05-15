import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FUKU-MEETS",
  description: "福岡のリアルに、会いにいく。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
