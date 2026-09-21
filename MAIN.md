# Pseudo DOM

Mock the DOM for server side-side DOM state and in tests.

## Status: early development (0.x)

Pseudo DOM recreates the browser DOM API (following the MDN documentation) so DOM-dependent code can run in Node, for
example in tests, without a real or headless browser. It is written in TypeScript and ships type definitions.

Working today: `EventService` (Event), `EventTargetService` (EventTarget listeners for the target itself), `NodeService`
(Node: a real tree with `parentNode`, `previousSibling` / `nextSibling`, `firstChild` / `lastChild`, `appendChild`,
`insertBefore`, `removeChild`, `replaceChild`, `contains` and `getRootNode`; nodes move when they are added somewhere
else, document fragments insert their children, and a node cannot be put inside itself), `ElementService` /
`HTMLElementService` (Element and HTMLElement, including attributes, `NamedNodeMap`, `classList`), `AttrService`,
`DOMTokenListService`, `NamedNodeMapService`, `DocumentService` / `DocumentFragmentService`, `PseudoNodeList`, and
`generateDocument` for creating a document.

Not implemented yet (these throw a "not implemented" error or are missing): event dispatch through the tree (capture,
target and bubble phases), `cloneNode`, `compareDocumentPosition`, `isEqualNode`, `querySelector` /
`querySelectorAll`, `innerHTML` / `outerHTML` parsing, and most of the rest of the Element and Document APIs. The API
will change before 1.0.
