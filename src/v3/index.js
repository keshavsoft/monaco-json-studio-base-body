import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Handlebars from 'handlebars';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
export const assetsDir = path.resolve(moduleDir, '..', '..', 'assets', 'v3');
const templatesDir = path.join(assetsDir, 'templates');

const hbs = Handlebars.create();
hbs.registerPartial('pane', fs.readFileSync(path.join(templatesDir, 'pane.hbs'), 'utf8'));

const compiled = new Map();
const LAYOUT_COUNTS = { single: 1, double: 2, triple: 3, '1': 1, '2': 2, '3': 3 };
export const BODY_LAYOUTS = ['single', 'double', 'triple'];

function compile(templateName) {
    if (!compiled.has(templateName)) {
        const src = fs.readFileSync(path.join(templatesDir, templateName), 'utf8');
        compiled.set(templateName, hbs.compile(src));
    }
    return compiled.get(templateName);
}

function resolveUniqueDir(baseDir) {
    const resolved = path.resolve(process.cwd(), baseDir);
    if (!fs.existsSync(resolved)) return resolved;
    let i = 1;
    while (fs.existsSync(`${resolved}-${i}`)) i += 1;
    return `${resolved}-${i}`;
}

function copyTree(sourceDir, targetDir) {
    fs.mkdirSync(targetDir, { recursive: true });
    for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
        const srcPath = path.join(sourceDir, entry.name);
        const dstPath = path.join(targetDir, entry.name);
        if (entry.isDirectory()) {
            copyTree(srcPath, dstPath);
        } else {
            fs.copyFileSync(srcPath, dstPath);
        }
    }
}

export function normalizeBodyConfig(raw = {}) {
    const cfg = typeof raw === 'string' ? { layout: raw } : (raw ?? {});
    const rawLayout = String(cfg.layout ?? 'single');
    const count = LAYOUT_COUNTS[rawLayout];
    if (!count) {
        throw new TypeError(`body layout must be one of: ${BODY_LAYOUTS.join(', ')} (or 1, 2, 3)`);
    }

    const layout = BODY_LAYOUTS[count - 1];
    const panes = Array.from({ length: count }, (_, index) => {
        const paneNumber = index + 1;
        const rawPane = cfg.panes?.[index] ?? {};
        const key = rawPane.key ?? `pane${paneNumber}`;
        return {
            paneNumber,
            key,
            editorId: `editor${paneNumber}`,
            language: rawPane.language ?? 'json',
            fileName: rawPane.fileName ?? `${key}.json`,
            url: rawPane.url ?? (paneNumber === 1 ? cfg.url ?? '' : ''),
            contentText: JSON.stringify(rawPane.content ?? { pane: paneNumber }, null, 2)
        };
    });

    return { layout, paneCount: count, panes };
}

export function renderBody(rawConfig = {}) {
    const config = normalizeBodyConfig(rawConfig);
    return compile(`${config.layout}.hbs`)(config);
}

export function generateBodyPreview(rawConfig = {}) {
    const config = normalizeBodyConfig(rawConfig);
    const targetDir = resolveUniqueDir(rawConfig.outputDir ?? `./body-${config.layout}`);
    const cssDir = path.join(targetDir, 'css');
    const dataDir = path.join(targetDir, 'data');
    const jsDir = path.join(targetDir, 'js');
    [cssDir, dataDir, jsDir].forEach((dir) => fs.mkdirSync(dir, { recursive: true }));

    const bodyHtml = renderBody(config);
    const html = compile('document.hbs')({
        title: `Body · ${config.layout}`,
        bodyHtml: new Handlebars.SafeString(bodyHtml)
    });

    fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
    fs.copyFileSync(path.join(assetsDir, 'css', 'body.css'), path.join(cssDir, 'body.css'));
    copyTree(path.join(assetsDir, 'js'), jsDir);

    config.panes.forEach((pane) => {
        fs.writeFileSync(path.join(dataDir, pane.fileName), `${pane.contentText}\n`, 'utf8');
    });

    const stateSource = [
        `export const paneConfigs = ${JSON.stringify(config.panes, null, 2)};`,
        'export const state = { activePane: 0, editors: [] };',
        ''
    ].join('\n');
    fs.writeFileSync(path.join(jsDir, 'state.js'), stateSource, 'utf8');

    return targetDir;
}

export default { BODY_LAYOUTS, normalizeBodyConfig, renderBody, generateBodyPreview, assetsDir };
