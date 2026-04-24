import type { Metadata } from "next";
import { Bebas_Neue, Manrope } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gourou Style Landing",
  description: "Animated Indian food restaurant style landing page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${bebas.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f7ebd7] text-[#1b140e] font-[family-name:var(--font-manrope)]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
