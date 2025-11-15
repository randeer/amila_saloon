import React, { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Location from './components/Location';
import Footer from './components/Footer';

const App: React.FC = () => {
  // Effect to manage lucide icons after initial render
  useEffect(() => {
    // @ts-ignore
    if (window.lucide) {
      // @ts-ignore
      window.lucide.createIcons();
    }
  });

  return (
    <div className="bg-brand-light min-h-screen">
      <Header />
      <main>
        <Hero />
        <Services />
        <Gallery />
        <Location />
      </main>
      <Footer />
    </div>
  );
};

export default App;
