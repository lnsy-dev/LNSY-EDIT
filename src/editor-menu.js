class EditorMenu extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        nav {
          background-color: #f0f0f0;
          padding: 5px;
          border-bottom: 1px solid #ccc;
        }
        ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: inline-block;
        }
        li {
          display: inline-block;
          position: relative;
          padding: 5px 10px;
          cursor: pointer;
        }
        li:hover {
          background-color: #e0e0e0;
        }
        ul ul {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          background-color: #f0f0f0;
          border: 1px solid #ccc;
          padding: 0;
          z-index: 1;
        }
        li:hover > ul {
          display: block;
        }
        ul ul li {
            display: block;
            width: 150px;
        }
      </style>
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

    this.shadowRoot.addEventListener('click', (e) => {
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