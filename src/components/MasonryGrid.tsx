
import { useEffect, useState } from 'react';
import { GalleryImage } from '@/types/gallery';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageIcon } from 'lucide-react';

interface MasonryGridProps {
  images: GalleryImage[];
  onImageClick: (image: GalleryImage) => void;
  isLoading: boolean;
}

const MasonryGrid = ({ images, onImageClick, isLoading }: MasonryGridProps) => {
  const [columns, setColumns] = useState<number>(3);
  
  // Responsive column count
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) setColumns(1);
      else if (width < 1024) setColumns(2);
      else setColumns(3);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  const renderSkeleton = () => {
    return Array(9).fill(0).map((_, index) => {
      // Random heights for skeleton items for more natural look
      const height = Math.floor(Math.random() * 200) + 200;
      
      return (
        <motion.div 
          key={`skeleton-${index}`} 
          className="w-full mb-4 overflow-hidden rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
        >
          <div className="relative">
            <Skeleton className="w-full rounded-lg animate-shimmer" style={{ height: `${height}px` }}>
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
                <ImageIcon size={40} />
              </div>
            </Skeleton>
          </div>
          <div className="mt-2 space-y-2">
            <Skeleton className="w-3/4 h-4" />
            <Skeleton className="w-1/2 h-3" />
          </div>
        </motion.div>
      );
    });
  };

  // Custom masonry layout
  const calculateMasonryLayout = () => {
    const columnArrays: GalleryImage[][] = Array.from({ length: columns }, () => []);
    const columnHeights: number[] = Array(columns).fill(0);
    
    // Distribute images among columns based on their aspect ratio
    images.forEach((image) => {
      // Find shortest column
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      
      // Add image to shortest column
      columnArrays[shortestColumnIndex].push(image);
      
      // Update height of column based on aspect ratio
      const aspectRatio = image.width / image.height;
      const imageHeight = 1 / aspectRatio; // Normalize height
      columnHeights[shortestColumnIndex] += imageHeight;
    });
    
    return columnArrays;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderSkeleton()}
      </div>
    );
  }

  const masonryColumns = calculateMasonryLayout();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {masonryColumns.map((column, columnIndex) => (
        <div key={`column-${columnIndex}`} className="flex flex-col gap-6">
          {column.map((image, imageIndex) => (
            <motion.div
              key={image.id}
              className="group relative overflow-hidden rounded-lg shadow-md transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: imageIndex * 0.08, duration: 0.4 }}
              whileHover={{ 
                y: -5,
                scale: 1.02,
                transition: { duration: 0.2 },
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)'
              }}
              onClick={() => onImageClick(image)}
            >
              {/* Image with natural aspect ratio */}
              <div 
                style={{ 
                  paddingBottom: `${(image.height / image.width) * 100}%`,
                  position: 'relative'
                }} 
                className="w-full overflow-hidden"
              >
                <img 
                  src={image.url} 
                  alt={image.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105"
                />
                
                {/* Overlay that appears on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 p-4 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <motion.h3 
                      className="text-white text-lg font-semibold font-display mb-2 line-clamp-2"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {image.title}
                    </motion.h3>
                    <motion.div 
                      className="flex flex-wrap gap-2"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {image.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span 
                          key={tagIndex} 
                          className="text-xs text-white/90 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;
