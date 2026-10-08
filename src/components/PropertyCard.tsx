import React from 'react';
import { 
  Bookmark, 
  Eye, 
  MapPin, 
  Maximize2, 
  Bed, 
  Bath, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { PropertyListing } from '../types';
import { useRealEstate } from '../context/RealEstateContext';

interface PropertyCardProps {
  property: PropertyListing;
  onQuickView?: (prop: PropertyListing) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  onQuickView 
}) => {
  const { 
    savedPropertyIds, 
    toggleSavedProperty, 
    openListingDetail,
    darkMode 
  } = useRealEstate();

  const isSaved = savedPropertyIds.includes(property.id);

  const formattedPrice = property.listingType === 'FOR_RENT'
    ? `$${property.price.toLocaleString()}/mo`
    : `$${property.price.toLocaleString()}`;

  return (
    <div 
      className={`group rounded-lg overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
        darkMode 
          ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:shadow-xl' 
          : 'bg-white border-stone-200 hover:border-stone-300 hover:shadow-xl'
      }`}
    >
      {/* Visual Asset Container with 4:3 Aspect Ratio */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-900 select-none">
        <img
          src={property.images[0]}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Subtle Gradient Scrim at top and bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-stone-950/30 opacity-80" />

        {/* Top Badges / Actions (Non-pill, functional buttons) */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          {/* Subtle status tag */}
          <div className="bg-stone-950/80 backdrop-blur-sm text-white px-2.5 py-1 text-[11px] font-mono tracking-wider uppercase border border-white/10 rounded-sm">
            {property.propertyType}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick View Button */}
            {onQuickView && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickView(property);
                }}
                title="Quick preview"
                className="w-8 h-8 rounded-full bg-stone-900/80 backdrop-blur-sm text-stone-200 hover:text-white hover:bg-stone-900 border border-white/20 flex items-center justify-center transition-transform active:scale-95"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}

            {/* Save / Bookmark Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleSavedProperty(property.id);
              }}
              aria-label={isSaved ? 'Remove from collection' : 'Save to collection'}
              className={`w-8 h-8 rounded-full backdrop-blur-sm border flex items-center justify-center transition-all active:scale-95 ${
                isSaved
                  ? 'bg-amber-400 text-stone-950 border-amber-300'
                  : 'bg-stone-900/80 text-white hover:text-amber-300 border-white/20'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Bottom image overlay: Price and Listing Type */}
        <div className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between text-white">
          <div className="font-serif-display text-2xl font-bold tracking-tight tabular-nums drop-shadow-md">
            {formattedPrice}
          </div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-stone-300 drop-shadow-sm">
            {property.listingType === 'FOR_RENT' ? 'Lease' : 'For Sale'}
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        
        {/* Title and Address */}
        <div>
          <button
            type="button"
            onClick={() => openListingDetail(property.id)}
            className="text-left w-full group/title"
          >
            <h3 className={`font-serif-display text-xl font-bold tracking-tight line-clamp-1 transition-colors ${
              darkMode 
                ? 'text-slate-100 group-hover/title:text-amber-400' 
                : 'text-stone-900 group-hover/title:text-stone-700'
            }`}>
              {property.title}
            </h3>
          </button>

          {/* Location Line */}
          <div className="mt-1 flex items-center gap-1.5 text-xs text-stone-500 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-amber-500" />
            <span className="truncate">{property.address}, {property.city}, {property.state}</span>
          </div>

          {/* Zero-Pill Unboxed Key Specs with typographic separators */}
          <div className="mt-3.5 pt-3 border-t border-stone-200 dark:border-slate-800 flex items-center gap-2 text-xs font-mono text-stone-600 dark:text-slate-300 tabular-nums">
            <span className="flex items-center gap-1">
              <strong className="font-semibold text-stone-900 dark:text-slate-100">{property.beds}</strong> Beds
            </span>
            <span aria-hidden="true" className="text-stone-300 dark:text-slate-600">·</span>
            <span className="flex items-center gap-1">
              <strong className="font-semibold text-stone-900 dark:text-slate-100">{property.baths}</strong> Baths
            </span>
            <span aria-hidden="true" className="text-stone-300 dark:text-slate-600">·</span>
            <span className="flex items-center gap-1">
              <strong className="font-semibold text-stone-900 dark:text-slate-100">{property.sqft.toLocaleString()}</strong> Sq Ft
            </span>
          </div>
        </div>

        {/* Footer: Agent & Full Detail Action */}
        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <img
              src={property.agentAvatar}
              alt={property.agentName}
              className="w-6 h-6 rounded-full object-cover border border-stone-200 dark:border-slate-700"
            />
            <span className="text-[11px] text-stone-500 dark:text-slate-400 truncate max-w-[120px]">
              {property.agentName}
            </span>
          </div>

          <button
            type="button"
            onClick={() => openListingDetail(property.id)}
            className={`flex items-center gap-1 font-semibold text-xs tracking-wider uppercase transition-colors ${
              darkMode ? 'text-amber-400 hover:text-amber-300' : 'text-stone-900 hover:text-stone-600'
            }`}
          >
            <span>Explore</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
