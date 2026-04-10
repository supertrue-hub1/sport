'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Star, TrendingUp, ChevronLeft, ChevronRight, Zap, Award, Trophy } from 'lucide-react';

interface Performer {
  id: number;
  name: string;
  team: string;
  sport: 'NFL' | 'NBA' | 'MLB' | 'NHL';
  avatarBg: string;
  initials: string;
  stats: string;
  score: number;
  grade: 'A+' | 'A' | 'A-' | 'B+';
  badge?: 'Trending' | 'Rising';
}

const performers: Performer[] = [
  {
    id: 1,
    name: 'Patrick Mahomes',
    team: 'Kansas City Chiefs',
    sport: 'NFL',
    avatarBg: 'bg-red-600',
    initials: 'PM',
    stats: '324 ярда | 4 тачдауна | 128.4 рейтинг',
    score: 98.2,
    grade: 'A+',
    badge: 'Trending',
  },
  {
    id: 2,
    name: 'Luka Dončić',
    team: 'Dallas Mavericks',
    sport: 'NBA',
    avatarBg: 'bg-blue-600',
    initials: 'LD',
    stats: '32.5 очков | 8.3 подбора | 5.1 передачи',
    score: 95.7,
    grade: 'A',
    badge: 'Trending',
  },
  {
    id: 3,
    name: 'Shohei Ohtani',
    team: 'Los Angeles Dodgers',
    sport: 'MLB',
    avatarBg: 'bg-sky-600',
    initials: 'SO',
    stats: '.312 отб | 8 хоумранов | 21 RBI',
    score: 97.1,
    grade: 'A+',
    badge: 'Trending',
  },
  {
    id: 4,
    name: 'Connor McDavid',
    team: 'Edmonton Oilers',
    sport: 'NHL',
    avatarBg: 'bg-cyan-600',
    initials: 'CM',
    stats: '2 гола | 4 передачи | +5 рейтинг',
    score: 94.3,
    grade: 'A',
  },
  {
    id: 5,
    name: 'Tyreek Hill',
    team: 'Miami Dolphins',
    sport: 'NFL',
    avatarBg: 'bg-orange-600',
    initials: 'TH',
    stats: '198 ярдов | 2 тачдауна | 14.2 ярда/приём',
    score: 91.8,
    grade: 'A-',
    badge: 'Rising',
  },
  {
    id: 6,
    name: 'Nikola Jokić',
    team: 'Denver Nuggets',
    sport: 'NBA',
    avatarBg: 'bg-amber-600',
    initials: 'NJ',
    stats: '28.4 очка | 14.7 подбора | 9.2 передачи',
    score: 93.5,
    grade: 'A',
    badge: 'Rising',
  },
];

const sportColors: Record<string, string> = {
  NFL: 'bg-red-500/20 text-red-400 border-red-500/30',
  NBA: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  MLB: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  NHL: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
};

const gradeColors: Record<string, string> = {
  'A+': 'text-emerald-400',
  'A': 'text-blue-400',
  'A-': 'text-amber-400',
  'B+': 'text-yellow-400',
};

const gradeBgColors: Record<string, string> = {
  'A+': 'bg-emerald-500/15',
  'A': 'bg-blue-500/15',
  'A-': 'bg-amber-500/15',
  'B+': 'bg-yellow-500/15',
};

