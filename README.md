# Pseudo DOM

Mock the DOM for server side-side DOM state and in tests.
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
<dd><p>Simulate the behaviour of the EventTarget Class when there is no DOM available.</p>
</dd>
<dt><a href="#EventService">EventService</a></dt>
<dd><p>Simulate the behaviour of the Event Class when there is no DOM available.</p>
</dd>
<dt><a href="#ElementService">ElementService</a> ⇐ <code>PseudoNode</code></dt>
<dd><p>Simulate the behaviour of the Element Class when there is no DOM available.</p>
</dd>
<dt><a href="#DOMTokenListService">DOMTokenListService</a></dt>
<dd><p>Simulate the behaviour of the DOMTokenList Class when there is no DOM available.</p>
</dd>
<dt><a href="#AttrService">AttrService</a> ⇐ <code><a href="#NodeService">NodeService</a></code></dt>
<dd><p>Simulate the behaviour of the Attr Class when there is no DOM available.</p>
</dd>
<dt><a href="#LinkedNode">LinkedNode</a> ⇐ <code><a href="#NodeService">NodeService</a></code></dt>
<dd><p>A node which is stored in a TreeLinker and answers questions about its position in the tree by asking that linker.</p>
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
    * [.cloneNode()](#NodeService+cloneNode)
    * [.compareDocumentPosition()](#NodeService+compareDocumentPosition)
    * [.contains()](#NodeService+contains)
    * [.insertBefore()](#NodeService+insertBefore)
    * [.isEqualNode()](#NodeService+isEqualNode)
    * [.removeChild(childElement)](#NodeService+removeChild) ⇒ <code>PseudoNode</code>
    * [.replaceChild()](#NodeService+replaceChild)

<a name="NodeService+appendChild"></a>

### nodeService.appendChild(childNode) ⇒ <code>PseudoNode</code>
**Kind**: instance method of [<code>NodeService</code>](#NodeService)  

| Param | Type |
| --- | --- |
| childNode | <code>PseudoNode</code> | 

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

### nodeService.contains()
Not implemented yet.

**Kind**: instance method of [<code>NodeService</code>](#NodeService)  
**Throws**:

- <code>Error</code> 

<a name="NodeService+insertBefore"></a>

### nodeService.insertBefore()
Not implemented yet.

**Kind**: instance method of [<code>NodeService</code>](#NodeService)  
**Throws**:

- <code>Error</code> 

<a name="NodeService+isEqualNode"></a>

### nodeService.isEqualNode()
Not implemented yet.

**Kind**: instance method of [<code>NodeService</code>](#NodeService)  
**Throws**:

- <code>Error</code> 

<a name="NodeService+removeChild"></a>

### nodeService.removeChild(childElement) ⇒ <code>PseudoNode</code>
Remove the given child from this node.

**Kind**: instance method of [<code>NodeService</code>](#NodeService)  
**Throws**:

- <code>Error</code> When the node is not a child of this node


| Param | Type | Description |
| --- | --- | --- |
| childElement | <code>PseudoNode</code> | The child node, or its TreeLinker from the children list |

<a name="NodeService+replaceChild"></a>

### nodeService.replaceChild()
Not implemented yet.

**Kind**: instance method of [<code>NodeService</code>](#NodeService)  
**Throws**:

- <code>Error</code> 

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
    * [.runEvents(event)](#EventTargetService+runEvents) ⇒ <code>\*</code>
    * [.setDefaultEvent(type, callback)](#EventTargetService+setDefaultEvent)

<a name="EventTargetService+listenersFor"></a>

### eventTargetService.listenersFor(type) ⇒ <code>LinkedList</code>
The listeners registered for a type of event, creating the (empty) list of them when there are none yet.

**Kind**: instance method of [<code>EventTargetService</code>](#EventTargetService)  

| Param | Type |
| --- | --- |
| type | <code>string</code> | 

<a name="EventTargetService+runEvents"></a>

### eventTargetService.runEvents(event) ⇒ <code>\*</code>
Run each of the listeners registered on this target for the type of the event.
Listeners which do not apply to the event's phase are skipped, running stops once immediate propagation is stopped,
and listeners added or removed while running do not change which ones run for this event.

**Kind**: instance method of [<code>EventTargetService</code>](#EventTargetService)  
**Returns**: <code>\*</code> - true when there was nothing registered, otherwise the last value returned from a handler (null when none ran)  

| Param | Type |
| --- | --- |
| event | [<code>EventService</code>](#EventService) | 

<a name="EventTargetService+setDefaultEvent"></a>

### eventTargetService.setDefaultEvent(type, callback)
Register the function to run when nothing else has prevented the default for this type of event.

**Kind**: instance method of [<code>EventTargetService</code>](#EventTargetService)  

| Param | Type |
| --- | --- |
| type | <code>string</code> | 
| callback | <code>function</code> | 

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
    * [.appendChild(childElement)](#ElementService+appendChild) ⇒ <code>PseudoNode</code>
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
| [settings.parent] | <code>PseudoNode</code> \| <code>null</code> | <code></code> | The parent node |
| [settings.children] | <code>Array</code> | <code>[]</code> | The values or nodes to start as children |

<a name="ElementService+applyDefaultEvent"></a>

### elementService.applyDefaultEvent() ⇒ <code>function</code>
Some elements have default behaviour, this registers it when the element is added.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  
<a name="ElementService+appendChild"></a>

### elementService.appendChild(childElement) ⇒ <code>PseudoNode</code>
**Kind**: instance method of [<code>ElementService</code>](#ElementService)  

| Param | Type |
| --- | --- |
| childElement | <code>PseudoNode</code> \| [<code>ElementService</code>](#ElementService) | 

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
    * [.cloneNode()](#NodeService+cloneNode)
    * [.compareDocumentPosition()](#NodeService+compareDocumentPosition)
    * [.contains()](#NodeService+contains)
    * [.insertBefore()](#NodeService+insertBefore)
    * [.isEqualNode()](#NodeService+isEqualNode)
    * [.removeChild(childElement)](#NodeService+removeChild) ⇒ <code>PseudoNode</code>
    * [.replaceChild()](#NodeService+replaceChild)

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
**Kind**: instance method of [<code>AttrService</code>](#AttrService)  
**Overrides**: [<code>appendChild</code>](#NodeService+appendChild)  

| Param | Type |
| --- | --- |
| childNode | <code>PseudoNode</code> | 

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

### attrService.contains()
Not implemented yet.

**Kind**: instance method of [<code>AttrService</code>](#AttrService)  
**Overrides**: [<code>contains</code>](#NodeService+contains)  
**Throws**:

- <code>Error</code> 

<a name="NodeService+insertBefore"></a>

### attrService.insertBefore()
Not implemented yet.

**Kind**: instance method of [<code>AttrService</code>](#AttrService)  
**Overrides**: [<code>insertBefore</code>](#NodeService+insertBefore)  
**Throws**:

- <code>Error</code> 

<a name="NodeService+isEqualNode"></a>

### attrService.isEqualNode()
Not implemented yet.

**Kind**: instance method of [<code>AttrService</code>](#AttrService)  
**Overrides**: [<code>isEqualNode</code>](#NodeService+isEqualNode)  
**Throws**:

- <code>Error</code> 

<a name="NodeService+removeChild"></a>

### attrService.removeChild(childElement) ⇒ <code>PseudoNode</code>
Remove the given child from this node.

**Kind**: instance method of [<code>AttrService</code>](#AttrService)  
**Overrides**: [<code>removeChild</code>](#NodeService+removeChild)  
**Throws**:

- <code>Error</code> When the node is not a child of this node


| Param | Type | Description |
| --- | --- | --- |
| childElement | <code>PseudoNode</code> | The child node, or its TreeLinker from the children list |

<a name="NodeService+replaceChild"></a>

### attrService.replaceChild()
Not implemented yet.

**Kind**: instance method of [<code>AttrService</code>](#AttrService)  
**Overrides**: [<code>replaceChild</code>](#NodeService+replaceChild)  
**Throws**:

- <code>Error</code> 

<a name="LinkedNode"></a>

## LinkedNode ⇐ [<code>NodeService</code>](#NodeService)
A node which is stored in a TreeLinker and answers questions about its position in the tree by asking that linker.

**Kind**: global class  
**Extends**: [<code>NodeService</code>](#NodeService)  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  

* [LinkedNode](#LinkedNode) ⇐ [<code>NodeService</code>](#NodeService)
    * [new LinkedNode(linker, value)](#new_LinkedNode_new)
    * [.appendChild(childNode)](#NodeService+appendChild) ⇒ <code>PseudoNode</code>
    * [.cloneNode()](#NodeService+cloneNode)
    * [.compareDocumentPosition()](#NodeService+compareDocumentPosition)
    * [.contains()](#NodeService+contains)
    * [.insertBefore()](#NodeService+insertBefore)
    * [.isEqualNode()](#NodeService+isEqualNode)
    * [.removeChild(childElement)](#NodeService+removeChild) ⇒ <code>PseudoNode</code>
    * [.replaceChild()](#NodeService+replaceChild)

<a name="new_LinkedNode_new"></a>

### new LinkedNode(linker, value)

| Param | Type | Description |
| --- | --- | --- |
| linker | <code>TreeLinker</code> | The linker holding this node |
| value | <code>string</code> \| <code>null</code> | The value of the node |

<a name="NodeService+appendChild"></a>

### linkedNode.appendChild(childNode) ⇒ <code>PseudoNode</code>
**Kind**: instance method of [<code>LinkedNode</code>](#LinkedNode)  
**Overrides**: [<code>appendChild</code>](#NodeService+appendChild)  

| Param | Type |
| --- | --- |
| childNode | <code>PseudoNode</code> | 

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

### linkedNode.contains()
Not implemented yet.

**Kind**: instance method of [<code>LinkedNode</code>](#LinkedNode)  
**Overrides**: [<code>contains</code>](#NodeService+contains)  
**Throws**:

- <code>Error</code> 

<a name="NodeService+insertBefore"></a>

### linkedNode.insertBefore()
Not implemented yet.

**Kind**: instance method of [<code>LinkedNode</code>](#LinkedNode)  
**Overrides**: [<code>insertBefore</code>](#NodeService+insertBefore)  
**Throws**:

- <code>Error</code> 

<a name="NodeService+isEqualNode"></a>

### linkedNode.isEqualNode()
Not implemented yet.

**Kind**: instance method of [<code>LinkedNode</code>](#LinkedNode)  
**Overrides**: [<code>isEqualNode</code>](#NodeService+isEqualNode)  
**Throws**:

- <code>Error</code> 

<a name="NodeService+removeChild"></a>

### linkedNode.removeChild(childElement) ⇒ <code>PseudoNode</code>
Remove the given child from this node.

**Kind**: instance method of [<code>LinkedNode</code>](#LinkedNode)  
**Overrides**: [<code>removeChild</code>](#NodeService+removeChild)  
**Throws**:

- <code>Error</code> When the node is not a child of this node


| Param | Type | Description |
| --- | --- | --- |
| childElement | <code>PseudoNode</code> | The child node, or its TreeLinker from the children list |

<a name="NodeService+replaceChild"></a>

### linkedNode.replaceChild()
Not implemented yet.

**Kind**: instance method of [<code>LinkedNode</code>](#LinkedNode)  
**Overrides**: [<code>replaceChild</code>](#NodeService+replaceChild)  
**Throws**:

- <code>Error</code> 

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
| createElement | <code>function</code> | Generate a new PseudoHTMLElement with parent of document |


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
Create and return a PseudoHTMLElement

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
    * [.callback](#PseudoEventListener+callback)
    * [.handleEvent(event)](#PseudoEventListener+handleEvent) ⇒ <code>\*</code>
    * [.doCapturePhase(event)](#PseudoEventListener+doCapturePhase) ⇒ <code>boolean</code>
    * [.doTargetPhase(event)](#PseudoEventListener+doTargetPhase) ⇒ <code>boolean</code>
    * [.doBubblePhase(event)](#PseudoEventListener+doBubblePhase) ⇒ <code>boolean</code> \| <code>\*</code>
    * [.skipPhase(event)](#PseudoEventListener+skipPhase) ⇒ <code>boolean</code>
    * [.skipDefault(event)](#PseudoEventListener+skipDefault) ⇒ <code>boolean</code> \| <code>\*</code>
    * [.stopPropagation(event)](#PseudoEventListener+stopPropagation) ⇒ <code>boolean</code>
    * [.nonPassiveHalt(event)](#PseudoEventListener+nonPassiveHalt) ⇒ <code>boolean</code> \| <code>\*</code>
    * [.rejectEvent(event)](#PseudoEventListener+rejectEvent) ⇒ <code>\*</code> \| <code>boolean</code>

<a name="PseudoEventListener+callback"></a>

### pseudoEventListener.callback
The function (or object with handleEvent) which was originally given when registering, used to find this listener again for removal.

**Kind**: instance property of [<code>PseudoEventListener</code>](#PseudoEventListener)  
<a name="PseudoEventListener+handleEvent"></a>

### pseudoEventListener.handleEvent(event) ⇒ <code>\*</code>
**Kind**: instance method of [<code>PseudoEventListener</code>](#PseudoEventListener)  

| Param | Type |
| --- | --- |
| event | <code>PseudoEvent</code> | 

<a name="PseudoEventListener+doCapturePhase"></a>

### pseudoEventListener.doCapturePhase(event) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>PseudoEventListener</code>](#PseudoEventListener)  

| Param | Type |
| --- | --- |
| event | <code>PseudoEvent</code> | 

<a name="PseudoEventListener+doTargetPhase"></a>

### pseudoEventListener.doTargetPhase(event) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>PseudoEventListener</code>](#PseudoEventListener)  

| Param | Type |
| --- | --- |
| event | <code>PseudoEvent</code> | 

<a name="PseudoEventListener+doBubblePhase"></a>

### pseudoEventListener.doBubblePhase(event) ⇒ <code>boolean</code> \| <code>\*</code>
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

<a name="PseudoEventListener+skipDefault"></a>

### pseudoEventListener.skipDefault(event) ⇒ <code>boolean</code> \| <code>\*</code>
**Kind**: instance method of [<code>PseudoEventListener</code>](#PseudoEventListener)  

| Param | Type |
| --- | --- |
| event | <code>PseudoEvent</code> | 

<a name="PseudoEventListener+stopPropagation"></a>

### pseudoEventListener.stopPropagation(event) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>PseudoEventListener</code>](#PseudoEventListener)  

| Param | Type |
| --- | --- |
| event | <code>PseudoEvent</code> | 

<a name="PseudoEventListener+nonPassiveHalt"></a>

### pseudoEventListener.nonPassiveHalt(event) ⇒ <code>boolean</code> \| <code>\*</code>
**Kind**: instance method of [<code>PseudoEventListener</code>](#PseudoEventListener)  

| Param | Type |
| --- | --- |
| event | <code>PseudoEvent</code> | 

<a name="PseudoEventListener+rejectEvent"></a>

### pseudoEventListener.rejectEvent(event) ⇒ <code>\*</code> \| <code>boolean</code>
**Kind**: instance method of [<code>PseudoEventListener</code>](#PseudoEventListener)  

| Param | Type |
| --- | --- |
| event | <code>PseudoEvent</code> | 

<a name="HTMLElementService_1"></a>

## HTMLElementService\_1 : <code>PseudoHTMLElement</code>
**Kind**: global constant  
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
