'use strict';
import { aync } from 'regenerator-runtime';
import { API_URL, RESULTS_PER_PAGE, API_KEY } from './config';
import { callJSON } from './helpers';

///////////////////////////////////////

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    curr_page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
    totalPages: 1,
  },
  bookmarks: [],
};

///////////////////////////////////////

const createRecipeObj = function (res) {
  const { recipe } = res.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    imgUrl: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

///////////////////////////////////////

export const loadRecipe = async function (id) {
  try {
    const res = await callJSON(`${API_URL}${id}?key=${API_KEY}`);
    state.recipe = createRecipeObj(res);
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

///////////////////////////////////////

export const loadSearchResults = async function (query) {
  try {
    state.search.curr_page = 1;
    const res = await callJSON(`${API_URL}?search=${query}&key=${API_KEY}`);
    if (res.data.recipes.length === 0) throw new Error('Error: Invalid query');
    state.search.query = query;
    state.search.totalPages = Math.ceil(
      res.data.recipes.length / state.search.resultsPerPage
    );
    state.search.results = res.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        imgUrl: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
  } catch (err) {
    throw err;
  }
};

///////////////////////////////////////

export const getSearchResultsPage = function (page = state.search.curr_page) {
  try {
    state.search.curr_page = page;
    const start = (page - 1) * state.search.resultsPerPage; // 0 based indexing
    const end = page * state.search.resultsPerPage;
    return state.search.results.slice(start, end); // recipes for specific page
  } catch (err) {
    throw err;
  }
};

///////////////////////////////////////

export const updateServings = function (newServings) {
  try {
    state.recipe.ingredients.forEach(ing => {
      ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    });
    state.recipe.servings = newServings;
  } catch (err) {
    throw err;
  }
};

///////////////////////////////////////

const persistBookmarks = function () {
  try {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
  } catch (err) {
    bookmarksView.renderMessage();
  }
};

///////////////////////////////////////

export const addBookmark = function (recipe) {
  try {
    // Add bookmark
    state.bookmarks.push(recipe);
    // Mark current recipe as bookmark
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
    persistBookmarks();
  } catch (err) {
    throw err;
  }
};

///////////////////////////////////////

export const deleteBookmark = function (id) {
  try {
    const index = state.bookmarks.findIndex(bookmark => bookmark.id == id);
    state.bookmarks.splice(index, 1);
    state.recipe.bookmarked = false;
    persistBookmarks();
  } catch (err) {
    throw err;
  }
};

///////////////////////////////////////

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3 || ingArr[2] === '')
          throw new Error(
            'Wrong Ingredient format. Follow format as mentioned! :)'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.imgUrl,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };
    const res = await callJSON(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObj(res);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

///////////////////////////////////////

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

///////////////////////////////////////
// For debugging
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();
