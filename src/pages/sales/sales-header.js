const header = [
  {
    id: 'id',
    title: 'ID',
    sortable: true,
    sortType: 'number',
  },
  {
    id: 'user',
    title: 'Client',
    sortable: true,
    sortType: 'string',
  },
  {
    id: 'createdAt',
    title: 'Date',
    sortable: true,
    sortType: 'custom',
    customSorting: (a, b) => new Date(a) > new Date(b) ? -1 : 1,
    template: data => {
      const dateFormat = new Intl.DateTimeFormat('en', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
      });
      const [{ value: month },, { value: day },, { value: year }] = dateFormat.formatToParts(new Date(data));
      return `<div class="sortable-table__cell">${day} ${month} ${year}</div>`;
    },
  },
  {
    id: 'totalCost',
    title: 'Price',
    sortable: true,
    sortType: 'number',
    template: data => `<div class="sortable-table__cell">$${data}</div>`,
  },
  {
    id: 'delivery',
    title: 'Status',
    sortable: true,
    sortType: 'string',
    template: data => {
      return `<div class="sortable-table__cell">
        ${data === 'Доставлено' ? 'Inactive' : 'Active'}
      </div>`;
    },
  },
];

export default header;
