'use strict';
import View from './view';
import icons from 'url:../../img/icons.svg';
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _message = 'Pagination generated successfully.';
  _errorMessage = 'Error in rendering pagination buttons.';
  addHandlerClickButton(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const { goto } = btn.dataset;
      handler(+goto);
    });
  }
  _generateMarkup() {
    const currPage = this._data.curr_page;
    const totPages = this._data.totalPages;
    // At page 1 and Has other pages
    if (currPage === 1 && totPages > 1) {
      return this._generateRightButton(2);
    }
    // Last page
    if (currPage === totPages && totPages > 1) {
      return this._generateLeftButton(totPages - 1);
    }
    // Middle Pages
    if (currPage > 1 && currPage < totPages) {
      return `
          ${this._generateLeftButton(currPage - 1)}
          ${this._generateRightButton(currPage + 1)}`;
    }
    // At page 1 and No other pages
    if (currPage === 1 && totPages === 1) {
      return ``;
    }
  }
  _generateLeftButton(page) {
    return `
      <button data-goto="${page}" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${page}</span>
      </button>`;
  }
  _generateRightButton(page) {
    return `
      <button data-goto="${page}" class="btn--inline pagination__btn--next">
        <span>Page ${page}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right">
          </use>
        </svg>
      </button>`;
  }
}
export default new PaginationView();
