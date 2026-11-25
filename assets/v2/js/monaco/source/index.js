import { prettyJson } from '../value/index.js';

function resolveSourceTarget(pane) {
    const params = new URLSearchParams(window.location.search);
    const queryUrl = params.get(`url${pane.paneNumber}`) ?? (pane.paneNumber === 1 ? params.get('url') : null);
    const source = queryUrl || pane.url || pane.fileName;

    if (/^https?:\/\/|^\//i.test(source)) return source;
    return `./data/${encodeURIComponent(source)}`;
}

export async function loadInitialValue(paneOrFileName) {
    const pane = typeof paneOrFileName === 'string'
        ? { paneNumber: 1, fileName: paneOrFileName }
        : paneOrFileName;

    const target = resolveSourceTarget(pane);
    try {
        const response = await fetch(target);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return prettyJson(await response.text());
    } catch {
        return JSON.stringify({ source: target }, null, 2);
    }
}
