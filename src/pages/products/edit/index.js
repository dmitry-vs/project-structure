import ProductForm from '../../../components/product-form';
import NotificationMessage from '../../../components/notification';
import Router from '../../../router';
import { FetchError } from '../../../utils/fetch-json';

export default class Page {
  element;
  subElements = {};
  components = {};

  onProductSaved = ({ detail: id }) => {
    Router.instance().navigate(`/products/${id}`);
    new NotificationMessage('Product saved', ).show();
  }

  onProductUpdated = () => {
    new NotificationMessage('Product updated').show(this.element);
  }

  onUnhandledRejection = event => {
    if (event.reason instanceof FetchError) {
      new NotificationMessage('Server responded with error', {
        type: 'error',
      }).show(this.element);

      event.preventDefault();
    }
  }

  get template() {
    return `
      <div class="products-edit">
        <div class="content__top-panel">
          <h1 class="page-title">
            <a href="/products" class="link">Товары</a> / ${this.getProductIdFromPath() ? 'Редактировать' : 'Добавить'}
          </h1>
        </div>
        <div class="content-box" data-element="productFormContainer"></div>
      </div>
    `;
  }

  async render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    this.initComponents();
    await this.renderComponents();
    this.initEventListeners();

    return this.element;
  }

  getSubElements ($element) {
    const elements = $element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }

  initComponents() {
    this.components.productForm = new ProductForm(this.getProductIdFromPath());
  }

  getProductIdFromPath() {
    const strippedPath = decodeURI(window.location.pathname).replace(/^\/|\/$/, '');
    const [, pathEnding] = strippedPath.split('/');
    return pathEnding !== 'add' ? pathEnding : null;
  }

  async renderComponents() {
    const productFormElement = await this.components.productForm.render();
    this.subElements['productFormContainer'].append(productFormElement);
  }

  initEventListeners() {
    this.components.productForm.element.addEventListener('product-saved', this.onProductSaved);
    this.components.productForm.element.addEventListener('product-updated', this.onProductUpdated);
    window.addEventListener('unhandledrejection', this.onUnhandledRejection);
  }

  destroy() {
    this.removeEventListeners();

    for (const component of Object.values(this.components)) {
      component.destroy();
    }
  }

  removeEventListeners() {
    window.removeEventListener('unhandledrejection', this.onUnhandledRejection);
  }
}
