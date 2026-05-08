"use client";

import Link from "next/link";
import { LogOut, ShoppingCart } from "lucide-react";
import { ButtonHoverLabel } from "./ButtonHoverLabel";
import { useAuth } from "../context/AuthContext";

export function NavAuthActions() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user) {
    return (
      <>
        <Link
          href="/signin"
          className="group inline-flex items-center border border-[#f00] bg-transparent px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#f00] transition-colors hover:bg-[#f00] hover:text-[#fff4de]"
        >
          <ButtonHoverLabel label="Sign In" />
        </Link>
        <Link
          href="/signup"
          className="group inline-flex items-center border border-[#f00] bg-[#f00] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#fff4de] transition-colors hover:bg-transparent hover:text-[#f00]"
        >
          <ButtonHoverLabel label="Sign Up" />
        </Link>
      </>
    );
  }

  return (
    <>
      <Link
        href="/cart"
        className="group inline-flex items-center justify-center border border-[#f00] bg-[#f00] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#fff4de] transition-colors hover:bg-transparent hover:text-[#f00]"
        aria-label="Cart"
        title="Cart"
      >
        <ShoppingCart className="h-[1.2em] w-[1.2em]" strokeWidth={2.6} aria-hidden="true" />
      </Link>
      <button
        type="button"
        onClick={logout}
        className="group inline-flex items-center border border-[#f00] bg-transparent px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#f00] transition-colors hover:bg-[#f00] hover:text-[#fff4de]"
        aria-label="Logout"
        title={`Logout (${user.name ?? user.email})`}
      >
        <LogOut className="h-[1.15em] w-[1.15em]" strokeWidth={2.6} aria-hidden="true" />
      </button>
    </>
  );
}
