import React from 'react';
import {
  ShieldCheck,
  GitMerge,
  BarChart3,
  BookMarked,
  Sparkles,
  Clock,
} from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'Claude-Powered Reasoning',
    description:
      'Every analysis includes a natural language reasoning trace — not just results, but why each skill gap was identified and how the roadmap was ordered.',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/8',
  },
  {
    icon: GitMerge,
    title: 'Prerequisite-Aware DAG',
    description:
      'Courses are ordered using NetworkX DAG traversal. You\'ll never be assigned an advanced course before its prerequisites — the order is always learnable.',
    color: 'text-pink-400',
    bg: 'bg-pink-500/8',
  },
  {
    icon: BarChart3,
    title: 'GRU Mastery Probability',
    description:
      'The PyTorch GRU model scores your current mastery for each skill (0–100%) and estimates how much each course will boost it based on your background.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/8',
  },
  {
    icon: BookMarked,
    title: '60-Course Curated Catalog',
    description:
      'Hand-curated courses across Frontend, Backend, DevOps, Data & AI, Soft Skills, and Operations — with real instructors, ratings, and enrollment data.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/8',
  },
  {
    icon: ShieldCheck,
    title: 'Semantic Fuzzy Matching',
    description:
      'The sentence-transformer ANN catches near-matches that exact string comparison misses — "REST experience" counts toward "API design" requirements.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/8',
  },
  {
    icon: Clock,
    title: 'Realistic Time Estimates',
    description:
      'Each roadmap comes with week-by-week estimates calibrated to 10–12 hrs/week of study, based on course difficulty and your existing knowledge state.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/8',
  },
];

export default function FeatureHighlights() {
  return (
    <section className="py-24 border-t border-white/5">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-16">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold font-mono bg-zinc-800 text-zinc-400 border border-white/8 mb-4">
            CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Built for Precision, Not Guesswork
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Every feature is designed to give you a learning plan you can actually trust and act on.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {features?.map((feature) => (
            <div key={feature?.title} className="glass-card-hover rounded-2xl p-6">
              <div className={`inline-flex p-2.5 rounded-xl ${feature?.bg} mb-4`}>
                <feature.icon size={22} className={feature?.color} />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{feature?.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{feature?.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}