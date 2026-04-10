"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Trophy,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  ArrowRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const QUICK_LINKS = [
  { label: "Главная", href: "#" },
  { label: "О нас", href: "#" },
  { label: "Контакты", href: "#" },
  { label: "Реклама", href: "#" },
  { label: "Вакансии", href: "#" },
];

const SPORTS = [
  { label: "NFL", href: "#" },
  { label: "NBA", href: "#" },
  { label: "MLB", href: "#" },
  { label: "NHL", href: "#" },
  { label: "Фэнтези", href: "#" },
];

const SOCIALS = [
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
];

export function Footer() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (!email) return;
    setSubscribed(true);
    toast({
      title: "Добро пожаловать в Hub!",
      description: "Вы будете получать нашу премиальную рассылку в каждый игровой день.",
      className: "border-gold/30",
    });
    setEmail("");
  };

  return (
    <footer className="relative mt-auto">
      {/* Gold accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="glass border-t border-border dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <a href="#" className="flex items-center gap-2 group">
                <Trophy className="w-6 h-6 text-gold" />
                <span className="text-lg font-bold tracking-tight">
                  <span className="text-foreground">US SPORTS</span>{" "}
                  <span className="text-gradient-gold">HUB</span>
                </span>
              </a>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
                Элитный спортивный опыт. Там, где данные встречаются с драмой, а каждая
                история рассказывается с кинематографической точностью.
              </p>
              {/* Socials */}
              <div className="flex items-center gap-3 mt-5">
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-9 h-9 rounded-full border border-border dark:border-white/10 flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/30 transition-colors"
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-bold tracking-[0.2em] text-foreground uppercase mb-4">
                Быстрые ссылки
              </h4>
              <ul className="space-y-2.5">
                {QUICK_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-gold transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sports */}
            <div>
              <h4 className="text-xs font-bold tracking-[0.2em] text-foreground uppercase mb-4">
                Виды спорта
              </h4>
              <ul className="space-y-2.5">
                {SPORTS.map((sport) => (
                  <li key={sport.label}>
                    <a
                      href={sport.href}
                      className="text-sm text-muted-foreground hover:text-gold transition-colors"
                    >
                      {sport.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-xs font-bold tracking-[0.2em] text-foreground uppercase mb-4">
                Рассылка
              </h4>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Премиальные аналитические материалы в ваш почтовый ящик в каждый игровой день.
              </p>
              {!subscribed ? (
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-muted border-border dark:bg-white/5 dark:border-white/10 text-foreground text-sm h-10 focus:border-gold/40 placeholder:text-muted-foreground/50"
                    onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                  />
                  <Button
                    onClick={handleSubscribe}
                    size="icon"
                    className="bg-gold text-gold-foreground hover:bg-gold/90 flex-shrink-0 h-10 w-10"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gold text-sm font-medium">
                  <Mail className="w-4 h-4" />
                  <span>Подписано!</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-border dark:border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} US Sports Hub. Все права защищены.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <a href="#" className="hover:text-gold transition-colors">
                Политика конфиденциальности
              </a>
              <a href="#" className="hover:text-gold transition-colors">
                Условия использования
              </a>
              <a href="#" className="hover:text-gold transition-colors">
                Доступность
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
