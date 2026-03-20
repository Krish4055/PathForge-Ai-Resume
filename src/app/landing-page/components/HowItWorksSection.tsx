import React from 'react';
import { FileSearch, Network, GitBranch, ArrowRight } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: FileSearch,
    title: 'Skill Extraction',
    subtitle: 'Claude API',
    description:
      'Claude parses your resume and the job description, extracting structured skill lists, experience levels, and role requirements. Handles non-standard formats, abbreviations, and implicit skills.',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/20',
    glow: 'shadow-indigo-500/20',
    tags: ['pdfplumber', 'anthropic SDK', 'skill normalization'],
  },
  {
    step: '02',
    icon: Network,
    title: 'Semantic Matching',
    subtitle: 'sentence-transformers',
    description:
      'A fine-tuned sentence-transformer model computes cosine similarity between your skill embeddings and JD requirements. Catches fuzzy matches — "Node.js" ↔ "Backend APIs", "ML experience" ↔ "PyTorch".',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10 border-pink-500/20',
    glow: 'shadow-pink-500/20',
    tags: ['all-MiniLM-L6-v2', 'cosine similarity', 'fuzzy normalization'],
  },
  {
    step: '03',
    icon: GitBranch,
    title: 'Knowledge Tracing',
    subtitle: 'PyTorch GRU',
    description:
      'A GRU-based recurrent model traces your knowledge state across skill prerequisites, estimating mastery probability for each gap. Builds a DAG-ordered roadmap from the 60-course catalog.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/20',
    glow: 'shadow-violet-500/20',
    tags: ['PyTorch GRU', 'NetworkX DAG', 'mastery scoring'],
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 border-t border-white/5">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-16">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold font-mono bg-zinc-800 text-zinc-400 border border-white/8 mb-4">
            HOW IT WORKS
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Three AI Layers, One Precise Roadmap
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            PathForge chains three specialized AI models, each solving a distinct part of the
            skill gap problem — from raw text to a personalized, ordered learning plan.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8 relative">
          {/* Connecting arrows (desktop) */}
          <div className="hidden lg:flex absolute top-12 left-[33%] right-[33%] items-center justify-between pointer-events-none z-10 px-4">
            <ArrowRight size={20} className="text-zinc-700" />
            <ArrowRight size={20} className="text-zinc-700" />
          </div>

          {steps?.map((step) => (
            <div
              key={step?.step}
              className="relative glass-card-hover rounded-2xl p-8"
            >
              {/* Step number */}
              <div className="flex items-start justify-between mb-6">
                <div className={`p-3 rounded-xl border ${step?.bg}`}>
                  <step.icon size={24} className={step?.color} />
                </div>
                <span className={`text-4xl font-black font-mono ${step?.color} opacity-20`}>
                  {step?.step}
                </span>
              </div>

              <div className="mb-1 text-xs font-mono font-medium text-zinc-500 uppercase tracking-widest">
                {step?.subtitle}
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{step?.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-5">{step?.description}</p>

              {/* Tech tags */}
              <div className="flex flex-wrap gap-1.5">
                {step?.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-zinc-800 text-zinc-400 border border-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}