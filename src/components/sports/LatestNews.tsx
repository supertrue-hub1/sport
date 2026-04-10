"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Clock, MessageSquare } from "lucide-react";

const NEWS_ITEMS = [
  {
    id: "mock-1",
    category: { name: "NFL", slug: "nfl", color: "#ef4444" },
    image: "/images/hero-nfl.png",
    title: "Обмены, которые могут перевернуть драфт NFL 2025",
    excerpt:
      "Три сценария громких обменов, которые переопределят первый раунд и изменят франшизы на годы вперёд.",
    time: "2ч назад",
    tags: [],
    commentsCount: 0,
  },
  {
    id: "mock-2",
    category: { name: "NBA", slug: "nba", color: "#f97316" },
    image: "/images/hero-nba.png",
    title: "Борьба за MVP теснее, чем когда-либо — вот почему",
    excerpt:
      "За месяц до конца регулярного сезона четыре игрока разделены менее чем 1.5 Win Shares. Споры бушуют.",
    time: "4ч назад",
    tags: [],
    commentsCount: 0,
  },
  {
    id: "mock-3",
    category: { name: "Трансферы", slug: "transfery", color: "#f59e0b" },
    image: "/images/studio-bg.png",
    title: "Источники: несколько команд интересуются звёздным реливером",
    excerpt:
      "Дедлайн обменов приближается, и управляющие штабы работают телефонами. Анализируем последние данные из штабов.",
    time: "5ч назад",
    tags: [],
    commentsCount: 0,
  },
  {
    id: "mock-4",
    category: { name: "NHL", slug: "nhl", color: "#06b6d4" },
    image: "/images/hero-nhl.png",
    title: "McDavid из Oilers достигает отметки в 100 очков 9-й сезон подряд",
    excerpt:
      "Connor McDavid продолжает переписывать рекорды. Его стабильность — нечто невиданное ранее в NHL.",
    time: "7ч назад",
    tags: [],
    commentsCount: 0,
  },
  {
    id: "mock-5",
    category: { name: "Фэнтези", slug: "fantasy", color: "#a855f7" },
    image: "/images/studio-bg.png",
    title: "Жемчужины драфта отказов: подписание 17-й недели, которые могут принести вам победу",
    excerpt:
      "Эти три широко доступных игрока могут стать разницей между чемпионством и ранним вылетом.",
    time: "9ч назад",
    tags: [],
    commentsCount: 0,
  },
  {
    id: "mock-6",
    category: { name: "MLB", slug: "mlb", color: "#10b981" },
    image: "/images/hero-mlb.png",
    title: "Звёзды весенних тренировок: пять новичков, за которыми стоит следить в 2025",
    excerpt:
      "От питчеров с огненными подачами до феноменов-свитч-хиттеров — следующее поколение бейсбольных звёзд готово к дебюту.",
    time: "12ч назад",
    tags: [],
    commentsCount: 0,
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  NFL: "bg-red-500/20 text-red-400 border-red-500/30",
  NBA: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  MLB: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  NHL: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "Фэнтези": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Трансферы: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Аналитика: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Интервью: "bg-pink-500/20 text-pink-400 border-pink-500/30",
};

function getCategoryColorClass(name: string, color: string): string {
  if (CATEGORY_COLORS[name]) return CATEGORY_COLORS[name];
  // Dynamic class from category color
  return `bg-white/10 text-white/80 border-white/20`;
}

function formatTimeAgo(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Только что";
  if (diffMins < 60) return `${diffMins} мин назад`;
  if (diffHours < 24) return `${diffHours}ч назад`;
  if (diffDays < 7) return `${diffDays}д назад`;
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image: string | null;
  publishedAt: string | null;
  views: number;
  featured: boolean;
  category: { name: string; slug: string; color: string } | null;
  tags: { name: string; slug: string; color: string }[];
  commentsCount: number;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function LatestNews() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news?limit=6")
      .then((res) => res.json())
      .then((json) => {
        if (json.data && json.data.length > 0) {
          setArticles(json.data);
        }
      })
      .catch(() => {
        // fall back to mock
      })
      .finally(() => setLoading(false));
  }, []);

  const displayItems =
    articles.length > 0
      ? articles.map((a) => ({
          id: a.id,
          category: a.category || { name: "Без категории", slug: "", color: "#6b7280" },
          image: a.image || "/images/studio-bg.png",
          title: a.title,
          excerpt: a.excerpt || (a.content ? a.content.substring(0, 120) + "..." : ""),
          time: formatTimeAgo(a.publishedAt),
          tags: a.tags,
          commentsCount: a.commentsCount,
        }))
      : NEWS_ITEMS;

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
            Редакция
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-2">
            ПОСЛЕДНИЕ <span className="text-gradient-gold">НОВОСТИ</span>
          </h2>
          <div className="w-16 h-1 bg-gold mt-4" />
        </motion.div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card-interactive rounded-xl overflow-hidden">
                <div className="h-44 bg-muted animate-pulse" />
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                  <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
                  <div className="flex justify-between pt-2">
                    <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* News Grid */}
        {!loading && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {displayItems.map((item) => (
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
                        getCategoryColorClass(item.category.name, item.category.color)
                      }`}
                    >
                      {item.category.name}
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

                  {/* Tags */}
                  {"tags" in item && Array.isArray(item.tags) && (item.tags as { name: string; color: string }[]).length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(item.tags as { name: string; color: string }[]).slice(0, 3).map((tag) => (
                        <span
                          key={tag.name}
                          className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: tag.color + "20",
                            color: tag.color,
                            border: `1px solid ${tag.color}40`,
                          }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        <span className="text-[10px] font-medium">{item.time}</span>
                      </div>
                      {"commentsCount" in item && (item.commentsCount as number) > 0 && (
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          <span className="text-[10px] font-medium">{item.commentsCount as number}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-gold text-[10px] font-semibold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Читать</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
