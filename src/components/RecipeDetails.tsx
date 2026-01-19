import type { RecipeInfo } from '../types/recipe';
import { Clock, Users, Heart, ArrowLeft, ChefHat, ShoppingCart } from 'lucide-react';

interface RecipeDetailsProps {
  recipe: RecipeInfo;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: (recipe: RecipeInfo) => void;
}

export const RecipeDetails = ({ recipe, onBack, isFavorite, onToggleFavorite }: RecipeDetailsProps) => {
  const handleFavoriteClick = () => {
    onToggleFavorite(recipe);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back to recipes</span>
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-64 md:h-96 object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/800x600?text=No+Image';
            }}
          />
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-4 right-4 p-3 rounded-full transition-colors ${
              isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Heart size={24} className={isFavorite ? 'fill-current' : ''} />
          </button>
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{recipe.title}</h1>

          <div className="flex flex-wrap items-center gap-6 mb-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Clock size={20} />
              <span>{recipe.readyInMinutes} minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={20} />
              <span>{recipe.servings} servings</span>
            </div>
            {recipe.sourceName && (
              <div className="flex items-center gap-2">
                <span>Source: {recipe.sourceName}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {recipe.diets.map((diet, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
              >
                {diet}
              </span>
            ))}
            {recipe.dishTypes.map((dishType, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {dishType}
              </span>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <ShoppingCart size={20} />
                Ingredients
              </h2>
              <ul className="space-y-2">
                {recipe.extendedIngredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-700">
                      {ingredient.original}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <ChefHat size={20} />
                Instructions
              </h2>
              {recipe.analyzedInstructions.length > 0 ? (
                <div className="space-y-4">
                  {recipe.analyzedInstructions.map((instruction, instructionIndex) => (
                    <div key={instructionIndex}>
                      {instruction.name && (
                        <h3 className="font-medium text-gray-700 mb-2">{instruction.name}</h3>
                      )}
                      <ol className="space-y-3">
                        {instruction.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                              {step.number}
                            </span>
                            <p className="text-gray-700">{step.step}</p>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{ __html: recipe.instructions }}
                />
              )}
            </div>
          </div>

          {recipe.summary && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Summary</h2>
              <div
                className="text-gray-700"
                dangerouslySetInnerHTML={{ __html: recipe.summary }}
              />
            </div>
          )}

          {recipe.sourceUrl && (
            <div className="mt-6">
              <a
                href={recipe.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                View original recipe
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
