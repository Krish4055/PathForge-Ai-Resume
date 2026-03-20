'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Lock,
  Unlock,
  Clock,
  Star,
  Users,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import type { RoadmapCourse } from '@/data/mockAnalysisResult';

interface Props {
  roadmap: RoadmapCourse[];
}

const DOMAIN_COLORS: Record<string, { text: string; bg: string; border: string; dot: string }> = {
  Frontend:   { text: 'text-indigo-400',  bg: 'bg-indigo-500/10',  border: 'border-indigo-500/30',  dot: '#6366f1' },
  Backend:    { text: 'text-pink-400',    bg: 'bg-pink-500/10',    border: 'border-pink-500/30',    dot: '#ec4899' },
  DevOps:     { text: 'text-violet-400',  bg: 'bg-violet-500/10',  border: 'border-violet-500/30',  dot: '#8b5cf6' },
  'Data & AI':{ text: 'text-cyan-400',    bg: 'bg-cyan-500/10',    border: 'border-cyan-500/30',    dot: '#06b6d4' },
  'Soft Skills':{ text: 'text-amber-400', bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   dot: '#f59e0b' },
  Operations: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', dot: '#22c55e' },
};

const LEVEL_COLORS: Record<string, string> = {
  Beginner:     'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Intermediate: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Advanced:     'text-red-400 bg-red-500/10 border-red-500/20',
};

const ENROLLMENT_LABELS: Record<string, string> = {
  'c012': '11.3k',
  'c017': '6.2k',
  'c025': '10.4k',
  'c023': '17.3k',
  'c024': '11.8k',
  'c033': '14.7k',
  'c036': '6.8k',
  'c035': '18.6k',
};

