import React from 'react';
import LoadingPipeline from './components/LoadingPipeline';

export default function LoadingScreenPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center overflow-hidden relative">
      {/* Background radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(99,102,241,0.08) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />
      <LoadingPipeline />
    </div>
  );
}