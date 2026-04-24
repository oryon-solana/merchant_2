import type { Metadata } from "next";
import { Bebas_Neue, Manrope } from "next/font/google";
import Link from "next/link";
import "./globals.css";

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
        <header className="sticky top-0 z-50 border-b-2 border-[#f00] bg-[#fff4de]/95 backdrop-blur">
          <nav className="flex w-full flex-wrap items-center gap-x-2 gap-y-2 px-3 py-2 md:px-6">
            <Link
              href="/"
              className="mr-2 font-[family-name:var(--font-bebas)] text-4xl uppercase leading-none text-[#f00]"
            >
              gourou
            </Link>
            <Link
              href="/"
              className="border border-[#1034b8] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#1034b8]"
            >
              Home
            </Link>
            <Link
              href="/menu"
              className="border border-[#1034b8] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#1034b8]"
            >
              Menu
            </Link>
            <Link
              href="/rewards"
              className="border border-[#1034b8] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#1034b8]"
            >
              Points (Redeem)
            </Link>
            <Link
              href="/profile"
              className="border border-[#1034b8] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#1034b8]"
            >
              Profile
            </Link>
            <Link
              href="/signin"
              className="border border-[#f00] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#f00]"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="border border-[#f00] bg-[#f00] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#fff4de]"
            >
              Sign Up
            </Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
