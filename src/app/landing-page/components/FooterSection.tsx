import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { Zap } from 'lucide-react';

export default function FooterSection() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-16">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <AppLogo size={28} />
            <span className="font-bold text-base text-white">PathForge</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
              <Zap size={10} />
              v1.0
            </span>
          </div>
          <p className="text-xs text-zinc-600 text-center sm:text-right">
            AI-Adaptive Onboarding Engine · GenAI + ANN + RNN ·{' '}
            <span className="text-zinc-500">Built with FastAPI + React 18 + PyTorch</span>
          </p>
          <div className="flex items-center gap-4 text-xs text-zinc-600">
            <Link href="/landing-page" className="hover:text-zinc-400 transition-colors">
              Analyze
            </Link>
            <Link href="/results-page" className="hover:text-zinc-400 transition-colors">
              Results Demo
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}