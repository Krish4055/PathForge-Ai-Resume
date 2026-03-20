'use client';

import React, { useState } from 'react';
import SummaryBar from './SummaryBar';
import SkillGapSection from './SkillGapSection';
import DomainCoverageChart from './DomainCoverageChart';
import RoadmapTimeline from './RoadmapTimeline';
import ReasoningTrace from './ReasoningTrace';
import { Download, Share2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { toast, Toaster } from 'sonner';
import { AnalysisResult, mockAnalysisResult } from '@/data/mockAnalysisResult';

export default function ResultsContent() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'skills' | 'coverage'>('roadmap');

  React.useEffect(() => {
    const savedResult = localStorage.getItem('pathforge_analysis_result');
    if (savedResult) {
      try {
        setResult(JSON.parse(savedResult));
      } catch (e) {
        setResult(mockAnalysisResult);
      }
    } else {
      setResult(mockAnalysisResult); // Fallback for dev
    }
  }, []);

  if (!result) return <div className="p-10 text-center text-zinc-500">Loading analysis results...</div>;

  const handleExport = () => {
    // Backend integration point: GET /api/export/pdf?analysisId=...
    toast.success('Roadmap PDF export started — check your downloads.');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Results link copied to clipboard.');
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-16 py-10">
      <Toaster position="bottom-right" theme="dark" />

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-medium text-zinc-500 uppercase tracking-widest">
              Analysis Results
            </span>
            <span className="text-xs font-mono text-zinc-700">·</span>
            <span className="text-xs font-mono text-zinc-600">
              {new Date(result.analyzedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {result.candidateName}
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Analyzed for{' '}
            <span className="text-indigo-400 font-medium">{result.targetRole}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 border border-white/8 hover:bg-white/5 hover:text-zinc-200 transition-all active:scale-95"
          >
            <Share2 size={15} />
            Share
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 border border-white/8 hover:bg-white/5 hover:text-zinc-200 transition-all active:scale-95"
          >
            <Download size={15} />
            Export PDF
          </button>
          <Link
            href="/landing-page"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white transition-all active:scale-95 hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}
          >
            <RefreshCw size={15} />
            New Analysis
          </Link>
        </div>
      </div>

      {/* Summary bar */}
      <SummaryBar result={result} />

      {/* Tab navigation */}
      <div className="flex items-center gap-1 p-1 bg-zinc-900 rounded-xl border border-white/5 w-fit mb-8">
        {(['roadmap', 'skills', 'coverage'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-150 ${
              activeTab === tab
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
            }`}
          >
            {tab === 'roadmap' ? 'Learning Roadmap' : tab === 'skills' ? 'Skill Gap Analysis' : 'Domain Coverage'}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'roadmap' && (
        <div className="space-y-8">
          <RoadmapTimeline roadmap={result.roadmap} />
          <ReasoningTrace trace={result.reasoningTrace} />
        </div>
      )}

      {activeTab === 'skills' && (
        <SkillGapSection
          matchedSkills={result.matchedSkills}
          gapSkills={result.gapSkills}
        />
      )}

      {activeTab === 'coverage' && (
        <DomainCoverageChart domainCoverage={result.domainCoverage} />
      )}
    </div>
  );
}