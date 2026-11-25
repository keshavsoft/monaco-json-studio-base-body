export function attachEditorEvents(editor, { onFocus, onCursor, onChange } = {}) {
    if (onFocus) editor.onDidFocusEditorText(onFocus);
    if (onCursor) editor.onDidChangeCursorPosition(onCursor);
    if (onChange) editor.onDidChangeModelContent(onChange);
}
