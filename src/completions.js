import completions from '../completions.json';

export const completionKeymap = {
  key: "Tab",
  run: (view) => {
    const {state, dispatch} = view;
    const {from, to} = state.selection.main;
    if (from !== to) {
      view.dispatch(view.state.replaceSelection("  "));
      return true;
    }
    const word = state.doc.sliceString(from - 1, from);
    if (word.match(/\s/)) {
      view.dispatch(view.state.replaceSelection("  "));
      return true;
    }

    const line = state.doc.lineAt(from);
    const lineContent = state.doc.sliceString(line.from, to);
    const lastWord = lineContent.split(/\s+/).pop();

    if (completions[lastWord]) {
      const transaction = state.update({
        changes: {from: from - lastWord.length, to, insert: completions[lastWord]},
        selection: {anchor: from - lastWord.length + completions[lastWord].length}
      });
      dispatch(transaction);
      return true;
    }

    view.dispatch(view.state.replaceSelection("  "));
    return true;
  }
};