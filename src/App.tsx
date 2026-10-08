/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RealEstateProvider, useRealEstate } from './context/RealEstateContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturedListings } from './components/FeaturedListings';
import { NeighborhoodHighlights } from './components/NeighborhoodHighlights';
import { PropertyExplorer } from './components/PropertyExplorer';
import { PropertyDetail } from './components/PropertyDetail';
import { AgentDashboard } from './components/AgentDashboard';
import { SavedProperties } from './components/SavedProperties';
import { QuickViewModal } from './components/QuickViewModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import { Footer } from './components/Footer';
import { PropertyListing } from './types';
import { CheckCircle2 } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { 
    activeTab, 
    quickViewProperty, 
    setQuickViewProperty, 
    darkMode,
    toast 
  } = useRealEstate();

  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);

  const handleQuickView = (property: PropertyListing) => {
    setQuickViewProperty(property);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-stone-50 text-stone-900'
    }`}>
      {/* 3-Zone Top Navigation Bar */}
      <Navbar onOpenArchitecture={() => setIsArchitectureModalOpen(true)} />

      {/* Main Content Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            <HeroSection />
            <FeaturedListings onQuickView={handleQuickView} />
            <NeighborhoodHighlights />
          </div>
        )}

        {activeTab === 'listings' && (
          <PropertyExplorer onQuickView={handleQuickView} />
        )}

        {activeTab === 'detail' && (
          <PropertyDetail />
        )}

        {activeTab === 'dashboard' && (
          <AgentDashboard />
        )}

        {activeTab === 'saved' && (
          <SavedProperties onQuickView={handleQuickView} />
        )}
      </main>

      {/* Footer */}
      <Footer onOpenArchitecture={() => setIsArchitectureModalOpen(true)} />

      {/* Quick View Modal */}
      {quickViewProperty && (
        <QuickViewModal
          property={quickViewProperty}
          onClose={() => setQuickViewProperty(null)}
        />
      )}

      {/* Prisma Schema & Terminal Setup Modal */}
      {isArchitectureModalOpen && (
        <ArchitectureModal
          darkMode={darkMode}
          onClose={() => setIsArchitectureModalOpen(false)}
        />
      )}

      {/* Toast Notification HUD */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-2xl bg-stone-900 text-stone-100 border border-stone-700 animate-in fade-in slide-in-from-bottom-4 text-xs font-mono">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <RealEstateProvider>
      <MainLayout />
    </RealEstateProvider>
  );
}
