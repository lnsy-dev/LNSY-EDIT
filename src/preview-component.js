class PreviewComponent extends HTMLElement {
  constructor() {
    super();
    this.iframe = null;
    this.hasUserConsent = false;
    this.pendingContent = null;
  }

  connectedCallback() {
    // Check if user has already given consent in this session
    const sessionConsent = sessionStorage.getItem("lnsy-preview-consent");
    if (sessionConsent === "true") {
      this.hasUserConsent = true;
    } else {
      this.showConsentWarning();
    }
  }

  showConsentWarning() {
    // Clear any existing content
    this.innerHTML = "";

    const container = document.createElement("div");
    container.className = "preview-consent-container";

    // Warning icon
    const icon = document.createElement("div");
    icon.className = "preview-warning-icon";
    icon.innerHTML = "⚠️";

    // Title
    const title = document.createElement("h2");
    title.className = "preview-consent-title";
    title.textContent = "Read the Code First";

    // Main warning message
    const mainMessage = document.createElement("p");
    mainMessage.className = "preview-main-message";
    mainMessage.textContent =
      "Live preview will execute the code you write in the editor directly in your browser.";

    // Security risks box
    const risksBox = document.createElement("div");
    risksBox.className = "preview-risks-box";

    const risksTitle = document.createElement("h3");
    risksTitle.className = "preview-risks-title";
    risksTitle.textContent = "⚠️ Potential Risks:";

    const risksList = document.createElement("ul");
    risksList.className = "preview-risks-list";
    risksList.innerHTML = `
      <li>Malicious code can harm your computer</li>
      <li>Scripts can access browser data and cookies</li>
      <li>Code can make network requests to external servers</li>
      <li>Infinite loops can freeze your browser</li>
    `;

    risksBox.appendChild(risksTitle);
    risksBox.appendChild(risksList);

    // Important notice
    const importantNotice = document.createElement("p");
    importantNotice.className = "preview-important-notice";
    importantNotice.textContent = "⚡ Only run code from trusted sources!";

    // Buttons container
    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "preview-buttons-container";

    // Enable Preview button
    const enableButton = document.createElement("button");
    enableButton.className = "preview-enable-button";
    enableButton.textContent = "I Understand, Enable Preview";
    enableButton.onclick = () => {
      this.hasUserConsent = true;
      sessionStorage.setItem("lnsy-preview-consent", "true");
      this.innerHTML = "";
      if (this.pendingContent) {
        this.render(this.pendingContent);
        this.pendingContent = null;
      }
    };

    // Keep Disabled button
    const disableButton = document.createElement("button");
    disableButton.className = "preview-disable-button";
    disableButton.textContent = "Keep Preview Disabled";
    disableButton.onclick = () => {
      this.showDisabledState();
    };

    // Assemble the warning
    buttonsContainer.appendChild(enableButton);
    buttonsContainer.appendChild(disableButton);

    container.appendChild(icon);
    container.appendChild(title);
    container.appendChild(mainMessage);
    container.appendChild(risksBox);
    container.appendChild(importantNotice);
    container.appendChild(buttonsContainer);

    this.appendChild(container);
  }

  showDisabledState() {
    // Clear any existing content
    this.innerHTML = "";

    const container = document.createElement("div");
    container.className = "preview-disabled-container";

    const icon = document.createElement("div");
    icon.className = "preview-disabled-icon";
    icon.innerHTML = "🔒";

    const title = document.createElement("h3");
    title.className = "preview-disabled-title";
    title.textContent = "Live Preview Disabled";

    const message = document.createElement("p");
    message.className = "preview-disabled-message";
    message.textContent =
      "Preview is disabled for your security. You can continue editing your code and enable preview when you're ready.";

    const enableButton = document.createElement("button");
    enableButton.className = "preview-enable-small-button";
    enableButton.textContent = "Enable Preview";
    enableButton.onclick = () => {
      this.showConsentWarning();
    };

    container.appendChild(icon);
    container.appendChild(title);
    container.appendChild(message);
    container.appendChild(enableButton);

    this.appendChild(container);
  }

  render(content) {
    // Store content if user hasn't consented yet
    if (!this.hasUserConsent) {
      this.pendingContent = content;
      return;
    }

    // Clear any existing content (this also removes any iframe)
    this.innerHTML = "";

    // Create and setup new iframe
    this.iframe = document.createElement("iframe");

    // Add sandbox attribute for additional security
    this.iframe.setAttribute("sandbox", "allow-scripts allow-same-origin");

    this.appendChild(this.iframe);

    const iframeDoc =
      this.iframe.contentDocument || this.iframe.contentWindow.document;
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

  // Method to reset consent (useful for testing or user preferences)
  resetConsent() {
    this.hasUserConsent = false;
    sessionStorage.removeItem("lnsy-preview-consent");
    this.iframe = null;
    this.showConsentWarning();
  }
}

customElements.define("preview-component", PreviewComponent);
