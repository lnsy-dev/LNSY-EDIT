import completions from "../completions.json";
import { acceptCompletion, autocompletion } from "@codemirror/autocomplete";

export const completionKeymap = {
  key: "Tab",
  run: (view) => {
    const { state, dispatch } = view;
    const { from, to } = state.selection.main;

    // If there's a selection, insert spaces (indentation)
    if (from !== to) {
      view.dispatch(view.state.replaceSelection("  "));
      return true;
    }

    // Check if there's an active completion
    if (acceptCompletion(view)) {
      return true;
    }

    // Check if cursor is after whitespace, if so, indent
    const word = state.doc.sliceString(from - 1, from);
    if (word.match(/\s/)) {
      view.dispatch(view.state.replaceSelection("  "));
      return true;
    }

    const line = state.doc.lineAt(from);
    const lineContent = state.doc.sliceString(line.from, to);
    const lastWord = lineContent.split(/\s+/).pop();

    // Find completion by name in the array
    const completion = completions.find((c) => c.name === lastWord);

    if (completion) {
      const transaction = state.update({
        changes: {
          from: from - lastWord.length,
          to,
          insert: completion.content,
        },
        selection: {
          anchor: from - lastWord.length + completion.content.length,
        },
      });
      dispatch(transaction);
      return true;
    }

    // Default to indentation
    view.dispatch(view.state.replaceSelection("  "));
    return true;
  },
};

// Completion source for autocompletion
export const myCompletions = (context) => {
  const word = context.matchBefore(/\w*/);
  if (!word || (word.from === word.to && !context.explicit)) return null;

  const options = completions.map((completion) => ({
    label: completion.name,
    apply: completion.content,
    info: completion.description || `Insert ${completion.name}`,
  }));

  return {
    from: word.from,
    options,
  };
};

// Export autocompletion extension
export const completionExtension = autocompletion({
  override: [myCompletions],
});
