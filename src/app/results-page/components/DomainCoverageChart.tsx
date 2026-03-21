'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface Props {
  domainCoverage: { domain: string; matched: number; total: number }[];
}

const DOMAIN_COLORS: Record<string, string> = {
  Frontend: '#6366f1',
  Backend: '#ec4899',
  DevOps: '#8b5cf6',
  'Data & AI': '#06b6d4',
  'Soft Skills': '#f59e0b',
  Operations: '#22c55e',
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number; payload: { domain: string; matched: number; total: number; pct: number } }[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-zinc-900 border border-white/10 rounded-xl p-3 shadow-xl text-xs font-mono">
      <div className="font-bold text-white mb-1">{d.domain}</div>
      <div className="text-zinc-400">
        {d.matched} / {d.total} skills matched
      </div>
      <div className="text-indigo-400 font-semibold mt-0.5">{d.pct}% coverage</div>
    </div>
  );
}

export default function DomainCoverageChart({ domainCoverage }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const data = domainCoverage.map((d) => ({
    ...d,
    pct: Math.round((d.matched / d.total) * 100),
    gap: d.total - d.matched,
  }));

  if (!mounted) {
    return (
      <div className="glass-card rounded-2xl p-6 h-[400px] flex items-center justify-center">
        <div className="text-zinc-500 text-sm font-mono animate-pulse">Initializing Visualization...</div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-base font-bold text-white mb-1">Domain Coverage Breakdown</h2>
        <p className="text-xs text-zinc-500">
          Matched skills vs. total JD-required skills per domain — identifies where your biggest gaps cluster.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-center">
        {/* Bar chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="domain"
                tick={{ fill: '#71717a', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#71717a', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="matched" name="Matched" radius={[4, 4, 0, 0]} maxBarSize={40}>
                {data.map((entry) => (
                  <Cell
                    key={entry.domain}
                    fill={DOMAIN_COLORS[entry.domain] || '#6366f1'}
                    fillOpacity={0.8}
                  />
                ))}
              </Bar>
              <Bar dataKey="gap" name="Gap" radius={[4, 4, 0, 0]} fill="rgba(239,68,68,0.25)" maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Domain cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-2 gap-3">
          {data.map((d) => {
            const color = DOMAIN_COLORS[d.domain] || '#6366f1';
            return (
              <div
                key={d.domain}
                className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-zinc-300">{d.domain}</span>
                  <span
                    className="text-sm font-black font-mono tabular-nums"
                    style={{ color }}
                  >
                    {d.pct}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${d.pct}%`, background: color }}
                  />
                </div>
                <div className="text-xs text-zinc-600 mt-1.5 font-mono">
                  {d.matched}/{d.total} skills
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}