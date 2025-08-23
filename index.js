import "./src/editor-component.js"
import "./src/preview-component.js"
import "./index.css"
import "./styles/main-layout.css"
import "./styles/preview-component.css"

const editor = document.querySelector('lnsy-edit');
const preview = document.querySelector('preview-component');

editor.addEventListener('EDITOR-UPDATED', () => {
  const content = editor.view.state.doc.toString();
  preview.render(content);
});
