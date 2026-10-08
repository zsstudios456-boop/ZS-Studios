import React, { useState } from 'react';
import { 
  Building2, 
  Bookmark, 
  Sun, 
  Moon, 
  UserCheck, 
  SlidersHorizontal, 
  Database, 
  Menu, 
  X,
  PlusCircle,
  Home,
  MapPin,
  Briefcase
} from 'lucide-react';
import { useRealEstate } from '../context/RealEstateContext';
import { UserRole } from '../types';
import { Logo } from './Logo';

export const Navbar: React.FC<{ onOpenArchitecture: () => void }> = ({ onOpenArchitecture }) => {
  const { 
    activeTab, 
    setActiveTab, 
    savedPropertyIds, 
    currentUser, 
    switchUserRole, 
    darkMode, 
    toggleDarkMode,
    inquiries
  } = useRealEstate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const roles: { role: UserRole; label: string; desc: string }[] = [
    { role: 'BUYER', label: 'Buyer / Client', desc: 'Browse, save favorites & request viewings' },
    { role: 'AGENT', label: 'Listing Agent', desc: 'Manage properties & inquiry leads CRM' },
    { role: 'ADMIN', label: 'Platform Admin', desc: 'Full portfolio & system control' },
  ];

  return (
    <header className={`sticky top-0 z-40 transition-colors backdrop-blur-md border-b ${
      darkMode 
        ? 'bg-slate-950/90 border-slate-800 text-slate-100' 
        : 'bg-stone-50/90 border-stone-200 text-stone-900'
    }`}>
      {/* 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Zone 1: Single Brand Wordmark with ZS-Studios Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            {/* The exact black square logo with white serif text matching user upload */}
            <div className="h-10 px-3 bg-black text-white flex items-center justify-center rounded-sm font-serif-display font-bold border border-white/20 shadow-md">
              <span className="text-base tracking-tight" style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}>
                ZS-Studios
              </span>
            </div>
            <div className="hidden lg:flex flex-col">
              <span className="text-[10px] tracking-[0.25em] uppercase text-stone-400 font-sans">
                Real Estate Exchange
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Clean 4-6 Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
          <button
            onClick={() => setActiveTab('home')}
            className={`transition-colors py-1 relative ${
              activeTab === 'home'
                ? darkMode ? 'text-amber-400 font-semibold' : 'text-stone-950 font-semibold'
                : darkMode ? 'text-slate-400 hover:text-slate-100' : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            Curated Homes
            {activeTab === 'home' && (
              <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                darkMode ? 'bg-amber-400' : 'bg-stone-900'
              }`} />
            )}
          </button>

          <button
            onClick={() => setActiveTab('listings')}
            className={`transition-colors py-1 relative ${
              activeTab === 'listings'
                ? darkMode ? 'text-amber-400 font-semibold' : 'text-stone-950 font-semibold'
                : darkMode ? 'text-slate-400 hover:text-slate-100' : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            Explore Catalog
            {activeTab === 'listings' && (
              <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                darkMode ? 'bg-amber-400' : 'bg-stone-900'
              }`} />
            )}
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`transition-colors py-1 relative flex items-center gap-1.5 ${
              activeTab === 'dashboard'
                ? darkMode ? 'text-amber-400 font-semibold' : 'text-stone-950 font-semibold'
                : darkMode ? 'text-slate-400 hover:text-slate-100' : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            <span>Agent CRM</span>
            {inquiries.length > 0 && (
              <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold">
                {inquiries.length}
              </span>
            )}
            {activeTab === 'dashboard' && (
              <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                darkMode ? 'bg-amber-400' : 'bg-stone-900'
              }`} />
            )}
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`transition-colors py-1 relative flex items-center gap-1.5 ${
              activeTab === 'saved'
                ? darkMode ? 'text-amber-400 font-semibold' : 'text-stone-950 font-semibold'
                : darkMode ? 'text-slate-400 hover:text-slate-100' : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            <span>Collection</span>
            <span className="font-mono text-xs opacity-80">({savedPropertyIds.length})</span>
            {activeTab === 'saved' && (
              <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                darkMode ? 'bg-amber-400' : 'bg-stone-900'
              }`} />
            )}
          </button>
        </nav>

        {/* Zone 3: 1-2 Primary Action Controls */}
        <div className="flex items-center gap-3">
          
          {/* Schema & Terminal Guide CTA */}
          <button
            onClick={onOpenArchitecture}
            title="Database Schema & Installation Guide"
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors border ${
              darkMode
                ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100 shadow-xs'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-amber-500" />
            <span>Schema & Setup</span>
          </button>

          {/* Role Switcher Popover */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded transition-colors border ${
                darkMode
                  ? 'bg-slate-900 border-slate-700 hover:border-slate-600'
                  : 'bg-white border-stone-200 hover:border-stone-400 shadow-xs'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider text-stone-500 dark:text-slate-400">
                Persona:
              </span>
              <span className="font-semibold">{currentUser.role}</span>
            </button>

            {roleDropdownOpen && (
              <div 
                className={`absolute right-0 mt-2 w-72 rounded-lg p-2 shadow-2xl border z-50 animate-in fade-in zoom-in-95 ${
                  darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-stone-200 text-stone-900'
                }`}
                onMouseLeave={() => setRoleDropdownOpen(false)}
              >
                <div className="px-3 py-2 text-[11px] font-mono uppercase tracking-wider text-stone-400 border-b border-stone-200 dark:border-slate-800">
                  Switch Active Role UX
                </div>
                {roles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => {
                      switchUserRole(r.role);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-md text-xs transition-colors my-1 ${
                      currentUser.role === r.role
                        ? darkMode ? 'bg-amber-500/15 text-amber-300' : 'bg-stone-100 text-stone-950 font-semibold'
                        : darkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-stone-50 text-stone-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{r.label}</span>
                      {currentUser.role === r.role && <span className="text-[10px] text-emerald-500 font-mono">ACTIVE</span>}
                    </div>
                    <p className="text-[11px] text-stone-400 dark:text-slate-400 mt-0.5 line-clamp-1">{r.desc}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle visual theme"
            className={`p-2 rounded-md transition-colors border ${
              darkMode 
                ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800' 
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* List Property CTA (Agent or Buyer) */}
          <button
            onClick={() => {
              if (currentUser.role === 'BUYER') {
                switchUserRole('AGENT');
              }
              setActiveTab('dashboard');
            }}
            className={`hidden sm:flex items-center gap-1.5 px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-colors rounded ${
              darkMode
                ? 'bg-amber-500 text-stone-950 hover:bg-amber-400 shadow-sm'
                : 'bg-stone-950 text-stone-50 hover:bg-stone-800 shadow-sm'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>List Residence</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded text-stone-700 dark:text-slate-200"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className={`md:hidden px-4 pt-3 pb-6 border-t ${
          darkMode ? 'bg-slate-950 border-slate-800' : 'bg-stone-50 border-stone-200'
        }`}>
          <div className="space-y-3 text-sm">
            <button
              onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
              className="flex items-center gap-2.5 w-full text-left py-2 font-medium"
            >
              <Home className="w-4 h-4 text-amber-500" />
              <span>Curated Homes</span>
            </button>
            <button
              onClick={() => { setActiveTab('listings'); setMobileMenuOpen(false); }}
              className="flex items-center gap-2.5 w-full text-left py-2 font-medium"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-500" />
              <span>Explore Listings</span>
            </button>
            <button
              onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
              className="flex items-center gap-2.5 w-full text-left py-2 font-medium"
            >
              <Briefcase className="w-4 h-4 text-amber-500" />
              <span>Agent CRM & Portfolio ({inquiries.length} Leads)</span>
            </button>
            <button
              onClick={() => { setActiveTab('saved'); setMobileMenuOpen(false); }}
              className="flex items-center gap-2.5 w-full text-left py-2 font-medium"
            >
              <Bookmark className="w-4 h-4 text-amber-500" />
              <span>Private Collection ({savedPropertyIds.length})</span>
            </button>
            <button
              onClick={() => { onOpenArchitecture(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2.5 w-full text-left py-2 font-medium text-amber-600 dark:text-amber-400"
            >
              <Database className="w-4 h-4" />
              <span>Prisma Schema & Terminal Setup</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