export function TopPerformers() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalCards = performers.length;

  const scrollToIndex = useCallback((index: number) => {
    if (!scrollRef.current) return;
    const clampedIndex = Math.max(0, Math.min(index, totalCards - 1));
    const cardWidth = scrollRef.current.children[0]?.getBoundingClientRect().width || 0;
    const gap = 16;
    scrollRef.current.scrollTo({
      left: clampedIndex * (cardWidth + gap),
      behavior: 'smooth',
    });
    setActiveIndex(clampedIndex);
  }, [totalCards]);

  const handleNext = useCallback(() => {
    scrollToIndex((activeIndex + 1) % totalCards);
  }, [activeIndex, scrollToIndex, totalCards]);

  const handlePrev = useCallback(() => {
    scrollToIndex((activeIndex - 1 + totalCards) % totalCards);
  }, [activeIndex, scrollToIndex, totalCards]);

  // Auto-scroll every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, handleNext]);

  // Sync active index with scroll position
  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const handleScroll = () => {
      const cardWidth = scrollEl.children[0]?.getBoundingClientRect().width || 0;
      const gap = 16;
      const index = Math.round(scrollEl.scrollLeft / (cardWidth + gap));
      setActiveIndex(Math.max(0, Math.min(index, totalCards - 1)));
    };

    scrollEl.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollEl.removeEventListener('scroll', handleScroll);
  }, [totalCards]);

  return (
    <section
      className="relative py-12 md:py-16"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Section header */}
      <div className="px-4 md:px-8 lg:px-12 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-5 h-5 text-gold animate-number-pop" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Еженедельный рейтинг
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gradient-hero mb-3">
          ЛУЧШИЕ ИСПОЛНИТЕЛИ НЕДЕЛИ
        </h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-xl">
          Эксперты выделили главных героев последних семи дней
        </p>
        <div className="premium-separator mt-6 max-w-md" />
      </div>

      {/* Navigation arrows */}
      <div className="absolute right-4 md:right-8 lg:right-12 top-14 md:top-16 flex gap-2 z-10">
        <button
          onClick={handlePrev}
          className="w-9 h-9 rounded-full glass-card-interactive flex items-center justify-center
                     text-muted-foreground hover:text-foreground transition-colors card-press"
          aria-label="Предыдущий"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={handleNext}
          className="w-9 h-9 rounded-full glass-card-interactive flex items-center justify-center
                     text-muted-foreground hover:text-foreground transition-colors card-press"
          aria-label="Следующий"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Cards container - horizontal scroll on mobile, grid on desktop */}
      <div className="px-4 md:px-8 lg:px-12">
        {/* Mobile: horizontal scroll */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-scroll scrollbar-hide pb-4 md:hidden"
        >
          {performers.map((performer, index) => (
            <PerformerCard key={performer.id} performer={performer} index={index} />
          ))}
        </div>

        {/* Desktop: grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4">
          {performers.map((performer, index) => (
            <PerformerCard key={performer.id} performer={performer} index={index} />
          ))}
        </div>
      </div>

      {/* Scroll indicator dots (mobile only) */}
      <div className="flex justify-center gap-2 mt-6 md:hidden">
        {performers.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? 'bg-gold w-6'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
            aria-label={`Карточка ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

function PerformerCard({ performer, index }: { performer: Performer; index: number }) {
  return (
    <div
      className={`glass-card-interactive card-hover-glow card-press glass-shine rounded-xl p-5 flex-shrink-0
                   w-[280px] md:w-auto animate-rise-up`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Top row: avatar + info */}
      <div className="flex items-start gap-3 mb-4">
        {/* Avatar */}
        <div
          className={`w-12 h-12 rounded-full ${performer.avatarBg} flex items-center justify-center
                      flex-shrink-0 text-white font-bold text-sm shadow-lg`}
        >
          {performer.initials}
        </div>

        <div className="flex-1 min-w-0">
          {/* Player name */}
          <h3 className="font-bold text-sm text-foreground truncate">
            {performer.name}
          </h3>
          {/* Team */}
          <p className="text-xs text-muted-foreground truncate">
            {performer.team}
          </p>
        </div>
      </div>

      {/* Sport badge + Grade */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase
                      tracking-wider border ${sportColors[performer.sport]}`}
        >
          {performer.sport}
        </span>

        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md ${gradeBgColors[performer.grade]}`}
        >
          <Award className="w-3 h-3" />
          <span className={`text-xs font-bold ${gradeColors[performer.grade]}`}>
            {performer.grade}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-1.5 mb-3">
        <Zap className="w-3.5 h-3.5 text-gold flex-shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          {performer.stats}
        </p>
      </div>

      {/* Performance score bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Рейтинг
          </span>
          <span className={`text-sm font-bold animate-number-pop ${gradeColors[performer.grade]}`}
            style={{ animationDelay: `${index * 80 + 300}ms` }}
          >
            {performer.score}
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-muted/50 dark:bg-white/5 overflow-hidden">
          <div
            className={`h-full rounded-full score-bar-fill ${
              performer.grade === 'A+'
                ? 'bg-emerald-500'
                : performer.grade === 'A'
                ? 'bg-blue-500'
                : performer.grade === 'A-'
                ? 'bg-amber-500'
                : 'bg-yellow-500'
            }`}
            style={{ width: `${performer.score}%` }}
          />
        </div>
      </div>

      {/* Badge */}
      {performer.badge && (
        <div className="flex items-center justify-between">
          <div
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold
                        animate-badge-pulse ${
              performer.badge === 'Trending'
                ? 'bg-red-500/15 text-red-400'
                : 'bg-emerald-500/15 text-emerald-400'
            }`}
          >
            {performer.badge === 'Trending' ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <Star className="w-3 h-3 star-glow" />
            )}
            {performer.badge === 'Trending' ? 'В тренде' : 'Растущая звезда'}
          </div>

          <div className="flex items-center gap-0.5">
            <Star className="w-3 h-3 text-gold star-glow fill-gold" />
            <Star className="w-3 h-3 text-gold star-glow fill-gold" />
            <Star className="w-3 h-3 text-gold star-glow fill-gold" />
            <Star className="w-3 h-3 text-gold/30" />
            <Star className="w-3 h-3 text-gold/30" />
          </div>
        </div>
      )}
    </div>
  );
}
