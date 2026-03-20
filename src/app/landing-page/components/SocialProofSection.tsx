import React from 'react';
import { Users, BookOpen, Target, Layers } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '12,400+',
    label: 'Resumes Analyzed',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
  },
  {
    icon: BookOpen,
    value: '60',
    label: 'Curated Courses',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
  },
  {
    icon: Target,
    value: '94.2%',
    label: 'Skill Match Accuracy',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Layers,
    value: '3',
    label: 'AI Model Layers',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
];

export default function SocialProofSection() {
  return (
    <section className="border-y border-white/5 bg-zinc-900/30">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-16 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats?.map((stat) => (
            <div
              key={stat?.label}
              className="flex items-center gap-4 p-4 rounded-xl glass-card"
            >
              <div className={`p-2.5 rounded-lg ${stat?.bg}`}>
                <stat.icon size={20} className={stat?.color} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white font-mono tabular-nums">
                  {stat?.value}
                </div>
                <div className="text-xs text-zinc-500 font-medium mt-0.5">{stat?.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}