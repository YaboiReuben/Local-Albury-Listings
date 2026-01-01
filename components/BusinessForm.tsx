
import React, { useState } from 'react';
import { db } from '../services/database';
import { TierType } from '../types';
import { BUSINESS_TIERS } from '../constants';

interface BusinessFormProps {
  onSuccess: () => void;
  onShowRules: () => void;
}

const BusinessForm: React.FC<BusinessFormProps> = ({ onSuccess, onShowRules }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    description: '',
    email: '',
    address: '',
    tier: TierType.SMALL,
    password: '',
    agreed: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreed) {
      alert("You must agree to the website rules.");
      return;
    }

    setLoading(true);
    try {
      const isValidPassword = await db.verifyTierPassword(formData.tier, formData.password);
      
      if (formData.tier !== TierType.SMALL && !isValidPassword) {
        alert("Incorrect password or you do not have access to this tier. Contact admin.");
        setLoading(false);
        return;
      }

      await db.submitListing({
        name: formData.name,
        logo: formData.logo || `https://picsum.photos/seed/${formData.name}/200`,
        description: formData.description,
        email: formData.email,
        address: formData.address,
        tier: formData.tier
      });

      setFormData({
        name: '', logo: '', description: '', email: '', address: '',
        tier: TierType.SMALL, password: '', agreed: false
      });
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedTierInfo = BUSINESS_TIERS[formData.tier];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Business Name</label>
          <input 
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            placeholder="e.g. Albury Bakery"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Logo/Image URL</label>
          <input 
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            placeholder="https://example.com/logo.png"
            value={formData.logo}
            onChange={e => setFormData({...formData, logo: e.target.value})}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Business Description</label>
        <textarea 
          required
          rows={3}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none"
          placeholder="What makes your business special?"
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Contact Email</label>
          <input 
            required
            type="email"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            placeholder="hello@business.com"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Business Address</label>
          <input 
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            placeholder="Dean St, Albury"
            value={formData.address}
            onChange={e => setFormData({...formData, address: e.target.value})}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Select Listing Tier</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.values(TierType).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setFormData({...formData, tier: t})}
              className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all ${
                formData.tier === t 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {selectedTierInfo.requiresPassword && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="text-sm font-semibold text-blue-700">Assigned Tier Password</label>
          <input 
            required
            type="password"
            className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            placeholder="Enter unique password"
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
          />
          <p className="text-xs text-blue-500">Don't have a password? Contact admin via email.</p>
        </div>
      )}

      <div className="flex items-start gap-3 py-2">
        <input 
          id="rules-check"
          type="checkbox" 
          className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
          checked={formData.agreed}
          onChange={e => setFormData({...formData, agreed: e.target.checked})}
        />
        <label htmlFor="rules-check" className="text-sm text-gray-600 cursor-pointer select-none">
          I agree to the <button type="button" onClick={onShowRules} className="text-blue-600 hover:underline font-semibold">📋 Website Posting Rules</button>
        </label>
      </div>

      <button 
        disabled={loading}
        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-blue-200 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Business Listing'}
      </button>
    </form>
  );
};

export default BusinessForm;
