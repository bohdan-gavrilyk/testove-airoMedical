/* eslint-disable no-console */
import React, { useEffect, useRef, useState } from 'react';
import './App.scss';
import axios from 'axios';
import { useStore } from './store/store';
import { Recipe } from './types/Recipe';
import { RecipeList } from './components/RecipeList';

export const App: React.FC = () => {
  const {
    recipes,
    setRecipes,
    selectedRecipes,
    loadMoreRecipes,
    removeAllSelectedRecipes,
  } = useStore();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get<Recipe[]>(
          'https://api.punkapi.com/v2/beers?page=1&per_page=15',
        );

        setRecipes(response.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, [setRecipes]);

  const [isLoading, setIsLoading] = useState(false);
  const previousScrollTop = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!isLoading) {
        const { scrollTop } = document.documentElement;

        if (
          scrollTop > previousScrollTop.current
          && document.documentElement.scrollHeight
           - (window.innerHeight + scrollTop) <= 5
        ) {
          setIsLoading(true);
        }

        if (
          scrollTop < previousScrollTop.current
          && scrollTop <= 5
        ) {
          setIsLoading(true);
        }

        previousScrollTop.current = scrollTop;
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) {
      loadMoreRecipes(previousScrollTop.current < 5 ? -1 : 1)
        .then(() => {
          if (recipes[0].id !== 1) {
            window.scrollTo({
              top: previousScrollTop.current < 5 ? 400 : 60,
              behavior: 'smooth',
            });
          }

          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          console.error('Error loading more recipes:', error);
        });
    }
  }, [isLoading]);

  const handleDeleteRecipe = () => {
    const updateRecipe = recipes.filter(el => !selectedRecipes.includes(el.id));

    loadMoreRecipes(1, selectedRecipes.length);
    removeAllSelectedRecipes();
    setRecipes(updateRecipe);
  };

  return (
    <div>
      <h1>Beer Recipe App</h1>
      {selectedRecipes.length ? (
        <button onClick={handleDeleteRecipe} className="button" type="button">Delete selected</button>
      ) : null}
      <RecipeList recipes={recipes} />
    </div>
  );
};
