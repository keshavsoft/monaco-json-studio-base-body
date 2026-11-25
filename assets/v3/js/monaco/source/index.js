import { prettyJson } from '../value/index.js';

function classifySource(target) {
    if (/^https?:\/\//i.test(target)) {
        try {
            const parsed = new URL(target);
            return parsed.origin === window.location.origin ? 'same-origin' : 'external';
        } catch {
            return 'external';
        }
    }
    if (target.startsWith('/')) return 'same-origin';
    return 'local-data';
}

export function resolveSourceTarget(pane) {
    const params = new URLSearchParams(window.location.search);
    const queryUrl = params.get(`url${pane.paneNumber}`) ?? (pane.paneNumber === 1 ? params.get('url') : null);
    const source = queryUrl || pane.url || pane.fileName;

    if (/^https?:\/\/|^\//i.test(source)) return source;
    return `./data/${encodeURIComponent(source)}`;
}

export async function loadInitialSource(paneOrFileName) {
    const pane = typeof paneOrFileName === 'string'
        ? { paneNumber: 1, fileName: paneOrFileName }
        : paneOrFileName;

    const target = resolveSourceTarget(pane);
    const sourceKind = classifySource(target);

    try {
        const response = await fetch(target);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`.trim());
        }
        const value = prettyJson(await response.text());
        return { value, source: target, sourceKind, ok: true, error: '' };
    } catch (err) {
        const error = err?.message || 'Failed to load source';
        const fallback = JSON.stringify({ error, source: target, sourceKind }, null, 2);
        return { value: fallback, source: target, sourceKind, ok: false, error };
    }
}

export async function loadInitialValue(paneOrFileName) {
    const result = await loadInitialSource(paneOrFileName);
    return result.value;
}
