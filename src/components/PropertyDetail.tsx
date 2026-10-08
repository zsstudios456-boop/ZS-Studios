import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Calendar, 
  ShieldCheck, 
  Calculator, 
  Send, 
  Phone, 
  Mail, 
  Bookmark, 
  Share2, 
  FileText, 
  Layers, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  ChevronRight,
  User,
  DollarSign
} from 'lucide-react';
import { useRealEstate } from '../context/RealEstateContext';
import { PropertyListing, InquiryType } from '../types';

export const PropertyDetail: React.FC = () => {
  const { 
    selectedProperty, 
    setActiveTab, 
    savedPropertyIds, 
    toggleSavedProperty, 
    addInquiry, 
    darkMode,
    showToast 
  } = useRealEstate();

  if (!selectedProperty) {
    return (
      <div className="py-24 text-center">
        <p>No property selected.</p>
        <button
          onClick={() => setActiveTab('listings')}
          className="mt-4 px-4 py-2 bg-amber-400 text-stone-950 text-xs font-semibold uppercase"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const isSaved = savedPropertyIds.includes(selectedProperty.id);

  // Gallery active image
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Active Tab in Detail: Overview vs Floor Plan vs Price History
  const [detailTab, setDetailTab] = useState<'overview' | 'floorplan' | 'pricehistory'>('overview');

  // Contact Form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState(
    `Hello Elena, I am interested in ${selectedProperty.title} (${selectedProperty.address}). Please contact me regarding scheduling a private walkthrough.`
  );
  const [inquiryType, setInquiryType] = useState<InquiryType>('SCHEDULE_VIEWING');
  const [tourDate, setTourDate] = useState('');
  const [tourTime, setTourTime] = useState('14:00');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Interactive Mortgage Calculator State
  const [homePrice, setHomePrice] = useState<number>(selectedProperty.price);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [loanTermYears, setLoanTermYears] = useState<number>(30);

  // Computed Mortgage Values
  const mortgageBreakdown = useMemo(() => {
    const downPaymentAmount = (homePrice * downPaymentPercent) / 100;
    const loanAmount = Math.max(0, homePrice - downPaymentAmount);
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTermYears * 12;

    let monthlyPrincipalAndInterest = 0;
    if (monthlyRate > 0 && loanAmount > 0) {
      monthlyPrincipalAndInterest =
        (loanAmount *
          (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    }

    const monthlyPropertyTax = (selectedProperty.propertyTaxYearly || homePrice * 0.012) / 12;
    const monthlyInsurance = (selectedProperty.insuranceYearly || homePrice * 0.0035) / 12;
    const monthlyHOA = selectedProperty.hoaFeeMonthly || 0;
    const totalMonthly = monthlyPrincipalAndInterest + monthlyPropertyTax + monthlyInsurance + monthlyHOA;

    return {
      downPaymentAmount,
      loanAmount,
      monthlyPrincipalAndInterest: Math.round(monthlyPrincipalAndInterest),
      monthlyPropertyTax: Math.round(monthlyPropertyTax),
      monthlyInsurance: Math.round(monthlyInsurance),
      monthlyHOA: Math.round(monthlyHOA),
      totalMonthly: Math.round(totalMonthly),
    };
  }, [homePrice, downPaymentPercent, interestRate, loanTermYears, selectedProperty]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail) return;

    addInquiry({
      propertyId: selectedProperty.id,
      propertyTitle: selectedProperty.title,
      propertyPrice: selectedProperty.price,
      propertyImage: selectedProperty.images[0],
      name: contactName,
      email: contactEmail,
      phone: contactPhone,
      message: contactMessage,
      preferredDate: inquiryType === 'SCHEDULE_VIEWING' ? tourDate : undefined,
      preferredTime: inquiryType === 'SCHEDULE_VIEWING' ? tourTime : undefined,
      type: inquiryType,
    });

    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
    }, 5000);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Residence brochure link copied to clipboard.');
    }
  };

  return (
    <div className={`py-8 sm:py-12 transition-colors ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-stone-50 text-stone-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-stone-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('listings')}
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Curated Catalog</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className={`p-2 rounded border text-xs flex items-center gap-1.5 transition-colors ${
                darkMode ? 'bg-slate-900 border-slate-800 hover:bg-slate-800' : 'bg-white border-stone-300 hover:bg-stone-100'
              }`}
            >
              <Share2 className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              type="button"
              onClick={() => toggleSavedProperty(selectedProperty.id)}
              className={`px-3 py-2 rounded border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                isSaved
                  ? 'bg-amber-400 text-stone-950 border-amber-400'
                  : darkMode ? 'bg-slate-900 border-slate-800 hover:bg-slate-800' : 'bg-white border-stone-300 hover:bg-stone-100'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
              <span>{isSaved ? 'In Collection' : 'Save Residence'}</span>
            </button>
          </div>
        </div>

        {/* Header Title & Pricing Banner */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-amber-600 dark:text-amber-400 mb-1">
              <span>{selectedProperty.propertyType}</span>
              <span aria-hidden="true">·</span>
              <span>{selectedProperty.neighborhood}</span>
              <span aria-hidden="true">·</span>
              <span>Built {selectedProperty.yearBuilt}</span>
            </div>
            <h1 className="font-serif-display text-3xl sm:text-5xl font-bold tracking-tight">
              {selectedProperty.title}
            </h1>
            <div className="flex items-center gap-2 text-stone-500 dark:text-slate-400 mt-2 text-sm sm:text-base">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{selectedProperty.address}, {selectedProperty.city}, {selectedProperty.state} {selectedProperty.zipCode}</span>
            </div>
          </div>

          <div className="text-left lg:text-right">
            <div className="text-xs font-mono uppercase tracking-wider text-stone-400">
              {selectedProperty.listingType === 'FOR_RENT' ? 'Private Lease Fee' : 'Offering Price'}
            </div>
            <div className="font-serif-display text-4xl sm:text-5xl font-bold tracking-tight tabular-nums text-stone-900 dark:text-white">
              {selectedProperty.listingType === 'FOR_RENT'
                ? `$${selectedProperty.price.toLocaleString()}/mo`
                : `$${selectedProperty.price.toLocaleString()}`}
            </div>
            {selectedProperty.pricePerSqft > 0 && (
              <div className="text-xs font-mono text-stone-500 dark:text-slate-400 mt-0.5">
                ${selectedProperty.pricePerSqft.toLocaleString()} / sq ft
              </div>
            )}
          </div>
        </div>

        {/* Architectural Image Gallery */}
        <div className="space-y-4 mb-12">
          {/* Main Stage Image (16:9) */}
          <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-stone-950 border border-stone-200 dark:border-slate-800 shadow-2xl">
            <img
              src={selectedProperty.images[activeImageIndex] || selectedProperty.images[0]}
              alt={selectedProperty.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transition-all duration-500"
            />
            <div className="absolute bottom-4 right-4 bg-stone-950/80 backdrop-blur-md px-3 py-1 rounded text-xs font-mono text-white border border-white/10">
              Image {activeImageIndex + 1} of {selectedProperty.images.length}
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {selectedProperty.images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-28 sm:w-36 aspect-[4/3] rounded-md overflow-hidden shrink-0 border-2 transition-all ${
                  activeImageIndex === idx
                    ? 'border-amber-400 scale-95 shadow-md'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics Ribbon (Zero-Pill Tabular Stats) */}
        <div className={`p-6 rounded-lg border mb-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 ${
          darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-stone-200 shadow-xs'
        }`}>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-stone-400">Bedrooms</div>
            <div className="text-xl sm:text-2xl font-bold font-serif-display mt-0.5 tabular-nums">
              {selectedProperty.beds} Suites
            </div>
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-stone-400">Bathrooms</div>
            <div className="text-xl sm:text-2xl font-bold font-serif-display mt-0.5 tabular-nums">
              {selectedProperty.baths} Baths
            </div>
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-stone-400">Interior Living</div>
            <div className="text-xl sm:text-2xl font-bold font-serif-display mt-0.5 tabular-nums">
              {selectedProperty.sqft.toLocaleString()} sqft
            </div>
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-stone-400">Site Area</div>
            <div className="text-xl sm:text-2xl font-bold font-serif-display mt-0.5 tabular-nums">
              {selectedProperty.lotSizeSqft ? `${(selectedProperty.lotSizeSqft / 43560).toFixed(2)} Acres` : 'Private Lot'}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-stone-400">Monthly HOA</div>
            <div className="text-xl sm:text-2xl font-bold font-serif-display mt-0.5 tabular-nums">
              ${selectedProperty.hoaFeeMonthly.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-stone-400">Year Built</div>
            <div className="text-xl sm:text-2xl font-bold font-serif-display mt-0.5 tabular-nums">
              {selectedProperty.yearBuilt}
            </div>
          </div>
        </div>

        {/* 2-Column Content Layout: Left Details / Right Sticky Mortgage & Contact Module */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Description, Features, Floor Plan, Price History */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Navigation Tabs for Details */}
            <div className="flex border-b border-stone-200 dark:border-slate-800 gap-6">
              <button
                type="button"
                onClick={() => setDetailTab('overview')}
                className={`pb-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                  detailTab === 'overview'
                    ? 'border-amber-500 text-amber-500'
                    : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                Architectural Narrative & Features
              </button>
              <button
                type="button"
                onClick={() => setDetailTab('floorplan')}
                className={`pb-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                  detailTab === 'floorplan'
                    ? 'border-amber-500 text-amber-500'
                    : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                Spatial Floor Plan
              </button>
              <button
                type="button"
                onClick={() => setDetailTab('pricehistory')}
                className={`pb-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                  detailTab === 'pricehistory'
                    ? 'border-amber-500 text-amber-500'
                    : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                Market & Price History
              </button>
            </div>

            {/* Tab: Overview */}
            {detailTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h3 className="font-serif-display text-2xl font-bold mb-3">
                    Architectural Overview
                  </h3>
                  <p className="text-stone-600 dark:text-slate-300 leading-relaxed font-light text-base sm:text-lg">
                    {selectedProperty.description}
                  </p>
                </div>

                {/* Amenities & Bespoke Appointments Checklist */}
                <div>
                  <h3 className="font-serif-display text-xl font-bold mb-4">
                    Bespoke Appointments & Features
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedProperty.amenities.map((amenity, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-3 p-3 rounded-lg border text-sm ${
                          darkMode ? 'bg-slate-900/50 border-slate-800 text-slate-200' : 'bg-white border-stone-200 text-stone-800'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Listing Agent Contact Card */}
                <div className={`p-6 rounded-lg border flex flex-col sm:flex-row items-center justify-between gap-6 ${
                  darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-stone-200 shadow-xs'
                }`}>
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedProperty.agentAvatar}
                      alt={selectedProperty.agentName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-amber-400"
                    />
                    <div>
                      <div className="text-[11px] font-mono uppercase text-amber-500 tracking-wider">
                        Listing Advisory
                      </div>
                      <h4 className="font-serif-display text-xl font-bold">
                        {selectedProperty.agentName}
                      </h4>
                      <p className="text-xs text-stone-500 dark:text-slate-400">
                        {selectedProperty.agentAgency} · {selectedProperty.agentPhone}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={`mailto:${selectedProperty.agentEmail}`}
                      className="px-4 py-2 rounded bg-amber-400 text-stone-950 font-semibold text-xs tracking-wider uppercase flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Direct Email</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Floor Plan Viewer Placeholder */}
            {detailTab === 'floorplan' && (
              <div className={`p-8 rounded-lg border text-center ${
                darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-stone-200'
              }`}>
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                    <Layers className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif-display text-2xl font-bold">
                    Spatial Architecture Blueprint
                  </h3>
                  <p className="text-stone-500 dark:text-slate-400 text-xs">
                    Multi-level architectural schematics including cantilever terraces, primary wing elevation, and mechanical layouts.
                  </p>

                  {/* Blueprint Graphic Mockup */}
                  <div className="p-6 rounded border border-dashed border-amber-500/40 bg-stone-900/40 font-mono text-xs text-stone-300 space-y-2 text-left">
                    <div className="text-amber-400 font-bold border-b border-stone-700 pb-1">
                      LEVEL 01: LIVING & REFLECTION ATRIUM
                    </div>
                    <div>• Great Room: 34&apos; x 22&apos; (Ceiling: 14&apos;)</div>
                    <div>• Chef Kitchen & Scullery: 24&apos; x 18&apos;</div>
                    <div>• Cantilever Infinity Deck: 60&apos; x 16&apos;</div>
                    <div className="text-amber-400 font-bold border-b border-stone-700 pb-1 pt-2">
                      LEVEL 02: PRIMARY RETREAT & OBSERVATORY
                    </div>
                    <div>• Primary Suite: 28&apos; x 20&apos; + Balcony</div>
                    <div>• Wellness Wet Room & Sauna: 16&apos; x 14&apos;</div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Price History */}
            {detailTab === 'pricehistory' && (
              <div className={`p-6 rounded-lg border ${
                darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-stone-200'
              }`}>
                <h3 className="font-serif-display text-xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-500" />
                  <span>Public & MLS Transaction Timeline</span>
                </h3>

                <div className="space-y-4">
                  {selectedProperty.priceHistory.map((ph) => (
                    <div
                      key={ph.id}
                      className="flex items-center justify-between p-3 rounded border border-stone-200 dark:border-slate-800 text-xs font-mono"
                    >
                      <div>
                        <span className="font-bold text-sm text-stone-900 dark:text-white">
                          ${ph.price.toLocaleString()}
                        </span>
                        <div className="text-stone-400 text-[11px] mt-0.5">{ph.date}</div>
                      </div>
                      <div className="px-2.5 py-1 rounded bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-slate-300 uppercase tracking-wider font-semibold">
                        {ph.event.replace('_', ' ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Contiguous Purchase Module & Interactive Mortgage Estimator */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Module 1: Schedule Viewing / Request Info Form */}
            <div className={`p-6 sm:p-7 rounded-xl border shadow-xl ${
              darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-stone-200 text-stone-900'
            }`}>
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-slate-800">
                <div>
                  <h3 className="font-serif-display text-2xl font-bold">
                    Schedule a Private Viewing
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                    Coordinated via {selectedProperty.agentName}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>

              {contactSubmitted ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h4 className="font-serif-display text-xl font-bold">Inquiry Transmitted</h4>
                  <p className="text-xs text-stone-500 dark:text-slate-400 max-w-xs mx-auto">
                    Your appointment request has been added to our agent dashboard and calendar. Expect confidential correspondence within 2 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 mt-5">
                  {/* Inquiry Type Tabs */}
                  <div className="grid grid-cols-2 gap-1 p-1 bg-stone-100 dark:bg-slate-800 rounded text-xs">
                    <button
                      type="button"
                      onClick={() => setInquiryType('SCHEDULE_VIEWING')}
                      className={`py-1.5 font-semibold rounded transition-colors ${
                        inquiryType === 'SCHEDULE_VIEWING'
                          ? darkMode ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-stone-950 shadow-xs'
                          : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
                      }`}
                    >
                      Private Walkthrough
                    </button>
                    <button
                      type="button"
                      onClick={() => setInquiryType('REQUEST_INFO')}
                      className={`py-1.5 font-semibold rounded transition-colors ${
                        inquiryType === 'REQUEST_INFO'
                          ? darkMode ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-stone-950 shadow-xs'
                          : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
                      }`}
                    >
                      Information Prospectus
                    </button>
                  </div>

                  {/* Preferred Date & Time (if viewing) */}
                  {inquiryType === 'SCHEDULE_VIEWING' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-mono uppercase text-stone-400 block mb-1">
                          Preferred Date
                        </label>
                        <input
                          type="date"
                          value={tourDate}
                          onChange={(e) => setTourDate(e.target.value)}
                          required
                          className={`w-full px-3 py-2 text-xs rounded border focus:outline-none focus:border-amber-400 ${
                            darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-stone-50 border-stone-300'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-mono uppercase text-stone-400 block mb-1">
                          Preferred Time
                        </label>
                        <select
                          value={tourTime}
                          onChange={(e) => setTourTime(e.target.value)}
                          className={`w-full px-3 py-2 text-xs rounded border focus:outline-none ${
                            darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-stone-50 border-stone-300'
                          }`}
                        >
                          <option value="10:00">10:00 AM (Morning)</option>
                          <option value="14:00">02:00 PM (Afternoon)</option>
                          <option value="17:00">05:00 PM (Sunset / Twilight)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Name */}
                  <div>
                    <label className="text-[11px] font-mono uppercase text-stone-400 block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Julian Vance"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      required
                      className={`w-full px-3 py-2 text-xs rounded border focus:outline-none focus:border-amber-400 ${
                        darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-stone-50 border-stone-300'
                      }`}
                    />
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-mono uppercase text-stone-400 block mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="client@domain.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        required
                        className={`w-full px-3 py-2 text-xs rounded border focus:outline-none focus:border-amber-400 ${
                          darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-stone-50 border-stone-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono uppercase text-stone-400 block mb-1">
                        Direct Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className={`w-full px-3 py-2 text-xs rounded border focus:outline-none focus:border-amber-400 ${
                          darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-stone-50 border-stone-300'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-[11px] font-mono uppercase text-stone-400 block mb-1">
                      Confidential Notes
                    </label>
                    <textarea
                      rows={3}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className={`w-full px-3 py-2 text-xs rounded border focus:outline-none focus:border-amber-400 ${
                        darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-stone-50 border-stone-300'
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-xs tracking-wider uppercase rounded transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Viewing Application</span>
                  </button>
                </form>
              )}
            </div>

            {/* Module 2: Interactive Mortgage Estimator */}
            <div className={`p-6 sm:p-7 rounded-xl border shadow-lg ${
              darkMode ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-stone-200 text-stone-900'
            }`}>
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-slate-800">
                <div className="flex items-center gap-2 font-serif-display text-xl font-bold">
                  <Calculator className="w-5 h-5 text-amber-500" />
                  <span>Mortgage Estimator</span>
                </div>
                <span className="text-[10px] font-mono uppercase text-stone-400">
                  Fixed Amortization
                </span>
              </div>

              {/* Monthly Readout */}
              <div className="my-5 p-4 rounded-lg bg-stone-100 dark:bg-slate-800/80 text-center">
                <div className="text-[11px] font-mono uppercase tracking-wider text-stone-500 dark:text-slate-400">
                  Estimated Monthly Outlay
                </div>
                <div className="font-serif-display text-3xl sm:text-4xl font-bold tracking-tight text-amber-600 dark:text-amber-400 tabular-nums mt-1">
                  ${mortgageBreakdown.totalMonthly.toLocaleString()}
                  <span className="text-sm font-sans font-normal text-stone-400">/mo</span>
                </div>
              </div>

              {/* Inputs */}
              <div className="space-y-4 text-xs font-mono">
                {/* Home Price */}
                <div>
                  <div className="flex justify-between text-stone-400 mb-1">
                    <span>Acquisition Price</span>
                    <span className="text-stone-900 dark:text-white font-bold">
                      ${homePrice.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1000000"
                    max="30000000"
                    step="250000"
                    value={homePrice}
                    onChange={(e) => setHomePrice(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                {/* Down Payment % and Amount */}
                <div>
                  <div className="flex justify-between text-stone-400 mb-1">
                    <span>Down Payment ({downPaymentPercent}%)</span>
                    <span className="text-stone-900 dark:text-white font-bold">
                      ${mortgageBreakdown.downPaymentAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[10, 20, 30, 40, 50].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setDownPaymentPercent(pct)}
                        className={`flex-1 py-1 rounded border text-[11px] ${
                          downPaymentPercent === pct
                            ? 'bg-amber-400 text-stone-950 font-bold border-amber-400'
                            : 'border-stone-300 dark:border-slate-700 text-stone-600 dark:text-slate-400'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interest Rate & Term */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-stone-400 block mb-1">Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="2"
                      max="15"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className={`w-full p-2 rounded border focus:outline-none ${
                        darkMode ? 'bg-slate-800 border-slate-700' : 'bg-stone-50 border-stone-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-stone-400 block mb-1">Loan Term</label>
                    <div className="grid grid-cols-2 gap-1">
                      {[15, 30].map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => setLoanTermYears(term)}
                          className={`py-2 rounded border text-[11px] ${
                            loanTermYears === term
                              ? 'bg-amber-400 text-stone-950 font-bold border-amber-400'
                              : 'border-stone-300 dark:border-slate-700 text-stone-600 dark:text-slate-400'
                          }`}
                        >
                          {term} Yrs
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Itemized Cost Breakdown Table */}
                <div className="pt-3 border-t border-stone-200 dark:border-slate-800 space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Principal & Interest:</span>
                    <span className="tabular-nums font-semibold">${mortgageBreakdown.monthlyPrincipalAndInterest.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Property Taxes:</span>
                    <span className="tabular-nums font-semibold">${mortgageBreakdown.monthlyPropertyTax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Homeowners Insurance:</span>
                    <span className="tabular-nums font-semibold">${mortgageBreakdown.monthlyInsurance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">HOA Assessment:</span>
                    <span className="tabular-nums font-semibold">${mortgageBreakdown.monthlyHOA.toLocaleString()}</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
