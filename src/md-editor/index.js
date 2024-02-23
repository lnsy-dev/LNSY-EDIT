import './vendor/codemirror.js';
import './vendor/javascript.js';
import './vendor/css.js';
import './vendor/xml.js'
import './vendor/htmlmixed.js'
import './vendor/markdown.js'
import './vendor/closetag.js'

class LNSYEdit extends HTMLElement {
  connectedCallback(){

    this.textarea = document.createElement('textarea')
    this.appendChild(this.textarea)
    this.editor = CodeMirror.fromTextArea(this.textarea, {
      lineNumbers:true,
      mode:'markdown',
      theme:'lnsy-edit',
      autoCloseTags:true,
      lineWrapping: true,
      fencedCodeBlockHighlighting: true
    });

    this.editor.setOption("extraKeys", {
      Tab: function(cm) {
        var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
        cm.replaceSelection(spaces);
      },
      'Shift-Ctrl-P': () => {   
        console.log('control panel');     
        this.dispatchEvent(new CustomEvent('control-panel',{
          detail:{
            cursor: this.editor.getCursor()
          }
        }))
        return true
      },
      'Ctrl-S': () => {
        this.saveData();
        return true
      } 
    });

    this.editor.on("change", () => {
      const cursor = this.editor.getCursor()
      this.dispatchEvent(new CustomEvent("BUFFER-CHANGED", {
        detail: {
          cursor, // Get the current cursor position
          line: this.editor.getLine(cursor.line), // Get the content of the current line
          content: this.editor.getValue()
        }
      }))
    });

  }

  loadData(content){
    this.editor.setValue(content);
  }

}

customElements.define('md-editor', LNSYEdit)

