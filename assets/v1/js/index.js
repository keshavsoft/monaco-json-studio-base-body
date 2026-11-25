import { paneConfigs } from './state.js';
import { loadMonaco, loadInitialValue, mountMonacoEditor } from './monaco.js';

async function start() {
    const monaco = await loadMonaco();
    await Promise.all(paneConfigs.map(async (pane) => {
        const container = document.getElementById(pane.editorId);
        if (!container) return;
        const value = await loadInitialValue(pane.fileName);
        mountMonacoEditor(monaco, container, { language: pane.language, value });
    }));
}

start();
