#!/usr/bin/env node
import { BODY_LAYOUTS, renderBody, generateBodyPreview } from '../src/index.js';

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Monaco JSON Studio · Base Body

Usage:
  npx monaco-json-studio-base-body [layout] [--html]

Layouts:
  ${BODY_LAYOUTS.join(' | ')} (or 1 | 2 | 3, default: single)

Examples:
  npx monaco-json-studio-base-body single
  npx monaco-json-studio-base-body double
  npx monaco-json-studio-base-body triple --html
`);
    process.exit(0);
}

const htmlOnly = args.includes('--html');
const layout = args.find((a) => !a.startsWith('-')) ?? 'single';

try {
    if (htmlOnly) {
        console.log(renderBody({ layout }));
    } else {
        const dir = generateBodyPreview({ layout });
        console.log(`Generated Body preview (${layout}).`);
        console.log(`Open: ${dir}/index.html`);
    }
} catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
}
