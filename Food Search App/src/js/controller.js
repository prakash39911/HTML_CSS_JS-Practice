import * as model from './model.js';
import recipeView from './view/recipeView.js';
import searchView from './view/searchView.js';
import resultsView from './view/resultsView.js';
import paginationView from './view/paginationView.js';
import bookmarkView from './view/bookmarkView.js';
import addRecipeView from './view/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
// Most Old Browsers will be supported using this import ('Core-js' and 'regenerator-runtime')

import 'core-js/stable'; // This is for Polyfilling everything else.
import 'regenerator-runtime/runtime'; // this is for Pollyfilling (So that old browsers can support it) Async Await.

// if (module.hot) {
//   module.hot.accept();
// }

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    // Loading Spinner
    recipeView.renderSpinner();

    resultsView.update(model.resPerPage());
    bookmarkView.update(model.state.bookmarks);

    // Loading Recipe
    await model.loadRecipe(id);
    // console.log(model.state.recipe);
    // Rendering Recipe --
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSearchResults(query);
    // console.log(model.state.search.result);
    // resultsView.render(model.state.search.result);
    resultsView.render(model.resPerPage());

    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1. Render New Results
  resultsView.render(model.resPerPage(goToPage));
  // Render New Pagination Buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServing) {
  // update the recipe servings
  model.updateServings(newServing);

  // Update the recipe view
  // recipeView.render(model.state.recipe); // Here we are rendering the updated recipe all over again. That is unnecessary. we want to reload the elements that is only changed.
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add/Remove Bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Render Recipe View
  recipeView.update(model.state.recipe);
  // Render Bookmarks
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show Loading Spinner

    addRecipeView.renderSpinner();
    // Upload new recipe Data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render Recipe
    recipeView.render(model.state.recipe);

    addRecipeView.renderSuccess();

    // Render Bookmark View
    bookmarkView.render(model.state.bookmarks);

    // Change ID in URL (Without page reload)
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // Close form Window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
  // Upload the new recipe data
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServing(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  bookmarkView.addHandlerRender(controlBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
