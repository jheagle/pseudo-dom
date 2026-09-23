# Pseudo DOM

Mock the DOM for server-side DOM state and in tests.

## Status: early development (0.x)

Pseudo DOM recreates the browser DOM API (following the MDN documentation) so DOM-dependent code can run in Node -
in tests, without a real or headless browser. It's written in TypeScript and ships type definitions. The API will
change before 1.0.

## At a glance

- **Tree & events** - a real node tree with full event dispatch (capture → target → bubble) and standard event
  defaults for clicks, focus and more
- **Elements** - attributes, `classList`, a real live `style` and `dataset`, `children`, and DOM-style mutation
  (`append`, `before`, `remove`, `replaceWith`, ...)
- **HTML parsing** - `innerHTML` / `outerHTML` / `insertAdjacentHTML` parse and serialize real HTML
- **Queries** - `querySelector` / `querySelectorAll` with real CSS selectors, `getElementById`, `matches`, `closest`
- **Document** - `createElement`, `createTextNode`, and `generateDocument()` to get a `window`-like object with
  `document` already on it
- **Cloning & comparison** - `cloneNode`, `isEqualNode`, `compareDocumentPosition`, `contains`
- **Running headlessly** - `installGlobal()` makes code written against real DOM globals (`document.createElement`,
  ...) run unmodified in Node; `logElement()` prints a readable, indented view of an element to the console

Everything below goes into more detail, section by section.

## Tree, nodes & events

A real tree: `parentNode`, `previousSibling` / `nextSibling`, `firstChild` / `lastChild`, `appendChild`,
`insertBefore`, `removeChild`, `replaceChild`, `contains`, `getRootNode`. Nodes move when they're added somewhere
else, document fragments insert their children instead of themselves, and a node can't be put inside itself.

`EventService` / `EventTargetService` dispatch an event through the tree the way the DOM does:

- Capture down from the root, hit the target, then bubble back up
- `stopPropagation`, `stopImmediatePropagation`, `once`, `passive`, `preventDefault`, and the target's default action
  (clicking a submit button sends a `submit` event to its form)
