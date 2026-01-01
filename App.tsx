
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { db } from './services/database';
import { TierType, BusinessListing } from './types';
import { ADMIN_PASSWORD } from './constants';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BusinessForm from './components/BusinessForm';
import ListingGrid from './components/ListingGrid';
import TierSection from './components/TierSection';
import AdminPanel from './components/AdminPanel';
import RulesModal from './components/RulesModal';

const LandingPage = () => {
  const [approvedListings, setApprovedListings] = useState<BusinessListing[]>([]);
  const [showRules, setShowRules] = useState(false);
  const postFormRef = useRef<HTMLDivElement>(null);

  const refreshListings = async () => {
    const data = await db.getApprovedListings();
    setApprovedListings(data);
  };

  useEffect(() => {
    refreshListings();
    // Refresh every minute to handle auto-expiry
    const interval = setInterval(refreshListings, 60000);
    return () => clearInterval(interval);
  }, []);

  const scrollToForm = () => {
    postFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <Hero onCtaClick={scrollToForm} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24">
        {/* Active Listings Section */}
        <section id="listings" className="scroll-mt-20">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Local Businesses</h2>
              <p className="text-gray-600">Discover top-rated services in Albury.</p>
            </div>
          </div>
          <ListingGrid listings={approvedListings} />
        </section>

        {/* Post Business Section */}
        <section id="post" ref={postFormRef} className="scroll-mt-20">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-12 bg-blue-600 text-white flex flex-col justify-center">
                <h2 className="text-4xl font-bold mb-6">Join our Directory</h2>
                <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                  Put your business in front of Albury locals. Select your tier, enter your details, and start growing your community presence today.
                </p>
                <ul className="space-y-4">
                  {[
                    "Quick & easy submission process",
                    "Multiple tiers to suit your budget",
                    "Admin reviewed for quality control",
                    "Targeted local reach"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs">✓</div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 lg:p-12">
                <BusinessForm 
                  onSuccess={() => {
                    alert("Submission received! Your listing is pending admin approval.");
                    refreshListings();
                  }}
                  onShowRules={() => setShowRules(true)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Tiers Section */}
        <section id="tiers" className="scroll-mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Pricing Tiers</h2>
            <p className="text-gray-600 mt-4">Transparent pricing for every business stage.</p>
          </div>
          <TierSection />
        </section>

        {/* Contact Section */}
        <section id="contact" className="scroll-mt-20 bg-gray-900 text-white rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Questions? We're Here to Help</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Need a custom tier or have questions about your listing? Reach out to our team.
          </p>
          <a 
            href="mailto:alburycompanypost@gmail.com" 
            className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-full font-bold transition-colors"
          >
            alburycompanypost@gmail.com
          </a>
          <p className="mt-4 text-sm text-gray-500 italic">Cash only for paid tiers.</p>
        </section>
      </main>

      <footer className="bg-gray-100 border-t border-gray-200 mt-24 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex flex-wrap justify-center gap-8 mb-8 text-gray-600 font-medium">
            <a href="#home" className="hover:text-blue-600">Home</a>
            <a href="#post" className="hover:text-blue-600">Post Business</a>
            <a href="#tiers" className="hover:text-blue-600">Tiers</a>
            <a href="#contact" className="hover:text-blue-600">Contact</a>
          </div>
          <p className="text-gray-500">Copyright © 2026 Local Albury Listing</p>
        </div>
      </footer>

      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
