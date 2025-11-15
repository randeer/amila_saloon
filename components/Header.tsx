import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-brand-light/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-serif text-brand-primary font-bold">Amila Saloon</h1>
        <nav className="hidden md:flex space-x-8 items-center">
          <a href="#services" className="text-brand-primary hover:text-brand-secondary transition-colors duration-300">Services</a>
          <a href="#gallery" className="text-brand-primary hover:text-brand-secondary transition-colors duration-300">Gallery</a>
          <a href="#location" className="text-brand-primary hover:text-brand-secondary transition-colors duration-300">Location</a>
          <a href="#contact" className="bg-brand-secondary text-brand-dark px-4 py-2 rounded-full shadow transition-all duration-300 hover:brightness-95 hover:text-black">Book Now</a>
        </nav>
        <button className="md:hidden text-brand-primary">
          <i data-lucide="menu"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;