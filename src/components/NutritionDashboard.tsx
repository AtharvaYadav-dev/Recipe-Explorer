import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Target, TrendingUp, Award, Activity, Apple, Droplets } from 'lucide-react';
import type { Recipe, RecipeInfo } from '../types/recipe';

interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

interface DailyGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}

interface NutritionDashboardProps {
  recipes?: (Recipe | RecipeInfo)[];
  consumedMeals?: Array<{
    recipe: Recipe | RecipeInfo;
    servings: number;
    date: string;
  }>;
}

export const NutritionDashboard = ({ consumedMeals = [] }: NutritionDashboardProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [dailyGoals] = useState<DailyGoals>({
    calories: 2000,
    protein: 50,
    carbs: 300,
    fat: 65,
    water: 8,
  });

  const calculateNutrition = (recipe: Recipe | RecipeInfo, servings: number): NutritionData => {
    // Mock nutrition calculation based on recipe properties
    const baseCalories = (recipe.readyInMinutes || 30) * 8;
    const multiplier = servings;

    return {
      calories: baseCalories * multiplier,
      protein: baseCalories * 0.15 * multiplier,
      carbs: baseCalories * 0.45 * multiplier,
      fat: baseCalories * 0.30 * multiplier,
      fiber: baseCalories * 0.05 * multiplier,
      sugar: baseCalories * 0.10 * multiplier,
      sodium: baseCalories * 0.003 * multiplier,
    };
  };

  const getTodayNutrition = (): NutritionData => {
    const today = new Date().toISOString().split('T')[0];
    const todayMeals = consumedMeals.filter(meal => meal.date === today);

    return todayMeals.reduce((acc, meal) => {
      const nutrition = calculateNutrition(meal.recipe, meal.servings);
      return {
        calories: acc.calories + nutrition.calories,
        protein: acc.protein + nutrition.protein,
        carbs: acc.carbs + nutrition.carbs,
        fat: acc.fat + nutrition.fat,
        fiber: acc.fiber + nutrition.fiber,
        sugar: acc.sugar + nutrition.sugar,
        sodium: acc.sodium + nutrition.sodium,
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 });
  };

  const getWeekNutrition = (): NutritionData => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekMeals = consumedMeals.filter(meal => new Date(meal.date) >= weekAgo);

    return weekMeals.reduce((acc, meal) => {
      const nutrition = calculateNutrition(meal.recipe, meal.servings);
      return {
        calories: acc.calories + nutrition.calories,
        protein: acc.protein + nutrition.protein,
        carbs: acc.carbs + nutrition.carbs,
        fat: acc.fat + nutrition.fat,
        fiber: acc.fiber + nutrition.fiber,
        sugar: acc.sugar + nutrition.sugar,
        sodium: acc.sodium + nutrition.sodium,
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 });
  };

  const currentNutrition = selectedPeriod === 'today' ? getTodayNutrition() : getWeekNutrition();
  const avgDailyNutrition = selectedPeriod === 'week' ? {
    calories: getWeekNutrition().calories / 7,
    protein: getWeekNutrition().protein / 7,
    carbs: getWeekNutrition().carbs / 7,
    fat: getWeekNutrition().fat / 7,
    fiber: getWeekNutrition().fiber / 7,
    sugar: getWeekNutrition().sugar / 7,
    sodium: getWeekNutrition().sodium / 7,
  } : currentNutrition;

  const getProgressPercentage = (current: number, goal: number): number => {
    return Math.min((current / goal) * 100, 100);
  };

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 90) return 'from-green-400 to-emerald-400';
    if (percentage >= 70) return 'from-yellow-400 to-orange-400';
    return 'from-red-400 to-pink-400';
  };

  const nutritionMetrics = [
    {
      name: 'Calories',
      current: Math.round(avgDailyNutrition.calories),
      goal: dailyGoals.calories,
      unit: 'kcal',
      icon: Flame,
      color: 'from-orange-400 to-red-400',
    },
    {
      name: 'Protein',
      current: Math.round(avgDailyNutrition.protein),
      goal: dailyGoals.protein,
      unit: 'g',
      icon: Target,
      color: 'from-blue-400 to-indigo-400',
    },
    {
      name: 'Carbs',
      current: Math.round(avgDailyNutrition.carbs),
      goal: dailyGoals.carbs,
      unit: 'g',
      icon: Apple,
      color: 'from-green-400 to-emerald-400',
    },
    {
      name: 'Fat',
      current: Math.round(avgDailyNutrition.fat),
      goal: dailyGoals.fat,
      unit: 'g',
      icon: Droplets,
      color: 'from-yellow-400 to-orange-400',
    },
  ];

  const getHealthScore = (): number => {
    const scores = [
      getProgressPercentage(avgDailyNutrition.calories, dailyGoals.calories),
      getProgressPercentage(avgDailyNutrition.protein, dailyGoals.protein),
      getProgressPercentage(avgDailyNutrition.carbs, dailyGoals.carbs),
      getProgressPercentage(avgDailyNutrition.fat, dailyGoals.fat),
    ];

    const avgScore = scores.reduce((acc, score) => acc + score, 0) / scores.length;
    return Math.round(avgScore);
  };

  const getHealthStatus = (score: number): { status: string; color: string; message: string } => {
    if (score >= 85) return { status: 'Excellent', color: 'text-green-600', message: 'Great job meeting your nutrition goals!' };
    if (score >= 70) return { status: 'Good', color: 'text-blue-600', message: 'You\'re doing well, keep it up!' };
    if (score >= 50) return { status: 'Fair', color: 'text-yellow-600', message: 'Room for improvement in your nutrition balance.' };
    return { status: 'Needs Work', color: 'text-red-600', message: 'Consider adjusting your diet for better balance.' };
  };

  const healthScore = getHealthScore();
  const healthStatus = getHealthStatus(healthScore);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold gradient-text mb-4">Nutrition Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400">Track your daily nutrition and health goals</p>
      </motion.div>

      {/* Period Selector */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center"
      >
        <div className="glass-card rounded-xl p-1 flex gap-1">
          {(['today', 'week', 'month'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-6 py-2 rounded-lg font-medium transition-all capitalize ${selectedPeriod === period
                  ? 'bg-gradient-to-r from-primary to-accent text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
            >
              {period === 'today' ? 'Today' : period === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Health Score Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-8 premium-shadow-lg text-center"
      >
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-primary to-accent p-1">
            <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
              <div>
                <div className="text-3xl font-bold gradient-text">{healthScore}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Health Score</div>
              </div>
            </div>
          </div>
          <div className="absolute -top-2 -right-2">
            <Award className={`w-8 h-8 ${healthStatus.color}`} />
          </div>
        </div>
        <h3 className={`text-2xl font-bold mt-4 ${healthStatus.color}`}>{healthStatus.status}</h3>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{healthStatus.message}</p>
      </motion.div>

      {/* Nutrition Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {nutritionMetrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="glass-card rounded-2xl p-6 premium-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${metric.color} flex items-center justify-center text-white`}>
                <metric.icon size={24} />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{metric.current}</div>
                <div className="text-sm text-gray-500">of {metric.goal} {metric.unit}</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{metric.name}</span>
                <span className="text-gray-500">{Math.round(getProgressPercentage(metric.current, metric.goal))}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${getProgressColor(getProgressPercentage(metric.current, metric.goal))} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgressPercentage(metric.current, metric.goal)}%` }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Additional Nutrition Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Micronutrients */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Activity className="text-primary" size={24} />
            Additional Nutrients
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Fiber</span>
              <span className="font-bold">{Math.round(avgDailyNutrition.fiber)}g</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Sugar</span>
              <span className="font-bold">{Math.round(avgDailyNutrition.sugar)}g</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Sodium</span>
              <span className="font-bold">{Math.round(avgDailyNutrition.sodium)}mg</span>
            </div>
          </div>
        </div>

        {/* Water Intake */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Droplets className="text-blue-500" size={24} />
            Water Intake
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Daily Goal</span>
              <span className="font-bold">{dailyGoals.water} glasses</span>
            </div>
            <div className="flex gap-1">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`h-8 flex-1 rounded-lg transition-all ${i < 5
                      ? 'bg-gradient-to-t from-blue-400 to-blue-300'
                      : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 text-center">5 of 8 glasses completed</p>
          </div>
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="text-green-500" size={24} />
          Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
              ✓
            </div>
            <div>
              <h4 className="font-bold">Increase Protein Intake</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Add more lean protein sources to meet your daily goal.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
              !
            </div>
            <div>
              <h4 className="font-bold">Stay Hydrated</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Remember to drink water throughout the day.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
