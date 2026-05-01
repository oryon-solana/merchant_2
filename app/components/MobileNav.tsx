import Link from "next/link";

export function MobileNav() {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-50 rounded-3xl border border-[#e2d2b3] bg-white/95 p-2 shadow-[0_14px_32px_rgba(0,0,0,0.28)] backdrop-blur md:hidden">
      <ul className="grid grid-cols-4 items-end text-center">
        <li>
          <Link
            href="/menu"
            className="flex w-full flex-col items-center gap-1 rounded-xl py-2 text-[#1034b8]"
          >
            <span className="text-lg">☰</span>
            <span className="text-[10px] font-extrabold uppercase">Menu</span>
          </Link>
        </li>
        <li>
          <Link
            href="/rewards"
            className="flex w-full flex-col items-center gap-1 rounded-xl py-2 text-[#1034b8]"
          >
            <span className="text-lg">★</span>
            <span className="text-[10px] font-extrabold uppercase leading-tight">
              Rewards Redeem
            </span>
          </Link>
        </li>
        <li>
          <Link
            href="/cart"
            className="-mt-7 flex h-16 w-full flex-col items-center justify-center rounded-2xl bg-[#f00] text-[#fff4de] shadow-[0_10px_24px_rgba(255,0,0,0.45)]"
          >
            <span className="text-lg">🛍</span>
            <span className="text-[10px] font-extrabold uppercase">
              Order
            </span>
          </Link>
        </li>
        <li>
          <Link
            href="/profile"
            className="flex w-full flex-col items-center gap-1 rounded-xl py-2 text-[#1034b8]"
          >
            <span className="text-lg">👤</span>
            <span className="text-[10px] font-extrabold uppercase">
              Profile
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
