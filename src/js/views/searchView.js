'use strict';
import View from './view';
import icons from 'url:../../img/icons.svg';
class SearchView extends View {
  _parentElement = document.querySelector('.search');
  _message = '';
  _errorMessage = '';
  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._parentElement.querySelector('.search__field').value = '';
    return query;
  }
  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}
export default new SearchView();
