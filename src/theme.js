import {EditorView} from "@codemirror/view"
import {HighlightStyle, syntaxHighlighting} from "@codemirror/language"
import {tags} from "@lezer/highlight"

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
  },

  ".cm-activeLine": {
    backgroundColor: "var(--lnsy-edit-activeline-background)"
  }
}, {dark: true})

export const SyntaxHighlightingTheme = syntaxHighlighting(HighlightStyle.define([
  {tag: tags.keyword, color: "var(--lnsy-edit-keyword)"},
  {tag: tags.atom, color: "var(--lnsy-edit-atom)"},
  {tag: tags.number, color: "var(--lnsy-edit-number)"},
  {tag: tags.comment, color: "var(--lnsy-edit-comment)", fontStyle: "italic"},
  {tag: tags.string, color: "var(--lnsy-edit-string)"},
  {tag: tags.meta, color: "var(--lnsy-edit-neutral-dark)"},
  {tag: tags.variableName, color: "var(--lnsy-edit-variable)"},
  {tag: tags.propertyName, color: "var(--lnsy-edit-property)"},
  {tag: tags.definition, color: "var(--lnsy-edit-def)"},
  {tag: tags.tagName, color: "var(--lnsy-edit-tag)"},
  {tag: tags.attributeName, color: "var(--lnsy-edit-attribute)"},
  {tag: tags.attributeValue, color: "var(--lnsy-edit-string)"},
  {tag: tags.bracket, color: "var(--lnsy-edit-bracket)"},
  {tag: tags.link, color: "var(--lnsy-edit-link)", textDecoration: "underline"},
  {tag: tags.heading, color: "var(--lnsy-edit-keyword)", fontWeight: "bold"},
  {tag: tags.strong, fontWeight: "bold"},
  {tag: tags.emphasis, fontStyle: "italic"},
]))