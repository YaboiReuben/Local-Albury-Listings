
import React, { useState } from 'react';
import { BusinessListing, TierType } from '../types';

interface ListingGridProps {
  listings: BusinessListing[];
}

const ListingGrid: React.FC<ListingGridProps> = ({ listings }) => {
  const [filter, setFilter] = useState<TierType | 'All'>('All');

  const filtered = filter === 'All' 
    ? listings 
    : listings.filter(l => l.tier === filter);

  if (listings.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
        <p className="text-gray-400 text-lg">No active listings in Albury yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          onClick={() => setFilter('All')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${filter === 'All' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
        >
          All Businesses
        </button>
        {Object.values(TierType).map(t => (
          <button 
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${filter === t ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            {t} Tier
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(item => (
          <div 
            key={item.id} 
            className={`group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 relative ${
              item.tier === TierType.MASSIVE ? 'ring-2 ring-yellow-400' : ''
            }`}
          >
            {item.tier === TierType.MASSIVE && (
              <div className="absolute top-4 right-4 z-10">
                <span className="bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest shadow-sm">Massive Elite</span>
              </div>
            )}
            {item.tier === TierType.BIG && (
              <div className="absolute top-4 right-4 z-10">
                <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">Big Listing</span>
              </div>
            )}

            <div className={`relative overflow-hidden ${item.tier === TierType.MASSIVE ? 'h-64' : 'h-48'}`}>
              <img 
                src={item.logo} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-white font-bold text-xl">{item.name}</h3>
                  <p className="text-white/80 text-sm line-clamp-1">{item.address}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-600 text-sm mb-6 line-clamp-3 min-h-[4.5rem]">
                {item.description}
              </p>
              
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <a 
                  href={`mailto:${item.email}`}
                  className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1"
                >
                  Contact Business →
                </a>
                <span className="text-xs text-gray-400 font-medium">
                  Tier: {item.tier}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          No businesses found in this category.
        </div>
      )}
    </div>
  );
};

export default ListingGrid;
