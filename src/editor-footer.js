class EditorFooter extends HTMLElement {
  connectedCallback(){
    this.updateFooter();
    document.addEventListener('EDITOR-UPDATED', () => this.updateFooter());
  }

  updateFooter() {
    const editor = document.querySelector('lnsy-edit');
    if (editor && typeof editor.getFileSize === 'function') {
      const sizeInBytes = editor.getFileSize();
      const sizeInKb = sizeInBytes / 1024;
      
      let sizeElement;
      if (sizeInKb <= 14) {
        sizeElement = `<notice>${sizeInKb.toFixed(2)} kb</notice>`;
      } else {
        sizeElement = `<error>${sizeInKb.toFixed(2)} kb</error>`;
      }
      this.innerHTML = `LNSY EDIT | ${sizeElement}`;
    } else {
      this.innerHTML = `LNSY EDIT`;
    }
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

customElements.define('editor-footer', EditorFooter)