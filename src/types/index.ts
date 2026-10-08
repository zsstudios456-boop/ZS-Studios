export type UserRole = 'BUYER' | 'AGENT' | 'ADMIN';

export type ListingType = 'FOR_SALE' | 'FOR_RENT';

export type PropertyType = 
  | 'HOUSE' 
  | 'APARTMENT' 
  | 'CONDO' 
  | 'VILLA' 
  | 'PENTHOUSE' 
  | 'COMMERCIAL';

export type PropertyStatus = 'ACTIVE' | 'PENDING' | 'SOLD' | 'DRAFT';

export type InquiryType = 
  | 'SCHEDULE_VIEWING' 
  | 'REQUEST_INFO' 
  | 'MAKE_OFFER' 
  | 'GENERAL_QUESTION';

export type LeadStatus = 
  | 'NEW' 
  | 'CONTACTED' 
  | 'TOUR_SCHEDULED' 
  | 'UNDER_REVIEW' 
  | 'CLOSED';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  agency?: string;
  licenseNumber?: string;
}

export interface PricePoint {
  id: string;
  date: string;
  price: number;
  event: 'LISTED' | 'PRICE_DROP' | 'PRICE_INCREASE' | 'PENDING' | 'SOLD';
}

export interface PropertyListing {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  listingType: ListingType;
  propertyType: PropertyType;
  status: PropertyStatus;
  
  beds: number;
  baths: number;
  sqft: number;
  lotSizeSqft?: number;
  yearBuilt: number;
  
  address: string;
  city: string;
  state: string;
  zipCode: string;
  neighborhood: string;
  country: string;
  latitude: number;
  longitude: number;
  
  pricePerSqft: number;
  hoaFeeMonthly: number;
  propertyTaxYearly: number;
  insuranceYearly: number;
  
  images: string[];
  floorPlanUrl?: string;
  virtualTourUrl?: string;
  amenities: string[];
  featured: boolean;
  viewsCount: number;
  
  agentId: string;
  agentName: string;
  agentEmail: string;
  agentPhone: string;
  agentAvatar: string;
  agentAgency: string;
  
  priceHistory: PricePoint[];
  createdAt: string;
  updatedAt: string;
}

export interface InquiryLead {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyPrice: number;
  propertyImage: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  preferredDate?: string;
  preferredTime?: string;
  type: InquiryType;
  status: LeadStatus;
  notes?: string;
  createdAt: string;
}

export interface SavedSearchItem {
  id: string;
  title: string;
  location?: string;
  listingType?: ListingType;
  propertyType?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  notifyEmail: boolean;
  createdAt: string;
}

export interface PropertyFilterState {
  searchQuery: string;
  location: string;
  listingType: ListingType | 'ALL';
  propertyType: PropertyType | 'ALL';
  minPrice: number;
  maxPrice: number;
  minBeds: number;
  minBaths: number;
  amenities: string[];
  sortBy: 'featured' | 'price_asc' | 'price_desc' | 'newest' | 'sqft_desc';
}

export interface MortgageCalculation {
  homePrice: number;
  downPaymentPercent: number;
  downPaymentAmount: number;
  loanAmount: number;
  interestRate: number; // e.g. 6.5
  loanTermYears: number; // 15 or 30
  monthlyPrincipalAndInterest: number;
  monthlyPropertyTax: number;
  monthlyHomeInsurance: number;
  monthlyHOA: number;
  totalMonthlyPayment: number;
}
