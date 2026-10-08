import React, { useState } from 'react';
import { 
  Building, 
  PlusCircle, 
  Users, 
  Eye, 
  DollarSign, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Clock, 
  MessageSquare, 
  PhoneCall, 
  Calendar, 
  TrendingUp, 
  X,
  Filter,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import { useRealEstate } from '../context/RealEstateContext';
import { 
  PropertyListing, 
  InquiryLead, 
  LeadStatus, 
  PropertyStatus, 
  PropertyType, 
  ListingType 
} from '../types';

export const AgentDashboard: React.FC = () => {
  const { 
    properties, 
    addProperty, 
    updateProperty, 
    deleteProperty, 
    inquiries, 
    updateInquiryStatus, 
    deleteInquiry,
    currentUser,
    openListingDetail,
    darkMode 
  } = useRealEstate();

  // State for Add Listing Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formPrice, setFormPrice] = useState(4500000);
  const [formListingType, setFormListingType] = useState<ListingType>('FOR_SALE');
  const [formPropertyType, setFormPropertyType] = useState<PropertyType>('VILLA');
  const [formBeds, setFormBeds] = useState(4);
  const [formBaths, setFormBaths] = useState(4.5);
  const [formSqft, setFormSqft] = useState(4800);
  const [formAddress, setFormAddress] = useState('2400 Sierra Alta Way');
  const [formCity, setFormCity] = useState('Los Angeles');
  const [formState, setFormState] = useState('CA');
  const [formZip, setFormZip] = useState('90069');
  const [formNeighborhood, setFormNeighborhood] = useState('Sunset Strip');
  const [formDescription, setFormDescription] = useState('Architectural masterwork featuring panoramic city views, infinity edge pool, and minimalist design.');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formAmenitiesInput, setFormAmenitiesInput] = useState('Infinity Pool, Wine Cellar, Smart Home, 3-Car Garage');
  const [formFeatured, setFormFeatured] = useState(false);

  // CRM status filter
  const [leadFilter, setLeadFilter] = useState<LeadStatus | 'ALL'>('ALL');

  // Compute Analytics
  const activeProperties = properties.filter((p) => p.status === 'ACTIVE');
  const totalPortfolioValue = properties.reduce((acc, p) => acc + (p.listingType === 'FOR_SALE' ? p.price : p.price * 12), 0);
  const totalViews = properties.reduce((acc, p) => acc + p.viewsCount, 0);
  const totalLeads = inquiries.length;
  const tourScheduledCount = inquiries.filter((l) => l.status === 'TOUR_SCHEDULED').length;
  const closedCount = inquiries.filter((l) => l.status === 'CLOSED').length;
  const conversionRate = totalLeads > 0 ? ((tourScheduledCount + closedCount) / totalLeads) * 100 : 0;

  const handleOpenAdd = () => {
    setEditingPropertyId(null);
    setFormTitle('');
    setFormPrice(4500000);
    setFormListingType('FOR_SALE');
    setFormPropertyType('VILLA');
    setFormBeds(4);
    setFormBaths(4);
    setFormSqft(4500);
    setFormAddress('');
    setFormCity('Los Angeles');
    setFormState('CA');
    setFormZip('90210');
    setFormNeighborhood('Beverly Hills');
    setFormDescription('');
    setFormImageUrl('');
    setFormAmenitiesInput('Pool, Smart Home, Wine Cellar, Garage');
    setFormFeatured(false);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (prop: PropertyListing) => {
    setEditingPropertyId(prop.id);
    setFormTitle(prop.title);
    setFormPrice(prop.price);
    setFormListingType(prop.listingType);
    setFormPropertyType(prop.propertyType);
    setFormBeds(prop.beds);
    setFormBaths(prop.baths);
    setFormSqft(prop.sqft);
    setFormAddress(prop.address);
    setFormCity(prop.city);
    setFormState(prop.state);
    setFormZip(prop.zipCode);
    setFormNeighborhood(prop.neighborhood);
    setFormDescription(prop.description);
    setFormImageUrl(prop.images[0] || '');
    setFormAmenitiesInput(prop.amenities.join(', '));
    setFormFeatured(prop.featured);
    setIsAddModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amenities = formAmenitiesInput.split(',').map((s) => s.trim()).filter(Boolean);
    const images = formImageUrl.trim() ? [formImageUrl.trim()] : [properties[0].images[0]];

    if (editingPropertyId) {
      updateProperty(editingPropertyId, {
        title: formTitle,
        price: formPrice,
        listingType: formListingType,
        propertyType: formPropertyType,
        beds: formBeds,
        baths: formBaths,
        sqft: formSqft,
        address: formAddress,
        city: formCity,
        state: formState,
        zipCode: formZip,
        neighborhood: formNeighborhood,
        description: formDescription,
        amenities,
        images,
        featured: formFeatured,
      });
    } else {
      addProperty({
        title: formTitle,
        price: formPrice,
        listingType: formListingType,
        propertyType: formPropertyType,
        beds: formBeds,
        baths: formBaths,
        sqft: formSqft,
        address: formAddress,
        city: formCity,
        state: formState,
        zipCode: formZip,
        neighborhood: formNeighborhood,
        description: formDescription,
        amenities,
        images,
        featured: formFeatured,
        status: 'ACTIVE',
      });
    }

    setIsAddModalOpen(false);
  };

  const filteredInquiries = leadFilter === 'ALL'
    ? inquiries
    : inquiries.filter((l) => l.status === leadFilter);

  return (
    <div className={`py-10 transition-colors ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-stone-50 text-stone-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400 mb-1">
              <span>Agent Management Console</span>
              <span aria-hidden="true">·</span>
              <span>{currentUser.name} ({currentUser.role})</span>
            </div>
            <h1 className="font-serif-display text-3xl sm:text-4xl font-bold tracking-tight">
              Seller & Agent Command Center
            </h1>
            <p className="text-xs text-stone-500 dark:text-slate-400 mt-1 font-mono">
              Live portfolio inventory management and buyer inquiry CRM pipeline
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-4 py-2.5 rounded bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-xs tracking-wider uppercase transition-all flex items-center gap-2 shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Listing</span>
            </button>
          </div>
        </div>

        {/* Analytics KPI Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`p-6 rounded-lg border ${
            darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-stone-200 shadow-xs'
          }`}>
            <div className="flex items-center justify-between text-stone-400 text-xs font-mono uppercase">
              <span>Managed Portfolio</span>
              <DollarSign className="w-4 h-4 text-amber-500" />
            </div>
            <div className="font-serif-display text-3xl font-bold mt-2 tabular-nums">
              ${(totalPortfolioValue / 1000000).toFixed(1)}M
            </div>
            <div className="text-[11px] text-emerald-500 mt-1 font-mono">
              {properties.length} Total Registered Portfolios
            </div>
          </div>

          <div className={`p-6 rounded-lg border ${
            darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-stone-200 shadow-xs'
          }`}>
            <div className="flex items-center justify-between text-stone-400 text-xs font-mono uppercase">
              <span>Active Market Listings</span>
              <Building className="w-4 h-4 text-amber-500" />
            </div>
            <div className="font-serif-display text-3xl font-bold mt-2 tabular-nums">
              {activeProperties.length} Active
            </div>
            <div className="text-[11px] text-stone-400 mt-1 font-mono">
              {properties.length - activeProperties.length} Under Contract / Sold
            </div>
          </div>

          <div className={`p-6 rounded-lg border ${
            darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-stone-200 shadow-xs'
          }`}>
            <div className="flex items-center justify-between text-stone-400 text-xs font-mono uppercase">
              <span>Buyer Inquiries & Leads</span>
              <Users className="w-4 h-4 text-amber-500" />
            </div>
            <div className="font-serif-display text-3xl font-bold mt-2 tabular-nums">
              {totalLeads} Leads
            </div>
            <div className="text-[11px] text-amber-500 mt-1 font-mono">
              {tourScheduledCount} Private Walkthroughs Scheduled
            </div>
          </div>

          <div className={`p-6 rounded-lg border ${
            darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-stone-200 shadow-xs'
          }`}>
            <div className="flex items-center justify-between text-stone-400 text-xs font-mono uppercase">
              <span>Lead Conversion Rate</span>
              <TrendingUp className="w-4 h-4 text-amber-500" />
            </div>
            <div className="font-serif-display text-3xl font-bold mt-2 tabular-nums">
              {conversionRate.toFixed(1)}%
            </div>
            <div className="text-[11px] text-emerald-500 mt-1 font-mono">
              {totalViews.toLocaleString()} Total Verified Impressions
            </div>
          </div>
        </div>

        {/* Section 1: Inquiries & Leads CRM Table */}
        <div className={`rounded-xl border overflow-hidden ${
          darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-stone-200 shadow-xs'
        }`}>
          <div className="p-6 border-b border-stone-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif-display text-2xl font-bold">
                Inquiries & Tour Requests CRM
              </h2>
              <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                Manage inbound client walkthrough requests, qualification status, and correspondence
              </p>
            </div>

            {/* Filter by lead status */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-400 font-mono">Status:</span>
              <select
                value={leadFilter}
                onChange={(e) => setLeadFilter(e.target.value as any)}
                className={`px-3 py-1.5 rounded text-xs border ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-stone-50 border-stone-300'
                }`}
              >
                <option value="ALL">All Inquiries ({inquiries.length})</option>
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="TOUR_SCHEDULED">Tour Scheduled</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={`border-b font-mono uppercase tracking-wider text-[11px] ${
                darkMode ? 'bg-slate-950/60 border-slate-800 text-slate-400' : 'bg-stone-100 border-stone-200 text-stone-600'
              }`}>
                <tr>
                  <th className="py-3.5 px-6">Client / Contact</th>
                  <th className="py-3.5 px-6">Target Residence</th>
                  <th className="py-3.5 px-6">Type & Date</th>
                  <th className="py-3.5 px-6">Client Message / Notes</th>
                  <th className="py-3.5 px-6">Status Stage</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-slate-800">
                {filteredInquiries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-stone-400 font-mono">
                      No client leads found for this stage.
                    </td>
                  </tr>
                ) : (
                  filteredInquiries.map((lead) => (
                    <tr key={lead.id} className="hover:bg-stone-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      {/* Client */}
                      <td className="py-4 px-6">
                        <div className="font-semibold text-stone-900 dark:text-white text-sm">
                          {lead.name}
                        </div>
                        <div className="text-stone-500 font-mono text-[11px] mt-0.5">
                          {lead.email}
                        </div>
                        {lead.phone && (
                          <div className="text-stone-400 font-mono text-[11px]">
                            {lead.phone}
                          </div>
                        )}
                      </td>

                      {/* Property */}
                      <td className="py-4 px-6">
                        <div className="font-medium text-stone-900 dark:text-slate-100 line-clamp-1 max-w-[200px]">
                          {lead.propertyTitle}
                        </div>
                        <div className="text-amber-500 font-mono text-[11px]">
                          ${lead.propertyPrice?.toLocaleString()}
                        </div>
                      </td>

                      {/* Type & Schedule */}
                      <td className="py-4 px-6 font-mono text-[11px]">
                        <span className="font-semibold text-stone-700 dark:text-slate-300">
                          {lead.type.replace('_', ' ')}
                        </span>
                        {lead.preferredDate && (
                          <div className="text-stone-500 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3 text-amber-500" />
                            <span>{lead.preferredDate} {lead.preferredTime || ''}</span>
                          </div>
                        )}
                      </td>

                      {/* Message */}
                      <td className="py-4 px-6 max-w-xs">
                        <p className="text-stone-600 dark:text-slate-300 line-clamp-2 italic">
                          &quot;{lead.message}&quot;
                        </p>
                        {lead.notes && (
                          <p className="text-stone-400 font-mono text-[10px] mt-1 line-clamp-1">
                            Note: {lead.notes}
                          </p>
                        )}
                      </td>

                      {/* Status Selector */}
                      <td className="py-4 px-6">
                        <select
                          value={lead.status}
                          onChange={(e) => updateInquiryStatus(lead.id, e.target.value as LeadStatus)}
                          className={`px-2 py-1 rounded text-[11px] font-mono font-semibold uppercase tracking-wider border ${
                            lead.status === 'NEW'
                              ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40'
                              : lead.status === 'TOUR_SCHEDULED'
                              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40'
                              : lead.status === 'CLOSED'
                              ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/40'
                              : 'bg-stone-200 dark:bg-slate-800 text-stone-700 dark:text-slate-300 border-stone-300 dark:border-slate-700'
                          }`}
                        >
                          <option value="NEW">New</option>
                          <option value="CONTACTED">Contacted</option>
                          <option value="TOUR_SCHEDULED">Tour Scheduled</option>
                          <option value="UNDER_REVIEW">Under Review</option>
                          <option value="CLOSED">Closed</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={() => deleteInquiry(lead.id)}
                          title="Archive inquiry"
                          className="p-1.5 rounded text-stone-400 hover:text-red-500 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Property Management Table */}
        <div className={`rounded-xl border overflow-hidden ${
          darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-stone-200 shadow-xs'
        }`}>
          <div className="p-6 border-b border-stone-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="font-serif-display text-2xl font-bold">
                Portfolio Inventory Management
              </h2>
              <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                Add, configure, update pricing, or change status for your active and archived residences
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={`border-b font-mono uppercase tracking-wider text-[11px] ${
                darkMode ? 'bg-slate-950/60 border-slate-800 text-slate-400' : 'bg-stone-100 border-stone-200 text-stone-600'
              }`}>
                <tr>
                  <th className="py-3.5 px-6">Residence</th>
                  <th className="py-3.5 px-6">Price</th>
                  <th className="py-3.5 px-6">Specs</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Impressions</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-slate-800">
                {properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-stone-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Residence Image & Title */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={prop.images[0]}
                          alt={prop.title}
                          className="w-12 h-12 rounded object-cover border"
                        />
                        <div>
                          <div className="font-semibold text-stone-900 dark:text-white text-sm line-clamp-1">
                            {prop.title}
                          </div>
                          <div className="text-stone-400 text-[11px]">
                            {prop.address}, {prop.city}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-6 font-mono text-sm font-bold tabular-nums">
                      {prop.listingType === 'FOR_RENT' ? `$${prop.price.toLocaleString()}/mo` : `$${prop.price.toLocaleString()}`}
                    </td>

                    {/* Specs */}
                    <td className="py-4 px-6 font-mono text-[11px] text-stone-500 dark:text-slate-400">
                      {prop.beds} Beds · {prop.baths} Baths · {prop.sqft.toLocaleString()} sqft
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <select
                        value={prop.status}
                        onChange={(e) => updateProperty(prop.id, { status: e.target.value as PropertyStatus })}
                        className={`px-2 py-1 rounded text-[11px] font-mono font-semibold uppercase border ${
                          prop.status === 'ACTIVE'
                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                            : prop.status === 'PENDING'
                            ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30'
                            : 'bg-stone-200 dark:bg-slate-800 text-stone-600 dark:text-slate-400 border-stone-300 dark:border-slate-700'
                        }`}
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="PENDING">Pending</option>
                        <option value="SOLD">Sold</option>
                        <option value="DRAFT">Draft</option>
                      </select>
                    </td>

                    {/* Impressions */}
                    <td className="py-4 px-6 font-mono text-[11px] text-stone-500">
                      {prop.viewsCount.toLocaleString()} views
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openListingDetail(prop.id)}
                          title="View public detail page"
                          className="p-1.5 rounded text-stone-400 hover:text-amber-500"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(prop)}
                          title="Edit details"
                          className="p-1.5 rounded text-stone-400 hover:text-amber-500"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteProperty(prop.id)}
                          title="Delete listing"
                          className="p-1.5 rounded text-stone-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Add / Edit Listing Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm overflow-y-auto">
          <div className={`w-full max-w-2xl my-8 rounded-xl p-6 sm:p-8 border shadow-2xl ${
            darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-stone-200 text-stone-900'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-slate-800">
              <h3 className="font-serif-display text-2xl font-bold">
                {editingPropertyId ? 'Edit Property Listing' : 'Publish New Property'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 mt-6 text-xs">
              {/* Title */}
              <div>
                <label className="font-mono uppercase text-stone-400 block mb-1">
                  Listing Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. The Bel Air Hilltop Pavilion"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                  className={`w-full p-2.5 rounded border focus:outline-none focus:border-amber-400 ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-stone-50 border-stone-300'
                  }`}
                />
              </div>

              {/* Price & Acquisition Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono uppercase text-stone-400 block mb-1">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    required
                    className={`w-full p-2.5 rounded border focus:outline-none focus:border-amber-400 ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-stone-50 border-stone-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="font-mono uppercase text-stone-400 block mb-1">
                    Transaction Type
                  </label>
                  <select
                    value={formListingType}
                    onChange={(e) => setFormListingType(e.target.value as ListingType)}
                    className={`w-full p-2.5 rounded border focus:outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-stone-50 border-stone-300'
                    }`}
                  >
                    <option value="FOR_SALE">For Sale</option>
                    <option value="FOR_RENT">For Rent (Lease)</option>
                  </select>
                </div>
              </div>

              {/* Typology & Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-mono uppercase text-stone-400 block mb-1">Typology</label>
                  <select
                    value={formPropertyType}
                    onChange={(e) => setFormPropertyType(e.target.value as PropertyType)}
                    className={`w-full p-2 rounded border focus:outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-stone-50 border-stone-300'
                    }`}
                  >
                    <option value="VILLA">Villa</option>
                    <option value="PENTHOUSE">Penthouse</option>
                    <option value="HOUSE">House</option>
                    <option value="APARTMENT">Apartment</option>
                    <option value="COMMERCIAL">Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="font-mono uppercase text-stone-400 block mb-1">Beds</label>
                  <input
                    type="number"
                    value={formBeds}
                    onChange={(e) => setFormBeds(Number(e.target.value))}
                    className={`w-full p-2 rounded border focus:outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-stone-50 border-stone-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="font-mono uppercase text-stone-400 block mb-1">Baths</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formBaths}
                    onChange={(e) => setFormBaths(Number(e.target.value))}
                    className={`w-full p-2 rounded border focus:outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-stone-50 border-stone-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="font-mono uppercase text-stone-400 block mb-1">Sq Ft</label>
                  <input
                    type="number"
                    value={formSqft}
                    onChange={(e) => setFormSqft(Number(e.target.value))}
                    className={`w-full p-2 rounded border focus:outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-stone-50 border-stone-300'
                    }`}
                  />
                </div>
              </div>

              {/* Address details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-mono uppercase text-stone-400 block mb-1">Street Address</label>
                  <input
                    type="text"
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    required
                    className={`w-full p-2 rounded border focus:outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-stone-50 border-stone-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="font-mono uppercase text-stone-400 block mb-1">City</label>
                  <input
                    type="text"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    required
                    className={`w-full p-2 rounded border focus:outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-stone-50 border-stone-300'
                    }`}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-mono uppercase text-stone-400 block mb-1">Architectural Narrative</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className={`w-full p-2.5 rounded border focus:outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-stone-50 border-stone-300'
                  }`}
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="font-mono uppercase text-stone-400 block mb-1">
                  Primary Image URL (optional - defaults to architectural photo)
                </label>
                <input
                  type="text"
                  placeholder="https://... (or leave blank for high-res architectural default)"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  className={`w-full p-2 rounded border focus:outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-stone-50 border-stone-300'
                  }`}
                />
              </div>

              {/* Amenities comma separated */}
              <div>
                <label className="font-mono uppercase text-stone-400 block mb-1">
                  Luxury Amenities (comma-separated)
                </label>
                <input
                  type="text"
                  value={formAmenitiesInput}
                  onChange={(e) => setFormAmenitiesInput(e.target.value)}
                  className={`w-full p-2 rounded border focus:outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-stone-50 border-stone-300'
                  }`}
                />
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={formFeatured}
                  onChange={(e) => setFormFeatured(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-0"
                />
                <label htmlFor="featuredToggle" className="font-medium text-stone-700 dark:text-slate-300">
                  Feature on front homepage showcase
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded border border-stone-300 dark:border-slate-700 text-stone-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-amber-400 text-stone-950 font-semibold uppercase tracking-wider shadow"
                >
                  {editingPropertyId ? 'Update Listing' : 'Publish Residence'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
