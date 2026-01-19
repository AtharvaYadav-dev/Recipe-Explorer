import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { SearchBar } from './components/SearchBar';
import { AdvancedRecipeCard } from './components/AdvancedRecipeCard';
import { RecipeDetails } from './components/RecipeDetails';
import { FavoritesList } from './components/FavoritesList';
import { ShoppingList } from './components/ShoppingList';
import { RecipeCategories } from './components/RecipeCategories';
import { SearchFilters, type SearchFilters as SearchFiltersType } from './components/SearchFilters';
import { ThemeToggle } from './components/ThemeToggle';
import { RecipeCardSkeleton } from './components/ui/Skeleton';
import { MealPlanner } from './components/MealPlanner';
import { NutritionDashboard } from './components/NutritionDashboard';
import { useFavorites } from './hooks/useFavorites';
import { searchRecipes, getRandomRecipes } from './utils/api';
import type { Recipe, RecipeInfo } from './types/recipe';
import { 
  Heart, 
  Search, 
  Utensils, 
  ShoppingCart, 
  Grid3X3, 
  TrendingUp,
  Sparkles,
  Calendar,
  Activity
} from 'lucide-react';

type View = 'home' | 'search' | 'favorites' | 'details' | 'shopping-list' | 'categories' | 'meal-planner' | 'nutrition';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeInfo | null>(null);
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'readyTime' | 'servings' | 'health'>('relevance');
  const [showTrending, setShowTrending] = useState(false);

  const { favorites, addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  useEffect(() => {
    const loadRandomRecipes = async () => {
      try {
        setIsLoading(true);
        const response = await getRandomRecipes(8);
        setSearchResults(response.results || []);
      } catch (err) {
        setError('Failed to load random recipes. Please try again later.');
        console.error('Error loading random recipes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentView === 'home') {
      loadRandomRecipes();
    }
  }, [currentView]);

  const handleSearch = async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setSearchQuery(query);
      const response = await searchRecipes(query, 20);
      setSearchResults(response.results || []);
      setCurrentView('search');
    } catch (err) {
      setError('Failed to search recipes. Please check your API key and try again.');
      console.error('Error searching recipes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (category: string) => {
    handleSearch(category);
  };

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe as RecipeInfo);
    setCurrentView('details');
  };

  const handleBackToSearch = () => {
    setCurrentView('search');
    setSelectedRecipe(null);
  };

  const handleToggleFavorite = (recipe: Recipe | RecipeInfo) => {
    if (isFavorite(recipe.id)) {
      removeFromFavorites(recipe.id);
      toast.success('Removed from favorites');
    } else {
      addToFavorites(recipe as Recipe);
      toast.success('Added to favorites');
    }
  };

  const handleFiltersChange = (_filters: SearchFiltersType) => {
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  };

  const sortRecipes = (recipes: Recipe[]) => {
    const sorted = [...recipes];
    switch (sortBy) {
      case 'readyTime':
        return sorted.sort((a, b) => a.readyInMinutes - b.readyInMinutes);
      case 'servings':
        return sorted.sort((a, b) => b.servings - a.servings);
      case 'health':
        return sorted.sort((a, b) => (b.veryHealthy ? 1 : 0) - (a.veryHealthy ? 1 : 0));
      default:
        return sorted;
    }
  };

  const navigationItems = [
    { id: 'home' as View, icon: <Grid3X3 size={20} />, label: 'Home' },
    { id: 'search' as View, icon: <Search size={20} />, label: 'Search' },
    { id: 'categories' as View, icon: <Utensils size={20} />, label: 'Categories' },
    { id: 'meal-planner' as View, icon: <Calendar size={20} />, label: 'Meal Planner' },
    { id: 'nutrition' as View, icon: <Activity size={20} />, label: 'Nutrition' },
    { id: 'favorites' as View, icon: <Heart size={20} />, label: 'Favorites', count: favorites.length },
    { id: 'shopping-list' as View, icon: <ShoppingCart size={20} />, label: 'Shopping List' },
  ];

  return (
    <div className="min-h-screen gradient-bg dark:gradient-bg-dark text-gray-900 dark:text-gray-100">
      <Toaster position="top-right" toastOptions={{
        className: 'glass-card premium-shadow',
        duration: 4000,
      }} />
      
      {/* Premium Header */}
      <header className="sticky top-0 z-40 glass border-b border-white/20 dark:border-gray-700/50 backdrop-blur-xl">
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <motion.div
                whileHover={{ rotate: 180, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-xl opacity-50 animate-pulse"></div>
                <Utensils size={40} className="relative text-primary" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold gradient-text flex items-center gap-2">
                  Recipe Explorer
                  <Sparkles size={24} className="text-accent animate-pulse" />
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Premium Culinary Experience</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <ThemeToggle />
              <nav className="hidden lg:flex items-center gap-2">
                {navigationItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 font-medium ${
                      currentView === item.id
                        ? 'bg-gradient-to-r from-primary to-accent text-white premium-shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800/50'
                    }`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.count && item.count > 0 && (
                      <motion.span 
                        className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full px-2 py-0.5 font-bold"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        {item.count}
                      </motion.span>
                    )}
                  </motion.button>
                ))}
              </nav>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Premium Mobile Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/20 dark:border-gray-700/50 backdrop-blur-xl">
        <nav className="flex items-center justify-around py-3">
          {navigationItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                currentView === item.id
                  ? 'text-primary bg-white/50 dark:bg-gray-800/50'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.icon}
              <span className="text-xs font-medium">{item.label}</span>
              {item.count && item.count > 0 && (
                <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                  {item.count}
                </span>
              )}
            </motion.button>
          ))}
        </nav>
      </div>

      {/* Premium Main Content */}
      <main className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {/* Premium Home View */}
            {currentView === 'home' && (
              <div className="space-y-12">
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="mb-8">
                    <motion.h2 
                      className="text-5xl lg:text-6xl font-bold gradient-text mb-6"
                      initial={{ opacity: 0, y: -30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      Discover Delicious Recipes
                    </motion.h2>
                    <motion.p 
                      className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto"
                      initial={{ opacity: 0, y: -30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      Search for your favorite dishes or explore new culinary adventures with our premium recipe collection
                    </motion.p>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="max-w-2xl mx-auto"
                  >
                    <SearchBar onSearch={handleSearch} isLoading={isLoading} />
                  </motion.div>
                </motion.div>

                <RecipeCategories onCategorySelect={handleCategorySelect} />

                {/* Premium Trending Section */}
                <motion.div 
                  className="space-y-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center justify-between">
                    <motion.div 
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                        <TrendingUp className="relative text-orange-500" size={32} />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Trending Recipes</h3>
                        <p className="text-gray-600 dark:text-gray-400">Most popular this week</p>
                      </div>
                    </motion.div>
                    <motion.button
                      onClick={() => setShowTrending(!showTrending)}
                      className="px-6 py-2.5 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-medium premium-shadow hover:premium-shadow-lg transition-all"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {showTrending ? 'Show Less' : 'Show All'}
                    </motion.button>
                  </div>
                  
                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                      {[...Array(8)].map((_, index) => (
                        <RecipeCardSkeleton key={index} />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                      {sortRecipes(searchResults).slice(0, showTrending ? undefined : 4).map((recipe, index) => (
                        <AdvancedRecipeCard
                          key={recipe.id}
                          recipe={recipe}
                          onClick={handleRecipeClick}
                          isFavorite={isFavorite(recipe.id)}
                          onToggleFavorite={handleToggleFavorite}
                          index={index}
                          showTrending={index < 2}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            )}

            {/* Search View */}
            {currentView === 'search' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Search Results</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {searchResults.length} recipes found for "{searchQuery}"
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <SearchFilters
                      onFiltersChange={handleFiltersChange}
                      isOpen={showFilters}
                      onToggle={() => setShowFilters(!showFilters)}
                    />
                    
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-3 py-2 border rounded-lg bg-background"
                    >
                      <option value="relevance">Most Relevant</option>
                      <option value="readyTime">Fastest First</option>
                      <option value="servings">Most Servings</option>
                      <option value="health">Healthiest First</option>
                    </select>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {[...Array(8)].map((_, index) => (
                      <RecipeCardSkeleton key={index} />
                    ))}
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {sortRecipes(searchResults).map((recipe, index) => (
                      <AdvancedRecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onClick={handleRecipeClick}
                        isFavorite={isFavorite(recipe.id)}
                        onToggleFavorite={handleToggleFavorite}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    className="text-center py-16"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="glass-card max-w-md mx-auto p-8 rounded-2xl premium-shadow">
                      <Search size={64} className="mx-auto text-gray-400 mb-6" />
                      <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">No recipes found. Try different search terms or filters!</p>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Meal Planner View */}
            {currentView === 'meal-planner' && (
              <MealPlanner 
                recipes={searchResults.length > 0 ? searchResults : favorites}
                onAddMeal={(meal) => {
                  toast.success('Meal added to planner!');
                  console.log('Added meal:', meal);
                }}
              />
            )}

            {/* Nutrition Dashboard View */}
            {currentView === 'nutrition' && (
              <NutritionDashboard 
                recipes={searchResults.length > 0 ? searchResults : favorites}
                consumedMeals={[]}
              />
            )}

            {/* Categories View */}
            {currentView === 'categories' && (
              <RecipeCategories onCategorySelect={handleCategorySelect} />
            )}

            {/* Favorites View */}
            {currentView === 'favorites' && (
              <FavoritesList
                favorites={favorites}
                onSelectRecipe={handleRecipeClick}
                onRemoveFavorite={removeFromFavorites}
                onClearAll={() => favorites.forEach(recipe => removeFromFavorites(recipe.id))}
              />
            )}

            {/* Shopping List View */}
            {currentView === 'shopping-list' && <ShoppingList />}

            {/* Recipe Details View */}
            {currentView === 'details' && selectedRecipe && (
              <RecipeDetails
                recipe={selectedRecipe}
                onBack={handleBackToSearch}
                isFavorite={isFavorite(selectedRecipe.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Premium Footer */}
      <footer className="glass border-t border-white/20 dark:border-gray-700/50 mt-20 backdrop-blur-xl">
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            <motion.div 
              className="flex items-center justify-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Heart className="text-red-500 animate-pulse" size={20} />
              <p className="text-gray-600 dark:text-gray-400 font-medium">Created with passion by Atharva Yadav</p>
              <Heart className="text-red-500 animate-pulse" size={20} />
            </motion.div>
            <motion.p 
              className="text-sm text-gray-500 dark:text-gray-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Powered by Spoonacular API • Premium Recipe Explorer • Built with React & TypeScript
            </motion.p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
