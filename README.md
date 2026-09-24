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
`getElementsByTagNameNS` behaves exactly like `getElementsByTagName`, ignoring the namespace. All 37 `aria*`
reflected properties (`ariaLabel`, `ariaExpanded`, `ariaValueNow`, ...) are real too - each just reads/writes its
matching `aria-*` attribute (`ariaLabel` <-> `aria-label`; the mapping isn't camelCase-to-kebab-case, so
`ariaColCount` <-> `aria-colcount`, not `aria-col-count`).

`getAttributeNode` / `setAttributeNode` / `removeAttributeNode` give and take real `Attr` nodes (backed by
`AttrService`) instead of plain strings - `setAttributeNode` returns whatever `Attr` previously held that name (or
`null` when it's new), and `removeAttributeNode` throws when the element has no attribute matching the one given, like
the DOM's. Every `*NS` method (`getAttributeNS`, `hasAttributeNS`, `setAttributeNS`, `removeAttributeNS`,
`getAttributeNodeNS`, `setAttributeNodeNS`) behaves exactly like its non-NS counterpart, ignoring the namespace
argument entirely - there's no real namespace parsing here, matching `getElementsByTagNameNS`.

**Form controls** have a real `value` (`input`, `textarea`, `select`, `button`, `option`, `output`) and `checked`
(`input`). Like the DOM's, they start from the `value` / `checked` attributes (a checkbox with no `value` reads
`'on'`), and once set they stop following the attribute - setting them never changes the attribute. `value` is always
a string, so `parseInt(input.value)` works on a number attribute. `cloneNode` keeps the current value and checkedness.

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

`installGlobal(target = globalThis)` fills in `document` / `Node` / `Element` / `HTMLElement` / `HTMLDocument` /
`window` (a self-reference, like a real browser's) on `target`, using
[browser-or-node](https://www.npmjs.com/package/browser-or-node) to check whether a real DOM (a real browser, or a
jsdom-based test environment) is already there first - it's always safe to call, everywhere: it does nothing when
one is. `Node` / `Element` / `HTMLElement` / `HTMLDocument` are the classes themselves (not instances), so
`x instanceof Element` works, matching the real DOM's.

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

## Modules

<dl>
<dt><a href="#module_pseudoDom/simulate">pseudoDom/simulate</a></dt>
<dd><p>Simulate what a user does, with the events the browser sends for it.</p>
</dd>
<dt><a href="#module_pseudoDom/objects">pseudoDom/objects</a> : <code>Object</code></dt>
<dd><p>All methods exported from this module are encapsulated within pseudoDom.</p>
</dd>
</dl>

## Classes

<dl>
<dt><a href="#UIEventService">UIEventService</a> ⇐ <code><a href="#EventService">EventService</a></code></dt>
<dd><p>Simulate the behaviour of the UIEvent Class when there is no DOM available: the events which come from a user
interface (the mouse, the keyboard, focus and input).</p>
</dd>
<dt><a href="#ShadowRootService">ShadowRootService</a> ⇐ <code><a href="#DocumentFragmentService">DocumentFragmentService</a></code></dt>
<dd><p>Simulate the behaviour of the ShadowRoot Class when there is no DOM available: a DocumentFragment attached to an
element via attachShadow, which sets host and mode.</p>
</dd>
<dt><a href="#PointerEventService">PointerEventService</a> ⇐ <code><a href="#MouseEventService">MouseEventService</a></code></dt>
<dd><p>Simulate the behaviour of the PointerEvent Class when there is no DOM available.</p>
</dd>
<dt><a href="#NodeService">NodeService</a> ⇐ <code>PseudoEventTarget</code></dt>
<dd><p>Simulate the behaviour of the Node Class when there is no DOM available.</p>
</dd>
<dt><a href="#TextService">TextService</a> ⇐ <code><a href="#NodeService">NodeService</a></code></dt>
<dd><p>Simulate the behaviour of the Text Class when there is no DOM available: the text in an element.</p>
</dd>
<dt><a href="#CommentService">CommentService</a> ⇐ <code><a href="#NodeService">NodeService</a></code></dt>
<dd><p>Simulate the behaviour of the Comment Class when there is no DOM available: a note in the markup which is not shown.</p>
</dd>
<dt><a href="#NamedNodeMapService">NamedNodeMapService</a></dt>
<dd><p>Simulate the behaviour of the NamedNodeMap Class when there is no DOM available.</p>
</dd>
<dt><a href="#MouseEventService">MouseEventService</a> ⇐ <code><a href="#UIEventService">UIEventService</a></code></dt>
<dd><p>Simulate the behaviour of the MouseEvent Class when there is no DOM available.</p>
</dd>
<dt><a href="#KeyboardEventService">KeyboardEventService</a> ⇐ <code><a href="#UIEventService">UIEventService</a></code></dt>
<dd><p>Simulate the behaviour of the KeyboardEvent Class when there is no DOM available.</p>
</dd>
<dt><a href="#InputEventService">InputEventService</a> ⇐ <code><a href="#UIEventService">UIEventService</a></code></dt>
<dd><p>Simulate the behaviour of the InputEvent Class when there is no DOM available.</p>
</dd>
<dt><a href="#HTMLElementService">HTMLElementService</a> ⇐ <code>PseudoElement</code></dt>
<dd><p>Simulate the behaviour of the HTMLElement Class when there is no DOM available.</p>
</dd>
<dt><a href="#HTMLCollectionService">HTMLCollectionService</a></dt>
<dd><p>Simulate the behaviour of the HTMLCollection Class when there is no DOM available: a live view of some of a node&#39;s
element descendants, recomputed each time it is used rather than kept in sync as they change.</p>
</dd>
<dt><a href="#FocusEventService">FocusEventService</a> ⇐ <code><a href="#UIEventService">UIEventService</a></code></dt>
<dd><p>Simulate the behaviour of the FocusEvent Class when there is no DOM available.</p>
</dd>
<dt><a href="#EventTargetService">EventTargetService</a></dt>
<dd><p>Simulate the behaviour of the EventTarget Class when there is no DOM available.
Dispatching an event sends it through the tree the way the DOM does: down from the root to the target (capture
listeners), to the target itself, then back up to the root (the listeners which are not capture listeners, when the
event bubbles).</p>
</dd>
<dt><a href="#EventService">EventService</a></dt>
<dd><p>Simulate the behaviour of the Event Class when there is no DOM available.</p>
</dd>
<dt><a href="#ElementService">ElementService</a> ⇐ <code>PseudoNode</code></dt>
<dd><p>Simulate the behaviour of the Element Class when there is no DOM available.</p>
</dd>
<dt><a href="#DocumentService">DocumentService</a> ⇐ <code><a href="#NodeService">NodeService</a></code></dt>
<dd><p>Simulate the behaviour of the Document Class when there is no DOM available.</p>
</dd>
<dt><a href="#DocumentFragmentService">DocumentFragmentService</a> ⇐ <code><a href="#NodeService">NodeService</a></code></dt>
<dd><p>Simulate the behaviour of the DocumentFragment Class when there is no DOM available: a container for nodes which is
not part of a tree, when it is inserted its children are moved into the tree instead.</p>
</dd>
<dt><a href="#DOMTokenListService">DOMTokenListService</a></dt>
<dd><p>Simulate the behaviour of the DOMTokenList Class when there is no DOM available.</p>
</dd>
<dt><a href="#CustomEventService">CustomEventService</a> ⇐ <code><a href="#EventService">EventService</a></code></dt>
<dd><p>Simulate the behaviour of the CustomEvent Class when there is no DOM available: an event which carries data.</p>
</dd>
<dt><a href="#CSSStyleDeclarationService">CSSStyleDeclarationService</a></dt>
<dd><p>Simulate the behaviour of the CSSStyleDeclaration Class when there is no DOM available: an ordered map of CSS
property/value pairs, parsed from and serialized back to a cssText string. Values are stored and returned as
given, with no unit conversion, shorthand expansion or validation - this is a data structure, not a real CSS
engine. Named property access (declaration.backgroundColor, camelCase) is added on top of this by
createStyleDeclaration, which wraps an instance of this class in a Proxy.</p>
</dd>
<dt><a href="#AttrService">AttrService</a> ⇐ <code><a href="#NodeService">NodeService</a></code></dt>
<dd><p>Simulate the behaviour of the Attr Class when there is no DOM available.</p>
</dd>
<dt><a href="#PseudoNodeList">PseudoNodeList</a> ⇐ <code>LinkedTreeList</code></dt>
<dd><p>A NodeList, like the DOM one, iterates over the nodes themselves (the data stored in each TreeLinker), rather than
the linkers that hold them.</p>
</dd>
<dt><a href="#PseudoHTMLDocument">PseudoHTMLDocument</a> ⇐ <code><a href="#DocumentService">DocumentService</a></code></dt>
<dd><p>Simulate the behaviour of the HTMLDocument Class when there is no DOM available. Like the real HTMLDocument, this
only adds the html/head/body structure on top of what Document already gives (createElement, createTextNode,
createComment, createDocumentFragment, getElementById, textContent always null).</p>
</dd>
<dt><a href="#PseudoEventListener">PseudoEventListener</a></dt>
<dd><p>Handle events as they are stored and implemented.</p>
</dd>
</dl>

## Members

<dl>
<dt><a href="#eventDefaults">eventDefaults</a> : <code>Object.&lt;string, EventDefinition&gt;</code></dt>
<dd><p>The events which the browser itself creates (for a user action, or for something like element.click()) have these
options. A script which creates an event with the constructor gets none of them (everything is false) unless it asks
for them, which is why createEvent only uses this table when it is told the browser is creating the event.
The values follow the UI Events, HTML, Pointer Events, Clipboard, Drag and Drop, Touch and CSS specifications.</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#focused">focused</a></dt>
<dd><p>The element which has the focus, kept for each tree (the root node of the tree it is in), like document.activeElement.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#modifierKeys">modifierKeys([init])</a> ⇒ <code>ModifierKeys</code></dt>
<dd><p>Pick the modifier keys out of the init object of an event.</p>
</dd>
<dt><a href="#modifierState">modifierState(keys, key)</a> ⇒ <code>boolean</code></dt>
<dd><p>Answer getModifierState for a set of held modifier keys.</p>
</dd>
<dt><a href="#getParentNodesFromAttribute">getParentNodesFromAttribute(attr, value, node)</a> ⇒ <code>Array.&lt;PseudoNode&gt;</code></dt>
<dd><p>A selector function for retrieving existing parent PseudoNode from the given child item.
This function will check all the parents starting from node, and scan the attributes
property for matches. The return array contains all matching parent ancestors, starting with the root of the tree.</p>
</dd>
<dt><a href="#getParentNodes">getParentNodes(node)</a> ⇒ <code>Array.&lt;PseudoNode&gt;</code></dt>
<dd><p>Get all of the ancestors of a node, starting with the root of the tree and ending with the node&#39;s own parent (the
order in which an event travels down through them). A node which has no parent has no ancestors.</p>
</dd>
<dt><a href="#getActiveElement">getActiveElement(root)</a> ⇒ <code>Object</code> | <code>null</code></dt>
<dd><p>Find the element which has the focus in a tree.</p>
</dd>
<dt><a href="#setActiveElement">setActiveElement(root, element)</a></dt>
<dd><p>Remember the element which has the focus in a tree.</p>
</dd>
<dt><a href="#escapeText">escapeText(text)</a> ⇒ <code>string</code></dt>
<dd><p>Escape text so it is safe inside HTML text content. Coerces to a string first - unlike a real DOM, pseudo-dom&#39;s
setAttribute does not itself coerce (see the same note on escapeAttributeValue), and nodeValue is not guaranteed
to be a string either.</p>
</dd>
<dt><a href="#escapeAttributeValue">escapeAttributeValue(value)</a> ⇒ <code>string</code></dt>
<dd><p>Escape a value so it is safe inside a double-quoted HTML attribute. Coerces to a string first: a real DOM&#39;s
setAttribute always stores a string, however pseudo-dom&#39;s does not coerce what it is given, so a value set via
setAttribute(name, 5) is stored (and read back by getAttribute) as the number 5, not the string &#39;5&#39;.</p>
</dd>
<dt><a href="#serializeAttributes">serializeAttributes(element)</a> ⇒ <code>string</code></dt>
<dd><p>Every attribute of the element, serialized (class instead of className, boolean attributes bare, the never-real
mock properties left out, style added from the live CSSStyleDeclaration when it is not empty).</p>
</dd>
<dt><a href="#serializeNode">serializeNode(node)</a> ⇒ <code>string</code></dt>
<dd><p>One node, serialized (its own markup only - see serializeChildren for its descendants too).</p>
</dd>
<dt><a href="#prettyPrintNode">prettyPrintNode(node, depth, indent)</a> ⇒ <code>string</code></dt>
<dd><p>One node, indented for readability (see prettyPrint) - unlike serializeNode, every non-empty node is its own
line, so the structure of a whole tree is easy to read at a glance.</p>
</dd>
<dt><a href="#generateNodeList">generateNodeList([innerList])</a> ⇒ <code><a href="#PseudoNodeList">PseudoNodeList</a></code></dt>
<dd><p>Create a PseudoNodeList, optionally starting from an existing chain of linkers.</p>
</dd>
<dt><a href="#generateDocument">generateDocument(root, context)</a> ⇒ <code>Window</code> | <code>PseudoEventTarget</code></dt>
<dd><p>Construct the Pseudo Dom to provide access to Dom objects which are otherwise not available outside the browser
context.</p>
</dd>
<dt><a href="#nearestElementSibling">nearestElementSibling(node, direction)</a> ⇒ <code>*</code> | <code>null</code></dt>
<dd><p>Walk up from a node (not including it) to find the nearest element, in the given direction.</p>
</dd>
<dt><a href="#kebabToCamel">kebabToCamel(name)</a> ⇒ <code>string</code></dt>
<dd><p>kebab-case -&gt; camelCase (&quot;background-color&quot; -&gt; &quot;backgroundColor&quot;).</p>
</dd>
<dt><a href="#camelToKebab">camelToKebab(name)</a> ⇒ <code>string</code></dt>
<dd><p>camelCase -&gt; kebab-case (&quot;backgroundColor&quot; -&gt; &quot;background-color&quot;).</p>
</dd>
<dt><a href="#createEvent">createEvent(type, [init], [options])</a> ⇒ <code><a href="#EventService">EventService</a></code></dt>
<dd><p>Create an event of the kind which suits its type (a click is a MouseEvent, a keydown a KeyboardEvent, ...).
By default this is like using the constructor of the event in a script: nothing bubbles or can be cancelled unless
the init says so, and the event is not trusted. With browser: true the event is created the way the browser creates
it, using the standard options for its type (see eventDefaults), and trusted: true makes it look like it came from a
real user action (isTrusted).</p>
</dd>
<dt><a href="#dataAttributes">dataAttributes(element)</a> ⇒ <code>Array.&lt;Array.&lt;string&gt;&gt;</code></dt>
<dd><p>Every data-* attribute name currently on the element, as [attributeName, camelCaseName] pairs.</p>
</dd>
</dl>

<a name="module_pseudoDom/simulate"></a>

## pseudoDom/simulate
Simulate what a user does, with the events the browser sends for it.

**Version**: 1.0.0  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  

