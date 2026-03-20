'use client';

import React, { useState } from 'react';
import { Brain, ChevronDown, ChevronUp, Sparkles, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  trace: string;
}

export default function ReasoningTrace({ trace }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(trace);
    setCopied(true);
    toast.success('Reasoning trace copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  // Parse bold markdown **text** into JSX
  const renderTrace = (text: string) => {
    return text.split('\n\n').map((para, pIdx) => {
      const parts = para.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={pIdx} className="text-sm text-zinc-400 leading-relaxed mb-4 last:mb-0">
          {parts.map((part, partIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <span key={partIdx} className="font-semibold text-zinc-200">
                  {part.slice(2, -2)}
                </span>
              );
            }
            return <span key={partIdx}>{part}</span>;
          })}
        </p>
      );
    });
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Header */}
      <button
        className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left hover:bg-white/3 transition-all"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <Brain size={18} className="text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">AI Reasoning Trace</h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
                <Sparkles size={10} />
                Claude
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Why these gaps were identified and how the roadmap was ordered
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); handleCopy(); }}
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all"
            aria-label="Copy reasoning trace"
          >
            {copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
          </button>
          {expanded ? (
            <ChevronUp size={18} className="text-zinc-500" />
          ) : (
            <ChevronDown size={18} className="text-zinc-500" />
          )}
        </div>
      </button>

      {/* Collapsed preview */}
      {!expanded && (
        <div className="px-5 sm:px-6 pb-5 border-t border-white/5 pt-4">
          <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">
            {trace.replace(/\*\*/g, '').split('\n\n')[0]}
          </p>
          <button
            onClick={() => setExpanded(true)}
            className="mt-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Read full reasoning →
          </button>
        </div>
      )}

      {/* Expanded full trace */}
      {expanded && (
        <div className="px-5 sm:px-6 pb-6 border-t border-white/5 pt-5">
          <div className="terminal-bg rounded-xl p-5 scrollbar-thin">
            <div className="flex items-center gap-1.5 mb-4 pb-3 border-b border-white/5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
              <span className="ml-2 text-xs font-mono text-zinc-600">
                claude-3-5-sonnet · reasoning_trace.md
              </span>
            </div>
            <div className="prose prose-sm prose-invert max-w-none">
              {renderTrace(trace)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}