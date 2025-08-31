import completions from "../completions.json";

class EditorMenu extends HTMLElement {
  constructor() {
    super();
    this.commands = [];
    this.filteredCommands = [];
  }

  async connectedCallback() {
    // Load commands from JSON
    await this.loadCommands();

    this.innerHTML = `
      <button class="hamburger-menu" aria-label="Open command palette">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <dialog class="command-palette">
        <div class="command-palette-header">
          <input type="text"
                 class="command-search"
                 placeholder="Type a command..."
                 autocomplete="off"
                 spellcheck="false">
        </div>
        <div class="command-palette-body">
          <ul class="command-list"></ul>
        </div>
      </dialog>
    `;

    this.hamburger = this.querySelector(".hamburger-menu");
    this.dialog = this.querySelector(".command-palette");
    this.searchInput = this.querySelector(".command-search");
    this.commandList = this.querySelector(".command-list");

    this.setupEventListeners();
    this.renderCommands();
  }

  async loadCommands() {
    try {
      // Try to load from external JSON file
      const response = await fetch("./editor-commands.json");
      if (response.ok) {
        const data = await response.json();
        this.commands = data.commands || [];
      } else {
        // Fall back to default commands
        this.commands = this.getDefaultCommands();
      }
    } catch (error) {
      console.warn("Failed to load commands from JSON, using defaults:", error);
      this.commands = this.getDefaultCommands();
    }

    // Add completions as snippet commands
    const snippetCommands = completions.map((completion) => ({
      label: `SNIPPET: ${completion.name}${completion.summary ? ` - ${completion.summary}` : ""}`,
      action: `snippet-${completion.name}`,
      category: "Snippets",
      snippetContent: completion.content,
    }));

    this.commands = [...this.commands, ...snippetCommands];
    this.filteredCommands = [...this.commands];
  }

  getDefaultCommands() {
    return [
      {
        label: "New File",
        action: "new",
        shortcut: "Ctrl+N",
        category: "File",
      },
      {
        label: "Load File",
        action: "load",
        shortcut: "Ctrl+O",
        category: "File",
      },
      {
        label: "Save File",
        action: "save",
        shortcut: "Ctrl+S",
        category: "File",
      },
      {
        label: "Toggle Autosave",
        action: "toggle-autosave",
        category: "File",
      },
    ];
  }

  setupEventListeners() {
    // Hamburger menu click
    this.hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      this.openPalette();
    });

    // Keyboard shortcut (Ctrl+Shift+P)
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "P") {
        e.preventDefault();
        this.openPalette();
      }
    });

    // Search input
    this.searchInput.addEventListener("input", (e) => {
      this.filterCommands(e.target.value);
    });

    // Handle Enter key in search
    this.searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const firstItem = this.commandList.querySelector(
          "li:not(.category-header):not(.no-results)",
        );
        if (firstItem && firstItem.dataset.action) {
          this.executeCommand(firstItem.dataset.action);
        }
      } else if (e.key === "Escape") {
        this.closePalette();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        this.navigateCommands(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        this.navigateCommands(-1);
      }
    });

    // Click outside to close
    this.dialog.addEventListener("click", (e) => {
      if (e.target === this.dialog) {
        this.closePalette();
      }
    });

    // ESC key to close
    this.dialog.addEventListener("cancel", (e) => {
      e.preventDefault();
      this.closePalette();
    });

    // Command list delegation
    this.commandList.addEventListener("click", (e) => {
      const li = e.target.closest("li");
      if (li && li.dataset.action) {
        this.executeCommand(li.dataset.action);
      }
    });
  }

  filterCommands(query) {
    const lowerQuery = query.toLowerCase().trim();

    if (!lowerQuery) {
      this.filteredCommands = [...this.commands];
    } else {
      this.filteredCommands = this.commands.filter((cmd) => {
        return (
          cmd.label.toLowerCase().includes(lowerQuery) ||
          cmd.action.toLowerCase().includes(lowerQuery) ||
          (cmd.category && cmd.category.toLowerCase().includes(lowerQuery))
        );
      });
    }

    this.renderCommands();
  }

  renderCommands() {
    if (this.filteredCommands.length === 0) {
      this.commandList.innerHTML = `
        <li class="no-results">No commands found</li>
      `;
      return;
    }

    // Group commands by category
    const grouped = {};
    this.filteredCommands.forEach((cmd) => {
      const category = cmd.category || "General";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(cmd);
    });

    let html = "";
    for (const [category, commands] of Object.entries(grouped)) {
      html += `<li class="category-header">${category}</li>`;
      commands.forEach((cmd) => {
        html += `
          <li data-action="${cmd.action}" tabindex="0">
            <span class="command-label">${cmd.label}</span>
            ${cmd.shortcut ? `<span class="command-shortcut">${cmd.shortcut}</span>` : ""}
          </li>
        `;
      });
    }

    this.commandList.innerHTML = html;
  }

  navigateCommands(direction) {
    const items = Array.from(
      this.commandList.querySelectorAll(
        "li:not(.category-header):not(.no-results)",
      ),
    );
    if (items.length === 0) return;

    const currentIndex = items.findIndex((item) =>
      item.classList.contains("selected"),
    );
    let newIndex;

    if (currentIndex === -1) {
      newIndex = direction === 1 ? 0 : items.length - 1;
    } else {
      items[currentIndex].classList.remove("selected");
      newIndex = (currentIndex + direction + items.length) % items.length;
    }

    items[newIndex].classList.add("selected");
    items[newIndex].scrollIntoView({ block: "nearest" });
  }

  executeCommand(action) {
    // Safety check for undefined action
    if (!action) {
      console.warn("executeCommand called with undefined action");
      return;
    }

    // Check if this is a snippet command
    if (action.startsWith("snippet-")) {
      const snippetName = action.replace("snippet-", "");
      const snippet = completions.find((c) => c.name === snippetName);
      if (snippet) {
        this.dispatchEvent(
          new CustomEvent("menu-item-click", {
            bubbles: true,
            composed: true,
            detail: {
              action: "insert-snippet",
              content: snippet.content,
            },
          }),
        );
        this.closePalette();
        return;
      }
    }

    this.dispatchEvent(
      new CustomEvent("menu-item-click", {
        bubbles: true,
        composed: true,
        detail: { action },
      }),
    );
    this.closePalette();
  }

  openPalette() {
    this.dialog.showModal();
    this.searchInput.value = "";
    this.filterCommands("");
    this.searchInput.focus();
  }

  closePalette() {
    this.dialog.close();
    this.searchInput.value = "";

    // Remove any selection
    const selected = this.commandList.querySelector(".selected");
    if (selected) {
      selected.classList.remove("selected");
    }
  }

  // Method to update commands dynamically
  setCommands(commands) {
    this.commands = commands;
    this.filteredCommands = [...commands];
    this.renderCommands();
  }

  static get observedAttributes() {
    return ["commands-url"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "commands-url":
        if (newValue) {
          this.loadCommandsFromUrl(newValue);
        }
        break;
    }
  }

  async loadCommandsFromUrl(url) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        this.setCommands(data.commands || []);
      }
    } catch (error) {
      console.error("Failed to load commands from URL:", error);
    }
  }
}

customElements.define("editor-menu", EditorMenu);
