import 'https://cdn.jsdelivr.net/npm/codemirror@5.62.2/lib/codemirror.js';
import 'https://cdn.jsdelivr.net/npm/codemirror@5.62.2/mode/javascript/javascript.js';
import 'https://cdn.jsdelivr.net/npm/codemirror@5.62.2/mode/css/css.js';
import 'https://cdn.jsdelivr.net/npm/codemirror@5.62.2/mode/xml/xml.js';
import 'https://cdn.jsdelivr.net/npm/codemirror@5.62.2/mode/htmlmixed/htmlmixed.js';
import './localforage.min.js';

class LNSYEdit extends HTMLElement {
  constructor(){
    super();
    this.innerHTML = `
    <link rel=stylesheet href="https://cdn.jsdelivr.net/npm/codemirror@5.62.2/lib/codemirror.css" >
    <style>

      :root {
        --background-color: #000;
        --foreground-color: #6c6783;
        --highlight-color: #545167;

      }
      /*
        Name:   lnsy-edit
        Author: by LNSY, adapted from DuoTone themes by Simurai (http://simurai.com/projects/2016/01/01/duotone-themes)
        CodeMirror template by Jan T. Sott (https://github.com/idleberg), adapted by Bram de Haan (https://github.com/atelierbram/)
      */
      .cm-s-lnsy-edit.CodeMirror { background: var(--background-color); color: var(--foreground-color); }
      .cm-s-lnsy-edit div.CodeMirror-selected { background: #545167!important; }
      .cm-s-lnsy-edit .CodeMirror-gutters { background: #2a2734; border-right: 0px; }
      .cm-s-lnsy-edit .CodeMirror-linenumber { color: #545167; }
      /* begin cursor */
      .cm-s-lnsy-edit .CodeMirror-cursor { border-left: 1px solid #ffad5c; /* border-left: 1px solid #ffad5c80; */ border-right: .5em solid #ffad5c; /* border-right: .5em solid #ffad5c80; */ opacity: .5; }
      .cm-s-lnsy-edit .CodeMirror-activeline-background { background: #363342; /* background: #36334280;  */ opacity: .5;}
      .cm-s-lnsy-edit .cm-fat-cursor .CodeMirror-cursor { background: #ffad5c; /* background: #ffad5c80; */ opacity: .5;}
      /* end cursor */
      .cm-s-lnsy-edit span.cm-atom, .cm-s-lnsy-edit span.cm-number, .cm-s-lnsy-edit span.cm-keyword, .cm-s-lnsy-edit span.cm-variable, .cm-s-lnsy-edit span.cm-attribute, .cm-s-lnsy-edit span.cm-quote, .cm-s-lnsy-edit span.cm-hr, .cm-s-lnsy-edit span.cm-link { color: #ffcc99; }
      .cm-s-lnsy-edit span.cm-property { color: #9a86fd; }
      .cm-s-lnsy-edit span.cm-punctuation, .cm-s-lnsy-edit span.cm-unit, .cm-s-lnsy-edit span.cm-negative { color: #e09142; }
      .cm-s-lnsy-edit span.cm-string { color: #ffb870; }
      .cm-s-lnsy-edit span.cm-operator { color: #ffad5c; }
      .cm-s-lnsy-edit span.cm-positive { color: #6a51e6; }
      .cm-s-lnsy-edit span.cm-variable-2, .cm-s-lnsy-edit span.cm-variable-3, .cm-s-lnsy-edit span.cm-type, .cm-s-lnsy-edit span.cm-string-2, .cm-s-lnsy-edit span.cm-url { color: #7a63ee; }
      .cm-s-lnsy-edit span.cm-def, .cm-s-lnsy-edit span.cm-tag, .cm-s-lnsy-edit span.cm-builtin, .cm-s-lnsy-edit span.cm-qualifier, .cm-s-lnsy-edit span.cm-header, .cm-s-lnsy-edit span.cm-em { color: #eeebff; }
      .cm-s-lnsy-edit span.cm-bracket, .cm-s-lnsy-edit span.cm-comment { color: #6c6783; }
      /* using #f00 red for errors, don't think any of the colorscheme variables will stand out enough, ... maybe by giving it a background-color ... */
      .cm-s-lnsy-edit span.cm-error, .cm-s-lnsy-edit span.cm-invalidchar { color: #f00; }
      .cm-s-lnsy-edit span.cm-header { font-weight: normal; }
      .cm-s-lnsy-edit .CodeMirror-matchingbracket { text-decoration: underline; color: #eeebff !important; } 
      .CodeMirror {
           width: 100% !important;
           height: 100% !important;
      } 
      #menu {
        margin: -1em 0 0 -1em;
        padding: 0;
        z-index: 100;
        padding: 1em;
        position: fixed;
        left: 0px;
        top: 0px;
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
         -khtml-user-select: none; /* Konqueror HTML */
           -moz-user-select: none; /* Old versions of Firefox */
            -ms-user-select: none; /* Internet Explorer/Edge */
                user-select: none; /* Non-prefixed version, currently */
      }
    </style>
  `

    this.textarea = document.createElement('textarea')
    this.appendChild(this.textarea)
    const editor = CodeMirror.fromTextArea(this.textarea, {
      lineNumbers:false,
      mode:'htmlmixed',
      theme:'lnsy-edit'
    });

    editor.setOption("extraKeys", {
      Tab: function(cm) {
        var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
        cm.replaceSelection(spaces);
      }
    })

    document.addEventListener('keydown', function(e){
      if(e.ctrlKey && e.code === 'KeyS'){
        e.preventDefault()
        this.saveFile();
      }
    });

    this.initialize();
  }

  async initialize(){
    this.id = await this.getUUID();
  }


  async loadFile(id){

  }

  async saveFile(id){
    const file_clerk = document.querySelector('file-clerk');
    if(file_clerk === null){
      return console.error('File Clerk Module not Included. Cannot Save');
    }

  }

  async getUUID(){
    if(this.uuid){
      return this.uuid;
    } else {
      const uuid = await localforage.getItem('editor.' + window.location.host);
      if(uuid === null){
        await this.generateNewKey();
        return this.uuid;
      } else {
        return uuid
      }
    }
  }

  async generateNewKey(){
    this.uuid = self.crypto.randomUUID();
    await localforage.setItem('editor.' + window.location.host, this.uuid);
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

customElements.define('lnsy-edit', LNSYEdit)


