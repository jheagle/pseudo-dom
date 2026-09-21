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

Not implemented yet (these throw a "not implemented" error or are missing): `cloneNode`, `compareDocumentPosition`, `isEqualNode`, `querySelector` /
`querySelectorAll`, `innerHTML` / `outerHTML` parsing, and most of the rest of the Element and Document APIs. The API
will change before 1.0.
## Modules

<dl>
<dt><a href="#module_pseudoDom/objects">pseudoDom/objects</a> : <code>Object</code></dt>
<dd><p>All methods exported from this module are encapsulated within pseudoDom.</p>
</dd>
</dl>

## Classes

<dl>
<dt><a href="#NodeService">NodeService</a> ⇐ <code>PseudoEventTarget</code></dt>
<dd><p>Simulate the behaviour of the Node Class when there is no DOM available.</p>
</dd>
<dt><a href="#NamedNodeMapService">NamedNodeMapService</a></dt>
<dd><p>Simulate the behaviour of the NamedNodeMap Class when there is no DOM available.</p>
</dd>
<dt><a href="#HTMLElementService">HTMLElementService</a> ⇐ <code>PseudoElement</code></dt>
<dd><p>Simulate the behaviour of the HTMLElement Class when there is no DOM available.</p>
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

## Constants

<dl>
<dt><a href="#HTMLElementService_1">HTMLElementService_1</a> : <code>PseudoHTMLElement</code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#getParentNodesFromAttribute">getParentNodesFromAttribute(attr, value, node)</a> ⇒ <code>Array.&lt;PseudoNode&gt;</code></dt>
<dd><p>A selector function for retrieving existing parent PseudoNode from the given child item.
This function will check all the parents starting from node, and scan the attributes
property for matches. The return array contains all matching parent ancestors, starting with the root of the tree.</p>
</dd>
<dt><a href="#getParentNodes">getParentNodes(node)</a> ⇒ <code>Array.&lt;PseudoNode&gt;</code></dt>
<dd><p>Get all of the ancestors of a node, starting with the root of the tree and ending with the node&#39;s own parent (the
order in which an event travels down through them). A node which has no parent has no ancestors.</p>
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
</dl>

<a name="module_pseudoDom/objects"></a>

## pseudoDom/objects : <code>Object</code>
All methods exported from this module are encapsulated within pseudoDom.

