'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';
import type { SkillMatch, SkillGap } from '@/data/mockAnalysisResult';

interface Props {
  matchedSkills: SkillMatch[];
  gapSkills: SkillGap[];
}

const priorityConfig = {
  critical: { label: 'Critical', color: 'text-red-400', bg: 'bg-red-500/12 border-red-500/25' },
  high: { label: 'High', color: 'text-orange-400', bg: 'bg-orange-500/12 border-orange-500/25' },
  medium: { label: 'Medium', color: 'text-amber-400', bg: 'bg-amber-500/12 border-amber-500/25' },
  low: { label: 'Low', color: 'text-zinc-400', bg: 'bg-zinc-500/12 border-zinc-500/25' },
};

const sourceConfig = {
  exact: { label: 'Exact Match', color: 'text-emerald-400' },
  semantic: { label: 'Semantic', color: 'text-indigo-400' },
  inferred: { label: 'Inferred', color: 'text-amber-400' },
};

export default function SkillGapSection({ matchedSkills, gapSkills }: Props) {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Matched skills */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <h2 className="text-base font-bold text-white">Matched Skills</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
              {matchedSkills.length}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-zinc-500">
            <Info size={12} />
            <span>GRU mastery scores</span>
          </div>
        </div>

        <div className="space-y-2.5">
          {matchedSkills.map((skill) => (
            <div
              key={skill.skill}
              className="group relative p-3 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-emerald-500/25 hover:bg-emerald-500/5 transition-all duration-150 cursor-default"
              onMouseEnter={() => setHoveredSkill(skill.skill)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-sm font-semibold text-zinc-200">{skill.skill}</span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`text-xs font-mono font-medium ${sourceConfig[skill.source].color}`}
                  >
                    {sourceConfig[skill.source].label}
                  </span>
                  <span className="text-sm font-bold font-mono tabular-nums text-emerald-400">
                    {Math.round(skill.masteryScore * 100)}%
                  </span>
                </div>
              </div>

              {/* Mastery bar */}
              <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${skill.masteryScore * 100}%`,
                    background: `linear-gradient(90deg, #22c55e, #4ade80)`,
                  }}
                />
              </div>

              {/* Semantic similarity tooltip on hover */}
              {hoveredSkill === skill.skill && (
                <div className="absolute bottom-full left-0 mb-2 z-20 px-3 py-2 rounded-lg bg-zinc-800 border border-white/10 shadow-xl text-xs font-mono text-zinc-300 whitespace-nowrap">
                  Semantic similarity: {(skill.semanticSimilarity * 100).toFixed(0)}% · Source: {skill.source}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Gap skills */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <XCircle size={18} className="text-red-400" />
            <h2 className="text-base font-bold text-white">Skill Gaps</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-red-500/15 text-red-400 border border-red-500/25">
              {gapSkills.length}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-zinc-500">
            <AlertCircle size={12} />
            <span>by JD priority</span>
          </div>
        </div>

        <div className="space-y-2.5">
          {gapSkills.map((gap) => {
            const cfg = priorityConfig[gap.priority];
            return (
              <div
                key={gap.skill}
                className={`p-3 rounded-xl border transition-all duration-150 ${cfg.bg} hover:opacity-90`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      gap.priority === 'critical' ? 'bg-red-400' :
                      gap.priority === 'high' ? 'bg-orange-400' :
                      gap.priority === 'medium' ? 'bg-amber-400' : 'bg-zinc-500'
                    }`} />
                    <span className="text-sm font-semibold text-zinc-200 truncate">
                      {gap.skill}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${cfg.bg} ${cfg.color}`}>
                      {cfg.label}
                    </span>
                    <span className="text-xs font-mono text-zinc-500">
                      ×{gap.jdMentionCount} in JD
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}