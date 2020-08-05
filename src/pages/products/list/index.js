import DoubleSlider from '../../../components/double-slider';
import SortableTable from '../../../components/sortable-table';
import header from './products-header.js';

export default class Page {
  element;
  subElements = {};
  components = {};
  filters = {
    titleLike: null,
    priceGte: null,
    priceLte: null,
    status: null,
  };

  onFilterNameInput = async ({ target: { value } }) => {
    const newTitleLike = value.trim();
    this.filters.titleLike = newTitleLike ? newTitleLike : null;
    await this.updateTableComponent();
  }

  onRangeSelect = async ({ detail: { from, to } }) => {
    this.filters.priceGte = from;
    this.filters.priceLte = to;
    await this.updateTableComponent();
  }

  onStatusSelectChange = async ({ target: { value: newStatus } }) => {
    this.filters.status = newStatus ? newStatus : null;
    await this.updateTableComponent();
  }

  async updateTableComponent() {
    this.components.sortableTable.url = this.getTableUrl();
    const data = await this.components.sortableTable.loadData();
    this.components.sortableTable.addRows(data);
  }

  get template() {
    return `
      <div class="products-list">
        <div class="content__top-panel">
          <h1 class="page-title">Products</h1>
          <a href="/products/add" class="button-primary">Add product</a>
        </div>
        <div class="content-box content-box_small">
          <form class="form-inline">
            <div class="form-group">
              <label class="form-label">Filter by name:</label>
              <input type="text" data-element="filterName" class="form-control" placeholder="Product name">
            </div>
            <div class="form-group" data-element="sliderContainer">
              <label class="form-label">Price:</label>
            </div>
            <div class="form-group">
              <label class="form-label">Status:</label>
              <select class="form-control" data-element="filterStatus">
                <option value selected>Any</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
          </form>
        </div>
        <div data-element="productsContainer" class="products-list__container"></div>
      </div>
    `;
  }

  async render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    this.initComponents();
    this.renderComponents();
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
    this.components.doubleSlider = new DoubleSlider({
      min: 0,
      max: 4000,
      formatValue: value => `$${value}`,
    });

    this.components.sortableTable = new SortableTable(header, {
      url: this.getTableUrl(),
    });
  }

  getTableUrl() {
    const url = new URL('api/rest/products', process.env.BACKEND_URL);
    url.searchParams.set('_embed', 'subcategory.category');

    const { titleLike, priceGte, priceLte, status } = this.filters;
    if (titleLike !== null) url.searchParams.set('title_like', titleLike);
    if (priceGte !== null) url.searchParams.set('price_gte', priceGte);
    if (priceLte !== null) url.searchParams.set('price_lte', priceLte);
    if (status !== null) url.searchParams.set('status', status);

    return url;
  }

  renderComponents() {
    this.subElements['sliderContainer'].append(this.components.doubleSlider.element);
    this.subElements['productsContainer'].append(this.components.sortableTable.element);
  }

  initEventListeners() {
    this.components.doubleSlider.element.addEventListener('range-select', this.onRangeSelect);
    this.subElements['filterStatus'].addEventListener('change', this.onStatusSelectChange);
    this.subElements['filterName'].addEventListener('input', this.onFilterNameInput);
  }

  destroy() {
    for (const component of Object.values(this.components)) {
      component.destroy();
    }
  }
}
