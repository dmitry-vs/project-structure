import Category from '../../components/category';

import fetchJson from '../../utils/fetch-json.js';

export default class CategoriesPage {
  element;
  subElements = {};
  categories = [];

  get template() {
    return `
      <div class="categories">
        <div class="content__top-panel">
          <h1 class="page-title">Категории товаров</h1>
        </div>
        <div data-element="categoriesContainer"></div>
      </div>
    `;
  }

  async render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    await this.renderCategories();

    return this.element;
  }

  getSubElements ($element) {
    const elements = $element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }

  async renderCategories() {
    const categoriesData = await this.getCategoriesData();

    categoriesData.forEach(item => {
      const category = new Category(item);
      this.categories.push(category);
      this.subElements['categoriesContainer'].append(category.render());
    });
  }

  getCategoriesData() {
    const CATEGORIES_URL = new URL('api/rest/categories', process.env.BACKEND_URL);
    CATEGORIES_URL.searchParams.set('_sort', 'weight');
    CATEGORIES_URL.searchParams.set('_refs', 'subcategory');

    return fetchJson(CATEGORIES_URL);
  }

  destroy() {
    for (const category of this.categories) {
      category.destroy();
    }
  }
}
