import React from 'react';
import { MapPin, ArrowUpRight } from 'lucide-react';
import { NEIGHBORHOOD_MARKETS } from '../data/seedListings';
import { useRealEstate } from '../context/RealEstateContext';

export const NeighborhoodHighlights: React.FC = () => {
  const { setFilters, setActiveTab, darkMode } = useRealEstate();

  const handleSelectMarket = (name: string) => {
    // Extract key city name
    const searchPart = name.split('&')[0].trim();
    setFilters((prev) => ({
      ...prev,
      location: searchPart,
    }));
    setActiveTab('listings');
  };

  return (
    <section className={`py-20 border-t ${
      darkMode ? 'bg-slate-950/60 border-slate-900' : 'bg-stone-100/70 border-stone-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-amber-600 dark:text-amber-400 mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Prime Territories</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
            Coveted Neighborhood Highlights
          </h2>
          <p className="mt-2 text-stone-500 dark:text-slate-400 text-sm sm:text-base font-light">
            Explore curated residential micro-climates, from coastal headlands and alpine ski trails to historic downtown loft districts.
          </p>
        </div>

        {/* Asymmetrical Bento-style Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {NEIGHBORHOOD_MARKETS.map((market, idx) => (
            <div
              key={market.id}
              onClick={() => handleSelectMarket(market.name)}
              className={`group cursor-pointer relative rounded-lg overflow-hidden border transition-all duration-300 hover:shadow-2xl ${
                idx === 0 ? 'md:col-span-2 lg:col-span-2 aspect-[16/9]' : 'aspect-[4/3]'
              } ${
                darkMode ? 'border-slate-800' : 'border-stone-300'
              }`}
            >
              {/* Market Image */}
              <img
                src={market.image}
                alt={market.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />

              {/* Top Stats */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-white">
                <span className="text-[11px] font-mono uppercase tracking-wider bg-stone-950/70 backdrop-blur-sm px-2.5 py-1 rounded-sm border border-white/10">
                  {market.activeCount} Residences
                </span>
                <div className="w-8 h-8 rounded-full bg-stone-950/60 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:bg-amber-400 group-hover:text-stone-950 transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-xs font-mono text-amber-300 uppercase tracking-widest">
                  {market.region}
                </div>
                <h3 className="font-serif-display text-2xl sm:text-3xl font-bold tracking-tight mt-1">
                  {market.name}
                </h3>
                <p className="text-xs text-stone-300 mt-1 line-clamp-1 font-light">
                  {market.tagline}
                </p>
                <div className="mt-3 flex items-center gap-3 text-xs font-mono text-stone-300 border-t border-white/10 pt-2 tabular-nums">
                  <span>Median Market: <strong className="text-white">{market.avgPrice}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-400 group-hover:underline">Explore listings &rarr;</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
