"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";

const STORIES = [
  {
    id: "mock-1",
    category: { name: "NFL", slug: "nfl", color: "#ef4444" },
    image: "/images/hero-nfl.png",
    title: "Династия продолжается: шедевр Mahomes в Arrowhead",
    excerpt:
      "Patrick Mahomes выдал выступление на века, организовав камбэк в четвёртой четверти, который закрепил наследие Chiefs как современной династии NFL.",
    tag: "ИЗБРАННОЕ",
    size: "large",
    tags: [],
  },
  {
    id: "mock-2",
    category: { name: "NBA", slug: "nba", color: "#f97316" },
    image: "/images/hero-nba.png",
    title: "Последний акт LeBron: сезон на все времена",
    excerpt:
      "Возможно, это его лебединая песня, но LeBron James выдаёт цифры, бросающие вызов самому времени. Король не просто играет — он правит.",
    tag: "ЭКСКЛЮЗИВ",
    size: "medium",
    tags: [],
  },
  {
    id: "mock-3",
    category: { name: "MLB", slug: "mlb", color: "#10b981" },
    image: "/images/hero-mlb.png",
    title: "Внутри бейсбольного ромба: новая эра аналитики",
    excerpt:
      "Как наука о данных революционизирует формирование составов и вызов питчей. Числа не лгут — но они рассказывают чертовски интересную историю.",
    tag: "ГЛУБЖЕ",
    size: "medium",
    tags: [],
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  NFL: "bg-red-500/20 text-red-400 border-red-500/30",
  NBA: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  MLB: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  NHL: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Трансферы: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Аналитика: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Интервью: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  Фэнтези: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

function getCategoryColorClass(name: string): string {
  if (CATEGORY_COLORS[name]) return CATEGORY_COLORS[name];
  return "bg-white/10 text-white/80 border-white/20";
}

interface FeaturedArticle {
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
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export function FeaturedStories() {
  const [articles, setArticles] = useState<FeaturedArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news?limit=3&featured=true")
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

  const displayStories =
    articles.length > 0
      ? articles.map((a, i) => ({
          id: a.id,
          category: a.category || { name: "Без категории", slug: "", color: "#6b7280" },
          image: a.image || "/images/studio-bg.png",
          title: a.title,
          excerpt: a.excerpt || (a.content ? a.content.substring(0, 150) + "..." : ""),
          tag: i === 0 ? "ИЗБРАННОЕ" : i === 1 ? "ЭКСКЛЮЗИВ" : "ГЛУБЖЕ",
          size: i === 0 ? "large" : "medium",
          tags: a.tags,
        }))
      : STORIES;

  return (
    <section id="featured" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
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
            Выбор редакции
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-2">
            ИЗБРАННЫЕ <span className="text-gradient-gold">ИСТОРИИ</span>
          </h2>
          <div className="w-16 h-1 bg-gold mt-4" />
        </motion.div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:row-span-2 glass-card rounded-lg overflow-hidden">
              <div className="aspect-[16/10] bg-muted animate-pulse" />
            </div>
            <div className="glass-card rounded-lg overflow-hidden">
              <div className="aspect-[16/10] bg-muted animate-pulse" />
            </div>
            <div className="glass-card rounded-lg overflow-hidden">
              <div className="aspect-[16/10] bg-muted animate-pulse" />
            </div>
          </div>
        )}

        {/* Grid */}
        {!loading && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {displayStories.map((story) => (
              <motion.article
                key={story.id}
                variants={itemVariants}
                className={`group relative overflow-hidden rounded-lg ${
                  story.size === "large" ? "lg:row-span-2" : ""
                }`}
              >
                {/* Image */}
                <div className="relative overflow-hidden aspect-[16/10]">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${story.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 dark:from-black/80 via-black/20 to-transparent" />

                  {/* Tag */}
                  <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className={`border text-[10px] font-bold tracking-wider uppercase ${
                        getCategoryColorClass(story.category.name)
                      }`}
                    >
                      {story.category.name}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-gold/30 text-gold text-[10px] font-bold tracking-wider uppercase"
                    >
                      {story.tag}
                    </Badge>
                  </div>

                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                    <h3
                      className={`font-bold text-foreground leading-tight ${
                        story.size === "large"
                          ? "text-xl sm:text-2xl lg:text-3xl"
                          : "text-lg sm:text-xl"
                      }`}
                    >
                      {story.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {story.excerpt}
                    </p>

                    {/* Tags from API */}
                    {"tags" in story && Array.isArray(story.tags) && (story.tags as { name: string; color: string }[]).length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {(story.tags as { name: string; color: string }[]).slice(0, 3).map((tag) => (
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

                    <div className="mt-4 flex items-center gap-1 text-gold text-xs font-semibold tracking-wider uppercase group-hover:gap-2 transition-all">
                      <span>Читать далее</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
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
