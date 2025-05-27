
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GalleryImage, GalleryCategory } from '@/types/gallery';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface GalleryContextType {
  images: GalleryImage[];
  categories: GalleryCategory[];
  selectedImage: GalleryImage | null;
  selectedCategory: string;
  isLoading: boolean;
  searchQuery: string;
  hasMore: boolean;
  setSelectedImage: (image: GalleryImage | null) => void;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  loadMoreImages: () => void;
  isModalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const GalleryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [displayedImages, setDisplayedImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const imagesPerPage = 12;

  // Fetch categories from Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('gallery_categories')
          .select('*')
          .order('name');
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: "Error",
          description: "Failed to load categories. Please refresh the page.",
          variant: "destructive",
        });
      }
    };

    fetchCategories();
  }, []);

  // Fetch all images from Supabase
  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('gallery_images')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setImages(data);
          // Short delay to allow skeleton loading to be visible briefly
          setTimeout(() => {
            setIsLoading(false);
          }, 800);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
        toast({
          title: "Error",
          description: "Failed to load images. Please refresh the page.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Filter images based on category and search
  useEffect(() => {
    if (images.length === 0) return;
    
    let filtered = [...images];
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(img => img.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        img => 
          img.title.toLowerCase().includes(query) || 
          img.description.toLowerCase().includes(query) || 
          img.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    setDisplayedImages(filtered.slice(0, imagesPerPage));
    setPage(1);
    setHasMore(filtered.length > imagesPerPage);
  }, [selectedCategory, searchQuery, images]);

  const loadMoreImages = () => {
    if (isLoading) return;

    let filtered = [...images];
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(img => img.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        img => 
          img.title.toLowerCase().includes(query) || 
          img.description.toLowerCase().includes(query) || 
          img.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    const nextPage = page + 1;
    const nextImages = filtered.slice(0, nextPage * imagesPerPage);
    
    setDisplayedImages(nextImages);
    setPage(nextPage);
    setHasMore(nextImages.length < filtered.length);
  };

  const value = {
    images: displayedImages,
    categories,
    selectedImage,
    selectedCategory,
    isLoading,
    searchQuery,
    hasMore,
    setSelectedImage,
    setSelectedCategory,
    setSearchQuery,
    loadMoreImages,
    isModalOpen,
    setModalOpen,
  };

  return <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>;
};

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (context === undefined) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};
