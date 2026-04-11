"use client";

import { Trophy, Twitter, Instagram, Youtube } from "lucide-react";

const LEAGUES = [
  { label: "NBA", href: "#" },
  { label: "NHL", href: "#" },
  { label: "AHL", href: "#" },
  { label: "KHL", href: "#" },
  { label: "NFL", href: "#" },
  { label: "MLB", href: "#" },
];

const LINKS = [
  { label: "О нас", href: "#" },
  { label: "Контакты", href: "#" },
  { label: "Реклама", href: "#" },
  { label: "Вакансии", href: "#" },
];

const SOCIALS = [
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 mt-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <a href="#" className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-gold" />
              <span className="text-xl font-playfair font-bold text-white">
                USASport
              </span>
            </a>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed max-w-sm">
              Современный спортивный новостной портал. Актуальные новости, 
              статистика и аналитика из мира американского спорта.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-3 mt-6">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold/30 transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Leagues */}
          <div>
            <h4 className="font-inter font-semibold text-xs text-gray-500 uppercase tracking-wide mb-4">
              Лиги
            </h4>
            <ul className="space-y-2">
              {LEAGUES.map((league) => (
                <li key={league.label}>
                  <a
                    href={league.href}
                    className="text-sm text-gray-400 hover:text-gold transition-colors"
                  >
                    {league.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-inter font-semibold text-xs text-gray-500 uppercase tracking-wide mb-4">
              Компания
            </h4>
            <ul className="space-y-2">
              {LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-xs text-gray-500 text-center">
            © {new Date().getFullYear()} USASport. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
