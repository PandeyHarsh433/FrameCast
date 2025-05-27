
import { useState, useEffect } from 'react';
import { useGallery } from '@/hooks/use-gallery';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';

const ImageModal = () => {
  const { 
    images, 
    selectedImage, 
    setSelectedImage, 
    isModalOpen,
    setModalOpen
  } = useGallery();
  
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (selectedImage) {
      setIsLoading(true);
      const img = new Image();
      img.src = selectedImage.url;
      img.onload = () => setIsLoading(false);
    }
  }, [selectedImage]);

  const handleClose = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedImage(null), 300);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!selectedImage || images.length <= 1) return;
    
    const currentIndex = images.findIndex(img => img.id === selectedImage.id);
    
    if (currentIndex === -1) return;
    
    let newIndex = currentIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % images.length;
    } else {
      newIndex = (currentIndex - 1 + images.length) % images.length;
    }
    
    setSelectedImage(images[newIndex]);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') handleClose();
    if (e.key === 'ArrowLeft') navigateImage('prev');
    if (e.key === 'ArrowRight') navigateImage('next');
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, images]);

  if (!selectedImage) return null;

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
        >
          <motion.div 
            className="relative w-full h-full md:max-w-[90vw] md:max-h-[90vh] md:h-auto md:w-auto overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4 z-50 flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleClose}
                className="rounded-full bg-black/20 backdrop-blur-md hover:bg-black/40 border-none text-white shadow-md"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="relative flex flex-col items-center justify-center w-full h-full">
              {isLoading ? (
                <div className="flex items-center justify-center w-full h-full min-h-[200px] md:min-h-[400px]">
                  <div className="relative">
                    <Skeleton className="w-[90vw] md:w-[80vw] max-w-4xl h-[50vh] md:h-[70vh] animate-shimmer rounded-lg">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ZoomIn size={40} className="text-muted-foreground/30" />
                      </div>
                    </Skeleton>
                  </div>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative w-full h-full flex items-center justify-center"
                >
                  <div className="relative overflow-hidden w-full h-full flex flex-col">
                    <div className="flex-1 overflow-auto flex items-center justify-center">
                      <img
                        src={selectedImage.url}
                        alt={selectedImage.title}
                        className="object-contain max-h-[60vh] md:max-h-[70vh] w-auto h-auto mx-auto"
                        style={{
                          maxWidth: '100%',
                        }}
                      />
                    </div>
                    
                    <motion.div 
                      className="w-full p-4 md:p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent mt-auto"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h2 className="text-xl md:text-2xl font-display text-white mb-2 line-clamp-2">{selectedImage.title}</h2>
                      <p className="text-white/80 mb-3 text-sm md:text-base line-clamp-3 md:line-clamp-none">{selectedImage.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedImage.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="px-2 md:px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs md:text-sm text-white/90"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </div>
            
            {images.length > 1 && !isMobile && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/20 backdrop-blur-lg hover:bg-black/40 border-none text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('prev');
                  }}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/20 backdrop-blur-lg hover:bg-black/40 border-none text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('next');
                  }}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
            
            {/* Mobile navigation buttons with added shadow and better positioning */}
            {images.length > 1 && isMobile && (
              <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-4 z-50 shadow-[0_-4px_6px_rgba(0,0,0,0.2)] bg-gradient-to-t from-black/60 via-black/40 to-transparent py-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-black/40 backdrop-blur-lg hover:bg-black/60 border-none text-white shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('prev');
                  }}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-black/40 backdrop-blur-lg hover:bg-black/60 border-none text-white shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('next');
                  }}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageModal;
