'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, Network, Cpu, CheckCircle2, Loader2, Clock, Zap } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';

interface Stage {
  id: number;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  durationMs: number;
  logs: string[];
}

const STAGES: Stage[] = [
  {
    id: 1,
    icon: Brain,
    title: 'GenAI Skill Extraction',
    subtitle: 'Claude claude-3-5-sonnet-20241022',
    description: 'Parsing resume text and job description, extracting structured skill lists',
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/40',
    durationMs: 7000,
    logs: [
      '→ pdfplumber: extracting text from resume.pdf (3 pages, 847 tokens)',
      '→ anthropic.Anthropic() initialized — model: claude-3-5-sonnet-20241022',
      '→ Sending skill extraction prompt (system + user, 1,204 tokens)',
      '→ Claude response received: 28 resume skills identified',
      '→ Parsing JD: "Senior Full-Stack AI Engineer" — 1,891 chars',
      '→ Claude JD analysis: 19 required skills, 7 preferred skills',
      '→ Normalizing skill names: "Node" → "Node.js", "Postgres" → "PostgreSQL"',
      '→ GenAI extraction complete: 28 resume skills, 26 JD skills',
    ],
  },
  {
    id: 2,
    icon: Network,
    title: 'ANN Semantic Matching',
    subtitle: 'sentence-transformers/all-MiniLM-L6-v2',
    description: 'Computing cosine similarity for fuzzy skill normalization',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/40',
    durationMs: 6000,
    logs: [
      '→ Loading model: all-MiniLM-L6-v2 (22.7M params)',
      '→ Encoding 28 resume skills → 384-dim embeddings',
      '→ Encoding 26 JD skills → 384-dim embeddings',
      '→ Computing cosine similarity matrix (28 × 26)',
      '→ Threshold 0.75: 10 exact/semantic matches found',
      '→ Fuzzy match: "Node.js/Express" ↔ "Backend APIs" (sim=0.88)',
      '→ Fuzzy match: "Agile ceremonies" ↔ "Scrum methodology" (sim=0.85)',
      '→ Gap identification: 9 unmatched JD skills (sim < 0.75)',
      '→ ANN matching complete — match rate: 61.5%',
    ],
  },
  {
    id: 3,
    icon: Cpu,
    title: 'RNN Knowledge Tracing',
    subtitle: 'PyTorch GRU — mastery probability scoring',
    description: 'Tracing knowledge state across skill prerequisites, scoring mastery',
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/40',
    durationMs: 5500,
    logs: [
      '→ Loading GRU model: hidden_size=256, num_layers=2',
      '→ Building skill prerequisite graph with NetworkX (60 nodes, 43 edges)',
      '→ Encoding candidate knowledge state as input sequence',
      '→ GRU forward pass: computing hidden states for 28 matched skills',
      '→ Mastery scores: React(0.82), Python(0.88), TypeScript(0.76)...',
      '→ DAG topological sort: identifying prerequisite-safe course order',
      '→ Roadmap generation: 8 courses selected from 60-course catalog',
      '→ Estimated completion: 18 weeks @ 10-12 hrs/week',
      '→ RNN knowledge tracing complete — avg mastery: 0.58',
    ],
  },
];

type StageStatus = 'pending' | 'active' | 'complete';

