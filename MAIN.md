# Pseudo DOM

Mock the DOM for server side-side DOM state and in tests.

## Status: early development (0.x)

Pseudo DOM recreates the browser DOM API (following the MDN documentation) so DOM-dependent code can run in Node, for
example in tests, without a real or headless browser. It is written in TypeScript and ships type definitions.

Working today: `EventService` (Event), `EventTargetService` (EventTarget listeners for the target itself), `NodeService`
(Node: children, siblings, `appendChild`, `removeChild`), `ElementService` / `HTMLElementService` (Element and
HTMLElement, including attributes, `NamedNodeMap`, `classList`), `AttrService`, `DOMTokenListService`,
`NamedNodeMapService`, `PseudoNodeList`, and `generateDocument` for creating a document.

Not implemented yet (these throw a "not implemented" error or are missing): event dispatch through the tree (capture,
target and bubble phases), `cloneNode`, `compareDocumentPosition`, `contains`, `insertBefore`, `isEqualNode`,
`replaceChild`, `querySelector` / `querySelectorAll`, `innerHTML` / `outerHTML` parsing, and most of the rest of the
Element and Document APIs. The API will change before 1.0.
