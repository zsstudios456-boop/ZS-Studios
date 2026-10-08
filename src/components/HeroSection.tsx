import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Home as HomeIcon, 
  DollarSign, 
  Bed, 
  ArrowRight,
  ShieldCheck,
  Compass,
  Building
} from 'lucide-react';
import heroVillaImg from '@/src/assets/images/hero_luxury_villa_1791474612114.jpg';
import { useRealEstate } from '../context/RealEstateContext';
import { ListingType, PropertyType } from '../types';

export const HeroSection: React.FC = () => {
  const { 
    filters, 
    setFilters, 
    setActiveTab, 
    darkMode 
  } = useRealEstate();

  // Local state for hero search bar
  const [localListingType, setLocalListingType] = useState<ListingType | 'ALL'>('FOR_SALE');
  const [localLocation, setLocalLocation] = useState<string>('');
  const [localPropertyType, setLocalPropertyType] = useState<PropertyType | 'ALL'>('ALL');
  const [localMaxPrice, setLocalMaxPrice] = useState<number>(20000000);
  const [localBeds, setLocalBeds] = useState<number>(0);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      listingType: localListingType,
      location: localLocation.trim() || 'ALL',
      propertyType: localPropertyType,
      maxPrice: localMaxPrice,
      minBeds: localBeds,
    }));
    setActiveTab('listings');
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Hero Image with measured scrim */}
      <div className="absolute inset-0 z-0 select-none">
        <img
          src={heroVillaImg}
          alt="Modern Architectural Cantilever Villa"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Measured scrim for WCAG compliance */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-28 sm:pt-32 sm:pb-36 lg:pt-40 lg:pb-44 flex flex-col justify-end">
        {/* Kicker & Editorial Headline */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-amber-300/90 font-mono">
            <span>ZS-Studios Portfolios</span>
            <span aria-hidden="true">·</span>
            <span>Estates & Penthouses</span>
            <span aria-hidden="true">·</span>
            <span>Private Advisory</span>
          </div>

          <h1 className="font-serif-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] text-balance">
            Exceptional sanctuaries for discerning lives.
          </h1>

          <p className="text-base sm:text-lg text-stone-200/90 font-light max-w-2xl leading-relaxed">
            Curated residences defined by visionary architecture, unparalleled privacy, and timeless natural topography across the world’s most coveted enclaves.
          </p>
        </div>

        {/* Integrated Multi-Parameter Search Engine */}
        <div className="mt-10 max-w-5xl w-full">
          {/* Segmented Purchase Control (Buy / Rent / All) */}
          <div className="inline-flex p-1 rounded-t-lg bg-stone-900/80 backdrop-blur-md border-t border-x border-white/20">
            <button
              type="button"
              onClick={() => setLocalListingType('FOR_SALE')}
              className={`px-5 py-2 text-xs font-semibold tracking-wider uppercase transition-colors rounded ${
                localListingType === 'FOR_SALE'
                  ? 'bg-white text-stone-950 shadow-md'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Acquire Residence
            </button>
            <button
              type="button"
              onClick={() => setLocalListingType('FOR_RENT')}
              className={`px-5 py-2 text-xs font-semibold tracking-wider uppercase transition-colors rounded ${
                localListingType === 'FOR_RENT'
                  ? 'bg-white text-stone-950 shadow-md'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Private Lease
            </button>
            <button
              type="button"
              onClick={() => setLocalListingType('ALL')}
              className={`px-5 py-2 text-xs font-semibold tracking-wider uppercase transition-colors rounded ${
                localListingType === 'ALL'
                  ? 'bg-white text-stone-950 shadow-md'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              All Portfolios
            </button>
          </div>

          {/* Search Inputs Card */}
          <form 
            onSubmit={handleHeroSearch}
            className="bg-stone-950/85 backdrop-blur-xl border border-white/20 rounded-b-xl rounded-tr-xl p-4 sm:p-6 shadow-2xl"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
              
              {/* Location input */}
              <div className="lg:col-span-4 space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Market / Enclave</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bel Air, Manhattan, Aspen, Miami..."
                  value={localLocation}
                  onChange={(e) => setLocalLocation(e.target.value)}
                  className="w-full bg-stone-900/90 text-white placeholder-stone-500 border border-stone-700/80 rounded px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              {/* Property Type Selector */}
              <div className="lg:col-span-3 space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-amber-400" />
                  <span>Architecture Typology</span>
                </label>
                <select
                  value={localPropertyType}
                  onChange={(e) => setLocalPropertyType(e.target.value as PropertyType | 'ALL')}
                  className="w-full bg-stone-900/90 text-white border border-stone-700/80 rounded px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                >
                  <option value="ALL">All Typologies</option>
                  <option value="VILLA">Architectural Villa</option>
                  <option value="PENTHOUSE">Skyline Penthouse</option>
                  <option value="HOUSE">Contemporary Manor / House</option>
                  <option value="APARTMENT">Luxury Apartment</option>
                  <option value="COMMERCIAL">Commercial Flagship</option>
                </select>
              </div>

              {/* Max Price Range */}
              <div className="lg:col-span-3 space-y-1.5">
                <div className="flex justify-between items-center text-[11px] font-mono uppercase tracking-wider text-stone-400">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                    Max Price
                  </span>
                  <span className="text-white font-medium">
                    ${(localMaxPrice / 1000000).toFixed(1)}M
                  </span>
                </div>
                <input
                  type="range"
                  min="1000000"
                  max="25000000"
                  step="500000"
                  value={localMaxPrice}
                  onChange={(e) => setLocalMaxPrice(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-2 bg-stone-800 rounded-lg mt-3"
                />
              </div>

              {/* Action Button */}
              <div className="lg:col-span-2">
                <button
                  type="submit"
                  className="w-full h-[42px] bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-xs tracking-wider uppercase rounded transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </div>

            </div>

            {/* Quick Filter Bar (Beds filter & quick tags) */}
            <div className="mt-4 pt-4 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-stone-300">
                <Bed className="w-3.5 h-3.5 text-stone-400" />
                <span className="text-stone-400 font-mono text-[11px]">Beds:</span>
                <div className="flex items-center gap-1">
                  {[0, 3, 4, 5, 6].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setLocalBeds(b)}
                      className={`px-2 py-0.5 rounded text-xs transition-colors ${
                        localBeds === b
                          ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-400/40'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      {b === 0 ? 'Any' : `${b}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct Link to full explorer */}
              <button
                type="button"
                onClick={() => setActiveTab('listings')}
                className="text-stone-300 hover:text-amber-300 flex items-center gap-1.5 transition-colors font-medium text-xs group"
              >
                <span>View all verified properties</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>

        {/* Quantitative Proof Adjacency */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-white/10 text-stone-200">
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-serif-display text-white tabular-nums">
              $1.4B+
            </div>
            <div className="text-xs text-stone-400 mt-0.5">Off-Market & Public Inventory</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-serif-display text-white tabular-nums">
              100%
            </div>
            <div className="text-xs text-stone-400 mt-0.5">Verified Architectural Provenance</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-serif-display text-white tabular-nums">
              18 Days
            </div>
            <div className="text-xs text-stone-400 mt-0.5">Average Private Escrow Advisory</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-serif-display text-white tabular-nums">
              14
            </div>
            <div className="text-xs text-stone-400 mt-0.5">Premier Global Metros & Havens</div>
          </div>
        </div>

      </div>
    </div>
  );
};
