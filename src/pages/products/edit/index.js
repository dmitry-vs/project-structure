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
    this.components.notificationUpdated.show(this.element);
  }

  onUnhandledRejection = event => {
    if (event.reason instanceof FetchError) {
      this.components.notificationError.show(this.element);
      event.preventDefault();
    }
  }

  get template() {
    return `
      <div class="products-edit">
        <div class="content__top-panel">
          <h1 class="page-title">
            <a href="/products" class="link">Товары</a> / Добавить
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
    const strippedPath = decodeURI(window.location.pathname).replace(/^\/|\/$/, '');
    const [, pathEnding] = strippedPath.split('/');

    this.components.productForm = pathEnding === 'add' ? new ProductForm() : new ProductForm(pathEnding);

    this.components.notificationUpdated = new NotificationMessage('Product updated');

    this.components.notificationError = new NotificationMessage('Server responded with error', {
      type: 'error',
    });
  }

  async renderComponents() {
    this.subElements['productFormContainer'].append(await this.components.productForm.render());
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
