# monaco-json-studio-base-body

Handlebars (.hbs) 1-, 2-, and 3-pane body layouts paired with modular js/monaco/ runtime and source detection.

- **npm**: [https://www.npmjs.com/package/monaco-json-studio-base-body](https://www.npmjs.com/package/monaco-json-studio-base-body)
- **GitHub**: [https://github.com/keshavsoft/monaco-json-studio-base-body](https://github.com/keshavsoft/monaco-json-studio-base-body)
- **Docs**: [https://keshavsoft.github.io/monaco-json-studio-base-body/](https://keshavsoft.github.io/monaco-json-studio-base-body/) ([Story](./docs/story.html) · [npx](./docs/npx-usage.html) · [npm](./docs/npm-usage.html) · [Dependencies](./docs/dependencies.html))
- **Suite**: [Base Docs](https://keshavsoft.github.io/monaco-json-studio-base-docs/base-body.html)

## CLI (`npx`)

```bash
npx monaco-json-studio-base-body single
npx monaco-json-studio-base-body double
npx monaco-json-studio-base-body triple --html
```

## Programmatic (`npm`)

```bash
npm install monaco-json-studio-base-body
```

```js
import { renderBody, generateBodyPreview, normalizeBodyConfig } from 'monaco-json-studio-base-body';

const config = normalizeBodyConfig({ layout: 'single', url: 'https://keshavsoft.github.io/declarative-spec/json/v3/spec.json' });
const html = renderBody(config);
```
