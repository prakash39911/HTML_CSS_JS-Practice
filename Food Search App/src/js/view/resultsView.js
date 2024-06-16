import view from './view';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class resultView extends view {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No Recipe Found for Your Query. Please try Again !';
  _successMessage = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new resultView();
