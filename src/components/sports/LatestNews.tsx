"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Clock } from "lucide-react";

const NEWS_ITEMS = [
  {
    id: 1,
    category: "NFL",
    image: "/images/hero-nfl.png",
    title: "Trades That Could Shake Up the 2025 NFL Draft",
    excerpt:
      "Three blockbuster trade scenarios that would redefine the first round and reshape franchises for years to come.",
    time: "2h ago",
  },
  {
    id: 2,
    category: "NBA",
    image: "/images/hero-nba.png",
    title: "The MVP Race Is Tighter Than Ever — Here's Why",
    excerpt:
      "With a month left in the regular season, four players are separated by less than 1.5 Win Shares. The debate is raging.",
    time: "4h ago",
  },
  {
    id: 3,
    category: "Trade Rumors",
    image: "/images/studio-bg.png",
    title: "Sources: Multiple Teams Inquiring About Star Reliever",
    excerpt:
      "The trade deadline is approaching and front offices are working the phones. We break down the latest intel from inside the war rooms.",
    time: "5h ago",
  },
  {
    id: 4,
    category: "NHL",
    image: "/images/hero-nhl.png",
    title: "Oilers' McDavid Hits 100-Point Milestone for 9th Straight Season",
    excerpt:
      "Connor McDavid continues to rewrite the record books. His consistency is something the NHL has never seen before.",
    time: "7h ago",
  },
  {
    id: 5,
    category: "Fantasy",
    image: "/images/studio-bg.png",
    title: "Waiver Wire Gems: Week 17 Pickups That Could Win Your League",
    excerpt:
      "These three widely available players could be the difference between a championship and an early exit.",
    time: "9h ago",
  },
  {
    id: 6,
    category: "MLB",
    image: "/images/hero-mlb.png",
    title: "Spring Training Standouts: Five Rookies to Watch in 2025",
    excerpt:
      "From flamethrowers to switch-hitting phenoms — the next generation of baseball stars is ready to arrive.",
    time: "12h ago",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  NFL: "bg-red-500/20 text-red-400 border-red-500/30",
  NBA: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  MLB: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  NHL: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Fantasy: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Trade Rumors": "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function LatestNews() {
  return (
    <section id="latest" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="text-xs font-bold tracking-[0.3em] text-gold uppercase">
            Newsroom
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-2">
            THE <span className="text-gradient-gold">LATEST</span>
          </h2>
          <div className="w-16 h-1 bg-gold mt-4" />
        </motion.div>

        {/* News Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {NEWS_ITEMS.map((item) => (
            <motion.article
              key={item.id}
              variants={itemVariants}
              className="group glass-card-interactive hover-sweep rounded-xl overflow-hidden cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="relative h-44 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute top-3 left-3">
                  <Badge
                    variant="outline"
                    className={`border text-[10px] font-bold tracking-wider ${
                      CATEGORY_COLORS[item.category] || "border-white/20 text-white"
                    }`}
                  >
                    {item.category}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5">
                <h3 className="text-sm sm:text-base font-bold text-foreground leading-tight group-hover:text-gold transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {item.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span className="text-[10px] font-medium">{item.time}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gold text-[10px] font-semibold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Read</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
