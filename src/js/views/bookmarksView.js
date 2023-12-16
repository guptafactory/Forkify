'use strict';
import previewView from './previewView';
import View from './view';
import icons from 'url:../../img/icons.svg';

///////////////////////////////////////

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _message = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, true))
      .join('');
  }

  /* 
  _generateMarkup() {
    return `
    <li class="preview">
        <a class="preview__link" href="#23456">
            <figure class="preview__fig">
                <img src="src/img/test-1.jpg" alt="Test" />
            </figure>
            <div class="preview__data">
                <h4 class="preview__name">
                Pasta with Tomato Cream ...
                </h4>
                <p class="preview__publisher">The Pioneer Woman</p>
            </div>
        </a>
    </li>
    `;
  }
  */
}

///////////////////////////////////////

export default new BookmarksView();
