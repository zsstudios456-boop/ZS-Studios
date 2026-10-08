import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  PropertyListing, 
  InquiryLead, 
  UserProfile, 
  SavedSearchItem, 
  PropertyFilterState, 
  UserRole,
  LeadStatus,
  PropertyStatus
} from '../types';
import { INITIAL_PROPERTIES, INITIAL_LEADS, SAMPLE_USERS } from '../data/seedListings';

interface RealEstateContextType {
  // Properties
  properties: PropertyListing[];
  addProperty: (property: Partial<PropertyListing>) => void;
  updateProperty: (id: string, updates: Partial<PropertyListing>) => void;
  deleteProperty: (id: string) => void;
  selectedProperty: PropertyListing | null;
  selectedPropertyId: string | null;
  setSelectedPropertyId: (id: string | null) => void;
  openListingDetail: (id: string) => void;
  quickViewProperty: PropertyListing | null;
  setQuickViewProperty: (property: PropertyListing | null) => void;
  
  // Inquiries / Leads
  inquiries: InquiryLead[];
  addInquiry: (inquiry: Omit<InquiryLead, 'id' | 'createdAt' | 'status'>) => void;
  updateInquiryStatus: (id: string, status: LeadStatus, notes?: string) => void;
  deleteInquiry: (id: string) => void;
  
  // Saved Items
  savedPropertyIds: string[];
  toggleSavedProperty: (id: string) => void;
  savedSearches: SavedSearchItem[];
  addSavedSearch: (search: Omit<SavedSearchItem, 'id' | 'createdAt'>) => void;
  deleteSavedSearch: (id: string) => void;

  // Navigation & View
  activeTab: 'home' | 'listings' | 'detail' | 'dashboard' | 'saved' | 'architecture';
  setActiveTab: (tab: 'home' | 'listings' | 'detail' | 'dashboard' | 'saved' | 'architecture') => void;

  // Role & User
  currentUser: UserProfile;
  switchUserRole: (role: UserRole) => void;

  // Filter State
  filters: PropertyFilterState;
  setFilters: React.Dispatch<React.SetStateAction<PropertyFilterState>>;
  updateFilterField: <K extends keyof PropertyFilterState>(field: K, value: PropertyFilterState[K]) => void;
  resetFilters: () => void;
  filteredProperties: PropertyListing[];

  // Dark Mode
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Notifications
  toast: string | null;
  showToast: (msg: string) => void;
}

const DEFAULT_FILTERS: PropertyFilterState = {
  searchQuery: '',
  location: 'ALL',
  listingType: 'ALL',
  propertyType: 'ALL',
  minPrice: 0,
  maxPrice: 25000000,
  minBeds: 0,
  minBaths: 0,
  amenities: [],
  sortBy: 'featured',
};

const RealEstateContext = createContext<RealEstateContextType | undefined>(undefined);

