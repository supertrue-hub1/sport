"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";

const SEARCH_ITEMS = [
  { type: "NFL", label: "Kansas City Chiefs", sub: "AFC West · 15-2", href: "#standings" },
  { type: "NFL", label: "Patrick Mahomes", sub: "QB · 4,183 YDS · 33 TD", href: "#comparison" },
  { type: "NFL", label: "Josh Allen", sub: "QB · 4,306 YDS · 29 TD", href: "#comparison" },
  { type: "NFL", label: "Buffalo Bills", sub: "AFC East · 13-4", href: "#standings" },
  { type: "NFL", label: "Baltimore Ravens", sub: "AFC North · 12-5", href: "#standings" },
  { type: "NBA", label: "Oklahoma City Thunder", sub: "57-10 · Power Rank #2", href: "#rankings" },
  { type: "NBA", label: "Boston Celtics", sub: "55-14 · Power Rank #7", href: "#rankings" },
  { type: "NBA", label: "LeBron James", sub: "LAL · 25.7 PPG", href: "#featured" },
  { type: "MLB", label: "Los Angeles Dodgers", sub: "98-64 · Power Rank #4", href: "#rankings" },
  { type: "MLB", label: "Shohei Ohtani", sub: "LAD · DH · Day-to-Day", href: "#injuries" },
  { type: "NHL", label: "Florida Panthers", sub: "52-22-8 · Power Rank #6", href: "#rankings" },
  { type: "NHL", label: "Edmonton Oilers", sub: "49-25-8 · Power Rank #9", href: "#rankings" },
  { type: "Article", label: "Mahomes' Masterclass in Arrowhead", sub: "Featured Story", href: "#featured" },
  { type: "Article", label: "LeBron's Final Act", sub: "Exclusive", href: "#featured" },
  { type: "Article", label: "Baseball Analytics Revolution", sub: "Deep Dive", href: "#featured" },
  { type: "Stats", label: "AFC Standings", sub: "Full conference rankings", href: "#standings" },
  { type: "Stats", label: "NBA Scoring Leaders", sub: "PPG rankings", href: "#stats" },
  { type: "Stats", label: "Power Rankings", sub: "Cross-sport top 10", href: "#rankings" },
];

const TYPE_COLORS: Record<string, string> = {
  NFL: "text-red-400 bg-red-500/10",
  NBA: "text-orange-400 bg-orange-500/10",
  MLB: "text-emerald-400 bg-emerald-500/10",
  NHL: "text-cyan-400 bg-cyan-500/10",
  Article: "text-gold bg-gold/10",
  Stats: "text-purple-400 bg-purple-500/10",
};

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");

  const filtered = query.length > 0
    ? SEARCH_ITEMS.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.sub.toLowerCase().includes(query.toLowerCase()) ||
          item.type.toLowerCase().includes(query.toLowerCase())
      )
    : SEARCH_ITEMS.slice(0, 8);

  const handleSelect = useCallback(
    (href: string) => {
      onClose();
      setQuery("");
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    },
    [onClose]
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-4 top-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-xl z-[70]"
          >
            <div className="glass rounded-xl border border-white/10 overflow-hidden shadow-2xl shadow-black/50">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                <Search className="w-5 h-5 text-gold flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search teams, players, stories..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
                />
                <button
                  onClick={onClose}
                  className="text-[10px] font-bold tracking-wider text-muted-foreground border border-white/10 rounded px-1.5 py-0.5"
                >
                  ESC
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {filtered.length > 0 ? (
                  <div className="space-y-0.5">
                    {filtered.map((item) => (
                      <button
                        key={`${item.type}-${item.label}`}
                        onClick={() => handleSelect(item.href)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left group"
                      >
                        <span className={`text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded flex-shrink-0 ${TYPE_COLORS[item.type] || "text-muted-foreground bg-white/5"}`}>
                          {item.type}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground group-hover:text-gold transition-colors truncate">
                            {item.label}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {item.sub}
                          </p>
                        </div>
                        <TrendingUp className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-gold/50 transition-colors flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">No results found</p>
                  </div>
                )}
              </div>

              {/* Footer hint */}
              <div className="px-4 py-2.5 border-t border-white/5 text-[10px] text-muted-foreground/50 flex items-center justify-between">
                <span>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
                <span>↑↓ Navigate · ↵ Select · Esc Close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
