
import { useState, useEffect } from 'react';
import { useGallery } from '@/hooks/use-gallery';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';

const SearchBar = () => {
  const { searchQuery, setSearchQuery, categories, selectedCategory, setSelectedCategory } = useGallery();
  const [inputValue, setInputValue] = useState(searchQuery);
  const [isOpen, setIsOpen] = useState(false);

  // Update input value when search query changes
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(inputValue);
  };

  return (
    <div className="w-full lg:w-2/3 mx-auto">
      <form onSubmit={handleSearch} className="relative flex flex-col gap-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search for images..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="pl-4 pr-12 py-6 text-lg rounded-xl bg-secondary/50 backdrop-blur-sm border border-secondary shadow-lg focus:ring-primary transition-all"
          />
          <Button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/80 text-white rounded-lg px-4"
          >
            Search
          </Button>
        </div>
        
        <div className="overflow-x-auto scrollbar-none pb-2">
          <div className="flex gap-2 min-w-max">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`px-6 py-2 rounded-full transition-all ${
                  selectedCategory === category.id 
                  ? "bg-primary text-white" 
                  : "bg-secondary/50 hover:bg-secondary"
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
