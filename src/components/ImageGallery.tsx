
import { useRef, useEffect } from 'react';
import { useGallery } from '@/hooks/use-gallery';
import { useInView } from 'framer-motion';
import MasonryGrid from '@/components/MasonryGrid';
import { GalleryVertical } from 'lucide-react';

const ImageGallery = () => {
  const { images, setSelectedImage, hasMore, loadMoreImages, setModalOpen, isLoading } = useGallery();
  const loadMoreRef = useRef(null);
  const isInView = useInView(loadMoreRef, { once: false });

  // Handle infinite scrolling
  useEffect(() => {
    if (isInView && hasMore) {
      loadMoreImages();
    }
  }, [isInView, hasMore, loadMoreImages]);

  const handleImageClick = (image: any) => {
    setSelectedImage(image);
    setModalOpen(true);
  };

  return (
    <div className="w-full mx-auto pb-20">
      {images.length === 0 && !isLoading ? (
        <div className="text-center py-20">
          <GalleryVertical size={48} className="mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-medium text-muted-foreground">No images found</h3>
          <p className="text-muted-foreground mt-2">Try changing your searches or filters</p>
        </div>
      ) : (
        <MasonryGrid
          images={images}
          onImageClick={handleImageClick}
          isLoading={isLoading}
        />
      )}

      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className="h-20 w-full flex justify-center items-center py-16">
        {hasMore && !isLoading && (
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        )}
      </div>
    </div>
  );
};

export default ImageGallery;
