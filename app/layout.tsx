import type { Metadata } from "next";
import { Bebas_Neue, Manrope } from "next/font/google";
import Link from "next/link";
import { ButtonHoverLabel } from "./components/ButtonHoverLabel";
import { NavAuthActions } from "./components/NavAuthActions";
import { ScrollEffects } from "./components/ScrollEffects";
import "./globals.css";
import "aos/dist/aos.css";
import "lenis/dist/lenis.css";
import { AnimatePresence } from "framer-motion";

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
  title: "Sizzle Style Landing",
  description: "Animated American fast food restaurant style landing page",
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
      <body className="min-h-full flex flex-col bg-[#f7ebd7] text-[#1b140e] font-[family-name:var(--font-manrope)] overflow-x-hidden">
        <ScrollEffects />
        <header className="sticky top-0 z-50 border-b-2 border-[#f00] bg-[#fff4de]/95 backdrop-blur">
          <nav className="flex w-full flex-wrap items-center gap-x-2 gap-y-2 px-3 py-2 md:px-6 justify-between">
            <Link
              href="/"
              className="group mr-2 font-[family-name:var(--font-bebas)] text-4xl uppercase leading-none text-[#f00]"
            >
              {"sizzle".split("").map((char, index) => (
                <span
                  key={`${char}-${index}`}
                  className="inline-block motion-safe:group-hover:animate-[nav-letter-bounce_420ms_cubic-bezier(0.34,1.56,0.64,1)]"
                  style={{ animationDelay: `${index * 45}ms` }}
                >
                  {char}
                </span>
              ))}
            </Link>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/"
                className="group inline-flex items-center border border-[#1034b8] bg-transparent px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#1034b8] transition-colors hover:bg-[#1034b8] hover:text-[#fff4de]"
              >
                <ButtonHoverLabel label="Home" />
              </Link>
              <Link
                href="/menu"
                className="group inline-flex items-center border border-[#1034b8] bg-transparent px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#1034b8] transition-colors hover:bg-[#1034b8] hover:text-[#fff4de]"
              >
                <ButtonHoverLabel label="Menu" />
              </Link>
              <Link
                href="/rewards"
                className="group inline-flex items-center border border-[#1034b8] bg-transparent px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#1034b8] transition-colors hover:bg-[#1034b8] hover:text-[#fff4de]"
              >
                <ButtonHoverLabel label="Points" />
              </Link>
              <Link
                href="/profile"
                className="group inline-flex items-center border border-[#1034b8] bg-transparent px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#1034b8] transition-colors hover:bg-[#1034b8] hover:text-[#fff4de]"
              >
                <ButtonHoverLabel label="Profile" />
              </Link>
              <NavAuthActions />
            </div>
          </nav>
        </header>
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </body>
    </html>
  );
}
