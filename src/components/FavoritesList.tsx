import type { Recipe } from '../types/recipe';
import { Heart, X } from 'lucide-react';

interface FavoritesListProps {
  favorites: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  onRemoveFavorite: (recipeId: number) => void;
  onClearAll: () => void;
}

export const FavoritesList = ({ favorites, onSelectRecipe, onRemoveFavorite, onClearAll }: FavoritesListProps) => {
  if (favorites.length === 0) {
    return (
      <div className="text-center py-8">
        <Heart size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">No favorite recipes yet</p>
        <p className="text-sm text-gray-400 mt-2">Start adding recipes to your favorites!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Your Favorites ({favorites.length})
        </h3>
        <button
          onClick={onClearAll}
          className="text-sm text-red-600 hover:text-red-800 transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-3">
        {favorites.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onSelectRecipe(recipe)}
          >
            <div className="flex gap-4">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/80x80?text=No+Image';
                }}
              />
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-800 truncate mb-1">
                  {recipe.title}
                </h4>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{recipe.readyInMinutes} min</span>
                  <span>{recipe.servings} servings</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {recipe.diets.slice(0, 2).map((diet, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                    >
                      {diet}
                    </span>
                  ))}
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFavorite(recipe.id);
                }}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
