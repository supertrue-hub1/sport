"use client";

import { useState, useEffect } from "react";
import { Menu, X, Search, Trophy, Clock, Settings } from "lucide-react";
import { SearchModal } from "./SearchModal";
import { cn } from "@/lib/utils";

const LEAGUES = [
  { label: "NBA", href: "#" },
  { label: "NHL", href: "#" },
  { label: "AHL", href: "#" },
  { label: "KHL", href: "#" },
  { label: "NFL", href: "#" },
  { label: "MLB", href: "#" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-black/80 backdrop-blur-md border-b border-white/10"
          : "bg-transparent"
      )}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a href="#" className="flex items-center gap-2 group">
            <Trophy className="w-6 h-6 text-gold transition-transform group-hover:scale-110" />
            <span className="text-xl lg:text-2xl font-playfair font-bold tracking-tight text-white">
              USASport
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-1">
            {LEAGUES.map((league) => (
              <a
                key={league.label}
                href={league.href}
                className="px-4 py-2 text-sm font-inter font-semibold text-gray-300 hover:text-gold hover:bg-white/5 rounded-md transition-colors"
              >
                {league.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
              aria-label="Поиск (⌘K)"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline font-inter">Поиск</span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-xs font-mono bg-white/10 rounded">
                ⌘K
              </kbd>
            </button>

            <a
              href="#"
              className="flex items-center gap-2 px-4 py-2 text-sm font-inter font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              <Clock className="w-4 h-4" />
              <span>Live Scores</span>
            </a>

            <a
              href="/admin"
              className="hidden lg:flex items-center gap-2 px-3 py-2 text-sm font-inter font-semibold text-gray-300 bg-white/5 hover:bg-white/10 rounded-md transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Admin</span>
            </a>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-md"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-black/95 backdrop-blur-md">
          <nav className="flex flex-col p-4 gap-1">
            {LEAGUES.map((league) => (
              <a
                key={league.label}
                href={league.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-base font-inter font-semibold text-gray-300 hover:text-gold hover:bg-white/5 rounded-lg transition-colors"
              >
                {league.label}
              </a>
            ))}
            <div className="my-2 border-t border-white/10 pt-2">
              <a
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-base font-inter font-semibold text-gray-300 hover:text-gold hover:bg-white/5 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                Админ-панель
              </a>
            </div>
          </nav>
        </div>
      )}

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
