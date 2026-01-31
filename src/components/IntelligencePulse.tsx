'use client';

import { useState, useEffect } from 'react';
import { TrendingDown, Bell, Users, Sparkles } from 'lucide-react';

export interface PulseChip {
  id: string;
  type: 'new_sellers' | 'price_drop' | 'valuation_request' | 'ai_tip';
  label: string;
  count: number;
  suburb?: string;
  color: 'green' | 'blue' | 'orange' | 'purple';
  icon: 'users' | 'trending-down' | 'bell' | 'sparkles';
}

interface IntelligencePulseProps {
  chips: PulseChip[];
  activeFilter: string | null;
  onFilterChange: (filterId: string | null) => void;
  loading?: boolean;
}

export function IntelligencePulse({ chips, activeFilter, onFilterChange, loading }: IntelligencePulseProps) {
  const getChipStyles = (chip: PulseChip, isActive: boolean) => {
    const baseStyles = 'px-3 py-2 rounded-full text-sm font-medium flex items-center space-x-2 transition-all cursor-pointer border';
    
    const colorMap = {
      green: isActive 
        ? 'bg-green-500 text-white border-green-600 shadow-lg shadow-green-200' 
        : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:border-green-300',
      blue: isActive 
        ? 'bg-blue-500 text-white border-blue-600 shadow-lg shadow-blue-200' 
        : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300',
      orange: isActive 
        ? 'bg-orange-500 text-white border-orange-600 shadow-lg shadow-orange-200' 
        : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 hover:border-orange-300',
      purple: isActive 
        ? 'bg-purple-500 text-white border-purple-600 shadow-lg shadow-purple-200' 
        : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 hover:border-purple-300',
    };

    return `${baseStyles} ${colorMap[chip.color]}`;
  };

  const getIcon = (iconType: string, isActive: boolean) => {
    const iconClass = `w-4 h-4 ${isActive ? 'text-white' : ''}`;
    switch (iconType) {
      case 'users':
        return <Users className={iconClass} />;
      case 'trending-down':
        return <TrendingDown className={iconClass} />;
      case 'bell':
        return <Bell className={iconClass} />;
      case 'sparkles':
        return <Sparkles className={iconClass} />;
      default:
        return null;
    }
  };

  const handleChipClick = (chipId: string) => {
    if (activeFilter === chipId) {
      onFilterChange(null); // Toggle off
    } else {
      onFilterChange(chipId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-3 overflow-x-auto pb-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-9 w-40 bg-gray-200 rounded-full animate-pulse flex-shrink-0" />
        ))}
      </div>
    );
  }

  if (chips.length === 0) {
    return (
      <div className="flex items-center space-x-2 text-gray-500 text-sm">
        <Sparkles className="w-4 h-4" />
        <span>AI is monitoring your suburbs for activity...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-hide">
      {chips.map((chip) => {
        const isActive = activeFilter === chip.id;
        return (
          <button
            key={chip.id}
            onClick={() => handleChipClick(chip.id)}
            className={getChipStyles(chip, isActive)}
          >
            {/* Pulsing dot for "new sellers" chip */}
            {chip.type === 'new_sellers' && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isActive ? 'bg-white' : 'bg-green-500'}`}></span>
              </span>
            )}
            {chip.type !== 'new_sellers' && getIcon(chip.icon, isActive)}
            <span>{chip.label}</span>
          </button>
        );
      })}
      
      {activeFilter && (
        <button
          onClick={() => onFilterChange(null)}
          className="px-3 py-2 rounded-full text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Clear filter
        </button>
      )}
    </div>
  );
}

// Helper function to generate pulse chips from lead data
export function generatePulseChips(leads: any[], suburbs: string[]): PulseChip[] {
  const chips: PulseChip[] = [];
  
  // Count new sellers by suburb (leads updated in last 24h with high scores)
  const last24h = Date.now() - 24 * 60 * 60 * 1000;
  const recentLeads = leads.filter(lead => {
    const updatedAt = new Date(lead.updatedAt).getTime();
    return updatedAt > last24h && lead.sellingScore >= 60;
  });
  
  // Group by suburb
  const suburbCounts: Record<string, number> = {};
  recentLeads.forEach(lead => {
    const suburb = lead.suburb || 'Unknown';
    suburbCounts[suburb] = (suburbCounts[suburb] || 0) + 1;
  });
  
  // Create chip for suburb with most new sellers
  const topSuburb = Object.entries(suburbCounts).sort((a, b) => b[1] - a[1])[0];
  if (topSuburb && topSuburb[1] > 0) {
    chips.push({
      id: 'new_sellers',
      type: 'new_sellers',
      label: `🟢 +${topSuburb[1]} New Seller${topSuburb[1] > 1 ? 's' : ''} in ${topSuburb[0]}`,
      count: topSuburb[1],
      suburb: topSuburb[0],
      color: 'green',
      icon: 'users',
    });
  }
  
  // Count price drops (leads marked as listedForSale)
  const priceDrops = leads.filter(lead => lead.listedForSale);
  const priceDropSuburb = priceDrops[0]?.suburb;
  if (priceDrops.length > 0) {
    chips.push({
      id: 'price_drops',
      type: 'price_drop',
      label: `📉 ${priceDrops.length} Price Drop${priceDrops.length > 1 ? 's' : ''}${priceDropSuburb ? ` in ${priceDropSuburb}` : ''}`,
      count: priceDrops.length,
      suburb: priceDropSuburb,
      color: 'blue',
      icon: 'trending-down',
    });
  }
  
  // Count valuation requests
  const valuationRequests = leads.filter(lead => lead.requested);
  if (valuationRequests.length > 0) {
    chips.push({
      id: 'valuations',
      type: 'valuation_request',
      label: `🔔 ${valuationRequests.length} Valuation Request${valuationRequests.length > 1 ? 's' : ''}`,
      count: valuationRequests.length,
      color: 'orange',
      icon: 'bell',
    });
  }
  
  return chips;
}

// Filter leads based on active chip
export function filterLeadsByChip(leads: any[], activeChip: PulseChip | null): any[] {
  if (!activeChip) return leads;
  
  switch (activeChip.type) {
    case 'new_sellers':
      const last24h = Date.now() - 24 * 60 * 60 * 1000;
      return leads.filter(lead => {
        const updatedAt = new Date(lead.updatedAt).getTime();
        return updatedAt > last24h && 
               lead.sellingScore >= 60 && 
               (activeChip.suburb ? lead.suburb === activeChip.suburb : true);
      });
    case 'price_drop':
      return leads.filter(lead => lead.listedForSale);
    case 'valuation_request':
      return leads.filter(lead => lead.requested);
    default:
      return leads;
  }
}
