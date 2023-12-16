'use strict';
import View from './view';
import previewView from './previewView';
import icons from 'url:../../img/icons.svg';
class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _message = 'Recipe results are generated successfully.';
  _errorMessage = 'Sorry, Could not find recipes of the query. Try Another!';
  _generateMarkup() {
    try {
      return this._data
        .map(result => previewView.render(result, true))
        .join('');
    } catch (err) {
      this.renderError();
    }
  }
}
export default new ResultsView();
