import { getPaneContainer } from '../body/index.js';
import { loadMonaco } from './loader/index.js';
import { loadInitialValue } from './source/index.js';
import { mountEditor } from './mount/index.js';
import { getValue, setValue, formatEditor } from './value/index.js';
import { attachEditorEvents } from './events/index.js';

export { loadMonaco, loadInitialValue, mountEditor, getValue, setValue, formatEditor };

export function getActiveEditor(state) {
    return state.editors[state.activePane] ?? state.editors[0] ?? null;
}

export async function initMonacoPanes(paneConfigs, state, { onPaneUpdate } = {}) {
    const monaco = await loadMonaco();
    await Promise.all(paneConfigs.map(async (pane, index) => {
        const container = getPaneContainer(pane);
        if (!container) return;

        const value = await loadInitialValue(pane);
        const editor = mountEditor(monaco, container, {
            language: pane.language,
            value
        });
        state.editors[index] = editor;

        const refresh = () => {
            if (onPaneUpdate) onPaneUpdate(editor, pane, index);
        };

        attachEditorEvents(editor, {
            onFocus: () => {
                state.activePane = index;
                refresh();
            },
            onCursor: refresh,
            onChange: refresh
        });
        refresh();
    }));
}
