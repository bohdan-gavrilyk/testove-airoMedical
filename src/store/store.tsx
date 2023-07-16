import { create } from 'zustand';
import axios from 'axios';
import { Recipe } from '../types/Recipe';

interface Store {
  recipes: Recipe[];
  selectedRecipes: number[];
  setRecipes: (recipes: Recipe[]) => void;
  addSelectedRecipe: (recipeId: number) => void;
  removeSelectedRecipe: (recipeId: number) => void;
  removeAllSelectedRecipes: () => void;
  loadMoreRecipes: (num:number, countDel?:number) => Promise<void>;
}
let pageNumber = 3;
let previousNum = 1;

export const useStore = create<Store>((set) => ({
  recipes: [],
  selectedRecipes: [],

  setRecipes: (recipes) => set({ recipes }),
  addSelectedRecipe: (recipeId:number) => set((state) => ({
    selectedRecipes: [...state.selectedRecipes, recipeId],
  })),
  removeSelectedRecipe: (recipeId:number) => set((state) => ({
    selectedRecipes: state.selectedRecipes.filter((id) => id !== recipeId),
  })),
  removeAllSelectedRecipes: () => set({ selectedRecipes: [] }),
  loadMoreRecipes: async (num: number, countDel?:number) => {
    const repeatDown = previousNum === 1 && num > 0;
    const repeatUp = previousNum === -1 && num < 0;

    if (countDel) {
      const countLoad = Math.floor(countDel / 5) + 1;

      pageNumber += countLoad;
    }

    if (pageNumber === 1 && num < 0) {
      return;
    }

    if (!repeatDown && pageNumber === 3 && !repeatUp) {
      return;
    }

    if (repeatDown) {
      pageNumber += 1;
    }

    if (num > 0 && !repeatDown) {
      pageNumber += 3;
    }

    if (repeatUp) {
      pageNumber -= 1;
    }

    if (num < 0 && !repeatUp) {
      pageNumber -= 3;
    }

    try {
      const response = await axios.get<Recipe[]>(
        `https://api.punkapi.com/v2/beers?page=${pageNumber}&per_page=5`,
      );

      set((state) => {
        let updatedRecipes: Recipe[];

        if (countDel) {
          updatedRecipes = [...state.recipes, ...response.data.splice(0, countDel)];
        } else if (num > 0) {
          updatedRecipes = [...state.recipes.slice(5), ...response.data];
        } else {
          updatedRecipes = [...response.data, ...state.recipes.slice(0, 10)];
        }

        previousNum = num;

        return {
          recipes: updatedRecipes,
        };
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error loading more recipes:', error);
    }
  },

}));
