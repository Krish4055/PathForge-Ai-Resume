import React from 'react';
import Topbar from '@/components/Topbar';
import ResultsContent from './components/ResultsContent';

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Topbar />
      <main className="pt-16">
        <ResultsContent />
      </main>
    </div>
  );
}