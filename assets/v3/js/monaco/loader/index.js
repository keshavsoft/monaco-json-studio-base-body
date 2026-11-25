const MONACO_VS_PATH = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs';

export function loadMonaco() {
    if (window.monaco) return Promise.resolve(window.monaco);
    if (typeof window.require !== 'function') {
        return Promise.reject(new Error('Monaco loader is unavailable.'));
    }
    window.require.config({ paths: { vs: MONACO_VS_PATH } });
    return new Promise((resolve, reject) => {
        window.require(['vs/editor/editor.main'], () => resolve(window.monaco), reject);
    });
}
