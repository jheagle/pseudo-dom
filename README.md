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
<dt><a href="#PseudoNodeAttached">PseudoNodeAttached</a> ⇐ <code>PseudoEventTarget</code></dt>
<dd><p>Simulate the behaviour of the Node Class when there is no DOM available.</p>
</dd>
<dt><a href="#PseudoHTMLDocument">PseudoHTMLDocument</a> ⇐ <code>PseudoHTMLElement</code></dt>
<dd><p>Simulate the behaviour of the HTMLDocument Class when there is no DOM available.</p>
</dd>
<dt><a href="#PseudoEventListener">PseudoEventListener</a></dt>
<dd><p>Handle events as they are stored and implemented.</p>
</dd>
</dl>

## Functions

<dl>
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
    * [.appendChild(childNode)](#NodeService+appendChild) ⇒ [<code>NodeService</code>](#NodeService)
    * [.removeChild(childElement)](#NodeService+removeChild) ⇒ [<code>NodeService</code>](#NodeService)

<a name="NodeService+appendChild"></a>

### nodeService.appendChild(childNode) ⇒ [<code>NodeService</code>](#NodeService)
**Kind**: instance method of [<code>NodeService</code>](#NodeService)  

| Param | Type |
| --- | --- |
| childNode | [<code>NodeService</code>](#NodeService) | 

<a name="NodeService+removeChild"></a>

### nodeService.removeChild(childElement) ⇒ [<code>NodeService</code>](#NodeService)
**Kind**: instance method of [<code>NodeService</code>](#NodeService)  

| Param | Type |
| --- | --- |
| childElement | [<code>NodeService</code>](#NodeService) | 

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
    * [.runEvents(event)](#EventTargetService+runEvents) ⇒ <code>boolean</code>
    * [.setDefaultEvent(type, callback)](#EventTargetService+setDefaultEvent)
    * [.runDefaultEvent(event)](#EventTargetService+runDefaultEvent) ⇒ <code>boolean</code>
    * [.startEvents(eventType)](#EventTargetService+startEvents) ⇒ <code>boolean</code>
    * [.addEventListener(type, callback, [useCapture])](#EventTargetService+addEventListener)
    * [.removeEventListener(type, callback)](#EventTargetService+removeEventListener)
    * [.dispatchEvent(event, target)](#EventTargetService+dispatchEvent) ⇒ <code>boolean</code>

<a name="EventTargetService+runEvents"></a>

### eventTargetService.runEvents(event) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>EventTargetService</code>](#EventTargetService)  

| Param | Type |
| --- | --- |
| event | <code>PseudoEvent</code> | 

<a name="EventTargetService+setDefaultEvent"></a>

### eventTargetService.setDefaultEvent(type, callback)
**Kind**: instance method of [<code>EventTargetService</code>](#EventTargetService)  

| Param | Type |
| --- | --- |
| type | <code>string</code> | 
| callback | <code>function</code> | 

<a name="EventTargetService+runDefaultEvent"></a>

### eventTargetService.runDefaultEvent(event) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>EventTargetService</code>](#EventTargetService)  

| Param | Type |
| --- | --- |
| event | <code>PseudoEvent</code> | 

<a name="EventTargetService+startEvents"></a>

### eventTargetService.startEvents(eventType) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>EventTargetService</code>](#EventTargetService)  

| Param | Type |
| --- | --- |
| eventType | <code>PseudoEvent</code> | 

<a name="EventTargetService+addEventListener"></a>

### eventTargetService.addEventListener(type, callback, [useCapture])
**Kind**: instance method of [<code>EventTargetService</code>](#EventTargetService)  

| Param | Type | Default |
| --- | --- | --- |
| type | <code>string</code> |  | 
| callback | <code>function</code> \| <code>Object</code> |  | 
| [useCapture] | <code>boolean</code> \| <code>Object</code> | <code>false</code> | 

<a name="EventTargetService+removeEventListener"></a>

### eventTargetService.removeEventListener(type, callback)
**Kind**: instance method of [<code>EventTargetService</code>](#EventTargetService)  

| Param | Type |
| --- | --- |
| type | <code>string</code> | 
| callback | <code>function</code> | 

<a name="EventTargetService+dispatchEvent"></a>

### eventTargetService.dispatchEvent(event, target) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>EventTargetService</code>](#EventTargetService)  

| Param | Type |
| --- | --- |
| event | <code>Event</code> \| <code>PseudoEvent</code> | 
| target | <code>EventTarget</code> \| [<code>EventTargetService</code>](#EventTargetService) | 

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
    * [new ElementService([elementOptions])](#new_ElementService_new)
    * [.applyDefaultEvent()](#ElementService+applyDefaultEvent) ⇒ <code>function</code>
    * [.appendChild(childElement)](#ElementService+appendChild) ⇒ <code>PseudoNode</code>
    * [.hasAttribute(attributeName)](#ElementService+hasAttribute) ⇒ <code>boolean</code>
    * [.setAttribute(attributeName, attributeValue)](#ElementService+setAttribute) ⇒ <code>undefined</code>
    * [.getAttribute(attributeName)](#ElementService+getAttribute) ⇒ <code>string</code> \| <code>Object</code>
    * [.removeAttribute(attributeName)](#ElementService+removeAttribute) ⇒ <code>null</code>

<a name="new_ElementService_new"></a>

### new ElementService([elementOptions])
Simulate the Element object when the Dom is not available


| Param | Type | Default |
| --- | --- | --- |
| [elementOptions] | <code>Object</code> | <code>{}</code> | 
| [elementOptions.tagName] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | 
| [elementOptions.attributes] | <code>array</code> | <code>[]</code> | 
| [elementOptions.parent] | <code>PseudoNode</code> \| <code>Object</code> | <code>{}</code> | 
| [elementOptions.children] | <code>Array</code> | <code>[]</code> | 

<a name="ElementService+applyDefaultEvent"></a>

### elementService.applyDefaultEvent() ⇒ <code>function</code>
**Kind**: instance method of [<code>ElementService</code>](#ElementService)  
<a name="ElementService+appendChild"></a>

### elementService.appendChild(childElement) ⇒ <code>PseudoNode</code>
**Kind**: instance method of [<code>ElementService</code>](#ElementService)  

| Param | Type |
| --- | --- |
| childElement | <code>PseudoNode</code> \| [<code>ElementService</code>](#ElementService) | 

<a name="ElementService+hasAttribute"></a>

### elementService.hasAttribute(attributeName) ⇒ <code>boolean</code>
Check if an attribute is assigned to this element.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  

| Param | Type | Description |
| --- | --- | --- |
| attributeName | <code>string</code> | The attribute name to check |

<a name="ElementService+setAttribute"></a>

### elementService.setAttribute(attributeName, attributeValue) ⇒ <code>undefined</code>
Assign a new attribute or overwrite an assigned attribute with name and value.

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  

| Param | Type | Description |
| --- | --- | --- |
| attributeName | <code>string</code> | The name key of the attribute to append |
| attributeValue | <code>string</code> \| <code>Object</code> | The value of the attribute to append |

<a name="ElementService+getAttribute"></a>

### elementService.getAttribute(attributeName) ⇒ <code>string</code> \| <code>Object</code>
Retrieve the value of the specified attribute from the Element

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  

| Param | Type | Description |
| --- | --- | --- |
| attributeName | <code>string</code> | A string representing the name of the attribute to be retrieved |

<a name="ElementService+removeAttribute"></a>

### elementService.removeAttribute(attributeName) ⇒ <code>null</code>
Remove an assigned attribute from the Element

**Kind**: instance method of [<code>ElementService</code>](#ElementService)  

| Param | Type | Description |
| --- | --- | --- |
| attributeName | <code>string</code> | The string name of the attribute to be removed |

<a name="PseudoNodeAttached"></a>

## PseudoNodeAttached ⇐ <code>PseudoEventTarget</code>
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


* [PseudoNodeAttached](#PseudoNodeAttached) ⇐ <code>PseudoEventTarget</code>
    * [.appendChild(childNode)](#PseudoNodeAttached+appendChild) ⇒ <code>PseudoNode</code>
    * [.removeChild(childElement)](#PseudoNodeAttached+removeChild) ⇒ <code>PseudoNode</code>

<a name="PseudoNodeAttached+appendChild"></a>

### pseudoNodeAttached.appendChild(childNode) ⇒ <code>PseudoNode</code>
**Kind**: instance method of [<code>PseudoNodeAttached</code>](#PseudoNodeAttached)  

| Param | Type |
| --- | --- |
| childNode | <code>PseudoNode</code> | 

<a name="PseudoNodeAttached+removeChild"></a>

### pseudoNodeAttached.removeChild(childElement) ⇒ <code>PseudoNode</code>
**Kind**: instance method of [<code>PseudoNodeAttached</code>](#PseudoNodeAttached)  

| Param | Type |
| --- | --- |
| childElement | <code>PseudoNode</code> | 

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

| Param | Type | Description |
| --- | --- | --- |
| tagName | <code>string</code> | Tag Name is a string representing the type of Dom element this represents |

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
    * [.handleEvent(event)](#PseudoEventListener+handleEvent) ⇒ <code>\*</code>
    * [.doCapturePhase(event)](#PseudoEventListener+doCapturePhase) ⇒ <code>boolean</code>
    * [.doTargetPhase(event)](#PseudoEventListener+doTargetPhase) ⇒ <code>boolean</code>
    * [.doBubblePhase(event)](#PseudoEventListener+doBubblePhase) ⇒ <code>boolean</code> \| <code>\*</code>
    * [.skipPhase(event)](#PseudoEventListener+skipPhase) ⇒ <code>boolean</code>
    * [.skipDefault(event)](#PseudoEventListener+skipDefault) ⇒ <code>boolean</code> \| <code>\*</code>
    * [.stopPropagation(event)](#PseudoEventListener+stopPropagation) ⇒ <code>boolean</code>
    * [.nonPassiveHalt(event)](#PseudoEventListener+nonPassiveHalt) ⇒ <code>boolean</code> \| <code>\*</code>
    * [.rejectEvent(event)](#PseudoEventListener+rejectEvent) ⇒ <code>\*</code> \| <code>boolean</code>

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
