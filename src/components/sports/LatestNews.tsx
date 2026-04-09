"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Clock } from "lucide-react";

const NEWS_ITEMS = [
  {
    id: 1,
    category: "NFL",
    image: "/images/hero-nfl.png",
    title: "Обмены, которые могут перевернуть драфт NFL 2025",
    excerpt:
      "Три сценария громких обменов, которые переопределят первый раунд и изменят франшизы на годы вперёд.",
    time: "2ч назад",
  },
  {
    id: 2,
    category: "NBA",
    image: "/images/hero-nba.png",
    title: "Борьба за MVP теснее, чем когда-либо — вот почему",
    excerpt:
      "За месяц до конца регулярного сезона четыре игрока разделены менее чем 1.5 Win Shares. Споры бушуют.",
    time: "4ч назад",
  },
  {
    id: 3,
    category: "Слухи обменов",
    image: "/images/studio-bg.png",
    title: "Источники: несколько команд интересуются звёздным реливером",
    excerpt:
      "Дедлайн обменов приближается, и управляющие штабы работают телефонами. Анализируем последние данные из штабов.",
    time: "5ч назад",
  },
  {
    id: 4,
    category: "NHL",
    image: "/images/hero-nhl.png",
    title: "McDavid из Oilers достигает отметки в 100 очков 9-й сезон подряд",
    excerpt:
      "Connor McDavid продолжает переписывать рекорды. Его стабильность — нечто невиданное ранее в NHL.",
    time: "7ч назад",
  },
  {
    id: 5,
    category: "Фэнтези",
    image: "/images/studio-bg.png",
    title: "Жемчужины драфта отказов: подписание 17-й недели, которые могут принести вам победу",
    excerpt:
      "Эти три широко доступных игрока могут стать разницей между чемпионством и ранним вылетом.",
    time: "9ч назад",
  },
  {
    id: 6,
    category: "MLB",
    image: "/images/hero-mlb.png",
    title: "Звёзды весенних тренировок: пять новичков, за которыми стоит следить в 2025",
    excerpt:
      "От питчеров с огненными подачами до феноменов-свитч-хиттеров — следующее поколение бейсбольных звёзд готово к дебюту.",
    time: "12ч назад",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  NFL: "bg-red-500/20 text-red-400 border-red-500/30",
  NBA: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  MLB: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  NHL: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "Фэнтези": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Слухи обменов": "bg-amber-500/20 text-amber-400 border-amber-500/30",
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
            Редакция
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-2">
            ПОСЛЕДНИЕ <span className="text-gradient-gold">НОВОСТИ</span>
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
                    <span>Читать</span>
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