- `createEvent(type, init, { browser, trusted })` makes the kind of event that suits the type (a click is a
  `MouseEvent`, a keydown a `KeyboardEvent`, ...). Like a real constructor, it gives nothing (no bubbling, no
  cancelling, not trusted) unless asked - but `browser: true` applies `eventDefaults`, the table of how a browser
  creates each standard type (click bubbles and can be cancelled; focus doesn't bubble but focusin does; input
  bubbles but can't be cancelled; ...), and `trusted: true` makes `isTrusted` true, as for a real user action
- The event kinds: `PseudoUIEvent`, `PseudoMouseEvent`, `PseudoPointerEvent`, `PseudoKeyboardEvent`,
  `PseudoFocusEvent`, `PseudoInputEvent`, `PseudoCustomEvent`
- Elements have `click()` (an untrusted click, like a script's) and `focus()` / `blur()` (blur/focusout/focus/focusin
  and the related targets, with a focused element tracked per tree)
- `simulate.click(element)` / `simulate.keyPress(element, key)` send what a real user action sends - pointerdown,
  mousedown, the focus moving, pointerup, mouseup, click; keydown, keyup - all trusted

## Elements

`ElementService` / `HTMLElementService` cover `Element` and `HTMLElement`: attributes, `NamedNodeMap`, `classList`.
`AttrService`, `DOMTokenListService` and `NamedNodeMapService` back them.

**Attribute helpers** work like the DOM's: `getAttributeNames`, `hasAttributes`, `toggleAttribute(name, [force])`.
`localName` matches `tagName` and `prefix` is always `null` (there's no real namespace parsing);
`getElementsByTagNameNS` behaves exactly like `getElementsByTagName`, ignoring the namespace.

**`style`** is a real, live `CSSStyleDeclaration`:

- Named property access (`el.style.backgroundColor = 'red'`) alongside `getPropertyValue` / `setProperty` /
  `removeProperty` / `getPropertyPriority` / `cssText`
- An unset property reads as `''`, like the DOM's

**`dataset`** is a live `DOMStringMap`: reading/writing/deleting a camelCase name (`el.dataset.fooBar`)
reads/writes/removes the matching `data-foo-bar` attribute directly, so it can never fall out of sync with the
attributes themselves.

*(`style` and `dataset` are both on `HTMLElementService`, matching the DOM - they're not on the base `Element`.)*

**Traversal & mutation** work like the DOM's:

- `children` is a live `HTMLCollection` of just the element children; `childElementCount`, `firstElementChild` /
  `lastElementChild` and `nextElementSibling` / `previousElementSibling` skip text and comment nodes
- `append` / `prepend` / `before` / `after` / `remove` / `replaceWith` / `replaceChildren` accept nodes or strings (a
  string becomes a text node), and move a node already in a tree rather than duplicating it
- `insertAdjacentElement` / `insertAdjacentText` / `insertAdjacentHTML` insert at beforebegin / afterbegin /
  beforeend / afterend

**`attachShadow({mode})`** attaches a real (`DocumentFragmentService`-based) `ShadowRoot`, with `host` and `mode`
set. `element.shadowRoot` reaches it when the mode is `'open'`, like the DOM's (a `'closed'` one still exists, just
not reachable this way); attaching a second one throws.

### HTML parsing

`innerHTML` / `outerHTML` / `insertAdjacentHTML` parse and serialize real HTML, via
[htmlparser2](https://www.npmjs.com/package/htmlparser2) (a SAX-style tokenizer - pseudo-dom builds its own nodes
from its events, the same way it builds matches from `css-select`).

- Entities decode, and void elements (`br`, `img`, ...) auto-close
- `class` / `style` attributes populate `className` / `classList` and `style` for real, not just a generic attribute
- The setters (`innerHTML =`, `outerHTML =`) and `insertAdjacentHTML` are on `HTMLElementService` (building new
  elements needs a concrete element class); `ElementService` only has the getters, since serializing doesn't

### Layout (mocked, not computed)

There's no layout engine, so anything that would need one is **settable directly** rather than really computed - set
the value a test needs, and the getter/method returns it:

- `clientWidth` / `clientHeight` / `clientTop` / `clientLeft` / `scrollWidth` / `scrollHeight` (plain numbers,
  alongside the existing `offsetWidth` etc.)
- `boundingClientRect` backs `getBoundingClientRect()`, `clientRects` backs `getClientRects()`, `animations` backs
  `getAnimations()`, `isVisible` backs `checkVisibility()`

A few things in this group are genuinely real, not mocked:

- `scrollLeft` / `scrollTop` are plain settable numbers, and `scroll` / `scrollTo` / `scrollBy` (a number pair or an
  options object) update them for real; `scrollIntoView` is a callable no-op (there's no viewport to scroll within)
- `hasPointerCapture` / `setPointerCapture` / `releasePointerCapture` genuinely track capture per pointer id
- `requestFullscreen` / `requestPointerLock` resolve, like a browser granting the request would
- `computedStyleMap()` is a thin read-only view of the element's own inline style (there's no CSS cascade)

## Queries

`getElementsByTagName` / `getElementsByClassName` (live, on any node) and `querySelector` / `querySelectorAll` (real
CSS selectors, via [css-select](https://www.npmjs.com/package/css-select) matched against pseudo-dom's own tree
through a custom adapter) are on `NodeService`, so `Document`, `DocumentFragment` and `Element` all have them.
`querySelectorAll` returns a plain array - a snapshot taken when it's called, like the DOM's.

`matches` / `closest` are on `ElementService`. `getElementById` is on both `DocumentService` and
`DocumentFragmentService` (the DOM's `NonElementParentNode` mixin, so a `ShadowRoot` gets it too).

## Document

`DocumentService` matches the real `Document` - it's not an `Element`, so it has no `tagName` / `classList` /
`matches` / etc:

- `createElement`, `createTextNode`, `createComment`, `createDocumentFragment`
- `getElementById`
- `textContent` is always `null`

`DocumentFragmentService` is the plain `DocumentFragment`. `PseudoHTMLDocument` - what `generateDocument()` actually
creates - only adds the `html` / `head` / `body` structure on top of `DocumentService`. `PseudoNodeList` backs
`childNodes`.

## Running headlessly

Code written against a real DOM's globals (`document.createElement`, `new Node()`, ...) can run unmodified in Node,
without an `if (typeof document === 'undefined')` check at every call site:

```js
if (typeof document === 'undefined') {
  require('pseudo-dom').installGlobal(globalThis)
}
```

`installGlobal(target = globalThis)` fills in `document` / `Node` / `Element` / `HTMLElement` on `target`, using
[browser-or-node](https://www.npmjs.com/package/browser-or-node) to check whether a real DOM (a real browser, or a
jsdom-based test environment) is already there first - it's always safe to call, everywhere: it does nothing when
one is.

There's no real rendering to look at, so `logElement(node, [label])` prints a readable, indented view of a node's
markup to the console (`prettyPrint(node, [indent])`, from the same module, returns the string instead of printing
it) - useful for watching pseudo-dom-driven code run, or checking a final result, from a terminal.

## Cloning, comparison & connection

- `cloneNode(deep)` copies an element with its attributes (objects such as `style` are copied too, not shared) and,
  when deep, everything below it - without the parent or the event listeners
- `isEqualNode` compares two nodes by what they hold (tag, attributes in any order, text and children in order)
- `compareDocumentPosition` says where another node is (`NodeService.DOCUMENT_POSITION_*`)
- `isConnected` is true when the tree has a document at the top; `ownerDocument` says which one made the node
- `normalize` joins neighbouring text nodes
- There are text and comment nodes (`PseudoText`, `PseudoComment`); `textContent` works like the DOM's (the text of
  everything below, and setting it replaces the children with a text node)

## Not implemented yet

- The `aria*` reflected properties
- The `Attr`-node / namespaced attribute methods (`getAttributeNode`, `getAttributeNS`, ...)
