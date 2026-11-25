# monaco-json-studio-base-body

Handlebars (`.hbs`) body workspace layouts (`single`, `double`, `triple`) and Monaco editor mounting runtime.

- **npm**: [https://www.npmjs.com/package/monaco-json-studio-base-body](https://www.npmjs.com/package/monaco-json-studio-base-body)
- **GitHub**: [https://github.com/keshavsoft/monaco-json-studio-base-body](https://github.com/keshavsoft/monaco-json-studio-base-body)
- **Suite Story & Docs**: [https://keshavsoft.github.io/monaco-json-studio-docs/base-body.html](https://keshavsoft.github.io/monaco-json-studio-docs/base-body.html)
- **Repo Docs**: [./docs/index.html](./docs/index.html) | [https://keshavsoft.github.io/monaco-json-studio-base-body/](https://keshavsoft.github.io/monaco-json-studio-base-body/)

## Why It Exists

Separating the body workspace from headers and footers lets a single page render 1, 2, or 3 panes under one header/footer—and opens the door for non-Monaco bodies (HTML previews, tables, diffs) in future versions.

## CLI (`npx`)

```bash
npx monaco-json-studio-base-body single
npx monaco-json-studio-base-body double
npx monaco-json-studio-base-body triple --html
```

## Programmatic (`npm`)

```js
import { renderBody, generateBodyPreview } from 'monaco-json-studio-base-body';

const html = renderBody({ layout: 'double' });
```
