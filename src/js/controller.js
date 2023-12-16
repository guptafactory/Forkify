'use strict';
import { async } from 'regenerator-runtime';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC, RE_RENDER_MODAL_SEC } from './config.js';
///////////////////////////////////////

const controlRecipe = async function () {
  try {
    // 1) Getting hash from URL bar
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    // 2) Highlighting the selected page
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    // 3) Loading recipe
    await model.loadRecipe(id);
    // 4) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

///////////////////////////////////////

const controlSearchResults = async function () {
  try {
    // 1) Get Query from search button
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();
    // 2) Load search results
    await model.loadSearchResults(query);
    // 3) Render search results
    resultsView.render(model.getSearchResultsPage());
    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError();
  }
};

///////////////////////////////////////

const controlPagination = function (goToPage) {
  try {
    // 1) Render search results of specific page
    resultsView.render(model.getSearchResultsPage(goToPage));
    // 2) Render pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    searchView.renderError('Error in Pagination');
  }
};

///////////////////////////////////////

const controlServings = function (updateTo) {
  try {
    // 1) Update recipe servings
    model.updateServings(updateTo);
    // 2) Update recipe view
    recipeView.update(model.state.recipe);
  } catch (err) {
    recipeView.renderError('Error in Servings');
  }
};

///////////////////////////////////////

const controlAddBookmark = function () {
  try {
    // 1) Add/Remove bookmark
    if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
    else model.deleteBookmark(model.state.recipe.id);
    // 2) Update recipe view
    recipeView.update(model.state.recipe);
    // 3) Render bookmark view
    bookmarksView.render(model.state.bookmarks);
  } catch (err) {
    bookmarksView.renderMessage();
  }
};

///////////////////////////////////////

const controlBookmarks = function () {
  try {
    bookmarksView.render(model.state.bookmarks);
  } catch (err) {
    bookmarksView.renderMessage();
  }
};

///////////////////////////////////////

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    // 1) Upload data to API
    await model.uploadRecipe(newRecipe);
    // 2) Render uploaded recipe
    recipeView.render(model.state.recipe);
    // 3) Display success Message
    addRecipeView.renderMessage();
    // 4) Render bookmarks view
    bookmarksView.render(model.state.bookmarks);
    // 5) Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // 6) Close Form Window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError();
    // Re-Render upload recipe form
    setTimeout(() => addRecipeView.render(' '), RE_RENDER_MODAL_SEC * 1000);
  }
};

///////////////////////////////////////

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClickButton(controlPagination);
  addRecipeView.addHandlerRenderUploadForm();
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
