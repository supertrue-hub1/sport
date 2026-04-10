"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";

const STORIES = [
  {
    id: 1,
    category: "NFL",
    image: "/images/hero-nfl.png",
    title: "Династия продолжается: шедевр Mahomes в Arrowhead",
    excerpt:
      "Patrick Mahomes выдал выступление на века, организовав камбэк в четвёртой четверти, который закрепил наследие Chiefs как современной династии NFL.",
    tag: "ИЗБРАННОЕ",
    size: "large",
  },
  {
    id: 2,
    category: "NBA",
    image: "/images/hero-nba.png",
    title: "Последний акт LeBron: сезон на все времена",
    excerpt:
      "Возможно, это его лебединая песня, но LeBron James выдаёт цифры, бросающие вызов самому времени. Король не просто играет — он правит.",
    tag: "ЭКСКЛЮЗИВ",
    size: "medium",
  },
  {
    id: 3,
    category: "MLB",
    image: "/images/hero-mlb.png",
    title: "Внутри бейсбольного ромба: новая эра аналитики",
    excerpt:
      "Как наука о данных революционизирует формирование составов и вызов питчей. Числа не лгут — но они рассказывают чертовски интересную историю.",
    tag: "ГЛУБЖЕ",
    size: "medium",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  NFL: "bg-red-500/20 text-red-400 border-red-500/30",
  NBA: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  MLB: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  NHL: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
};

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

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {STORIES.map((story) => (
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
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge
                    variant="outline"
                    className={`border text-[10px] font-bold tracking-wider uppercase ${
                      CATEGORY_COLORS[story.category]
                    }`}
                  >
                    {story.category}
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
                  <div className="mt-4 flex items-center gap-1 text-gold text-xs font-semibold tracking-wider uppercase group-hover:gap-2 transition-all">
                    <span>Читать далее</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
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
