import {EditorView, basicSetup} from "codemirror"
import {html} from "@codemirror/lang-html"
import {keymap} from "@codemirror/view"
import {linter, lintGutter} from "@codemirror/lint"
import {HTMLHint} from "htmlhint"
import {completionKeymap} from "./completions.js"
import "./editor-menu.js"
import "./editor-footer.js"
import {EditorTheme, SyntaxHighlightingTheme} from "./theme.js";
import FileClerk from "./file-clerk.js";

const htmlLinter = (view) => {
  const diagnostics = [];
  const results = HTMLHint.verify(view.state.doc.toString(), {
    "tagname-lowercase": true,
    "attr-lowercase": true,
    "attr-value-double-quotes": true,
    "doctype-first": true,
    "tag-pair": true,
    "spec-char-escape": true,
    "id-unique": true,
    "src-not-empty": true,
    "attr-no-duplication": true,
    "title-require": true
  });
  results.forEach(r => {
    const from = view.state.doc.line(r.line).from + r.col - 1;
    const to = from + (r.raw ? r.raw.length : 1);
    diagnostics.push({
      from,
      to,
      severity: r.type,
      message: r.message,
    })
  });
  return diagnostics
};

class EditorComponent extends HTMLElement {
  dirty = false;

  connectedCallback() {
    this.fileClerk = new FileClerk();
    const menu = document.createElement('editor-menu');
    this.appendChild(menu);

    window.addEventListener('beforeunload', (event) => {
      if (this.dirty) {
        event.preventDefault();
        event.returnValue = '';
      }
    });

    menu.addEventListener('menu-item-click', async (e) => {
      switch (e.detail.action) {
        case 'new': {
          this.fileClerk.newFile();
          this.view.dispatch({
            changes: { from: 0, to: this.view.state.doc.length, insert: '' }
          });
          this.dirty = false;
          break;
        }
        case 'load': {
          const file = await this.fileClerk.load();
          if (file) {
            this.view.dispatch({
              changes: { from: 0, to: this.view.state.doc.length, insert: file.content }
            });
            this.dirty = false;
          }
          break;
        }
        case 'save': {
          const content = this.view.state.doc.toString();
          const success = await this.fileClerk.save(content);
          if(success){
            this.dirty = false;
          }
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
      extensions: [
        basicSetup,
        html(),
        linter(htmlLinter),
        lintGutter(),
        keymap.of([completionKeymap]),
        EditorTheme,
        SyntaxHighlightingTheme,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            this.dirty = true;
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