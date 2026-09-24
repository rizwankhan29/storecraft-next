import { Layers, Search, Plus } from "lucide-react";
import Link from "next/link";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-brand-bg/80 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
        {/* 1. Left: Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-indigo flex items-center justify-center shadow-lg shadow-brand-indigo/30">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">
            StoreCraft
          </span>
        </Link>

        {/* 2. Center: Desktop Full Bar OR Mobile Centered Icon */}
        <div className="flex items-center justify-center flex-1 max-w-lg">
          {/* Mobile: Centered Search Icon Button */}
          <button
            type="button"
            aria-label="Search"
            className="flex md:hidden items-center justify-center w-9 h-9 rounded-full bg-brand-card border border-brand-border text-zinc-400 hover:text-white transition"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Desktop: Full Pill Input */}
          <div className="relative w-full hidden md:block">
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-brand-card border border-brand-border rounded-full pl-11 pr-10 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-brand-indigo transition"
            />
            <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 bg-brand-inner px-1.5 py-0.5 rounded border border-brand-border">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* 3. Right: Add Product Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/add-product"
            className="inline-flex items-center gap-1.5 bg-brand-indigo hover:bg-brand-indigo-hover text-white text-sm font-semibold px-4 py-1 sm:px-5 sm:py-2.5 rounded-full shadow-md shadow-brand-indigo/25 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;