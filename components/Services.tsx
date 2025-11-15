import React, { useState, useEffect, useCallback } from 'react';
import { generateSalonContent } from '../services/geminiService';
import type { Service } from '../types';
import LoadingSpinner from './LoadingSpinner';

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const prompt = `Generate a list of 6 popular services for a modern hair and beauty salon called 'Amila Saloon'. For each service, provide a short, enticing description. The services should cover hair, nails, and skincare. Format the response as a JSON array of objects, where each object has "serviceName" and "description" keys. For example: [{"serviceName": "Chic Haircut & Style", "description": "A transformative cut..."}]. Only return the JSON array.`;

    try {
      const { text } = await generateSalonContent(prompt);
      // Clean the response to handle markdown ```json ... ``` wrapper
      const cleanedText = text.replace(/```json\n?|```/g, '').trim();
      const parsedServices = JSON.parse(cleanedText);
      if (Array.isArray(parsedServices)) {
        setServices(parsedServices);
      } else {
        throw new Error("Invalid format received from API.");
      }
    } catch (err) {
      setError('Failed to load our services. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const icons = ["scissors", "sparkles", "droplets", "paint-brush", "gem", "user-check"];

  return (
    <section id="services" className="py-20 bg-brand-light">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-serif font-bold text-brand-primary mb-4">Our Signature Services</h2>
        <p className="text-lg text-brand-dark max-w-2xl mx-auto mb-12">
          Indulge in our curated selection of treatments, designed to pamper and perfect.
        </p>
        {isLoading && <LoadingSpinner />}
        {error && <p className="text-red-500">{error}</p>}
        {!isLoading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg text-left hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-t-4 border-brand-secondary">
                <div className="mb-4">
                  <i data-lucide={icons[index % icons.length]} className="w-12 h-12 text-brand-secondary"></i>
                </div>
                <h3 className="text-2xl font-serif font-semibold text-brand-dark mb-3">{service.serviceName}</h3>
                <p className="text-brand-primary leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;