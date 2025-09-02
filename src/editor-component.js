import { EditorView, basicSetup } from "codemirror";
import { html } from "@codemirror/lang-html";
import { keymap } from "@codemirror/view";
import { linter, lintGutter } from "@codemirror/lint";
import { HTMLHint } from "htmlhint";
import { completionKeymap } from "./completions.js";
import "./editor-menu.js";
import "./editor-footer.js";
import { EditorTheme, SyntaxHighlightingTheme } from "./theme.js";
import FileClerk from "./file-clerk.js";
import { b64 } from "./b64.js";

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
    "title-require": true,
  });
  results.forEach((r) => {
    const from = view.state.doc.line(r.line).from + r.col - 1;
    const to = from + (r.raw ? r.raw.length : 1);
    if (from > view.state.doc.length || to < from) return;
    diagnostics.push({
      from,
      to: Math.min(to, view.state.doc.length),
      severity: r.type,
      message: r.message,
    });
  });
  return diagnostics;
};

class EditorComponent extends HTMLElement {
  dirty = false;

  connectedCallback() {
    this.fileClerk = new FileClerk();

    // Check for content in URL hash on load
    this.loadFromHash();

    const menu = document.createElement("editor-menu");
    this.appendChild(menu);

    window.addEventListener("beforeunload", (event) => {
      if (this.dirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    });

    menu.addEventListener("menu-item-click", async (e) => {
      switch (e.detail.action) {
        case "new": {
          this.fileClerk.newFile();
          this.view.dispatch({
            changes: { from: 0, to: this.view.state.doc.length, insert: "" },
          });
          this.dirty = false;
          break;
        }
        case "load":
        case "open": {
          const file = await this.fileClerk.load();
          if (file) {
            this.view.dispatch({
              changes: {
                from: 0,
                to: this.view.state.doc.length,
                insert: file.content,
              },
            });
            this.dirty = false;
          }
          break;
        }
        case "save": {
          const content = this.view.state.doc.toString();
          const success = await this.fileClerk.save(content);
          if (success) {
            this.dirty = false;
          }
          break;
        }
        case "save-as": {
          const content = this.view.state.doc.toString();
          const success = await this.fileClerk.saveAs(content);
          if (success) {
            this.dirty = false;
          }
          break;
        }
        case "save-as-url": {
          this.saveAsURL();
          break;
        }
        case "toggle-fullscreen": {
          this.toggleFullscreen();
          break;
        }
        case "insert-snippet": {
          if (e.detail.content) {
            // Get current cursor position
            const cursor = this.view.state.selection.main.head;
            // Insert the snippet at cursor position
            this.view.dispatch({
              changes: { from: cursor, to: cursor, insert: e.detail.content },
              selection: { anchor: cursor + e.detail.content.length },
            });
            // Focus back to the editor
            this.view.focus();
          }
          break;
        }
      }
    });

    const editorContainer = document.createElement("div");
    editorContainer.classList.add("editor-container");
    this.appendChild(editorContainer);

    // Use initial content from hash if available, otherwise use default
    const initialDoc = this.initialContent || "<!doctype html>";

    const view = new EditorView({
      parent: editorContainer,
      doc: initialDoc,
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
            this.dispatchEvent(
              new CustomEvent("EDITOR-UPDATED", {
                bubbles: true,
                composed: true,
              }),
            );
          }
        }),
      ],
    });
    this.view = view;

    const footer = document.createElement("editor-footer");
    this.appendChild(footer);
  }

  getFileSize() {
    const content = this.view.state.doc.toString();
    return new TextEncoder().encode(content).length;
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      const container =
        document.getElementById("main-container") || document.documentElement;
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        // Safari
        container.webkitRequestFullscreen();
      } else if (container.mozRequestFullScreen) {
        // Firefox
        container.mozRequestFullScreen();
      } else if (container.msRequestFullscreen) {
        // IE/Edge
        container.msRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        // Safari
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        // Firefox
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        // IE/Edge
        document.msExitFullscreen();
      }
    }
  }

  loadFromHash() {
    // Check if there's a hash in the URL
    if (window.location.hash && window.location.hash.length > 1) {
      try {
        // Remove the # and decode the base64 content
        const hash = window.location.hash.slice(1);
        const decodedContent = b64.decode(hash);

        // Store the content to load after the view is initialized
        this.initialContent = decodedContent;
        const noHashURL = window.location.href.replace(/#.*$/, '');
        window.history.replaceState('', document.title, noHashURL) 

      } catch (error) {
        console.error("Failed to decode content from URL:", error);
      }
    }
  }

  saveAsURL() {
    try {
      // Get the current editor content
      const content = this.view.state.doc.toString();

      // Encode the content as base64
      const encodedContent = b64.encode(content);

      // Create the new URL with the encoded content as hash
      const newURL = `${window.location.origin}${window.location.pathname}#${encodedContent}`;

      // Copy to clipboard
      navigator.clipboard
        .writeText(newURL)
        .then(() => {
          // Show success message (you could dispatch an event here for a toast notification)
          console.log("URL copied to clipboard!");
          alert(
            "URL with encoded content has been generated and copied to clipboard!",
          );
        })
        .catch((err) => {
          // Fallback: show the URL in a prompt for manual copying
          prompt("Copy this URL to share your code:", newURL);
        });
    } catch (error) {
      console.error("Failed to save as URL:", error);
      alert("Failed to generate URL. The content might be too large.");
    }
  }

  static get observedAttributes() {
    return [];
  }

  attributeChangedCallback(name, old_value, new_value) {
    switch (name) {
      default:
    }
  }
}

customElements.define("lnsy-edit", EditorComponent);
