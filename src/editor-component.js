import {EditorView, basicSetup} from "codemirror"
import {html} from "@codemirror/lang-html"
import {keymap} from "@codemirror/view"
import {completionKeymap} from "./completions.js"
import "./editor-menu.js"

class EditorComponent extends HTMLElement {
  connectedCallback(){
    const menu = document.createElement('editor-menu');
    this.appendChild(menu);

    menu.addEventListener('menu-item-click', (e) => {
        console.log('Menu item selected:', e.detail.action);
    });

    const editorContainer = document.createElement('div');
    this.appendChild(editorContainer);

    const view = new EditorView({
      parent: editorContainer,
      doc: "Hello",
      extensions: [
        basicSetup, 
        html(),
        keymap.of([completionKeymap]),
      ]
    });
  }

  static get observedAttributes() {
    return [];
  }

  attributeChangedCallback(name, old_value, new_value){
    switch(name){
      default:
    }
  }

}

customElements.define('lnsy-edit', EditorComponent)