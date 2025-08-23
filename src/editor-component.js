import {EditorView, basicSetup} from "codemirror"
import {html} from "@codemirror/lang-html"
import {keymap} from "@codemirror/view"
import {completionKeymap} from "./completions.js"
import "./editor-menu.js"
import "./editor-footer.js"
import {EditorTheme, SyntaxHighlightingTheme} from "./theme.js";
import FileClerk from "./file-clerk.js";

class EditorComponent extends HTMLElement {
  connectedCallback(){
    this.fileClerk = new FileClerk();
    const menu = document.createElement('editor-menu');
    this.appendChild(menu);

    menu.addEventListener('menu-item-click', async (e) => {
      switch (e.detail.action) {
        case 'new': {
          this.fileClerk.newFile();
          this.view.dispatch({
            changes: { from: 0, to: this.view.state.doc.length, insert: '' }
          });
          break;
        }
        case 'load': {
          const file = await this.fileClerk.load();
          if (file) {
            this.view.dispatch({
              changes: { from: 0, to: this.view.state.doc.length, insert: file.content }
            });
          }
          break;
        }
        case 'save': {
          const content = this.view.state.doc.toString();
          await this.fileClerk.save(content);
          break;
        }
      }
    });

    const editorContainer = document.createElement('div');
    editorContainer.classList.add('editor-container');
    this.appendChild(editorContainer);

    const view = new EditorView({
      parent: editorContainer,
      doc: "",
      rulers: [{ column: 40, color: "var(--light-neutral)", lineStyle: "dashed" }],

      extensions: [
        basicSetup, 
        html(),
        keymap.of([completionKeymap]),
        EditorTheme,
        SyntaxHighlightingTheme,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            this.dispatchEvent(new CustomEvent('EDITOR-UPDATED', {
              bubbles: true,
              composed: true
            }));
          }
        })
      ]
    });
    this.view = view;

    const footer = document.createElement('editor-footer');
    this.appendChild(footer);
  }

  getFileSize(){
    const content = this.view.state.doc.toString();
    return new TextEncoder().encode(content).length;
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

customElements.define('lnsy-edit', EditorComponent);