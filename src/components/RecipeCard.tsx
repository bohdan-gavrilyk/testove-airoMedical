/* eslint-disable no-console */
import React, { useState } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import { Recipe } from '../types/Recipe';
import { useStore } from '../store/store';

type Props = {
  recipe: Recipe;
};
export const RecipeCard:React.FC<Props> = ({ recipe }) => {
  const [isSelected, setIsSelected] = useState(false);
  const { addSelectedRecipe, removeSelectedRecipe } = useStore();
  const handleRightClick = (e:React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setIsSelected(!isSelected);

    if (!isSelected) {
      addSelectedRecipe(recipe.id);
    } else {
      removeSelectedRecipe(recipe.id);
    }
  };

  return (
    <Link
      to={`/recipe/${recipe.id}`}
      onContextMenu={handleRightClick}
      className={classNames(
        'card',
        { selected: isSelected },
      )}
    >
      <img
        className="card__img"
        src={recipe.image_url}
        alt={recipe.name}
      />
      <p className="card__name">{recipe.name}</p>
      <p className="card__desc">{recipe.description.length > 50 ? `${recipe.description}...` : recipe.description}</p>
    </Link>
  );
};
