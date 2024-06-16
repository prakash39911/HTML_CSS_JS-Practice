import icons from 'url:../../img/icons.svg';
import view from './view.js';
import { resPerPage } from '../model.js';

class paginationView extends view {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      // Instead of using event Listener for all the child elements, we can use concept of event delegation and add  One Event listener on the Parent element, so when any of the child element was clicked, event will propogate to the parent and the required functonality will be performed.
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const numPage = Math.ceil(this._data.result.length / this._data.resPerPage);
    // page 1, there are Other Pages
    if (this._data.page === 1 && numPage > 1) {
      return `
      <button data-goto = "${
        this._data.page + 1
      }" class="btn--inline pagination__btn--next">
      <span>Page ${this._data.page + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
      `;
    }
    // Last Page
    if (this._data.page === numPage && numPage > 1) {
      return `
      <button data-goto = "${
        // To conncet user interface with the code, we use data properties.
        this._data.page - 1
      }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${this._data.page - 1}</span>
      </button>
      `;
    }
    // on some other page
    if (this._data.page < numPage) {
      return `
      <<button data-goto = "${
        this._data.page - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${this._data.page - 1}</span>
    </button>
      <button data-goto = "${
        this._data.page + 1
      }" class="btn--inline pagination__btn--next">
        <span>Page ${this._data.page + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
      `;
    }

    // page 1, There are No Other Pages
    return '';
  }
}

export default new paginationView();
