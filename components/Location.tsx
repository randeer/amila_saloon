import React, { useState, useEffect, useCallback } from 'react';
import { generateSalonContent } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

interface LocationProps {
  userLocation: { latitude: number; longitude: number } | null;
  locationError: string | null;
}

const Location: React.FC<LocationProps> = ({ userLocation, locationError }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocationInfo = useCallback(async () => {
    if (!userLocation && !locationError) return; // Wait for location status
    
    setIsLoading(true);
    setError(null);
    const address = "Unit 9, 465 Portrush road, Glenside South Australia. 5065 Australia";
    const basePrompt = `As a creative copywriter for 'Amila Saloon', a high-end salon, write an elegant and welcoming paragraph for our website's "Visit Us" section.
Our salon is a sanctuary of style and tranquility, located at ${address}.
We are open from 9 AM to 5 PM, seven days a week.
The tone should be sophisticated, warm, and inviting. Mention that we are conveniently situated near prominent local landmarks, making us an easy-to-find destination for relaxation and beauty.
Do not mention any difficulty in finding contact information or specific business names for landmarks. Instead, focus on creating a luxurious and appealing description of the location and experience.`;

    const prompt = userLocation 
      ? `${basePrompt} Please also weave in that the salon is conveniently located near the user's current position.`
      : basePrompt;


    try {
      const { text } = await generateSalonContent(prompt, userLocation ?? undefined);
      setContent(text);
    } catch (err) {
      setError('Could not fetch location details. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [userLocation, locationError]);

  useEffect(() => {
    fetchLocationInfo();
  }, [fetchLocationInfo]);

  return (
    <section id="location" className="py-20 bg-brand-light">
      <div className="container mx-auto px-6">
        <div className="text-center">
            <h2 className="text-4xl font-serif font-bold text-brand-primary mb-4">Visit Us</h2>
            <p className="text-lg text-brand-dark max-w-2xl mx-auto mb-12">
            Find your way to a relaxing and rejuvenating experience.
            </p>
        </div>
        
        <div className="max-w-4xl mx-auto bg-white p-10 rounded-lg shadow-xl border-t-4 border-brand-secondary">
          {isLoading && <LoadingSpinner />}
          {error && <p className="text-red-500 text-center">{error}</p>}
          {locationError && !userLocation && (
            <div className="text-center text-amber-700 bg-amber-100 p-4 rounded-md mb-6">
              <i data-lucide="alert-triangle" className="w-6 h-6 inline-block mr-2"></i> 
              {locationError} AI content may be less specific.
            </div>
          )}
          {!isLoading && !error && (
            <div className="opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
              <div className="prose prose-lg max-w-none text-brand-dark" dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
              
              <div className="mt-8 pt-6 border-t border-brand-accent/70">
                <div className="flex items-center">
                  <i data-lucide="clock" className="w-10 h-10 text-brand-secondary flex-shrink-0"></i>
                  <div className="ml-4">
                    <h4 className="text-xl font-serif font-bold text-brand-dark">Opening Hours</h4>
                    <p className="text-lg text-brand-primary">Everyday: 9:00 AM – 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Location;