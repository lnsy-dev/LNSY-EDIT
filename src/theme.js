import {EditorView} from "@codemirror/view"

export const EditorTheme = EditorView.theme({
  "&.cm-editor": {
    backgroundColor: "var(--lnsy-edit-background)",
    color: "var(--lnsy-edit-foreground)",
  },

  ".cm-gutters": {
    backgroundColor: "var(--lnsy-edit-gutter-background)",
    color: "var(--lnsy-edit-linenumber)",
    border: "none"
  },

  ".cm-content": {
    caretColor: "var(--lnsy-edit-cursor)"
  },

  "&.cm-focused .cm-cursor": {
    borderLeftColor: "var(--lnsy-edit-cursor)"
  },

  "&.cm-focused .cm-selectionBackground, ::selection": {
    backgroundColor: "var(--lnsy-edit-selection)"
  },

  ".cm-line": {
    fontFamily: "'FiraCodeNerdFontMono', monospace",
  }
}, {dark: true})
