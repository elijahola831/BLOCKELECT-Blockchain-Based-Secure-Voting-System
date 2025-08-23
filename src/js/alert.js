class Alert {
  static show(type, iconClass, title, message) {
    let container = document.querySelector('.alert-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'alert-container';
      document.body.appendChild(container);
    }

    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.innerHTML = `
      <div class="title">
        <i class="bi bi-${iconClass}"></i>
        ${title}
      </div>
      <small>${message}</small>
    `;

    container.appendChild(alert);

    requestAnimationFrame(() => {
      alert.classList.add('show');
    });

    setTimeout(() => {
      alert.classList.remove('show');
      alert.classList.add('hide');
      alert.addEventListener('transitionend', () => alert.remove());
    }, 5000);
  }
}