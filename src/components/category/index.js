import SortableList from '../sortable-list';
import Notification from '../notification';

import fetchJson from '../../utils/fetch-json.js';

export default class Category {
  element;
  subElements = {};
  sortableList;
  notification;

  onCategoryHeaderClick = () => {
    this.element.classList.toggle('category_open');
  }

  onSubcategoriesReorder = async () => {
    await this.updateSubcategoriesOnServer();
    this.notification.show();
  }

  updateSubcategoriesOnServer() {
    const url = new URL('api/rest/subcategories', process.env.BACKEND_URL);
    return fetchJson(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([...this.sortableList.element.children].map((item, index) => ({
        id: item.dataset.id,
        weight: index + 1,
      }))),
    });
  }

  constructor({
    count= 0,
    id = '',
    subcategories = [],
    title = '',
    weight = 0,
  } = {}) {
    this.count = count;
    this.id = id;
    this.subcategories = subcategories;
    this.title = title;
    this.weight = weight;

    this.notification = new Notification('Category order saved');
    const notificationStyle = this.notification.element.style;
    notificationStyle.position = 'fixed';
    notificationStyle.right = '20px';
    notificationStyle.bottom = '20px';
  }

  get template() {
    return `
      <div class="category category_open" data-id="${this.id}">
        <header class="category__header" data-element="categoryHeader">
          ${this.title}
        </header>
        <div class="category__body">
          <div class="subcategory-list" data-element="subcategoriesContainer"></div>
        </div>
      </div>
    `;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);
    this.sortableList = this.getSubCategoriesList();
    this.subElements['subcategoriesContainer'].append(this.sortableList.element);

    this.initEventListeners();

    return this.element;
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }

  getSubCategoriesList() {
    return new SortableList({
      items: this.subcategories.map(item => this.getSubCategoryListItem(item)),
    });
  }

  getSubCategoryListItem(subcategory) {
    const wrapper = document.createElement('div');
    const {id, title, count} = subcategory;
    wrapper.innerHTML = `
      <li
        class="categories__sortable-list-item sortable-list__item"
        data-grab-handle
        data-id="${id}"
      >
        <strong>${title}</strong>
        <span>
          <b>${count}</b> products
        </span>
      </li>
    `;

    return wrapper.firstElementChild;
  }

  initEventListeners() {
    this.subElements['categoryHeader'].addEventListener('click', this.onCategoryHeaderClick);
    this.element.addEventListener('sortable-list-reorder', this.onSubcategoriesReorder);
  }

  destroy() {
    this.sortableList.destroy();
    this.notification.destroy();
    this.element.remove();
  }
}
