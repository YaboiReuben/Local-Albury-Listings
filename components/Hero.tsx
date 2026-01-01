
import React from 'react';

interface HeroProps {
  onCtaClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
  return (
    <div id="home" className="relative bg-white pt-16 pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 text-center lg:text-left grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
          <div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight">
              Post Your <span className="text-blue-600">Local Albury</span> Business & Get Exposure!
            </h1>
            <p className="mt-6 text-xl text-gray-500 max-w-2xl leading-relaxed">
              Choose a tier that fits your business needs. Join the most comprehensive directory in the Albury region and start connecting with new customers today.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={onCtaClick}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 transition-all hover:scale-105"
              >
                Post Your Business
              </button>
              <a 
                href="#listings"
                className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold text-lg transition-all"
              >
                Browse Listings
              </a>
            </div>
          </div>
          <div className="hidden lg:block relative">
            <div className="absolute -inset-4 bg-blue-100 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
            <img 
              src="https://picsum.photos/seed/albury/800/600" 
              alt="Local Albury" 
              className="relative rounded-3xl shadow-2xl border-8 border-white object-cover aspect-video"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
