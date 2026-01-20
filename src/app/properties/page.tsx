'use client';

import { DemoLayout } from '@/components/layout';
import { useState } from 'react';
import { 
  Home, 
  MapPin, 
  Search,
  Filter,
  DollarSign,
  Bed,
  Bath,
  Car,
  Calendar,
  ExternalLink
} from 'lucide-react';

interface Property {
  id: number;
  address: string;
  suburb: string;
  propertyType: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  landSize: string;
  listedDate: string;
  daysOnMarket: number;
  image: string;
  agent: string;
}

const properties: Property[] = [
  {
    id: 1,
    address: '42 Ocean View Parade',
    suburb: 'Mosman',
    propertyType: 'House',
    price: '$3,200,000',
    bedrooms: 4,
    bathrooms: 3,
    parking: 2,
    landSize: '650 sqm',
    listedDate: '2024-01-05',
    daysOnMarket: 12,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
    agent: 'Sarah Mitchell',
  },
  {
    id: 2,
    address: '18/50 Raglan Street',
    suburb: 'Mosman',
    propertyType: 'Apartment',
    price: '$1,850,000',
    bedrooms: 3,
    bathrooms: 2,
    parking: 1,
    landSize: '120 sqm',
    listedDate: '2024-01-08',
    daysOnMarket: 9,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
    agent: 'James Wilson',
  },
  {
    id: 3,
    address: '7 Burrawong Avenue',
    suburb: 'Cremorne',
    propertyType: 'House',
    price: '$2,550,000',
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    landSize: '450 sqm',
    listedDate: '2024-01-10',
    daysOnMarket: 7,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
    agent: 'Emma Thompson',
  },
  {
    id: 4,
    address: '23/12 The Corso',
    suburb: 'Manly',
    propertyType: 'Apartment',
    price: '$1,400,000',
    bedrooms: 2,
    bathrooms: 1,
    parking: 1,
    landSize: '85 sqm',
    listedDate: '2024-01-12',
    daysOnMarket: 5,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
    agent: 'Michael Chen',
  },
  {
    id: 5,
    address: '88 Military Road',
    suburb: 'Neutral Bay',
    propertyType: 'Townhouse',
    price: '$2,100,000',
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    landSize: '180 sqm',
    listedDate: '2024-01-15',
    daysOnMarket: 2,
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=300&fit=crop',
    agent: 'Rebecca Jones',
  },
  {
    id: 6,
    address: '5/22 Wycombe Road',
    suburb: 'Neutral Bay',
    propertyType: 'Apartment',
    price: '$950,000',
    bedrooms: 2,
    bathrooms: 1,
    parking: 1,
    landSize: '75 sqm',
    listedDate: '2024-01-14',
    daysOnMarket: 3,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
    agent: 'David Park',
  },
];

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [suburbFilter, setSuburbFilter] = useState<string>('all');

  const suburbs = ['all', ...Array.from(new Set(properties.map(p => p.suburb)))];
  const types = ['all', 'House', 'Apartment', 'Townhouse'];

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.suburb.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || property.propertyType === typeFilter;
    const matchesSuburb = suburbFilter === 'all' || property.suburb === suburbFilter;
    return matchesSearch && matchesType && matchesSuburb;
  });

  return (
    <DemoLayout currentPage="properties">
      <div className="flex-1 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
              <p className="text-sm text-gray-500 mt-0.5">Track listings in your area</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64"
                />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
              >
                {types.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </option>
                ))}
              </select>
              <select
                value={suburbFilter}
                onChange={(e) => setSuburbFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
              >
                {suburbs.map(suburb => (
                  <option key={suburb} value={suburb}>
                    {suburb === 'all' ? 'All Suburbs' : suburb}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <Home className="w-4 h-4 text-blue-500" />
              <span className="text-gray-600"><span className="font-semibold text-gray-900">{properties.length}</span> Properties</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span className="text-gray-600">Avg Price: <span className="font-semibold text-gray-900">$2.0M</span></span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Avg DOM: <span className="font-semibold text-gray-900">6 days</span></span>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProperties.map(property => (
              <div
                key={property.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <img
                    src={property.image}
                    alt={property.address}
                    className="w-full h-48 object-cover"
                  />
                  <span className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur text-xs font-medium rounded-lg">
                    {property.propertyType}
                  </span>
                  <span className="absolute top-3 right-3 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-lg">
                    {property.daysOnMarket} days
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-xl font-bold text-gray-900 mb-2">{property.price}</p>
                  <h3 className="font-medium text-gray-900 mb-1">{property.address}</h3>
                  <p className="text-sm text-gray-500 flex items-center mb-3">
                    <MapPin className="w-3.5 h-3.5 mr-1" />
                    {property.suburb}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center">
                      <Bed className="w-4 h-4 mr-1 text-gray-400" />
                      {property.bedrooms}
                    </span>
                    <span className="flex items-center">
                      <Bath className="w-4 h-4 mr-1 text-gray-400" />
                      {property.bathrooms}
                    </span>
                    <span className="flex items-center">
                      <Car className="w-4 h-4 mr-1 text-gray-400" />
                      {property.parking}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span>{property.landSize}</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-sm text-gray-500">Agent: {property.agent}</span>
                    <button className="flex items-center text-sm text-red-600 font-medium hover:text-red-700">
                      View Details
                      <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Home className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No properties match your filters</p>
            </div>
          )}
        </div>
      </div>
    </DemoLayout>
  );
}
