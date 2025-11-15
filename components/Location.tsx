import React from 'react';

const Location: React.FC = () => {
  return (
    <section id="location" className="py-20 bg-brand-light">
      <div className="container mx-auto px-6">
        <div className="text-center">
            <h2 className="text-4xl font-serif font-bold text-brand-primary mb-4">Visit Us</h2>
            <p className="text-lg text-brand-dark max-w-2xl mx-auto mb-12">
            Find your way to a relaxing and rejuvenating experience.
            </p>
        </div>
        
        <div className="max-w-4xl mx-auto bg-white p-6 md:p-10 rounded-lg shadow-xl border-t-4 border-brand-secondary">
          <iframe
            src="https://maps.google.com/maps?q=Unit%209%2C%20465%20Portrush%20Road%2C%20Glenside%20South%20Australia%205065&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="w-full h-[450px] rounded-md border-0"
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Amila Saloon Location"
          ></iframe>
          
          <div className="mt-8 pt-6 border-t border-brand-accent/70 grid md:grid-cols-2 gap-8">
            {/* Address */}
            <div className="flex items-start">
              <i data-lucide="map-pin" className="w-10 h-10 text-brand-secondary flex-shrink-0 mt-1"></i>
              <div className="ml-4">
                <h4 className="text-xl font-serif font-bold text-brand-dark">Our Address</h4>
                <p className="text-lg text-brand-primary">
                  Unit 9, 465 Portrush Road<br />
                  Glenside, South Australia 5065
                </p>
                <a 
                  href="https://www.google.com/maps/dir/?api=1&destination=Unit+9,+465+Portrush+Road,+Glenside+SA+5065" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-brand-secondary font-semibold hover:underline mt-2 inline-block"
                >
                  Get Directions
                </a>
              </div>
            </div>
            
            {/* Opening Hours */}
            <div className="flex items-start">
              <i data-lucide="clock" className="w-10 h-10 text-brand-secondary flex-shrink-0 mt-1"></i>
              <div className="ml-4">
                <h4 className="text-xl font-serif font-bold text-brand-dark">Opening Hours</h4>
                <p className="text-lg text-brand-primary">Everyday: 9:00 AM – 5:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;
