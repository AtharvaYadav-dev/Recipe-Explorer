import axios from 'axios';
import type { SearchResponse, RecipeInfo } from '../types/recipe';

const API_BASE_URL = 'https://api.spoonacular.com/recipes';
const API_KEY = 'YOUR_API_KEY_HERE';

// Mock data for testing without API key
const mockRecipes = [
  {
    id: 1,
    title: "Classic Spaghetti Carbonara",
    image: "https://via.placeholder.com/400x300?text=Carbonara",
    imageType: "jpg",
    readyInMinutes: 30,
    servings: 4,
    sourceUrl: "https://example.com/carbonara",
    sourceName: "Example Kitchen",
    summary: "A classic Italian pasta dish with eggs, cheese, and bacon.",
    instructions: "1. Cook pasta. 2. Mix eggs and cheese. 3. Combine with bacon and pasta.",
    analyzedInstructions: [
      {
        name: "",
        steps: [
          { number: 1, step: "Cook spaghetti according to package directions.", ingredients: [], equipment: [] },
          { number: 2, step: "Mix eggs and Parmesan cheese in a bowl.", ingredients: [], equipment: [] },
          { number: 3, step: "Combine cooked pasta with egg mixture and crispy bacon.", ingredients: [], equipment: [] }
        ]
      }
    ],
    extendedIngredients: [
      { id: 1, aisle: "Pasta", consistency: "solid", amount: 400, unit: "g", name: "spaghetti", original: "400g spaghetti", image: "pasta.jpg" },
      { id: 2, aisle: "Meat", consistency: "solid", amount: 200, unit: "g", name: "bacon", original: "200g bacon", image: "bacon.jpg" },
      { id: 3, aisle: "Dairy", consistency: "solid", amount: 100, unit: "g", name: "parmesan", original: "100g Parmesan cheese", image: "cheese.jpg" },
      { id: 4, aisle: "Dairy", consistency: "liquid", amount: 4, unit: "pieces", name: "eggs", original: "4 eggs", image: "eggs.jpg" }
    ],
    diets: ["gluten free"],
    dishTypes: ["main course"],
    cheap: true,
    dairyFree: false,
    glutenFree: true,
    vegan: false,
    vegetarian: false,
    veryHealthy: false
  },
  {
    id: 2,
    title: "Chicken Stir Fry",
    image: "https://via.placeholder.com/400x300?text=Stir+Fry",
    imageType: "jpg",
    readyInMinutes: 25,
    servings: 4,
    sourceUrl: "https://example.com/stirfry",
    sourceName: "Quick Recipes",
    summary: "A quick and healthy chicken stir fry with vegetables.",
    instructions: "1. Cut chicken into pieces. 2. Stir fry vegetables. 3. Add chicken and sauce.",
    analyzedInstructions: [
      {
        name: "",
        steps: [
          { number: 1, step: "Cut chicken into bite-sized pieces.", ingredients: [], equipment: [] },
          { number: 2, step: "Stir fry vegetables until tender-crisp.", ingredients: [], equipment: [] },
          { number: 3, step: "Add chicken and sauce, cook until done.", ingredients: [], equipment: [] }
        ]
      }
    ],
    extendedIngredients: [
      { id: 5, aisle: "Meat", consistency: "solid", amount: 500, unit: "g", name: "chicken breast", original: "500g chicken breast", image: "chicken.jpg" },
      { id: 6, aisle: "Produce", consistency: "solid", amount: 2, unit: "pieces", name: "bell peppers", original: "2 bell peppers", image: "pepper.jpg" },
      { id: 7, aisle: "Produce", consistency: "solid", amount: 200, unit: "g", name: "broccoli", original: "200g broccoli", image: "broccoli.jpg" }
    ],
    diets: ["dairy free", "gluten free"],
    dishTypes: ["main course"],
    cheap: false,
    dairyFree: true,
    glutenFree: true,
    vegan: false,
    vegetarian: false,
    veryHealthy: true
  },
  {
    id: 3,
    title: "Vegetarian Buddha Bowl",
    image: "https://via.placeholder.com/400x300?text=Buddha+Bowl",
    imageType: "jpg",
    readyInMinutes: 35,
    servings: 2,
    sourceUrl: "https://example.com/buddha-bowl",
    sourceName: "Healthy Eats",
    summary: "A nutritious vegetarian bowl with quinoa, roasted vegetables, and tahini dressing.",
    instructions: "1. Cook quinoa. 2. Roast vegetables. 3. Assemble bowl with dressing.",
    analyzedInstructions: [
      {
        name: "",
        steps: [
          { number: 1, step: "Cook quinoa according to package directions.", ingredients: [], equipment: [] },
          { number: 2, step: "Roast vegetables at 200°C for 25 minutes.", ingredients: [], equipment: [] },
          { number: 3, step: "Assemble bowl and drizzle with tahini dressing.", ingredients: [], equipment: [] }
        ]
      }
    ],
    extendedIngredients: [
      { id: 8, aisle: "Health Foods", consistency: "solid", amount: 200, unit: "g", name: "quinoa", original: "200g quinoa", image: "quinoa.jpg" },
      { id: 9, aisle: "Produce", consistency: "solid", amount: 1, unit: "piece", name: "sweet potato", original: "1 sweet potato", image: "sweet-potato.jpg" },
      { id: 10, aisle: "Produce", consistency: "solid", amount: 100, unit: "g", name: "spinach", original: "100g spinach", image: "spinach.jpg" }
    ],
    diets: ["vegan", "vegetarian", "gluten free"],
    dishTypes: ["main course", "salad"],
    cheap: true,
    dairyFree: true,
    glutenFree: true,
    vegan: true,
    vegetarian: true,
    veryHealthy: true
  }
];

const api = axios.create({
  baseURL: API_BASE_URL,
  params: {
    apiKey: API_KEY,
  },
});

export const searchRecipes = async (query: string, number: number = 10): Promise<SearchResponse> => {
  // For demo purposes, return mock data filtered by query
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  
  const filteredRecipes = mockRecipes.filter(recipe => 
    recipe.title.toLowerCase().includes(query.toLowerCase()) ||
    recipe.summary.toLowerCase().includes(query.toLowerCase())
  );
  
  return {
    results: filteredRecipes.slice(0, number),
    offset: 0,
    number: filteredRecipes.length,
    totalResults: filteredRecipes.length
  };
};

export const getRecipeById = async (id: number): Promise<RecipeInfo> => {
  // For demo purposes, return mock data
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
  
  const recipe = mockRecipes.find(r => r.id === id);
  if (!recipe) {
    throw new Error('Recipe not found');
  }
  
  return recipe as RecipeInfo;
};

export const getRandomRecipes = async (number: number = 10): Promise<SearchResponse> => {
  // For demo purposes, return mock data
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  
  const shuffled = [...mockRecipes].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, Math.min(number, mockRecipes.length));
  
  return {
    results: selected,
    offset: 0,
    number: selected.length,
    totalResults: mockRecipes.length
  };
};
