import React from 'react';
import Topbar from '@/components/Topbar';
import HeroSection from './components/HeroSection';
import HowItWorksSection from './components/HowItWorksSection';
import SocialProofSection from './components/SocialProofSection';
import UploadFormSection from './components/UploadFormSection';
import FeatureHighlights from './components/FeatureHighlights';
import FooterSection from './components/FooterSection';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 overflow-x-hidden">
      <Topbar />
      <main className="pt-16">
        <HeroSection />
        <SocialProofSection />
        <UploadFormSection />
        <HowItWorksSection />
        <FeatureHighlights />
        <FooterSection />
      </main>
    </div>
  );
}