
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [clickCount, setClickCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount === 3) {
      navigate('/admin');
      setClickCount(0);
    }
    // Reset click count after a delay
    setTimeout(() => setClickCount(0), 3000);
  };

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={handleLogoClick}
          >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xl">L</div>
            <span className="font-bold text-xl tracking-tight text-gray-900 hidden sm:block">Local <span className="text-blue-600">Albury Listing</span></span>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-8 font-medium text-gray-600">
            <button 
              onClick={() => scrollToSection('home')} 
              className="hover:text-blue-600 transition-colors focus:outline-none"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('post')} 
              className="hover:text-blue-600 transition-colors focus:outline-none"
            >
              Post
            </button>
            <button 
              onClick={() => scrollToSection('tiers')} 
              className="hover:text-blue-600 transition-colors focus:outline-none"
            >
              Tiers
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="hover:text-blue-600 transition-colors focus:outline-none"
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
