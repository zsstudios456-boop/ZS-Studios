import React from 'react';
import { Bookmark, Search, Trash2, ArrowRight, Bell, BellOff, Building2 } from 'lucide-react';
import { useRealEstate } from '../context/RealEstateContext';
import { PropertyCard } from './PropertyCard';
import { PropertyListing } from '../types';

interface SavedPropertiesProps {
  onQuickView: (prop: PropertyListing) => void;
}

export const SavedProperties: React.FC<SavedPropertiesProps> = ({ onQuickView }) => {
  const { 
    properties, 
    savedPropertyIds, 
    savedSearches, 
    deleteSavedSearch, 
    setActiveTab, 
    setFilters,
    currentUser, 
    darkMode 
  } = useRealEstate();

  const savedListings = properties.filter((p) => savedPropertyIds.includes(p.id));

  const handleApplySavedSearch = (search: any) => {
    setFilters((prev) => ({
      ...prev,
      location: search.location || 'ALL',
      listingType: search.listingType || 'ALL',
      propertyType: search.propertyType || 'ALL',
      minPrice: search.minPrice || 0,
      maxPrice: search.maxPrice || 25000000,
      minBeds: search.beds || 0,
    }));
    setActiveTab('listings');
  };

  return (
    <div className={`py-12 transition-colors ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-stone-50 text-stone-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Profile & Collection Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-slate-800">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
              Private Client Portfolio
            </div>
            <h1 className="font-serif-display text-3xl sm:text-4xl font-bold tracking-tight">
              Saved Residences & Alerts
            </h1>
            <p className="text-xs text-stone-500 dark:text-slate-400 mt-1 font-mono">
              Signed in as {currentUser.name} ({currentUser.email})
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('listings')}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded border border-stone-300 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
          >
            Explore More Listings
          </button>
        </div>

        {/* Section 1: Saved Searches & Alerts */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-4 h-4 text-amber-500" />
            <h2 className="font-serif-display text-2xl font-bold">
              Saved Searches & Market Alerts
            </h2>
          </div>

          {savedSearches.length === 0 ? (
            <div className={`p-6 rounded-lg border text-center text-xs text-stone-500 font-mono ${
              darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-stone-200'
            }`}>
              No saved searches yet. Save your filters in the Property Explorer to receive instantaneous notifications.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedSearches.map((s) => (
                <div
                  key={s.id}
                  className={`p-5 rounded-lg border flex flex-col justify-between transition-all ${
                    darkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-stone-200 shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-sm line-clamp-1">{s.title}</h4>
                      <button
                        type="button"
                        onClick={() => deleteSavedSearch(s.id)}
                        className="text-stone-400 hover:text-red-500 p-1"
                        title="Delete saved search"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="mt-2 text-xs font-mono text-stone-500 dark:text-slate-400 space-y-0.5">
                      {s.location && <div>• Location: {s.location}</div>}
                      {s.listingType && <div>• Type: {s.listingType}</div>}
                      {s.maxPrice && <div>• Max Price: ${(s.maxPrice / 1000000).toFixed(1)}M</div>}
                      {s.beds && <div>• Min Beds: {s.beds}+</div>}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-500">
                      <Bell className="w-3 h-3" />
                      Alerts Active
                    </span>

                    <button
                      type="button"
                      onClick={() => handleApplySavedSearch(s)}
                      className="font-semibold text-amber-500 hover:underline flex items-center gap-1"
                    >
                      <span>Run Search</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Bookmarked Properties */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Bookmark className="w-4 h-4 text-amber-500" />
            <h2 className="font-serif-display text-2xl font-bold">
              Bookmarked Properties ({savedListings.length})
            </h2>
          </div>

          {savedListings.length === 0 ? (
            <div className={`p-12 text-center rounded-lg border ${
              darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-stone-200'
            }`}>
              <Building2 className="w-12 h-12 text-stone-400 mx-auto mb-3" />
              <h3 className="font-serif-display text-xl font-bold">Your private collection is empty</h3>
              <p className="text-stone-500 text-xs mt-1 max-w-sm mx-auto">
                Click the bookmark icon on any property in the catalog to curate your private portfolio.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('listings')}
                className="mt-4 px-4 py-2 bg-amber-400 text-stone-950 text-xs font-semibold uppercase tracking-wider rounded"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {savedListings.map((prop) => (
                <PropertyCard
                  key={prop.id}
                  property={prop}
                  onQuickView={onQuickView}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
