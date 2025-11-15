import React, { useState, useEffect, useCallback } from 'react';
import type { GalleryImage } from '../types';

// Cloudinary configuration - using your credentials
const CLOUD_NAME = 'dypqcurws';
const FOLDER_PATH = 'web'; // Your folder in Cloudinary

// Function to fetch images from Cloudinary
const fetchCloudinaryImages = async (): Promise<GalleryImage[]> => {
  try {
    // Using Cloudinary's resource list API
    const response = await fetch(
      `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${FOLDER_PATH}.json`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch from Cloudinary');
    }
    
    const data = await response.json();
    
    console.log('Cloudinary response:', data); // For debugging
    
    // If no resources found, return fallback
    if (!data.resources || data.resources.length === 0) {
      return getFallbackImages();
    }
    
    return data.resources.map((resource: any, index: number) => ({
      id: resource.public_id,
      src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_1200,h_800,c_fill/q_auto,f_auto/${resource.public_id}.${resource.format}`,
      alt: resource.public_id.split('/').pop()?.replace(/[-_]/g, ' ') || `Salon image ${index + 1}`,
      thumbnail: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_400,h_300,c_fill/q_auto,f_auto/${resource.public_id}.${resource.format}`,
      original: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${resource.public_id}.${resource.format}`
    }));
  } catch (error) {
    console.error('Error fetching Cloudinary images:', error);
    return getFallbackImages();
  }
};

// Alternative method using Cloudinary Admin API (more reliable)
const fetchCloudinaryImagesAdmin = async (): Promise<GalleryImage[]> => {
  try {
    // Note: This should be done via a backend API for security
    // For now, we'll use the client-side approach
    const response = await fetch(`/api/cloudinary-images?folder=${FOLDER_PATH}`);
    
    if (response.ok) {
      const data = await response.json();
      return data.images;
    }
    
    throw new Error('Backend API not available');
  } catch (error) {
    // Fall back to the public API method
    return fetchCloudinaryImages();
  }
};

// Fallback images
const getFallbackImages = (): GalleryImage[] => [
  { 
    id: 1, 
    src: 'https://images.unsplash.com/photo-1560066984-1382b2c44234?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    alt: 'Woman with a beautiful, modern hairstyle' 
  },
  { 
    id: 2, 
    src: 'https://images.unsplash.com/photo-1632345031435-8727f6897f53?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    alt: 'Stylist cutting a client\'s hair' 
  },
  { 
    id: 3, 
    src: 'https://images.unsplash.com/photo-1604654894610-df644b36a5a2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    alt: 'A close-up of a perfect manicure' 
  },
  { 
    id: 4, 
    src: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    alt: 'Client relaxing during a facial treatment' 
  },
  { 
    id: 5, 
    src: 'https://images.unsplash.com/photo-1600948838402-1d41b2dc58c3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    alt: 'The modern and stylish interior of Amila Saloon' 
  },
  { 
    id: 6, 
    src: 'https://images.unsplash.com/photo-1615562145895-0370414a5113?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    alt: 'Makeup artist applying cosmetics for a special occasion' 
  },
];

const Gallery: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [salonImages, setSalonImages] = useState<GalleryImage[]>([]);
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Fetch images on component mount
  useEffect(() => {
    const loadImages = async () => {
      setIsLoading(true);
      setHasError(false);
      
      try {
        const images = await fetchCloudinaryImages();
        setSalonImages(images);
        
        // Check if we're using fallback images
        if (images.every(img => img.src.includes('unsplash'))) {
          setHasError(true);
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

  const handleImageError = (imageId: string | number) => {
    setImageErrors(prev => ({ ...prev, [imageId]: true }));
  };

  const getCurrentImageSrc = () => {
    if (salonImages.length === 0) return '';
    
    const currentImage = salonImages[currentIndex];
    
    // If image has errored, try to get original quality
    if (imageErrors[currentImage.id]) {
      if ('original' in currentImage) {
        return (currentImage as any).original;
      }
      const fallbackIndex = currentIndex % getFallbackImages().length;
      return getFallbackImages()[fallbackIndex]?.src;
    }
    
    return currentImage.src;
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

  // Auto-slide effect, paused when modal is open
  useEffect(() => {
    if (isModalOpen || salonImages.length === 0) return;
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, [nextSlide, isModalOpen, salonImages.length]);

  // Keyboard navigation for modal
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

  if (isLoading) {
    return (
      <section id="gallery" className="py-20 bg-brand-accent">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif font-bold text-brand-primary mb-4">Our Work</h2>
          <p className="text-lg text-brand-dark max-w-2xl mx-auto mb-12">
            Loading our latest transformations from Cloudinary...
          </p>
          <div className="max-w-4xl mx-auto h-[60vh] rounded-lg bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
              <p className="text-brand-primary">Loading Cloudinary gallery...</p>
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
          <p className="text-lg text-brand-dark max-w-2xl mx-auto mb-12">
            A glimpse into the transformations and artistry we create every day.
            {hasError && (
              <span className="text-sm text-orange-600 block mt-2">
                Showing sample images. Upload your images to Cloudinary folder "web".
              </span>
            )}
            {!hasError && salonImages.length > 0 && (
              <span className="text-sm text-green-600 block mt-2">
                Loaded {salonImages.length} images from Cloudinary
              </span>
            )}
          </p>
          
          {salonImages.length > 0 ? (
            <>
              <div className="max-w-4xl mx-auto relative group">
                <div 
                  className="w-full h-[60vh] rounded-lg bg-center bg-cover duration-500 shadow-2xl cursor-pointer"
                  style={{ backgroundImage: `url(${getCurrentImageSrc()})` }}
                  onClick={openModal}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && openModal()}
                  aria-label="View larger image"
                >
                </div>
                
                {/* Left Arrow */}
                <button 
                  onClick={prevSlide} 
                  className="hidden group-hover:block absolute top-[50%] -translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/40 text-white cursor-pointer hover:bg-black/60 transition-colors" 
                  aria-label="Previous image"
                >
                  <i data-lucide="chevron-left" className="w-6 h-6"></i>
                </button>
                
                {/* Right Arrow */}
                <button 
                  onClick={nextSlide} 
                  className="hidden group-hover:block absolute top-[50%] -translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/40 text-white cursor-pointer hover:bg-black/60 transition-colors" 
                  aria-label="Next image"
                >
                  <i data-lucide="chevron-right" className="w-6 h-6"></i>
                </button>
              </div>
              
              <div className='flex top-4 justify-center py-4'>
                {salonImages.map((_, slideIndex) => (
                  <button
                    key={slideIndex}
                    onClick={() => setCurrentIndex(slideIndex)}
                    className={`text-2xl cursor-pointer p-1 transition-colors ${currentIndex === slideIndex ? 'text-brand-secondary' : 'text-brand-primary/50 hover:text-brand-primary'}`}
                    aria-label={`Go to slide ${slideIndex + 1}`}
                  >
                    ●
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="max-w-4xl mx-auto h-[60vh] rounded-lg bg-gray-100 flex items-center justify-center">
              <p className="text-brand-dark text-lg">No images found in Cloudinary gallery.</p>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && salonImages.length > 0 && (
        <div
          className="fixed inset-0 bg-black/80 flex justify-center items-center z-[100] p-4"
          onClick={closeModal}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="relative bg-brand-light p-4 rounded-lg shadow-2xl max-w-5xl w-full max-h-[95vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white bg-brand-primary rounded-full p-1.5 z-10 hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-accent transition-colors"
              aria-label="Close image viewer"
            >
              <i data-lucide="x" className="w-6 h-6"></i>
            </button>
            
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={getCurrentImageSrc()}
                alt={salonImages[currentIndex].alt}
                className="max-h-[calc(95vh-6rem)] w-auto object-contain rounded"
                onError={() => handleImageError(salonImages[currentIndex].id)}
              />
            </div>
           
            <p className="text-center text-brand-dark mt-2 text-sm md:text-base">
              {salonImages[currentIndex].alt}
            </p>

            {/* Modal Navigation */}
            <button
              onClick={prevSlide}
              className="absolute top-1/2 -translate-y-1/2 left-2 md:-left-12 text-2xl rounded-full p-2 bg-black/40 text-white cursor-pointer hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-colors"
              aria-label="Previous image"
            >
              <i data-lucide="chevron-left" className="w-8 h-8"></i>
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 -translate-y-1/2 right-2 md:-right-12 text-2xl rounded-full p-2 bg-black/40 text-white cursor-pointer hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-colors"
              aria-label="Next image"
            >
              <i data-lucide="chevron-right" className="w-8 h-8"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;
