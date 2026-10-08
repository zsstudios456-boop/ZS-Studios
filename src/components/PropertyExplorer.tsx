import React, { useState } from 'react';
import { 
  Filter, 
  Map as MapIcon, 
  Grid3X3, 
  Search, 
  RotateCcw, 
  BookmarkPlus, 
  SlidersHorizontal,
  X,
  MapPin,
  Check,
  ChevronDown,
  Building,
  DollarSign,
  Maximize2
} from 'lucide-react';
import { useRealEstate } from '../context/RealEstateContext';
import { PropertyCard } from './PropertyCard';
import { PropertyListing, PropertyType, ListingType } from '../types';

interface PropertyExplorerProps {
  onQuickView: (prop: PropertyListing) => void;
}

const ALL_AMENITIES = [
  'Pool',
  'Wine Cellar',
  'Smart Home',
  'EV Charging',
  'Waterfront',
  'Ski-In',
  'Cinema',
  'Gym',
  'Garage',
  'Balcony',
];

export const PropertyExplorer: React.FC<PropertyExplorerProps> = ({ onQuickView }) => {
  const { 
    filteredProperties, 
    filters, 
    setFilters, 
    updateFilterField, 
    resetFilters,
    addSavedSearch,
    openListingDetail,
    darkMode 
  } = useRealEstate();

  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedMapPin, setSelectedMapPin] = useState<PropertyListing | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [saveSearchModal, setSaveSearchModal] = useState(false);
  const [searchTitleInput, setSearchTitleInput] = useState('');

  const handleToggleAmenity = (amenity: string) => {
    const current = [...filters.amenities];
    const index = current.indexOf(amenity);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(amenity);
    }
    updateFilterField('amenities', current);
  };

  const handleSaveSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTitleInput.trim()) return;
    addSavedSearch({
      title: searchTitleInput.trim(),
      location: filters.location !== 'ALL' ? filters.location : undefined,
      listingType: filters.listingType !== 'ALL' ? filters.listingType : undefined,
      propertyType: filters.propertyType !== 'ALL' ? filters.propertyType : undefined,
      minPrice: filters.minPrice > 0 ? filters.minPrice : undefined,
      maxPrice: filters.maxPrice < 25000000 ? filters.maxPrice : undefined,
      beds: filters.minBeds > 0 ? filters.minBeds : undefined,
      baths: filters.minBaths > 0 ? filters.minBaths : undefined,
      notifyEmail: true,
    });
    setSearchTitleInput('');
    setSaveSearchModal(false);
  };

  return (
    <div className={`py-10 transition-colors ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-stone-50 text-stone-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Explorer Control Bar */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-slate-800">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
              Live Property Exchange
            </div>
            <h1 className="font-serif-display text-3xl sm:text-4xl font-bold tracking-tight">
              Exclusive Portfolio Explorer
            </h1>
            <p className="text-xs text-stone-500 dark:text-slate-400 mt-1 font-mono">
              Showing {filteredProperties.length} verified listings match your criteria
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Save Search Button */}
            <button
              type="button"
              onClick={() => setSaveSearchModal(true)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded border transition-colors ${
                darkMode
                  ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
                  : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100 shadow-xs'
              }`}
            >
              <BookmarkPlus className="w-3.5 h-3.5 text-amber-500" />
              <span>Save Search Alert</span>
            </button>

            {/* View Mode Toggle (Grid vs Map) */}
            <div className="inline-flex p-1 rounded bg-stone-200/70 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded text-xs transition-colors ${
                  viewMode === 'grid'
                    ? darkMode ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
                }`}
                title="Grid view"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`p-1.5 rounded text-xs transition-colors ${
                  viewMode === 'map'
                    ? darkMode ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
                }`}
                title="Interactive Map view"
              >
                <MapIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Filter Trigger */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded bg-amber-400 text-stone-950 font-semibold"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-400 font-mono hidden sm:inline">Sort:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilterField('sortBy', e.target.value as any)}
                className={`px-3 py-2 rounded text-xs border font-medium focus:outline-none ${
                  darkMode
                    ? 'bg-slate-900 border-slate-700 text-slate-200'
                    : 'bg-white border-stone-300 text-stone-800 shadow-xs'
                }`}
              >
                <option value="featured">Featured First</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="newest">Newest Listed</option>
                <option value="sqft_desc">Largest Area (Sq Ft)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid: Sidebar Filters + Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className={`hidden lg:block lg:col-span-1 rounded-lg p-6 border h-fit sticky top-24 ${
            darkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-stone-200 shadow-xs'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-slate-800">
              <div className="flex items-center gap-2 font-semibold text-sm">
                <SlidersHorizontal className="w-4 h-4 text-amber-500" />
                <span>Filters</span>
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-stone-400 hover:text-amber-500 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <div className="space-y-6 mt-6">
              {/* Keyword Search */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-stone-500 dark:text-slate-400">
                  Search Text
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search name, street, city..."
                    value={filters.searchQuery}
                    onChange={(e) => updateFilterField('searchQuery', e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 text-xs rounded border focus:outline-none focus:border-amber-400 ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-stone-50 border-stone-300 text-stone-900'
                    }`}
                  />
                </div>
              </div>

              {/* Acquisition Type (Segmented control) */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-stone-500 dark:text-slate-400">
                  Listing Type
                </label>
                <div className="grid grid-cols-3 gap-1 p-1 bg-stone-100 dark:bg-slate-800 rounded">
                  {(['ALL', 'FOR_SALE', 'FOR_RENT'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => updateFilterField('listingType', type)}
                      className={`py-1.5 text-[11px] font-semibold rounded transition-colors ${
                        filters.listingType === type
                          ? darkMode ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-stone-950 shadow-xs'
                          : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
                      }`}
                    >
                      {type === 'ALL' ? 'All' : type === 'FOR_SALE' ? 'Sale' : 'Rent'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Typology */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-stone-500 dark:text-slate-400">
                  Architecture Typology
                </label>
                <select
                  value={filters.propertyType}
                  onChange={(e) => updateFilterField('propertyType', e.target.value as any)}
                  className={`w-full p-2 text-xs rounded border focus:outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-stone-50 border-stone-300 text-stone-900'
                  }`}
                >
                  <option value="ALL">All Typologies</option>
                  <option value="VILLA">Villa</option>
                  <option value="PENTHOUSE">Penthouse</option>
                  <option value="HOUSE">House / Manor</option>
                  <option value="APARTMENT">Apartment</option>
                  <option value="COMMERCIAL">Commercial</option>
                </select>
              </div>

              {/* Price Range Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[11px] font-mono uppercase tracking-wider text-stone-500 dark:text-slate-400">
                  <span>Max Price</span>
                  <span className="font-semibold text-stone-900 dark:text-slate-100">
                    ${(filters.maxPrice / 1000000).toFixed(1)}M
                  </span>
                </div>
                <input
                  type="range"
                  min="500000"
                  max="25000000"
                  step="500000"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilterField('maxPrice', Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Bedrooms Min */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-stone-500 dark:text-slate-400">
                  Minimum Bedrooms
                </label>
                <div className="flex items-center gap-1">
                  {[0, 3, 4, 5, 6].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => updateFilterField('minBeds', b)}
                      className={`flex-1 py-1 text-xs rounded border font-mono transition-colors ${
                        filters.minBeds === b
                          ? 'bg-amber-400 text-stone-950 font-bold border-amber-400'
                          : darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-stone-50 border-stone-200 text-stone-700'
                      }`}
                    >
                      {b === 0 ? 'Any' : `${b}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities Checklist */}
              <div className="space-y-2.5 pt-2 border-t border-stone-200 dark:border-slate-800">
                <label className="text-[11px] font-mono uppercase tracking-wider text-stone-500 dark:text-slate-400">
                  Luxury Amenities
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {ALL_AMENITIES.map((amenity) => {
                    const checked = filters.amenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => handleToggleAmenity(amenity)}
                        className={`flex items-center gap-1.5 p-1.5 rounded text-left transition-colors text-[11px] ${
                          checked
                            ? 'bg-amber-400/20 text-amber-600 dark:text-amber-400 font-semibold'
                            : 'text-stone-600 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                          checked ? 'bg-amber-500 border-amber-500 text-stone-950' : 'border-stone-400 dark:border-slate-600'
                        }`}>
                          {checked && <Check className="w-2.5 h-2.5" />}
                        </div>
                        <span className="truncate">{amenity}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </aside>

          {/* Listings Content Area */}
          <div className="lg:col-span-3">
            {filteredProperties.length === 0 ? (
              <div className={`p-12 text-center rounded-lg border ${
                darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-stone-200'
              }`}>
                <Building className="w-12 h-12 mx-auto text-stone-400 mb-3" />
                <h3 className="font-serif-display text-2xl font-bold">No residences match your criteria</h3>
                <p className="text-stone-500 text-sm mt-1 max-w-md mx-auto">
                  Try broadening your price bounds or removing specific luxury amenities to discover available listings.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-amber-400 text-stone-950 text-xs font-semibold uppercase tracking-wider rounded"
                >
                  Reset All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              /* Grid View */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProperties.map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    property={prop}
                    onQuickView={onQuickView}
                  />
                ))}
              </div>
            ) : (
              /* Map & Split View */
              <div className="space-y-6">
                {/* Interactive Map Visual Placeholder */}
                <div className={`relative h-[480px] rounded-lg overflow-hidden border ${
                  darkMode ? 'bg-slate-950 border-slate-800' : 'bg-stone-200 border-stone-300'
                }`}>
                  {/* Map Graphic Background */}
                  <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-stone-900/90 via-stone-800/60 to-stone-900/70" />

                  {/* Top Map Toolbar */}
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                    <div className="bg-stone-950/80 backdrop-blur-md px-3 py-1.5 rounded text-xs text-white border border-white/10 font-mono">
                      <span>Coordinates: 34.0522° N, 118.2437° W (West Coast & Metro Corridor)</span>
                    </div>
                  </div>

                  {/* Interactive Map Property Pins */}
                  {filteredProperties.map((prop, idx) => {
                    // Spread pins realistically across map space
                    const positions = [
                      { top: '35%', left: '30%' },
                      { top: '55%', left: '60%' },
                      { top: '25%', left: '75%' },
                      { top: '68%', left: '20%' },
                      { top: '40%', left: '85%' },
                      { top: '75%', left: '70%' },
                    ];
                    const pos = positions[idx % positions.length];
                    const isSelected = selectedMapPin?.id === prop.id;

                    const displayPrice = prop.listingType === 'FOR_RENT'
                      ? `$${(prop.price / 1000).toFixed(0)}k/mo`
                      : `$${(prop.price / 1000000).toFixed(1)}M`;

                    return (
                      <div
                        key={prop.id}
                        style={{ top: pos.top, left: pos.left }}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 group/pin"
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedMapPin(prop)}
                          className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold tracking-tight shadow-2xl transition-all cursor-pointer flex items-center gap-1 ${
                            isSelected
                              ? 'bg-amber-400 text-stone-950 ring-4 ring-amber-400/40 scale-110'
                              : 'bg-stone-950/90 text-white hover:bg-amber-400 hover:text-stone-950 border border-white/20'
                          }`}
                        >
                          <MapPin className="w-3 h-3" />
                          <span>{displayPrice}</span>
                        </button>
                      </div>
                    );
                  })}

                  {/* Selected Map Pin Quick Flyout Card */}
                  {selectedMapPin && (
                    <div className={`absolute bottom-4 left-4 right-4 sm:right-auto sm:w-96 z-30 p-4 rounded-lg shadow-2xl border animate-in fade-in slide-in-from-bottom-2 ${
                      darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-stone-200 text-stone-900'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={selectedMapPin.images[0]}
                            alt={selectedMapPin.title}
                            className="w-16 h-16 rounded object-cover"
                          />
                          <div>
                            <span className="text-[10px] font-mono uppercase text-amber-500 font-bold">
                              {selectedMapPin.propertyType} · {selectedMapPin.city}
                            </span>
                            <h4 className="font-serif-display font-bold text-base line-clamp-1">
                              {selectedMapPin.title}
                            </h4>
                            <div className="text-sm font-bold font-mono text-amber-400">
                              ${selectedMapPin.price.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedMapPin(null)}
                          className="text-stone-400 hover:text-stone-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-3 pt-3 border-t border-stone-200 dark:border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-stone-500 dark:text-slate-400 font-mono">
                          {selectedMapPin.beds} Beds · {selectedMapPin.baths} Baths · {selectedMapPin.sqft} sqft
                        </span>
                        <button
                          type="button"
                          onClick={() => openListingDetail(selectedMapPin.id)}
                          className="font-semibold text-amber-500 hover:underline"
                        >
                          View Details &rarr;
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Map Pin Guide Notice */}
                  <div className="absolute bottom-4 right-4 hidden sm:block bg-stone-950/70 backdrop-blur-md px-3 py-1.5 rounded text-[11px] text-stone-300 border border-white/10 font-mono">
                    Click pin markers to inspect localized properties
                  </div>
                </div>

                {/* Subordinate Grid below Map */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProperties.map((prop) => (
                    <PropertyCard
                      key={prop.id}
                      property={prop}
                      onQuickView={onQuickView}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Save Search Modal */}
      {saveSearchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-xl p-6 border shadow-2xl ${
            darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-stone-200 text-stone-900'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif-display text-xl font-bold">Save Current Search Alert</h3>
              <button
                type="button"
                onClick={() => setSaveSearchModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSearch} className="space-y-4">
              <div>
                <label className="text-xs font-mono uppercase text-stone-500 dark:text-slate-400 block mb-1">
                  Search Name / Alert Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. West Coast 4-Bed Luxury Villas"
                  value={searchTitleInput}
                  onChange={(e) => setSearchTitleInput(e.target.value)}
                  required
                  className={`w-full px-3 py-2 text-sm rounded border focus:outline-none focus:border-amber-400 ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-stone-50 border-stone-300'
                  }`}
                />
              </div>

              <div className="p-3 rounded bg-stone-100 dark:bg-slate-800/60 text-xs font-mono space-y-1 text-stone-600 dark:text-slate-300">
                <div>Type: {filters.listingType}</div>
                <div>Typology: {filters.propertyType}</div>
                <div>Max Price: ${(filters.maxPrice / 1000000).toFixed(1)}M</div>
                <div>Min Beds: {filters.minBeds || 'Any'}</div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSaveSearchModal(false)}
                  className="px-4 py-2 text-xs font-medium rounded border border-stone-300 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded bg-amber-400 text-stone-950 uppercase tracking-wider"
                >
                  Confirm & Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className={`relative ml-auto w-full max-w-xs h-full p-6 overflow-y-auto shadow-2xl ${
            darkMode ? 'bg-slate-900 text-white' : 'bg-white text-stone-900'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-slate-800">
              <span className="font-semibold text-sm">Filter Listings</span>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="text-stone-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Same filter inputs as desktop */}
            <div className="space-y-6 mt-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-stone-400">Search Text</label>
                <input
                  type="text"
                  value={filters.searchQuery}
                  onChange={(e) => updateFilterField('searchQuery', e.target.value)}
                  className="w-full p-2 text-xs rounded border border-stone-300 dark:border-slate-700 dark:bg-slate-800"
                  placeholder="Street, City..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-stone-400">Max Price: ${(filters.maxPrice / 1000000).toFixed(1)}M</label>
                <input
                  type="range"
                  min="500000"
                  max="25000000"
                  step="500000"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilterField('maxPrice', Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 rounded bg-amber-400 text-stone-950 font-semibold text-xs uppercase tracking-wider"
              >
                Apply Filters ({filteredProperties.length} Results)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
