'use strict';
import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  _message = '';
  _errorMessage = '';
  render(data, transferMarkupToParent = false) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    if (transferMarkupToParent) return markup;
    this._displayMarkup(markup);
  }
  // Updating the changes in DOM (like diffing algo of React)
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const currElements = Array.from(this._parentElement.querySelectorAll('*'));
    newElements.forEach((newEl, i) => {
      const currEl = currElements[i];
      // Updates changed Text
      if (
        !newEl.isEqualNode(currEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      )
        currEl.textContent = newEl.textContent;
      // Updates changed Attributes
      if (!newEl.isEqualNode(currEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          currEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }
  renderSpinner() {
    const markup = `
        <div class="spinner">
          <svg>
              <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
        `;
    this._displayMarkup(markup);
  }
  renderError(message = this._errorMessage) {
    const markup = `
          <div class="error">
            <div>
              <svg>
                <use href="${icons}.svg#icon-alert-triangle"></use>
              </svg>
            </div>
            <p> Error: ${message} </p>
          </div>
        `;
    this._displayMarkup(markup);
  }
  renderMessage(message = this._message) {
    const markup = `
        <div class="message">
            <div>
                <svg>
                <use href="${icons}.svg#icon-smile"></use>
                </svg>
            </div>
            <p>${message}</p>
        </div>`;
    this._displayMarkup(markup);
  }
  _displayMarkup(markup) {
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
