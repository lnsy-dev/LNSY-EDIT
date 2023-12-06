import 'https://cdn.jsdelivr.net/npm/codemirror@5.62.2/lib/codemirror.js'

document.head.insertAdjacentHTML( 'beforeend', `<link rel=stylesheet href="https://cdn.jsdelivr.net/npm/codemirror@5.62.2/lib/codemirror.css" >` );

import 'https://cdn.jsdelivr.net/npm/codemirror@5.62.2/mode/javascript/javascript.js'
import 'https://cdn.jsdelivr.net/npm/codemirror@5.62.2/mode/css/css.js'
import 'https://cdn.jsdelivr.net/npm/codemirror@5.62.2/mode/xml/xml.js'
import 'https://cdn.jsdelivr.net/npm/codemirror@5.62.2/mode/htmlmixed/htmlmixed.js'
import 'https://cdn.jsdelivr.net/npm/codemirror@5.62.2/mode/markdown/markdown.js'
import 'https://cdn.jsdelivr.net/npm/codemirror@5.62.2/addon/edit/closetag.js'

function parseJSONFrontmatter(markdownContent) {
  // Regular expression to match YAML or JSON frontmatter
  const frontmatterRegex = /^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+/;

  // Check if frontmatter exists in the markdown content
  const match = markdownContent.match(frontmatterRegex);

  if(match === null){
    return {}
  }

  if (match && match[1]) {
    // Extract the frontmatter string
    const frontmatterString = match[1];

    try {
      // Parse the frontmatter string into a JavaScript object
      const frontmatterObject = JSON.parse(frontmatterString);

      return frontmatterObject;
    } catch (error) {
      console.error('Error parsing frontmatter:', error);
      return {};
    }
  }

  // If no frontmatter is found, return null
  return null;
}

// Function to remove YAML front matter from a string
function removeFrontMatter(content) {
    const yamlRegex = /^---\n([\s\S]*?)\n---/;
    return content.replace(yamlRegex, '').trim();
}


class LNSYEdit extends HTMLElement {
  connectedCallback(){
    const details = document.createElement('details');
    details.innerHTML = `<summary></summary>`; 
    const save_button = document.createElement('button');
    save_button.innerText = 'save';
    save_button.addEventListener('click', (e) => {
      this.saveData();
    });
    details.appendChild(save_button);

    this.download_link = document.createElement('a');
    this.download_link.setAttribute('download', true);
    details.appendChild(this.download_link);


    this.id = this.getAttribute('id'); 
    if (this.id === null) {
      this.id = crypto.randomUUID();
    }

    const load_file = document.createElement('input');
    load_file.setAttribute('type', 'file');
    load_file.setAttribute('accept', '.md');
    load_file.addEventListener('change', (e) => {
     const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.loadMarkdown(e.target.result);
        };
        reader.readAsText(file);
      }
    });
    details.appendChild(load_file);

    this.json_editor = document.createElement('json-editor');
    details.appendChild(this.json_editor);
    this.appendChild(details);

    this.textarea = document.createElement('textarea')
    this.appendChild(this.textarea)
    this.editor = CodeMirror.fromTextArea(this.textarea, {
      lineNumbers:false,
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
      }
    });

    /* Detect Save Key */
    window.addEventListener('keydown', (e) =>{
      if(e.ctrlKey && e.code === 'KeyS'){
        e.preventDefault();
        this.saveData();
      }
    });

    let metadata = this.getAttribute('metadata');
    if(metadata === null){
      metadata = {}
    } else {
      metadata = JSON.parse(metadata);
    }

    let content = this.getAttribute('content');
    if(content === null){
      content = ''
    } 

    this.loadData(content, metadata);
  }

  saveData(){
    const json_data = this.json_editor.getData();
    const editor_content = this.editor.getValue();
    const markdown_content = this.getMarkdown();
    const save_event = new CustomEvent('save', {
      detail: {
        metadata: json_data,
        content: editor_content,
        markdown: markdown_content,
        timestamp: new Date().toISOString()
      }
    });
    this.dispatchEvent(save_event);
    const blob = new Blob([markdown_content], { type: 'text/plain' });
    const dataUrl = URL.createObjectURL(blob);

    this.download_link.innerText = 'Download';
    this.download_link.classList.add('button');
    this.download_link.href = dataUrl;
    let file_name = `${this.id}-${Date.now()}`;
    this.download_link.download = `${file_name}.md`;

  }

  loadData(content, metadata){
    this.json_editor.updateData(metadata);
    this.editor.setValue(content);
  }

  loadMarkdown(markdown){
    const json = parseJSONFrontmatter(markdown);
    const content = removeFrontMatter(markdown);
    this.json_editor.updateData(json);
    this.editor.setValue(content);
  }

  getMarkdown(){
    const json_data = this.json_editor.getData();
    const editor_content = this.editor.getValue();
return `---
${JSON.stringify(json_data)}
---
${editor_content}
`
  }
}

customElements.define('lnsy-edit', LNSYEdit)

