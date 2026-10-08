import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useRealEstate } from '../context/RealEstateContext';
import { PropertyCard } from './PropertyCard';
import { PropertyListing } from '../types';

interface FeaturedListingsProps {
  onQuickView: (prop: PropertyListing) => void;
}

export const FeaturedListings: React.FC<FeaturedListingsProps> = ({ onQuickView }) => {
  const { properties, setActiveTab, darkMode } = useRealEstate();

  // Filter featured or top priced properties
  const featured = properties.filter((p) => p.featured).slice(0, 3);
  const displayProperties = featured.length >= 3 ? featured : properties.slice(0, 3);

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-amber-600 dark:text-amber-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Showcase</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
            Featured Trophy Residences
          </h2>
          <p className="mt-2 text-stone-500 dark:text-slate-400 text-sm sm:text-base max-w-2xl font-light">
            Hand-vetted prime architectural statements showcasing singular craftsmanship, bespoke materials, and premier locations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('listings')}
          className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-colors pb-1 border-b ${
            darkMode 
              ? 'text-amber-400 border-amber-400/50 hover:border-amber-300' 
              : 'text-stone-900 border-stone-900/40 hover:border-stone-900'
          }`}
        >
          <span>View All {properties.length} Properties</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3-Column Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onQuickView={onQuickView}
          />
        ))}
      </div>
    </section>
  );
};
