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
all have them; \`matches\` / \`closest\` are on \`ElementService\`; \`getElementById\` is on \`DocumentService\` only,
matching the real DOM.

Not implemented yet (these throw a "not implemented" error or are missing): \`getElementsByTagNameNS\`, \`innerHTML\` /
\`outerHTML\` parsing, and most of the rest of the Element and Document APIs. The API will change before 1.0.
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
<dt><a href="#AttrService">AttrService</a> ⇐ <code><a href="#NodeService">NodeService</a></code></dt>
<dd><p>Simulate the behaviour of the Attr Class when there is no DOM available.</p>
</dd>
<dt><a href="#LinkedNode">LinkedNode</a> ⇐ <code><a href="#NodeService">NodeService</a></code></dt>
<dd><p>A node which is stored in a TreeLinker (for example by a list built from an array of values). It finds its siblings
from that linker, and its parent from the linker&#39;s parent when it has not been given one by appendChild.</p>
</dd>
<dt><a href="#PseudoNodeList">PseudoNodeList</a> ⇐ <code>LinkedTreeList</code></dt>
<dd><p>A NodeList, like the DOM one, iterates over the nodes themselves (the data stored in each TreeLinker), rather than
the linkers that hold them.</p>
</dd>
<dt><a href="#PseudoHTMLDocument">PseudoHTMLDocument</a> ⇐ <code>PseudoHTMLElement</code></dt>
<dd><p>Simulate the behaviour of the HTMLDocument Class when there is no DOM available.</p>
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
<dt><a href="#HTMLElementService_1">HTMLElementService_1</a> : <code>PseudoHTMLElement</code></dt>
<dd></dd>
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
<dt><a href="#generateNodeList">generateNodeList([innerList])</a> ⇒ <code><a href="#PseudoNodeList">PseudoNodeList</a></code></dt>
<dd><p>Create a PseudoNodeList, optionally starting from an existing chain of linkers.</p>
</dd>
<dt><a href="#generateNode">generateNode()</a> ⇒ <code>function</code></dt>
<dd><p>Create a TreeLinker class whose linkers each store a node (a LinkedNode) as their data, this can be used to build a
tree (or list) of nodes from plain values.</p>
</dd>
<dt><a href="#generateDocument">generateDocument(root, context)</a> ⇒ <code>Window</code> | <code>PseudoEventTarget</code></dt>
<dd><p>Construct the Pseudo Dom to provide access to Dom objects which are otherwise not available outside the browser
context.</p>
</dd>
<dt><a href="#nearestElementSibling">nearestElementSibling(node, direction)</a> ⇒ <code>*</code> | <code>null</code></dt>
<dd><p>Walk up from a node (not including it) to find the nearest element, in the given direction.</p>
</dd>
<dt><a href="#createEvent">createEvent(type, [init], [options])</a> ⇒ <code><a href="#EventService">EventService</a></code></dt>
<dd><p>Create an event of the kind which suits its type (a click is a MouseEvent, a keydown a KeyboardEvent, ...).
By default this is like using the constructor of the event in a script: nothing bubbles or can be cancelled unless
the init says so, and the event is not trusted. With browser: true the event is created the way the browser creates
it, using the standard options for its type (see eventDefaults), and trusted: true makes it look like it came from a
real user action (isTrusted).</p>
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
| style | <code>Object</code> | A container to define all applied inline-styles |
| title | <code>string</code> | The title attribute which affects the text visible on hover |


* [HTMLElementService](#HTMLElementService) ⇐ <code>PseudoElement</code>
    * [new HTMLElementService([elementOptions])](#new_HTMLElementService_new)
    * [.canFocus](#HTMLElementService+canFocus) ⇒ <code>boolean</code>
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

<a name="HTMLElementService+canFocus"></a>

### htmlElementService.canFocus ⇒ <code>boolean</code>
Whether this element can have the focus: form controls and links which are not disabled, and anything with a tabindex.

**Kind**: instance property of [<code>HTMLElementService</code>](#HTMLElementService)  
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
    * [.children](#ElementService+children) ⇒ <code>PseudoHTMLCollection</code>
    * [.childElementCount](#ElementService+childElementCount) ⇒ <code>number</code>
    * [.firstElementChild](#ElementService+firstElementChild) ⇒ <code>PseudoElement</code> \| <code>null</code>
    * [.lastElementChild](#ElementService+lastElementChild) ⇒ <code>PseudoElement</code> \| <code>null</code>
    * [.nextElementSibling](#ElementService+nextElementSibling) ⇒ <code>PseudoElement</code> \| <code>null</code>
    * [.previousElementSibling](#ElementService+previousElementSibling) ⇒ <code>PseudoElement</code> \| <code>null</code>
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

<a name="new_ElementService_new"></a>

### new ElementService([settings])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [settings] | <code>Object</code> | <code>{}</code> |  |
| [settings.tagName] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | The name of the tag this element represents |
| [settings.attributes] | <code>Array.&lt;{name: string, value: \*}&gt;</code> | <code>[]</code> | The attributes (also assigned as properties) to start with |
| [settings.parent] | <code>PseudoNode</code> \| <code>null</code> | <code></code> | The node to add this element to as its last child |
| [settings.children] | <code>Array.&lt;PseudoNode&gt;</code> | <code>[]</code> | The nodes to start as children |

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

<a name="DocumentService"></a>

## DocumentService ⇐ [<code>NodeService</code>](#NodeService)
Simulate the behaviour of the Document Class when there is no DOM available.

**Kind**: global class  
**Extends**: [<code>NodeService</code>](#NodeService)  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  

* [DocumentService](#DocumentService) ⇐ [<code>NodeService</code>](#NodeService)
    * [.acceptsChildren](#NodeService+acceptsChildren) ⇒ <code>boolean</code>
    * [.getElementById(id)](#DocumentService+getElementById) ⇒ <code>PseudoElement</code> \| <code>null</code>
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

<a name="LinkedNode"></a>

## LinkedNode ⇐ [<code>NodeService</code>](#NodeService)
A node which is stored in a TreeLinker (for example by a list built from an array of values). It finds its siblings
from that linker, and its parent from the linker's parent when it has not been given one by appendChild.

**Kind**: global class  
**Extends**: [<code>NodeService</code>](#NodeService)  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  

* [LinkedNode](#LinkedNode) ⇐ [<code>NodeService</code>](#NodeService)
    * [new LinkedNode(linker, value)](#new_LinkedNode_new)
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

<a name="new_LinkedNode_new"></a>

### new LinkedNode(linker, value)

| Param | Type | Description |
| --- | --- | --- |
| linker | <code>TreeLinker</code> | The linker holding this node |
| value | <code>string</code> \| <code>null</code> | The value of the node |

<a name="NodeService+acceptsChildren"></a>

### linkedNode.acceptsChildren ⇒ <code>boolean</code>
Whether this kind of node can have children (text, comments and attributes cannot).

**Kind**: instance property of [<code>LinkedNode</code>](#LinkedNode)  
**Overrides**: [<code>acceptsChildren</code>](#NodeService+acceptsChildren)  
<a name="NodeService+appendChild"></a>

### linkedNode.appendChild(childNode) ⇒ <code>PseudoNode</code>
Add a node as the last child of this node (a node which is already in a tree is moved).

**Kind**: instance method of [<code>LinkedNode</code>](#LinkedNode)  
**Overrides**: [<code>appendChild</code>](#NodeService+appendChild)  
**Returns**: <code>PseudoNode</code> - The added node  

| Param | Type | Description |
| --- | --- | --- |
| childNode | <code>PseudoNode</code> | The node to add |

<a name="NodeService+cloneShallow"></a>

### linkedNode.cloneShallow() ⇒ [<code>NodeService</code>](#NodeService)
Make a copy of this node without its children, its parent or its listeners, which is what cloneNode starts from.
Kinds of node which are made with arguments override this to give them.

**Kind**: instance method of [<code>LinkedNode</code>](#LinkedNode)  
**Overrides**: [<code>cloneShallow</code>](#NodeService+cloneShallow)  
<a name="NodeService+equalsShallow"></a>

### linkedNode.equalsShallow(other) ⇒ <code>boolean</code>
Whether another node of the same type is equal to this one apart from its children, which isEqualNode compares
afterwards. Kinds of node with more to compare (an element has attributes) override this.

**Kind**: instance method of [<code>LinkedNode</code>](#LinkedNode)  
**Overrides**: [<code>equalsShallow</code>](#NodeService+equalsShallow)  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>NodeService</code>](#NodeService) | The node to compare with |

<a name="NodeService+append"></a>

### linkedNode.append(...nodes)
Add nodes (strings become text nodes) as the last children of this node, in the order given.

**Kind**: instance method of [<code>LinkedNode</code>](#LinkedNode)  
**Overrides**: [<code>append</code>](#NodeService+append)  
**Throws**:

- <code>Error</code> When this kind of node cannot have children


| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+prepend"></a>

### linkedNode.prepend(...nodes)
Add nodes (strings become text nodes) as the first children of this node, in the order given.

**Kind**: instance method of [<code>LinkedNode</code>](#LinkedNode)  
**Overrides**: [<code>prepend</code>](#NodeService+prepend)  
**Throws**:

- <code>Error</code> When this kind of node cannot have children


| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+replaceChildren"></a>

### linkedNode.replaceChildren(...nodes)
Remove every child of this node and put the given nodes (strings become text nodes) in their place, in order.

**Kind**: instance method of [<code>LinkedNode</code>](#LinkedNode)  
**Overrides**: [<code>replaceChildren</code>](#NodeService+replaceChildren)  
**Throws**:

- <code>Error</code> When this kind of node cannot have children


| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+before"></a>

### linkedNode.before(...nodes)
Add nodes (strings become text nodes) as this node's previous siblings, in order. Does nothing when this node has
no parent.

**Kind**: instance method of [<code>LinkedNode</code>](#LinkedNode)  
**Overrides**: [<code>before</code>](#NodeService+before)  

| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+after"></a>

### linkedNode.after(...nodes)
Add nodes (strings become text nodes) as this node's next siblings, in order. Does nothing when this node has no
parent.

**Kind**: instance method of [<code>LinkedNode</code>](#LinkedNode)  
**Overrides**: [<code>after</code>](#NodeService+after)  

| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to add |

<a name="NodeService+replaceWith"></a>

### linkedNode.replaceWith(...nodes)
Put the given nodes (strings become text nodes) where this node is, in order, then remove this node. Does nothing
when this node has no parent.

**Kind**: instance method of [<code>LinkedNode</code>](#LinkedNode)  
**Overrides**: [<code>replaceWith</code>](#NodeService+replaceWith)  

| Param | Type | Description |
| --- | --- | --- |
| ...nodes | <code>PseudoNode</code> \| <code>string</code> | The nodes (or text) to put in this node's place |

<a name="NodeService+remove"></a>

### linkedNode.remove()
Remove this node from its parent. Does nothing when it has no parent.

**Kind**: instance method of [<code>LinkedNode</code>](#LinkedNode)  
**Overrides**: [<code>remove</code>](#NodeService+remove)  
<a name="NodeService+toChildNode"></a>

### linkedNode.toChildNode(value) ⇒ <code>PseudoNode</code>
Turn a value given to append / prepend / before / after / replaceWith / replaceChildren into a node: a string
becomes a text node belonging to this node's document, anything else is returned as it is.

**Kind**: instance method of [<code>LinkedNode</code>](#LinkedNode)  
**Overrides**: [<code>toChildNode</code>](#NodeService+toChildNode)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>PseudoNode</code> \| <code>string</code> | The value to add |

<a name="NodeService+getElementsByTagName"></a>

### linkedNode.getElementsByTagName(tagName) ⇒ <code>PseudoHTMLCollection</code>
Every element below this node with the given tag name (or every element when tagName is *), live.

**Kind**: instance method of [<code>LinkedNode</code>](#LinkedNode)  
**Overrides**: [<code>getElementsByTagName</code>](#NodeService+getElementsByTagName)  

| Param | Type |
| --- | --- |
| tagName | <code>string</code> | 

<a name="NodeService+getElementsByClassName"></a>

### linkedNode.getElementsByClassName(className) ⇒ <code>PseudoHTMLCollection</code>
Every element below this node which has all of the given (space separated) classes, live.

**Kind**: instance method of [<code>LinkedNode</code>](#LinkedNode)  
**Overrides**: [<code>getElementsByClassName</code>](#NodeService+getElementsByClassName)  

| Param | Type |
| --- | --- |
| className | <code>string</code> | 

<a name="NodeService+querySelector"></a>

### linkedNode.querySelector(selectors) ⇒ <code>PseudoElement</code> \| <code>null</code>
The first element below this node which matches the CSS selector, in tree order, or null when there is none.

**Kind**: instance method of [<code>LinkedNode</code>](#LinkedNode)  
**Overrides**: [<code>querySelector</code>](#NodeService+querySelector)  

| Param | Type | Description |
| --- | --- | --- |
| selectors | <code>string</code> | A CSS selector |

<a name="NodeService+querySelectorAll"></a>

### linkedNode.querySelectorAll(selectors) ⇒ <code>Array.&lt;PseudoElement&gt;</code>
Every element below this node which matches the CSS selector, in tree order. A plain array (not a live
collection): like the DOM's querySelectorAll, it is a snapshot taken when it is called.

**Kind**: instance method of [<code>LinkedNode</code>](#LinkedNode)  
**Overrides**: [<code>querySelectorAll</code>](#NodeService+querySelectorAll)  

| Param | Type | Description |
| --- | --- | --- |
| selectors | <code>string</code> | A CSS selector |

<a name="NodeService+childInserted"></a>

### linkedNode.childInserted(child)
Called each time a node has been inserted as a child of this node, so that nodes which need to react to children
(for example elements applying default events) can do so.

**Kind**: instance method of [<code>LinkedNode</code>](#LinkedNode)  
**Overrides**: [<code>childInserted</code>](#NodeService+childInserted)  

| Param | Type | Description |
| --- | --- | --- |
| child | [<code>NodeService</code>](#NodeService) | The node which was inserted |

<a name="NodeService+cloneNode"></a>

### linkedNode.cloneNode([deep]) ⇒ <code>PseudoNode</code>
Make a copy of this node (without its parent, and without its event listeners). With deep the children are copied
too, all the way down.

**Kind**: instance method of [<code>LinkedNode</code>](#LinkedNode)  
**Overrides**: [<code>cloneNode</code>](#NodeService+cloneNode)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [deep] | <code>boolean</code> | <code>false</code> | Copy the children as well |

<a name="NodeService+compareDocumentPosition"></a>

### linkedNode.compareDocumentPosition(otherNode) ⇒ <code>number</code>
Say where another node is in relation to this one, as the bits of NodeService.DOCUMENT_POSITION_*: 0 for this node
itself, DISCONNECTED (with IMPLEMENTATION_SPECIFIC and a consistent PRECEDING or FOLLOWING) for a node in another tree,
CONTAINS + PRECEDING when the other node is an ancestor, CONTAINED_BY + FOLLOWING when it is a descendant,
otherwise PRECEDING or FOLLOWING by their order in the tree.

**Kind**: instance method of [<code>LinkedNode</code>](#LinkedNode)  
**Overrides**: [<code>compareDocumentPosition</code>](#NodeService+compareDocumentPosition)  

| Param | Type | Description |
| --- | --- | --- |
| otherNode | <code>PseudoNode</code> | The node to locate |

<a name="NodeService+contains"></a>

### linkedNode.contains(otherNode) ⇒ <code>boolean</code>
Check whether a node is this node or one of its descendants.

**Kind**: instance method of [<code>LinkedNode</code>](#LinkedNode)  
**Overrides**: [<code>contains</code>](#NodeService+contains)  

| Param | Type | Description |
| --- | --- | --- |
| otherNode | <code>PseudoNode</code> \| <code>null</code> | The node to look for |

<a name="NodeService+insertBefore"></a>

### linkedNode.insertBefore(newNode, [referenceNode]) ⇒ <code>PseudoNode</code>
Insert a node as a child of this node, before the given child (or at the end when there is none). A node which is
already in a tree is moved, and the children of a document fragment are moved in order.

**Kind**: instance method of [<code>LinkedNode</code>](#LinkedNode)  
**Overrides**: [<code>insertBefore</code>](#NodeService+insertBefore)  
**Returns**: <code>PseudoNode</code> - The inserted node  
**Throws**:

- <code>Error</code> When the reference node is not a child of this node, or the new node is this node or contains it


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| newNode | <code>PseudoNode</code> |  | The node to insert |
| [referenceNode] | <code>PseudoNode</code> \| <code>null</code> | <code></code> | The child of this node to insert before, or null to insert at the end |

<a name="NodeService+isEqualNode"></a>

### linkedNode.isEqualNode(otherNode) ⇒ <code>boolean</code>
Whether another node is the same as this one, by what they hold: the same type, name and value (an element also
needs the same attributes), and children which are equal in the same order.

**Kind**: instance method of [<code>LinkedNode</code>](#LinkedNode)  
**Overrides**: [<code>isEqualNode</code>](#NodeService+isEqualNode)  

| Param | Type | Description |
| --- | --- | --- |
| otherNode | <code>PseudoNode</code> \| <code>null</code> | The node to compare with |

<a name="NodeService+normalize"></a>

### linkedNode.normalize()
Tidy the text below this node: neighbouring text nodes are joined into one and empty text nodes are removed.

**Kind**: instance method of [<code>LinkedNode</code>](#LinkedNode)  
**Overrides**: [<code>normalize</code>](#NodeService+normalize)  
<a name="NodeService+removeChild"></a>

### linkedNode.removeChild(childElement) ⇒ <code>PseudoNode</code>
Remove a child from this node, it no longer has a parent or siblings afterwards.

**Kind**: instance method of [<code>LinkedNode</code>](#LinkedNode)  
**Overrides**: [<code>removeChild</code>](#NodeService+removeChild)  
**Returns**: <code>PseudoNode</code> - The removed node  
**Throws**:

- <code>Error</code> When the node is not a child of this node


| Param | Type | Description |
| --- | --- | --- |
| childElement | <code>PseudoNode</code> | The child node to remove |

<a name="NodeService+replaceChild"></a>

### linkedNode.replaceChild(newChild, oldChild) ⇒ <code>PseudoNode</code>
Replace a child of this node with another node (which is moved if it is already in a tree).

**Kind**: instance method of [<code>LinkedNode</code>](#LinkedNode)  
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

## PseudoHTMLDocument ⇐ <code>PseudoHTMLElement</code>
Simulate the behaviour of the HTMLDocument Class when there is no DOM available.

**Kind**: global class  
**Extends**: <code>PseudoHTMLElement</code>  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| head | <code>PseudoHTMLElement</code> | A reference to the Head child element |
| body | <code>PseudoHTMLElement</code> | A reference to the Body child element |
| createElement | <code>function</code> | Generate a new PseudoHTMLElement (which is not in the document until it is appended) |


* [PseudoHTMLDocument](#PseudoHTMLDocument) ⇐ <code>PseudoHTMLElement</code>
    * [new PseudoHTMLDocument()](#new_PseudoHTMLDocument_new)
    * [.head](#PseudoHTMLDocument+head) : <code>PseudoHTMLElement</code>
    * [.body](#PseudoHTMLDocument+body) : <code>PseudoHTMLElement</code>
    * [.createElement(tagName)](#PseudoHTMLDocument+createElement) ⇒ <code>PseudoHTMLElement</code>
    * [.createTextNode([data])](#PseudoHTMLDocument+createTextNode) ⇒ [<code>TextService</code>](#TextService)
    * [.createComment([data])](#PseudoHTMLDocument+createComment) ⇒ [<code>CommentService</code>](#CommentService)
    * [.createDocumentFragment()](#PseudoHTMLDocument+createDocumentFragment) ⇒ [<code>DocumentFragmentService</code>](#DocumentFragmentService)
    * [.cloneNode([deep])](#PseudoHTMLDocument+cloneNode) ⇒ <code>PseudoNode</code>

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
<a name="PseudoHTMLDocument+createElement"></a>

### pseudoHTMLDocument.createElement(tagName) ⇒ <code>PseudoHTMLElement</code>
Make an element of the given type which belongs to this document but is not added anywhere until it is appended.

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| tagName | <code>string</code> | <code>&quot;div&quot;</code> | Tag Name is a string representing the type of Dom element this represents |

<a name="PseudoHTMLDocument+createTextNode"></a>

### pseudoHTMLDocument.createTextNode([data]) ⇒ [<code>TextService</code>](#TextService)
Make a text node which belongs to this document.

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [data] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | The text |

<a name="PseudoHTMLDocument+createComment"></a>

### pseudoHTMLDocument.createComment([data]) ⇒ [<code>CommentService</code>](#CommentService)
Make a comment which belongs to this document.

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [data] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | The comment |

<a name="PseudoHTMLDocument+createDocumentFragment"></a>

### pseudoHTMLDocument.createDocumentFragment() ⇒ [<code>DocumentFragmentService</code>](#DocumentFragmentService)
Make an empty document fragment which belongs to this document, a container for nodes which can be built up and
then inserted in one go.

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
<a name="PseudoHTMLDocument+cloneNode"></a>

### pseudoHTMLDocument.cloneNode([deep]) ⇒ <code>PseudoNode</code>
Make a copy of this document. The copy has no parent or listeners, and a deep copy has copies of everything in the
document (a shallow one is an empty document).

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [deep] | <code>boolean</code> | <code>false</code> | Copy everything in the document as well |

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
<a name="HTMLElementService_1"></a>

## HTMLElementService\_1 : <code>PseudoHTMLElement</code>
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

<a name="generateNodeList"></a>

## generateNodeList([innerList]) ⇒ [<code>PseudoNodeList</code>](#PseudoNodeList)
Create a PseudoNodeList, optionally starting from an existing chain of linkers.

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| [innerList] | <code>TreeLinker</code> \| <code>null</code> | <code></code> | 

<a name="generateNode"></a>

## generateNode() ⇒ <code>function</code>
Create a TreeLinker class whose linkers each store a node (a LinkedNode) as their data, this can be used to build a
tree (or list) of nodes from plain values.

**Kind**: global function  
**Returns**: <code>function</code> - The NodeFactory class (a TreeLinker) to use as the linker class  
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
    * [~Node](#generateDocument..Node) : <code>Node</code> \| <code>PseudoNode</code>
    * [~Element](#generateDocument..Element) : <code>Element</code> \| <code>PseudoElement</code>
    * [~HTMLElement](#generateDocument..HTMLElement) : <code>HTMLElement</code> \| <code>PseudoHTMLElement</code>
    * [~document](#generateDocument..document) : <code>Document</code> \| [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)

<a name="generateDocument..newWindow"></a>

### generateDocument~newWindow : <code>Window</code> \| <code>PseudoEventTarget</code>
**Kind**: inner constant of [<code>generateDocument</code>](#generateDocument)  
<a name="generateDocument..Node"></a>

### generateDocument~Node : <code>Node</code> \| <code>PseudoNode</code>
**Kind**: inner constant of [<code>generateDocument</code>](#generateDocument)  
<a name="generateDocument..Element"></a>

### generateDocument~Element : <code>Element</code> \| <code>PseudoElement</code>
**Kind**: inner constant of [<code>generateDocument</code>](#generateDocument)  
<a name="generateDocument..HTMLElement"></a>

### generateDocument~HTMLElement : <code>HTMLElement</code> \| <code>PseudoHTMLElement</code>
Create an instance of HTMLElement if not available

**Kind**: inner constant of [<code>generateDocument</code>](#generateDocument)  
<a name="generateDocument..document"></a>

### generateDocument~document : <code>Document</code> \| [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)
Define document when not available

**Kind**: inner constant of [<code>generateDocument</code>](#generateDocument)  
<a name="nearestElementSibling"></a>

## nearestElementSibling(node, direction) ⇒ <code>\*</code> \| <code>null</code>
Walk up from a node (not including it) to find the nearest element, in the given direction.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| node | <code>\*</code> | The node to start from |
| direction | <code>&#x27;nextSibling&#x27;</code> \| <code>&#x27;previousSibling&#x27;</code> | Which sibling reference to follow |

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

