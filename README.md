# Pseudo DOM

Mock the DOM for server-side DOM state and in tests.

**Status: early development (0.x).** Pseudo DOM recreates the browser DOM API (following the MDN documentation) so
DOM-dependent code can run in Node - in tests, without a real or headless browser. It is written in TypeScript and ships
its type definitions. The API will change before 1.0.

## Install

pseudo-dom is not on npm yet, install it from GitHub:

```shell
npm install github:jheagle/pseudo-dom
```

## Example

```js
const { installGlobal, logElement } = require('pseudo-dom')
installGlobal(globalThis) // document, Node, Element, ... now exist, as in a browser

const button = document.createElement('button')
button.className = 'go'
button.textContent = 'Go'
button.addEventListener('click', () => { button.textContent = 'Went' })
document.body.appendChild(button)

button.click()
console.log(document.body.innerHTML)                        // <button class="go">Went</button>
console.log(document.querySelector('button.go') === button) // true
logElement(document.body)                                   // an indented view of the markup
```

`installGlobal()` does nothing when a real DOM is already there (a browser, or a jsdom test environment), so it is safe
to call everywhere.

## At a glance

- **Tree & events** - a real node tree with full event dispatch (capture, target, bubble) and standard event defaults
  for clicks, focus and more
- **Elements** - attributes, `classList`, a real live `style` and `dataset`, `children`, and DOM-style mutation
  (`append`, `before`, `remove`, `replaceWith`, ...)
- **Form controls** - a real `value` and `checked`
- **HTML parsing** - `innerHTML` / `outerHTML` / `insertAdjacentHTML` parse and serialize real HTML
- **Queries** - `querySelector` / `querySelectorAll` with real CSS selectors, `getElementById`, `matches`, `closest`
- **Document** - `createElement`, `createTextNode`, and `generateDocument()` to get a `window`-like object with
  `document` already on it
- **Cloning & comparison** - `cloneNode`, `isEqualNode`, `compareDocumentPosition`, `contains`
- **Simulating users** - `simulate.click(element)` and `simulate.keyPress(element, key)` send the events a real user
  action sends
- **Running headlessly** - `installGlobal()` makes code written against real DOM globals run unmodified in Node

There is no layout engine or CSS cascade: what would need one (sizes, bounding boxes, ...) is settable directly.

## Documentation

The guide, and the reference for every class, function and type, is in [`docs/`](docs/index.html) (open
`docs/index.html` in a browser). It is generated from the TypeScript source, and each module is a folder of `src/`:

| Module | What it holds |
| --- | --- |
| `services` | The classes which do the work: nodes, elements, documents, events |
| `interfaces` | The shape of each DOM object (`PseudoNode`, `PseudoElement`, ...) |
| `classes` | `PseudoHTMLDocument`, `PseudoNodeList`, ... |
| `factories` | `generateDocument`, `installGlobal`, `logElement`, `createEvent`, and the parsing and query helpers |
| `functions` | Small helpers such as `getElementById` and focus tracking |
| `simulate` | `click` and `keyPress`, which send what a real user action sends |

## Development

```shell
npm install
npm test          # the tests
npm run typecheck # the types
npm run build     # dist/, browser/ and docs/
npm run docs      # only the documentation
```
