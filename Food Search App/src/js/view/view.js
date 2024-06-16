// This is a Parent class.. All other views will be child of this class.
// Methods and properties which is common to all Views will be here.

import icons from 'url:../../img/icons.svg';

export default class view {
  _data;

  /**
   * Render the received Object to the DOM.
   * @param {Object | Object []} data The data to be rendered (e.g. Recipe)
   * @param {boolean} [render =true] if False, create Markup String instead of rendering to the DOM.
   * @returns {undefined | String} A markup string is returned if render = false
   * @this {Object} View instance
   * @author Chandra Prakash
   * @todo Finish Implementation
   */

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const currEl = currElements[i];

      // Update Changed Text
      if (
        !newEl.isEqualNode(currEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        currEl.textContent = newEl.textContent;
      }

      // Update changed data attribute.
      if (!newEl.isEqualNode(currEl)) {
        Array.from(newEl.attributes).forEach(attri =>
          currEl.setAttribute(attri.name, attri.value)
        );
      }
    });
  }

  renderSpinner = function () {
    const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
       </div>
    `;
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderError(err = this._errorMessage) {
    const markup = `
      <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${err}</p>
    </div>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderSuccess(success = this._successMessage) {
    const markup = `
      <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${success}</p>
    </div>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
