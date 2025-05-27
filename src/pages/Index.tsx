
import { useEffect, useState } from 'react';
import { GalleryProvider } from '@/hooks/use-gallery';
import LoadingScreen from '@/components/LoadingScreen';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import ImageGallery from '@/components/ImageGallery';
import ImageModal from '@/components/ImageModal';
import { AnimatePresence, motion } from 'framer-motion';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Better loading experience with minimum display time
    const minLoadingTime = 2000; // 2 seconds minimum loading screen
    const startTime = Date.now();
    
    const timer = setTimeout(() => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      
      setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <GalleryProvider>
      <AnimatePresence>
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <motion.main 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen w-full relative overflow-hidden image-gallery-mask"
          >
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-primary/20 rounded-full blur-[120px] -z-10 animate-float" />
            <div className="absolute bottom-0 left-0 w-[40vw] h-[40vh] bg-accent/10 rounded-full blur-[100px] -z-10 animate-float" style={{ animationDelay: '-3s' }} />
            
            <div className="container max-w-7xl mx-auto px-4">
              <Header />
              
              <section className="mb-12">
                <SearchBar />
              </section>
              
              <section>
                <ImageGallery />
              </section>
            </div>
            
            <ImageModal />
          </motion.main>
        )}
      </AnimatePresence>
    </GalleryProvider>
  );
};

export default Index;
