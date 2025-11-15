import React, { useState, useEffect, useCallback } from 'react';
import type { GalleryImage } from '../types';

// Cloudinary configuration
const CLOUD_NAME = 'dypqcurws';
const FOLDER_PATH = 'web';

// Function to fetch ALL images from Cloudinary folder dynamically
const fetchCloudinaryFolder = async (): Promise<GalleryImage[]> => {
  try {
    // Using Cloudinary's search API to get all images in the folder
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/search?expression=folder%3D${FOLDER_PATH}*&max_results=50`;
    
    // Note: This requires a backend API due to CORS and security
    // We'll call our own API endpoint
    const response = await fetch(`/api/cloudinary-gallery`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch from Cloudinary API');
    }
    
    const data = await response.json();
    
    if (data.resources && data.resources.length > 0) {
      return data.resources.map((resource: any, index: number) => ({
        id: resource.public_id,
        src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_1200,h_800,c_fill/q_auto,f_auto/${resource.public_id}.${resource.format}`,
        alt: resource.public_id.split('/').pop()?.replace(/[-_]/g, ' ') || `Salon image ${index + 1}`,
        original: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${resource.public_id}.${resource.format}`,
        width: resource.width,
        height: resource.height
      }));
    }
    
    throw new Error('No images found in folder');
    
  } catch (error) {
    console.error('Error fetching Cloudinary folder:', error);
    return getFallbackImages();
  }
};

// Alternative: Simple backend-less approach using Cloudinary's folder listing
const fetchCloudinaryImagesSimple = async (): Promise<GalleryImage[]> => {
  try {
    // This uses Cloudinary's folder content API (works for public folders)
    const response = await fetch(
      `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${FOLDER_PATH}.json`
    );
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.resources && data.resources.length > 0) {
        return data.resources.map((resource: any, index: number) => ({
          id: resource.public_id,
          src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_1200,h_800,c_fill/q_auto,f_auto/${resource.public_id}.${resource.format}`,
          alt: resource.public_id.split('/').pop()?.replace(/[-_]/g, ' ') || `Salon image ${index + 1}`,
          original: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${resource.public_id}.${resource.format}`
        }));
      }
    }
    
    throw new Error('No images found');
    
  } catch (error) {
    console.error('Simple Cloudinary fetch failed:', error);
    return getFallbackImages();
  }
};

// Fallback images
const getFallbackImages = (): GalleryImage[] => [
  { 
    id: 'fallback-1', 
    src: 'https://images.unsplash.com/photo-1560066984-1382b2c44234?q=80&w=1974&auto=format&fit=crop', 
    alt: 'Woman with a beautiful, modern hairstyle' 
  },
  { 
    id: 'fallback-2', 
    src: 'https://images.unsplash.com/photo-1632345031435-8727f6897f53?q=80&w=1974&auto=format&fit=crop', 
    alt: 'Stylist cutting hair' 
  },
  { 
    id: 'fallback-3', 
    src: 'https://images.unsplash.com/photo-1604654894610-df644b36a5a2?q=80&w=2070&auto=format&fit=crop', 
    alt: 'Perfect manicure' 
  },
];

const Gallery: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [salonImages, setSalonImages] = useState<GalleryImage[]>([]);
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Fetch ALL images from Cloudinary folder dynamically
  useEffect(() => {
    const loadImages = async () => {
      setIsLoading(true);
      setHasError(false);
      
      try {
        // Try the simple method first
        let images = await fetchCloudinaryImagesSimple();
        
        // If no images found, try the advanced method
        if (images.length === 0 || images.every(img => img.src.includes('unsplash'))) {
          images = await fetchCloudinaryFolder();
        }
        
        setSalonImages(images);
        
        // Check if we're using fallback images
        if (images.length === 0 || images.every(img => img.id.includes('fallback'))) {
          setHasError(true);
        } else {
          setLastUpdated(new Date().toLocaleTimeString());
        }
        
      } catch (error) {
        console.error('Error loading gallery:', error);
        setSalonImages(getFallbackImages());
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, []);

  const handleImageError = (imageId: string, imageSrc: string) => {
    console.error(`Image failed to load: ${imageSrc}`);
    setImageErrors(prev => ({ ...prev, [imageId]: true }));
  };

  const getCurrentImage = () => {
    if (salonImages.length === 0) return null;
    return salonImages[currentIndex];
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const prevSlide = useCallback(() => {
    if (salonImages.length === 0) return;
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? salonImages.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, salonImages.length]);

  const nextSlide = useCallback(() => {
    if (salonImages.length === 0) return;
    const isLastSlide = currentIndex === salonImages.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, salonImages.length]);

  // Auto-slide effect
  useEffect(() => {
    if (isModalOpen || salonImages.length === 0) return;
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, [nextSlide, isModalOpen, salonImages.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, prevSlide, nextSlide]);

  const currentImage = getCurrentImage();

  if (isLoading) {
    return (
      <section id="gallery" className="py-20 bg-brand-accent">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif font-bold text-brand-primary mb-4">Our Work</h2>
          <div className="max-w-4xl mx-auto h-[60vh] rounded-lg bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
              <p className="text-brand-primary">Loading images from Cloudinary...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="gallery" className="py-20 bg-brand-accent">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif font-bold text-brand-primary mb-4">Our Work</h2>
          <p className="text-lg text-brand-dark max-w-2xl mx-auto mb-4">
            A glimpse into the transformations and artistry we create every day.
          </p>
          
          {/* Status Info */}
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className={`text-sm font-semibold ${hasError ? 'text-orange-600' : 'text-green-600'}`}>
                  {hasError ? '⚠️ Using sample images' : `✅ Loaded ${salonImages.length} images from Cloudinary`}
                </p>
                {!hasError && lastUpdated && (
                  <p className="text-xs text-gray-600 mt-1">Last updated: {lastUpdated}</p>
                )}
              </div>
              {!hasError && (
                <button 
                  onClick={() => window.location.reload()}
                  className="text-sm bg-brand-primary text-white px-3 py-1 rounded hover:bg-brand-secondary transition-colors"
                >
                  Refresh
                </button>
              )}
            </div>
            
            {hasError && (
              <div className="mt-2 text-left">
                <p className="text-xs text-gray-600">To use your own images:</p>
                <ul className="text-xs text-gray-600 list-disc list-inside mt-1">
                  <li>Upload images to Cloudinary folder "web"</li>
                  <li>Make sure images are publicly accessible</li>
                  <li>Refresh this page</li>
                </ul>
              </div>
            )}
          </div>

          {salonImages.length > 0 && currentImage ? (
            <>
              <div className="max-w-4xl mx-auto relative group">
                {/* Main Image Display */}
                <div className="w-full h-[60vh] rounded-lg overflow-hidden shadow-2xl relative">
                  <img
                    src={currentImage.src}
                    alt={currentImage.alt}
                    className="w-full h-full object-cover cursor-pointer transition-transform duration-500 hover:scale-105"
                    onClick={openModal}
                    onError={() => handleImageError(currentImage.id, currentImage.src)}
                  />
                  
                  {/* Image Info */}
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs p-2 rounded">
                    {currentIndex + 1} / {salonImages.length}
                    <br />
                    <span className={hasError ? 'text-orange-300' : 'text-green-300'}>
                      {hasError ? 'Sample' : 'Cloudinary'}
                    </span>
                  </div>
                </div>
                
                {/* Navigation Arrows */}
                <button 
                  onClick={prevSlide} 
                  className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 left-5 text-2xl rounded-full p-3 bg-black/60 text-white hover:bg-black/80 transition-all"
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button 
                  onClick={nextSlide} 
                  className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 right-5 text-2xl rounded-full p-3 bg-black/60 text-white hover:bg-black/80 transition-all"
                  aria-label="Next image"
                >
                  ›
                </button>
              </div>
              
              {/* Dots Indicator */}
              <div className='flex justify-center py-4'>
                {salonImages.map((_, slideIndex) => (
                  <button
                    key={slideIndex}
                    onClick={() => setCurrentIndex(slideIndex)}
                    className={`text-2xl cursor-pointer p-1 transition-all ${
                      currentIndex === slideIndex 
                        ? 'text-brand-secondary scale-125' 
                        : 'text-brand-primary/50 hover:text-brand-primary'
                    }`}
                    aria-label={`View image ${slideIndex + 1}`}
                  >
                    ●
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="max-w-4xl mx-auto h-[60vh] rounded-lg bg-red-100 border-2 border-red-300 flex items-center justify-center">
              <div className="text-center">
                <p className="text-red-600 text-lg font-semibold">No images available</p>
                <p className="text-red-500 text-sm mt-2">Please check your Cloudinary configuration</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && currentImage && (
        <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-50 p-4">
          <div className="relative max-w-6xl max-h-[90vh] bg-white rounded-lg overflow-hidden">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 text-white bg-red-500 rounded-full p-2 hover:bg-red-600 transition-colors"
              aria-label="Close gallery"
            >
              ✕
            </button>
            
            <img
              src={currentImage.original || currentImage.src}
              alt={currentImage.alt}
              className="max-w-full max-h-[80vh] object-contain"
              onError={() => handleImageError(currentImage.id, currentImage.src)}
            />
            
            <div className="p-4 bg-white">
              <p className="text-center text-gray-800 font-semibold">
                {currentImage.alt}
              </p>
              <p className="text-center text-gray-600 text-sm mt-1">
                {currentIndex + 1} of {salonImages.length}
              </p>
            </div>

            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-4 -translate-y-1/2 text-2xl rounded-full p-3 bg-black/60 text-white hover:bg-black/80 transition-all"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-2xl rounded-full p-3 bg-black/60 text-white hover:bg-black/80 transition-all"
              aria-label="Next image"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;
