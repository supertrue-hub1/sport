"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Heart,
  Share2,
  Repeat2,
  Bookmark,
  MoreHorizontal,
  TrendingUp,
  Zap,
  Award,
  ExternalLink,
  Verified,
} from "lucide-react";

interface SocialPost {
  id: number;
  author: string;
  handle: string;
  avatar: string;
  verified: boolean;
  timestamp: string;
  content: string;
  category: string;
  likes: string;
  reposts: string;
  replies: string;
  hasMedia: boolean;
  mediaGradient?: string;
  engagement?: "hot" | "viral" | "trending";
}

const POSTS: SocialPost[] = [
  {
    id: 1,
    author: "Adam Schefter",
    handle: "@AdamSchefter",
    avatar: "AS",
    verified: true,
    timestamp: "12m ago",
    content: "BREAKING: Chiefs and Bills have agreed to terms on a blockbuster trade that sends a Pro Bowl receiver to Kansas City. This changes the entire AFC landscape. Details to follow.",
    category: "NFL",
    likes: "24.3K",
    reposts: "8.1K",
    replies: "3.2K",
    hasMedia: false,
    engagement: "viral",
  },
  {
    id: 2,
    author: "Shams Charania",
    handle: "@ShamsCharania",
    avatar: "SC",
    verified: true,
    timestamp: "34m ago",
    content: "The NBA trade deadline is heating up. Multiple All-Star caliber players are on the move today. Expect at least 3 more deals to be finalized before 3 PM ET. Stay tuned.",
    category: "NBA",
    likes: "18.7K",
    reposts: "5.4K",
    replies: "2.8K",
    hasMedia: false,
    engagement: "hot",
  },
  {
    id: 3,
    author: "US Sports Hub",
    handle: "@USSportsHub",
    avatar: "SH",
    verified: true,
    timestamp: "1h ago",
    content: "📊 DEEP DIVE: Patrick Mahomes has now thrown for 300+ yards in 8 consecutive games. The only QB in NFL history with a longer streak? Drew Brees with 9.\n\nThe Chiefs offense is operating at an efficiency level we've never seen before.",
    category: "NFL",
    likes: "9.2K",
    reposts: "2.1K",
    replies: "1.4K",
    hasMedia: true,
    mediaGradient: "linear-gradient(135deg, #1a0a0a 0%, #3d1515 50%, #1a0a0a 100%)",
    engagement: "trending",
  },
  {
    id: 4,
    author: "Jeff Passan",
    handle: "@JeffPassan",
    avatar: "JP",
    verified: true,
    timestamp: "2h ago",
    content: "Shohei Ohtani took live batting practice today and looked absolutely phenomenal. Multiple scouts in attendance described his swing as 'better than ever.' The two-way sensation is on track for Opening Day.",
    category: "MLB",
    likes: "15.6K",
    reposts: "4.3K",
    replies: "2.1K",
    hasMedia: false,
    engagement: "hot",
  },
  {
    id: 5,
    author: "Elliotte Friedman",
    handle: "@FriedgeHNIC",
    avatar: "EF",
    verified: true,
    timestamp: "3h ago",
    content: "Hearing the Oilers and Panthers are discussing a significant trade that could involve a top-4 pick. The Stanley Cup window is wide open for both franchises and they're going all-in. 🏒",
    category: "NHL",
    likes: "7.8K",
    reposts: "1.9K",
    replies: "987",
    hasMedia: false,
    engagement: "trending",
  },
];

const ENGAGEMENT_STYLES: Record<string, { icon: typeof Zap; color: string }> = {
  hot: { icon: Flame, color: "text-orange-400" },
  viral: { icon: TrendingUp, color: "text-red-400" },
  trending: { icon: Award, color: "text-gold" },
};

function Flame({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  NFL: "text-red-400 border-red-500/20 bg-red-500/5",
  NBA: "text-orange-400 border-orange-500/20 bg-orange-500/5",
  MLB: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
  NHL: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
};

const cVar = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const iVar = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function SocialFeed() {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());

  const toggleLike = (id: number) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleBookmark = (id: number) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section id="social" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.01] to-transparent" />
      </div>

      <div className="max-w-3xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <span className="text-xs font-bold tracking-[0.3em] text-gold uppercase flex items-center gap-2">
            Лента
            <MessageCircle className="w-3.5 h-3.5" />
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-2">
            <span className="text-gradient-gold">СОЦСЕТИ</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-lg">
            Пульс спортивного мира. Подборки мнений от самых
            надёжных инсайдеров и аналитиков.
          </p>
          <div className="w-16 h-1 bg-gold mt-4" />
        </motion.div>

        {/* Posts */}
        <motion.div
          variants={cVar}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="space-y-4"
        >
          {POSTS.map((post) => {
            const isLiked = likedPosts.has(post.id);
            const isBookmarked = bookmarked.has(post.id);
            const engStyle = post.engagement ? ENGAGEMENT_STYLES[post.engagement] : null;
            const EngIcon = engStyle?.icon;

            return (
              <motion.div
                key={post.id}
                variants={iVar}
                className="glass-card rounded-xl p-5 sm:p-6 hover-sweep"
              >
                {/* Author row */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-[11px] font-black text-gold flex-shrink-0">
                    {post.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">{post.author}</span>
                      {post.verified && (
                        <Verified className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                      )}
                      {engStyle && EngIcon && (
                        <EngIcon className={`w-3 h-3 ${engStyle.color} flex-shrink-0`} />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground">{post.handle}</span>
                      <span className="text-[11px] text-muted-foreground/50">·</span>
                      <span className="text-[11px] text-muted-foreground">{post.timestamp}</span>
                    </div>
                  </div>
                  <button className="text-muted-foreground/40 hover:text-muted-foreground transition-colors p-1">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line mb-3">
                  {post.content}
                </p>

                {/* Media */}
                {post.hasMedia && post.mediaGradient && (
                  <div
                    className="w-full h-40 sm:h-48 rounded-lg mb-3 flex items-center justify-center overflow-hidden"
                    style={{ background: post.mediaGradient }}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.08),transparent_70%)]" />
                    <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-md bg-black/50 backdrop-blur-sm text-[10px] text-foreground/80">
                      <ExternalLink className="w-3 h-3" />
                      Визуализация данных
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1.5 text-[11px] transition-colors group ${
                      isLiked ? "text-red-400" : "text-muted-foreground hover:text-red-400"
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-current" : ""} group-hover:scale-110 transition-transform`} />
                    {post.likes}
                  </button>
                  <button className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-emerald-400 transition-colors">
                    <Repeat2 className="w-3.5 h-3.5" />
                    {post.reposts}
                  </button>
                  <button className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                    <MessageCircle className="w-3.5 h-3.5" />
                    {post.replies}
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleBookmark(post.id)}
                      className={`transition-colors ${
                        isBookmarked ? "text-gold" : "text-muted-foreground hover:text-gold"
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-current" : ""}`} />
                    </button>
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
