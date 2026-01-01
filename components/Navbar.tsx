
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (location.pathname !== '/') {
      // If we're not on the home page, navigate home first
      e.preventDefault();
      navigate('/' + targetId);
    }
    // If we're on the home page, default anchor behavior works fine
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
            <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="hover:text-blue-600 transition-colors">Home</a>
            <a href="#post" onClick={(e) => handleNavClick(e, '#post')} className="hover:text-blue-600 transition-colors">Post</a>
            <a href="#tiers" onClick={(e) => handleNavClick(e, '#tiers')} className="hover:text-blue-600 transition-colors">Tiers</a>
            <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} className="hover:text-blue-600 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
