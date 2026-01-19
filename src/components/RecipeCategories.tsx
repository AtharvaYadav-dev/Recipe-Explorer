import { motion } from 'framer-motion';
import { 
  Pizza, 
  Salad, 
  Coffee, 
  Cake, 
  Soup, 
  Fish, 
  Beef, 
  Cookie,
  ChefHat,
  Clock,
  Star
} from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { cn } from '../utils/cn';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  count: number;
  trending?: boolean;
}

interface RecipeCategoriesProps {
  onCategorySelect: (category: string) => void;
}

export const RecipeCategories = ({ onCategorySelect }: RecipeCategoriesProps) => {
  const categories: Category[] = [
    {
      id: 'italian',
      name: 'Italian',
      icon: <Pizza size={24} />,
      color: 'from-red-400 to-red-600',
      count: 156,
      trending: true,
    },
    {
      id: 'healthy',
      name: 'Healthy',
      icon: <Salad size={24} />,
      color: 'from-green-400 to-green-600',
      count: 234,
    },
    {
      id: 'desserts',
      name: 'Desserts',
      icon: <Cake size={24} />,
      color: 'from-pink-400 to-pink-600',
      count: 189,
      trending: true,
    },
    {
      id: 'breakfast',
      name: 'Breakfast',
      icon: <Coffee size={24} />,
      color: 'from-yellow-400 to-orange-500',
      count: 145,
    },
    {
      id: 'soups',
      name: 'Soups',
      icon: <Soup size={24} />,
      color: 'from-orange-400 to-orange-600',
      count: 98,
    },
    {
      id: 'seafood',
      name: 'Seafood',
      icon: <Fish size={24} />,
      color: 'from-blue-400 to-blue-600',
      count: 167,
    },
    {
      id: 'grilling',
      name: 'Grilling',
      icon: <Beef size={24} />,
      color: 'from-red-500 to-red-700',
      count: 123,
    },
    {
      id: 'baking',
      name: 'Baking',
      icon: <Cookie size={24} />,
      color: 'from-amber-400 to-amber-600',
      count: 201,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Explore Categories</h2>
        <p className="text-gray-600">Discover recipes by cuisine and meal type</p>
      </div>

      {/* Categories Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategorySelect(category.name)}
            className="cursor-pointer"
          >
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-0">
                {/* Gradient Background */}
                <div className={cn(
                  'h-24 bg-gradient-to-br flex items-center justify-center relative overflow-hidden',
                  category.color
                )}>
                  {/* Icon */}
                  <div className="text-white transform transition-transform duration-300 group-hover:scale-110">
                    {category.icon}
                  </div>
                  
                  {/* Trending Badge */}
                  {category.trending && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="absolute top-2 right-2 bg-white text-gray-800 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                    >
                      <Star size={10} className="text-yellow-500 fill-current" />
                      Trending
                    </motion.div>
                  )}
                  
                  {/* Overlay Pattern */}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>25-45 min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-500 fill-current" />
                      <span>4.5+</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-4 bg-gray-100 rounded-full p-1">
          <button className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-800 shadow-sm">
            <ChefHat size={16} className="inline mr-2" />
            Quick & Easy
          </button>
          <button className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:bg-white hover:shadow-sm transition-all">
            <Star size={16} className="inline mr-2" />
            Top Rated
          </button>
          <button className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:bg-white hover:shadow-sm transition-all">
            <Clock size={16} className="inline mr-2" />
            Under 30 min
          </button>
        </div>
      </div>
    </div>
  );
};
