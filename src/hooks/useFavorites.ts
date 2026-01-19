import { useState, useEffect } from 'react';
import type { Recipe } from '../types/recipe';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Recipe[]>([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('recipe-favorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
      }
    }
  }, []);

  const addToFavorites = (recipe: Recipe) => {
    const isAlreadyFavorite = favorites.some(fav => fav.id === recipe.id);
    if (!isAlreadyFavorite) {
      const newFavorites = [...favorites, recipe];
      setFavorites(newFavorites);
      localStorage.setItem('recipe-favorites', JSON.stringify(newFavorites));
    }
  };

  const removeFromFavorites = (recipeId: number) => {
    const newFavorites = favorites.filter(fav => fav.id !== recipeId);
    setFavorites(newFavorites);
    localStorage.setItem('recipe-favorites', JSON.stringify(newFavorites));
  };

  const isFavorite = (recipeId: number) => {
    return favorites.some(fav => fav.id === recipeId);
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };
};
