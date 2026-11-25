const DEFAULT_OPTIONS = {
    theme: 'vs-dark',
    automaticLayout: true,
    tabSize: 2,
    fontSize: 13,
    lineNumbers: 'on',
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    cursorBlinking: 'smooth',
    renderLineHighlight: 'all',
    padding: { top: 10 }
};

export function mountEditor(monaco, container, { language = 'json', value = '{}' }) {
    return monaco.editor.create(container, {
        ...DEFAULT_OPTIONS,
        language,
        value
    });
}
