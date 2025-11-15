import React from 'react';

const Hero: React.FC = () => {
  return (
    <section 
      className="relative h-[60vh] md:h-[80vh] bg-cover bg-center flex items-center text-white" 
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521590832167-7ce63339509d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-4 animate-fade-in-down">Experience Beauty, Redefined.</h2>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 animate-fade-in-up">
          Welcome to Amila Saloon, where we blend artistry with expertise to bring your unique beauty to light.
        </p>
        <a 
          href="#contact" 
          className="bg-brand-secondary text-white px-8 py-3 rounded-full hover:bg-white hover:text-brand-secondary transition-all duration-300 font-semibold text-lg shadow-lg transform hover:scale-105"
        >
          Book an Appointment
        </a>
      </div>
    </section>
  );
};

export default Hero;