export const RealEstateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Properties state with LocalStorage
  const [properties, setProperties] = useState<PropertyListing[]>(() => {
    try {
      const saved = localStorage.getItem('aura_properties');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_PROPERTIES;
  });

  // Inquiries state
  const [inquiries, setInquiries] = useState<InquiryLead[]>(() => {
    try {
      const saved = localStorage.getItem('aura_inquiries');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_LEADS;
  });

  // Saved properties
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aura_saved_property_ids');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['prop-1', 'prop-3'];
  });

  // Saved searches
  const [savedSearches, setSavedSearches] = useState<SavedSearchItem[]>(() => {
    try {
      const saved = localStorage.getItem('aura_saved_searches');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'search-1',
        title: 'California Coastal Villas & Manors',
        location: 'California',
        listingType: 'FOR_SALE',
        minPrice: 5000000,
        maxPrice: 20000000,
        beds: 4,
        baths: 4,
        notifyEmail: true,
        createdAt: new Date().toISOString(),
      },
    ];
  });

  // Active user / role
  const [currentUser, setCurrentUser] = useState<UserProfile>(SAMPLE_USERS[0]); // Buyer initially
  const [activeTab, setActiveTab] = useState<'home' | 'listings' | 'detail' | 'dashboard' | 'saved' | 'architecture'>('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>('prop-1');
  const [quickViewProperty, setQuickViewProperty] = useState<PropertyListing | null>(null);

  // Dark Mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('aura_dark_mode') === 'true';
    } catch {
      return false;
    }
  });

  // Filters
  const [filters, setFilters] = useState<PropertyFilterState>(DEFAULT_FILTERS);

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 3800);
  };

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('aura_properties', JSON.stringify(properties));
    } catch {
      // ignore
    }
  }, [properties]);

  useEffect(() => {
    try {
      localStorage.setItem('aura_inquiries', JSON.stringify(inquiries));
    } catch {
      // ignore
    }
  }, [inquiries]);

  useEffect(() => {
    try {
      localStorage.setItem('aura_saved_property_ids', JSON.stringify(savedPropertyIds));
    } catch {
      // ignore
    }
  }, [savedPropertyIds]);

  useEffect(() => {
    try {
      localStorage.setItem('aura_saved_searches', JSON.stringify(savedSearches));
    } catch {
      // ignore
    }
  }, [savedSearches]);

  useEffect(() => {
    try {
      localStorage.setItem('aura_dark_mode', String(darkMode));
    } catch {
      // ignore
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const switchUserRole = (role: UserRole) => {
    const found = SAMPLE_USERS.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
      showToast(`Switched active persona to ${found.name} (${role})`);
    }
  };

  const addProperty = (newProp: Partial<PropertyListing>) => {
    const id = `prop-${Date.now()}`;
    const slug = (newProp.title || 'luxury-property')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const created: PropertyListing = {
      id,
      title: newProp.title || 'Modern Architecture Residence',
      slug,
      description: newProp.description || '',
      price: Number(newProp.price) || 2500000,
      listingType: newProp.listingType || 'FOR_SALE',
      propertyType: newProp.propertyType || 'HOUSE',
      status: (newProp.status as PropertyStatus) || 'ACTIVE',
      beds: Number(newProp.beds) || 3,
      baths: Number(newProp.baths) || 2.5,
      sqft: Number(newProp.sqft) || 3200,
      lotSizeSqft: newProp.lotSizeSqft || 8000,
      yearBuilt: Number(newProp.yearBuilt) || 2024,
      address: newProp.address || '100 Ocean Avenue',
      city: newProp.city || 'Los Angeles',
      state: newProp.state || 'CA',
      zipCode: newProp.zipCode || '90210',
      neighborhood: newProp.neighborhood || 'Beverly Hills',
      country: 'USA',
      latitude: newProp.latitude || 34.0736,
      longitude: newProp.longitude || -118.4004,
      pricePerSqft: Math.round((Number(newProp.price) || 2500000) / (Number(newProp.sqft) || 3200)),
      hoaFeeMonthly: Number(newProp.hoaFeeMonthly) || 0,
      propertyTaxYearly: Number(newProp.propertyTaxYearly) || Math.round((Number(newProp.price) || 2500000) * 0.012),
      insuranceYearly: Number(newProp.insuranceYearly) || Math.round((Number(newProp.price) || 2500000) * 0.003),
      images: newProp.images && newProp.images.length > 0 ? newProp.images : [properties[0].images[0]],
      amenities: newProp.amenities || ['Pool', 'Smart Automation', 'Garage (2 Cars)'],
      featured: Boolean(newProp.featured),
      viewsCount: 1,
      agentId: currentUser.id,
      agentName: currentUser.name,
      agentEmail: currentUser.email,
      agentPhone: currentUser.phone || '+1 (310) 904-4521',
      agentAvatar: currentUser.avatar,
      agentAgency: currentUser.agency || 'ZS-Studios Prime Residences',
      priceHistory: [
        {
          id: `ph-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          price: Number(newProp.price) || 2500000,
          event: 'LISTED',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProperties([created, ...properties]);
    showToast(`Property "${created.title}" successfully published!`);
  };

  const updateProperty = (id: string, updates: Partial<PropertyListing>) => {
    setProperties((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      })
    );
    showToast('Listing updated successfully.');
  };

  const deleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
    showToast('Listing deleted from catalog.');
  };

  const addInquiry = (inquiry: Omit<InquiryLead, 'id' | 'createdAt' | 'status'>) => {
    const newLead: InquiryLead = {
      ...inquiry,
      id: `lead-${Date.now()}`,
      status: 'NEW',
      createdAt: new Date().toISOString(),
    };
    setInquiries([newLead, ...inquiries]);
    showToast('Inquiry submitted! Our concierge agent has received your request.');
  };

  const updateInquiryStatus = (id: string, status: LeadStatus, notes?: string) => {
    setInquiries((prev) =>
      prev.map((lead) => {
        if (lead.id === id) {
          return {
            ...lead,
            status,
            notes: notes !== undefined ? notes : lead.notes,
          };
        }
        return lead;
      })
    );
    showToast(`Lead status updated to ${status.replace('_', ' ')}.`);
  };

  const deleteInquiry = (id: string) => {
    setInquiries((prev) => prev.filter((l) => l.id !== id));
    showToast('Inquiry record archived.');
  };

  const toggleSavedProperty = (id: string) => {
    setSavedPropertyIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Removed from saved residences.');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Saved to your private collection.');
        return [...prev, id];
      }
    });
  };

  const addSavedSearch = (search: Omit<SavedSearchItem, 'id' | 'createdAt'>) => {
    const newItem: SavedSearchItem = {
      ...search,
      id: `search-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setSavedSearches([newItem, ...savedSearches]);
    showToast(`Saved search "${search.title}" created with instant alert preferences.`);
  };

  const deleteSavedSearch = (id: string) => {
    setSavedSearches((prev) => prev.filter((s) => s.id !== id));
    showToast('Saved search removed.');
  };

  const openListingDetail = (id: string) => {
    setSelectedPropertyId(id);
    setActiveTab('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateFilterField = <K extends keyof PropertyFilterState>(
    field: K,
    value: PropertyFilterState[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const selectedProperty = useMemo(() => {
    return properties.find((p) => p.id === selectedPropertyId) || properties[0] || null;
  }, [properties, selectedPropertyId]);

  // Filtered properties memoization
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // Query filter
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesTitle = prop.title.toLowerCase().includes(q);
        const matchesAddress = prop.address.toLowerCase().includes(q);
        const matchesCity = prop.city.toLowerCase().includes(q);
        const matchesNeighborhood = prop.neighborhood.toLowerCase().includes(q);
        if (!matchesTitle && !matchesAddress && !matchesCity && !matchesNeighborhood) {
          return false;
        }
      }

      // Location filter
      if (filters.location !== 'ALL' && filters.location.trim()) {
        const loc = filters.location.toLowerCase();
        const matchesCity = prop.city.toLowerCase().includes(loc);
        const matchesState = prop.state.toLowerCase().includes(loc);
        const matchesNeighborhood = prop.neighborhood.toLowerCase().includes(loc);
        if (!matchesCity && !matchesState && !matchesNeighborhood) {
          return false;
        }
      }

      // Listing Type (FOR_SALE / FOR_RENT)
      if (filters.listingType !== 'ALL' && prop.listingType !== filters.listingType) {
        return false;
      }

      // Property Type
      if (filters.propertyType !== 'ALL' && prop.propertyType !== filters.propertyType) {
        return false;
      }

      // Price
      if (filters.minPrice > 0 && prop.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice > 0 && prop.price > filters.maxPrice) {
        return false;
      }

      // Beds
      if (filters.minBeds > 0 && prop.beds < filters.minBeds) {
        return false;
      }

      // Baths
      if (filters.minBaths > 0 && prop.baths < filters.minBaths) {
        return false;
      }

      // Amenities filter
      if (filters.amenities.length > 0) {
        const hasAll = filters.amenities.every((amenity) =>
          prop.amenities.some((a) => a.toLowerCase().includes(amenity.toLowerCase()))
        );
        if (!hasAll) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_asc') return a.price - b.price;
      if (filters.sortBy === 'price_desc') return b.price - a.price;
      if (filters.sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (filters.sortBy === 'sqft_desc') return b.sqft - a.sqft;
      // Default: featured first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [properties, filters]);

  return (
    <RealEstateContext.Provider
      value={{
        properties,
        addProperty,
        updateProperty,
        deleteProperty,
        selectedProperty,
        selectedPropertyId,
        setSelectedPropertyId,
        openListingDetail,
        quickViewProperty,
        setQuickViewProperty,
        inquiries,
        addInquiry,
        updateInquiryStatus,
        deleteInquiry,
        savedPropertyIds,
        toggleSavedProperty,
        savedSearches,
        addSavedSearch,
        deleteSavedSearch,
        activeTab,
        setActiveTab,
        currentUser,
        switchUserRole,
        filters,
        setFilters,
        updateFilterField,
        resetFilters,
        filteredProperties,
        darkMode,
        toggleDarkMode,
        toast,
        showToast,
      }}
    >
      {children}
    </RealEstateContext.Provider>
  );
};

export const useRealEstate = () => {
  const context = useContext(RealEstateContext);
  if (!context) {
    throw new Error('useRealEstate must be used within a RealEstateProvider');
  }
  return context;
};
