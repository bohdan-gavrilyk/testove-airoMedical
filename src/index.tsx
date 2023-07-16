import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './index.scss';
import { App } from './App';
import { RecipeDetails } from './components/RecipeDetails';

ReactDOM.render(
  <Router>
    <Routes>
      <Route>
        <Route index element={<App />} />
        <Route path="/recipe/:id" Component={RecipeDetails} />
      </Route>
    </Routes>
  </Router>,
  document.getElementById('root'),
);
