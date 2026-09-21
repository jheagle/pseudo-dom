# Pseudo DOM

Mock the DOM for server side-side DOM state and in tests.

## Status: early development (0.x)

Pseudo DOM recreates the browser DOM API (following the MDN documentation) so DOM-dependent code can run in Node, for
example in tests, without a real or headless browser. It is written in TypeScript and ships type definitions.

Working today: `EventService` (Event) and `EventTargetService` (EventTarget), which dispatch an event through the tree the
way the DOM does (capture down from the root, the target, then bubbling back up, with `stopPropagation`,
`stopImmediatePropagation`, `once`, `passive`, `preventDefault` and the default action of the target; clicking a submit
button sends a `submit` event to its form), `NodeService`
(Node: a real tree with `parentNode`, `previousSibling` / `nextSibling`, `firstChild` / `lastChild`, `appendChild`,
`insertBefore`, `removeChild`, `replaceChild`, `contains` and `getRootNode`; nodes move when they are added somewhere
else, document fragments insert their children, and a node cannot be put inside itself), `ElementService` /
`HTMLElementService` (Element and HTMLElement, including attributes, `NamedNodeMap`, `classList`), `AttrService`,
`DOMTokenListService`, `NamedNodeMapService`, `DocumentService` / `DocumentFragmentService`, `PseudoNodeList`, and
`generateDocument` for creating a document.

Standard events: `createEvent(type, init, { browser, trusted })` makes the kind of event which suits the type (a click is a
`MouseEvent`, a keydown a `KeyboardEvent`, ...). Like the constructor in a browser it gives nothing (no bubbling, no
cancelling, not trusted) unless asked, but with `browser: true` it uses `eventDefaults`, the table of how the browser
creates each standard type (click bubbles and can be cancelled, focus does not bubble but focusin does, input bubbles
but cannot be cancelled, ...), and `trusted: true` makes `isTrusted` true, as for a real user action. The kinds of event
are `PseudoUIEvent`, `PseudoMouseEvent`, `PseudoPointerEvent`, `PseudoKeyboardEvent`, `PseudoFocusEvent`,
`PseudoInputEvent` and `PseudoCustomEvent`. Elements have `click()` (an untrusted click, like a script's),
`focus()` and `blur()` (with blur / focusout / focus / focusin and the related targets, and a focused element for each
tree), and `simulate.click(element)` / `simulate.keyPress(element, key)` send what a user's action sends (pointerdown,
mousedown, the focus moving, pointerup, mouseup, click; keydown, keyup), all trusted.

Not implemented yet (these throw a "not implemented" error or are missing): `cloneNode`, `compareDocumentPosition`, `isEqualNode`, `querySelector` /
`querySelectorAll`, `innerHTML` / `outerHTML` parsing, and most of the rest of the Element and Document APIs. The API
will change before 1.0.
