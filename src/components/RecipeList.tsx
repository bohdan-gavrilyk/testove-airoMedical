import React from 'react';
import { Recipe } from '../types/Recipe';
import { RecipeCard } from './RecipeCard';

type Props = {
  recipes: Recipe[];
};

export const RecipeList:React.FC<Props> = ({ recipes }) => {
  return (
    <div className="recipe__container">
      {recipes.map(recipe => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
};
