import React, { useState } from 'react';
import { Mail, Check, ArrowRight } from 'lucide-react';
import { useRealEstate } from '../context/RealEstateContext';

export const Footer: React.FC<{ onOpenArchitecture: () => void }> = ({ onOpenArchitecture }) => {
  const { darkMode, showToast, setActiveTab, setFilters } = useRealEstate();
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setSubscribed(true);
    showToast('Subscribed to ZS-Studios Private Market Intelligence.');
    setEmailInput('');
  };

  const navigateToMarket = (city: string) => {
    setFilters((prev) => ({
      ...prev,
      location: city,
    }));
    setActiveTab('listings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`border-t transition-colors ${
      darkMode ? 'bg-slate-950 border-slate-900 text-slate-400' : 'bg-stone-900 border-stone-800 text-stone-300'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand Column with ZS-Studios Logo Badge */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 px-3 bg-black text-white flex items-center justify-center rounded-sm font-serif-display font-bold border border-white/20 shadow-md">
                <span className="text-sm tracking-tight" style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}>
                  ZS-Studios
                </span>
              </div>
            </div>
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed font-light">
              ZS-Studios is a private real estate sales and listing advisory delivering exclusive architectural acquisitions, luxury residences, and prime estates across North America and Europe.
            </p>
            <div className="text-xs font-mono text-stone-500 pt-2">
              CA DRE #02194819 · NY DOS #104912903
            </div>
          </div>

          {/* Regional Desks */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white font-semibold">
              Advisory Desks
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => navigateToMarket('Bel Air')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Bel Air & Beverly Hills
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateToMarket('New York')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Manhattan & Tribeca
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateToMarket('Aspen')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Aspen & Red Mountain
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateToMarket('Miami')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Miami & Venetian Islands
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateToMarket('Carmel')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Carmel & Big Sur
                </button>
              </li>
            </ul>
          </div>

          {/* Platform & Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white font-semibold">
              Exchange
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => { setActiveTab('listings'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-400 transition-colors"
                >
                  All Verified Listings
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => { setActiveTab('dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Agent Portal & CRM
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => { setActiveTab('saved'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Client Saved Collection
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenArchitecture}
                  className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                >
                  Prisma ORM & Terminal Setup
                </button>
              </li>
            </ul>
          </div>

          {/* Confidential Market Letter */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white font-semibold">
              Private Market Letter
            </h4>
            <p className="text-xs text-stone-400 font-light">
              Receive confidential quarterly pricing yields, off-market transaction dossiers, and interest rate commentary.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                <Check className="w-4 h-4" />
                <span>Subscription Confirmed</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="client@familyoffice.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    className="w-full bg-stone-950 border border-stone-800 text-white rounded px-3 py-2 text-xs focus:outline-none focus:border-amber-400 pr-9"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 p-1 text-stone-400 hover:text-amber-400"
                    aria-label="Submit email"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-stone-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} ZS-Studios Real Estate, Inc. All rights reserved. Equal Housing Opportunity.
          </div>
          <div className="flex items-center gap-4">
            <span>Terms of Advisory</span>
            <span>·</span>
            <span>Privacy Standard</span>
            <span>·</span>
            <span>MLS Compliance</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
