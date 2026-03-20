'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { Menu, X, Zap, Github } from 'lucide-react';

const navLinks = [
  { label: 'Analyze', href: '/landing-page' },
  { label: 'Loading Demo', href: '/loading-screen' },
  { label: 'Results Demo', href: '/results-page' },
];

export default function Topbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-screen-2xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/landing-page" className="flex items-center gap-2.5 group">
          <AppLogo size={32} />
          <span className="font-bold text-lg tracking-tight text-white group-hover:text-indigo-400 transition-colors">
            PathForge
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
            <Zap size={10} />
            AI
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks?.map((link) => (
            <Link
              key={link?.href}
              href={link?.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                pathname === link?.href
                  ? 'bg-indigo-500/15 text-indigo-400' :'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
              }`}
            >
              {link?.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-all duration-150"
          >
            <Github size={16} />
            <span>GitHub</span>
          </a>
          <Link
            href="/landing-page"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-all duration-150 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}
          >
            <Zap size={14} />
            Analyze Now
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-zinc-950/95 backdrop-blur-xl border-b border-white/5 p-4 flex flex-col gap-2">
          {navLinks?.map((link) => (
            <Link
              key={link?.href}
              href={link?.href}
              onClick={() => setMobileOpen(false)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                pathname === link?.href
                  ? 'bg-indigo-500/15 text-indigo-400' :'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
              }`}
            >
              {link?.label}
            </Link>
          ))}
          <Link
            href="/landing-page"
            onClick={() => setMobileOpen(false)}
            className="mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}
          >
            <Zap size={14} />
            Analyze Now
          </Link>
        </div>
      )}
    </header>
  );
}