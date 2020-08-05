const header = [
  {
    id: 'images',
    title: 'Image',
    sortable: false,
    template: data => {
      const defaultImageUrl = data[0] ? data[0].url : null;
      const cellContent = defaultImageUrl
        ? `<img class="sortable-table-image" alt="Image" src="${defaultImageUrl}">`
        : '';

      return `<div class="sortable-table__cell">${cellContent}</div>`;
    }
  },
  {
    id: 'title',
    title: 'Title',
    sortable: true,
    sortType: 'string',
  },
  {
    id: 'subcategory',
    title: 'Category',
    sortable: false,
    template: data => `<div class="sortable-table__cell">${data.title}</div>`,
  },
  {
    id: 'quantity',
    title: 'Quantity',
    sortable: true,
    sortType: 'number',
  },
  {
    id: 'price',
    title: 'Price',
    sortable: true,
    sortType: 'number',
    template: data => `<div class="sortable-table__cell">$${data}</div>`,
  },
  {
    id: 'status',
    title: 'Status',
    sortable: true,
    sortType: 'number',
    template: data => {
      return `<div class="sortable-table__cell">
        ${data > 0 ? 'Active' : 'Inactive'}
      </div>`;
    },
  },
];

export default header;
