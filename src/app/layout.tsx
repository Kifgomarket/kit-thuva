import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KIFGO | INTERN TRAINING",
  description: "This is a simple blog app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
