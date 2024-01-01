import * as model from './model.js';

// import icons from '../img/icons.svg'; // Parcel 1

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE } from './config.js';

if (module.hot) {
  module.hot.accept();
}

// console.log(icons);
// XD
// const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);

    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1) Update bookmarks
    bookmarksView.update(model.state.bookmarks);

    // 2) Loading recipe
    await model.loadRecipe(id);

    // 3) rendering recipe
    recipeView.render(model.state.recipe);

    // controlServings(); // TEST
  } catch (err) {
    // console.log(err);
    recipeView.renderError(); //`${err}`
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1) Get query search
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results

    // resultsView.render(model.state.search.results);
    controlPagination();
    // resultsView.render(model.getSearchResultsPage());

    // // 4) Render initial pagination buttons

    // paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1)render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) render new Pagination buttons

  paginationView.render(model.state.search);
};

// controlSearchResults();

const controlServings = function (newServings) {
  // Update recipe servings (in state)
  model.updateServings(newServings);

  // Update recipe view (re-render)

  // recipeView.render(model.state.recipe);

  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  console.log(model.state.recipe);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Render spinner
    addRecipeView.renderSpinner();

    console.log(newRecipe);
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE * 1000);
  } catch (err) {
    console.error('✨😃👍', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  // controlServings();
};
init();
// (function () {
//   recipeView.addHandlerRender(controlRecipes);
// })();
