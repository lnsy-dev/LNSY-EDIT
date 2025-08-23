class EditorMenu extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <nav>
        <ul>
          <li class="file-menu">
            File
            <ul class="dropdown hidden">
              <li data-action="new">New</li>
              <li data-action="load">Load</li>
              <li data-action="save">Save</li>
              <li data-action="toggle-autosave">Toggle Autosave</li>
            </ul>
          </li>
        </ul>
      </nav>
    `;

    const fileMenu = this.querySelector('.file-menu');
    const dropdown = this.querySelector('.dropdown');

    fileMenu.addEventListener('click', (e) => {
      dropdown.classList.toggle('hidden');
    });

    this.addEventListener('click', (e) => {
      if (e.target.dataset.action) {
        this.dispatchEvent(new CustomEvent('menu-item-click', {
          bubbles: true,
          composed: true,
          detail: {
            action: e.target.dataset.action
          }
        }));
        dropdown.classList.add('hidden');
      }
    });

    document.addEventListener('click', (e) => {
      if (!this.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });
  }

  static get observedAttributes() {
    return [];
  }

  attributeChangedCallback(name, old_value, new_value) {
    switch (name) {
      default:
    }
  }
}

customElements.define('editor-menu', EditorMenu);