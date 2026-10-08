import React from 'react';
import { X, MapPin, Bed, Bath, Maximize2, Bookmark, ArrowRight, Calendar } from 'lucide-react';
import { PropertyListing } from '../types';
import { useRealEstate } from '../context/RealEstateContext';

interface QuickViewModalProps {
  property: PropertyListing;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ property, onClose }) => {
  const { openListingDetail, savedPropertyIds, toggleSavedProperty, darkMode } = useRealEstate();
  const isSaved = savedPropertyIds.includes(property.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      />
      <div className={`relative w-full max-w-3xl rounded-xl overflow-hidden border shadow-2xl z-10 grid grid-cols-1 md:grid-cols-2 ${
        darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-stone-200 text-stone-900'
      }`}>
        {/* Left: Image */}
        <div className="relative aspect-[4/3] md:aspect-auto md:h-full bg-stone-950">
          <img
            src={property.images[0]}
            alt={property.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-sm text-white px-2.5 py-1 text-[11px] font-mono tracking-wider uppercase rounded-sm border border-white/10">
            {property.propertyType}
          </div>
        </div>

        {/* Right: Info */}
        <div className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">
                  {property.neighborhood} · {property.city}
                </span>
                <h3 className="font-serif-display text-2xl font-bold tracking-tight mt-0.5">
                  {property.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-2 flex items-center gap-1.5 text-xs text-stone-500 dark:text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>{property.address}</span>
            </div>

            {/* Price */}
            <div className="mt-4 font-serif-display text-3xl font-bold text-amber-500 tabular-nums">
              {property.listingType === 'FOR_RENT' ? `$${property.price.toLocaleString()}/mo` : `$${property.price.toLocaleString()}`}
            </div>

            {/* Specs */}
            <div className="mt-4 py-3 border-y border-stone-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-stone-600 dark:text-slate-300">
              <span>{property.beds} Bedrooms</span>
              <span>·</span>
              <span>{property.baths} Bathrooms</span>
              <span>·</span>
              <span>{property.sqft.toLocaleString()} sqft</span>
            </div>

            {/* Narrative snippet */}
            <p className="mt-3 text-xs text-stone-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 pt-4 border-t border-stone-100 dark:border-slate-800 flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleSavedProperty(property.id)}
              className={`p-2.5 rounded border transition-colors ${
                isSaved
                  ? 'bg-amber-400 text-stone-950 border-amber-400'
                  : 'border-stone-300 dark:border-slate-700 text-stone-600 dark:text-slate-300'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                openListingDetail(property.id);
              }}
              className="flex-1 py-2.5 bg-stone-950 dark:bg-amber-400 text-white dark:text-stone-950 font-semibold text-xs tracking-wider uppercase rounded transition-all flex items-center justify-center gap-1.5 shadow"
            >
              <span>Inspect Full Residence</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
