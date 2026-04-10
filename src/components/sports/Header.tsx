"use client";

import { useState, useEffect } from "react";
import { Menu, X, Search, Trophy, Clock } from "lucide-react";
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
          ? "bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm"
          : "bg-white"
      )}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <Trophy className="w-6 h-6 text-red-600 transition-transform group-hover:scale-110" />
            <span className="text-xl lg:text-2xl font-playfair font-bold tracking-tight text-gray-900">
              USASport
            </span>
          </a>

          {/* League Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {LEAGUES.map((league) => (
              <a
                key={league.label}
                href={league.href}
                className="px-4 py-2 text-sm font-inter font-semibold text-gray-600 hover:text-red-600 hover:bg-gray-50 rounded-md transition-colors"
              >
                {league.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              aria-label="Поиск (⌘K)"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline font-inter">Поиск</span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-xs font-mono bg-gray-200 rounded">
                ⌘K
              </kbd>
            </button>

            {/* Live Scores Button */}
            <a
              href="#"
              className="flex items-center gap-2 px-4 py-2 text-sm font-inter font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              <Clock className="w-4 h-4" />
              <span>Live Scores</span>
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
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

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <nav className="flex flex-col p-4 gap-1">
            {LEAGUES.map((league) => (
              <a
                key={league.label}
                href={league.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-base font-inter font-semibold text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {league.label}
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
