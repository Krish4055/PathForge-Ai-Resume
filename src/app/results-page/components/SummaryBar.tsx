import React from 'react';
import { Target, AlertTriangle, Clock, BookOpen, TrendingUp } from 'lucide-react';
import type { AnalysisResult } from '@/data/mockAnalysisResult';

interface Props {
  result: AnalysisResult;
}

export default function SummaryBar({ result }: Props) {
  const metrics = [
    {
      icon: Target,
      label: 'Skill Match Rate',
      value: `${result.matchRate}%`,
      sub: `${result.matchedSkills.length} of ${result.matchedSkills.length + result.gapSkills.length} skills`,
      color: result.matchRate >= 70 ? 'text-emerald-400' : result.matchRate >= 50 ? 'text-amber-400' : 'text-red-400',
      bg: result.matchRate >= 70 ? 'bg-emerald-500/8 border-emerald-500/15' : result.matchRate >= 50 ? 'bg-amber-500/8 border-amber-500/15' : 'bg-red-500/8 border-red-500/15',
      barColor: result.matchRate >= 70 ? '#22c55e' : result.matchRate >= 50 ? '#f59e0b' : '#ef4444',
      barWidth: result.matchRate,
    },
    {
      icon: AlertTriangle,
      label: 'Skill Gaps',
      value: String(result.gapCount),
      sub: `${result.gapSkills.filter((g) => g.priority === 'critical').length} critical priority`,
      color: 'text-red-400',
      bg: 'bg-red-500/8 border-red-500/15',
      barColor: '#ef4444',
      barWidth: Math.min(100, result.gapCount * 11),
    },
    {
      icon: Clock,
      label: 'Weeks to Ready',
      value: `${result.totalWeeks}w`,
      sub: '@ 10–12 hrs/week',
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/8 border-indigo-500/15',
      barColor: '#6366f1',
      barWidth: Math.min(100, (result.totalWeeks / 24) * 100),
    },
    {
      icon: BookOpen,
      label: 'Courses Assigned',
      value: String(result.courseCount),
      sub: 'from 60-course catalog',
      color: 'text-pink-400',
      bg: 'bg-pink-500/8 border-pink-500/15',
      barColor: '#ec4899',
      barWidth: Math.min(100, (result.courseCount / 12) * 100),
    },
    {
      icon: TrendingUp,
      label: 'Avg Mastery Score',
      value: `${Math.round(result.avgMastery * 100)}%`,
      sub: 'GRU knowledge trace',
      color: 'text-violet-400',
      bg: 'bg-violet-500/8 border-violet-500/15',
      barColor: '#8b5cf6',
      barWidth: Math.round(result.avgMastery * 100),
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className={`rounded-2xl border p-5 ${metric.bg}`}
        >
          <div className="flex items-center justify-between mb-3">
            <metric.icon size={16} className={metric.color} />
          </div>
          <div className={`text-2xl font-black font-mono tabular-nums mb-0.5 ${metric.color}`}>
            {metric.value}
          </div>
          <div className="text-xs font-semibold text-zinc-300 mb-1">{metric.label}</div>
          <div className="text-xs text-zinc-600 mb-3">{metric.sub}</div>
          {/* Mini progress bar */}
          <div className="h-1 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${metric.barWidth}%`, background: metric.barColor }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}