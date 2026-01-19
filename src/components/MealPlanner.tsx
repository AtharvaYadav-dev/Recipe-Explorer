import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Users, Flame, Plus, X, AlertCircle } from 'lucide-react';
import type { Recipe, RecipeInfo } from '../types/recipe';

interface MealPlan {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipe: Recipe | RecipeInfo;
  servings: number;
  plannedTime?: string;
}

interface MealPlannerProps {
  recipes: (Recipe | RecipeInfo)[];
  onAddMeal?: (meal: Omit<MealPlan, 'id'>) => void;
}

export const MealPlanner = ({ recipes, onAddMeal }: MealPlannerProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('dinner');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | RecipeInfo | null>(null);
  const [servings, setServings] = useState(4);
  const [plannedTime, setPlannedTime] = useState('');
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [showAddMeal, setShowAddMeal] = useState(false);

  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast', icon: '🌅', color: 'from-yellow-400 to-orange-400' },
    { value: 'lunch', label: 'Lunch', icon: '☀️', color: 'from-blue-400 to-cyan-400' },
    { value: 'dinner', label: 'Dinner', icon: '🌙', color: 'from-purple-400 to-pink-400' },
    { value: 'snack', label: 'Snack', icon: '🍿', color: 'from-green-400 to-emerald-400' },
  ] as const;

  const handleAddMeal = () => {
    if (!selectedRecipe) return;

    const newMeal: Omit<MealPlan, 'id'> = {
      date: selectedDate,
      mealType: selectedMealType,
      recipe: selectedRecipe,
      servings,
      plannedTime: plannedTime || undefined,
    };

    if (onAddMeal) {
      onAddMeal(newMeal);
    }

    setMealPlans([...mealPlans, { ...newMeal, id: Date.now().toString() }]);
    setShowAddMeal(false);
    setSelectedRecipe(null);
    setServings(4);
    setPlannedTime('');
  };

  const handleRemoveMeal = (mealId: string) => {
    setMealPlans(mealPlans.filter(meal => meal.id !== mealId));
  };

  const getMealsForDate = (date: string) => {
    return mealPlans.filter(meal => meal.date === date);
  };

  const calculateNutrition = (meals: MealPlan[]) => {
    return meals.reduce((acc, meal) => {
      const calories = (meal.recipe.readyInMinutes || 30) * 8 * meal.servings; // Mock calculation
      return {
        calories: acc.calories + calories,
        protein: acc.protein + (calories * 0.15), // Mock protein calculation
        carbs: acc.carbs + (calories * 0.45), // Mock carbs calculation
        fat: acc.fat + (calories * 0.30), // Mock fat calculation
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const currentDayMeals = getMealsForDate(selectedDate);
  const nutrition = calculateNutrition(currentDayMeals);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold gradient-text mb-4">Meal Planner</h2>
        <p className="text-gray-600 dark:text-gray-400">Plan your meals for the week ahead</p>
      </motion.div>

      {/* Date Selector */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-6 premium-shadow"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Calendar className="text-primary" size={24} />
            <div>
              <h3 className="text-xl font-bold">Select Date</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Choose a day to plan meals</p>
            </div>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Meal Type Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {mealTypes.map((type) => (
            <motion.button
              key={type.value}
              onClick={() => setSelectedMealType(type.value)}
              className={`p-4 rounded-xl transition-all duration-300 ${
                selectedMealType === type.value
                  ? 'bg-gradient-to-r ' + type.color + ' text-white premium-shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-2xl mb-2">{type.icon}</div>
              <div className="font-bold">{type.label}</div>
            </motion.button>
          ))}
        </div>

        {/* Add Meal Button */}
        <motion.button
          onClick={() => setShowAddMeal(true)}
          className="w-full py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold premium-shadow hover:premium-shadow-lg transition-all flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={20} />
          Add {mealTypes.find(t => t.value === selectedMealType)?.label}
        </motion.button>
      </motion.div>

      {/* Add Meal Modal */}
      <AnimatePresence>
        {showAddMeal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddMeal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto premium-shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Add Meal</h3>
                <button
                  onClick={() => setShowAddMeal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Recipe Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Select Recipe</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
                  {recipes.slice(0, 10).map((recipe) => (
                    <motion.button
                      key={recipe.id}
                      onClick={() => setSelectedRecipe(recipe)}
                      className={`p-3 rounded-lg border transition-all ${
                        selectedRecipe?.id === recipe.id
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-300 dark:border-gray-600 hover:border-primary'
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={recipe.image}
                          alt={recipe.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="text-left">
                          <div className="font-medium text-sm">{recipe.title}</div>
                          <div className="text-xs text-gray-500">{recipe.readyInMinutes} min</div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Servings and Time */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Servings</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={servings}
                    onChange={(e) => setServings(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Planned Time (optional)</label>
                  <input
                    type="time"
                    value={plannedTime}
                    onChange={(e) => setPlannedTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowAddMeal(false)}
                  className="flex-1 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMeal}
                  disabled={!selectedRecipe}
                  className="flex-1 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Add Meal
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Day Meals */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <h3 className="text-2xl font-bold">Meals for {new Date(selectedDate).toLocaleDateString()}</h3>
        
        {currentDayMeals.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 dark:text-gray-400">No meals planned for this day</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {currentDayMeals.map((meal) => (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${mealTypes.find(t => t.value === meal.mealType)?.color} flex items-center justify-center text-white text-xl`}>
                    {mealTypes.find(t => t.value === meal.mealType)?.icon}
                  </div>
                  <div>
                    <h4 className="font-bold">{meal.recipe.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Users size={14} />
                        {meal.servings} servings
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {meal.recipe.readyInMinutes} min
                      </span>
                      {meal.plannedTime && (
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {meal.plannedTime}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveMeal(meal.id)}
                  className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                >
                  <X size={18} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Nutrition Summary */}
      {currentDayMeals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Flame className="text-orange-500" size={24} />
            Nutrition Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{Math.round(nutrition.calories)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Calories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{Math.round(nutrition.protein)}g</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Protein</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{Math.round(nutrition.carbs)}g</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Carbs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">{Math.round(nutrition.fat)}g</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Fat</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
