import { motion } from 'framer-motion';
import { Heart, Clock, Users, Star, TrendingUp, ChefHat, Flame, Leaf } from 'lucide-react';
import type { Recipe } from '../types/recipe';

interface AdvancedRecipeCardProps {
  recipe: Recipe;
  onClick: (recipe: Recipe) => void;
  isFavorite: boolean;
  onToggleFavorite: (recipe: Recipe) => void;
  index?: number;
  showTrending?: boolean;
}

export const AdvancedRecipeCard = ({ 
  recipe, 
  onClick, 
  isFavorite, 
  onToggleFavorite, 
  index = 0,
  showTrending = false 
}: AdvancedRecipeCardProps) => {
  const handleCardClick = () => {
    onClick(recipe);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(recipe);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut" as const
      }
    }
  };

  const healthScore = recipe.veryHealthy ? 95 : recipe.vegetarian ? 80 : 60;
  const rating = 4.2 + Math.random() * 0.8; // Mock rating between 4.2 and 5.0

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -12, transition: { duration: 0.3 } }}
      onClick={handleCardClick}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-2xl glass-card hover:glass-card-dark transition-all duration-500 premium-shadow-lg hover:premium-shadow">
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
            onError={(e) => {
              e.currentTarget.src = `https://picsum.photos/seed/${recipe.id}/400/300.jpg`;
            }}
          />
          
          {/* Premium Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
          
          {/* Animated Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-30" />
          
          {/* Premium Trending Badge */}
          {showTrending && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 200 }}
              className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 premium-shadow z-40"
            >
              <TrendingUp size={12} className="animate-pulse" />
              <span className="animate-pulse">Trending</span>
            </motion.div>
          )}
          
          {/* Premium Favorite Button */}
          <motion.button
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 p-2.5 rounded-full transition-all duration-300 z-40 ${
              isFavorite
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white premium-shadow-lg'
                : 'glass-card text-gray-600 hover:text-red-500 hover:scale-110'
            }`}
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart size={18} className={`${isFavorite ? 'fill-current animate-pulse' : ''}`} />
          </motion.button>
          
          {/* Premium Quick Stats Overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 z-40">
            <div className="glass-card rounded-xl px-3 py-2 text-xs font-bold flex items-center gap-2">
              <Clock size={14} className="text-primary" />
              <span className="text-gray-800">{recipe.readyInMinutes}m</span>
            </div>
            <div className="glass-card rounded-xl px-3 py-2 text-xs font-bold flex items-center gap-2">
              <Users size={14} className="text-accent" />
              <span className="text-gray-800">{recipe.servings} serv</span>
            </div>
            <div className="glass-card rounded-xl px-3 py-2 text-xs font-bold flex items-center gap-2">
              <Flame size={14} className="text-orange-500" />
              <span className="text-gray-800">{Math.round(recipe.readyInMinutes * 8)} cal</span>
            </div>
          </div>
        </div>
        
        {/* Premium Content */}
        <div className="p-5 bg-gradient-to-b from-white to-gray-50/50">
          {/* Title */}
          <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:gradient-text transition-all duration-300 leading-tight">
            {recipe.title}
          </h3>
          
          {/* Premium Rating and Health Score */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-lg">
                <Star size={14} className="fill-current" />
                <span className="text-sm font-bold">{rating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-gray-500 font-medium">({Math.floor(Math.random() * 500 + 100)} reviews)</span>
            </div>
            <div className="flex items-center gap-2">
              {recipe.veryHealthy && (
                <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-lg">
                  <Leaf size={12} />
                  <span className="text-xs font-bold">Very Healthy</span>
                </div>
              )}
              <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-xs font-bold">Health {healthScore}</span>
              </div>
            </div>
          </div>
          
          {/* Premium Diets and Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {recipe.diets.slice(0, 3).map((diet, dietIndex) => (
              <motion.span
                key={dietIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + dietIndex * 0.1 }}
                className="px-3 py-1 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 text-xs rounded-full font-bold border border-green-200 hover:from-green-100 hover:to-emerald-100 transition-colors"
              >
                {diet}
              </motion.span>
            ))}
            {recipe.cheap && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs rounded-full font-bold border border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-colors"
              >
                💰 Budget-Friendly
              </motion.span>
            )}
            {recipe.diets.length > 3 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-bold">
                +{recipe.diets.length - 3} more
              </span>
            )}
          </div>
          
          {/* Premium Description */}
          <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
            {recipe.summary.replace(/<[^>]*>/g, '').substring(0, 120)}...
          </p>
          
          {/* Premium Bottom Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1.5 font-medium">
                <Clock size={13} className="text-primary" />
                <span>{recipe.readyInMinutes} min</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Users size={13} className="text-accent" />
                <span>{recipe.servings} servings</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <ChefHat size={13} className="text-orange-500" />
                <span>Expert</span>
              </div>
            </div>
            
            <motion.button
              onClick={handleFavoriteClick}
              className={`text-xs px-4 py-2 rounded-full font-bold transition-all duration-300 ${
                isFavorite
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white premium-shadow'
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-primary hover:to-accent hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isFavorite ? '❤️ Saved' : '🤍 Save'}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