* [pseudoDom/simulate](#module_pseudoDom/simulate)
    * [~focusableFrom(element)](#module_pseudoDom/simulate..focusableFrom) ⇒ <code>\*</code> \| <code>null</code>
    * [~click(element, [init])](#module_pseudoDom/simulate..click) ⇒ <code>boolean</code>
    * [~keyPress(element, key, [init])](#module_pseudoDom/simulate..keyPress) ⇒ <code>boolean</code>

<a name="module_pseudoDom/simulate..focusableFrom"></a>

### pseudoDom/simulate~focusableFrom(element) ⇒ <code>\*</code> \| <code>null</code>
The nearest element (starting with the element itself) which can have the focus.

**Kind**: inner method of [<code>pseudoDom/simulate</code>](#module_pseudoDom/simulate)  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>\*</code> | Where to start |

<a name="module_pseudoDom/simulate..click"></a>

### pseudoDom/simulate~click(element, [init]) ⇒ <code>boolean</code>
Click an element the way a user does: pointerdown and mousedown, then the focus moves to the nearest element which
can have it (or is taken away from the one which had it) unless mousedown was cancelled, then pointerup, mouseup
and finally click. Every event is trusted and has the options the browser gives it. A disabled element gets nothing.

**Kind**: inner method of [<code>pseudoDom/simulate</code>](#module_pseudoDom/simulate)  
**Returns**: <code>boolean</code> - False when the click was cancelled (or the element is disabled), so its default action did not happen  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| element | <code>\*</code> |  | The element to click |
| [init] | <code>Object</code> | <code>{}</code> | Options for the events (for example clientX, clientY, shiftKey) |

<a name="module_pseudoDom/simulate..keyPress"></a>

### pseudoDom/simulate~keyPress(element, key, [init]) ⇒ <code>boolean</code>
Press and release a key on an element (the element which has the focus, or one given): keydown and then keyup.

**Kind**: inner method of [<code>pseudoDom/simulate</code>](#module_pseudoDom/simulate)  
**Returns**: <code>boolean</code> - False when keydown was cancelled, so its default action did not happen  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| element | <code>\*</code> |  | The element which gets the key |
| key | <code>string</code> |  | The value of the key, such as a or Enter |
| [init] | <code>Object</code> | <code>{}</code> | Options for the events (for example code, shiftKey) |

<a name="module_pseudoDom/objects"></a>

## pseudoDom/objects : <code>Object</code>
All methods exported from this module are encapsulated within pseudoDom.

**Author**: Joshua Heagle <joshuaheagle@gmail.com>  
<a name="UIEventService"></a>

## UIEventService ⇐ [<code>EventService</code>](#EventService)
Simulate the behaviour of the UIEvent Class when there is no DOM available: the events which come from a user
interface (the mouse, the keyboard, focus and input).

**Kind**: global class  
**Extends**: [<code>EventService</code>](#EventService)  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  
**Properties**

| Name | Type |
| --- | --- |
| detail | <code>number</code> | 
| view | <code>\*</code> | 


* [UIEventService](#UIEventService) ⇐ [<code>EventService</code>](#EventService)
    * [new UIEventService([typeArg], [init])](#new_UIEventService_new)
    * [.inner](#EventService+inner) ⇒ <code>EventInner</code>
    * [.composedPath()](#EventService+composedPath) ⇒ <code>Array.&lt;PseudoEventTarget&gt;</code>
    * [.preventDefault()](#EventService+preventDefault) ⇒ <code>null</code>
    * [.stopImmediatePropagation()](#EventService+stopImmediatePropagation) ⇒ <code>null</code>
    * [.stopPropagation()](#EventService+stopPropagation) ⇒ <code>null</code>

<a name="new_UIEventService_new"></a>

### new UIEventService([typeArg], [init])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [typeArg] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | The type of the event |
| [init] | <code>UIEventInit</code> | <code>{}</code> | The options for the event |

<a name="EventService+inner"></a>

### uiEventService.inner ⇒ <code>EventInner</code>
Scope several accessors inside the inner object. These are only intended for usage by other DOM classes.

**Kind**: instance property of [<code>UIEventService</code>](#UIEventService)  
**Overrides**: [<code>inner</code>](#EventService+inner)  
<a name="EventService+composedPath"></a>

### uiEventService.composedPath() ⇒ <code>Array.&lt;PseudoEventTarget&gt;</code>
Return an array of targets that will have the event executed open them. The order is based on the eventPhase

**Kind**: instance method of [<code>UIEventService</code>](#UIEventService)  
**Overrides**: [<code>composedPath</code>](#EventService+composedPath)  
<a name="EventService+preventDefault"></a>

### uiEventService.preventDefault() ⇒ <code>null</code>
Cancels the event (if it is cancelable).

**Kind**: instance method of [<code>UIEventService</code>](#UIEventService)  
**Overrides**: [<code>preventDefault</code>](#EventService+preventDefault)  
<a name="EventService+stopImmediatePropagation"></a>

### uiEventService.stopImmediatePropagation() ⇒ <code>null</code>
For this particular event, no other listener will be called.
Neither those attached on the same element, nor those attached on elements which will be traversed later (in
capture phase, for instance)

**Kind**: instance method of [<code>UIEventService</code>](#UIEventService)  
**Overrides**: [<code>stopImmediatePropagation</code>](#EventService+stopImmediatePropagation)  
<a name="EventService+stopPropagation"></a>

### uiEventService.stopPropagation() ⇒ <code>null</code>
Stops the propagation of events further along in the Dom.

**Kind**: instance method of [<code>UIEventService</code>](#UIEventService)  
**Overrides**: [<code>stopPropagation</code>](#EventService+stopPropagation)  
<a name="ShadowRootService"></a>

## ShadowRootService ⇐ [<code>DocumentFragmentService</code>](#DocumentFragmentService)
Simulate the behaviour of the ShadowRoot Class when there is no DOM available: a DocumentFragment attached to an
element via attachShadow, which sets host and mode.

**Kind**: global class  
**Extends**: [<code>DocumentFragmentService</code>](#DocumentFragmentService)  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  

* [ShadowRootService](#ShadowRootService) ⇐ [<code>DocumentFragmentService</code>](#DocumentFragmentService)
    * [.host](#ShadowRootService+host)
    * [.mode](#ShadowRootService+mode)
    * [.acceptsChildren](#NodeService+acceptsChildren) ⇒ <code>boolean</code>
    * [.getElementById(id)](#DocumentFragmentService+getElementById) ⇒ <code>PseudoElement</code> \| <code>null</code>
    * [.appendChild(childNode)](#NodeService+appendChild) ⇒ <code>PseudoNode</code>
    * [.cloneShallow()](#NodeService+cloneShallow) ⇒ [<code>NodeService</code>](#NodeService)
    * [.equalsShallow(other)](#NodeService+equalsShallow) ⇒ <code>boolean</code>
    * [.append(...nodes)](#NodeService+append)
    * [.prepend(...nodes)](#NodeService+prepend)
    * [.replaceChildren(...nodes)](#NodeService+replaceChildren)
    * [.before(...nodes)](#NodeService+before)
    * [.after(...nodes)](#NodeService+after)
    * [.replaceWith(...nodes)](#NodeService+replaceWith)
    * [.remove()](#NodeService+remove)
    * [.toChildNode(value)](#NodeService+toChildNode) ⇒ <code>PseudoNode</code>
    * [.getElementsByTagName(tagName)](#NodeService+getElementsByTagName) ⇒ <code>PseudoHTMLCollection</code>
    * [.getElementsByClassName(className)](#NodeService+getElementsByClassName) ⇒ <code>PseudoHTMLCollection</code>
    * [.getElementsByTagNameNS(namespace, tagName)](#NodeService+getElementsByTagNameNS) ⇒ <code>PseudoHTMLCollection</code>
    * [.querySelector(selectors)](#NodeService+querySelector) ⇒ <code>PseudoElement</code> \| <code>null</code>
    * [.querySelectorAll(selectors)](#NodeService+querySelectorAll) ⇒ <code>Array.&lt;PseudoElement&gt;</code>
    * [.childInserted(child)](#NodeService+childInserted)
    * [.cloneNode([deep])](#NodeService+cloneNode) ⇒ <code>PseudoNode</code>
    * [.compareDocumentPosition(otherNode)](#NodeService+compareDocumentPosition) ⇒ <code>number</code>
    * [.contains(otherNode)](#NodeService+contains) ⇒ <code>boolean</code>
    * [.insertBefore(newNode, [referenceNode])](#NodeService+insertBefore) ⇒ <code>PseudoNode</code>
    * [.isEqualNode(otherNode)](#NodeService+isEqualNode) ⇒ <code>boolean</code>
    * [.normalize()](#NodeService+normalize)
    * [.removeChild(childElement)](#NodeService+removeChild) ⇒ <code>PseudoNode</code>
    * [.replaceChild(newChild, oldChild)](#NodeService+replaceChild) ⇒ <code>PseudoNode</code>

<a name="ShadowRootService+host"></a>

### shadowRootService.host
The element this shadow root is attached to. Set by attachShadow.

**Kind**: instance property of [<code>ShadowRootService</code>](#ShadowRootService)  
<a name="ShadowRootService+mode"></a>

### shadowRootService.mode
'open' (reachable via element.shadowRoot) or 'closed' (not). Set by attachShadow.

**Kind**: instance property of [<code>ShadowRootService</code>](#ShadowRootService)  
<a name="NodeService+acceptsChildren"></a>

### shadowRootService.acceptsChildren ⇒ <code>boolean</code>
Whether this kind of node can have children (text, comments and attributes cannot).

**Kind**: instance property of [<code>ShadowRootService</code>](#ShadowRootService)  
**Overrides**: [<code>acceptsChildren</code>](#NodeService+acceptsChildren)  
<a name="DocumentFragmentService+getElementById"></a>

### shadowRootService.getElementById(id) ⇒ <code>PseudoElement</code> \| <code>null</code>
The first element, in tree order, whose id matches the given value, or null when there is none (the DOM's
NonElementParentNode mixin, which Document and DocumentFragment both implement).

**Kind**: instance method of [<code>ShadowRootService</code>](#ShadowRootService)  
**Overrides**: [<code>getElementById</code>](#DocumentFragmentService+getElementById)  

| Param | Type |
| --- | --- |
| id | <code>string</code> | 

<a name="NodeService+appendChild"></a>

### shadowRootService.appendChild(childNode) ⇒ <code>PseudoNode</code>
Add a node as the last child of this node (a node which is already in a tree is moved).

**Kind**: instance method of [<code>ShadowRootService</code>](#ShadowRootService)  
**Overrides**: [<code>appendChild</code>](#NodeService+appendChild)  
**Returns**: <code>PseudoNode</code> - The added node  

| Param | Type | Description |
| --- | --- | --- |
| childNode | <code>PseudoNode</code> | The node to add |

<a name="NodeService+cloneShallow"></a>

### shadowRootService.cloneShallow() ⇒ [<code>NodeService</code>](#NodeService)
Make a copy of this node without its children, its parent or its listeners, which is what cloneNode starts from.
Kinds of node which are made with arguments override this to give them.

**Kind**: instance method of [<code>ShadowRootService</code>](#ShadowRootService)  
**Overrides**: [<code>cloneShallow</code>](#NodeService+cloneShallow)  
<a name="NodeService+equalsShallow"></a>

### shadowRootService.equalsShallow(other) ⇒ <code>boolean</code>
Whether another node of the same type is equal to this one apart from its children, which isEqualNode compares
afterwards. Kinds of node with more to compare (an element has attributes) override this.

**Kind**: instance method of [<code>ShadowRootService</code>](#ShadowRootService)  
**Overrides**: [<code>equalsShallow</code>](#NodeService+equalsShallow)  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>NodeService</code>](#NodeService) | The node to compare with |

<a name="NodeService+append"></a>

### shadowRootService.append(...nodes)
Add nodes (strings become text nodes) as the last children of this node, in the order given.

**Kind**: instance method of [<code>ShadowRootService</code>](#ShadowRootService)  
**Overrides**: [<code>append</code>](#NodeService+append)  
**Throws**:

- <code>Error</code> When this kind of node cannot have children


| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+prepend"></a>

### shadowRootService.prepend(...nodes)
Add nodes (strings become text nodes) as the first children of this node, in the order given.

**Kind**: instance method of [<code>ShadowRootService</code>](#ShadowRootService)  
**Overrides**: [<code>prepend</code>](#NodeService+prepend)  
**Throws**:

- <code>Error</code> When this kind of node cannot have children


| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+replaceChildren"></a>

### shadowRootService.replaceChildren(...nodes)
Remove every child of this node and put the given nodes (strings become text nodes) in their place, in order.

**Kind**: instance method of [<code>ShadowRootService</code>](#ShadowRootService)  
**Overrides**: [<code>replaceChildren</code>](#NodeService+replaceChildren)  
**Throws**:

- <code>Error</code> When this kind of node cannot have children


| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+before"></a>

### shadowRootService.before(...nodes)
Add nodes (strings become text nodes) as this node's previous siblings, in order. Does nothing when this node has
no parent.

**Kind**: instance method of [<code>ShadowRootService</code>](#ShadowRootService)  
**Overrides**: [<code>before</code>](#NodeService+before)  

| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+after"></a>

### shadowRootService.after(...nodes)
Add nodes (strings become text nodes) as this node's next siblings, in order. Does nothing when this node has no
parent.

**Kind**: instance method of [<code>ShadowRootService</code>](#ShadowRootService)  
**Overrides**: [<code>after</code>](#NodeService+after)  

| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+replaceWith"></a>

### shadowRootService.replaceWith(...nodes)
Put the given nodes (strings become text nodes) where this node is, in order, then remove this node. Does nothing
when this node has no parent.

**Kind**: instance method of [<code>ShadowRootService</code>](#ShadowRootService)  
**Overrides**: [<code>replaceWith</code>](#NodeService+replaceWith)  

| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to put in this node's place |

<a name="NodeService+remove"></a>

### shadowRootService.remove()
Remove this node from its parent. Does nothing when it has no parent.

**Kind**: instance method of [<code>ShadowRootService</code>](#ShadowRootService)  
**Overrides**: [<code>remove</code>](#NodeService+remove)  
<a name="NodeService+toChildNode"></a>

### shadowRootService.toChildNode(value) ⇒ <code>PseudoNode</code>
Turn a value given to append / prepend / before / after / replaceWith / replaceChildren into a node: a string
becomes a text node belonging to this node's document, anything else is returned as it is.

**Kind**: instance method of [<code>ShadowRootService</code>](#ShadowRootService)  
**Overrides**: [<code>toChildNode</code>](#NodeService+toChildNode)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>PseudoNode</code> \| <code>string</code> | The value to add |

<a name="NodeService+getElementsByTagName"></a>

### shadowRootService.getElementsByTagName(tagName) ⇒ <code>PseudoHTMLCollection</code>
Every element below this node with the given tag name (or every element when tagName is *), live.

**Kind**: instance method of [<code>ShadowRootService</code>](#ShadowRootService)  
**Overrides**: [<code>getElementsByTagName</code>](#NodeService+getElementsByTagName)  

| Param | Type |
| --- | --- |
| tagName | <code>string</code> | 

<a name="NodeService+getElementsByClassName"></a>

### shadowRootService.getElementsByClassName(className) ⇒ <code>PseudoHTMLCollection</code>
Every element below this node which has all of the given (space separated) classes, live.

**Kind**: instance method of [<code>ShadowRootService</code>](#ShadowRootService)  
**Overrides**: [<code>getElementsByClassName</code>](#NodeService+getElementsByClassName)  

| Param | Type |
| --- | --- |
| className | <code>string</code> | 

<a name="NodeService+getElementsByTagNameNS"></a>

### shadowRootService.getElementsByTagNameNS(namespace, tagName) ⇒ <code>PseudoHTMLCollection</code>
Every element below this node with the given tag name, live. There is no real namespace parsing here, so this
ignores the namespace and behaves exactly like getElementsByTagName.

**Kind**: instance method of [<code>ShadowRootService</code>](#ShadowRootService)  
**Overrides**: [<code>getElementsByTagNameNS</code>](#NodeService+getElementsByTagNameNS)  

| Param | Type | Description |
| --- | --- | --- |
| namespace | <code>string</code> | Ignored |
| tagName | <code>string</code> |  |

<a name="NodeService+querySelector"></a>

### shadowRootService.querySelector(selectors) ⇒ <code>PseudoElement</code> \| <code>null</code>
The first element below this node which matches the CSS selector, in tree order, or null when there is none.

**Kind**: instance method of [<code>ShadowRootService</code>](#ShadowRootService)  
**Overrides**: [<code>querySelector</code>](#NodeService+querySelector)  

| Param | Type | Description |
| --- | --- | --- |
| selectors | <code>string</code> | A CSS selector |

<a name="NodeService+querySelectorAll"></a>

### shadowRootService.querySelectorAll(selectors) ⇒ <code>Array.&lt;PseudoElement&gt;</code>
Every element below this node which matches the CSS selector, in tree order. A plain array (not a live
collection): like the DOM's querySelectorAll, it is a snapshot taken when it is called.

**Kind**: instance method of [<code>ShadowRootService</code>](#ShadowRootService)  
**Overrides**: [<code>querySelectorAll</code>](#NodeService+querySelectorAll)  

| Param | Type | Description |
| --- | --- | --- |
| selectors | <code>string</code> | A CSS selector |

<a name="NodeService+childInserted"></a>

### shadowRootService.childInserted(child)
Called each time a node has been inserted as a child of this node, so that nodes which need to react to children
(for example elements applying default events) can do so.

**Kind**: instance method of [<code>ShadowRootService</code>](#ShadowRootService)  
**Overrides**: [<code>childInserted</code>](#NodeService+childInserted)  

| Param | Type | Description |
| --- | --- | --- |
| child | [<code>NodeService</code>](#NodeService) | The node which was inserted |

<a name="NodeService+cloneNode"></a>

### shadowRootService.cloneNode([deep]) ⇒ <code>PseudoNode</code>
Make a copy of this node (without its parent, and without its event listeners). With deep the children are copied
too, all the way down.

**Kind**: instance method of [<code>ShadowRootService</code>](#ShadowRootService)  
**Overrides**: [<code>cloneNode</code>](#NodeService+cloneNode)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [deep] | <code>boolean</code> | <code>false</code> | Copy the children as well |

<a name="NodeService+compareDocumentPosition"></a>

### shadowRootService.compareDocumentPosition(otherNode) ⇒ <code>number</code>
Say where another node is in relation to this one, as the bits of NodeService.DOCUMENT_POSITION_*: 0 for this node
itself, DISCONNECTED (with IMPLEMENTATION_SPECIFIC and a consistent PRECEDING or FOLLOWING) for a node in another tree,
CONTAINS + PRECEDING when the other node is an ancestor, CONTAINED_BY + FOLLOWING when it is a descendant,
otherwise PRECEDING or FOLLOWING by their order in the tree.

**Kind**: instance method of [<code>ShadowRootService</code>](#ShadowRootService)  
**Overrides**: [<code>compareDocumentPosition</code>](#NodeService+compareDocumentPosition)  

| Param | Type | Description |
| --- | --- | --- |
| otherNode | <code>PseudoNode</code> | The node to locate |

<a name="NodeService+contains"></a>

### shadowRootService.contains(otherNode) ⇒ <code>boolean</code>
Check whether a node is this node or one of its descendants.

**Kind**: instance method of [<code>ShadowRootService</code>](#ShadowRootService)  
**Overrides**: [<code>contains</code>](#NodeService+contains)  

| Param | Type | Description |
| --- | --- | --- |
| otherNode | <code>PseudoNode</code> \| <code>null</code> | The node to look for |

<a name="NodeService+insertBefore"></a>

### shadowRootService.insertBefore(newNode, [referenceNode]) ⇒ <code>PseudoNode</code>
Insert a node as a child of this node, before the given child (or at the end when there is none). A node which is
already in a tree is moved, and the children of a document fragment are moved in order.

**Kind**: instance method of [<code>ShadowRootService</code>](#ShadowRootService)  
**Overrides**: [<code>insertBefore</code>](#NodeService+insertBefore)  
**Returns**: <code>PseudoNode</code> - The inserted node  
**Throws**:

- <code>Error</code> When the reference node is not a child of this node, or the new node is this node or contains it


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| newNode | <code>PseudoNode</code> |  | The node to insert |
| [referenceNode] | <code>PseudoNode</code> \| <code>null</code> | <code></code> | The child of this node to insert before, or null to insert at the end |

<a name="NodeService+isEqualNode"></a>

### shadowRootService.isEqualNode(otherNode) ⇒ <code>boolean</code>
Whether another node is the same as this one, by what they hold: the same type, name and value (an element also
needs the same attributes), and children which are equal in the same order.

**Kind**: instance method of [<code>ShadowRootService</code>](#ShadowRootService)  
**Overrides**: [<code>isEqualNode</code>](#NodeService+isEqualNode)  

| Param | Type | Description |
| --- | --- | --- |
| otherNode | <code>PseudoNode</code> \| <code>null</code> | The node to compare with |

<a name="NodeService+normalize"></a>

### shadowRootService.normalize()
Tidy the text below this node: neighbouring text nodes are joined into one and empty text nodes are removed.

**Kind**: instance method of [<code>ShadowRootService</code>](#ShadowRootService)  
**Overrides**: [<code>normalize</code>](#NodeService+normalize)  
<a name="NodeService+removeChild"></a>

### shadowRootService.removeChild(childElement) ⇒ <code>PseudoNode</code>
Remove a child from this node, it no longer has a parent or siblings afterwards.

**Kind**: instance method of [<code>ShadowRootService</code>](#ShadowRootService)  
**Overrides**: [<code>removeChild</code>](#NodeService+removeChild)  
**Returns**: <code>PseudoNode</code> - The removed node  
**Throws**:

- <code>Error</code> When the node is not a child of this node


| Param | Type | Description |
| --- | --- | --- |
| childElement | <code>PseudoNode</code> | The child node to remove |

<a name="NodeService+replaceChild"></a>

### shadowRootService.replaceChild(newChild, oldChild) ⇒ <code>PseudoNode</code>
Replace a child of this node with another node (which is moved if it is already in a tree).

**Kind**: instance method of [<code>ShadowRootService</code>](#ShadowRootService)  
**Overrides**: [<code>replaceChild</code>](#NodeService+replaceChild)  
**Returns**: <code>PseudoNode</code> - The replaced node  
**Throws**:

- <code>Error</code> When the old node is not a child of this node


| Param | Type | Description |
| --- | --- | --- |
| newChild | <code>PseudoNode</code> | The node which takes the place |
| oldChild | <code>PseudoNode</code> | The child of this node to replace |

<a name="PointerEventService"></a>

## PointerEventService ⇐ [<code>MouseEventService</code>](#MouseEventService)
Simulate the behaviour of the PointerEvent Class when there is no DOM available.

**Kind**: global class  
**Extends**: [<code>MouseEventService</code>](#MouseEventService)  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  
**Properties**

| Name | Type |
| --- | --- |
| pointerId | <code>number</code> | 
| width | <code>number</code> | 
| height | <code>number</code> | 
| pressure | <code>number</code> | 
| pointerType | <code>string</code> | 
| isPrimary | <code>boolean</code> | 


* [PointerEventService](#PointerEventService) ⇐ [<code>MouseEventService</code>](#MouseEventService)
    * [new PointerEventService([typeArg], [init])](#new_PointerEventService_new)
    * [.inner](#EventService+inner) ⇒ <code>EventInner</code>
    * [.getModifierState(key)](#MouseEventService+getModifierState) ⇒ <code>boolean</code>
    * [.composedPath()](#EventService+composedPath) ⇒ <code>Array.&lt;PseudoEventTarget&gt;</code>
    * [.preventDefault()](#EventService+preventDefault) ⇒ <code>null</code>
    * [.stopImmediatePropagation()](#EventService+stopImmediatePropagation) ⇒ <code>null</code>
    * [.stopPropagation()](#EventService+stopPropagation) ⇒ <code>null</code>

<a name="new_PointerEventService_new"></a>

### new PointerEventService([typeArg], [init])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [typeArg] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | The type of the event |
| [init] | <code>PointerEventInit</code> | <code>{}</code> | The options for the event |

<a name="EventService+inner"></a>

### pointerEventService.inner ⇒ <code>EventInner</code>
Scope several accessors inside the inner object. These are only intended for usage by other DOM classes.

**Kind**: instance property of [<code>PointerEventService</code>](#PointerEventService)  
**Overrides**: [<code>inner</code>](#EventService+inner)  
<a name="MouseEventService+getModifierState"></a>

### pointerEventService.getModifierState(key) ⇒ <code>boolean</code>
Whether a modifier key was held down when the event happened.

**Kind**: instance method of [<code>PointerEventService</code>](#PointerEventService)  
**Overrides**: [<code>getModifierState</code>](#MouseEventService+getModifierState)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | Control, Shift, Alt or Meta |

<a name="EventService+composedPath"></a>

### pointerEventService.composedPath() ⇒ <code>Array.&lt;PseudoEventTarget&gt;</code>
Return an array of targets that will have the event executed open them. The order is based on the eventPhase

**Kind**: instance method of [<code>PointerEventService</code>](#PointerEventService)  
**Overrides**: [<code>composedPath</code>](#EventService+composedPath)  
<a name="EventService+preventDefault"></a>

### pointerEventService.preventDefault() ⇒ <code>null</code>
Cancels the event (if it is cancelable).

**Kind**: instance method of [<code>PointerEventService</code>](#PointerEventService)  
**Overrides**: [<code>preventDefault</code>](#EventService+preventDefault)  
<a name="EventService+stopImmediatePropagation"></a>

### pointerEventService.stopImmediatePropagation() ⇒ <code>null</code>
For this particular event, no other listener will be called.
Neither those attached on the same element, nor those attached on elements which will be traversed later (in
capture phase, for instance)

**Kind**: instance method of [<code>PointerEventService</code>](#PointerEventService)  
**Overrides**: [<code>stopImmediatePropagation</code>](#EventService+stopImmediatePropagation)  
<a name="EventService+stopPropagation"></a>

### pointerEventService.stopPropagation() ⇒ <code>null</code>
Stops the propagation of events further along in the Dom.

**Kind**: instance method of [<code>PointerEventService</code>](#PointerEventService)  
**Overrides**: [<code>stopPropagation</code>](#EventService+stopPropagation)  
<a name="NodeService"></a>

## NodeService ⇐ <code>PseudoEventTarget</code>
Simulate the behaviour of the Node Class when there is no DOM available.

**Kind**: global class  
**Extends**: <code>PseudoEventTarget</code>  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  
**Properties**

| Name | Type |
| --- | --- |
| name | <code>string</code> | 
| appendChild | <code>function</code> | 
| removeChild | <code>function</code> | 


* [NodeService](#NodeService) ⇐ <code>PseudoEventTarget</code>
    * [.acceptsChildren](#NodeService+acceptsChildren) ⇒ <code>boolean</code>
    * [.appendChild(childNode)](#NodeService+appendChild) ⇒ <code>PseudoNode</code>
    * [.cloneShallow()](#NodeService+cloneShallow) ⇒ [<code>NodeService</code>](#NodeService)
    * [.equalsShallow(other)](#NodeService+equalsShallow) ⇒ <code>boolean</code>
    * [.append(...nodes)](#NodeService+append)
    * [.prepend(...nodes)](#NodeService+prepend)
    * [.replaceChildren(...nodes)](#NodeService+replaceChildren)
    * [.before(...nodes)](#NodeService+before)
    * [.after(...nodes)](#NodeService+after)
    * [.replaceWith(...nodes)](#NodeService+replaceWith)
    * [.remove()](#NodeService+remove)
    * [.toChildNode(value)](#NodeService+toChildNode) ⇒ <code>PseudoNode</code>
    * [.getElementsByTagName(tagName)](#NodeService+getElementsByTagName) ⇒ <code>PseudoHTMLCollection</code>
    * [.getElementsByClassName(className)](#NodeService+getElementsByClassName) ⇒ <code>PseudoHTMLCollection</code>
    * [.getElementsByTagNameNS(namespace, tagName)](#NodeService+getElementsByTagNameNS) ⇒ <code>PseudoHTMLCollection</code>
    * [.querySelector(selectors)](#NodeService+querySelector) ⇒ <code>PseudoElement</code> \| <code>null</code>
    * [.querySelectorAll(selectors)](#NodeService+querySelectorAll) ⇒ <code>Array.&lt;PseudoElement&gt;</code>
    * [.childInserted(child)](#NodeService+childInserted)
    * [.cloneNode([deep])](#NodeService+cloneNode) ⇒ <code>PseudoNode</code>
    * [.compareDocumentPosition(otherNode)](#NodeService+compareDocumentPosition) ⇒ <code>number</code>
    * [.contains(otherNode)](#NodeService+contains) ⇒ <code>boolean</code>
    * [.insertBefore(newNode, [referenceNode])](#NodeService+insertBefore) ⇒ <code>PseudoNode</code>
    * [.isEqualNode(otherNode)](#NodeService+isEqualNode) ⇒ <code>boolean</code>
    * [.normalize()](#NodeService+normalize)
    * [.removeChild(childElement)](#NodeService+removeChild) ⇒ <code>PseudoNode</code>
    * [.replaceChild(newChild, oldChild)](#NodeService+replaceChild) ⇒ <code>PseudoNode</code>

<a name="NodeService+acceptsChildren"></a>

### nodeService.acceptsChildren ⇒ <code>boolean</code>
Whether this kind of node can have children (text, comments and attributes cannot).

**Kind**: instance property of [<code>NodeService</code>](#NodeService)  
<a name="NodeService+appendChild"></a>

### nodeService.appendChild(childNode) ⇒ <code>PseudoNode</code>
Add a node as the last child of this node (a node which is already in a tree is moved).

**Kind**: instance method of [<code>NodeService</code>](#NodeService)  
**Returns**: <code>PseudoNode</code> - The added node  

| Param | Type | Description |
| --- | --- | --- |
| childNode | <code>PseudoNode</code> | The node to add |

<a name="NodeService+cloneShallow"></a>

### nodeService.cloneShallow() ⇒ [<code>NodeService</code>](#NodeService)
Make a copy of this node without its children, its parent or its listeners, which is what cloneNode starts from.
Kinds of node which are made with arguments override this to give them.

**Kind**: instance method of [<code>NodeService</code>](#NodeService)  
<a name="NodeService+equalsShallow"></a>

### nodeService.equalsShallow(other) ⇒ <code>boolean</code>
Whether another node of the same type is equal to this one apart from its children, which isEqualNode compares
afterwards. Kinds of node with more to compare (an element has attributes) override this.

**Kind**: instance method of [<code>NodeService</code>](#NodeService)  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>NodeService</code>](#NodeService) | The node to compare with |

<a name="NodeService+append"></a>

### nodeService.append(...nodes)
Add nodes (strings become text nodes) as the last children of this node, in the order given.

**Kind**: instance method of [<code>NodeService</code>](#NodeService)  
**Throws**:

- <code>Error</code> When this kind of node cannot have children


| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+prepend"></a>

### nodeService.prepend(...nodes)
Add nodes (strings become text nodes) as the first children of this node, in the order given.

**Kind**: instance method of [<code>NodeService</code>](#NodeService)  
**Throws**:

- <code>Error</code> When this kind of node cannot have children


| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+replaceChildren"></a>

### nodeService.replaceChildren(...nodes)
Remove every child of this node and put the given nodes (strings become text nodes) in their place, in order.

**Kind**: instance method of [<code>NodeService</code>](#NodeService)  
**Throws**:

- <code>Error</code> When this kind of node cannot have children


| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+before"></a>

### nodeService.before(...nodes)
Add nodes (strings become text nodes) as this node's previous siblings, in order. Does nothing when this node has
no parent.

**Kind**: instance method of [<code>NodeService</code>](#NodeService)  

| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+after"></a>

### nodeService.after(...nodes)
Add nodes (strings become text nodes) as this node's next siblings, in order. Does nothing when this node has no
parent.

**Kind**: instance method of [<code>NodeService</code>](#NodeService)  

| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+replaceWith"></a>

### nodeService.replaceWith(...nodes)
Put the given nodes (strings become text nodes) where this node is, in order, then remove this node. Does nothing
when this node has no parent.

**Kind**: instance method of [<code>NodeService</code>](#NodeService)  

| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to put in this node's place |

<a name="NodeService+remove"></a>

### nodeService.remove()
Remove this node from its parent. Does nothing when it has no parent.

**Kind**: instance method of [<code>NodeService</code>](#NodeService)  
<a name="NodeService+toChildNode"></a>

### nodeService.toChildNode(value) ⇒ <code>PseudoNode</code>
Turn a value given to append / prepend / before / after / replaceWith / replaceChildren into a node: a string
becomes a text node belonging to this node's document, anything else is returned as it is.

**Kind**: instance method of [<code>NodeService</code>](#NodeService)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>PseudoNode</code> \| <code>string</code> | The value to add |

<a name="NodeService+getElementsByTagName"></a>

### nodeService.getElementsByTagName(tagName) ⇒ <code>PseudoHTMLCollection</code>
Every element below this node with the given tag name (or every element when tagName is *), live.

**Kind**: instance method of [<code>NodeService</code>](#NodeService)  

| Param | Type |
| --- | --- |
| tagName | <code>string</code> | 

<a name="NodeService+getElementsByClassName"></a>

### nodeService.getElementsByClassName(className) ⇒ <code>PseudoHTMLCollection</code>
Every element below this node which has all of the given (space separated) classes, live.

**Kind**: instance method of [<code>NodeService</code>](#NodeService)  

| Param | Type |
| --- | --- |
| className | <code>string</code> | 

<a name="NodeService+getElementsByTagNameNS"></a>

### nodeService.getElementsByTagNameNS(namespace, tagName) ⇒ <code>PseudoHTMLCollection</code>
Every element below this node with the given tag name, live. There is no real namespace parsing here, so this
ignores the namespace and behaves exactly like getElementsByTagName.

**Kind**: instance method of [<code>NodeService</code>](#NodeService)  

| Param | Type | Description |
| --- | --- | --- |
| namespace | <code>string</code> | Ignored |
| tagName | <code>string</code> |  |

<a name="NodeService+querySelector"></a>

### nodeService.querySelector(selectors) ⇒ <code>PseudoElement</code> \| <code>null</code>
The first element below this node which matches the CSS selector, in tree order, or null when there is none.

**Kind**: instance method of [<code>NodeService</code>](#NodeService)  

| Param | Type | Description |
| --- | --- | --- |
| selectors | <code>string</code> | A CSS selector |

<a name="NodeService+querySelectorAll"></a>

### nodeService.querySelectorAll(selectors) ⇒ <code>Array.&lt;PseudoElement&gt;</code>
Every element below this node which matches the CSS selector, in tree order. A plain array (not a live
collection): like the DOM's querySelectorAll, it is a snapshot taken when it is called.

**Kind**: instance method of [<code>NodeService</code>](#NodeService)  

| Param | Type | Description |
| --- | --- | --- |
| selectors | <code>string</code> | A CSS selector |

<a name="NodeService+childInserted"></a>

### nodeService.childInserted(child)
Called each time a node has been inserted as a child of this node, so that nodes which need to react to children
(for example elements applying default events) can do so.

**Kind**: instance method of [<code>NodeService</code>](#NodeService)  

| Param | Type | Description |
| --- | --- | --- |
| child | [<code>NodeService</code>](#NodeService) | The node which was inserted |

<a name="NodeService+cloneNode"></a>

### nodeService.cloneNode([deep]) ⇒ <code>PseudoNode</code>
Make a copy of this node (without its parent, and without its event listeners). With deep the children are copied
too, all the way down.

**Kind**: instance method of [<code>NodeService</code>](#NodeService)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [deep] | <code>boolean</code> | <code>false</code> | Copy the children as well |

<a name="NodeService+compareDocumentPosition"></a>

### nodeService.compareDocumentPosition(otherNode) ⇒ <code>number</code>
Say where another node is in relation to this one, as the bits of NodeService.DOCUMENT_POSITION_*: 0 for this node
itself, DISCONNECTED (with IMPLEMENTATION_SPECIFIC and a consistent PRECEDING or FOLLOWING) for a node in another tree,
CONTAINS + PRECEDING when the other node is an ancestor, CONTAINED_BY + FOLLOWING when it is a descendant,
otherwise PRECEDING or FOLLOWING by their order in the tree.

**Kind**: instance method of [<code>NodeService</code>](#NodeService)  

| Param | Type | Description |
| --- | --- | --- |
| otherNode | <code>PseudoNode</code> | The node to locate |

<a name="NodeService+contains"></a>

### nodeService.contains(otherNode) ⇒ <code>boolean</code>
Check whether a node is this node or one of its descendants.

**Kind**: instance method of [<code>NodeService</code>](#NodeService)  

| Param | Type | Description |
| --- | --- | --- |
| otherNode | <code>PseudoNode</code> \| <code>null</code> | The node to look for |

<a name="NodeService+insertBefore"></a>

### nodeService.insertBefore(newNode, [referenceNode]) ⇒ <code>PseudoNode</code>
Insert a node as a child of this node, before the given child (or at the end when there is none). A node which is
already in a tree is moved, and the children of a document fragment are moved in order.

**Kind**: instance method of [<code>NodeService</code>](#NodeService)  
**Returns**: <code>PseudoNode</code> - The inserted node  
**Throws**:

- <code>Error</code> When the reference node is not a child of this node, or the new node is this node or contains it


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| newNode | <code>PseudoNode</code> |  | The node to insert |
| [referenceNode] | <code>PseudoNode</code> \| <code>null</code> | <code></code> | The child of this node to insert before, or null to insert at the end |

<a name="NodeService+isEqualNode"></a>

### nodeService.isEqualNode(otherNode) ⇒ <code>boolean</code>
Whether another node is the same as this one, by what they hold: the same type, name and value (an element also
needs the same attributes), and children which are equal in the same order.

**Kind**: instance method of [<code>NodeService</code>](#NodeService)  

| Param | Type | Description |
| --- | --- | --- |
| otherNode | <code>PseudoNode</code> \| <code>null</code> | The node to compare with |

<a name="NodeService+normalize"></a>

### nodeService.normalize()
Tidy the text below this node: neighbouring text nodes are joined into one and empty text nodes are removed.

**Kind**: instance method of [<code>NodeService</code>](#NodeService)  
<a name="NodeService+removeChild"></a>

### nodeService.removeChild(childElement) ⇒ <code>PseudoNode</code>
Remove a child from this node, it no longer has a parent or siblings afterwards.

**Kind**: instance method of [<code>NodeService</code>](#NodeService)  
**Returns**: <code>PseudoNode</code> - The removed node  
**Throws**:

- <code>Error</code> When the node is not a child of this node


| Param | Type | Description |
| --- | --- | --- |
| childElement | <code>PseudoNode</code> | The child node to remove |

<a name="NodeService+replaceChild"></a>

### nodeService.replaceChild(newChild, oldChild) ⇒ <code>PseudoNode</code>
Replace a child of this node with another node (which is moved if it is already in a tree).

**Kind**: instance method of [<code>NodeService</code>](#NodeService)  
**Returns**: <code>PseudoNode</code> - The replaced node  
**Throws**:

- <code>Error</code> When the old node is not a child of this node


| Param | Type | Description |
| --- | --- | --- |
| newChild | <code>PseudoNode</code> | The node which takes the place |
| oldChild | <code>PseudoNode</code> | The child of this node to replace |

<a name="TextService"></a>

## TextService ⇐ [<code>NodeService</code>](#NodeService)
Simulate the behaviour of the Text Class when there is no DOM available: the text in an element.

**Kind**: global class  
**Extends**: [<code>NodeService</code>](#NodeService)  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| data | <code>string</code> | The text |
| length | <code>number</code> | How many characters there are |
| wholeText | <code>string</code> | The text of this node and of the text nodes next to it |


* [TextService](#TextService) ⇐ [<code>NodeService</code>](#NodeService)
    * [new TextService([data])](#new_TextService_new)
    * [.acceptsChildren](#NodeService+acceptsChildren) ⇒ <code>boolean</code>
    * [.splitText(offset)](#TextService+splitText) ⇒ [<code>TextService</code>](#TextService)
    * [.appendChild(childNode)](#NodeService+appendChild) ⇒ <code>PseudoNode</code>
    * [.cloneShallow()](#NodeService+cloneShallow) ⇒ [<code>NodeService</code>](#NodeService)
    * [.equalsShallow(other)](#NodeService+equalsShallow) ⇒ <code>boolean</code>
    * [.append(...nodes)](#NodeService+append)
    * [.prepend(...nodes)](#NodeService+prepend)
    * [.replaceChildren(...nodes)](#NodeService+replaceChildren)
    * [.before(...nodes)](#NodeService+before)
    * [.after(...nodes)](#NodeService+after)
    * [.replaceWith(...nodes)](#NodeService+replaceWith)
    * [.remove()](#NodeService+remove)
    * [.toChildNode(value)](#NodeService+toChildNode) ⇒ <code>PseudoNode</code>
    * [.getElementsByTagName(tagName)](#NodeService+getElementsByTagName) ⇒ <code>PseudoHTMLCollection</code>
    * [.getElementsByClassName(className)](#NodeService+getElementsByClassName) ⇒ <code>PseudoHTMLCollection</code>
    * [.getElementsByTagNameNS(namespace, tagName)](#NodeService+getElementsByTagNameNS) ⇒ <code>PseudoHTMLCollection</code>
    * [.querySelector(selectors)](#NodeService+querySelector) ⇒ <code>PseudoElement</code> \| <code>null</code>
    * [.querySelectorAll(selectors)](#NodeService+querySelectorAll) ⇒ <code>Array.&lt;PseudoElement&gt;</code>
    * [.childInserted(child)](#NodeService+childInserted)
    * [.cloneNode([deep])](#NodeService+cloneNode) ⇒ <code>PseudoNode</code>
    * [.compareDocumentPosition(otherNode)](#NodeService+compareDocumentPosition) ⇒ <code>number</code>
    * [.contains(otherNode)](#NodeService+contains) ⇒ <code>boolean</code>
    * [.insertBefore(newNode, [referenceNode])](#NodeService+insertBefore) ⇒ <code>PseudoNode</code>
    * [.isEqualNode(otherNode)](#NodeService+isEqualNode) ⇒ <code>boolean</code>
    * [.normalize()](#NodeService+normalize)
    * [.removeChild(childElement)](#NodeService+removeChild) ⇒ <code>PseudoNode</code>
    * [.replaceChild(newChild, oldChild)](#NodeService+replaceChild) ⇒ <code>PseudoNode</code>

<a name="new_TextService_new"></a>

### new TextService([data])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [data] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | The text |

<a name="NodeService+acceptsChildren"></a>

### textService.acceptsChildren ⇒ <code>boolean</code>
Whether this kind of node can have children (text, comments and attributes cannot).

**Kind**: instance property of [<code>TextService</code>](#TextService)  
**Overrides**: [<code>acceptsChildren</code>](#NodeService+acceptsChildren)  
<a name="TextService+splitText"></a>

### textService.splitText(offset) ⇒ [<code>TextService</code>](#TextService)
Break this text node in two at a position: this node keeps the text before it and a new node with the rest is put
after this one.

**Kind**: instance method of [<code>TextService</code>](#TextService)  
**Returns**: [<code>TextService</code>](#TextService) - The new node  
**Throws**:

- <code>Error</code> When the offset is beyond the end of the text


| Param | Type | Description |
| --- | --- | --- |
| offset | <code>number</code> | How many characters stay in this node |

<a name="NodeService+appendChild"></a>

### textService.appendChild(childNode) ⇒ <code>PseudoNode</code>
Add a node as the last child of this node (a node which is already in a tree is moved).

**Kind**: instance method of [<code>TextService</code>](#TextService)  
**Overrides**: [<code>appendChild</code>](#NodeService+appendChild)  
**Returns**: <code>PseudoNode</code> - The added node  

| Param | Type | Description |
| --- | --- | --- |
| childNode | <code>PseudoNode</code> | The node to add |

<a name="NodeService+cloneShallow"></a>

### textService.cloneShallow() ⇒ [<code>NodeService</code>](#NodeService)
Make a copy of this node without its children, its parent or its listeners, which is what cloneNode starts from.
Kinds of node which are made with arguments override this to give them.

**Kind**: instance method of [<code>TextService</code>](#TextService)  
**Overrides**: [<code>cloneShallow</code>](#NodeService+cloneShallow)  
<a name="NodeService+equalsShallow"></a>

### textService.equalsShallow(other) ⇒ <code>boolean</code>
Whether another node of the same type is equal to this one apart from its children, which isEqualNode compares
afterwards. Kinds of node with more to compare (an element has attributes) override this.

**Kind**: instance method of [<code>TextService</code>](#TextService)  
**Overrides**: [<code>equalsShallow</code>](#NodeService+equalsShallow)  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>NodeService</code>](#NodeService) | The node to compare with |

<a name="NodeService+append"></a>

### textService.append(...nodes)
Add nodes (strings become text nodes) as the last children of this node, in the order given.

**Kind**: instance method of [<code>TextService</code>](#TextService)  
**Overrides**: [<code>append</code>](#NodeService+append)  
**Throws**:

- <code>Error</code> When this kind of node cannot have children


| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+prepend"></a>

### textService.prepend(...nodes)
Add nodes (strings become text nodes) as the first children of this node, in the order given.

**Kind**: instance method of [<code>TextService</code>](#TextService)  
**Overrides**: [<code>prepend</code>](#NodeService+prepend)  
**Throws**:

- <code>Error</code> When this kind of node cannot have children


| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+replaceChildren"></a>

### textService.replaceChildren(...nodes)
Remove every child of this node and put the given nodes (strings become text nodes) in their place, in order.

**Kind**: instance method of [<code>TextService</code>](#TextService)  
**Overrides**: [<code>replaceChildren</code>](#NodeService+replaceChildren)  
**Throws**:

- <code>Error</code> When this kind of node cannot have children


| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+before"></a>

### textService.before(...nodes)
Add nodes (strings become text nodes) as this node's previous siblings, in order. Does nothing when this node has
no parent.

**Kind**: instance method of [<code>TextService</code>](#TextService)  
**Overrides**: [<code>before</code>](#NodeService+before)  

| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+after"></a>

### textService.after(...nodes)
Add nodes (strings become text nodes) as this node's next siblings, in order. Does nothing when this node has no
parent.

**Kind**: instance method of [<code>TextService</code>](#TextService)  
**Overrides**: [<code>after</code>](#NodeService+after)  

| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+replaceWith"></a>

### textService.replaceWith(...nodes)
Put the given nodes (strings become text nodes) where this node is, in order, then remove this node. Does nothing
when this node has no parent.

**Kind**: instance method of [<code>TextService</code>](#TextService)  
**Overrides**: [<code>replaceWith</code>](#NodeService+replaceWith)  

| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to put in this node's place |

<a name="NodeService+remove"></a>

### textService.remove()
Remove this node from its parent. Does nothing when it has no parent.

**Kind**: instance method of [<code>TextService</code>](#TextService)  
**Overrides**: [<code>remove</code>](#NodeService+remove)  
<a name="NodeService+toChildNode"></a>

### textService.toChildNode(value) ⇒ <code>PseudoNode</code>
Turn a value given to append / prepend / before / after / replaceWith / replaceChildren into a node: a string
becomes a text node belonging to this node's document, anything else is returned as it is.

**Kind**: instance method of [<code>TextService</code>](#TextService)  
**Overrides**: [<code>toChildNode</code>](#NodeService+toChildNode)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>PseudoNode</code> \| <code>string</code> | The value to add |

<a name="NodeService+getElementsByTagName"></a>

### textService.getElementsByTagName(tagName) ⇒ <code>PseudoHTMLCollection</code>
Every element below this node with the given tag name (or every element when tagName is *), live.

**Kind**: instance method of [<code>TextService</code>](#TextService)  
**Overrides**: [<code>getElementsByTagName</code>](#NodeService+getElementsByTagName)  

| Param | Type |
| --- | --- |
| tagName | <code>string</code> | 

<a name="NodeService+getElementsByClassName"></a>

### textService.getElementsByClassName(className) ⇒ <code>PseudoHTMLCollection</code>
Every element below this node which has all of the given (space separated) classes, live.

**Kind**: instance method of [<code>TextService</code>](#TextService)  
**Overrides**: [<code>getElementsByClassName</code>](#NodeService+getElementsByClassName)  

| Param | Type |
| --- | --- |
| className | <code>string</code> | 

<a name="NodeService+getElementsByTagNameNS"></a>

### textService.getElementsByTagNameNS(namespace, tagName) ⇒ <code>PseudoHTMLCollection</code>
Every element below this node with the given tag name, live. There is no real namespace parsing here, so this
ignores the namespace and behaves exactly like getElementsByTagName.

**Kind**: instance method of [<code>TextService</code>](#TextService)  
**Overrides**: [<code>getElementsByTagNameNS</code>](#NodeService+getElementsByTagNameNS)  

| Param | Type | Description |
| --- | --- | --- |
| namespace | <code>string</code> | Ignored |
| tagName | <code>string</code> |  |

<a name="NodeService+querySelector"></a>

### textService.querySelector(selectors) ⇒ <code>PseudoElement</code> \| <code>null</code>
The first element below this node which matches the CSS selector, in tree order, or null when there is none.

**Kind**: instance method of [<code>TextService</code>](#TextService)  
**Overrides**: [<code>querySelector</code>](#NodeService+querySelector)  

| Param | Type | Description |
| --- | --- | --- |
| selectors | <code>string</code> | A CSS selector |

<a name="NodeService+querySelectorAll"></a>

### textService.querySelectorAll(selectors) ⇒ <code>Array.&lt;PseudoElement&gt;</code>
Every element below this node which matches the CSS selector, in tree order. A plain array (not a live
collection): like the DOM's querySelectorAll, it is a snapshot taken when it is called.

**Kind**: instance method of [<code>TextService</code>](#TextService)  
**Overrides**: [<code>querySelectorAll</code>](#NodeService+querySelectorAll)  

| Param | Type | Description |
| --- | --- | --- |
| selectors | <code>string</code> | A CSS selector |

<a name="NodeService+childInserted"></a>

### textService.childInserted(child)
Called each time a node has been inserted as a child of this node, so that nodes which need to react to children
(for example elements applying default events) can do so.

**Kind**: instance method of [<code>TextService</code>](#TextService)  
**Overrides**: [<code>childInserted</code>](#NodeService+childInserted)  

| Param | Type | Description |
| --- | --- | --- |
| child | [<code>NodeService</code>](#NodeService) | The node which was inserted |

<a name="NodeService+cloneNode"></a>

### textService.cloneNode([deep]) ⇒ <code>PseudoNode</code>
Make a copy of this node (without its parent, and without its event listeners). With deep the children are copied
too, all the way down.

**Kind**: instance method of [<code>TextService</code>](#TextService)  
**Overrides**: [<code>cloneNode</code>](#NodeService+cloneNode)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [deep] | <code>boolean</code> | <code>false</code> | Copy the children as well |

<a name="NodeService+compareDocumentPosition"></a>

### textService.compareDocumentPosition(otherNode) ⇒ <code>number</code>
Say where another node is in relation to this one, as the bits of NodeService.DOCUMENT_POSITION_*: 0 for this node
itself, DISCONNECTED (with IMPLEMENTATION_SPECIFIC and a consistent PRECEDING or FOLLOWING) for a node in another tree,
CONTAINS + PRECEDING when the other node is an ancestor, CONTAINED_BY + FOLLOWING when it is a descendant,
otherwise PRECEDING or FOLLOWING by their order in the tree.

**Kind**: instance method of [<code>TextService</code>](#TextService)  
**Overrides**: [<code>compareDocumentPosition</code>](#NodeService+compareDocumentPosition)  

| Param | Type | Description |
| --- | --- | --- |
| otherNode | <code>PseudoNode</code> | The node to locate |

<a name="NodeService+contains"></a>

### textService.contains(otherNode) ⇒ <code>boolean</code>
Check whether a node is this node or one of its descendants.

**Kind**: instance method of [<code>TextService</code>](#TextService)  
**Overrides**: [<code>contains</code>](#NodeService+contains)  

| Param | Type | Description |
| --- | --- | --- |
| otherNode | <code>PseudoNode</code> \| <code>null</code> | The node to look for |

<a name="NodeService+insertBefore"></a>

### textService.insertBefore(newNode, [referenceNode]) ⇒ <code>PseudoNode</code>
Insert a node as a child of this node, before the given child (or at the end when there is none). A node which is
already in a tree is moved, and the children of a document fragment are moved in order.

**Kind**: instance method of [<code>TextService</code>](#TextService)  
**Overrides**: [<code>insertBefore</code>](#NodeService+insertBefore)  
**Returns**: <code>PseudoNode</code> - The inserted node  
**Throws**:

- <code>Error</code> When the reference node is not a child of this node, or the new node is this node or contains it


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| newNode | <code>PseudoNode</code> |  | The node to insert |
| [referenceNode] | <code>PseudoNode</code> \| <code>null</code> | <code></code> | The child of this node to insert before, or null to insert at the end |

<a name="NodeService+isEqualNode"></a>

### textService.isEqualNode(otherNode) ⇒ <code>boolean</code>
Whether another node is the same as this one, by what they hold: the same type, name and value (an element also
needs the same attributes), and children which are equal in the same order.

**Kind**: instance method of [<code>TextService</code>](#TextService)  
**Overrides**: [<code>isEqualNode</code>](#NodeService+isEqualNode)  

| Param | Type | Description |
| --- | --- | --- |
| otherNode | <code>PseudoNode</code> \| <code>null</code> | The node to compare with |

<a name="NodeService+normalize"></a>

### textService.normalize()
Tidy the text below this node: neighbouring text nodes are joined into one and empty text nodes are removed.

**Kind**: instance method of [<code>TextService</code>](#TextService)  
**Overrides**: [<code>normalize</code>](#NodeService+normalize)  
<a name="NodeService+removeChild"></a>

### textService.removeChild(childElement) ⇒ <code>PseudoNode</code>
Remove a child from this node, it no longer has a parent or siblings afterwards.

**Kind**: instance method of [<code>TextService</code>](#TextService)  
**Overrides**: [<code>removeChild</code>](#NodeService+removeChild)  
**Returns**: <code>PseudoNode</code> - The removed node  
**Throws**:

- <code>Error</code> When the node is not a child of this node


| Param | Type | Description |
| --- | --- | --- |
| childElement | <code>PseudoNode</code> | The child node to remove |

<a name="NodeService+replaceChild"></a>

### textService.replaceChild(newChild, oldChild) ⇒ <code>PseudoNode</code>
Replace a child of this node with another node (which is moved if it is already in a tree).

**Kind**: instance method of [<code>TextService</code>](#TextService)  
**Overrides**: [<code>replaceChild</code>](#NodeService+replaceChild)  
**Returns**: <code>PseudoNode</code> - The replaced node  
**Throws**:

- <code>Error</code> When the old node is not a child of this node


| Param | Type | Description |
| --- | --- | --- |
| newChild | <code>PseudoNode</code> | The node which takes the place |
| oldChild | <code>PseudoNode</code> | The child of this node to replace |

<a name="CommentService"></a>

## CommentService ⇐ [<code>NodeService</code>](#NodeService)
Simulate the behaviour of the Comment Class when there is no DOM available: a note in the markup which is not shown.

**Kind**: global class  
**Extends**: [<code>NodeService</code>](#NodeService)  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| data | <code>string</code> | The comment |
| length | <code>number</code> | How many characters there are |


* [CommentService](#CommentService) ⇐ [<code>NodeService</code>](#NodeService)
    * [new CommentService([data])](#new_CommentService_new)
    * [.acceptsChildren](#NodeService+acceptsChildren) ⇒ <code>boolean</code>
    * [.appendChild(childNode)](#NodeService+appendChild) ⇒ <code>PseudoNode</code>
    * [.cloneShallow()](#NodeService+cloneShallow) ⇒ [<code>NodeService</code>](#NodeService)
    * [.equalsShallow(other)](#NodeService+equalsShallow) ⇒ <code>boolean</code>
    * [.append(...nodes)](#NodeService+append)
    * [.prepend(...nodes)](#NodeService+prepend)
    * [.replaceChildren(...nodes)](#NodeService+replaceChildren)
    * [.before(...nodes)](#NodeService+before)
    * [.after(...nodes)](#NodeService+after)
    * [.replaceWith(...nodes)](#NodeService+replaceWith)
    * [.remove()](#NodeService+remove)
    * [.toChildNode(value)](#NodeService+toChildNode) ⇒ <code>PseudoNode</code>
    * [.getElementsByTagName(tagName)](#NodeService+getElementsByTagName) ⇒ <code>PseudoHTMLCollection</code>
    * [.getElementsByClassName(className)](#NodeService+getElementsByClassName) ⇒ <code>PseudoHTMLCollection</code>
    * [.getElementsByTagNameNS(namespace, tagName)](#NodeService+getElementsByTagNameNS) ⇒ <code>PseudoHTMLCollection</code>
    * [.querySelector(selectors)](#NodeService+querySelector) ⇒ <code>PseudoElement</code> \| <code>null</code>
    * [.querySelectorAll(selectors)](#NodeService+querySelectorAll) ⇒ <code>Array.&lt;PseudoElement&gt;</code>
    * [.childInserted(child)](#NodeService+childInserted)
    * [.cloneNode([deep])](#NodeService+cloneNode) ⇒ <code>PseudoNode</code>
    * [.compareDocumentPosition(otherNode)](#NodeService+compareDocumentPosition) ⇒ <code>number</code>
    * [.contains(otherNode)](#NodeService+contains) ⇒ <code>boolean</code>
    * [.insertBefore(newNode, [referenceNode])](#NodeService+insertBefore) ⇒ <code>PseudoNode</code>
    * [.isEqualNode(otherNode)](#NodeService+isEqualNode) ⇒ <code>boolean</code>
    * [.normalize()](#NodeService+normalize)
    * [.removeChild(childElement)](#NodeService+removeChild) ⇒ <code>PseudoNode</code>
    * [.replaceChild(newChild, oldChild)](#NodeService+replaceChild) ⇒ <code>PseudoNode</code>

<a name="new_CommentService_new"></a>

### new CommentService([data])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [data] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | The comment |

<a name="NodeService+acceptsChildren"></a>

### commentService.acceptsChildren ⇒ <code>boolean</code>
Whether this kind of node can have children (text, comments and attributes cannot).

**Kind**: instance property of [<code>CommentService</code>](#CommentService)  
**Overrides**: [<code>acceptsChildren</code>](#NodeService+acceptsChildren)  
<a name="NodeService+appendChild"></a>

### commentService.appendChild(childNode) ⇒ <code>PseudoNode</code>
Add a node as the last child of this node (a node which is already in a tree is moved).

**Kind**: instance method of [<code>CommentService</code>](#CommentService)  
**Overrides**: [<code>appendChild</code>](#NodeService+appendChild)  
**Returns**: <code>PseudoNode</code> - The added node  

| Param | Type | Description |
| --- | --- | --- |
| childNode | <code>PseudoNode</code> | The node to add |

<a name="NodeService+cloneShallow"></a>

### commentService.cloneShallow() ⇒ [<code>NodeService</code>](#NodeService)
Make a copy of this node without its children, its parent or its listeners, which is what cloneNode starts from.
Kinds of node which are made with arguments override this to give them.

**Kind**: instance method of [<code>CommentService</code>](#CommentService)  
**Overrides**: [<code>cloneShallow</code>](#NodeService+cloneShallow)  
<a name="NodeService+equalsShallow"></a>

### commentService.equalsShallow(other) ⇒ <code>boolean</code>
Whether another node of the same type is equal to this one apart from its children, which isEqualNode compares
afterwards. Kinds of node with more to compare (an element has attributes) override this.

**Kind**: instance method of [<code>CommentService</code>](#CommentService)  
**Overrides**: [<code>equalsShallow</code>](#NodeService+equalsShallow)  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>NodeService</code>](#NodeService) | The node to compare with |

<a name="NodeService+append"></a>

### commentService.append(...nodes)
Add nodes (strings become text nodes) as the last children of this node, in the order given.

**Kind**: instance method of [<code>CommentService</code>](#CommentService)  
**Overrides**: [<code>append</code>](#NodeService+append)  
**Throws**:

- <code>Error</code> When this kind of node cannot have children


| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+prepend"></a>

### commentService.prepend(...nodes)
Add nodes (strings become text nodes) as the first children of this node, in the order given.

**Kind**: instance method of [<code>CommentService</code>](#CommentService)  
**Overrides**: [<code>prepend</code>](#NodeService+prepend)  
**Throws**:

- <code>Error</code> When this kind of node cannot have children


| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+replaceChildren"></a>

### commentService.replaceChildren(...nodes)
Remove every child of this node and put the given nodes (strings become text nodes) in their place, in order.

**Kind**: instance method of [<code>CommentService</code>](#CommentService)  
**Overrides**: [<code>replaceChildren</code>](#NodeService+replaceChildren)  
**Throws**:

- <code>Error</code> When this kind of node cannot have children


| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+before"></a>

### commentService.before(...nodes)
Add nodes (strings become text nodes) as this node's previous siblings, in order. Does nothing when this node has
no parent.

**Kind**: instance method of [<code>CommentService</code>](#CommentService)  
**Overrides**: [<code>before</code>](#NodeService+before)  

| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+after"></a>

### commentService.after(...nodes)
Add nodes (strings become text nodes) as this node's next siblings, in order. Does nothing when this node has no
parent.

**Kind**: instance method of [<code>CommentService</code>](#CommentService)  
**Overrides**: [<code>after</code>](#NodeService+after)  

| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+replaceWith"></a>

### commentService.replaceWith(...nodes)
Put the given nodes (strings become text nodes) where this node is, in order, then remove this node. Does nothing
when this node has no parent.

**Kind**: instance method of [<code>CommentService</code>](#CommentService)  
**Overrides**: [<code>replaceWith</code>](#NodeService+replaceWith)  

| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to put in this node's place |

<a name="NodeService+remove"></a>

### commentService.remove()
Remove this node from its parent. Does nothing when it has no parent.

**Kind**: instance method of [<code>CommentService</code>](#CommentService)  
**Overrides**: [<code>remove</code>](#NodeService+remove)  
<a name="NodeService+toChildNode"></a>

### commentService.toChildNode(value) ⇒ <code>PseudoNode</code>
Turn a value given to append / prepend / before / after / replaceWith / replaceChildren into a node: a string
becomes a text node belonging to this node's document, anything else is returned as it is.

**Kind**: instance method of [<code>CommentService</code>](#CommentService)  
**Overrides**: [<code>toChildNode</code>](#NodeService+toChildNode)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>PseudoNode</code> \| <code>string</code> | The value to add |

<a name="NodeService+getElementsByTagName"></a>

### commentService.getElementsByTagName(tagName) ⇒ <code>PseudoHTMLCollection</code>
Every element below this node with the given tag name (or every element when tagName is *), live.

**Kind**: instance method of [<code>CommentService</code>](#CommentService)  
**Overrides**: [<code>getElementsByTagName</code>](#NodeService+getElementsByTagName)  

| Param | Type |
| --- | --- |
| tagName | <code>string</code> | 

<a name="NodeService+getElementsByClassName"></a>

### commentService.getElementsByClassName(className) ⇒ <code>PseudoHTMLCollection</code>
Every element below this node which has all of the given (space separated) classes, live.

**Kind**: instance method of [<code>CommentService</code>](#CommentService)  
**Overrides**: [<code>getElementsByClassName</code>](#NodeService+getElementsByClassName)  

| Param | Type |
| --- | --- |
| className | <code>string</code> | 

<a name="NodeService+getElementsByTagNameNS"></a>

### commentService.getElementsByTagNameNS(namespace, tagName) ⇒ <code>PseudoHTMLCollection</code>
Every element below this node with the given tag name, live. There is no real namespace parsing here, so this
ignores the namespace and behaves exactly like getElementsByTagName.

**Kind**: instance method of [<code>CommentService</code>](#CommentService)  
**Overrides**: [<code>getElementsByTagNameNS</code>](#NodeService+getElementsByTagNameNS)  

| Param | Type | Description |
| --- | --- | --- |
| namespace | <code>string</code> | Ignored |
| tagName | <code>string</code> |  |

<a name="NodeService+querySelector"></a>

### commentService.querySelector(selectors) ⇒ <code>PseudoElement</code> \| <code>null</code>
The first element below this node which matches the CSS selector, in tree order, or null when there is none.

**Kind**: instance method of [<code>CommentService</code>](#CommentService)  
**Overrides**: [<code>querySelector</code>](#NodeService+querySelector)  

| Param | Type | Description |
| --- | --- | --- |
| selectors | <code>string</code> | A CSS selector |

<a name="NodeService+querySelectorAll"></a>

### commentService.querySelectorAll(selectors) ⇒ <code>Array.&lt;PseudoElement&gt;</code>
Every element below this node which matches the CSS selector, in tree order. A plain array (not a live
collection): like the DOM's querySelectorAll, it is a snapshot taken when it is called.

**Kind**: instance method of [<code>CommentService</code>](#CommentService)  
**Overrides**: [<code>querySelectorAll</code>](#NodeService+querySelectorAll)  

| Param | Type | Description |
| --- | --- | --- |
| selectors | <code>string</code> | A CSS selector |

<a name="NodeService+childInserted"></a>

### commentService.childInserted(child)
Called each time a node has been inserted as a child of this node, so that nodes which need to react to children
(for example elements applying default events) can do so.

**Kind**: instance method of [<code>CommentService</code>](#CommentService)  
**Overrides**: [<code>childInserted</code>](#NodeService+childInserted)  

| Param | Type | Description |
| --- | --- | --- |
| child | [<code>NodeService</code>](#NodeService) | The node which was inserted |

<a name="NodeService+cloneNode"></a>

### commentService.cloneNode([deep]) ⇒ <code>PseudoNode</code>
Make a copy of this node (without its parent, and without its event listeners). With deep the children are copied
too, all the way down.

**Kind**: instance method of [<code>CommentService</code>](#CommentService)  
**Overrides**: [<code>cloneNode</code>](#NodeService+cloneNode)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [deep] | <code>boolean</code> | <code>false</code> | Copy the children as well |

<a name="NodeService+compareDocumentPosition"></a>

### commentService.compareDocumentPosition(otherNode) ⇒ <code>number</code>
Say where another node is in relation to this one, as the bits of NodeService.DOCUMENT_POSITION_*: 0 for this node
itself, DISCONNECTED (with IMPLEMENTATION_SPECIFIC and a consistent PRECEDING or FOLLOWING) for a node in another tree,
CONTAINS + PRECEDING when the other node is an ancestor, CONTAINED_BY + FOLLOWING when it is a descendant,
otherwise PRECEDING or FOLLOWING by their order in the tree.

**Kind**: instance method of [<code>CommentService</code>](#CommentService)  
**Overrides**: [<code>compareDocumentPosition</code>](#NodeService+compareDocumentPosition)  

| Param | Type | Description |
| --- | --- | --- |
| otherNode | <code>PseudoNode</code> | The node to locate |

<a name="NodeService+contains"></a>

### commentService.contains(otherNode) ⇒ <code>boolean</code>
Check whether a node is this node or one of its descendants.

**Kind**: instance method of [<code>CommentService</code>](#CommentService)  
**Overrides**: [<code>contains</code>](#NodeService+contains)  

| Param | Type | Description |
| --- | --- | --- |
| otherNode | <code>PseudoNode</code> \| <code>null</code> | The node to look for |

<a name="NodeService+insertBefore"></a>

### commentService.insertBefore(newNode, [referenceNode]) ⇒ <code>PseudoNode</code>
Insert a node as a child of this node, before the given child (or at the end when there is none). A node which is
already in a tree is moved, and the children of a document fragment are moved in order.

**Kind**: instance method of [<code>CommentService</code>](#CommentService)  
**Overrides**: [<code>insertBefore</code>](#NodeService+insertBefore)  
**Returns**: <code>PseudoNode</code> - The inserted node  
**Throws**:

- <code>Error</code> When the reference node is not a child of this node, or the new node is this node or contains it


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| newNode | <code>PseudoNode</code> |  | The node to insert |
| [referenceNode] | <code>PseudoNode</code> \| <code>null</code> | <code></code> | The child of this node to insert before, or null to insert at the end |

<a name="NodeService+isEqualNode"></a>

### commentService.isEqualNode(otherNode) ⇒ <code>boolean</code>
Whether another node is the same as this one, by what they hold: the same type, name and value (an element also
needs the same attributes), and children which are equal in the same order.

**Kind**: instance method of [<code>CommentService</code>](#CommentService)  
**Overrides**: [<code>isEqualNode</code>](#NodeService+isEqualNode)  

| Param | Type | Description |
| --- | --- | --- |
| otherNode | <code>PseudoNode</code> \| <code>null</code> | The node to compare with |

<a name="NodeService+normalize"></a>

### commentService.normalize()
Tidy the text below this node: neighbouring text nodes are joined into one and empty text nodes are removed.

**Kind**: instance method of [<code>CommentService</code>](#CommentService)  
**Overrides**: [<code>normalize</code>](#NodeService+normalize)  
<a name="NodeService+removeChild"></a>

### commentService.removeChild(childElement) ⇒ <code>PseudoNode</code>
Remove a child from this node, it no longer has a parent or siblings afterwards.

**Kind**: instance method of [<code>CommentService</code>](#CommentService)  
**Overrides**: [<code>removeChild</code>](#NodeService+removeChild)  
**Returns**: <code>PseudoNode</code> - The removed node  
**Throws**:

- <code>Error</code> When the node is not a child of this node


| Param | Type | Description |
| --- | --- | --- |
| childElement | <code>PseudoNode</code> | The child node to remove |

<a name="NodeService+replaceChild"></a>

### commentService.replaceChild(newChild, oldChild) ⇒ <code>PseudoNode</code>
Replace a child of this node with another node (which is moved if it is already in a tree).

**Kind**: instance method of [<code>CommentService</code>](#CommentService)  
**Overrides**: [<code>replaceChild</code>](#NodeService+replaceChild)  
**Returns**: <code>PseudoNode</code> - The replaced node  
**Throws**:

- <code>Error</code> When the old node is not a child of this node


| Param | Type | Description |
| --- | --- | --- |
| newChild | <code>PseudoNode</code> | The node which takes the place |
| oldChild | <code>PseudoNode</code> | The child of this node to replace |

<a name="NamedNodeMapService"></a>

## NamedNodeMapService
Simulate the behaviour of the NamedNodeMap Class when there is no DOM available.

**Kind**: global class  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  
<a name="new_NamedNodeMapService_new"></a>

### new NamedNodeMapService([attributes])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [attributes] | <code>Array.&lt;PseudoAttr&gt;</code> | <code>[]</code> | The attributes to start with |

<a name="MouseEventService"></a>

## MouseEventService ⇐ [<code>UIEventService</code>](#UIEventService)
Simulate the behaviour of the MouseEvent Class when there is no DOM available.

**Kind**: global class  
**Extends**: [<code>UIEventService</code>](#UIEventService)  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  
**Properties**

| Name | Type |
| --- | --- |
| screenX | <code>number</code> | 
| screenY | <code>number</code> | 
| clientX | <code>number</code> | 
| clientY | <code>number</code> | 
| button | <code>number</code> | 
| buttons | <code>number</code> | 
| relatedTarget | <code>PseudoEventTarget</code> \| <code>null</code> | 


* [MouseEventService](#MouseEventService) ⇐ [<code>UIEventService</code>](#UIEventService)
    * [new MouseEventService([typeArg], [init])](#new_MouseEventService_new)
    * [.inner](#EventService+inner) ⇒ <code>EventInner</code>
    * [.getModifierState(key)](#MouseEventService+getModifierState) ⇒ <code>boolean</code>
    * [.composedPath()](#EventService+composedPath) ⇒ <code>Array.&lt;PseudoEventTarget&gt;</code>
    * [.preventDefault()](#EventService+preventDefault) ⇒ <code>null</code>
    * [.stopImmediatePropagation()](#EventService+stopImmediatePropagation) ⇒ <code>null</code>
    * [.stopPropagation()](#EventService+stopPropagation) ⇒ <code>null</code>

<a name="new_MouseEventService_new"></a>

### new MouseEventService([typeArg], [init])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [typeArg] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | The type of the event |
| [init] | <code>MouseEventInit</code> | <code>{}</code> | The options for the event |

<a name="EventService+inner"></a>

### mouseEventService.inner ⇒ <code>EventInner</code>
Scope several accessors inside the inner object. These are only intended for usage by other DOM classes.

**Kind**: instance property of [<code>MouseEventService</code>](#MouseEventService)  
**Overrides**: [<code>inner</code>](#EventService+inner)  
<a name="MouseEventService+getModifierState"></a>

### mouseEventService.getModifierState(key) ⇒ <code>boolean</code>
Whether a modifier key was held down when the event happened.

**Kind**: instance method of [<code>MouseEventService</code>](#MouseEventService)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | Control, Shift, Alt or Meta |

<a name="EventService+composedPath"></a>

### mouseEventService.composedPath() ⇒ <code>Array.&lt;PseudoEventTarget&gt;</code>
Return an array of targets that will have the event executed open them. The order is based on the eventPhase

**Kind**: instance method of [<code>MouseEventService</code>](#MouseEventService)  
**Overrides**: [<code>composedPath</code>](#EventService+composedPath)  
<a name="EventService+preventDefault"></a>

### mouseEventService.preventDefault() ⇒ <code>null</code>
Cancels the event (if it is cancelable).

**Kind**: instance method of [<code>MouseEventService</code>](#MouseEventService)  
**Overrides**: [<code>preventDefault</code>](#EventService+preventDefault)  
<a name="EventService+stopImmediatePropagation"></a>

### mouseEventService.stopImmediatePropagation() ⇒ <code>null</code>
For this particular event, no other listener will be called.
Neither those attached on the same element, nor those attached on elements which will be traversed later (in
capture phase, for instance)

**Kind**: instance method of [<code>MouseEventService</code>](#MouseEventService)  
**Overrides**: [<code>stopImmediatePropagation</code>](#EventService+stopImmediatePropagation)  
<a name="EventService+stopPropagation"></a>

### mouseEventService.stopPropagation() ⇒ <code>null</code>
Stops the propagation of events further along in the Dom.

**Kind**: instance method of [<code>MouseEventService</code>](#MouseEventService)  
**Overrides**: [<code>stopPropagation</code>](#EventService+stopPropagation)  
<a name="KeyboardEventService"></a>

## KeyboardEventService ⇐ [<code>UIEventService</code>](#UIEventService)
Simulate the behaviour of the KeyboardEvent Class when there is no DOM available.

**Kind**: global class  
**Extends**: [<code>UIEventService</code>](#UIEventService)  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  
**Properties**

| Name | Type |
| --- | --- |
| key | <code>string</code> | 
| code | <code>string</code> | 
| location | <code>number</code> | 
| repeat | <code>boolean</code> | 
| isComposing | <code>boolean</code> | 


* [KeyboardEventService](#KeyboardEventService) ⇐ [<code>UIEventService</code>](#UIEventService)
    * [new KeyboardEventService([typeArg], [init])](#new_KeyboardEventService_new)
    * [.inner](#EventService+inner) ⇒ <code>EventInner</code>
    * [.getModifierState(key)](#KeyboardEventService+getModifierState) ⇒ <code>boolean</code>
    * [.composedPath()](#EventService+composedPath) ⇒ <code>Array.&lt;PseudoEventTarget&gt;</code>
    * [.preventDefault()](#EventService+preventDefault) ⇒ <code>null</code>
    * [.stopImmediatePropagation()](#EventService+stopImmediatePropagation) ⇒ <code>null</code>
    * [.stopPropagation()](#EventService+stopPropagation) ⇒ <code>null</code>

<a name="new_KeyboardEventService_new"></a>

### new KeyboardEventService([typeArg], [init])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [typeArg] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | The type of the event |
| [init] | <code>KeyboardEventInit</code> | <code>{}</code> | The options for the event |

<a name="EventService+inner"></a>

### keyboardEventService.inner ⇒ <code>EventInner</code>
Scope several accessors inside the inner object. These are only intended for usage by other DOM classes.

**Kind**: instance property of [<code>KeyboardEventService</code>](#KeyboardEventService)  
**Overrides**: [<code>inner</code>](#EventService+inner)  
<a name="KeyboardEventService+getModifierState"></a>

### keyboardEventService.getModifierState(key) ⇒ <code>boolean</code>
Whether a modifier key was held down when the event happened.

**Kind**: instance method of [<code>KeyboardEventService</code>](#KeyboardEventService)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | Control, Shift, Alt or Meta |

<a name="EventService+composedPath"></a>

### keyboardEventService.composedPath() ⇒ <code>Array.&lt;PseudoEventTarget&gt;</code>
Return an array of targets that will have the event executed open them. The order is based on the eventPhase

**Kind**: instance method of [<code>KeyboardEventService</code>](#KeyboardEventService)  
**Overrides**: [<code>composedPath</code>](#EventService+composedPath)  
<a name="EventService+preventDefault"></a>

### keyboardEventService.preventDefault() ⇒ <code>null</code>
Cancels the event (if it is cancelable).

**Kind**: instance method of [<code>KeyboardEventService</code>](#KeyboardEventService)  
**Overrides**: [<code>preventDefault</code>](#EventService+preventDefault)  
<a name="EventService+stopImmediatePropagation"></a>

### keyboardEventService.stopImmediatePropagation() ⇒ <code>null</code>
For this particular event, no other listener will be called.
Neither those attached on the same element, nor those attached on elements which will be traversed later (in
capture phase, for instance)

**Kind**: instance method of [<code>KeyboardEventService</code>](#KeyboardEventService)  
**Overrides**: [<code>stopImmediatePropagation</code>](#EventService+stopImmediatePropagation)  
<a name="EventService+stopPropagation"></a>

### keyboardEventService.stopPropagation() ⇒ <code>null</code>
Stops the propagation of events further along in the Dom.

**Kind**: instance method of [<code>KeyboardEventService</code>](#KeyboardEventService)  
**Overrides**: [<code>stopPropagation</code>](#EventService+stopPropagation)  
<a name="InputEventService"></a>

## InputEventService ⇐ [<code>UIEventService</code>](#UIEventService)
Simulate the behaviour of the InputEvent Class when there is no DOM available.

**Kind**: global class  
**Extends**: [<code>UIEventService</code>](#UIEventService)  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  
**Properties**

| Name | Type |
| --- | --- |
| data | <code>string</code> \| <code>null</code> | 
| inputType | <code>string</code> | 
| isComposing | <code>boolean</code> | 


* [InputEventService](#InputEventService) ⇐ [<code>UIEventService</code>](#UIEventService)
    * [new InputEventService([typeArg], [init])](#new_InputEventService_new)
    * [.inner](#EventService+inner) ⇒ <code>EventInner</code>
    * [.composedPath()](#EventService+composedPath) ⇒ <code>Array.&lt;PseudoEventTarget&gt;</code>
    * [.preventDefault()](#EventService+preventDefault) ⇒ <code>null</code>
    * [.stopImmediatePropagation()](#EventService+stopImmediatePropagation) ⇒ <code>null</code>
    * [.stopPropagation()](#EventService+stopPropagation) ⇒ <code>null</code>

<a name="new_InputEventService_new"></a>

### new InputEventService([typeArg], [init])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [typeArg] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | The type of the event |
| [init] | <code>InputEventInit</code> | <code>{}</code> | The options for the event |

<a name="EventService+inner"></a>

### inputEventService.inner ⇒ <code>EventInner</code>
Scope several accessors inside the inner object. These are only intended for usage by other DOM classes.

**Kind**: instance property of [<code>InputEventService</code>](#InputEventService)  
**Overrides**: [<code>inner</code>](#EventService+inner)  
<a name="EventService+composedPath"></a>

### inputEventService.composedPath() ⇒ <code>Array.&lt;PseudoEventTarget&gt;</code>
Return an array of targets that will have the event executed open them. The order is based on the eventPhase

**Kind**: instance method of [<code>InputEventService</code>](#InputEventService)  
**Overrides**: [<code>composedPath</code>](#EventService+composedPath)  
<a name="EventService+preventDefault"></a>

### inputEventService.preventDefault() ⇒ <code>null</code>
Cancels the event (if it is cancelable).

**Kind**: instance method of [<code>InputEventService</code>](#InputEventService)  
**Overrides**: [<code>preventDefault</code>](#EventService+preventDefault)  
<a name="EventService+stopImmediatePropagation"></a>

### inputEventService.stopImmediatePropagation() ⇒ <code>null</code>
For this particular event, no other listener will be called.
Neither those attached on the same element, nor those attached on elements which will be traversed later (in
capture phase, for instance)

**Kind**: instance method of [<code>InputEventService</code>](#InputEventService)  
**Overrides**: [<code>stopImmediatePropagation</code>](#EventService+stopImmediatePropagation)  
<a name="EventService+stopPropagation"></a>

### inputEventService.stopPropagation() ⇒ <code>null</code>
Stops the propagation of events further along in the Dom.

**Kind**: instance method of [<code>InputEventService</code>](#InputEventService)  
**Overrides**: [<code>stopPropagation</code>](#EventService+stopPropagation)  
<a name="HTMLElementService"></a>

## HTMLElementService ⇐ <code>PseudoElement</code>
Simulate the behaviour of the HTMLElement Class when there is no DOM available.

**Kind**: global class  
**Extends**: <code>PseudoElement</code>  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| hidden | <code>boolean</code> | State of whether element is visible |
| offsetHeight | <code>number</code> | The height of the element as offset by the parent element |
| offsetLeft | <code>number</code> | The position of the left side of the element based on the parent element |
| offsetParent | <code>PseudoHTMLElement</code> | A reference to the closest positioned parent element |
| offsetTop | <code>number</code> | The position of the top side of the element based on the parent element |
| offsetWidth | <code>number</code> | The width of the element as offset by the parent element |
| style | [<code>CSSStyleDeclarationService</code>](#CSSStyleDeclarationService) | The element's inline styles, live and settable per property |
| dataset | <code>Object.&lt;string, string&gt;</code> | The element's data-* attributes, live, under their camelCase names |
| title | <code>string</code> | The title attribute which affects the text visible on hover |


* [HTMLElementService](#HTMLElementService) ⇐ <code>PseudoElement</code>
    * [new HTMLElementService([elementOptions])](#new_HTMLElementService_new)
    * [.style](#HTMLElementService+style) ⇒ [<code>CSSStyleDeclarationService</code>](#CSSStyleDeclarationService)
    * [.dataset](#HTMLElementService+dataset) ⇒ <code>Object.&lt;string, string&gt;</code>
    * [.value](#HTMLElementService+value) ⇒ <code>string</code> \| <code>undefined</code>
    * [.checked](#HTMLElementService+checked) ⇒ <code>boolean</code> \| <code>undefined</code>
    * [.innerHTML](#HTMLElementService+innerHTML) ⇒ <code>undefined</code>
    * [.outerHTML](#HTMLElementService+outerHTML) ⇒ <code>undefined</code>
    * [.canFocus](#HTMLElementService+canFocus) ⇒ <code>boolean</code>
    * [.hasValueProperty()](#HTMLElementService+hasValueProperty) ⇒ <code>boolean</code>
    * [.hasCheckedProperty()](#HTMLElementService+hasCheckedProperty) ⇒ <code>boolean</code>
    * [.setExpando(name, value)](#HTMLElementService+setExpando) ⇒ <code>undefined</code>
    * [.cloneShallow()](#HTMLElementService+cloneShallow) ⇒ [<code>NodeService</code>](#NodeService)
    * [.equalsShallow(other)](#HTMLElementService+equalsShallow) ⇒ <code>boolean</code>
    * [.parse(html)](#HTMLElementService+parse) ⇒ <code>Array.&lt;\*&gt;</code>
    * [.insertAdjacentHTML(position, html)](#HTMLElementService+insertAdjacentHTML) ⇒ <code>undefined</code>
    * [.click()](#HTMLElementService+click)
    * [.focus()](#HTMLElementService+focus)
    * [.blur()](#HTMLElementService+blur)

<a name="new_HTMLElementService_new"></a>

### new HTMLElementService([elementOptions])
Simulate the HTMLElement object when the Dom is not available


| Param | Type | Default |
| --- | --- | --- |
| [elementOptions] | <code>Object</code> | <code>{}</code> | 
| [elementOptions.tagName] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | 
| [elementOptions.parent] | <code>PseudoNode</code> \| <code>Object</code> | <code>{}</code> | 
| [elementOptions.children] | <code>Array</code> | <code>[]</code> | 

<a name="HTMLElementService+style"></a>

### htmlElementService.style ⇒ [<code>CSSStyleDeclarationService</code>](#CSSStyleDeclarationService)
The element's inline styles: a live CSSStyleDeclaration-like object, so both style.setProperty('color', 'red')
and style.color = 'red' work.

**Kind**: instance property of [<code>HTMLElementService</code>](#HTMLElementService)  
<a name="HTMLElementService+dataset"></a>

### htmlElementService.dataset ⇒ <code>Object.&lt;string, string&gt;</code>
The element's data-* attributes, live, under their camelCase names (data-foo-bar <-> dataset.fooBar). Backed
directly by getAttribute / setAttribute, so it is never out of sync with the attributes themselves.

**Kind**: instance property of [<code>HTMLElementService</code>](#HTMLElementService)  
<a name="HTMLElementService+value"></a>

### htmlElementService.value ⇒ <code>string</code> \| <code>undefined</code>
The current value of a form control. Until it is set (or edited), it is the value attribute (the default value),
or '' when there is none ('on' for a checkbox or radio); setting it never changes the attribute, like the DOM's.
Only form controls (input, textarea, select, button, option, output) have one.

**Kind**: instance property of [<code>HTMLElementService</code>](#HTMLElementService)  
<a name="HTMLElementService+checked"></a>

### htmlElementService.checked ⇒ <code>boolean</code> \| <code>undefined</code>
Whether a checkbox or radio input is checked. Until it is set, it follows the checked attribute (which sets the
default); setting it never changes the attribute, like the DOM's. Only input has one.

**Kind**: instance property of [<code>HTMLElementService</code>](#HTMLElementService)  
<a name="HTMLElementService+innerHTML"></a>

### htmlElementService.innerHTML ⇒ <code>undefined</code>
Replace this element's children by parsing html. innerHTML's setter is here rather than on ElementService (which
only has the getter) because building the new elements needs a concrete element class - see parse().

**Kind**: instance property of [<code>HTMLElementService</code>](#HTMLElementService)  

| Param | Type |
| --- | --- |
| html | <code>string</code> | 

<a name="HTMLElementService+outerHTML"></a>

### htmlElementService.outerHTML ⇒ <code>undefined</code>
Replace this element itself, in its parent, by parsing html. Does nothing when it has no parent, like
replaceWith. outerHTML's setter is here rather than on ElementService for the same reason as innerHTML's.

**Kind**: instance property of [<code>HTMLElementService</code>](#HTMLElementService)  

| Param | Type |
| --- | --- |
| html | <code>string</code> | 

<a name="HTMLElementService+canFocus"></a>

### htmlElementService.canFocus ⇒ <code>boolean</code>
Whether this element can have the focus: form controls and links which are not disabled, and anything with a tabindex.

**Kind**: instance property of [<code>HTMLElementService</code>](#HTMLElementService)  
<a name="HTMLElementService+hasValueProperty"></a>

### htmlElementService.hasValueProperty() ⇒ <code>boolean</code>
Whether this tag has a `value` (the form controls which do).

**Kind**: instance method of [<code>HTMLElementService</code>](#HTMLElementService)  
<a name="HTMLElementService+hasCheckedProperty"></a>

### htmlElementService.hasCheckedProperty() ⇒ <code>boolean</code>
Whether this tag has a `checked` (only input does).

**Kind**: instance method of [<code>HTMLElementService</code>](#HTMLElementService)  
<a name="HTMLElementService+setExpando"></a>

### htmlElementService.setExpando(name, value) ⇒ <code>undefined</code>
Put a plain own property on the element, as assigning a property this element does not have does in the DOM.

**Kind**: instance method of [<code>HTMLElementService</code>](#HTMLElementService)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| value | <code>\*</code> | 

<a name="HTMLElementService+cloneShallow"></a>

### htmlElementService.cloneShallow() ⇒ [<code>NodeService</code>](#NodeService)
Style is not attribute-backed like most properties (see the constructor), so cloneNode needs its own copy of it,
and a form control keeps its current value and checkedness (as the DOM's cloneNode does).

**Kind**: instance method of [<code>HTMLElementService</code>](#HTMLElementService)  
<a name="HTMLElementService+equalsShallow"></a>

### htmlElementService.equalsShallow(other) ⇒ <code>boolean</code>
Style is not attribute-backed like most properties, so isEqualNode needs to compare it separately too.

**Kind**: instance method of [<code>HTMLElementService</code>](#HTMLElementService)  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>NodeService</code>](#NodeService) | The node to compare with |

<a name="HTMLElementService+parse"></a>

### htmlElementService.parse(html) ⇒ <code>Array.&lt;\*&gt;</code>
Parses html with this class building each new element (matches HTML: parsed elements behave like plain
HTMLElements, not whatever specialized class happens to be setting innerHTML / outerHTML).

**Kind**: instance method of [<code>HTMLElementService</code>](#HTMLElementService)  

| Param | Type |
| --- | --- |
| html | <code>string</code> | 

<a name="HTMLElementService+insertAdjacentHTML"></a>

### htmlElementService.insertAdjacentHTML(position, html) ⇒ <code>undefined</code>
Parse html and insert the resulting nodes at the given position, like insertAdjacentElement /
insertAdjacentText.

**Kind**: instance method of [<code>HTMLElementService</code>](#HTMLElementService)  
**Throws**:

- <code>Error</code> When the position is not one of the four above


| Param | Type | Description |
| --- | --- | --- |
| position | <code>string</code> | beforebegin, afterbegin, beforeend or afterend |
| html | <code>string</code> | The markup to parse |

<a name="HTMLElementService+click"></a>

### htmlElementService.click()
Click the element: a click event is sent to it, which bubbles and can be cancelled, like one from a user but a
script made it (so it is not trusted). A disabled element does nothing.

**Kind**: instance method of [<code>HTMLElementService</code>](#HTMLElementService)  
<a name="HTMLElementService+focus"></a>

### htmlElementService.focus()
Give the element the focus. The element which had it gets blur then focusout, and this one gets focus then
focusin (blur and focus do not bubble, focusin and focusout do). Nothing happens when the element cannot have the
focus or already has it.

**Kind**: instance method of [<code>HTMLElementService</code>](#HTMLElementService)  
<a name="HTMLElementService+blur"></a>

### htmlElementService.blur()
Take the focus away from the element, when it has it: it gets blur then focusout.

**Kind**: instance method of [<code>HTMLElementService</code>](#HTMLElementService)  
<a name="HTMLCollectionService"></a>

## HTMLCollectionService
Simulate the behaviour of the HTMLCollection Class when there is no DOM available: a live view of some of a node's
element descendants, recomputed each time it is used rather than kept in sync as they change.

**Kind**: global class  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  

* [HTMLCollectionService](#HTMLCollectionService)
    * [new HTMLCollectionService(owner, [predicate], [deep])](#new_HTMLCollectionService_new)
    * [.length](#HTMLCollectionService+length) ⇒ <code>number</code>
    * [.elements()](#HTMLCollectionService+elements) ⇒ <code>Array.&lt;PseudoNode&gt;</code>
    * [.item(index)](#HTMLCollectionService+item) ⇒ <code>\*</code>
    * [.namedItem(name)](#HTMLCollectionService+namedItem) ⇒ <code>\*</code>

<a name="new_HTMLCollectionService_new"></a>

### new HTMLCollectionService(owner, [predicate], [deep])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| owner | [<code>NodeService</code>](#NodeService) |  | The node this is a live view of a part of |
| [predicate] | <code>function</code> |  | Only elements which pass this are included (every element by default) |
| [deep] | <code>boolean</code> | <code>false</code> | Include every matching descendant (true, like getElementsByTagName), not just the direct element children (false, like Element.children) |

<a name="HTMLCollectionService+length"></a>

### htmlCollectionService.length ⇒ <code>number</code>
How many elements are in the collection right now.

**Kind**: instance property of [<code>HTMLCollectionService</code>](#HTMLCollectionService)  
<a name="HTMLCollectionService+elements"></a>

### htmlCollectionService.elements() ⇒ <code>Array.&lt;PseudoNode&gt;</code>
The current elements the collection holds, in tree order.

**Kind**: instance method of [<code>HTMLCollectionService</code>](#HTMLCollectionService)  
<a name="HTMLCollectionService+item"></a>

### htmlCollectionService.item(index) ⇒ <code>\*</code>
The element at the given index, or null when there is none.

**Kind**: instance method of [<code>HTMLCollectionService</code>](#HTMLCollectionService)  

| Param | Type |
| --- | --- |
| index | <code>number</code> | 

<a name="HTMLCollectionService+namedItem"></a>

### htmlCollectionService.namedItem(name) ⇒ <code>\*</code>
The element whose id, or (failing that) whose name attribute, is the given value, or null when there is none.

**Kind**: instance method of [<code>HTMLCollectionService</code>](#HTMLCollectionService)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 

<a name="FocusEventService"></a>

## FocusEventService ⇐ [<code>UIEventService</code>](#UIEventService)
Simulate the behaviour of the FocusEvent Class when there is no DOM available.

**Kind**: global class  
**Extends**: [<code>UIEventService</code>](#UIEventService)  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  
**Properties**

| Name | Type |
| --- | --- |
| relatedTarget | <code>PseudoEventTarget</code> \| <code>null</code> | 


* [FocusEventService](#FocusEventService) ⇐ [<code>UIEventService</code>](#UIEventService)
    * [new FocusEventService([typeArg], [init])](#new_FocusEventService_new)
    * [.inner](#EventService+inner) ⇒ <code>EventInner</code>
    * [.composedPath()](#EventService+composedPath) ⇒ <code>Array.&lt;PseudoEventTarget&gt;</code>
    * [.preventDefault()](#EventService+preventDefault) ⇒ <code>null</code>
    * [.stopImmediatePropagation()](#EventService+stopImmediatePropagation) ⇒ <code>null</code>
    * [.stopPropagation()](#EventService+stopPropagation) ⇒ <code>null</code>

<a name="new_FocusEventService_new"></a>

### new FocusEventService([typeArg], [init])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [typeArg] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | The type of the event |
| [init] | <code>FocusEventInit</code> | <code>{}</code> | The options for the event |

<a name="EventService+inner"></a>

### focusEventService.inner ⇒ <code>EventInner</code>
Scope several accessors inside the inner object. These are only intended for usage by other DOM classes.

**Kind**: instance property of [<code>FocusEventService</code>](#FocusEventService)  
**Overrides**: [<code>inner</code>](#EventService+inner)  
<a name="EventService+composedPath"></a>

### focusEventService.composedPath() ⇒ <code>Array.&lt;PseudoEventTarget&gt;</code>
Return an array of targets that will have the event executed open them. The order is based on the eventPhase

**Kind**: instance method of [<code>FocusEventService</code>](#FocusEventService)  
**Overrides**: [<code>composedPath</code>](#EventService+composedPath)  
<a name="EventService+preventDefault"></a>

### focusEventService.preventDefault() ⇒ <code>null</code>
Cancels the event (if it is cancelable).

**Kind**: instance method of [<code>FocusEventService</code>](#FocusEventService)  
**Overrides**: [<code>preventDefault</code>](#EventService+preventDefault)  
<a name="EventService+stopImmediatePropagation"></a>

### focusEventService.stopImmediatePropagation() ⇒ <code>null</code>
For this particular event, no other listener will be called.
Neither those attached on the same element, nor those attached on elements which will be traversed later (in
capture phase, for instance)

**Kind**: instance method of [<code>FocusEventService</code>](#FocusEventService)  
**Overrides**: [<code>stopImmediatePropagation</code>](#EventService+stopImmediatePropagation)  
<a name="EventService+stopPropagation"></a>

### focusEventService.stopPropagation() ⇒ <code>null</code>
Stops the propagation of events further along in the Dom.

**Kind**: instance method of [<code>FocusEventService</code>](#FocusEventService)  
**Overrides**: [<code>stopPropagation</code>](#EventService+stopPropagation)  
<a name="EventTargetService"></a>

## EventTargetService
Simulate the behaviour of the EventTarget Class when there is no DOM available.
Dispatching an event sends it through the tree the way the DOM does: down from the root to the target (capture
listeners), to the target itself, then back up to the root (the listeners which are not capture listeners, when the
event bubbles).

**Kind**: global class  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  
**Properties**

| Name | Type |
| --- | --- |
| listeners | <code>Object.&lt;string, Array.&lt;PseudoEventListener&gt;&gt;</code> | 
| addEventListener | <code>function</code> | 
| removeEventListener | <code>function</code> | 
| dispatchEvent | <code>function</code> | 


* [EventTargetService](#EventTargetService)
    * [.listenersFor(type)](#EventTargetService+listenersFor) ⇒ <code>LinkedList</code>
    * [.runEvents(event)](#EventTargetService+runEvents) ⇒ <code>Array.&lt;\*&gt;</code>
    * [.removeListener(type, listener)](#EventTargetService+removeListener)
    * [.setDefaultEvent(type, callback)](#EventTargetService+setDefaultEvent)
    * [.addEventListener(type, callback, [useCapture])](#EventTargetService+addEventListener)
    * [.removeEventListener(type, callback, [options])](#EventTargetService+removeEventListener)
    * [.dispatchEvent(event)](#EventTargetService+dispatchEvent) ⇒ <code>boolean</code>

<a name="EventTargetService+listenersFor"></a>

### eventTargetService.listenersFor(type) ⇒ <code>LinkedList</code>
The listeners registered for a type of event, creating the (empty) list of them when there are none yet.

**Kind**: instance method of [<code>EventTargetService</code>](#EventTargetService)  

| Param | Type |
| --- | --- |
| type | <code>string</code> | 

<a name="EventTargetService+runEvents"></a>

### eventTargetService.runEvents(event) ⇒ <code>Array.&lt;\*&gt;</code>
Run the listeners registered on this target for the type of the event which apply to the phase the event is in
(at the target, the capture listeners run before the others). Listeners which are added while this runs do not run
for this event, and listeners which are removed while it runs no longer do. Running stops as soon as immediate
propagation is stopped. A listener which throws does not stop the others.

**Kind**: instance method of [<code>EventTargetService</code>](#EventTargetService)  
**Returns**: <code>Array.&lt;\*&gt;</code> - The errors which the listeners threw  

| Param | Type | Description |
| --- | --- | --- |
| event | [<code>EventService</code>](#EventService) | The event, which is at a phase and has a current target |

<a name="EventTargetService+removeListener"></a>

### eventTargetService.removeListener(type, listener)
Take a listener out of the registered listeners, so that it does not run again.

**Kind**: instance method of [<code>EventTargetService</code>](#EventTargetService)  

| Param | Type |
| --- | --- |
| type | <code>string</code> | 
| listener | [<code>PseudoEventListener</code>](#PseudoEventListener) | 

<a name="EventTargetService+setDefaultEvent"></a>

### eventTargetService.setDefaultEvent(type, callback)
Register the function to run when nothing else has prevented the default for this type of event.

**Kind**: instance method of [<code>EventTargetService</code>](#EventTargetService)  

| Param | Type |
| --- | --- |
| type | <code>string</code> | 
| callback | <code>function</code> | 

<a name="EventTargetService+addEventListener"></a>

### eventTargetService.addEventListener(type, callback, [useCapture])
Registers an event handler of a specific event type. Adding the same handler again for the same type and phase does
nothing, like the DOM.

**Kind**: instance method of [<code>EventTargetService</code>](#EventTargetService)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| type | <code>string</code> |  | The type of event to listen for |
| callback | <code>function</code> \| <code>Object</code> |  | The function to call (or an object with a handleEvent function) |
| [useCapture] | <code>Object</code> \| <code>boolean</code> | <code>false</code> | Listen while the event travels down to the target (true), or an object with capture, once and passive |

<a name="EventTargetService+removeEventListener"></a>

### eventTargetService.removeEventListener(type, callback, [options])
Removes an event listener, the one which was added with the same type, handler and phase.

**Kind**: instance method of [<code>EventTargetService</code>](#EventTargetService)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| type | <code>string</code> |  | The type of event |
| callback | <code>function</code> \| <code>Object</code> |  | The handler which was added |
| [options] | <code>Object</code> \| <code>boolean</code> | <code>false</code> | Whether the listener was a capture listener (true), or an object with capture |

<a name="EventTargetService+dispatchEvent"></a>

### eventTargetService.dispatchEvent(event) ⇒ <code>boolean</code>
Dispatches an event to this target and through the tree: capture listeners of the ancestors from the root down,
then the listeners of this target, then (when the event bubbles) the other listeners of the ancestors from the
parent up to the root. stopPropagation() stops it reaching further targets, stopImmediatePropagation() also stops
the remaining listeners of the current target. Afterwards, unless the default was prevented, the default action
of this target (see setDefaultEvent) runs. The event can be dispatched again afterwards.

**Kind**: instance method of [<code>EventTargetService</code>](#EventTargetService)  
**Returns**: <code>boolean</code> - False when the event was cancelable and a listener prevented the default, otherwise true  
**Throws**:

- <code>Error</code> When the event is already being dispatched, or (after the whole dispatch has finished) the error
which a listener threw (an error with all of them in its errors property when several did)


| Param | Type | Description |
| --- | --- | --- |
| event | [<code>EventService</code>](#EventService) | The event to dispatch |

<a name="EventService"></a>

## EventService
Simulate the behaviour of the Event Class when there is no DOM available.

**Kind**: global class  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| NONE | <code>number</code> |  |
| CAPTURING_PHASE | <code>number</code> |  |
| AT_TARGET | <code>number</code> |  |
| BUBBLING_PHASE | <code>number</code> |  |
| bubbles | <code>boolean</code> | A Boolean indicating whether the event bubbles up through the Dom or not. |
| cancelable | <code>boolean</code> | A Boolean indicating whether the event is cancelable. |
| composed | <code>boolean</code> | A Boolean value indicating whether the event can bubble across the boundary between the shadow Dom and the regular Dom. |
| currentTarget | <code>function</code> \| <code>PseudoEventTarget</code> | A reference to the currently registered target for the event. This is the object to which the event is currently slated to be sent; it's possible this has been changed along the way through re-targeting. |
| defaultPrevented | <code>boolean</code> | Indicates whether event.preventDefault() has been called on the event. |
| immediatePropagationStopped | <code>boolean</code> | Flag that no further propagation should occur, including on current target. |
| propagationStopped | <code>boolean</code> | Flag that no further propagation should occur. |
| eventPhase | <code>int</code> | Indicates which phase of the event flow is being processed. Uses EventService constants. |
| target | <code>EventTarget</code> \| <code>PseudoEventTarget</code> | A reference to the target to which the event was originally dispatched. |
| timeStamp | <code>int</code> | The time at which the event was created (in milliseconds). By specification, this value is time since epoch, but in reality browsers' definitions vary; in addition, work is underway to change this to be a DomHighResTimeStamp instead. |
| type | <code>string</code> | The name of the event (case-insensitive). |
| isTrusted | <code>boolean</code> | Indicates whether the event was initiated by the browser (after a user click for instance) or by a script (using an event creation method, like event.initEvent) |


* [EventService](#EventService)
    * [new EventService(typeArg, [eventOptions])](#new_EventService_new)
    * [.inner](#EventService+inner) ⇒ <code>EventInner</code>
    * [.composedPath()](#EventService+composedPath) ⇒ <code>Array.&lt;PseudoEventTarget&gt;</code>
    * [.preventDefault()](#EventService+preventDefault) ⇒ <code>null</code>
    * [.stopImmediatePropagation()](#EventService+stopImmediatePropagation) ⇒ <code>null</code>
    * [.stopPropagation()](#EventService+stopPropagation) ⇒ <code>null</code>

<a name="new_EventService_new"></a>

### new EventService(typeArg, [eventOptions])

| Param | Type | Default |
| --- | --- | --- |
| typeArg | <code>string</code> |  | 
| [eventOptions] | <code>Object</code> | <code>{}</code> | 
| [eventOptions.bubbles] | <code>boolean</code> | <code>false</code> | 
| [eventOptions.cancelable] | <code>boolean</code> | <code>false</code> | 
| [eventOptions.composed] | <code>boolean</code> | <code>false</code> | 

<a name="EventService+inner"></a>

### eventService.inner ⇒ <code>EventInner</code>
Scope several accessors inside the inner object. These are only intended for usage by other DOM classes.

**Kind**: instance property of [<code>EventService</code>](#EventService)  
<a name="EventService+composedPath"></a>

### eventService.composedPath() ⇒ <code>Array.&lt;PseudoEventTarget&gt;</code>
Return an array of targets that will have the event executed open them. The order is based on the eventPhase

**Kind**: instance method of [<code>EventService</code>](#EventService)  
<a name="EventService+preventDefault"></a>

### eventService.preventDefault() ⇒ <code>null</code>
Cancels the event (if it is cancelable).

**Kind**: instance method of [<code>EventService</code>](#EventService)  
<a name="EventService+stopImmediatePropagation"></a>

### eventService.stopImmediatePropagation() ⇒ <code>null</code>
For this particular event, no other listener will be called.
Neither those attached on the same element, nor those attached on elements which will be traversed later (in
capture phase, for instance)

**Kind**: instance method of [<code>EventService</code>](#EventService)  
<a name="EventService+stopPropagation"></a>

### eventService.stopPropagation() ⇒ <code>null</code>
Stops the propagation of events further along in the Dom.

**Kind**: instance method of [<code>EventService</code>](#EventService)  
<a name="ElementService"></a>

## ElementService ⇐ <code>PseudoNode</code>
Simulate the behaviour of the Element Class when there is no DOM available.

**Kind**: global class  
**Extends**: <code>PseudoNode</code>  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  
**Properties**

| Name | Type |
| --- | --- |
| tagName | <code>string</code> | 
| className | <code>string</code> | 
| id | <code>string</code> | 
| innerHtml | <code>string</code> | 
| attributes | <code>Array</code> | 
| hasAttribute | <code>function</code> | 
| setAttribute | <code>function</code> | 
| getAttribute | <code>function</code> | 
| removeAttribute | <code>function</code> | 


* [ElementService](#ElementService) ⇐ <code>PseudoNode</code>
    * [new ElementService([settings])](#new_ElementService_new)
    * [.boundingClientRect](#ElementService+boundingClientRect)
    * [.clientRects](#ElementService+clientRects)
    * [.animations](#ElementService+animations)
    * [.isVisible](#ElementService+isVisible)
    * [.localName](#ElementService+localName) ⇒ <code>string</code>
    * [.prefix](#ElementService+prefix) ⇒ <code>string</code> \| <code>null</code>
    * [.innerHTML](#ElementService+innerHTML) ⇒ <code>string</code>
    * [.outerHTML](#ElementService+outerHTML) ⇒ <code>string</code>
    * [.children](#ElementService+children) ⇒ <code>PseudoHTMLCollection</code>
    * [.childElementCount](#ElementService+childElementCount) ⇒ <code>number</code>
    * [.firstElementChild](#ElementService+firstElementChild) ⇒ <code>PseudoElement</code> \| <code>null</code>
    * [.lastElementChild](#ElementService+lastElementChild) ⇒ <code>PseudoElement</code> \| <code>null</code>
    * [.nextElementSibling](#ElementService+nextElementSibling) ⇒ <code>PseudoElement</code> \| <code>null</code>
    * [.previousElementSibling](#ElementService+previousElementSibling) ⇒ <code>PseudoElement</code> \| <code>null</code>
    * [.shadowRoot](#ElementService+shadowRoot) ⇒ <code>PseudoShadowRoot</code> \| <code>null</code>
    * [.currentAttributes()](#ElementService+currentAttributes) ⇒ <code>Array.&lt;{name: string, value: \*}&gt;</code>
    * [.cloneShallow()](#ElementService+cloneShallow) ⇒ [<code>ElementService</code>](#ElementService)
    * [.equalsShallow(other)](#ElementService+equalsShallow) ⇒ <code>boolean</code>
    * [.insertAdjacentElement(position, element)](#ElementService+insertAdjacentElement) ⇒ [<code>ElementService</code>](#ElementService) \| <code>null</code>
    * [.insertAdjacentText(position, text)](#ElementService+insertAdjacentText)
    * [.insertAdjacent(position, node)](#ElementService+insertAdjacent) ⇒ <code>PseudoNode</code> \| <code>null</code>
    * [.insertAdjacentHTML(position, text)](#ElementService+insertAdjacentHTML)
    * [.matches(selectors)](#ElementService+matches) ⇒ <code>boolean</code>
    * [.closest(selectors)](#ElementService+closest) ⇒ <code>PseudoElement</code> \| <code>null</code>
    * [.childInserted(child)](#ElementService+childInserted)
    * [.hasAttribute(attributeName)](#ElementService+hasAttribute) ⇒ <code>boolean</code>
    * [.setAttribute(attributeName, attributeValue)](#ElementService+setAttribute) ⇒ <code>undefined</code>
    * [.getAttribute(attributeName)](#ElementService+getAttribute) ⇒ <code>string</code> \| <code>null</code>
    * [.removeAttribute(attributeName)](#ElementService+removeAttribute) ⇒ <code>undefined</code>
    * [.getAttributeNames()](#ElementService+getAttributeNames) ⇒ <code>Array.&lt;string&gt;</code>
    * [.hasAttributes()](#ElementService+hasAttributes) ⇒ <code>boolean</code>
    * [.getAttributeNode(attributeName)](#ElementService+getAttributeNode) ⇒ [<code>AttrService</code>](#AttrService) \| <code>null</code>
    * [.getAttributeNodeNS(namespace, attributeName)](#ElementService+getAttributeNodeNS) ⇒ [<code>AttrService</code>](#AttrService) \| <code>null</code>
    * [.getAttributeNS(namespace, attributeName)](#ElementService+getAttributeNS) ⇒ <code>string</code> \| <code>null</code>
    * [.hasAttributeNS(namespace, attributeName)](#ElementService+hasAttributeNS) ⇒ <code>boolean</code>
    * [.removeAttributeNode(attr)](#ElementService+removeAttributeNode) ⇒ [<code>AttrService</code>](#AttrService)
    * [.removeAttributeNS(namespace, attributeName)](#ElementService+removeAttributeNS) ⇒ <code>undefined</code>
    * [.setAttributeNode(attr)](#ElementService+setAttributeNode) ⇒ [<code>AttrService</code>](#AttrService) \| <code>null</code>
    * [.setAttributeNodeNS(attr)](#ElementService+setAttributeNodeNS) ⇒ [<code>AttrService</code>](#AttrService) \| <code>null</code>
    * [.setAttributeNS(namespace, attributeName, attributeValue)](#ElementService+setAttributeNS) ⇒ <code>undefined</code>
    * [.toggleAttribute(attributeName, [force])](#ElementService+toggleAttribute) ⇒ <code>boolean</code>
    * [.getBoundingClientRect()](#ElementService+getBoundingClientRect) ⇒ <code>DOMRect</code>
    * [.getClientRects()](#ElementService+getClientRects) ⇒ <code>Array.&lt;DOMRect&gt;</code>
    * [.getAnimations()](#ElementService+getAnimations) ⇒ <code>Array.&lt;\*&gt;</code>
    * [.checkVisibility()](#ElementService+checkVisibility) ⇒ <code>boolean</code>
    * [.computedStyleMap()](#ElementService+computedStyleMap) ⇒ <code>Object</code>
    * [.hasPointerCapture(pointerId)](#ElementService+hasPointerCapture) ⇒ <code>boolean</code>
    * [.setPointerCapture(pointerId)](#ElementService+setPointerCapture) ⇒ <code>undefined</code>
    * [.releasePointerCapture(pointerId)](#ElementService+releasePointerCapture) ⇒ <code>undefined</code>
    * [.scroll([x], [y])](#ElementService+scroll) ⇒ <code>undefined</code>
    * [.scrollTo([x], [y])](#ElementService+scrollTo) ⇒ <code>undefined</code>
    * [.scrollBy([x], [y])](#ElementService+scrollBy) ⇒ <code>undefined</code>
    * [.scrollIntoView()](#ElementService+scrollIntoView) ⇒ <code>undefined</code>
    * [.requestFullscreen()](#ElementService+requestFullscreen) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.requestPointerLock()](#ElementService+requestPointerLock) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.attachShadow(options)](#ElementService+attachShadow) ⇒ <code>PseudoShadowRoot</code>
    * [.getAriaAttribute(attributeName)](#ElementService+getAriaAttribute) ⇒ <code>string</code>
    * [.setAriaAttribute(attributeName, value)](#ElementService+setAriaAttribute) ⇒ <code>undefined</code>

<a name="new_ElementService_new"></a>

### new ElementService([settings])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [settings] | <code>Object</code> | <code>{}</code> |  |
| [settings.tagName] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | The name of the tag this element represents |
| [settings.attributes] | <code>Array.&lt;{name: string, value: \*}&gt;</code> | <code>[]</code> | The attributes (also assigned as properties) to start with |
| [settings.parent] | <code>PseudoNode</code> \| <code>null</code> | <code></code> | The node to add this element to as its last child |
| [settings.children] | <code>Array.&lt;PseudoNode&gt;</code> | <code>[]</code> | The nodes to start as children |

<a name="ElementService+boundingClientRect"></a>

### elementService.boundingClientRect
What getBoundingClientRect() returns - not really computed (there is no layout engine), set this directly.

**Kind**: instance property of [<code>ElementService</code>](#ElementService)  
<a name="ElementService+clientRects"></a>

### elementService.clientRects
What getClientRects() returns - set this directly.

**Kind**: instance property of [<code>ElementService</code>](#ElementService)  
<a name="ElementService+animations"></a>

### elementService.animations
What getAnimations() returns - set this directly.

**Kind**: instance property of [<code>ElementService</code>](#ElementService)  
<a name="ElementService+isVisible"></a>

### elementService.isVisible
What checkVisibility() returns - set this directly.

**Kind**: instance property of [<code>ElementService</code>](#ElementService)  
<a name="ElementService+localName"></a>

### elementService.localName ⇒ <code>string</code>
The local part of the element's qualified name. There is no real namespace parsing here, so this is always the
same as tagName.

**Kind**: instance property of [<code>ElementService</code>](#ElementService)  
<a name="ElementService+prefix"></a>

### elementService.prefix ⇒ <code>string</code> \| <code>null</code>
The element's namespace prefix, or null when it has none. There is no real namespace parsing here, so this is
always null.

**Kind**: instance property of [<code>ElementService</code>](#ElementService)  
<a name="ElementService+innerHTML"></a>

### elementService.innerHTML ⇒ <code>string</code>
The HTML markup of this element's children. Only the getter is here (the setter, which needs to build new
elements from parsed HTML, is on HTMLElementService - see its class comment).

**Kind**: instance property of [<code>ElementService</code>](#ElementService)  
<a name="ElementService+outerHTML"></a>

### elementService.outerHTML ⇒ <code>string</code>
The HTML markup of this element itself, including its children. Only the getter is here (see innerHTML).

**Kind**: instance property of [<code>ElementService</code>](#ElementService)  
<a name="ElementService+children"></a>

### elementService.children ⇒ <code>PseudoHTMLCollection</code>
A live view of this element's element children (text, comments and the like are not included).

**Kind**: instance property of [<code>ElementService</code>](#ElementService)  
<a name="ElementService+childElementCount"></a>

### elementService.childElementCount ⇒ <code>number</code>
How many element children this element has.

**Kind**: instance property of [<code>ElementService</code>](#ElementService)  
<a name="ElementService+firstElementChild"></a>

### elementService.firstElementChild ⇒ <code>PseudoElement</code> \| <code>null</code>
The first child of this element which is an element, or null when there is none.

**Kind**: instance property of [<code>ElementService</code>](#ElementService)  
<a name="ElementService+lastElementChild"></a>

### elementService.lastElementChild ⇒ <code>PseudoElement</code> \| <code>null</code>
The last child of this element which is an element, or null when there is none.

**Kind**: instance property of [<code>ElementService</code>](#ElementService)  
<a name="ElementService+nextElementSibling"></a>

### elementService.nextElementSibling ⇒ <code>PseudoElement</code> \| <code>null</code>
The sibling after this one which is an element, or null when there is none.

**Kind**: instance property of [<code>ElementService</code>](#ElementService)  
<a name="ElementService+previousElementSibling"></a>

### elementService.previousElementSibling ⇒ <code>PseudoElement</code> \| <code>null</code>
The sibling before this one which is an element, or null when there is none.

**Kind**: instance property of [<code>ElementService</code>](#ElementService)  
<a name="ElementService+shadowRoot"></a>

### elementService.shadowRoot ⇒ <code>PseudoShadowRoot</code> \| <code>null</code>
This element's shadow root, when it has one attached in 'open' mode, or null (including when the mode is
'closed' - it still exists, but is not reachable this way, like the DOM's).

**Kind**: instance property of [<code>ElementService</code>](#ElementService)  
<a name="ElementService+currentAttributes"></a>

### elementService.currentAttributes() ⇒ <code>Array.&lt;{name: string, value: \*}&gt;</code>
The attributes with the values they have now: the ones which are also properties (className, id, style, ...) can
have been changed through the property, which does not change the stored list.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  
<a name="ElementService+cloneShallow"></a>

### elementService.cloneShallow() ⇒ [<code>ElementService</code>](#ElementService)
A copy of this element without its children: the same tag and attributes (the values which are objects, such as
style, are copied too rather than shared), but not its parent or listeners.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  
<a name="ElementService+equalsShallow"></a>

### elementService.equalsShallow(other) ⇒ <code>boolean</code>
Elements are equal when they have the same tag and the same attributes (in any order), which is what isEqualNode
checks before it compares the children.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>NodeService</code>](#NodeService) | The element to compare with |

<a name="ElementService+insertAdjacentElement"></a>

### elementService.insertAdjacentElement(position, element) ⇒ [<code>ElementService</code>](#ElementService) \| <code>null</code>
Put an element at a position relative to this one: beforebegin (before this element, as its previous sibling),
afterbegin (as this element's first child), beforeend (as this element's last child) or afterend (after this
element, as its next sibling).

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  
**Returns**: [<code>ElementService</code>](#ElementService) \| <code>null</code> - The inserted element, or null when the position needed a parent this element does not have  
**Throws**:

- <code>Error</code> When the position is not one of the four above


| Param | Type | Description |
| --- | --- | --- |
| position | <code>string</code> | beforebegin, afterbegin, beforeend or afterend |
| element | [<code>ElementService</code>](#ElementService) | The element to insert |

<a name="ElementService+insertAdjacentText"></a>

### elementService.insertAdjacentText(position, text)
Put text at a position relative to this element, the same as insertAdjacentElement but the text becomes a text node.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  
**Throws**:

- <code>Error</code> When the position is not one of the four above


| Param | Type | Description |
| --- | --- | --- |
| position | <code>string</code> | beforebegin, afterbegin, beforeend or afterend |
| text | <code>string</code> | The text to insert |

<a name="ElementService+insertAdjacent"></a>

### elementService.insertAdjacent(position, node) ⇒ <code>PseudoNode</code> \| <code>null</code>
Shared implementation for insertAdjacentElement / insertAdjacentText.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  
**Returns**: <code>PseudoNode</code> \| <code>null</code> - The inserted node, or null when the position needed a parent this element does not have  
**Throws**:

- <code>Error</code> When the position is not one of the four above


| Param | Type | Description |
| --- | --- | --- |
| position | <code>string</code> | beforebegin, afterbegin, beforeend or afterend |
| node | <code>PseudoNode</code> \| <code>string</code> | The node (or text) to insert |

<a name="ElementService+insertAdjacentHTML"></a>

### elementService.insertAdjacentHTML(position, text)
Not implemented yet (HTML parsing is out of scope for now).

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  
**Throws**:

- <code>Error</code> 


| Param | Type | Description |
| --- | --- | --- |
| position | <code>string</code> | beforebegin, afterbegin, beforeend or afterend |
| text | <code>string</code> | The markup which would be parsed |

<a name="ElementService+matches"></a>

### elementService.matches(selectors) ⇒ <code>boolean</code>
Whether this element itself (not its descendants) matches the given CSS selector.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  

| Param | Type | Description |
| --- | --- | --- |
| selectors | <code>string</code> | A CSS selector |

<a name="ElementService+closest"></a>

### elementService.closest(selectors) ⇒ <code>PseudoElement</code> \| <code>null</code>
The nearest ancestor of this element (starting with this element itself) which matches the CSS selector, or
null when none of them do.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  

| Param | Type | Description |
| --- | --- | --- |
| selectors | <code>string</code> | A CSS selector |

<a name="ElementService+childInserted"></a>

### elementService.childInserted(child)
An element which is added as a child gets its default events (for example a submit button submits its form).

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  

| Param | Type | Description |
| --- | --- | --- |
| child | [<code>NodeService</code>](#NodeService) | The node which was inserted |

<a name="ElementService+hasAttribute"></a>

### elementService.hasAttribute(attributeName) ⇒ <code>boolean</code>
Check whether the element has an attribute by that name.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  

| Param | Type |
| --- | --- |
| attributeName | <code>string</code> | 

<a name="ElementService+setAttribute"></a>

### elementService.setAttribute(attributeName, attributeValue) ⇒ <code>undefined</code>
Set the value of an attribute, adding the attribute if it did not exist.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  

| Param | Type |
| --- | --- |
| attributeName | <code>string</code> | 
| attributeValue | <code>string</code> | 

<a name="ElementService+getAttribute"></a>

### elementService.getAttribute(attributeName) ⇒ <code>string</code> \| <code>null</code>
Retrieve the value of an attribute.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  
**Returns**: <code>string</code> \| <code>null</code> - The value, or null when there is no such attribute  

| Param | Type |
| --- | --- |
| attributeName | <code>string</code> | 

<a name="ElementService+removeAttribute"></a>

### elementService.removeAttribute(attributeName) ⇒ <code>undefined</code>
Remove an attribute from the element.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  

| Param | Type |
| --- | --- |
| attributeName | <code>string</code> | 

<a name="ElementService+getAttributeNames"></a>

### elementService.getAttributeNames() ⇒ <code>Array.&lt;string&gt;</code>
The name of every attribute on the element, in the order they were set.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  
<a name="ElementService+hasAttributes"></a>

### elementService.hasAttributes() ⇒ <code>boolean</code>
Whether the element has any attributes at all.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  
<a name="ElementService+getAttributeNode"></a>

### elementService.getAttributeNode(attributeName) ⇒ [<code>AttrService</code>](#AttrService) \| <code>null</code>
Retrieve the node representation of an attribute.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  
**Returns**: [<code>AttrService</code>](#AttrService) \| <code>null</code> - An Attr for the attribute, or null when there is no such attribute  

| Param | Type |
| --- | --- |
| attributeName | <code>string</code> | 

<a name="ElementService+getAttributeNodeNS"></a>

### elementService.getAttributeNodeNS(namespace, attributeName) ⇒ [<code>AttrService</code>](#AttrService) \| <code>null</code>
Retrieve the node representation of an attribute. There is no real namespace parsing here, so this ignores
the namespace and behaves exactly like getAttributeNode.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  
**Returns**: [<code>AttrService</code>](#AttrService) \| <code>null</code> - An Attr for the attribute, or null when there is no such attribute  

| Param | Type | Description |
| --- | --- | --- |
| namespace | <code>string</code> | Ignored |
| attributeName | <code>string</code> |  |

<a name="ElementService+getAttributeNS"></a>

### elementService.getAttributeNS(namespace, attributeName) ⇒ <code>string</code> \| <code>null</code>
Retrieve the value of an attribute. There is no real namespace parsing here, so this ignores the namespace
and behaves exactly like getAttribute.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  
**Returns**: <code>string</code> \| <code>null</code> - The value, or null when there is no such attribute  

| Param | Type | Description |
| --- | --- | --- |
| namespace | <code>string</code> | Ignored |
| attributeName | <code>string</code> |  |

<a name="ElementService+hasAttributeNS"></a>

### elementService.hasAttributeNS(namespace, attributeName) ⇒ <code>boolean</code>
Check whether the element has an attribute by that name. There is no real namespace parsing here, so this
ignores the namespace and behaves exactly like hasAttribute.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  

| Param | Type | Description |
| --- | --- | --- |
| namespace | <code>string</code> | Ignored |
| attributeName | <code>string</code> |  |

<a name="ElementService+removeAttributeNode"></a>

### elementService.removeAttributeNode(attr) ⇒ [<code>AttrService</code>](#AttrService)
Remove the node representation of an attribute from the element, and return it.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  
**Returns**: [<code>AttrService</code>](#AttrService) - The removed Attr  
**Throws**:

- <code>Error</code> When the element has no attribute matching attr.name


| Param | Type |
| --- | --- |
| attr | [<code>AttrService</code>](#AttrService) | 

<a name="ElementService+removeAttributeNS"></a>

### elementService.removeAttributeNS(namespace, attributeName) ⇒ <code>undefined</code>
Remove an attribute from the element. There is no real namespace parsing here, so this ignores the namespace
and behaves exactly like removeAttribute.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  

| Param | Type | Description |
| --- | --- | --- |
| namespace | <code>string</code> | Ignored |
| attributeName | <code>string</code> |  |

<a name="ElementService+setAttributeNode"></a>

### elementService.setAttributeNode(attr) ⇒ [<code>AttrService</code>](#AttrService) \| <code>null</code>
Set the node representation of an attribute, adding the attribute if it did not exist. Returns any previous
Attr that had the same name, or null when there was none.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  
**Returns**: [<code>AttrService</code>](#AttrService) \| <code>null</code> - The replaced Attr, or null when the attribute was new  

| Param | Type |
| --- | --- |
| attr | [<code>AttrService</code>](#AttrService) | 

<a name="ElementService+setAttributeNodeNS"></a>

### elementService.setAttributeNodeNS(attr) ⇒ [<code>AttrService</code>](#AttrService) \| <code>null</code>
Set the node representation of an attribute. There is no real namespace parsing here, so this behaves
exactly like setAttributeNode (Attr.name already carries any prefix).

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  
**Returns**: [<code>AttrService</code>](#AttrService) \| <code>null</code> - The replaced Attr, or null when the attribute was new  

| Param | Type |
| --- | --- |
| attr | [<code>AttrService</code>](#AttrService) | 

<a name="ElementService+setAttributeNS"></a>

### elementService.setAttributeNS(namespace, attributeName, attributeValue) ⇒ <code>undefined</code>
Set the value of an attribute, adding the attribute if it did not exist. There is no real namespace parsing
here, so this ignores the namespace and behaves exactly like setAttribute.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  

| Param | Type | Description |
| --- | --- | --- |
| namespace | <code>string</code> | Ignored |
| attributeName | <code>string</code> |  |
| attributeValue | <code>string</code> |  |

<a name="ElementService+toggleAttribute"></a>

### elementService.toggleAttribute(attributeName, [force]) ⇒ <code>boolean</code>
Add the attribute (with an empty value) when it is not present, or remove it when it is - unless force says
which of those to do instead. Returns whether the attribute is present after the call.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  

| Param | Type |
| --- | --- |
| attributeName | <code>string</code> | 
| [force] | <code>boolean</code> | 

<a name="ElementService+getBoundingClientRect"></a>

### elementService.getBoundingClientRect() ⇒ <code>DOMRect</code>
The size of the element and its position, settable directly - there is no layout engine here to compute it.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  
<a name="ElementService+getClientRects"></a>

### elementService.getClientRects() ⇒ <code>Array.&lt;DOMRect&gt;</code>
The bounding rectangles for each line of text in the element, settable directly - there is no layout engine
here to compute it.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  
<a name="ElementService+getAnimations"></a>

### elementService.getAnimations() ⇒ <code>Array.&lt;\*&gt;</code>
The Animation objects currently active on the element, settable directly - there is no animation engine here.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  
<a name="ElementService+checkVisibility"></a>

### elementService.checkVisibility() ⇒ <code>boolean</code>
Whether the element is expected to be visible, settable directly - there is no rendering here to check it.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  
<a name="ElementService+computedStyleMap"></a>

### elementService.computedStyleMap() ⇒ <code>Object</code>
A read-only view of the element's own inline style declarations (there is no CSS cascade here, so this is not a
real computed style - just what the element's own style object holds).

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  
<a name="ElementService+hasPointerCapture"></a>

### elementService.hasPointerCapture(pointerId) ⇒ <code>boolean</code>
Whether this element currently has capture of the given pointer.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  

| Param | Type |
| --- | --- |
| pointerId | <code>number</code> | 

<a name="ElementService+setPointerCapture"></a>

### elementService.setPointerCapture(pointerId) ⇒ <code>undefined</code>
Give this element capture of the given pointer.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  

| Param | Type |
| --- | --- |
| pointerId | <code>number</code> | 

<a name="ElementService+releasePointerCapture"></a>

### elementService.releasePointerCapture(pointerId) ⇒ <code>undefined</code>
Release this element's capture of the given pointer, if it had it.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  

| Param | Type |
| --- | --- |
| pointerId | <code>number</code> | 

<a name="ElementService+scroll"></a>

### elementService.scroll([x], [y]) ⇒ <code>undefined</code>
Scroll to the given position (or, given an options object, the position(s) it has). There is no real scrollable
viewport here: this just sets scrollLeft / scrollTop.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  

| Param | Type | Default |
| --- | --- | --- |
| [x] | <code>number</code> \| <code>Object</code> | <code>0</code> | 
| [y] | <code>number</code> | <code>0</code> | 

<a name="ElementService+scrollTo"></a>

### elementService.scrollTo([x], [y]) ⇒ <code>undefined</code>
Scroll to the given position. An alias for scroll.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  

| Param | Type | Default |
| --- | --- | --- |
| [x] | <code>number</code> \| <code>Object</code> | <code>0</code> | 
| [y] | <code>number</code> | <code>0</code> | 

<a name="ElementService+scrollBy"></a>

### elementService.scrollBy([x], [y]) ⇒ <code>undefined</code>
Scroll by the given amount, relative to the current position.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  

| Param | Type | Default |
| --- | --- | --- |
| [x] | <code>number</code> \| <code>Object</code> | <code>0</code> | 
| [y] | <code>number</code> | <code>0</code> | 

<a name="ElementService+scrollIntoView"></a>

### elementService.scrollIntoView() ⇒ <code>undefined</code>
Scroll an ancestor until this element is in view. There is no real viewport here for that to mean anything, so
this does nothing (override it on an instance in a test which needs to observe the call).

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  
<a name="ElementService+requestFullscreen"></a>

### elementService.requestFullscreen() ⇒ <code>Promise.&lt;void&gt;</code>
Asynchronously ask for the element to be shown fullscreen. There is no real fullscreen here, so this just
resolves, like a browser granting the request would.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  
<a name="ElementService+requestPointerLock"></a>

### elementService.requestPointerLock() ⇒ <code>Promise.&lt;void&gt;</code>
Asynchronously ask for the pointer to be locked to this element. There is no real pointer lock here, so this
just resolves, like a browser granting the request would.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  
<a name="ElementService+attachShadow"></a>

### elementService.attachShadow(options) ⇒ <code>PseudoShadowRoot</code>
Attach a shadow tree to this element and return its ShadowRoot. Throws when it already hosts one.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  
**Throws**:

- <code>Error</code> 


| Param | Type |
| --- | --- |
| options | <code>Object</code> | 

<a name="ElementService+getAriaAttribute"></a>

### elementService.getAriaAttribute(attributeName) ⇒ <code>string</code>
Read one of the aria-* reflected properties (see the individual aria* getters/setters below).

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  

| Param | Type | Description |
| --- | --- | --- |
| attributeName | <code>string</code> | A real aria-* attribute name (aria-label, ...) |

<a name="ElementService+setAriaAttribute"></a>

### elementService.setAriaAttribute(attributeName, value) ⇒ <code>undefined</code>
Write one of the aria-* reflected properties.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  

| Param | Type | Description |
| --- | --- | --- |
| attributeName | <code>string</code> | A real aria-* attribute name (aria-label, ...) |
| value | <code>string</code> |  |

<a name="DocumentService"></a>

## DocumentService ⇐ [<code>NodeService</code>](#NodeService)
Simulate the behaviour of the Document Class when there is no DOM available.

**Kind**: global class  
**Extends**: [<code>NodeService</code>](#NodeService)  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  

* [DocumentService](#DocumentService) ⇐ [<code>NodeService</code>](#NodeService)
    * [.acceptsChildren](#NodeService+acceptsChildren) ⇒ <code>boolean</code>
    * [.getElementById(id)](#DocumentService+getElementById) ⇒ <code>PseudoElement</code> \| <code>null</code>
    * [.createElement([tagName])](#DocumentService+createElement) ⇒ <code>PseudoElement</code>
    * [.createTextNode([data])](#DocumentService+createTextNode) ⇒ [<code>TextService</code>](#TextService)
    * [.createComment([data])](#DocumentService+createComment) ⇒ [<code>CommentService</code>](#CommentService)
    * [.createDocumentFragment()](#DocumentService+createDocumentFragment) ⇒ [<code>DocumentFragmentService</code>](#DocumentFragmentService)
    * [.appendChild(childNode)](#NodeService+appendChild) ⇒ <code>PseudoNode</code>
    * [.cloneShallow()](#NodeService+cloneShallow) ⇒ [<code>NodeService</code>](#NodeService)
    * [.equalsShallow(other)](#NodeService+equalsShallow) ⇒ <code>boolean</code>
    * [.append(...nodes)](#NodeService+append)
    * [.prepend(...nodes)](#NodeService+prepend)
    * [.replaceChildren(...nodes)](#NodeService+replaceChildren)
    * [.before(...nodes)](#NodeService+before)
    * [.after(...nodes)](#NodeService+after)
    * [.replaceWith(...nodes)](#NodeService+replaceWith)
    * [.remove()](#NodeService+remove)
    * [.toChildNode(value)](#NodeService+toChildNode) ⇒ <code>PseudoNode</code>
    * [.getElementsByTagName(tagName)](#NodeService+getElementsByTagName) ⇒ <code>PseudoHTMLCollection</code>
    * [.getElementsByClassName(className)](#NodeService+getElementsByClassName) ⇒ <code>PseudoHTMLCollection</code>
    * [.getElementsByTagNameNS(namespace, tagName)](#NodeService+getElementsByTagNameNS) ⇒ <code>PseudoHTMLCollection</code>
    * [.querySelector(selectors)](#NodeService+querySelector) ⇒ <code>PseudoElement</code> \| <code>null</code>
    * [.querySelectorAll(selectors)](#NodeService+querySelectorAll) ⇒ <code>Array.&lt;PseudoElement&gt;</code>
    * [.childInserted(child)](#NodeService+childInserted)
    * [.cloneNode([deep])](#NodeService+cloneNode) ⇒ <code>PseudoNode</code>
    * [.compareDocumentPosition(otherNode)](#NodeService+compareDocumentPosition) ⇒ <code>number</code>
    * [.contains(otherNode)](#NodeService+contains) ⇒ <code>boolean</code>
    * [.insertBefore(newNode, [referenceNode])](#NodeService+insertBefore) ⇒ <code>PseudoNode</code>
    * [.isEqualNode(otherNode)](#NodeService+isEqualNode) ⇒ <code>boolean</code>
    * [.normalize()](#NodeService+normalize)
    * [.removeChild(childElement)](#NodeService+removeChild) ⇒ <code>PseudoNode</code>
    * [.replaceChild(newChild, oldChild)](#NodeService+replaceChild) ⇒ <code>PseudoNode</code>

<a name="NodeService+acceptsChildren"></a>

### documentService.acceptsChildren ⇒ <code>boolean</code>
Whether this kind of node can have children (text, comments and attributes cannot).

**Kind**: instance property of [<code>DocumentService</code>](#DocumentService)  
<a name="DocumentService+getElementById"></a>

### documentService.getElementById(id) ⇒ <code>PseudoElement</code> \| <code>null</code>
The first element, in tree order, whose id matches the given value, or null when there is none.

**Kind**: instance method of [<code>DocumentService</code>](#DocumentService)  

| Param | Type |
| --- | --- |
| id | <code>string</code> | 

<a name="DocumentService+createElement"></a>

### documentService.createElement([tagName]) ⇒ <code>PseudoElement</code>
Make an element of the given type which belongs to this document but is not added anywhere until it is appended.

**Kind**: instance method of [<code>DocumentService</code>](#DocumentService)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [tagName] | <code>string</code> | <code>&quot;&#x27;div&#x27;&quot;</code> | The type of element to create |

<a name="DocumentService+createTextNode"></a>

### documentService.createTextNode([data]) ⇒ [<code>TextService</code>](#TextService)
Make a text node which belongs to this document.

**Kind**: instance method of [<code>DocumentService</code>](#DocumentService)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [data] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | The text |

<a name="DocumentService+createComment"></a>

### documentService.createComment([data]) ⇒ [<code>CommentService</code>](#CommentService)
Make a comment which belongs to this document.

**Kind**: instance method of [<code>DocumentService</code>](#DocumentService)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [data] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | The comment |

<a name="DocumentService+createDocumentFragment"></a>

### documentService.createDocumentFragment() ⇒ [<code>DocumentFragmentService</code>](#DocumentFragmentService)
Make an empty document fragment which belongs to this document, a container for nodes which can be built up and
then inserted in one go.

**Kind**: instance method of [<code>DocumentService</code>](#DocumentService)  
<a name="NodeService+appendChild"></a>

### documentService.appendChild(childNode) ⇒ <code>PseudoNode</code>
Add a node as the last child of this node (a node which is already in a tree is moved).

**Kind**: instance method of [<code>DocumentService</code>](#DocumentService)  
**Returns**: <code>PseudoNode</code> - The added node  

| Param | Type | Description |
| --- | --- | --- |
| childNode | <code>PseudoNode</code> | The node to add |

<a name="NodeService+cloneShallow"></a>

### documentService.cloneShallow() ⇒ [<code>NodeService</code>](#NodeService)
Make a copy of this node without its children, its parent or its listeners, which is what cloneNode starts from.
Kinds of node which are made with arguments override this to give them.

**Kind**: instance method of [<code>DocumentService</code>](#DocumentService)  
<a name="NodeService+equalsShallow"></a>

### documentService.equalsShallow(other) ⇒ <code>boolean</code>
Whether another node of the same type is equal to this one apart from its children, which isEqualNode compares
afterwards. Kinds of node with more to compare (an element has attributes) override this.

**Kind**: instance method of [<code>DocumentService</code>](#DocumentService)  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>NodeService</code>](#NodeService) | The node to compare with |

<a name="NodeService+append"></a>

### documentService.append(...nodes)
Add nodes (strings become text nodes) as the last children of this node, in the order given.

**Kind**: instance method of [<code>DocumentService</code>](#DocumentService)  
**Throws**:

- <code>Error</code> When this kind of node cannot have children


| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+prepend"></a>

### documentService.prepend(...nodes)
Add nodes (strings become text nodes) as the first children of this node, in the order given.

**Kind**: instance method of [<code>DocumentService</code>](#DocumentService)  
**Throws**:

- <code>Error</code> When this kind of node cannot have children


| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+replaceChildren"></a>

### documentService.replaceChildren(...nodes)
Remove every child of this node and put the given nodes (strings become text nodes) in their place, in order.

**Kind**: instance method of [<code>DocumentService</code>](#DocumentService)  
**Throws**:

- <code>Error</code> When this kind of node cannot have children


| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+before"></a>

### documentService.before(...nodes)
Add nodes (strings become text nodes) as this node's previous siblings, in order. Does nothing when this node has
no parent.

**Kind**: instance method of [<code>DocumentService</code>](#DocumentService)  

| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+after"></a>

### documentService.after(...nodes)
Add nodes (strings become text nodes) as this node's next siblings, in order. Does nothing when this node has no
parent.

**Kind**: instance method of [<code>DocumentService</code>](#DocumentService)  

| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+replaceWith"></a>

### documentService.replaceWith(...nodes)
Put the given nodes (strings become text nodes) where this node is, in order, then remove this node. Does nothing
when this node has no parent.

**Kind**: instance method of [<code>DocumentService</code>](#DocumentService)  

| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to put in this node's place |

<a name="NodeService+remove"></a>

### documentService.remove()
Remove this node from its parent. Does nothing when it has no parent.

**Kind**: instance method of [<code>DocumentService</code>](#DocumentService)  
<a name="NodeService+toChildNode"></a>

### documentService.toChildNode(value) ⇒ <code>PseudoNode</code>
Turn a value given to append / prepend / before / after / replaceWith / replaceChildren into a node: a string
becomes a text node belonging to this node's document, anything else is returned as it is.

**Kind**: instance method of [<code>DocumentService</code>](#DocumentService)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>PseudoNode</code> \| <code>string</code> | The value to add |

<a name="NodeService+getElementsByTagName"></a>

### documentService.getElementsByTagName(tagName) ⇒ <code>PseudoHTMLCollection</code>
Every element below this node with the given tag name (or every element when tagName is *), live.

**Kind**: instance method of [<code>DocumentService</code>](#DocumentService)  

| Param | Type |
| --- | --- |
| tagName | <code>string</code> | 

<a name="NodeService+getElementsByClassName"></a>

### documentService.getElementsByClassName(className) ⇒ <code>PseudoHTMLCollection</code>
Every element below this node which has all of the given (space separated) classes, live.

**Kind**: instance method of [<code>DocumentService</code>](#DocumentService)  

| Param | Type |
| --- | --- |
| className | <code>string</code> | 

<a name="NodeService+getElementsByTagNameNS"></a>

### documentService.getElementsByTagNameNS(namespace, tagName) ⇒ <code>PseudoHTMLCollection</code>
Every element below this node with the given tag name, live. There is no real namespace parsing here, so this
ignores the namespace and behaves exactly like getElementsByTagName.

**Kind**: instance method of [<code>DocumentService</code>](#DocumentService)  

| Param | Type | Description |
| --- | --- | --- |
| namespace | <code>string</code> | Ignored |
| tagName | <code>string</code> |  |

<a name="NodeService+querySelector"></a>

### documentService.querySelector(selectors) ⇒ <code>PseudoElement</code> \| <code>null</code>
The first element below this node which matches the CSS selector, in tree order, or null when there is none.

**Kind**: instance method of [<code>DocumentService</code>](#DocumentService)  

| Param | Type | Description |
| --- | --- | --- |
| selectors | <code>string</code> | A CSS selector |

<a name="NodeService+querySelectorAll"></a>

### documentService.querySelectorAll(selectors) ⇒ <code>Array.&lt;PseudoElement&gt;</code>
Every element below this node which matches the CSS selector, in tree order. A plain array (not a live
collection): like the DOM's querySelectorAll, it is a snapshot taken when it is called.

**Kind**: instance method of [<code>DocumentService</code>](#DocumentService)  

| Param | Type | Description |
| --- | --- | --- |
| selectors | <code>string</code> | A CSS selector |

<a name="NodeService+childInserted"></a>

### documentService.childInserted(child)
Called each time a node has been inserted as a child of this node, so that nodes which need to react to children
(for example elements applying default events) can do so.

**Kind**: instance method of [<code>DocumentService</code>](#DocumentService)  

| Param | Type | Description |
| --- | --- | --- |
| child | [<code>NodeService</code>](#NodeService) | The node which was inserted |

<a name="NodeService+cloneNode"></a>

### documentService.cloneNode([deep]) ⇒ <code>PseudoNode</code>
Make a copy of this node (without its parent, and without its event listeners). With deep the children are copied
too, all the way down.

**Kind**: instance method of [<code>DocumentService</code>](#DocumentService)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [deep] | <code>boolean</code> | <code>false</code> | Copy the children as well |

<a name="NodeService+compareDocumentPosition"></a>

### documentService.compareDocumentPosition(otherNode) ⇒ <code>number</code>
Say where another node is in relation to this one, as the bits of NodeService.DOCUMENT_POSITION_*: 0 for this node
itself, DISCONNECTED (with IMPLEMENTATION_SPECIFIC and a consistent PRECEDING or FOLLOWING) for a node in another tree,
CONTAINS + PRECEDING when the other node is an ancestor, CONTAINED_BY + FOLLOWING when it is a descendant,
otherwise PRECEDING or FOLLOWING by their order in the tree.

**Kind**: instance method of [<code>DocumentService</code>](#DocumentService)  

| Param | Type | Description |
| --- | --- | --- |
| otherNode | <code>PseudoNode</code> | The node to locate |

<a name="NodeService+contains"></a>

### documentService.contains(otherNode) ⇒ <code>boolean</code>
Check whether a node is this node or one of its descendants.

**Kind**: instance method of [<code>DocumentService</code>](#DocumentService)  

| Param | Type | Description |
| --- | --- | --- |
| otherNode | <code>PseudoNode</code> \| <code>null</code> | The node to look for |

<a name="NodeService+insertBefore"></a>

### documentService.insertBefore(newNode, [referenceNode]) ⇒ <code>PseudoNode</code>
Insert a node as a child of this node, before the given child (or at the end when there is none). A node which is
already in a tree is moved, and the children of a document fragment are moved in order.

**Kind**: instance method of [<code>DocumentService</code>](#DocumentService)  
**Returns**: <code>PseudoNode</code> - The inserted node  
**Throws**:

- <code>Error</code> When the reference node is not a child of this node, or the new node is this node or contains it


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| newNode | <code>PseudoNode</code> |  | The node to insert |
| [referenceNode] | <code>PseudoNode</code> \| <code>null</code> | <code></code> | The child of this node to insert before, or null to insert at the end |

<a name="NodeService+isEqualNode"></a>

### documentService.isEqualNode(otherNode) ⇒ <code>boolean</code>
Whether another node is the same as this one, by what they hold: the same type, name and value (an element also
needs the same attributes), and children which are equal in the same order.

**Kind**: instance method of [<code>DocumentService</code>](#DocumentService)  

| Param | Type | Description |
| --- | --- | --- |
| otherNode | <code>PseudoNode</code> \| <code>null</code> | The node to compare with |

<a name="NodeService+normalize"></a>

### documentService.normalize()
Tidy the text below this node: neighbouring text nodes are joined into one and empty text nodes are removed.

**Kind**: instance method of [<code>DocumentService</code>](#DocumentService)  
<a name="NodeService+removeChild"></a>

### documentService.removeChild(childElement) ⇒ <code>PseudoNode</code>
Remove a child from this node, it no longer has a parent or siblings afterwards.

**Kind**: instance method of [<code>DocumentService</code>](#DocumentService)  
**Returns**: <code>PseudoNode</code> - The removed node  
**Throws**:

- <code>Error</code> When the node is not a child of this node


| Param | Type | Description |
| --- | --- | --- |
| childElement | <code>PseudoNode</code> | The child node to remove |

<a name="NodeService+replaceChild"></a>

### documentService.replaceChild(newChild, oldChild) ⇒ <code>PseudoNode</code>
Replace a child of this node with another node (which is moved if it is already in a tree).

**Kind**: instance method of [<code>DocumentService</code>](#DocumentService)  
**Returns**: <code>PseudoNode</code> - The replaced node  
**Throws**:

- <code>Error</code> When the old node is not a child of this node


| Param | Type | Description |
| --- | --- | --- |
| newChild | <code>PseudoNode</code> | The node which takes the place |
| oldChild | <code>PseudoNode</code> | The child of this node to replace |

<a name="DocumentFragmentService"></a>

## DocumentFragmentService ⇐ [<code>NodeService</code>](#NodeService)
Simulate the behaviour of the DocumentFragment Class when there is no DOM available: a container for nodes which is
not part of a tree, when it is inserted its children are moved into the tree instead.

**Kind**: global class  
**Extends**: [<code>NodeService</code>](#NodeService)  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  

* [DocumentFragmentService](#DocumentFragmentService) ⇐ [<code>NodeService</code>](#NodeService)
    * [.acceptsChildren](#NodeService+acceptsChildren) ⇒ <code>boolean</code>
    * [.getElementById(id)](#DocumentFragmentService+getElementById) ⇒ <code>PseudoElement</code> \| <code>null</code>
    * [.appendChild(childNode)](#NodeService+appendChild) ⇒ <code>PseudoNode</code>
    * [.cloneShallow()](#NodeService+cloneShallow) ⇒ [<code>NodeService</code>](#NodeService)
    * [.equalsShallow(other)](#NodeService+equalsShallow) ⇒ <code>boolean</code>
    * [.append(...nodes)](#NodeService+append)
    * [.prepend(...nodes)](#NodeService+prepend)
    * [.replaceChildren(...nodes)](#NodeService+replaceChildren)
    * [.before(...nodes)](#NodeService+before)
    * [.after(...nodes)](#NodeService+after)
    * [.replaceWith(...nodes)](#NodeService+replaceWith)
    * [.remove()](#NodeService+remove)
    * [.toChildNode(value)](#NodeService+toChildNode) ⇒ <code>PseudoNode</code>
    * [.getElementsByTagName(tagName)](#NodeService+getElementsByTagName) ⇒ <code>PseudoHTMLCollection</code>
    * [.getElementsByClassName(className)](#NodeService+getElementsByClassName) ⇒ <code>PseudoHTMLCollection</code>
    * [.getElementsByTagNameNS(namespace, tagName)](#NodeService+getElementsByTagNameNS) ⇒ <code>PseudoHTMLCollection</code>
    * [.querySelector(selectors)](#NodeService+querySelector) ⇒ <code>PseudoElement</code> \| <code>null</code>
    * [.querySelectorAll(selectors)](#NodeService+querySelectorAll) ⇒ <code>Array.&lt;PseudoElement&gt;</code>
    * [.childInserted(child)](#NodeService+childInserted)
    * [.cloneNode([deep])](#NodeService+cloneNode) ⇒ <code>PseudoNode</code>
    * [.compareDocumentPosition(otherNode)](#NodeService+compareDocumentPosition) ⇒ <code>number</code>
    * [.contains(otherNode)](#NodeService+contains) ⇒ <code>boolean</code>
    * [.insertBefore(newNode, [referenceNode])](#NodeService+insertBefore) ⇒ <code>PseudoNode</code>
    * [.isEqualNode(otherNode)](#NodeService+isEqualNode) ⇒ <code>boolean</code>
    * [.normalize()](#NodeService+normalize)
    * [.removeChild(childElement)](#NodeService+removeChild) ⇒ <code>PseudoNode</code>
    * [.replaceChild(newChild, oldChild)](#NodeService+replaceChild) ⇒ <code>PseudoNode</code>

<a name="NodeService+acceptsChildren"></a>

### documentFragmentService.acceptsChildren ⇒ <code>boolean</code>
Whether this kind of node can have children (text, comments and attributes cannot).

**Kind**: instance property of [<code>DocumentFragmentService</code>](#DocumentFragmentService)  
<a name="DocumentFragmentService+getElementById"></a>

### documentFragmentService.getElementById(id) ⇒ <code>PseudoElement</code> \| <code>null</code>
The first element, in tree order, whose id matches the given value, or null when there is none (the DOM's
NonElementParentNode mixin, which Document and DocumentFragment both implement).

**Kind**: instance method of [<code>DocumentFragmentService</code>](#DocumentFragmentService)  

| Param | Type |
| --- | --- |
| id | <code>string</code> | 

<a name="NodeService+appendChild"></a>

### documentFragmentService.appendChild(childNode) ⇒ <code>PseudoNode</code>
Add a node as the last child of this node (a node which is already in a tree is moved).

**Kind**: instance method of [<code>DocumentFragmentService</code>](#DocumentFragmentService)  
**Returns**: <code>PseudoNode</code> - The added node  

| Param | Type | Description |
| --- | --- | --- |
| childNode | <code>PseudoNode</code> | The node to add |

<a name="NodeService+cloneShallow"></a>

### documentFragmentService.cloneShallow() ⇒ [<code>NodeService</code>](#NodeService)
Make a copy of this node without its children, its parent or its listeners, which is what cloneNode starts from.
Kinds of node which are made with arguments override this to give them.

**Kind**: instance method of [<code>DocumentFragmentService</code>](#DocumentFragmentService)  
<a name="NodeService+equalsShallow"></a>

### documentFragmentService.equalsShallow(other) ⇒ <code>boolean</code>
Whether another node of the same type is equal to this one apart from its children, which isEqualNode compares
afterwards. Kinds of node with more to compare (an element has attributes) override this.

**Kind**: instance method of [<code>DocumentFragmentService</code>](#DocumentFragmentService)  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>NodeService</code>](#NodeService) | The node to compare with |

<a name="NodeService+append"></a>

### documentFragmentService.append(...nodes)
Add nodes (strings become text nodes) as the last children of this node, in the order given.

**Kind**: instance method of [<code>DocumentFragmentService</code>](#DocumentFragmentService)  
**Throws**:

- <code>Error</code> When this kind of node cannot have children


| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+prepend"></a>

### documentFragmentService.prepend(...nodes)
Add nodes (strings become text nodes) as the first children of this node, in the order given.

**Kind**: instance method of [<code>DocumentFragmentService</code>](#DocumentFragmentService)  
**Throws**:

- <code>Error</code> When this kind of node cannot have children


| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+replaceChildren"></a>

### documentFragmentService.replaceChildren(...nodes)
Remove every child of this node and put the given nodes (strings become text nodes) in their place, in order.

**Kind**: instance method of [<code>DocumentFragmentService</code>](#DocumentFragmentService)  
**Throws**:

- <code>Error</code> When this kind of node cannot have children


| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+before"></a>

### documentFragmentService.before(...nodes)
Add nodes (strings become text nodes) as this node's previous siblings, in order. Does nothing when this node has
no parent.

**Kind**: instance method of [<code>DocumentFragmentService</code>](#DocumentFragmentService)  

| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+after"></a>

### documentFragmentService.after(...nodes)
Add nodes (strings become text nodes) as this node's next siblings, in order. Does nothing when this node has no
parent.

**Kind**: instance method of [<code>DocumentFragmentService</code>](#DocumentFragmentService)  

| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+replaceWith"></a>

### documentFragmentService.replaceWith(...nodes)
Put the given nodes (strings become text nodes) where this node is, in order, then remove this node. Does nothing
when this node has no parent.

**Kind**: instance method of [<code>DocumentFragmentService</code>](#DocumentFragmentService)  

| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to put in this node's place |

<a name="NodeService+remove"></a>

### documentFragmentService.remove()
Remove this node from its parent. Does nothing when it has no parent.

**Kind**: instance method of [<code>DocumentFragmentService</code>](#DocumentFragmentService)  
<a name="NodeService+toChildNode"></a>

### documentFragmentService.toChildNode(value) ⇒ <code>PseudoNode</code>
Turn a value given to append / prepend / before / after / replaceWith / replaceChildren into a node: a string
becomes a text node belonging to this node's document, anything else is returned as it is.

**Kind**: instance method of [<code>DocumentFragmentService</code>](#DocumentFragmentService)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>PseudoNode</code> \| <code>string</code> | The value to add |

<a name="NodeService+getElementsByTagName"></a>

### documentFragmentService.getElementsByTagName(tagName) ⇒ <code>PseudoHTMLCollection</code>
Every element below this node with the given tag name (or every element when tagName is *), live.

**Kind**: instance method of [<code>DocumentFragmentService</code>](#DocumentFragmentService)  

| Param | Type |
| --- | --- |
| tagName | <code>string</code> | 

<a name="NodeService+getElementsByClassName"></a>

### documentFragmentService.getElementsByClassName(className) ⇒ <code>PseudoHTMLCollection</code>
Every element below this node which has all of the given (space separated) classes, live.

**Kind**: instance method of [<code>DocumentFragmentService</code>](#DocumentFragmentService)  

| Param | Type |
| --- | --- |
| className | <code>string</code> | 

<a name="NodeService+getElementsByTagNameNS"></a>

### documentFragmentService.getElementsByTagNameNS(namespace, tagName) ⇒ <code>PseudoHTMLCollection</code>
Every element below this node with the given tag name, live. There is no real namespace parsing here, so this
ignores the namespace and behaves exactly like getElementsByTagName.

**Kind**: instance method of [<code>DocumentFragmentService</code>](#DocumentFragmentService)  

| Param | Type | Description |
| --- | --- | --- |
| namespace | <code>string</code> | Ignored |
| tagName | <code>string</code> |  |

<a name="NodeService+querySelector"></a>

### documentFragmentService.querySelector(selectors) ⇒ <code>PseudoElement</code> \| <code>null</code>
The first element below this node which matches the CSS selector, in tree order, or null when there is none.

**Kind**: instance method of [<code>DocumentFragmentService</code>](#DocumentFragmentService)  

| Param | Type | Description |
| --- | --- | --- |
| selectors | <code>string</code> | A CSS selector |

<a name="NodeService+querySelectorAll"></a>

### documentFragmentService.querySelectorAll(selectors) ⇒ <code>Array.&lt;PseudoElement&gt;</code>
Every element below this node which matches the CSS selector, in tree order. A plain array (not a live
collection): like the DOM's querySelectorAll, it is a snapshot taken when it is called.

**Kind**: instance method of [<code>DocumentFragmentService</code>](#DocumentFragmentService)  

| Param | Type | Description |
| --- | --- | --- |
| selectors | <code>string</code> | A CSS selector |

<a name="NodeService+childInserted"></a>

### documentFragmentService.childInserted(child)
Called each time a node has been inserted as a child of this node, so that nodes which need to react to children
(for example elements applying default events) can do so.

**Kind**: instance method of [<code>DocumentFragmentService</code>](#DocumentFragmentService)  

| Param | Type | Description |
| --- | --- | --- |
| child | [<code>NodeService</code>](#NodeService) | The node which was inserted |

<a name="NodeService+cloneNode"></a>

### documentFragmentService.cloneNode([deep]) ⇒ <code>PseudoNode</code>
Make a copy of this node (without its parent, and without its event listeners). With deep the children are copied
too, all the way down.

**Kind**: instance method of [<code>DocumentFragmentService</code>](#DocumentFragmentService)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [deep] | <code>boolean</code> | <code>false</code> | Copy the children as well |

<a name="NodeService+compareDocumentPosition"></a>

### documentFragmentService.compareDocumentPosition(otherNode) ⇒ <code>number</code>
Say where another node is in relation to this one, as the bits of NodeService.DOCUMENT_POSITION_*: 0 for this node
itself, DISCONNECTED (with IMPLEMENTATION_SPECIFIC and a consistent PRECEDING or FOLLOWING) for a node in another tree,
CONTAINS + PRECEDING when the other node is an ancestor, CONTAINED_BY + FOLLOWING when it is a descendant,
otherwise PRECEDING or FOLLOWING by their order in the tree.

**Kind**: instance method of [<code>DocumentFragmentService</code>](#DocumentFragmentService)  

| Param | Type | Description |
| --- | --- | --- |
| otherNode | <code>PseudoNode</code> | The node to locate |

<a name="NodeService+contains"></a>

### documentFragmentService.contains(otherNode) ⇒ <code>boolean</code>
Check whether a node is this node or one of its descendants.

**Kind**: instance method of [<code>DocumentFragmentService</code>](#DocumentFragmentService)  

| Param | Type | Description |
| --- | --- | --- |
| otherNode | <code>PseudoNode</code> \| <code>null</code> | The node to look for |

<a name="NodeService+insertBefore"></a>

### documentFragmentService.insertBefore(newNode, [referenceNode]) ⇒ <code>PseudoNode</code>
Insert a node as a child of this node, before the given child (or at the end when there is none). A node which is
already in a tree is moved, and the children of a document fragment are moved in order.

**Kind**: instance method of [<code>DocumentFragmentService</code>](#DocumentFragmentService)  
**Returns**: <code>PseudoNode</code> - The inserted node  
**Throws**:

- <code>Error</code> When the reference node is not a child of this node, or the new node is this node or contains it


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| newNode | <code>PseudoNode</code> |  | The node to insert |
| [referenceNode] | <code>PseudoNode</code> \| <code>null</code> | <code></code> | The child of this node to insert before, or null to insert at the end |

<a name="NodeService+isEqualNode"></a>

### documentFragmentService.isEqualNode(otherNode) ⇒ <code>boolean</code>
Whether another node is the same as this one, by what they hold: the same type, name and value (an element also
needs the same attributes), and children which are equal in the same order.

**Kind**: instance method of [<code>DocumentFragmentService</code>](#DocumentFragmentService)  

| Param | Type | Description |
| --- | --- | --- |
| otherNode | <code>PseudoNode</code> \| <code>null</code> | The node to compare with |

<a name="NodeService+normalize"></a>

### documentFragmentService.normalize()
Tidy the text below this node: neighbouring text nodes are joined into one and empty text nodes are removed.

**Kind**: instance method of [<code>DocumentFragmentService</code>](#DocumentFragmentService)  
<a name="NodeService+removeChild"></a>

### documentFragmentService.removeChild(childElement) ⇒ <code>PseudoNode</code>
Remove a child from this node, it no longer has a parent or siblings afterwards.

**Kind**: instance method of [<code>DocumentFragmentService</code>](#DocumentFragmentService)  
**Returns**: <code>PseudoNode</code> - The removed node  
**Throws**:

- <code>Error</code> When the node is not a child of this node


| Param | Type | Description |
| --- | --- | --- |
| childElement | <code>PseudoNode</code> | The child node to remove |

<a name="NodeService+replaceChild"></a>

### documentFragmentService.replaceChild(newChild, oldChild) ⇒ <code>PseudoNode</code>
Replace a child of this node with another node (which is moved if it is already in a tree).

**Kind**: instance method of [<code>DocumentFragmentService</code>](#DocumentFragmentService)  
**Returns**: <code>PseudoNode</code> - The replaced node  
**Throws**:

- <code>Error</code> When the old node is not a child of this node


| Param | Type | Description |
| --- | --- | --- |
| newChild | <code>PseudoNode</code> | The node which takes the place |
| oldChild | <code>PseudoNode</code> | The child of this node to replace |

<a name="DOMTokenListService"></a>

## DOMTokenListService
Simulate the behaviour of the DOMTokenList Class when there is no DOM available.

**Kind**: global class  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  
<a name="new_DOMTokenListService_new"></a>

### new DOMTokenListService([value], [onChange])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [value] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | The space separated tokens to start with |
| [onChange] | <code>function</code> |  | Called with the new value whenever the tokens change |

<a name="CustomEventService"></a>

## CustomEventService ⇐ [<code>EventService</code>](#EventService)
Simulate the behaviour of the CustomEvent Class when there is no DOM available: an event which carries data.

**Kind**: global class  
**Extends**: [<code>EventService</code>](#EventService)  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  
**Properties**

| Name | Type |
| --- | --- |
| detail | <code>\*</code> | 


* [CustomEventService](#CustomEventService) ⇐ [<code>EventService</code>](#EventService)
    * [new CustomEventService([typeArg], [init])](#new_CustomEventService_new)
    * [.inner](#EventService+inner) ⇒ <code>EventInner</code>
    * [.composedPath()](#EventService+composedPath) ⇒ <code>Array.&lt;PseudoEventTarget&gt;</code>
    * [.preventDefault()](#EventService+preventDefault) ⇒ <code>null</code>
    * [.stopImmediatePropagation()](#EventService+stopImmediatePropagation) ⇒ <code>null</code>
    * [.stopPropagation()](#EventService+stopPropagation) ⇒ <code>null</code>

<a name="new_CustomEventService_new"></a>

### new CustomEventService([typeArg], [init])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [typeArg] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | The type of the event |
| [init] | <code>CustomEventInit</code> | <code>{}</code> | The options for the event |

<a name="EventService+inner"></a>

### customEventService.inner ⇒ <code>EventInner</code>
Scope several accessors inside the inner object. These are only intended for usage by other DOM classes.

**Kind**: instance property of [<code>CustomEventService</code>](#CustomEventService)  
**Overrides**: [<code>inner</code>](#EventService+inner)  
<a name="EventService+composedPath"></a>

### customEventService.composedPath() ⇒ <code>Array.&lt;PseudoEventTarget&gt;</code>
Return an array of targets that will have the event executed open them. The order is based on the eventPhase

**Kind**: instance method of [<code>CustomEventService</code>](#CustomEventService)  
**Overrides**: [<code>composedPath</code>](#EventService+composedPath)  
<a name="EventService+preventDefault"></a>

### customEventService.preventDefault() ⇒ <code>null</code>
Cancels the event (if it is cancelable).

**Kind**: instance method of [<code>CustomEventService</code>](#CustomEventService)  
**Overrides**: [<code>preventDefault</code>](#EventService+preventDefault)  
<a name="EventService+stopImmediatePropagation"></a>

### customEventService.stopImmediatePropagation() ⇒ <code>null</code>
For this particular event, no other listener will be called.
Neither those attached on the same element, nor those attached on elements which will be traversed later (in
capture phase, for instance)

**Kind**: instance method of [<code>CustomEventService</code>](#CustomEventService)  
**Overrides**: [<code>stopImmediatePropagation</code>](#EventService+stopImmediatePropagation)  
<a name="EventService+stopPropagation"></a>

### customEventService.stopPropagation() ⇒ <code>null</code>
Stops the propagation of events further along in the Dom.

**Kind**: instance method of [<code>CustomEventService</code>](#CustomEventService)  
**Overrides**: [<code>stopPropagation</code>](#EventService+stopPropagation)  
<a name="CSSStyleDeclarationService"></a>

## CSSStyleDeclarationService
Simulate the behaviour of the CSSStyleDeclaration Class when there is no DOM available: an ordered map of CSS
property/value pairs, parsed from and serialized back to a cssText string. Values are stored and returned as
given, with no unit conversion, shorthand expansion or validation - this is a data structure, not a real CSS
engine. Named property access (declaration.backgroundColor, camelCase) is added on top of this by
createStyleDeclaration, which wraps an instance of this class in a Proxy.

**Kind**: global class  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  

* [CSSStyleDeclarationService](#CSSStyleDeclarationService)
    * [new CSSStyleDeclarationService([cssText])](#new_CSSStyleDeclarationService_new)
    * [.length](#CSSStyleDeclarationService+length) ⇒ <code>number</code>
    * [.cssText](#CSSStyleDeclarationService+cssText) ⇒ <code>string</code>
    * [.cssText](#CSSStyleDeclarationService+cssText) ⇒ <code>undefined</code>
    * [.item(index)](#CSSStyleDeclarationService+item) ⇒ <code>string</code>
    * [.getPropertyValue(property)](#CSSStyleDeclarationService+getPropertyValue) ⇒ <code>string</code>
    * [.getPropertyPriority(property)](#CSSStyleDeclarationService+getPropertyPriority) ⇒ <code>string</code>
    * [.setProperty(property, value, [priority])](#CSSStyleDeclarationService+setProperty) ⇒ <code>undefined</code>
    * [.removeProperty(property)](#CSSStyleDeclarationService+removeProperty) ⇒ <code>string</code>

<a name="new_CSSStyleDeclarationService_new"></a>

### new CSSStyleDeclarationService([cssText])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [cssText] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | Initial declarations, as CSS text ("color: red; font-size: 12px;") |

<a name="CSSStyleDeclarationService+length"></a>

### cssStyleDeclarationService.length ⇒ <code>number</code>
How many properties are currently set.

**Kind**: instance property of [<code>CSSStyleDeclarationService</code>](#CSSStyleDeclarationService)  
<a name="CSSStyleDeclarationService+cssText"></a>

### cssStyleDeclarationService.cssText ⇒ <code>string</code>
All the declarations as one CSS text string.

**Kind**: instance property of [<code>CSSStyleDeclarationService</code>](#CSSStyleDeclarationService)  
<a name="CSSStyleDeclarationService+cssText"></a>

### cssStyleDeclarationService.cssText ⇒ <code>undefined</code>
Replace every declaration by parsing a CSS text string ("color: red; font-size: 12px !important;").

**Kind**: instance property of [<code>CSSStyleDeclarationService</code>](#CSSStyleDeclarationService)  

| Param | Type |
| --- | --- |
| cssText | <code>string</code> | 

<a name="CSSStyleDeclarationService+item"></a>

### cssStyleDeclarationService.item(index) ⇒ <code>string</code>
The name of the property at the given index, in the order it was set, or '' when there is none (matches the
DOM's CSSStyleDeclaration, which is array-like).

**Kind**: instance method of [<code>CSSStyleDeclarationService</code>](#CSSStyleDeclarationService)  

| Param | Type |
| --- | --- |
| index | <code>number</code> | 

<a name="CSSStyleDeclarationService+getPropertyValue"></a>

### cssStyleDeclarationService.getPropertyValue(property) ⇒ <code>string</code>
The value of the given property, or '' when it is not set.

**Kind**: instance method of [<code>CSSStyleDeclarationService</code>](#CSSStyleDeclarationService)  

| Param | Type | Description |
| --- | --- | --- |
| property | <code>string</code> | A CSS property name (kebab-case, e.g. "background-color") |

<a name="CSSStyleDeclarationService+getPropertyPriority"></a>

### cssStyleDeclarationService.getPropertyPriority(property) ⇒ <code>string</code>
"important" when the property was set with !important, otherwise ''.

**Kind**: instance method of [<code>CSSStyleDeclarationService</code>](#CSSStyleDeclarationService)  

| Param | Type | Description |
| --- | --- | --- |
| property | <code>string</code> | A CSS property name (kebab-case) |

<a name="CSSStyleDeclarationService+setProperty"></a>

### cssStyleDeclarationService.setProperty(property, value, [priority]) ⇒ <code>undefined</code>
Set a property's value (and optionally its priority). An empty, null or undefined value removes the property
instead, like the DOM.

**Kind**: instance method of [<code>CSSStyleDeclarationService</code>](#CSSStyleDeclarationService)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| property | <code>string</code> |  | A CSS property name (kebab-case) |
| value | <code>string</code> |  | The value, or '' to remove the property |
| [priority] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | "important" to mark it !important |

<a name="CSSStyleDeclarationService+removeProperty"></a>

### cssStyleDeclarationService.removeProperty(property) ⇒ <code>string</code>
Remove a property, returning the value it had (or '' when it was not set).

**Kind**: instance method of [<code>CSSStyleDeclarationService</code>](#CSSStyleDeclarationService)  

| Param | Type | Description |
| --- | --- | --- |
| property | <code>string</code> | A CSS property name (kebab-case) |

<a name="AttrService"></a>

## AttrService ⇐ [<code>NodeService</code>](#NodeService)
Simulate the behaviour of the Attr Class when there is no DOM available.

**Kind**: global class  
**Extends**: [<code>NodeService</code>](#NodeService)  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  

* [AttrService](#AttrService) ⇐ [<code>NodeService</code>](#NodeService)
    * [new AttrService(name, [value], [ownerElement], [namespaceURI], [prefix])](#new_AttrService_new)
    * [.acceptsChildren](#NodeService+acceptsChildren) ⇒ <code>boolean</code>
    * [.appendChild(childNode)](#NodeService+appendChild) ⇒ <code>PseudoNode</code>
    * [.cloneShallow()](#NodeService+cloneShallow) ⇒ [<code>NodeService</code>](#NodeService)
    * [.equalsShallow(other)](#NodeService+equalsShallow) ⇒ <code>boolean</code>
    * [.append(...nodes)](#NodeService+append)
    * [.prepend(...nodes)](#NodeService+prepend)
    * [.replaceChildren(...nodes)](#NodeService+replaceChildren)
    * [.before(...nodes)](#NodeService+before)
    * [.after(...nodes)](#NodeService+after)
    * [.replaceWith(...nodes)](#NodeService+replaceWith)
    * [.remove()](#NodeService+remove)
    * [.toChildNode(value)](#NodeService+toChildNode) ⇒ <code>PseudoNode</code>
    * [.getElementsByTagName(tagName)](#NodeService+getElementsByTagName) ⇒ <code>PseudoHTMLCollection</code>
    * [.getElementsByClassName(className)](#NodeService+getElementsByClassName) ⇒ <code>PseudoHTMLCollection</code>
    * [.getElementsByTagNameNS(namespace, tagName)](#NodeService+getElementsByTagNameNS) ⇒ <code>PseudoHTMLCollection</code>
    * [.querySelector(selectors)](#NodeService+querySelector) ⇒ <code>PseudoElement</code> \| <code>null</code>
    * [.querySelectorAll(selectors)](#NodeService+querySelectorAll) ⇒ <code>Array.&lt;PseudoElement&gt;</code>
    * [.childInserted(child)](#NodeService+childInserted)
    * [.cloneNode([deep])](#NodeService+cloneNode) ⇒ <code>PseudoNode</code>
    * [.compareDocumentPosition(otherNode)](#NodeService+compareDocumentPosition) ⇒ <code>number</code>
    * [.contains(otherNode)](#NodeService+contains) ⇒ <code>boolean</code>
    * [.insertBefore(newNode, [referenceNode])](#NodeService+insertBefore) ⇒ <code>PseudoNode</code>
    * [.isEqualNode(otherNode)](#NodeService+isEqualNode) ⇒ <code>boolean</code>
    * [.normalize()](#NodeService+normalize)
    * [.removeChild(childElement)](#NodeService+removeChild) ⇒ <code>PseudoNode</code>
    * [.replaceChild(newChild, oldChild)](#NodeService+replaceChild) ⇒ <code>PseudoNode</code>

<a name="new_AttrService_new"></a>

### new AttrService(name, [value], [ownerElement], [namespaceURI], [prefix])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>string</code> |  | The name of the attribute |
| [value] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | The value of the attribute |
| [ownerElement] | <code>PseudoElement</code> \| <code>null</code> | <code></code> | The element which has this attribute |
| [namespaceURI] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | The namespace of the attribute |
| [prefix] | <code>string</code> \| <code>null</code> | <code>null</code> | The namespace prefix of the attribute |

<a name="NodeService+acceptsChildren"></a>

### attrService.acceptsChildren ⇒ <code>boolean</code>
Whether this kind of node can have children (text, comments and attributes cannot).

**Kind**: instance property of [<code>AttrService</code>](#AttrService)  
**Overrides**: [<code>acceptsChildren</code>](#NodeService+acceptsChildren)  
<a name="NodeService+appendChild"></a>

### attrService.appendChild(childNode) ⇒ <code>PseudoNode</code>
Add a node as the last child of this node (a node which is already in a tree is moved).

**Kind**: instance method of [<code>AttrService</code>](#AttrService)  
**Overrides**: [<code>appendChild</code>](#NodeService+appendChild)  
**Returns**: <code>PseudoNode</code> - The added node  

| Param | Type | Description |
| --- | --- | --- |
| childNode | <code>PseudoNode</code> | The node to add |

<a name="NodeService+cloneShallow"></a>

### attrService.cloneShallow() ⇒ [<code>NodeService</code>](#NodeService)
Make a copy of this node without its children, its parent or its listeners, which is what cloneNode starts from.
Kinds of node which are made with arguments override this to give them.

**Kind**: instance method of [<code>AttrService</code>](#AttrService)  
**Overrides**: [<code>cloneShallow</code>](#NodeService+cloneShallow)  
<a name="NodeService+equalsShallow"></a>

### attrService.equalsShallow(other) ⇒ <code>boolean</code>
Whether another node of the same type is equal to this one apart from its children, which isEqualNode compares
afterwards. Kinds of node with more to compare (an element has attributes) override this.

**Kind**: instance method of [<code>AttrService</code>](#AttrService)  
**Overrides**: [<code>equalsShallow</code>](#NodeService+equalsShallow)  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>NodeService</code>](#NodeService) | The node to compare with |

<a name="NodeService+append"></a>

### attrService.append(...nodes)
Add nodes (strings become text nodes) as the last children of this node, in the order given.

**Kind**: instance method of [<code>AttrService</code>](#AttrService)  
**Overrides**: [<code>append</code>](#NodeService+append)  
**Throws**:

- <code>Error</code> When this kind of node cannot have children


| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+prepend"></a>

### attrService.prepend(...nodes)
Add nodes (strings become text nodes) as the first children of this node, in the order given.

**Kind**: instance method of [<code>AttrService</code>](#AttrService)  
**Overrides**: [<code>prepend</code>](#NodeService+prepend)  
**Throws**:

- <code>Error</code> When this kind of node cannot have children


| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+replaceChildren"></a>

### attrService.replaceChildren(...nodes)
Remove every child of this node and put the given nodes (strings become text nodes) in their place, in order.

**Kind**: instance method of [<code>AttrService</code>](#AttrService)  
**Overrides**: [<code>replaceChildren</code>](#NodeService+replaceChildren)  
**Throws**:

- <code>Error</code> When this kind of node cannot have children


| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+before"></a>

### attrService.before(...nodes)
Add nodes (strings become text nodes) as this node's previous siblings, in order. Does nothing when this node has
no parent.

**Kind**: instance method of [<code>AttrService</code>](#AttrService)  
**Overrides**: [<code>before</code>](#NodeService+before)  

| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+after"></a>

### attrService.after(...nodes)
Add nodes (strings become text nodes) as this node's next siblings, in order. Does nothing when this node has no
parent.

**Kind**: instance method of [<code>AttrService</code>](#AttrService)  
**Overrides**: [<code>after</code>](#NodeService+after)  

| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+replaceWith"></a>

### attrService.replaceWith(...nodes)
Put the given nodes (strings become text nodes) where this node is, in order, then remove this node. Does nothing
when this node has no parent.

**Kind**: instance method of [<code>AttrService</code>](#AttrService)  
**Overrides**: [<code>replaceWith</code>](#NodeService+replaceWith)  

| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to put in this node's place |

<a name="NodeService+remove"></a>

### attrService.remove()
Remove this node from its parent. Does nothing when it has no parent.

**Kind**: instance method of [<code>AttrService</code>](#AttrService)  
**Overrides**: [<code>remove</code>](#NodeService+remove)  
<a name="NodeService+toChildNode"></a>

### attrService.toChildNode(value) ⇒ <code>PseudoNode</code>
Turn a value given to append / prepend / before / after / replaceWith / replaceChildren into a node: a string
becomes a text node belonging to this node's document, anything else is returned as it is.

**Kind**: instance method of [<code>AttrService</code>](#AttrService)  
**Overrides**: [<code>toChildNode</code>](#NodeService+toChildNode)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>PseudoNode</code> \| <code>string</code> | The value to add |

<a name="NodeService+getElementsByTagName"></a>

### attrService.getElementsByTagName(tagName) ⇒ <code>PseudoHTMLCollection</code>
Every element below this node with the given tag name (or every element when tagName is *), live.

**Kind**: instance method of [<code>AttrService</code>](#AttrService)  
**Overrides**: [<code>getElementsByTagName</code>](#NodeService+getElementsByTagName)  

| Param | Type |
| --- | --- |
| tagName | <code>string</code> | 

<a name="NodeService+getElementsByClassName"></a>

### attrService.getElementsByClassName(className) ⇒ <code>PseudoHTMLCollection</code>
Every element below this node which has all of the given (space separated) classes, live.

**Kind**: instance method of [<code>AttrService</code>](#AttrService)  
**Overrides**: [<code>getElementsByClassName</code>](#NodeService+getElementsByClassName)  

| Param | Type |
| --- | --- |
| className | <code>string</code> | 

<a name="NodeService+getElementsByTagNameNS"></a>

### attrService.getElementsByTagNameNS(namespace, tagName) ⇒ <code>PseudoHTMLCollection</code>
Every element below this node with the given tag name, live. There is no real namespace parsing here, so this
ignores the namespace and behaves exactly like getElementsByTagName.

**Kind**: instance method of [<code>AttrService</code>](#AttrService)  
**Overrides**: [<code>getElementsByTagNameNS</code>](#NodeService+getElementsByTagNameNS)  

| Param | Type | Description |
| --- | --- | --- |
| namespace | <code>string</code> | Ignored |
| tagName | <code>string</code> |  |

<a name="NodeService+querySelector"></a>

### attrService.querySelector(selectors) ⇒ <code>PseudoElement</code> \| <code>null</code>
The first element below this node which matches the CSS selector, in tree order, or null when there is none.

**Kind**: instance method of [<code>AttrService</code>](#AttrService)  
**Overrides**: [<code>querySelector</code>](#NodeService+querySelector)  

| Param | Type | Description |
| --- | --- | --- |
| selectors | <code>string</code> | A CSS selector |

<a name="NodeService+querySelectorAll"></a>

### attrService.querySelectorAll(selectors) ⇒ <code>Array.&lt;PseudoElement&gt;</code>
Every element below this node which matches the CSS selector, in tree order. A plain array (not a live
collection): like the DOM's querySelectorAll, it is a snapshot taken when it is called.

**Kind**: instance method of [<code>AttrService</code>](#AttrService)  
**Overrides**: [<code>querySelectorAll</code>](#NodeService+querySelectorAll)  

| Param | Type | Description |
| --- | --- | --- |
| selectors | <code>string</code> | A CSS selector |

<a name="NodeService+childInserted"></a>

### attrService.childInserted(child)
Called each time a node has been inserted as a child of this node, so that nodes which need to react to children
(for example elements applying default events) can do so.

**Kind**: instance method of [<code>AttrService</code>](#AttrService)  
**Overrides**: [<code>childInserted</code>](#NodeService+childInserted)  

| Param | Type | Description |
| --- | --- | --- |
| child | [<code>NodeService</code>](#NodeService) | The node which was inserted |

<a name="NodeService+cloneNode"></a>

### attrService.cloneNode([deep]) ⇒ <code>PseudoNode</code>
Make a copy of this node (without its parent, and without its event listeners). With deep the children are copied
too, all the way down.

**Kind**: instance method of [<code>AttrService</code>](#AttrService)  
**Overrides**: [<code>cloneNode</code>](#NodeService+cloneNode)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [deep] | <code>boolean</code> | <code>false</code> | Copy the children as well |

<a name="NodeService+compareDocumentPosition"></a>

### attrService.compareDocumentPosition(otherNode) ⇒ <code>number</code>
Say where another node is in relation to this one, as the bits of NodeService.DOCUMENT_POSITION_*: 0 for this node
itself, DISCONNECTED (with IMPLEMENTATION_SPECIFIC and a consistent PRECEDING or FOLLOWING) for a node in another tree,
CONTAINS + PRECEDING when the other node is an ancestor, CONTAINED_BY + FOLLOWING when it is a descendant,
otherwise PRECEDING or FOLLOWING by their order in the tree.

**Kind**: instance method of [<code>AttrService</code>](#AttrService)  
**Overrides**: [<code>compareDocumentPosition</code>](#NodeService+compareDocumentPosition)  

| Param | Type | Description |
| --- | --- | --- |
| otherNode | <code>PseudoNode</code> | The node to locate |

<a name="NodeService+contains"></a>

### attrService.contains(otherNode) ⇒ <code>boolean</code>
Check whether a node is this node or one of its descendants.

**Kind**: instance method of [<code>AttrService</code>](#AttrService)  
**Overrides**: [<code>contains</code>](#NodeService+contains)  

| Param | Type | Description |
| --- | --- | --- |
| otherNode | <code>PseudoNode</code> \| <code>null</code> | The node to look for |

<a name="NodeService+insertBefore"></a>

### attrService.insertBefore(newNode, [referenceNode]) ⇒ <code>PseudoNode</code>
Insert a node as a child of this node, before the given child (or at the end when there is none). A node which is
already in a tree is moved, and the children of a document fragment are moved in order.

**Kind**: instance method of [<code>AttrService</code>](#AttrService)  
**Overrides**: [<code>insertBefore</code>](#NodeService+insertBefore)  
**Returns**: <code>PseudoNode</code> - The inserted node  
**Throws**:

- <code>Error</code> When the reference node is not a child of this node, or the new node is this node or contains it


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| newNode | <code>PseudoNode</code> |  | The node to insert |
| [referenceNode] | <code>PseudoNode</code> \| <code>null</code> | <code></code> | The child of this node to insert before, or null to insert at the end |

<a name="NodeService+isEqualNode"></a>

### attrService.isEqualNode(otherNode) ⇒ <code>boolean</code>
Whether another node is the same as this one, by what they hold: the same type, name and value (an element also
needs the same attributes), and children which are equal in the same order.

**Kind**: instance method of [<code>AttrService</code>](#AttrService)  
**Overrides**: [<code>isEqualNode</code>](#NodeService+isEqualNode)  

| Param | Type | Description |
| --- | --- | --- |
| otherNode | <code>PseudoNode</code> \| <code>null</code> | The node to compare with |

<a name="NodeService+normalize"></a>

### attrService.normalize()
Tidy the text below this node: neighbouring text nodes are joined into one and empty text nodes are removed.

**Kind**: instance method of [<code>AttrService</code>](#AttrService)  
**Overrides**: [<code>normalize</code>](#NodeService+normalize)  
<a name="NodeService+removeChild"></a>

### attrService.removeChild(childElement) ⇒ <code>PseudoNode</code>
Remove a child from this node, it no longer has a parent or siblings afterwards.

**Kind**: instance method of [<code>AttrService</code>](#AttrService)  
**Overrides**: [<code>removeChild</code>](#NodeService+removeChild)  
**Returns**: <code>PseudoNode</code> - The removed node  
**Throws**:

- <code>Error</code> When the node is not a child of this node


| Param | Type | Description |
| --- | --- | --- |
| childElement | <code>PseudoNode</code> | The child node to remove |

<a name="NodeService+replaceChild"></a>

### attrService.replaceChild(newChild, oldChild) ⇒ <code>PseudoNode</code>
Replace a child of this node with another node (which is moved if it is already in a tree).

**Kind**: instance method of [<code>AttrService</code>](#AttrService)  
**Overrides**: [<code>replaceChild</code>](#NodeService+replaceChild)  
**Returns**: <code>PseudoNode</code> - The replaced node  
**Throws**:

- <code>Error</code> When the old node is not a child of this node


| Param | Type | Description |
| --- | --- | --- |
| newChild | <code>PseudoNode</code> | The node which takes the place |
| oldChild | <code>PseudoNode</code> | The child of this node to replace |

<a name="PseudoNodeList"></a>

## PseudoNodeList ⇐ <code>LinkedTreeList</code>
A NodeList, like the DOM one, iterates over the nodes themselves (the data stored in each TreeLinker), rather than
the linkers that hold them.

**Kind**: global class  
**Extends**: <code>LinkedTreeList</code>  

* [PseudoNodeList](#PseudoNodeList) ⇐ <code>LinkedTreeList</code>
    * [.entries()](#PseudoNodeList+entries) ⇒ <code>Iterator</code>
    * [.keys()](#PseudoNodeList+keys) ⇒ <code>Iterator</code>
    * [.values()](#PseudoNodeList+values) ⇒ <code>Iterator</code>

<a name="PseudoNodeList+entries"></a>

### pseudoNodeList.entries() ⇒ <code>Iterator</code>
Iterate over [index, node] pairs.

**Kind**: instance method of [<code>PseudoNodeList</code>](#PseudoNodeList)  
<a name="PseudoNodeList+keys"></a>

### pseudoNodeList.keys() ⇒ <code>Iterator</code>
Iterate over the indexes.

**Kind**: instance method of [<code>PseudoNodeList</code>](#PseudoNodeList)  
<a name="PseudoNodeList+values"></a>

### pseudoNodeList.values() ⇒ <code>Iterator</code>
Iterate over the nodes.

**Kind**: instance method of [<code>PseudoNodeList</code>](#PseudoNodeList)  
<a name="PseudoHTMLDocument"></a>

## PseudoHTMLDocument ⇐ [<code>DocumentService</code>](#DocumentService)
Simulate the behaviour of the HTMLDocument Class when there is no DOM available. Like the real HTMLDocument, this
only adds the html/head/body structure on top of what Document already gives (createElement, createTextNode,
createComment, createDocumentFragment, getElementById, textContent always null).

**Kind**: global class  
**Extends**: [<code>DocumentService</code>](#DocumentService)  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| head | <code>PseudoHTMLElement</code> | A reference to the Head child element |
| body | <code>PseudoHTMLElement</code> | A reference to the Body child element |


* [PseudoHTMLDocument](#PseudoHTMLDocument) ⇐ [<code>DocumentService</code>](#DocumentService)
    * [new PseudoHTMLDocument()](#new_PseudoHTMLDocument_new)
    * [.head](#PseudoHTMLDocument+head) : <code>PseudoHTMLElement</code>
    * [.body](#PseudoHTMLDocument+body) : <code>PseudoHTMLElement</code>
    * [.acceptsChildren](#NodeService+acceptsChildren) ⇒ <code>boolean</code>
    * [.cloneShallow()](#PseudoHTMLDocument+cloneShallow) ⇒ [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)
    * [.cloneNode([deep])](#PseudoHTMLDocument+cloneNode) ⇒ [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)
    * [.getElementById(id)](#DocumentService+getElementById) ⇒ <code>PseudoElement</code> \| <code>null</code>
    * [.createElement([tagName])](#DocumentService+createElement) ⇒ <code>PseudoElement</code>
    * [.createTextNode([data])](#DocumentService+createTextNode) ⇒ [<code>TextService</code>](#TextService)
    * [.createComment([data])](#DocumentService+createComment) ⇒ [<code>CommentService</code>](#CommentService)
    * [.createDocumentFragment()](#DocumentService+createDocumentFragment) ⇒ [<code>DocumentFragmentService</code>](#DocumentFragmentService)
    * [.appendChild(childNode)](#NodeService+appendChild) ⇒ <code>PseudoNode</code>
    * [.equalsShallow(other)](#NodeService+equalsShallow) ⇒ <code>boolean</code>
    * [.append(...nodes)](#NodeService+append)
    * [.prepend(...nodes)](#NodeService+prepend)
    * [.replaceChildren(...nodes)](#NodeService+replaceChildren)
    * [.before(...nodes)](#NodeService+before)
    * [.after(...nodes)](#NodeService+after)
    * [.replaceWith(...nodes)](#NodeService+replaceWith)
    * [.remove()](#NodeService+remove)
    * [.toChildNode(value)](#NodeService+toChildNode) ⇒ <code>PseudoNode</code>
    * [.getElementsByTagName(tagName)](#NodeService+getElementsByTagName) ⇒ <code>PseudoHTMLCollection</code>
    * [.getElementsByClassName(className)](#NodeService+getElementsByClassName) ⇒ <code>PseudoHTMLCollection</code>
    * [.getElementsByTagNameNS(namespace, tagName)](#NodeService+getElementsByTagNameNS) ⇒ <code>PseudoHTMLCollection</code>
    * [.querySelector(selectors)](#NodeService+querySelector) ⇒ <code>PseudoElement</code> \| <code>null</code>
    * [.querySelectorAll(selectors)](#NodeService+querySelectorAll) ⇒ <code>Array.&lt;PseudoElement&gt;</code>
    * [.childInserted(child)](#NodeService+childInserted)
    * [.compareDocumentPosition(otherNode)](#NodeService+compareDocumentPosition) ⇒ <code>number</code>
    * [.contains(otherNode)](#NodeService+contains) ⇒ <code>boolean</code>
    * [.insertBefore(newNode, [referenceNode])](#NodeService+insertBefore) ⇒ <code>PseudoNode</code>
    * [.isEqualNode(otherNode)](#NodeService+isEqualNode) ⇒ <code>boolean</code>
    * [.normalize()](#NodeService+normalize)
    * [.removeChild(childElement)](#NodeService+removeChild) ⇒ <code>PseudoNode</code>
    * [.replaceChild(newChild, oldChild)](#NodeService+replaceChild) ⇒ <code>PseudoNode</code>

<a name="new_PseudoHTMLDocument_new"></a>

### new PseudoHTMLDocument()
The root HTML element is acts as the parent to all HTML elements in the document.

<a name="PseudoHTMLDocument+head"></a>

### pseudoHTMLDocument.head : <code>PseudoHTMLElement</code>
Create document head element

**Kind**: instance property of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
<a name="PseudoHTMLDocument+body"></a>

### pseudoHTMLDocument.body : <code>PseudoHTMLElement</code>
Create document body element

**Kind**: instance property of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
<a name="NodeService+acceptsChildren"></a>

### pseudoHTMLDocument.acceptsChildren ⇒ <code>boolean</code>
Whether this kind of node can have children (text, comments and attributes cannot).

**Kind**: instance property of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>acceptsChildren</code>](#NodeService+acceptsChildren)  
<a name="PseudoHTMLDocument+cloneShallow"></a>

### pseudoHTMLDocument.cloneShallow() ⇒ [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)
A copy of this document with none of its html/head/body (cloneNode, from the inherited cloneShallow hook, fills
them back in, deep copies own document's, empty otherwise - see cloneNode).

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>cloneShallow</code>](#NodeService+cloneShallow)  
<a name="PseudoHTMLDocument+cloneNode"></a>

### pseudoHTMLDocument.cloneNode([deep]) ⇒ [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)
Make a copy of this document. The copy has no parent or listeners, and a deep copy has copies of everything in
the document (a shallow one is an empty document).

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>cloneNode</code>](#NodeService+cloneNode)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [deep] | <code>boolean</code> | <code>false</code> | Copy everything in the document as well |

<a name="DocumentService+getElementById"></a>

### pseudoHTMLDocument.getElementById(id) ⇒ <code>PseudoElement</code> \| <code>null</code>
The first element, in tree order, whose id matches the given value, or null when there is none.

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>getElementById</code>](#DocumentService+getElementById)  

| Param | Type |
| --- | --- |
| id | <code>string</code> | 

<a name="DocumentService+createElement"></a>

### pseudoHTMLDocument.createElement([tagName]) ⇒ <code>PseudoElement</code>
Make an element of the given type which belongs to this document but is not added anywhere until it is appended.

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>createElement</code>](#DocumentService+createElement)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [tagName] | <code>string</code> | <code>&quot;&#x27;div&#x27;&quot;</code> | The type of element to create |

<a name="DocumentService+createTextNode"></a>

### pseudoHTMLDocument.createTextNode([data]) ⇒ [<code>TextService</code>](#TextService)
Make a text node which belongs to this document.

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>createTextNode</code>](#DocumentService+createTextNode)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [data] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | The text |

<a name="DocumentService+createComment"></a>

### pseudoHTMLDocument.createComment([data]) ⇒ [<code>CommentService</code>](#CommentService)
Make a comment which belongs to this document.

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>createComment</code>](#DocumentService+createComment)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [data] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | The comment |

<a name="DocumentService+createDocumentFragment"></a>

### pseudoHTMLDocument.createDocumentFragment() ⇒ [<code>DocumentFragmentService</code>](#DocumentFragmentService)
Make an empty document fragment which belongs to this document, a container for nodes which can be built up and
then inserted in one go.

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>createDocumentFragment</code>](#DocumentService+createDocumentFragment)  
<a name="NodeService+appendChild"></a>

### pseudoHTMLDocument.appendChild(childNode) ⇒ <code>PseudoNode</code>
Add a node as the last child of this node (a node which is already in a tree is moved).

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>appendChild</code>](#NodeService+appendChild)  
**Returns**: <code>PseudoNode</code> - The added node  

| Param | Type | Description |
| --- | --- | --- |
| childNode | <code>PseudoNode</code> | The node to add |

<a name="NodeService+equalsShallow"></a>

### pseudoHTMLDocument.equalsShallow(other) ⇒ <code>boolean</code>
Whether another node of the same type is equal to this one apart from its children, which isEqualNode compares
afterwards. Kinds of node with more to compare (an element has attributes) override this.

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>equalsShallow</code>](#NodeService+equalsShallow)  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>NodeService</code>](#NodeService) | The node to compare with |

<a name="NodeService+append"></a>

### pseudoHTMLDocument.append(...nodes)
Add nodes (strings become text nodes) as the last children of this node, in the order given.

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>append</code>](#NodeService+append)  
**Throws**:

- <code>Error</code> When this kind of node cannot have children


| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+prepend"></a>

### pseudoHTMLDocument.prepend(...nodes)
Add nodes (strings become text nodes) as the first children of this node, in the order given.

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>prepend</code>](#NodeService+prepend)  
**Throws**:

- <code>Error</code> When this kind of node cannot have children


| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+replaceChildren"></a>

### pseudoHTMLDocument.replaceChildren(...nodes)
Remove every child of this node and put the given nodes (strings become text nodes) in their place, in order.

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>replaceChildren</code>](#NodeService+replaceChildren)  
**Throws**:

- <code>Error</code> When this kind of node cannot have children


| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+before"></a>

### pseudoHTMLDocument.before(...nodes)
Add nodes (strings become text nodes) as this node's previous siblings, in order. Does nothing when this node has
no parent.

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>before</code>](#NodeService+before)  

| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+after"></a>

### pseudoHTMLDocument.after(...nodes)
Add nodes (strings become text nodes) as this node's next siblings, in order. Does nothing when this node has no
parent.

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>after</code>](#NodeService+after)  

| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+replaceWith"></a>

### pseudoHTMLDocument.replaceWith(...nodes)
Put the given nodes (strings become text nodes) where this node is, in order, then remove this node. Does nothing
when this node has no parent.

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>replaceWith</code>](#NodeService+replaceWith)  

| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to put in this node's place |

<a name="NodeService+remove"></a>

### pseudoHTMLDocument.remove()
Remove this node from its parent. Does nothing when it has no parent.

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>remove</code>](#NodeService+remove)  
<a name="NodeService+toChildNode"></a>

### pseudoHTMLDocument.toChildNode(value) ⇒ <code>PseudoNode</code>
Turn a value given to append / prepend / before / after / replaceWith / replaceChildren into a node: a string
becomes a text node belonging to this node's document, anything else is returned as it is.

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>toChildNode</code>](#NodeService+toChildNode)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>PseudoNode</code> \| <code>string</code> | The value to add |

<a name="NodeService+getElementsByTagName"></a>

### pseudoHTMLDocument.getElementsByTagName(tagName) ⇒ <code>PseudoHTMLCollection</code>
Every element below this node with the given tag name (or every element when tagName is *), live.

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>getElementsByTagName</code>](#NodeService+getElementsByTagName)  

| Param | Type |
| --- | --- |
| tagName | <code>string</code> | 

<a name="NodeService+getElementsByClassName"></a>

### pseudoHTMLDocument.getElementsByClassName(className) ⇒ <code>PseudoHTMLCollection</code>
Every element below this node which has all of the given (space separated) classes, live.

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>getElementsByClassName</code>](#NodeService+getElementsByClassName)  

| Param | Type |
| --- | --- |
| className | <code>string</code> | 

<a name="NodeService+getElementsByTagNameNS"></a>

### pseudoHTMLDocument.getElementsByTagNameNS(namespace, tagName) ⇒ <code>PseudoHTMLCollection</code>
Every element below this node with the given tag name, live. There is no real namespace parsing here, so this
ignores the namespace and behaves exactly like getElementsByTagName.

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>getElementsByTagNameNS</code>](#NodeService+getElementsByTagNameNS)  

| Param | Type | Description |
| --- | --- | --- |
| namespace | <code>string</code> | Ignored |
| tagName | <code>string</code> |  |

<a name="NodeService+querySelector"></a>

### pseudoHTMLDocument.querySelector(selectors) ⇒ <code>PseudoElement</code> \| <code>null</code>
The first element below this node which matches the CSS selector, in tree order, or null when there is none.

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>querySelector</code>](#NodeService+querySelector)  

| Param | Type | Description |
| --- | --- | --- |
| selectors | <code>string</code> | A CSS selector |

<a name="NodeService+querySelectorAll"></a>

### pseudoHTMLDocument.querySelectorAll(selectors) ⇒ <code>Array.&lt;PseudoElement&gt;</code>
Every element below this node which matches the CSS selector, in tree order. A plain array (not a live
collection): like the DOM's querySelectorAll, it is a snapshot taken when it is called.

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>querySelectorAll</code>](#NodeService+querySelectorAll)  

| Param | Type | Description |
| --- | --- | --- |
| selectors | <code>string</code> | A CSS selector |

<a name="NodeService+childInserted"></a>

### pseudoHTMLDocument.childInserted(child)
Called each time a node has been inserted as a child of this node, so that nodes which need to react to children
(for example elements applying default events) can do so.

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>childInserted</code>](#NodeService+childInserted)  

| Param | Type | Description |
| --- | --- | --- |
| child | [<code>NodeService</code>](#NodeService) | The node which was inserted |

<a name="NodeService+compareDocumentPosition"></a>

### pseudoHTMLDocument.compareDocumentPosition(otherNode) ⇒ <code>number</code>
Say where another node is in relation to this one, as the bits of NodeService.DOCUMENT_POSITION_*: 0 for this node
itself, DISCONNECTED (with IMPLEMENTATION_SPECIFIC and a consistent PRECEDING or FOLLOWING) for a node in another tree,
CONTAINS + PRECEDING when the other node is an ancestor, CONTAINED_BY + FOLLOWING when it is a descendant,
otherwise PRECEDING or FOLLOWING by their order in the tree.

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>compareDocumentPosition</code>](#NodeService+compareDocumentPosition)  

| Param | Type | Description |
| --- | --- | --- |
| otherNode | <code>PseudoNode</code> | The node to locate |

<a name="NodeService+contains"></a>

### pseudoHTMLDocument.contains(otherNode) ⇒ <code>boolean</code>
Check whether a node is this node or one of its descendants.

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>contains</code>](#NodeService+contains)  

| Param | Type | Description |
| --- | --- | --- |
| otherNode | <code>PseudoNode</code> \| <code>null</code> | The node to look for |

<a name="NodeService+insertBefore"></a>

### pseudoHTMLDocument.insertBefore(newNode, [referenceNode]) ⇒ <code>PseudoNode</code>
Insert a node as a child of this node, before the given child (or at the end when there is none). A node which is
already in a tree is moved, and the children of a document fragment are moved in order.

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>insertBefore</code>](#NodeService+insertBefore)  
**Returns**: <code>PseudoNode</code> - The inserted node  
**Throws**:

- <code>Error</code> When the reference node is not a child of this node, or the new node is this node or contains it


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| newNode | <code>PseudoNode</code> |  | The node to insert |
| [referenceNode] | <code>PseudoNode</code> \| <code>null</code> | <code></code> | The child of this node to insert before, or null to insert at the end |

<a name="NodeService+isEqualNode"></a>

### pseudoHTMLDocument.isEqualNode(otherNode) ⇒ <code>boolean</code>
Whether another node is the same as this one, by what they hold: the same type, name and value (an element also
needs the same attributes), and children which are equal in the same order.

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>isEqualNode</code>](#NodeService+isEqualNode)  

| Param | Type | Description |
| --- | --- | --- |
| otherNode | <code>PseudoNode</code> \| <code>null</code> | The node to compare with |

<a name="NodeService+normalize"></a>

### pseudoHTMLDocument.normalize()
Tidy the text below this node: neighbouring text nodes are joined into one and empty text nodes are removed.

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>normalize</code>](#NodeService+normalize)  
<a name="NodeService+removeChild"></a>

### pseudoHTMLDocument.removeChild(childElement) ⇒ <code>PseudoNode</code>
Remove a child from this node, it no longer has a parent or siblings afterwards.

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>removeChild</code>](#NodeService+removeChild)  
**Returns**: <code>PseudoNode</code> - The removed node  
**Throws**:

- <code>Error</code> When the node is not a child of this node


| Param | Type | Description |
| --- | --- | --- |
| childElement | <code>PseudoNode</code> | The child node to remove |

<a name="NodeService+replaceChild"></a>

### pseudoHTMLDocument.replaceChild(newChild, oldChild) ⇒ <code>PseudoNode</code>
Replace a child of this node with another node (which is moved if it is already in a tree).

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>replaceChild</code>](#NodeService+replaceChild)  
**Returns**: <code>PseudoNode</code> - The replaced node  
**Throws**:

- <code>Error</code> When the old node is not a child of this node


| Param | Type | Description |
| --- | --- | --- |
| newChild | <code>PseudoNode</code> | The node which takes the place |
| oldChild | <code>PseudoNode</code> | The child of this node to replace |

<a name="PseudoEventListener"></a>

## PseudoEventListener
Handle events as they are stored and implemented.

**Kind**: global class  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  
**Properties**

| Name | Type |
| --- | --- |
| eventType | <code>string</code> | 
| eventOptions | <code>Object</code> | 
| isDefault | <code>boolean</code> | 


* [PseudoEventListener](#PseudoEventListener)
    * [new PseudoEventListener(eventType, [options], handleEvent, [originalCallback])](#new_PseudoEventListener_new)
    * [.callback](#PseudoEventListener+callback)
    * [.capture](#PseudoEventListener+capture)
    * [.passive](#PseudoEventListener+passive)
    * [.removed](#PseudoEventListener+removed)
    * [.handleEvent(event)](#PseudoEventListener+handleEvent) ⇒ <code>\*</code>
    * [.doCapturePhase(event)](#PseudoEventListener+doCapturePhase) ⇒ <code>boolean</code>
    * [.doTargetPhase(event)](#PseudoEventListener+doTargetPhase) ⇒ <code>boolean</code>
    * [.doBubblePhase(event)](#PseudoEventListener+doBubblePhase) ⇒ <code>boolean</code>
    * [.skipPhase(event)](#PseudoEventListener+skipPhase) ⇒ <code>boolean</code>
    * [.rejectEvent(event)](#PseudoEventListener+rejectEvent) ⇒ <code>boolean</code>

<a name="new_PseudoEventListener_new"></a>

### new PseudoEventListener(eventType, [options], handleEvent, [originalCallback])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| eventType | <code>string</code> |  | The type of event this listens for |
| [options] | <code>Object</code> |  | The capture, once and passive options |
| handleEvent | <code>function</code> |  | The function which is called with the event, already bound to what it should run as |
| [originalCallback] | <code>function</code> | <code>handleEvent</code> | The function (or object) which was given when registering, used to find this listener again |

<a name="PseudoEventListener+callback"></a>

### pseudoEventListener.callback
The function (or object with handleEvent) which was originally given when registering, used to find this listener again for removal.

**Kind**: instance property of [<code>PseudoEventListener</code>](#PseudoEventListener)  
<a name="PseudoEventListener+capture"></a>

### pseudoEventListener.capture
Whether this listener listens in the capture phase (and at the target) rather than in the bubble phase.

**Kind**: instance property of [<code>PseudoEventListener</code>](#PseudoEventListener)  
<a name="PseudoEventListener+passive"></a>

### pseudoEventListener.passive
Whether the listener promises not to prevent the default (preventDefault does nothing while it runs).

**Kind**: instance property of [<code>PseudoEventListener</code>](#PseudoEventListener)  
<a name="PseudoEventListener+removed"></a>

### pseudoEventListener.removed
Whether this listener has been removed, a removed listener does not run even if the event already started.

**Kind**: instance property of [<code>PseudoEventListener</code>](#PseudoEventListener)  
<a name="PseudoEventListener+handleEvent"></a>

### pseudoEventListener.handleEvent(event) ⇒ <code>\*</code>
**Kind**: instance method of [<code>PseudoEventListener</code>](#PseudoEventListener)  

| Param | Type |
| --- | --- |
| event | <code>PseudoEvent</code> | 

<a name="PseudoEventListener+doCapturePhase"></a>

### pseudoEventListener.doCapturePhase(event) ⇒ <code>boolean</code>
A capture listener runs while the event travels down to the target.

**Kind**: instance method of [<code>PseudoEventListener</code>](#PseudoEventListener)  

| Param | Type |
| --- | --- |
| event | <code>PseudoEvent</code> | 

<a name="PseudoEventListener+doTargetPhase"></a>

### pseudoEventListener.doTargetPhase(event) ⇒ <code>boolean</code>
Every listener of the target itself runs, capture listeners first.

**Kind**: instance method of [<code>PseudoEventListener</code>](#PseudoEventListener)  

| Param | Type |
| --- | --- |
| event | <code>PseudoEvent</code> | 

<a name="PseudoEventListener+doBubblePhase"></a>

### pseudoEventListener.doBubblePhase(event) ⇒ <code>boolean</code>
A listener which is not a capture listener runs while the event travels back up (when it bubbles).

**Kind**: instance method of [<code>PseudoEventListener</code>](#PseudoEventListener)  

| Param | Type |
| --- | --- |
| event | <code>PseudoEvent</code> | 

<a name="PseudoEventListener+skipPhase"></a>

### pseudoEventListener.skipPhase(event) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>PseudoEventListener</code>](#PseudoEventListener)  

| Param | Type |
| --- | --- |
| event | <code>PseudoEvent</code> | 

<a name="PseudoEventListener+rejectEvent"></a>

### pseudoEventListener.rejectEvent(event) ⇒ <code>boolean</code>
Whether this listener should not run for the event as it is now (it was removed, or it is for another phase).
Stopping propagation is handled by the dispatching, since it stops other targets and not the listeners of the
current one.

**Kind**: instance method of [<code>PseudoEventListener</code>](#PseudoEventListener)  

| Param | Type |
| --- | --- |
| event | <code>PseudoEvent</code> | 

<a name="eventDefaults"></a>

## eventDefaults : <code>Object.&lt;string, EventDefinition&gt;</code>
The events which the browser itself creates (for a user action, or for something like element.click()) have these
options. A script which creates an event with the constructor gets none of them (everything is false) unless it asks
for them, which is why createEvent only uses this table when it is told the browser is creating the event.
The values follow the UI Events, HTML, Pointer Events, Clipboard, Drag and Drop, Touch and CSS specifications.

**Kind**: global variable  
<a name="focused"></a>

## focused
The element which has the focus, kept for each tree (the root node of the tree it is in), like document.activeElement.

**Kind**: global constant  
<a name="modifierKeys"></a>

## modifierKeys([init]) ⇒ <code>ModifierKeys</code>
Pick the modifier keys out of the init object of an event.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [init] | <code>Object</code> | <code>{}</code> | The init of an event |

<a name="modifierState"></a>

## modifierState(keys, key) ⇒ <code>boolean</code>
Answer getModifierState for a set of held modifier keys.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| keys | <code>ModifierKeys</code> | The modifier keys which were held down |
| key | <code>string</code> | The name of the modifier (Control, Shift, Alt or Meta) |

<a name="getParentNodesFromAttribute"></a>

## getParentNodesFromAttribute(attr, value, node) ⇒ <code>Array.&lt;PseudoNode&gt;</code>
A selector function for retrieving existing parent PseudoNode from the given child item.
This function will check all the parents starting from node, and scan the attributes
property for matches. The return array contains all matching parent ancestors, starting with the root of the tree.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| attr | <code>string</code> | The property to compare on each ancestor (a missing property counts as false) |
| value | <code>boolean</code> \| <code>number</code> \| <code>string</code> | The value the property must have |
| node | <code>PseudoEventTarget</code> \| <code>PseudoNode</code> \| <code>\*</code> | The node to find the matching ancestors of |

<a name="getParentNodes"></a>

## getParentNodes(node) ⇒ <code>Array.&lt;PseudoNode&gt;</code>
Get all of the ancestors of a node, starting with the root of the tree and ending with the node's own parent (the
order in which an event travels down through them). A node which has no parent has no ancestors.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| node | <code>PseudoEventTarget</code> \| <code>PseudoNode</code> \| <code>\*</code> | The node to find the ancestors of |

<a name="getActiveElement"></a>

## getActiveElement(root) ⇒ <code>Object</code> \| <code>null</code>
Find the element which has the focus in a tree.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| root | <code>Object</code> | The root node of the tree |

<a name="setActiveElement"></a>

## setActiveElement(root, element)
Remember the element which has the focus in a tree.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| root | <code>Object</code> | The root node of the tree |
| element | <code>Object</code> \| <code>null</code> | The element which now has the focus, or null when nothing has it |

<a name="escapeText"></a>

## escapeText(text) ⇒ <code>string</code>
Escape text so it is safe inside HTML text content. Coerces to a string first - unlike a real DOM, pseudo-dom's
setAttribute does not itself coerce (see the same note on escapeAttributeValue), and nodeValue is not guaranteed
to be a string either.

**Kind**: global function  

| Param | Type |
| --- | --- |
| text | <code>\*</code> | 

<a name="escapeAttributeValue"></a>

## escapeAttributeValue(value) ⇒ <code>string</code>
Escape a value so it is safe inside a double-quoted HTML attribute. Coerces to a string first: a real DOM's
setAttribute always stores a string, however pseudo-dom's does not coerce what it is given, so a value set via
setAttribute(name, 5) is stored (and read back by getAttribute) as the number 5, not the string '5'.

**Kind**: global function  

| Param | Type |
| --- | --- |
| value | <code>\*</code> | 

<a name="serializeAttributes"></a>

## serializeAttributes(element) ⇒ <code>string</code>
Every attribute of the element, serialized (class instead of className, boolean attributes bare, the never-real
mock properties left out, style added from the live CSSStyleDeclaration when it is not empty).

**Kind**: global function  

| Param | Type |
| --- | --- |
| element | <code>\*</code> | 

<a name="serializeNode"></a>

## serializeNode(node) ⇒ <code>string</code>
One node, serialized (its own markup only - see serializeChildren for its descendants too).

**Kind**: global function  

| Param | Type |
| --- | --- |
| node | <code>\*</code> | 

<a name="prettyPrintNode"></a>

## prettyPrintNode(node, depth, indent) ⇒ <code>string</code>
One node, indented for readability (see prettyPrint) - unlike serializeNode, every non-empty node is its own
line, so the structure of a whole tree is easy to read at a glance.

**Kind**: global function  

| Param | Type |
| --- | --- |
| node | <code>\*</code> | 
| depth | <code>number</code> | 
| indent | <code>string</code> | 

<a name="generateNodeList"></a>

## generateNodeList([innerList]) ⇒ [<code>PseudoNodeList</code>](#PseudoNodeList)
Create a PseudoNodeList, optionally starting from an existing chain of linkers.

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| [innerList] | <code>TreeLinker</code> \| <code>null</code> | <code></code> | 

<a name="generateDocument"></a>

## generateDocument(root, context) ⇒ <code>Window</code> \| <code>PseudoEventTarget</code>
Construct the Pseudo Dom to provide access to Dom objects which are otherwise not available outside the browser
context.

**Kind**: global function  

| Param | Type |
| --- | --- |
| root | <code>Object</code> | 
| context | <code>Object</code> | 


* [generateDocument(root, context)](#generateDocument) ⇒ <code>Window</code> \| <code>PseudoEventTarget</code>
    * [~newWindow](#generateDocument..newWindow) : <code>Window</code> \| <code>PseudoEventTarget</code>
    * [~Node](#generateDocument..Node) : <code>function</code>
    * [~Element](#generateDocument..Element) : <code>function</code>
    * [~HTMLElement](#generateDocument..HTMLElement) : <code>function</code>
    * [~HTMLDocument](#generateDocument..HTMLDocument) : <code>function</code>
    * [~document](#generateDocument..document) : <code>Document</code> \| [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)

<a name="generateDocument..newWindow"></a>

### generateDocument~newWindow : <code>Window</code> \| <code>PseudoEventTarget</code>
**Kind**: inner constant of [<code>generateDocument</code>](#generateDocument)  
<a name="generateDocument..Node"></a>

### generateDocument~Node : <code>function</code>
The Node class itself (matching the DOM's window.Node), not an instance - the right-hand side of `instanceof`
must be a constructor, so `x instanceof Node` needs this, not `new PseudoNode()`.

**Kind**: inner constant of [<code>generateDocument</code>](#generateDocument)  
<a name="generateDocument..Element"></a>

### generateDocument~Element : <code>function</code>
The Element class itself, for the same reason as Node.

**Kind**: inner constant of [<code>generateDocument</code>](#generateDocument)  
<a name="generateDocument..HTMLElement"></a>

### generateDocument~HTMLElement : <code>function</code>
The HTMLElement class itself, for the same reason as Node.

**Kind**: inner constant of [<code>generateDocument</code>](#generateDocument)  
<a name="generateDocument..HTMLDocument"></a>

### generateDocument~HTMLDocument : <code>function</code>
The HTMLDocument class itself, for the same reason as Node (so `document instanceof HTMLDocument`, a common
real-DOM-detection check, works).

**Kind**: inner constant of [<code>generateDocument</code>](#generateDocument)  
<a name="generateDocument..document"></a>

### generateDocument~document : <code>Document</code> \| [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)
Define document when not available - a real instance, unlike the classes above (window.document IS an object,
not a constructor).

**Kind**: inner constant of [<code>generateDocument</code>](#generateDocument)  
<a name="nearestElementSibling"></a>

## nearestElementSibling(node, direction) ⇒ <code>\*</code> \| <code>null</code>
Walk up from a node (not including it) to find the nearest element, in the given direction.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| node | <code>\*</code> | The node to start from |
| direction | <code>&#x27;nextSibling&#x27;</code> \| <code>&#x27;previousSibling&#x27;</code> | Which sibling reference to follow |

<a name="kebabToCamel"></a>

## kebabToCamel(name) ⇒ <code>string</code>
kebab-case -> camelCase ("background-color" -> "backgroundColor").

**Kind**: global function  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 

<a name="camelToKebab"></a>

## camelToKebab(name) ⇒ <code>string</code>
camelCase -> kebab-case ("backgroundColor" -> "background-color").

**Kind**: global function  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 

<a name="createEvent"></a>

## createEvent(type, [init], [options]) ⇒ [<code>EventService</code>](#EventService)
Create an event of the kind which suits its type (a click is a MouseEvent, a keydown a KeyboardEvent, ...).
By default this is like using the constructor of the event in a script: nothing bubbles or can be cancelled unless
the init says so, and the event is not trusted. With browser: true the event is created the way the browser creates
it, using the standard options for its type (see eventDefaults), and trusted: true makes it look like it came from a
real user action (isTrusted).

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| type | <code>string</code> |  | The type of the event, such as click |
| [init] | <code>Object</code> | <code>{}</code> | The options for the event (bubbles, cancelable, composed and those of its kind of event) |
| [options] | <code>CreateEventOptions</code> | <code>{}</code> | Whether the browser is creating the event, and whether it is trusted |

<a name="dataAttributes"></a>

## dataAttributes(element) ⇒ <code>Array.&lt;Array.&lt;string&gt;&gt;</code>
Every data-* attribute name currently on the element, as [attributeName, camelCaseName] pairs.

**Kind**: global function  

| Param | Type |
| --- | --- |
| element | <code>\*</code> | 

