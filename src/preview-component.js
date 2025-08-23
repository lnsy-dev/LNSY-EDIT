class PreviewComponent extends HTMLElement {
  constructor() {
    super();
    this.iframe = null;
  }

  render(content) {
    if (this.iframe) {
      this.removeChild(this.iframe);
    }

    this.iframe = document.createElement('iframe');
    this.appendChild(this.iframe);

    const iframeDoc = this.iframe.contentDocument || this.iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { margin: 0; padding: 0; }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);
    iframeDoc.close();
  }
}

customElements.define('preview-component', PreviewComponent);