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

`style` is a real, live `CSSStyleDeclaration`: named property access (\`el.style.backgroundColor = 'red'\`) alongside
\`getPropertyValue\` / \`setProperty\` / \`removeProperty\` / \`getPropertyPriority\` / \`cssText\`; an unset property
reads as \`''\`, like the DOM's. \`dataset\` is a live `DOMStringMap`: reading/writing/deleting a camelCase name
(\`el.dataset.fooBar\`) reads/writes/removes the matching \`data-foo-bar\` attribute directly, so it can never fall out
of sync with the attributes themselves. Both are on \`HTMLElementService\`, matching the DOM (they are not on the base
Element).

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

Nodes can be copied and compared: `cloneNode(deep)` copies an element with its attributes (objects such as `style` are
copied too, not shared) and, when deep, everything below it, without the parent or the event listeners; `isEqualNode`
compares two nodes by what they hold (tag, attributes in any order, text and children in order);
`compareDocumentPosition` says where another node is (`NodeService.DOCUMENT_POSITION_*`); `isConnected` is true when the
tree has a document at the top and `ownerDocument` says which one made the node; `normalize` joins neighbouring text
nodes. There are text and comment nodes (`PseudoText`, `PseudoComment`) and `textContent` works like the DOM's (the text
of everything below, and setting it replaces the children with a text node); the document makes them with
`createTextNode`, `createComment` and `createDocumentFragment`.

Elements can be walked and changed like the DOM: \`children\` is a live \`HTMLCollection\` of just the element
children, \`childElementCount\`, \`firstElementChild\` / \`lastElementChild\` and \`nextElementSibling\` /
\`previousElementSibling\` skip text and comment nodes. \`append\` / \`prepend\` / \`before\` / \`after\` / \`remove\` /
\`replaceWith\` / \`replaceChildren\` accept nodes or strings (a string becomes a text node) and move a node already in
a tree rather than duplicating it; \`insertAdjacentElement\` / \`insertAdjacentText\` insert at beforebegin / afterbegin
/ beforeend / afterend (\`insertAdjacentHTML\` is not implemented, no HTML parsing yet).

Selector queries work like the DOM's: \`getElementsByTagName\` / \`getElementsByClassName\` (live, on any node) and
\`querySelector\` / \`querySelectorAll\` (real CSS selectors, via [css-select](https://www.npmjs.com/package/css-select)
matched against pseudo-dom's own tree through a custom adapter - \`querySelectorAll\` is a plain array, a snapshot
taken when it is called, like the DOM's) are on \`NodeService\` so \`Document\`, \`DocumentFragment\` and \`Element\`
all have them; \`matches\` / \`closest\` are on \`ElementService\`; \`getElementById\` is on both \`DocumentService\`
and \`DocumentFragmentService\` (the DOM's \`NonElementParentNode\` mixin, so a \`ShadowRoot\` gets it too), matching
the real DOM.

\`DocumentService\` matches the real \`Document\` (it is not an \`Element\`, so it has no \`tagName\` / \`classList\` /
\`matches\` / etc.): \`createElement\`, \`createTextNode\`, \`createComment\`, \`createDocumentFragment\`,
\`getElementById\`, and \`textContent\` always \`null\`. \`PseudoHTMLDocument\` (what \`generateDocument\` actually
creates) only adds the \`html\` / \`head\` / \`body\` structure on top.

Not implemented yet (these throw a "not implemented" error or are missing): \`getElementsByTagNameNS\`, \`innerHTML\` /
\`outerHTML\` parsing, and most of the rest of the Element and Document APIs. The API will change before 1.0.
