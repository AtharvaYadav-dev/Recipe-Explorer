export interface Recipe {
  id: number;
  title: string;
  image: string;
  imageType: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  sourceName: string;
  summary: string;
  instructions: string;
  analyzedInstructions: AnalyzedInstruction[];
  extendedIngredients: ExtendedIngredient[];
  diets: string[];
  dishTypes: string[];
  cheap: boolean;
  dairyFree: boolean;
  glutenFree: boolean;
  vegan: boolean;
  vegetarian: boolean;
  veryHealthy: boolean;
}

export interface AnalyzedInstruction {
  name: string;
  steps: InstructionStep[];
}

export interface InstructionStep {
  number: number;
  step: string;
  ingredients: Ingredient[];
  equipment: Equipment[];
}

export interface Ingredient {
  id: number;
  name: string;
  image: string;
}

export interface Equipment {
  id: number;
  name: string;
  image: string;
}

export interface ExtendedIngredient {
  id: number;
  aisle: string;
  consistency: string;
  amount: number;
  unit: string;
  name: string;
  original: string;
  image: string;
}

export interface SearchResponse {
  results: Recipe[];
  offset: number;
  number: number;
  totalResults: number;
}

export interface RecipeInfo {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  sourceName: string;
  summary: string;
  instructions: string;
  analyzedInstructions: AnalyzedInstruction[];
  extendedIngredients: ExtendedIngredient[];
  diets: string[];
  dishTypes: string[];
  cheap: boolean;
  dairyFree: boolean;
  glutenFree: boolean;
  vegan: boolean;
  vegetarian: boolean;
  veryHealthy: boolean;
}