export default function LoadingPipeline() {
  const router = useRouter();
  const [currentStage, setCurrentStage] = useState(0); // 0-indexed
  const [stageStatuses, setStageStatuses] = useState<StageStatus[]>(['active', 'pending', 'pending']);
  const [stageProgress, setStageProgress] = useState([0, 0, 0]);
  const [visibleLogs, setVisibleLogs] = useState<string[][]>([[], [], []]);
  const [globalProgress, setGlobalProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(18);
  const [done, setDone] = useState(false);
  const logEndRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);

  const totalDuration = STAGES.reduce((a, s) => a + s.durationMs, 0);

  useEffect(() => {
    let cancelled = false;
    let elapsed = 0;

    const runStage = async (stageIdx: number) => {
      if (cancelled) return;
      const stage = STAGES[stageIdx];
      const logInterval = stage.durationMs / stage.logs.length;

      // Activate stage
      setStageStatuses((prev) => {
        const next = [...prev];
        next[stageIdx] = 'active';
        return next;
      });

      // Progress bar animation
      const progressTick = 50;
      const progressIncrement = (progressTick / stage.durationMs) * 100;
      let localProgress = 0;
      const progressTimer = setInterval(() => {
        if (cancelled) { clearInterval(progressTimer); return; }
        localProgress = Math.min(100, localProgress + progressIncrement);
        setStageProgress((prev) => {
          const next = [...prev];
          next[stageIdx] = localProgress;
          return next;
        });
        elapsed += progressTick;
        const globalPct = Math.min(100, (elapsed / totalDuration) * 100);
        setGlobalProgress(globalPct);
        const secsLeft = Math.max(0, Math.round(((totalDuration - elapsed) / 1000)));
        setTimeRemaining(secsLeft);
      }, progressTick);

      // Log reveal
      for (let logIdx = 0; logIdx < stage.logs.length; logIdx++) {
        await new Promise((r) => setTimeout(r, logInterval));
        if (cancelled) return;
        setVisibleLogs((prev) => {
          const next = prev.map((l) => [...l]);
          next[stageIdx] = stage.logs.slice(0, logIdx + 1);
          return next;
        });
        // Auto-scroll log
        setTimeout(() => {
          logEndRefs.current[stageIdx]?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      }

      clearInterval(progressTimer);
      setStageProgress((prev) => {
        const next = [...prev];
        next[stageIdx] = 100;
        return next;
      });

      // Mark complete
      setStageStatuses((prev) => {
        const next = [...prev];
        next[stageIdx] = 'complete';
        return next;
      });
    };

    const runAll = async () => {
      for (let i = 0; i < STAGES.length; i++) {
        if (cancelled) return;
        setCurrentStage(i);
        await runStage(i);
        await new Promise((r) => setTimeout(r, 400));
      }
      if (!cancelled) {
        setGlobalProgress(100);
        setTimeRemaining(0);
        setDone(true);
        // Navigate to results after brief pause
        setTimeout(() => {
          if (!cancelled) router.push('/results-page');
        }, 1800);
      }
    };

    runAll();
    return () => { cancelled = true; };
  }, [router]);

  return (
    <div className="relative z-10 w-full max-w-2xl xl:max-w-3xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-2.5 mb-5">
          <AppLogo size={36} />
          <span className="font-bold text-xl text-white">PathForge</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          {done ? 'Analysis Complete' : 'Analyzing Your Profile'}
        </h1>
        <p className="text-zinc-400 text-sm">
          {done
            ? 'Roadmap generated — redirecting to results…' :'Three AI layers running in sequence. Please wait.'}
        </p>
      </div>

      {/* Global progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-2">
          <span className="flex items-center gap-1.5">
            {done ? (
              <CheckCircle2 size={13} className="text-emerald-400" />
            ) : (
              <Loader2 size={13} className="animate-spin text-indigo-400" />
            )}
            {done ? 'All stages complete' : `Stage ${currentStage + 1} of ${STAGES.length}`}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={12} />
            {done ? '0s remaining' : `~${timeRemaining}s remaining`}
          </span>
        </div>
        <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300 progress-glow"
            style={{
              width: `${globalProgress}%`,
              background: 'linear-gradient(90deg, #6366f1, #ec4899)',
            }}
          />
        </div>
        <div className="text-right text-xs font-mono text-zinc-600 mt-1">
          {Math.round(globalProgress)}%
        </div>
      </div>

      {/* Stage cards */}
      <div className="space-y-4">
        {STAGES.map((stage, idx) => {
          const status = stageStatuses[idx];
          const progress = stageProgress[idx];
          const logs = visibleLogs[idx];

          return (
            <div
              key={stage.id}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                status === 'active'
                  ? `${stage.bgColor} ${stage.borderColor}`
                  : status === 'complete'
                  ? 'bg-zinc-900/60 border-emerald-500/20' :'bg-zinc-900/30 border-white/5 opacity-50'
              }`}
            >
              {/* Stage header */}
              <div className="flex items-center gap-4 p-4">
                <div
                  className={`p-2.5 rounded-xl flex-shrink-0 ${
                    status === 'complete'
                      ? 'bg-emerald-500/15'
                      : status === 'active'
                      ? stage.bgColor
                      : 'bg-zinc-800'
                  }`}
                >
                  {status === 'complete' ? (
                    <CheckCircle2 size={20} className="text-emerald-400" />
                  ) : status === 'active' ? (
                    <stage.icon size={20} className={`${stage.color} animate-pulse`} />
                  ) : (
                    <stage.icon size={20} className="text-zinc-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3
                      className={`text-sm font-bold ${
                        status === 'pending' ? 'text-zinc-500' : 'text-white'
                      }`}
                    >
                      {stage.title}
                    </h3>
                    {status === 'active' && (
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono ${stage.bgColor} ${stage.color} border ${stage.borderColor}`}
                      >
                        <Loader2 size={9} className="animate-spin" />
                        Running
                      </span>
                    )}
                    {status === 'complete' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                        <CheckCircle2 size={9} />
                        Done
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono text-zinc-500 mt-0.5 truncate">
                    {stage.subtitle}
                  </div>
                </div>

                {status !== 'pending' && (
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-mono font-bold text-white">
                      {Math.round(progress)}%
                    </div>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              {status !== 'pending' && (
                <div className="px-4 pb-3">
                  <div className="h-1 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-200"
                      style={{
                        width: `${progress}%`,
                        background:
                          status === 'complete'
                            ? 'linear-gradient(90deg, #22c55e, #4ade80)' :'linear-gradient(90deg, #6366f1, #ec4899)',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Log terminal */}
              {(status === 'active' || status === 'complete') && logs.length > 0 && (
                <div className="mx-4 mb-4 terminal-bg rounded-xl p-3 max-h-36 overflow-y-auto scrollbar-thin">
                  <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-white/5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                    <span className="ml-2 text-xs font-mono text-zinc-600">
                      pathforge-engine · stage-{stage.id}.log
                    </span>
                  </div>
                  <div className="space-y-1">
                    {logs.map((log, logIdx) => (
                      <div
                        key={logIdx}
                        className="text-xs font-mono leading-relaxed animate-fade-in"
                      >
                        <span className={`${stage.color} opacity-60`}>
                          {String(logIdx + 1).padStart(2, '0')}
                        </span>
                        <span className="text-zinc-500 mx-2">│</span>
                        <span className="text-zinc-300">{log}</span>
                      </div>
                    ))}
                    {status === 'active' && (
                      <div className="flex items-center gap-1 text-xs font-mono text-zinc-600">
                        <span>{'>'}</span>
                        <span className="animate-type-cursor">█</span>
                      </div>
                    )}
                  </div>
                  <div ref={(el) => { logEndRefs.current[idx] = el; }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Done state */}
      {done && (
        <div className="mt-6 flex items-center justify-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 animate-pulse-glow">
          <Zap size={18} className="text-emerald-400" />
          <span className="text-sm font-semibold text-emerald-300">
            Analysis complete — loading your personalized roadmap
          </span>
        </div>
      )}
    </div>
  );
}