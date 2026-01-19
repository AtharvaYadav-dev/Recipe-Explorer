import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Clock, Utensils } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface SearchFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export interface SearchFilters {
  diet: string[];
  cuisine: string[];
  maxReadyTime: number;
  minReadyTime: number;
  includeIngredients: string[];
  excludeIngredients: string[];
  type: string[];
}

const diets = ['gluten free', 'dairy free', 'vegetarian', 'vegan', 'pescatarian', 'paleo'];
const cuisines = ['italian', 'mexican', 'chinese', 'indian', 'japanese', 'thai', 'french', 'greek'];
const mealTypes = ['main course', 'side dish', 'dessert', 'appetizer', 'salad', 'soup', 'beverage'];

export const SearchFilters = ({ onFiltersChange, isOpen, onToggle }: SearchFiltersProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    diet: [],
    cuisine: [],
    maxReadyTime: 120,
    minReadyTime: 0,
    includeIngredients: [],
    excludeIngredients: [],
    type: [],
  });

  const [includeIngredient, setIncludeIngredient] = useState('');
  const [excludeIngredient, setExcludeIngredient] = useState('');

  const handleFilterChange = (category: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [category]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleArrayFilter = (category: keyof SearchFilters, value: string) => {
    const currentArray = filters[category] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    handleFilterChange(category, newArray);
  };

  const addIngredient = (type: 'include' | 'exclude') => {
    const ingredient = type === 'include' ? includeIngredient : excludeIngredient;
    if (ingredient.trim()) {
      const currentArray = filters[type === 'include' ? 'includeIngredients' : 'excludeIngredients'] as string[];
      if (!currentArray.includes(ingredient.trim())) {
        handleFilterChange(
          type === 'include' ? 'includeIngredients' : 'excludeIngredients',
          [...currentArray, ingredient.trim()]
        );
      }
      if (type === 'include') {
        setIncludeIngredient('');
      } else {
        setExcludeIngredient('');
      }
    }
  };

  const removeIngredient = (type: 'include' | 'exclude', ingredient: string) => {
    const currentArray = filters[type === 'include' ? 'includeIngredients' : 'excludeIngredients'] as string[];
    handleFilterChange(
      type === 'include' ? 'includeIngredients' : 'excludeIngredients',
      currentArray.filter(item => item !== ingredient)
    );
  };

  const clearFilters = () => {
    const emptyFilters: SearchFilters = {
      diet: [],
      cuisine: [],
      maxReadyTime: 120,
      minReadyTime: 0,
      includeIngredients: [],
      excludeIngredients: [],
      type: [],
    };
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== 120 && value !== 0
  );

  return (
    <div className="relative">
      <Button
        onClick={onToggle}
        variant={hasActiveFilters ? 'default' : 'outline'}
        className="flex items-center gap-2"
      >
        <Filter size={16} />
        Filters
        {hasActiveFilters && (
          <span className="bg-primary-foreground text-primary text-xs px-2 py-0.5 rounded-full">
            {Object.values(filters).filter(v => Array.isArray(v) ? v.length > 0 : v !== 120 && v !== 0).length}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 z-50 mt-2"
          >
            <Card className="p-6 shadow-lg border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Search Filters</h3>
                <div className="flex items-center gap-2">
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear All
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={onToggle}>
                    <X size={16} />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Diet Filters */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Utensils size={16} />
                    Diet
                  </h4>
                  <div className="space-y-2">
                    {diets.map((diet) => (
                      <label key={diet} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.diet.includes(diet)}
                          onChange={() => handleArrayFilter('diet', diet)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm capitalize">{diet}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Cuisine Filters */}
                <div>
                  <h4 className="font-medium mb-3">Cuisine</h4>
                  <div className="space-y-2">
                    {cuisines.map((cuisine) => (
                      <label key={cuisine} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.cuisine.includes(cuisine)}
                          onChange={() => handleArrayFilter('cuisine', cuisine)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm capitalize">{cuisine}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Meal Type Filters */}
                <div>
                  <h4 className="font-medium mb-3">Meal Type</h4>
                  <div className="space-y-2">
                    {mealTypes.map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.type.includes(type)}
                          onChange={() => handleArrayFilter('type', type)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Cooking Time */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Clock size={16} />
                    Cooking Time
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">Min: {filters.minReadyTime} min</label>
                      <input
                        type="range"
                        min="0"
                        max="120"
                        value={filters.minReadyTime}
                        onChange={(e) => handleFilterChange('minReadyTime', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Max: {filters.maxReadyTime} min</label>
                      <input
                        type="range"
                        min="0"
                        max="120"
                        value={filters.maxReadyTime}
                        onChange={(e) => handleFilterChange('maxReadyTime', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Include Ingredients */}
                <div>
                  <h4 className="font-medium mb-3">Include Ingredients</h4>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={includeIngredient}
                        onChange={(e) => setIncludeIngredient(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addIngredient('include')}
                        placeholder="Add ingredient..."
                        className="flex-1 px-2 py-1 border rounded text-sm"
                      />
                      <Button size="sm" onClick={() => addIngredient('include')}>
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {filters.includeIngredients.map((ingredient) => (
                        <span
                          key={ingredient}
                          className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1"
                        >
                          {ingredient}
                          <button
                            onClick={() => removeIngredient('include', ingredient)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Exclude Ingredients */}
                <div>
                  <h4 className="font-medium mb-3">Exclude Ingredients</h4>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={excludeIngredient}
                        onChange={(e) => setExcludeIngredient(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addIngredient('exclude')}
                        placeholder="Add ingredient..."
                        className="flex-1 px-2 py-1 border rounded text-sm"
                      />
                      <Button size="sm" onClick={() => addIngredient('exclude')}>
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {filters.excludeIngredients.map((ingredient) => (
                        <span
                          key={ingredient}
                          className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center gap-1"
                        >
                          {ingredient}
                          <button
                            onClick={() => removeIngredient('exclude', ingredient)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