**Author**: Joshua Heagle <joshuaheagle@gmail.com>  
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
    * [.appendChild(childNode)](#NodeService+appendChild) ⇒ <code>PseudoNode</code>
    * [.childInserted(child)](#NodeService+childInserted)
    * [.cloneNode()](#NodeService+cloneNode)
    * [.compareDocumentPosition()](#NodeService+compareDocumentPosition)
    * [.contains(otherNode)](#NodeService+contains) ⇒ <code>boolean</code>
    * [.insertBefore(newNode, [referenceNode])](#NodeService+insertBefore) ⇒ <code>PseudoNode</code>
    * [.isEqualNode()](#NodeService+isEqualNode)
    * [.removeChild(childElement)](#NodeService+removeChild) ⇒ <code>PseudoNode</code>
    * [.replaceChild(newChild, oldChild)](#NodeService+replaceChild) ⇒ <code>PseudoNode</code>

<a name="NodeService+appendChild"></a>

### nodeService.appendChild(childNode) ⇒ <code>PseudoNode</code>
Add a node as the last child of this node (a node which is already in a tree is moved).

**Kind**: instance method of [<code>NodeService</code>](#NodeService)  
**Returns**: <code>PseudoNode</code> - The added node  

| Param | Type | Description |
| --- | --- | --- |
| childNode | <code>PseudoNode</code> | The node to add |

<a name="NodeService+childInserted"></a>

### nodeService.childInserted(child)
Called each time a node has been inserted as a child of this node, so that nodes which need to react to children
(for example elements applying default events) can do so.

**Kind**: instance method of [<code>NodeService</code>](#NodeService)  

| Param | Type | Description |
| --- | --- | --- |
| child | [<code>NodeService</code>](#NodeService) | The node which was inserted |

<a name="NodeService+cloneNode"></a>

### nodeService.cloneNode()
Not implemented yet.

**Kind**: instance method of [<code>NodeService</code>](#NodeService)  
**Throws**:

- <code>Error</code> 

<a name="NodeService+compareDocumentPosition"></a>

### nodeService.compareDocumentPosition()
Not implemented yet.

**Kind**: instance method of [<code>NodeService</code>](#NodeService)  
**Throws**:

- <code>Error</code> 

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

### nodeService.isEqualNode()
Not implemented yet.

**Kind**: instance method of [<code>NodeService</code>](#NodeService)  
**Throws**:

- <code>Error</code> 

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

<a name="new_HTMLElementService_new"></a>

### new HTMLElementService([elementOptions])
Simulate the HTMLElement object when the Dom is not available


| Param | Type | Default |
| --- | --- | --- |
| [elementOptions] | <code>Object</code> | <code>{}</code> | 
| [elementOptions.tagName] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | 
| [elementOptions.parent] | <code>PseudoNode</code> \| <code>Object</code> | <code>{}</code> | 
| [elementOptions.children] | <code>Array</code> | <code>[]</code> | 

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
| [eventOptions.bubbles] | <code>boolean</code> | <code>true</code> | 
| [eventOptions.cancelable] | <code>boolean</code> | <code>true</code> | 
| [eventOptions.composed] | <code>boolean</code> | <code>true</code> | 

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
    * [.applyDefaultEvent()](#ElementService+applyDefaultEvent) ⇒ <code>function</code>
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

<a name="ElementService+applyDefaultEvent"></a>

### elementService.applyDefaultEvent() ⇒ <code>function</code>
Some elements have default behaviour, this registers it when the element is added.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  
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
    * [.appendChild(childNode)](#NodeService+appendChild) ⇒ <code>PseudoNode</code>
    * [.childInserted(child)](#NodeService+childInserted)
    * [.cloneNode()](#NodeService+cloneNode)
    * [.compareDocumentPosition()](#NodeService+compareDocumentPosition)
    * [.contains(otherNode)](#NodeService+contains) ⇒ <code>boolean</code>
    * [.insertBefore(newNode, [referenceNode])](#NodeService+insertBefore) ⇒ <code>PseudoNode</code>
    * [.isEqualNode()](#NodeService+isEqualNode)
    * [.removeChild(childElement)](#NodeService+removeChild) ⇒ <code>PseudoNode</code>
    * [.replaceChild(newChild, oldChild)](#NodeService+replaceChild) ⇒ <code>PseudoNode</code>

<a name="NodeService+appendChild"></a>

### documentService.appendChild(childNode) ⇒ <code>PseudoNode</code>
Add a node as the last child of this node (a node which is already in a tree is moved).

**Kind**: instance method of [<code>DocumentService</code>](#DocumentService)  
**Returns**: <code>PseudoNode</code> - The added node  

| Param | Type | Description |
| --- | --- | --- |
| childNode | <code>PseudoNode</code> | The node to add |

<a name="NodeService+childInserted"></a>

### documentService.childInserted(child)
Called each time a node has been inserted as a child of this node, so that nodes which need to react to children
(for example elements applying default events) can do so.

**Kind**: instance method of [<code>DocumentService</code>](#DocumentService)  

| Param | Type | Description |
| --- | --- | --- |
| child | [<code>NodeService</code>](#NodeService) | The node which was inserted |

<a name="NodeService+cloneNode"></a>

### documentService.cloneNode()
Not implemented yet.

**Kind**: instance method of [<code>DocumentService</code>](#DocumentService)  
**Throws**:

- <code>Error</code> 

<a name="NodeService+compareDocumentPosition"></a>

### documentService.compareDocumentPosition()
Not implemented yet.

**Kind**: instance method of [<code>DocumentService</code>](#DocumentService)  
**Throws**:

- <code>Error</code> 

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

### documentService.isEqualNode()
Not implemented yet.

**Kind**: instance method of [<code>DocumentService</code>](#DocumentService)  
**Throws**:

- <code>Error</code> 

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
    * [.appendChild(childNode)](#NodeService+appendChild) ⇒ <code>PseudoNode</code>
    * [.childInserted(child)](#NodeService+childInserted)
    * [.cloneNode()](#NodeService+cloneNode)
    * [.compareDocumentPosition()](#NodeService+compareDocumentPosition)
    * [.contains(otherNode)](#NodeService+contains) ⇒ <code>boolean</code>
    * [.insertBefore(newNode, [referenceNode])](#NodeService+insertBefore) ⇒ <code>PseudoNode</code>
    * [.isEqualNode()](#NodeService+isEqualNode)
    * [.removeChild(childElement)](#NodeService+removeChild) ⇒ <code>PseudoNode</code>
    * [.replaceChild(newChild, oldChild)](#NodeService+replaceChild) ⇒ <code>PseudoNode</code>

<a name="NodeService+appendChild"></a>

### documentFragmentService.appendChild(childNode) ⇒ <code>PseudoNode</code>
Add a node as the last child of this node (a node which is already in a tree is moved).

**Kind**: instance method of [<code>DocumentFragmentService</code>](#DocumentFragmentService)  
**Returns**: <code>PseudoNode</code> - The added node  

| Param | Type | Description |
| --- | --- | --- |
| childNode | <code>PseudoNode</code> | The node to add |

<a name="NodeService+childInserted"></a>

### documentFragmentService.childInserted(child)
Called each time a node has been inserted as a child of this node, so that nodes which need to react to children
(for example elements applying default events) can do so.

**Kind**: instance method of [<code>DocumentFragmentService</code>](#DocumentFragmentService)  

| Param | Type | Description |
| --- | --- | --- |
| child | [<code>NodeService</code>](#NodeService) | The node which was inserted |

<a name="NodeService+cloneNode"></a>

### documentFragmentService.cloneNode()
Not implemented yet.

**Kind**: instance method of [<code>DocumentFragmentService</code>](#DocumentFragmentService)  
**Throws**:

- <code>Error</code> 

<a name="NodeService+compareDocumentPosition"></a>

### documentFragmentService.compareDocumentPosition()
Not implemented yet.

**Kind**: instance method of [<code>DocumentFragmentService</code>](#DocumentFragmentService)  
**Throws**:

- <code>Error</code> 

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

### documentFragmentService.isEqualNode()
Not implemented yet.

**Kind**: instance method of [<code>DocumentFragmentService</code>](#DocumentFragmentService)  
**Throws**:

- <code>Error</code> 

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

<a name="AttrService"></a>

## AttrService ⇐ [<code>NodeService</code>](#NodeService)
Simulate the behaviour of the Attr Class when there is no DOM available.

**Kind**: global class  
**Extends**: [<code>NodeService</code>](#NodeService)  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  

* [AttrService](#AttrService) ⇐ [<code>NodeService</code>](#NodeService)
    * [new AttrService(name, [value], [ownerElement], [namespaceURI], [prefix])](#new_AttrService_new)
    * [.appendChild(childNode)](#NodeService+appendChild) ⇒ <code>PseudoNode</code>
    * [.childInserted(child)](#NodeService+childInserted)
    * [.cloneNode()](#NodeService+cloneNode)
    * [.compareDocumentPosition()](#NodeService+compareDocumentPosition)
    * [.contains(otherNode)](#NodeService+contains) ⇒ <code>boolean</code>
    * [.insertBefore(newNode, [referenceNode])](#NodeService+insertBefore) ⇒ <code>PseudoNode</code>
    * [.isEqualNode()](#NodeService+isEqualNode)
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

<a name="NodeService+appendChild"></a>

### attrService.appendChild(childNode) ⇒ <code>PseudoNode</code>
Add a node as the last child of this node (a node which is already in a tree is moved).

**Kind**: instance method of [<code>AttrService</code>](#AttrService)  
**Overrides**: [<code>appendChild</code>](#NodeService+appendChild)  
**Returns**: <code>PseudoNode</code> - The added node  

| Param | Type | Description |
| --- | --- | --- |
| childNode | <code>PseudoNode</code> | The node to add |

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

### attrService.cloneNode()
Not implemented yet.

**Kind**: instance method of [<code>AttrService</code>](#AttrService)  
**Overrides**: [<code>cloneNode</code>](#NodeService+cloneNode)  
**Throws**:

- <code>Error</code> 

<a name="NodeService+compareDocumentPosition"></a>

### attrService.compareDocumentPosition()
Not implemented yet.

**Kind**: instance method of [<code>AttrService</code>](#AttrService)  
**Overrides**: [<code>compareDocumentPosition</code>](#NodeService+compareDocumentPosition)  
**Throws**:

- <code>Error</code> 

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

### attrService.isEqualNode()
Not implemented yet.

**Kind**: instance method of [<code>AttrService</code>](#AttrService)  
**Overrides**: [<code>isEqualNode</code>](#NodeService+isEqualNode)  
**Throws**:

- <code>Error</code> 

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
    * [.appendChild(childNode)](#NodeService+appendChild) ⇒ <code>PseudoNode</code>
    * [.childInserted(child)](#NodeService+childInserted)
    * [.cloneNode()](#NodeService+cloneNode)
    * [.compareDocumentPosition()](#NodeService+compareDocumentPosition)
    * [.contains(otherNode)](#NodeService+contains) ⇒ <code>boolean</code>
    * [.insertBefore(newNode, [referenceNode])](#NodeService+insertBefore) ⇒ <code>PseudoNode</code>
    * [.isEqualNode()](#NodeService+isEqualNode)
    * [.removeChild(childElement)](#NodeService+removeChild) ⇒ <code>PseudoNode</code>
    * [.replaceChild(newChild, oldChild)](#NodeService+replaceChild) ⇒ <code>PseudoNode</code>

<a name="new_LinkedNode_new"></a>

### new LinkedNode(linker, value)

| Param | Type | Description |
| --- | --- | --- |
| linker | <code>TreeLinker</code> | The linker holding this node |
| value | <code>string</code> \| <code>null</code> | The value of the node |

<a name="NodeService+appendChild"></a>

### linkedNode.appendChild(childNode) ⇒ <code>PseudoNode</code>
Add a node as the last child of this node (a node which is already in a tree is moved).

**Kind**: instance method of [<code>LinkedNode</code>](#LinkedNode)  
**Overrides**: [<code>appendChild</code>](#NodeService+appendChild)  
**Returns**: <code>PseudoNode</code> - The added node  

| Param | Type | Description |
| --- | --- | --- |
| childNode | <code>PseudoNode</code> | The node to add |

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

### linkedNode.cloneNode()
Not implemented yet.

**Kind**: instance method of [<code>LinkedNode</code>](#LinkedNode)  
**Overrides**: [<code>cloneNode</code>](#NodeService+cloneNode)  
**Throws**:

- <code>Error</code> 

<a name="NodeService+compareDocumentPosition"></a>

### linkedNode.compareDocumentPosition()
Not implemented yet.

**Kind**: instance method of [<code>LinkedNode</code>](#LinkedNode)  
**Overrides**: [<code>compareDocumentPosition</code>](#NodeService+compareDocumentPosition)  
**Throws**:

- <code>Error</code> 

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

### linkedNode.isEqualNode()
Not implemented yet.

**Kind**: instance method of [<code>LinkedNode</code>](#LinkedNode)  
**Overrides**: [<code>isEqualNode</code>](#NodeService+isEqualNode)  
**Throws**:

- <code>Error</code> 

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
Create and return a PseudoHTMLElement, which is not added to the document until it is appended somewhere

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| tagName | <code>string</code> | <code>&quot;div&quot;</code> | Tag Name is a string representing the type of Dom element this represents |

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

<a name="HTMLElementService_1"></a>

## HTMLElementService\_1 : <code>PseudoHTMLElement</code>
**Kind**: global constant  
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
