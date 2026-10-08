import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Database, Code, Server, BookOpen } from 'lucide-react';

interface ArchitectureModalProps {
  onClose: () => void;
  darkMode: boolean;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ onClose, darkMode }) => {
  const [activeTab, setActiveTab] = useState<'terminal' | 'prisma' | 'api' | 'env'>('terminal');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedCode(label);
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  const terminalCommands = `# 1. Clone or unpack repository
git clone https://github.com/zs-studios/real-estate-platform.git
cd real-estate-platform

# 2. Install all dependencies (Next.js, Prisma ORM, Lucide, Tailwind)
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your PostgreSQL database URL & Secrets:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/zs_studios_real_estate?schema=public"

# 4. Generate Prisma Client & Run Initial Schema Migration
npx prisma generate
npx prisma migrate dev --name init

# 5. (Optional) Seed the database with trophy properties & initial CRM leads
npx prisma db seed

# 6. Launch development server
npm run dev

# App runs live at: http://localhost:3000
# Prisma Studio GUI at: npx prisma studio (http://localhost:5555)`;

  const prismaSchemaCode = `// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  BUYER
  AGENT
  ADMIN
}

enum ListingType {
  FOR_SALE
  FOR_RENT
}

enum PropertyType {
  HOUSE
  APARTMENT
  CONDO
  VILLA
  PENTHOUSE
  COMMERCIAL
}

enum PropertyStatus {
  ACTIVE
  PENDING
  SOLD
  DRAFT
}

enum InquiryType {
  SCHEDULE_VIEWING
  REQUEST_INFO
  MAKE_OFFER
  GENERAL_QUESTION
}

enum LeadStatus {
  NEW
  CONTACTED
  TOUR_SCHEDULED
  UNDER_REVIEW
  CLOSED
}

model User {
  id            String          @id @default(uuid())
  email         String          @unique
  name          String
  role          Role            @default(BUYER)
  avatar        String?
  phone         String?
  agency        String?
  createdAt     DateTime        @default(now())

  listings      Property[]      @relation("AgentListings")
  inquiries     Inquiry[]       @relation("UserInquiries")
  savedItems    SavedProperty[]
  savedSearches SavedSearch[]
}

model Property {
  id                 String          @id @default(uuid())
  title              String
  slug               String          @unique
  description        String
  price              Float
  listingType        ListingType     @default(FOR_SALE)
  propertyType       PropertyType    @default(HOUSE)
  status             PropertyStatus  @default(ACTIVE)
  
  beds               Int
  baths              Float
  sqft               Int
  lotSizeSqft        Int?
  yearBuilt          Int
  
  address            String
  city               String
  state              String
  zipCode            String
  neighborhood       String?
  latitude           Float
  longitude          Float
  
  pricePerSqft       Float?
  hoaFeeMonthly      Float?          @default(0)
  propertyTaxYearly  Float?          @default(0)
  insuranceYearly    Float?          @default(0)
  
  images             String[]
  floorPlanUrl       String?
  amenities          String[]
  featured           Boolean         @default(false)
  viewsCount         Int             @default(0)
  
  agentId            String
  agent              User            @relation("AgentListings", fields: [agentId], references: [id])
  
  priceHistory       PriceHistory[]
  inquiries          Inquiry[]
  savedByUsers       SavedProperty[]

  createdAt          DateTime        @default(now())
  updatedAt          DateTime        @updatedAt

  @@index([city, status, price])
}

model Inquiry {
  id            String       @id @default(uuid())
  propertyId    String
  property      Property     @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  userId        String?
  user          User?        @relation("UserInquiries", fields: [userId], references: [id])
  
  name          String
  email         String
  phone         String
  message       String
  preferredDate DateTime?
  preferredTime String?
  type          InquiryType  @default(SCHEDULE_VIEWING)
  status        LeadStatus   @default(NEW)
  notes         String?
  
  createdAt     DateTime     @default(now())
}`;

  const apiRoutesCode = `// Next.js App Router API Routes (/app/api/...)

// 1. /app/api/properties/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');
  const type = searchParams.get('type');
  const maxPrice = searchParams.get('maxPrice');

  const properties = await prisma.property.findMany({
    where: {
      status: 'ACTIVE',
      ...(location ? { city: { contains: location, mode: 'insensitive' } } : {}),
      ...(type ? { propertyType: type as any } : {}),
      ...(maxPrice ? { price: { lte: parseFloat(maxPrice) } } : {}),
    },
    include: { agent: true },
    orderBy: { featured: 'desc' },
  });
  return NextResponse.json(properties);
}

export async function POST(request: Request) {
  const body = await request.json();
  const property = await prisma.property.create({
    data: body,
  });
  return NextResponse.json(property, { status: 201 });
}

// 2. /app/api/inquiries/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  const inquiry = await prisma.inquiry.create({
    data: {
      ...body,
      status: 'NEW',
    },
  });
  return NextResponse.json(inquiry, { status: 201 });
}`;

  const envConfig = `# Environment Setup (.env)
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/zs_studios_real_estate?schema=public"

# App Base Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional Cloud Storage (AWS S3 / Supabase Storage / Cloudinary)
STORAGE_BUCKET_NAME="zs-studios-real-estate-assets"
STORAGE_ACCESS_KEY="my-access-key"
STORAGE_SECRET_KEY="my-secret-key"

# Email Notification Provider (Resend / SendGrid)
RESEND_API_KEY="re_123456789"
ADMIN_NOTIFICATION_EMAIL="concierge@zs-studios.com"`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />
      <div className={`relative w-full max-w-4xl max-h-[90vh] rounded-xl overflow-hidden border shadow-2xl z-10 flex flex-col ${
        darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-stone-200 text-stone-900'
      }`}>
        {/* Header */}
        <div className="p-6 border-b border-stone-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">
              Full-Stack Architecture & Deployment Specifications
            </div>
            <h2 className="font-serif-display text-2xl font-bold mt-0.5">
              Backend Architecture & Terminal Setup
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-stone-400 hover:text-stone-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-stone-200 dark:border-slate-800 px-6 bg-stone-100/50 dark:bg-slate-950/50 gap-2 overflow-x-auto text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('terminal')}
            className={`py-3 px-3 flex items-center gap-2 border-b-2 font-semibold transition-colors ${
              activeTab === 'terminal'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Terminal Setup</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('prisma')}
            className={`py-3 px-3 flex items-center gap-2 border-b-2 font-semibold transition-colors ${
              activeTab === 'prisma'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Prisma ORM Schema</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('api')}
            className={`py-3 px-3 flex items-center gap-2 border-b-2 font-semibold transition-colors ${
              activeTab === 'api'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Next.js API Handlers</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('env')}
            className={`py-3 px-3 flex items-center gap-2 border-b-2 font-semibold transition-colors ${
              activeTab === 'env'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>.env Config</span>
          </button>
        </div>

        {/* Code Content */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs">
          {activeTab === 'terminal' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-stone-400">
                <span>Terminal installation & migration run-book:</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(terminalCommands, 'terminal')}
                  className="flex items-center gap-1 text-xs text-amber-500 hover:underline"
                >
                  {copiedCode === 'terminal' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'terminal' ? 'Copied' : 'Copy Commands'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-lg bg-stone-950 text-stone-200 overflow-x-auto leading-relaxed border border-stone-800">
                {terminalCommands}
              </pre>
            </div>
          )}

          {activeTab === 'prisma' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-stone-400">
                <span>PostgreSQL relational schema (prisma/schema.prisma):</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(prismaSchemaCode, 'prisma')}
                  className="flex items-center gap-1 text-xs text-amber-500 hover:underline"
                >
                  {copiedCode === 'prisma' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'prisma' ? 'Copied' : 'Copy Schema'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-lg bg-stone-950 text-stone-200 overflow-x-auto leading-relaxed border border-stone-800">
                {prismaSchemaCode}
              </pre>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-stone-400">
                <span>Route handlers for REST API (/app/api/...):</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(apiRoutesCode, 'api')}
                  className="flex items-center gap-1 text-xs text-amber-500 hover:underline"
                >
                  {copiedCode === 'api' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'api' ? 'Copied' : 'Copy Routes'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-lg bg-stone-950 text-stone-200 overflow-x-auto leading-relaxed border border-stone-800">
                {apiRoutesCode}
              </pre>
            </div>
          )}

          {activeTab === 'env' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-stone-400">
                <span>Production & Local Environment Configuration (.env):</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(envConfig, 'env')}
                  className="flex items-center gap-1 text-xs text-amber-500 hover:underline"
                >
                  {copiedCode === 'env' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'env' ? 'Copied' : 'Copy .env'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-lg bg-stone-950 text-stone-200 overflow-x-auto leading-relaxed border border-stone-800">
                {envConfig}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-stone-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded bg-stone-900 dark:bg-white text-white dark:text-stone-900 uppercase tracking-wider"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
