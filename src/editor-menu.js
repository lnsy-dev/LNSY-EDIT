class EditorMenu extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <nav>
        <ul>
          <li>
            File
            <ul>
              <li data-action="load">Load</li>
              <li data-action="save">Save</li>
              <li data-action="toggle-autosave">Toggle Autosave</li>
            </ul>
          </li>
        </ul>
      </nav>
    `;

    this.addEventListener('click', (e) => {
      if (e.target.dataset.action) {
        this.dispatchEvent(new CustomEvent('menu-item-click', {
          bubbles: true,
          composed: true,
          detail: {
            action: e.target.dataset.action
          }
        }));
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