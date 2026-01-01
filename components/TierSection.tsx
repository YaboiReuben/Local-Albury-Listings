
import React from 'react';
import { BUSINESS_TIERS } from '../constants';
import { TierType } from '../types';

const TierSection: React.FC = () => {
  const tiers = Object.values(BUSINESS_TIERS);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {tiers.map((tier) => (
        <div 
          key={tier.name}
          className={`tier-card relative bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col ${
            tier.name === TierType.MASSIVE ? 'border-yellow-200 bg-yellow-50/30' : ''
          }`}
        >
          {tier.name === TierType.MASSIVE && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
              MOST EXPOSURE
            </div>
          )}
          <h3 className="text-xl font-bold text-gray-900 mb-1">{tier.name} Business</h3>
          <p className="text-blue-600 font-bold text-2xl mb-2">{tier.price}</p>
          <p className="text-gray-400 text-sm mb-6">Lasts for {tier.duration}</p>
          
          <ul className="space-y-4 mb-8 flex-grow">
            {tier.features.map((feat, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                <span className="text-blue-500 font-bold">✓</span>
                {feat}
              </li>
            ))}
          </ul>

          <div className="pt-6 border-t border-gray-100">
             <p className="text-[10px] text-gray-400 leading-tight">
               {tier.requiresPassword 
                 ? "Contact alburycompanypost@gmail.com to purchase and receive your password."
                 : "Free for all local businesses. Auto-expires after 2 days."
               }
             </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TierSection;
