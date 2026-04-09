"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";

const STORIES = [
  {
    id: 1,
    category: "NFL",
    image: "/images/hero-nfl.png",
    title: "The Dynasty Continues: Mahomes' Masterclass in Arrowhead",
    excerpt:
      "Patrick Mahomes delivered a performance for the ages, engineering a fourth-quarter comeback that cemented the Chiefs' legacy as the NFL's modern dynasty.",
    tag: "FEATURED",
    size: "large",
  },
  {
    id: 2,
    category: "NBA",
    image: "/images/hero-nba.png",
    title: "LeBron's Final Act: A Season for the Ages",
    excerpt:
      "In what might be his swan song, LeBron James is putting up numbers that defy time itself. The King isn't just playing — he's reigning.",
    tag: "EXCLUSIVE",
    size: "medium",
  },
  {
    id: 3,
    category: "MLB",
    image: "/images/hero-mlb.png",
    title: "Inside the Diamond: The New Era of Baseball Analytics",
    excerpt:
      "How data science is revolutionizing the way teams build rosters and call pitches. The numbers don't lie — but they tell one hell of a story.",
    tag: "DEEP DIVE",
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
            Editor&apos;s Pick
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-2">
            FEATURED <span className="text-gradient-gold">STORIES</span>
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

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
                    <span>Read Story</span>
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
