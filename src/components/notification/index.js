export default class NotificationMessage {
  element = null;

  constructor(name = '', {
    duration = 1000,
    type = 'success',
  } = {}) {
    this.name = name;
    this.duration = duration;
    this.type = type;

    this.render();
  }

  get template() {
    return `
      <div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">
            ${this.name}
          </div>
        </div>
      </div>
    `;
  }

  show(parent = document.body) {
    parent.append(this.element);
    setTimeout(() => this.remove(), this.duration);
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
