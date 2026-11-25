export function prettyJson(text) {
    try {
        return JSON.stringify(JSON.parse(text), null, 2);
    } catch {
        return text;
    }
}

export function getValue(editor) {
    return editor ? editor.getValue() : '';
}

export function setValue(editor, value) {
    if (editor) editor.setValue(prettyJson(String(value ?? '')));
}

export function formatEditor(editor) {
    if (editor) editor.setValue(prettyJson(editor.getValue()));
}