export default function RoadmapTimeline({ roadmap }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>('c012');
  const [domainFilter, setDomainFilter] = useState<string>('All');

  const domains = ['All', ...Array.from(new Set(roadmap.map((c) => c.domain)))];
  const filtered = domainFilter === 'All' ? roadmap : roadmap.filter((c) => c.domain === domainFilter);

  const totalWeeks = roadmap.reduce((a, c) => a + c.durationWeeks, 0);

  return (
    <div>
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white">Personalized Learning Roadmap</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            {roadmap.length} courses · {totalWeeks} weeks · prerequisite-ordered by NetworkX DAG
          </p>
        </div>

        {/* Domain filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {domains.map((d) => {
            const cfg = d !== 'All' ? DOMAIN_COLORS[d] : null;
            return (
              <button
                key={d}
                onClick={() => setDomainFilter(d)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-150 border ${
                  domainFilter === d
                    ? cfg
                      ? `${cfg.bg} ${cfg.text} ${cfg.border}`
                      : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' :'bg-zinc-900 text-zinc-500 border-white/5 hover:text-zinc-300 hover:border-white/10'
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-6 top-8 bottom-8 w-px roadmap-connector hidden sm:block" />

        <div className="space-y-4">
          {filtered.map((course, idx) => {
            const cfg = DOMAIN_COLORS[course.domain] || DOMAIN_COLORS['Frontend'];
            const isExpanded = expandedId === course.courseId;
            const isLast = idx === filtered.length - 1;

            return (
              <div key={course.courseId} className="relative sm:pl-16">
                {/* Position dot */}
                <div
                  className="absolute left-3.5 top-5 w-5 h-5 rounded-full border-2 border-zinc-950 hidden sm:flex items-center justify-center z-10"
                  style={{ background: cfg.dot }}
                >
                  <span className="text-[9px] font-black text-white">{course.position}</span>
                </div>

                {/* Course card */}
                <div
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    course.isUnlocked
                      ? `glass-card-hover ${isExpanded ? `${cfg.bg} ${cfg.border}` : ''}`
                      : 'bg-zinc-900/30 border-white/5 opacity-70'
                  }`}
                >
                  {/* Card header — always visible */}
                  <button
                    className="w-full flex items-center gap-4 p-4 sm:p-5 text-left"
                    onClick={() => setExpandedId(isExpanded ? null : course.courseId)}
                    aria-expanded={isExpanded}
                  >
                    {/* Position badge (mobile) */}
                    <div
                      className="sm:hidden flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white"
                      style={{ background: cfg.dot }}
                    >
                      {course.position}
                    </div>

                    {/* Lock/unlock icon */}
                    <div className={`flex-shrink-0 p-2 rounded-lg ${cfg.bg}`}>
                      {course.isUnlocked ? (
                        <Unlock size={16} className={cfg.text} />
                      ) : (
                        <Lock size={16} className="text-zinc-600" />
                      )}
                    </div>

                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="text-sm font-bold text-white truncate">
                              {course.title}
                            </h3>
                            {!course.isUnlocked && (
                              <span className="text-xs font-mono text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded-md border border-white/5">
                                Locked — complete prerequisites first
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                            >
                              {course.domain}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${LEVEL_COLORS[course.level]}`}
                            >
                              {course.level}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-zinc-500">
                              <Clock size={11} />
                              {course.durationWeeks}w
                            </span>
                            <span className="flex items-center gap-1 text-xs text-zinc-500">
                              <Star size={11} className="text-amber-400" />
                              {course.rating}
                            </span>
                          </div>
                        </div>

                        {/* Mastery gain pill */}
                        <div className="flex-shrink-0 text-right">
                          <div
                            className={`text-sm font-black font-mono tabular-nums ${cfg.text}`}
                          >
                            +{Math.round(course.masteryGain * 100)}%
                          </div>
                          <div className="text-xs text-zinc-600">mastery gain</div>
                        </div>
                      </div>
                    </div>

                    {/* Expand chevron */}
                    <div className="flex-shrink-0 text-zinc-500">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-white/5 pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Addresses gaps */}
                        <div>
                          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2.5">
                            Addresses Gap Skills
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {course.addressesGaps.map((gap) => (
                              <span
                                key={gap}
                                className="px-2.5 py-1 rounded-lg text-xs font-medium skill-badge-gap"
                              >
                                {gap}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Prerequisites */}
                        <div>
                          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2.5">
                            Prerequisites
                          </div>
                          {course.prerequisites.length === 0 ? (
                            <span className="text-xs text-zinc-500 flex items-center gap-1.5">
                              <Unlock size={12} className="text-emerald-400" />
                              No prerequisites — start immediately
                            </span>
                          ) : (
                            <div className="flex flex-wrap gap-1.5">
                              {course.prerequisites.map((prereqId) => {
                                const prereqCourse = roadmap.find((c) => c.courseId === prereqId);
                                return (
                                  <span
                                    key={prereqId}
                                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-800 text-zinc-400 border border-white/8"
                                  >
                                    <ArrowRight size={10} />
                                    {prereqCourse?.title || prereqId}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Instructor + enrollments */}
                        <div className="sm:col-span-2 flex items-center gap-6 pt-3 border-t border-white/5">
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <BookOpen size={13} className="text-zinc-600" />
                            <span>
                              Instructor:{' '}
                              <span className="text-zinc-300 font-medium">{course.instructor}</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <Users size={13} className="text-zinc-600" />
                            <span>
                              {ENROLLMENT_LABELS[course.courseId] || '5k+'} enrolled
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <Clock size={13} className="text-zinc-600" />
                            <span>{course.durationWeeks} weeks to complete</span>
                          </div>

                          {course.isUnlocked && (
                            <button
                              className="ml-auto px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-all active:scale-95 hover:opacity-90"
                              style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}
                              onClick={() => {
                                // Backend integration point: POST /api/roadmap/enroll { courseId }
                              }}
                            >
                              Start Course
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Connector arrow between cards */}
                {!isLast && (
                  <div className="hidden sm:flex items-center justify-center py-1 ml-0">
                    <div className="w-px h-4 bg-gradient-to-b from-zinc-700 to-transparent" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}