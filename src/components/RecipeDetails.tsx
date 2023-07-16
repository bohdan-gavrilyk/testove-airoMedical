import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useStore } from '../store/store';

export const RecipeDetails:React.FC = () => {
  const { recipes, removeAllSelectedRecipes } = useStore();
  const { id } = useParams<{ id: string }>();
  const recipe = recipes.find(rec => rec.id === parseInt(id ?? '', 10));

  if (!recipe) {
    return <div>Loading...</div>;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    removeAllSelectedRecipes();
  }, []);

  return (
    <div className="details">
      <Link to="/" className="details__link">Home</Link>
      <div className="details__content">
        <div className="details__img">
          <img src={recipe.image_url} alt={recipe.name}></img>
        </div>
        <div className="details__inf">
          <h1 className="details__name">{recipe.name}</h1>
          <p className="details__description">{recipe.description}</p>
          <p>{`first_brewed:${recipe.first_brewed}`}</p>
          <p>{`abv:${recipe.abv}`}</p>
          <p>{`ibu:${recipe.ibu}`}</p>
        </div>
      </div>
    </div>

  );
};
