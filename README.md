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
<dt><a href="#PseudoNodeAttached">PseudoNodeAttached</a> ⇐ <code><a href="#PseudoEventTarget">PseudoEventTarget</a></code></dt>
<dd><p>Simulate the behaviour of the Node Class when there is no DOM available.</p>
</dd>
<dt><a href="#PseudoNode">PseudoNode</a> ⇐ <code><a href="#PseudoEventTarget">PseudoEventTarget</a></code></dt>
<dd><p>Simulate the behaviour of the Node Class when there is no DOM available.</p>
</dd>
<dt><a href="#PseudoHTMLElement">PseudoHTMLElement</a> ⇐ <code><a href="#PseudoElement">PseudoElement</a></code></dt>
<dd><p>Simulate the behaviour of the HTMLElement Class when there is no DOM available.</p>
</dd>
<dt><a href="#PseudoHTMLDocument">PseudoHTMLDocument</a> ⇐ <code><a href="#PseudoHTMLElement">PseudoHTMLElement</a></code></dt>
<dd><p>Simulate the behaviour of the HTMLDocument Class when there is no DOM available.</p>
</dd>
<dt><a href="#PseudoEventTarget">PseudoEventTarget</a></dt>
<dd><p>Simulate the behaviour of the EventTarget Class when there is no DOM available.</p>
</dd>
<dt><a href="#PseudoEventListener">PseudoEventListener</a></dt>
<dd></dd>
<dt><a href="#PseudoEvent">PseudoEvent</a></dt>
<dd><p>Simulate the behaviour of the Event Class when there is no DOM available.</p>
</dd>
<dt><a href="#PseudoElement">PseudoElement</a> ⇐ <code><a href="#PseudoNode">PseudoNode</a></code></dt>
<dd><p>Simulate the behaviour of the Element Class when there is no DOM available.</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#root">root</a></dt>
<dd><p>Store a reference to this scope which will be Window if rendered via browser</p>
</dd>
<dt><a href="#previousPseudoDom">previousPseudoDom</a> : <code>module</code> | <code>*</code></dt>
<dd><p>Store reference to any pre-existing module of the same name</p>
</dd>
</dl>

<a name="module_pseudoDom/objects"></a>

## pseudoDom/objects : <code>Object</code>
All methods exported from this module are encapsulated within pseudoDom.

**Author**: Joshua Heagle <joshuaheagle@gmail.com>  

* [pseudoDom/objects](#module_pseudoDom/objects) : <code>Object</code>
    * [~generate(root, context)](#module_pseudoDom/objects..generate) ⇒ <code>Window</code> \| [<code>PseudoEventTarget</code>](#PseudoEventTarget)
    * [~noConflict()](#module_pseudoDom/objects..noConflict) ⇒ <code>pseudoDom</code>

<a name="module_pseudoDom/objects..generate"></a>

### pseudoDom/objects~generate(root, context) ⇒ <code>Window</code> \| [<code>PseudoEventTarget</code>](#PseudoEventTarget)
Construct the Pseudo Dom to provide access to Dom objects which are otherwise not available outside of the browsercontext.

**Kind**: inner method of [<code>pseudoDom/objects</code>](#module_pseudoDom/objects)  

| Param | Type |
| --- | --- |
| root | <code>Object</code> | 
| context | <code>Object</code> | 

<a name="module_pseudoDom/objects..noConflict"></a>

### pseudoDom/objects~noConflict() ⇒ <code>pseudoDom</code>
Return a reference to this library while preserving the original same-named library

**Kind**: inner method of [<code>pseudoDom/objects</code>](#module_pseudoDom/objects)  
<a name="PseudoNodeAttached"></a>

## PseudoNodeAttached ⇐ [<code>PseudoEventTarget</code>](#PseudoEventTarget)
Simulate the behaviour of the Node Class when there is no DOM available.

**Kind**: global class  
**Extends**: [<code>PseudoEventTarget</code>](#PseudoEventTarget)  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  
**Properties**

| Name | Type |
| --- | --- |
| name | <code>string</code> | 
| appendChild | <code>function</code> | 
| removeChild | <code>function</code> | 


* [PseudoNodeAttached](#PseudoNodeAttached) ⇐ [<code>PseudoEventTarget</code>](#PseudoEventTarget)
    * [.appendChild(childNode)](#PseudoNodeAttached+appendChild) ⇒ [<code>PseudoNode</code>](#PseudoNode)
    * [.removeChild(childElement)](#PseudoNodeAttached+removeChild) ⇒ [<code>PseudoNode</code>](#PseudoNode)
    * [.runEvents(event)](#PseudoEventTarget+runEvents) ⇒ <code>boolean</code>
    * [.setDefaultEvent(type, callback)](#PseudoEventTarget+setDefaultEvent)
    * [.runDefaultEvent(event)](#PseudoEventTarget+runDefaultEvent) ⇒ <code>boolean</code>
    * [.startEvents(eventType)](#PseudoEventTarget+startEvents) ⇒ <code>boolean</code>
    * [.addEventListener(type, callback, [useCapture])](#PseudoEventTarget+addEventListener)
    * [.removeEventListener(type, callback)](#PseudoEventTarget+removeEventListener)
    * [.dispatchEvent(event, target)](#PseudoEventTarget+dispatchEvent) ⇒ <code>boolean</code>

<a name="PseudoNodeAttached+appendChild"></a>

### pseudoNodeAttached.appendChild(childNode) ⇒ [<code>PseudoNode</code>](#PseudoNode)
**Kind**: instance method of [<code>PseudoNodeAttached</code>](#PseudoNodeAttached)  

| Param | Type |
| --- | --- |
| childNode | [<code>PseudoNode</code>](#PseudoNode) | 

<a name="PseudoNodeAttached+removeChild"></a>

### pseudoNodeAttached.removeChild(childElement) ⇒ [<code>PseudoNode</code>](#PseudoNode)
**Kind**: instance method of [<code>PseudoNodeAttached</code>](#PseudoNodeAttached)  

| Param | Type |
| --- | --- |
| childElement | [<code>PseudoNode</code>](#PseudoNode) | 

<a name="PseudoEventTarget+runEvents"></a>

### pseudoNodeAttached.runEvents(event) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>PseudoNodeAttached</code>](#PseudoNodeAttached)  
**Overrides**: [<code>runEvents</code>](#PseudoEventTarget+runEvents)  

| Param | Type |
| --- | --- |
| event | [<code>PseudoEvent</code>](#PseudoEvent) | 

<a name="PseudoEventTarget+setDefaultEvent"></a>

### pseudoNodeAttached.setDefaultEvent(type, callback)
**Kind**: instance method of [<code>PseudoNodeAttached</code>](#PseudoNodeAttached)  
**Overrides**: [<code>setDefaultEvent</code>](#PseudoEventTarget+setDefaultEvent)  

| Param | Type |
| --- | --- |
| type | <code>string</code> | 
| callback | <code>function</code> | 

<a name="PseudoEventTarget+runDefaultEvent"></a>

### pseudoNodeAttached.runDefaultEvent(event) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>PseudoNodeAttached</code>](#PseudoNodeAttached)  
**Overrides**: [<code>runDefaultEvent</code>](#PseudoEventTarget+runDefaultEvent)  

| Param | Type |
| --- | --- |
| event | [<code>PseudoEvent</code>](#PseudoEvent) | 

<a name="PseudoEventTarget+startEvents"></a>

### pseudoNodeAttached.startEvents(eventType) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>PseudoNodeAttached</code>](#PseudoNodeAttached)  
**Overrides**: [<code>startEvents</code>](#PseudoEventTarget+startEvents)  

| Param | Type |
| --- | --- |
| eventType | [<code>PseudoEvent</code>](#PseudoEvent) | 

<a name="PseudoEventTarget+addEventListener"></a>

### pseudoNodeAttached.addEventListener(type, callback, [useCapture])
**Kind**: instance method of [<code>PseudoNodeAttached</code>](#PseudoNodeAttached)  
**Overrides**: [<code>addEventListener</code>](#PseudoEventTarget+addEventListener)  

| Param | Type | Default |
| --- | --- | --- |
| type | <code>string</code> |  | 
| callback | <code>function</code> \| <code>Object</code> |  | 
| [useCapture] | <code>boolean</code> \| <code>Object</code> | <code>false</code> | 

<a name="PseudoEventTarget+removeEventListener"></a>

### pseudoNodeAttached.removeEventListener(type, callback)
**Kind**: instance method of [<code>PseudoNodeAttached</code>](#PseudoNodeAttached)  
**Overrides**: [<code>removeEventListener</code>](#PseudoEventTarget+removeEventListener)  

| Param | Type |
| --- | --- |
| type | <code>string</code> | 
| callback | <code>function</code> | 

<a name="PseudoEventTarget+dispatchEvent"></a>

### pseudoNodeAttached.dispatchEvent(event, target) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>PseudoNodeAttached</code>](#PseudoNodeAttached)  
**Overrides**: [<code>dispatchEvent</code>](#PseudoEventTarget+dispatchEvent)  

| Param | Type |
| --- | --- |
| event | <code>Event</code> \| [<code>PseudoEvent</code>](#PseudoEvent) | 
| target | <code>EventTarget</code> \| [<code>PseudoEventTarget</code>](#PseudoEventTarget) | 

<a name="PseudoNode"></a>

## PseudoNode ⇐ [<code>PseudoEventTarget</code>](#PseudoEventTarget)
Simulate the behaviour of the Node Class when there is no DOM available.

**Kind**: global class  
**Extends**: [<code>PseudoEventTarget</code>](#PseudoEventTarget)  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  
**Properties**

| Name | Type |
| --- | --- |
| name | <code>string</code> | 
| appendChild | <code>function</code> | 
| removeChild | <code>function</code> | 


* [PseudoNode](#PseudoNode) ⇐ [<code>PseudoEventTarget</code>](#PseudoEventTarget)
    * [.appendChild(childNode)](#PseudoNode+appendChild) ⇒ [<code>PseudoNode</code>](#PseudoNode)
    * [.removeChild(childElement)](#PseudoNode+removeChild) ⇒ [<code>PseudoNode</code>](#PseudoNode)
    * [.runEvents(event)](#PseudoEventTarget+runEvents) ⇒ <code>boolean</code>
    * [.setDefaultEvent(type, callback)](#PseudoEventTarget+setDefaultEvent)
    * [.runDefaultEvent(event)](#PseudoEventTarget+runDefaultEvent) ⇒ <code>boolean</code>
    * [.startEvents(eventType)](#PseudoEventTarget+startEvents) ⇒ <code>boolean</code>
    * [.addEventListener(type, callback, [useCapture])](#PseudoEventTarget+addEventListener)
    * [.removeEventListener(type, callback)](#PseudoEventTarget+removeEventListener)
    * [.dispatchEvent(event, target)](#PseudoEventTarget+dispatchEvent) ⇒ <code>boolean</code>

<a name="PseudoNode+appendChild"></a>

### pseudoNode.appendChild(childNode) ⇒ [<code>PseudoNode</code>](#PseudoNode)
**Kind**: instance method of [<code>PseudoNode</code>](#PseudoNode)  

| Param | Type |
| --- | --- |
| childNode | [<code>PseudoNode</code>](#PseudoNode) | 

<a name="PseudoNode+removeChild"></a>

### pseudoNode.removeChild(childElement) ⇒ [<code>PseudoNode</code>](#PseudoNode)
**Kind**: instance method of [<code>PseudoNode</code>](#PseudoNode)  

| Param | Type |
| --- | --- |
| childElement | [<code>PseudoNode</code>](#PseudoNode) | 

<a name="PseudoEventTarget+runEvents"></a>

### pseudoNode.runEvents(event) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>PseudoNode</code>](#PseudoNode)  
**Overrides**: [<code>runEvents</code>](#PseudoEventTarget+runEvents)  

| Param | Type |
| --- | --- |
| event | [<code>PseudoEvent</code>](#PseudoEvent) | 

<a name="PseudoEventTarget+setDefaultEvent"></a>

### pseudoNode.setDefaultEvent(type, callback)
**Kind**: instance method of [<code>PseudoNode</code>](#PseudoNode)  
**Overrides**: [<code>setDefaultEvent</code>](#PseudoEventTarget+setDefaultEvent)  

| Param | Type |
| --- | --- |
| type | <code>string</code> | 
| callback | <code>function</code> | 

<a name="PseudoEventTarget+runDefaultEvent"></a>

### pseudoNode.runDefaultEvent(event) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>PseudoNode</code>](#PseudoNode)  
**Overrides**: [<code>runDefaultEvent</code>](#PseudoEventTarget+runDefaultEvent)  

| Param | Type |
| --- | --- |
| event | [<code>PseudoEvent</code>](#PseudoEvent) | 

<a name="PseudoEventTarget+startEvents"></a>

### pseudoNode.startEvents(eventType) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>PseudoNode</code>](#PseudoNode)  
**Overrides**: [<code>startEvents</code>](#PseudoEventTarget+startEvents)  

| Param | Type |
| --- | --- |
| eventType | [<code>PseudoEvent</code>](#PseudoEvent) | 

<a name="PseudoEventTarget+addEventListener"></a>

### pseudoNode.addEventListener(type, callback, [useCapture])
**Kind**: instance method of [<code>PseudoNode</code>](#PseudoNode)  
**Overrides**: [<code>addEventListener</code>](#PseudoEventTarget+addEventListener)  

| Param | Type | Default |
| --- | --- | --- |
| type | <code>string</code> |  | 
| callback | <code>function</code> \| <code>Object</code> |  | 
| [useCapture] | <code>boolean</code> \| <code>Object</code> | <code>false</code> | 

<a name="PseudoEventTarget+removeEventListener"></a>

### pseudoNode.removeEventListener(type, callback)
**Kind**: instance method of [<code>PseudoNode</code>](#PseudoNode)  
**Overrides**: [<code>removeEventListener</code>](#PseudoEventTarget+removeEventListener)  

| Param | Type |
| --- | --- |
| type | <code>string</code> | 
| callback | <code>function</code> | 

<a name="PseudoEventTarget+dispatchEvent"></a>

### pseudoNode.dispatchEvent(event, target) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>PseudoNode</code>](#PseudoNode)  
**Overrides**: [<code>dispatchEvent</code>](#PseudoEventTarget+dispatchEvent)  

| Param | Type |
| --- | --- |
| event | <code>Event</code> \| [<code>PseudoEvent</code>](#PseudoEvent) | 
| target | <code>EventTarget</code> \| [<code>PseudoEventTarget</code>](#PseudoEventTarget) | 

<a name="PseudoHTMLElement"></a>

## PseudoHTMLElement ⇐ [<code>PseudoElement</code>](#PseudoElement)
Simulate the behaviour of the HTMLElement Class when there is no DOM available.

**Kind**: global class  
**Extends**: [<code>PseudoElement</code>](#PseudoElement)  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| hidden | <code>boolean</code> | State of whether element is visible |
| offsetHeight | <code>number</code> | The height of the element as offset by the parent element |
| offsetLeft | <code>number</code> | The position of the left side of the element based on the parent element |
| offsetParent | [<code>PseudoHTMLElement</code>](#PseudoHTMLElement) | A reference to the closest positioned parent element |
| offsetTop | <code>number</code> | The position of the top side of the element based on the parent element |
| offsetWidth | <code>number</code> | The width of the element as offset by the parent element |
| style | <code>Object</code> | A container to define all applied inline-styles |
| title | <code>string</code> | The title attribute which affects the text visible on hover |


* [PseudoHTMLElement](#PseudoHTMLElement) ⇐ [<code>PseudoElement</code>](#PseudoElement)
    * [new PseudoHTMLElement([tagName], [parent], [children])](#new_PseudoHTMLElement_new)
    * [.applyDefaultEvent()](#PseudoElement+applyDefaultEvent) ⇒ <code>function</code>
    * [.appendChild(childElement)](#PseudoElement+appendChild) ⇒ [<code>PseudoNode</code>](#PseudoNode)
    * [.hasAttribute(attributeName)](#PseudoElement+hasAttribute) ⇒ <code>boolean</code>
    * [.setAttribute(attributeName, attributeValue)](#PseudoElement+setAttribute) ⇒ <code>undefined</code>
    * [.getAttribute(attributeName)](#PseudoElement+getAttribute) ⇒ <code>string</code> \| <code>Object</code>
    * [.removeAttribute(attributeName)](#PseudoElement+removeAttribute) ⇒ <code>null</code>
    * [.removeChild(childElement)](#PseudoNode+removeChild) ⇒ [<code>PseudoNode</code>](#PseudoNode)
    * [.runEvents(event)](#PseudoEventTarget+runEvents) ⇒ <code>boolean</code>
    * [.setDefaultEvent(type, callback)](#PseudoEventTarget+setDefaultEvent)
    * [.runDefaultEvent(event)](#PseudoEventTarget+runDefaultEvent) ⇒ <code>boolean</code>
    * [.startEvents(eventType)](#PseudoEventTarget+startEvents) ⇒ <code>boolean</code>
    * [.addEventListener(type, callback, [useCapture])](#PseudoEventTarget+addEventListener)
    * [.removeEventListener(type, callback)](#PseudoEventTarget+removeEventListener)
    * [.dispatchEvent(event, target)](#PseudoEventTarget+dispatchEvent) ⇒ <code>boolean</code>

<a name="new_PseudoHTMLElement_new"></a>

### new PseudoHTMLElement([tagName], [parent], [children])
Simulate the HTMLELement object when the Dom is not available


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [tagName] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | The |
| [parent] | [<code>PseudoNode</code>](#PseudoNode) \| <code>Object</code> | <code>{}</code> |  |
| [children] | <code>Array</code> | <code>[]</code> |  |

<a name="PseudoElement+applyDefaultEvent"></a>

### pseudoHTMLElement.applyDefaultEvent() ⇒ <code>function</code>
**Kind**: instance method of [<code>PseudoHTMLElement</code>](#PseudoHTMLElement)  
**Overrides**: [<code>applyDefaultEvent</code>](#PseudoElement+applyDefaultEvent)  
<a name="PseudoElement+appendChild"></a>

### pseudoHTMLElement.appendChild(childElement) ⇒ [<code>PseudoNode</code>](#PseudoNode)
**Kind**: instance method of [<code>PseudoHTMLElement</code>](#PseudoHTMLElement)  
**Overrides**: [<code>appendChild</code>](#PseudoElement+appendChild)  

| Param | Type |
| --- | --- |
| childElement | [<code>PseudoNode</code>](#PseudoNode) \| [<code>PseudoElement</code>](#PseudoElement) | 

<a name="PseudoElement+hasAttribute"></a>

### pseudoHTMLElement.hasAttribute(attributeName) ⇒ <code>boolean</code>
Check if an attribute is assigned to this element.

**Kind**: instance method of [<code>PseudoHTMLElement</code>](#PseudoHTMLElement)  
**Overrides**: [<code>hasAttribute</code>](#PseudoElement+hasAttribute)  

| Param | Type | Description |
| --- | --- | --- |
| attributeName | <code>string</code> | The attribute name to check |

<a name="PseudoElement+setAttribute"></a>

### pseudoHTMLElement.setAttribute(attributeName, attributeValue) ⇒ <code>undefined</code>
Assign a new attribute or overwrite an assigned attribute with name and value.

**Kind**: instance method of [<code>PseudoHTMLElement</code>](#PseudoHTMLElement)  
**Overrides**: [<code>setAttribute</code>](#PseudoElement+setAttribute)  

| Param | Type | Description |
| --- | --- | --- |
| attributeName | <code>string</code> | The name key of the attribute to append |
| attributeValue | <code>string</code> \| <code>Object</code> | The value of the attribute to append |

<a name="PseudoElement+getAttribute"></a>

### pseudoHTMLElement.getAttribute(attributeName) ⇒ <code>string</code> \| <code>Object</code>
Retrieve the value of the specified attribute from the Element

**Kind**: instance method of [<code>PseudoHTMLElement</code>](#PseudoHTMLElement)  
**Overrides**: [<code>getAttribute</code>](#PseudoElement+getAttribute)  

| Param | Type | Description |
| --- | --- | --- |
| attributeName | <code>string</code> | A string representing the name of the attribute to be retrieved |

<a name="PseudoElement+removeAttribute"></a>

### pseudoHTMLElement.removeAttribute(attributeName) ⇒ <code>null</code>
Remove an assigned attribute from the Element

**Kind**: instance method of [<code>PseudoHTMLElement</code>](#PseudoHTMLElement)  
**Overrides**: [<code>removeAttribute</code>](#PseudoElement+removeAttribute)  

| Param | Type | Description |
| --- | --- | --- |
| attributeName | <code>string</code> | The string name of the attribute to be removed |

<a name="PseudoNode+removeChild"></a>

### pseudoHTMLElement.removeChild(childElement) ⇒ [<code>PseudoNode</code>](#PseudoNode)
**Kind**: instance method of [<code>PseudoHTMLElement</code>](#PseudoHTMLElement)  
**Overrides**: [<code>removeChild</code>](#PseudoNode+removeChild)  

| Param | Type |
| --- | --- |
| childElement | [<code>PseudoNode</code>](#PseudoNode) | 

<a name="PseudoEventTarget+runEvents"></a>

### pseudoHTMLElement.runEvents(event) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>PseudoHTMLElement</code>](#PseudoHTMLElement)  
**Overrides**: [<code>runEvents</code>](#PseudoEventTarget+runEvents)  

| Param | Type |
| --- | --- |
| event | [<code>PseudoEvent</code>](#PseudoEvent) | 

<a name="PseudoEventTarget+setDefaultEvent"></a>

### pseudoHTMLElement.setDefaultEvent(type, callback)
**Kind**: instance method of [<code>PseudoHTMLElement</code>](#PseudoHTMLElement)  
**Overrides**: [<code>setDefaultEvent</code>](#PseudoEventTarget+setDefaultEvent)  

| Param | Type |
| --- | --- |
| type | <code>string</code> | 
| callback | <code>function</code> | 

<a name="PseudoEventTarget+runDefaultEvent"></a>

### pseudoHTMLElement.runDefaultEvent(event) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>PseudoHTMLElement</code>](#PseudoHTMLElement)  
**Overrides**: [<code>runDefaultEvent</code>](#PseudoEventTarget+runDefaultEvent)  

| Param | Type |
| --- | --- |
| event | [<code>PseudoEvent</code>](#PseudoEvent) | 

<a name="PseudoEventTarget+startEvents"></a>

### pseudoHTMLElement.startEvents(eventType) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>PseudoHTMLElement</code>](#PseudoHTMLElement)  
**Overrides**: [<code>startEvents</code>](#PseudoEventTarget+startEvents)  

| Param | Type |
| --- | --- |
| eventType | [<code>PseudoEvent</code>](#PseudoEvent) | 

<a name="PseudoEventTarget+addEventListener"></a>

### pseudoHTMLElement.addEventListener(type, callback, [useCapture])
**Kind**: instance method of [<code>PseudoHTMLElement</code>](#PseudoHTMLElement)  
**Overrides**: [<code>addEventListener</code>](#PseudoEventTarget+addEventListener)  

| Param | Type | Default |
| --- | --- | --- |
| type | <code>string</code> |  | 
| callback | <code>function</code> \| <code>Object</code> |  | 
| [useCapture] | <code>boolean</code> \| <code>Object</code> | <code>false</code> | 

<a name="PseudoEventTarget+removeEventListener"></a>

### pseudoHTMLElement.removeEventListener(type, callback)
**Kind**: instance method of [<code>PseudoHTMLElement</code>](#PseudoHTMLElement)  
**Overrides**: [<code>removeEventListener</code>](#PseudoEventTarget+removeEventListener)  

| Param | Type |
| --- | --- |
| type | <code>string</code> | 
| callback | <code>function</code> | 

<a name="PseudoEventTarget+dispatchEvent"></a>

### pseudoHTMLElement.dispatchEvent(event, target) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>PseudoHTMLElement</code>](#PseudoHTMLElement)  
**Overrides**: [<code>dispatchEvent</code>](#PseudoEventTarget+dispatchEvent)  

| Param | Type |
| --- | --- |
| event | <code>Event</code> \| [<code>PseudoEvent</code>](#PseudoEvent) | 
| target | <code>EventTarget</code> \| [<code>PseudoEventTarget</code>](#PseudoEventTarget) | 

<a name="PseudoHTMLDocument"></a>

## PseudoHTMLDocument ⇐ [<code>PseudoHTMLElement</code>](#PseudoHTMLElement)
Simulate the behaviour of the HTMLDocument Class when there is no DOM available.

**Kind**: global class  
**Extends**: [<code>PseudoHTMLElement</code>](#PseudoHTMLElement)  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| head | [<code>PseudoHTMLElement</code>](#PseudoHTMLElement) | A reference to the Head child element |
| body | [<code>PseudoHTMLElement</code>](#PseudoHTMLElement) | A reference to the Body child element |
| createElement | <code>function</code> | Generate a new PseudoHTMLElement with parent of document |


* [PseudoHTMLDocument](#PseudoHTMLDocument) ⇐ [<code>PseudoHTMLElement</code>](#PseudoHTMLElement)
    * [new PseudoHTMLDocument()](#new_PseudoHTMLDocument_new)
    * [.head](#PseudoHTMLDocument+head) : [<code>PseudoHTMLElement</code>](#PseudoHTMLElement)
    * [.body](#PseudoHTMLDocument+body) : [<code>PseudoHTMLElement</code>](#PseudoHTMLElement)
    * [.children](#PseudoHTMLDocument+children) : [<code>Array.&lt;PseudoHTMLElement&gt;</code>](#PseudoHTMLElement)
    * [.createElement(tagName)](#PseudoHTMLDocument+createElement) ⇒ [<code>PseudoHTMLElement</code>](#PseudoHTMLElement)
    * [.applyDefaultEvent()](#PseudoElement+applyDefaultEvent) ⇒ <code>function</code>
    * [.appendChild(childElement)](#PseudoElement+appendChild) ⇒ [<code>PseudoNode</code>](#PseudoNode)
    * [.hasAttribute(attributeName)](#PseudoElement+hasAttribute) ⇒ <code>boolean</code>
    * [.setAttribute(attributeName, attributeValue)](#PseudoElement+setAttribute) ⇒ <code>undefined</code>
    * [.getAttribute(attributeName)](#PseudoElement+getAttribute) ⇒ <code>string</code> \| <code>Object</code>
    * [.removeAttribute(attributeName)](#PseudoElement+removeAttribute) ⇒ <code>null</code>
    * [.removeChild(childElement)](#PseudoNode+removeChild) ⇒ [<code>PseudoNode</code>](#PseudoNode)
    * [.runEvents(event)](#PseudoEventTarget+runEvents) ⇒ <code>boolean</code>
    * [.setDefaultEvent(type, callback)](#PseudoEventTarget+setDefaultEvent)
    * [.runDefaultEvent(event)](#PseudoEventTarget+runDefaultEvent) ⇒ <code>boolean</code>
    * [.startEvents(eventType)](#PseudoEventTarget+startEvents) ⇒ <code>boolean</code>
    * [.addEventListener(type, callback, [useCapture])](#PseudoEventTarget+addEventListener)
    * [.removeEventListener(type, callback)](#PseudoEventTarget+removeEventListener)
    * [.dispatchEvent(event, target)](#PseudoEventTarget+dispatchEvent) ⇒ <code>boolean</code>

<a name="new_PseudoHTMLDocument_new"></a>

### new PseudoHTMLDocument()
The root HTML element is acts as the parent to all HTML elements in the document.

<a name="PseudoHTMLDocument+head"></a>

### pseudoHTMLDocument.head : [<code>PseudoHTMLElement</code>](#PseudoHTMLElement)
Create document head element

**Kind**: instance property of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
<a name="PseudoHTMLDocument+body"></a>

### pseudoHTMLDocument.body : [<code>PseudoHTMLElement</code>](#PseudoHTMLElement)
Create document body element

**Kind**: instance property of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
<a name="PseudoHTMLDocument+children"></a>

### pseudoHTMLDocument.children : [<code>Array.&lt;PseudoHTMLElement&gt;</code>](#PseudoHTMLElement)
Create document child element

**Kind**: instance property of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
<a name="PseudoHTMLDocument+createElement"></a>

### pseudoHTMLDocument.createElement(tagName) ⇒ [<code>PseudoHTMLElement</code>](#PseudoHTMLElement)
Create and return a PseudoHTMLElement

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| tagName | <code>string</code> | <code>&quot;div&quot;</code> | Tag Name is a string representing the type of Dom element this represents |

<a name="PseudoElement+applyDefaultEvent"></a>

### pseudoHTMLDocument.applyDefaultEvent() ⇒ <code>function</code>
**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>applyDefaultEvent</code>](#PseudoElement+applyDefaultEvent)  
<a name="PseudoElement+appendChild"></a>

### pseudoHTMLDocument.appendChild(childElement) ⇒ [<code>PseudoNode</code>](#PseudoNode)
**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>appendChild</code>](#PseudoElement+appendChild)  

| Param | Type |
| --- | --- |
| childElement | [<code>PseudoNode</code>](#PseudoNode) \| [<code>PseudoElement</code>](#PseudoElement) | 

<a name="PseudoElement+hasAttribute"></a>

### pseudoHTMLDocument.hasAttribute(attributeName) ⇒ <code>boolean</code>
Check if an attribute is assigned to this element.

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>hasAttribute</code>](#PseudoElement+hasAttribute)  

| Param | Type | Description |
| --- | --- | --- |
| attributeName | <code>string</code> | The attribute name to check |

<a name="PseudoElement+setAttribute"></a>

### pseudoHTMLDocument.setAttribute(attributeName, attributeValue) ⇒ <code>undefined</code>
Assign a new attribute or overwrite an assigned attribute with name and value.

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>setAttribute</code>](#PseudoElement+setAttribute)  

| Param | Type | Description |
| --- | --- | --- |
| attributeName | <code>string</code> | The name key of the attribute to append |
| attributeValue | <code>string</code> \| <code>Object</code> | The value of the attribute to append |

<a name="PseudoElement+getAttribute"></a>

### pseudoHTMLDocument.getAttribute(attributeName) ⇒ <code>string</code> \| <code>Object</code>
Retrieve the value of the specified attribute from the Element

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>getAttribute</code>](#PseudoElement+getAttribute)  

| Param | Type | Description |
| --- | --- | --- |
| attributeName | <code>string</code> | A string representing the name of the attribute to be retrieved |

<a name="PseudoElement+removeAttribute"></a>

### pseudoHTMLDocument.removeAttribute(attributeName) ⇒ <code>null</code>
Remove an assigned attribute from the Element

**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>removeAttribute</code>](#PseudoElement+removeAttribute)  

| Param | Type | Description |
| --- | --- | --- |
| attributeName | <code>string</code> | The string name of the attribute to be removed |

<a name="PseudoNode+removeChild"></a>

### pseudoHTMLDocument.removeChild(childElement) ⇒ [<code>PseudoNode</code>](#PseudoNode)
**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>removeChild</code>](#PseudoNode+removeChild)  

| Param | Type |
| --- | --- |
| childElement | [<code>PseudoNode</code>](#PseudoNode) | 

<a name="PseudoEventTarget+runEvents"></a>

### pseudoHTMLDocument.runEvents(event) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>runEvents</code>](#PseudoEventTarget+runEvents)  

| Param | Type |
| --- | --- |
| event | [<code>PseudoEvent</code>](#PseudoEvent) | 

<a name="PseudoEventTarget+setDefaultEvent"></a>

### pseudoHTMLDocument.setDefaultEvent(type, callback)
**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>setDefaultEvent</code>](#PseudoEventTarget+setDefaultEvent)  

| Param | Type |
| --- | --- |
| type | <code>string</code> | 
| callback | <code>function</code> | 

<a name="PseudoEventTarget+runDefaultEvent"></a>

### pseudoHTMLDocument.runDefaultEvent(event) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>runDefaultEvent</code>](#PseudoEventTarget+runDefaultEvent)  

| Param | Type |
| --- | --- |
| event | [<code>PseudoEvent</code>](#PseudoEvent) | 

<a name="PseudoEventTarget+startEvents"></a>

### pseudoHTMLDocument.startEvents(eventType) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>startEvents</code>](#PseudoEventTarget+startEvents)  

| Param | Type |
| --- | --- |
| eventType | [<code>PseudoEvent</code>](#PseudoEvent) | 

<a name="PseudoEventTarget+addEventListener"></a>

### pseudoHTMLDocument.addEventListener(type, callback, [useCapture])
**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>addEventListener</code>](#PseudoEventTarget+addEventListener)  

| Param | Type | Default |
| --- | --- | --- |
| type | <code>string</code> |  | 
| callback | <code>function</code> \| <code>Object</code> |  | 
| [useCapture] | <code>boolean</code> \| <code>Object</code> | <code>false</code> | 

<a name="PseudoEventTarget+removeEventListener"></a>

### pseudoHTMLDocument.removeEventListener(type, callback)
**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>removeEventListener</code>](#PseudoEventTarget+removeEventListener)  

| Param | Type |
| --- | --- |
| type | <code>string</code> | 
| callback | <code>function</code> | 

<a name="PseudoEventTarget+dispatchEvent"></a>

### pseudoHTMLDocument.dispatchEvent(event, target) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>PseudoHTMLDocument</code>](#PseudoHTMLDocument)  
**Overrides**: [<code>dispatchEvent</code>](#PseudoEventTarget+dispatchEvent)  

| Param | Type |
| --- | --- |
| event | <code>Event</code> \| [<code>PseudoEvent</code>](#PseudoEvent) | 
| target | <code>EventTarget</code> \| [<code>PseudoEventTarget</code>](#PseudoEventTarget) | 

<a name="PseudoEventTarget"></a>

## PseudoEventTarget
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


* [PseudoEventTarget](#PseudoEventTarget)
    * [.runEvents(event)](#PseudoEventTarget+runEvents) ⇒ <code>boolean</code>
    * [.setDefaultEvent(type, callback)](#PseudoEventTarget+setDefaultEvent)
    * [.runDefaultEvent(event)](#PseudoEventTarget+runDefaultEvent) ⇒ <code>boolean</code>
    * [.startEvents(eventType)](#PseudoEventTarget+startEvents) ⇒ <code>boolean</code>
    * [.addEventListener(type, callback, [useCapture])](#PseudoEventTarget+addEventListener)
    * [.removeEventListener(type, callback)](#PseudoEventTarget+removeEventListener)
    * [.dispatchEvent(event, target)](#PseudoEventTarget+dispatchEvent) ⇒ <code>boolean</code>

<a name="PseudoEventTarget+runEvents"></a>

### pseudoEventTarget.runEvents(event) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>PseudoEventTarget</code>](#PseudoEventTarget)  

| Param | Type |
| --- | --- |
| event | [<code>PseudoEvent</code>](#PseudoEvent) | 

<a name="PseudoEventTarget+setDefaultEvent"></a>

### pseudoEventTarget.setDefaultEvent(type, callback)
**Kind**: instance method of [<code>PseudoEventTarget</code>](#PseudoEventTarget)  

| Param | Type |
| --- | --- |
| type | <code>string</code> | 
| callback | <code>function</code> | 

<a name="PseudoEventTarget+runDefaultEvent"></a>

### pseudoEventTarget.runDefaultEvent(event) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>PseudoEventTarget</code>](#PseudoEventTarget)  

| Param | Type |
| --- | --- |
| event | [<code>PseudoEvent</code>](#PseudoEvent) | 

<a name="PseudoEventTarget+startEvents"></a>

### pseudoEventTarget.startEvents(eventType) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>PseudoEventTarget</code>](#PseudoEventTarget)  

| Param | Type |
| --- | --- |
| eventType | [<code>PseudoEvent</code>](#PseudoEvent) | 

<a name="PseudoEventTarget+addEventListener"></a>

### pseudoEventTarget.addEventListener(type, callback, [useCapture])
**Kind**: instance method of [<code>PseudoEventTarget</code>](#PseudoEventTarget)  

| Param | Type | Default |
| --- | --- | --- |
| type | <code>string</code> |  | 
| callback | <code>function</code> \| <code>Object</code> |  | 
| [useCapture] | <code>boolean</code> \| <code>Object</code> | <code>false</code> | 

<a name="PseudoEventTarget+removeEventListener"></a>

### pseudoEventTarget.removeEventListener(type, callback)
**Kind**: instance method of [<code>PseudoEventTarget</code>](#PseudoEventTarget)  

| Param | Type |
| --- | --- |
| type | <code>string</code> | 
| callback | <code>function</code> | 

<a name="PseudoEventTarget+dispatchEvent"></a>

### pseudoEventTarget.dispatchEvent(event, target) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>PseudoEventTarget</code>](#PseudoEventTarget)  

| Param | Type |
| --- | --- |
| event | <code>Event</code> \| [<code>PseudoEvent</code>](#PseudoEvent) | 
| target | <code>EventTarget</code> \| [<code>PseudoEventTarget</code>](#PseudoEventTarget) | 

<a name="PseudoEventListener"></a>

## PseudoEventListener
**Kind**: global class  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  
**Properties**

| Name | Type |
| --- | --- |
| eventTypes | <code>string</code> | 
| eventOptions | <code>Object</code> | 
| isDefault | <code>boolean</code> | 


* [PseudoEventListener](#PseudoEventListener)
    * [new PseudoEventListener()](#new_PseudoEventListener_new)
    * [.handleEvent(event)](#PseudoEventListener+handleEvent) ⇒ <code>undefined</code>
    * [.doCapturePhase(event)](#PseudoEventListener+doCapturePhase) ⇒ <code>boolean</code>
    * [.doTargetPhase(event)](#PseudoEventListener+doTargetPhase) ⇒ <code>boolean</code>
    * [.doBubblePhase(event)](#PseudoEventListener+doBubblePhase) ⇒ <code>boolean</code> \| <code>\*</code>
    * [.skipPhase(event)](#PseudoEventListener+skipPhase) ⇒ <code>boolean</code>
    * [.skipDefault(event)](#PseudoEventListener+skipDefault) ⇒ <code>boolean</code> \| <code>\*</code>
    * [.stopPropagation(event)](#PseudoEventListener+stopPropagation) ⇒ <code>boolean</code>
    * [.nonPassiveHalt(event)](#PseudoEventListener+nonPassiveHalt) ⇒ <code>boolean</code> \| <code>\*</code>
    * [.rejectEvent(event)](#PseudoEventListener+rejectEvent) ⇒ <code>\*</code> \| <code>boolean</code>

<a name="new_PseudoEventListener_new"></a>

### new PseudoEventListener()
Handle events as they are stored and implemented.

<a name="PseudoEventListener+handleEvent"></a>

### pseudoEventListener.handleEvent(event) ⇒ <code>undefined</code>
**Kind**: instance method of [<code>PseudoEventListener</code>](#PseudoEventListener)  

| Param | Type |
| --- | --- |
| event | [<code>PseudoEvent</code>](#PseudoEvent) | 

<a name="PseudoEventListener+doCapturePhase"></a>

### pseudoEventListener.doCapturePhase(event) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>PseudoEventListener</code>](#PseudoEventListener)  

| Param | Type |
| --- | --- |
| event | [<code>PseudoEvent</code>](#PseudoEvent) | 

<a name="PseudoEventListener+doTargetPhase"></a>

### pseudoEventListener.doTargetPhase(event) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>PseudoEventListener</code>](#PseudoEventListener)  

| Param | Type |
| --- | --- |
| event | [<code>PseudoEvent</code>](#PseudoEvent) | 

<a name="PseudoEventListener+doBubblePhase"></a>

### pseudoEventListener.doBubblePhase(event) ⇒ <code>boolean</code> \| <code>\*</code>
**Kind**: instance method of [<code>PseudoEventListener</code>](#PseudoEventListener)  

| Param | Type |
| --- | --- |
| event | [<code>PseudoEvent</code>](#PseudoEvent) | 

<a name="PseudoEventListener+skipPhase"></a>

### pseudoEventListener.skipPhase(event) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>PseudoEventListener</code>](#PseudoEventListener)  

| Param | Type |
| --- | --- |
| event | [<code>PseudoEvent</code>](#PseudoEvent) | 

<a name="PseudoEventListener+skipDefault"></a>

### pseudoEventListener.skipDefault(event) ⇒ <code>boolean</code> \| <code>\*</code>
**Kind**: instance method of [<code>PseudoEventListener</code>](#PseudoEventListener)  

| Param | Type |
| --- | --- |
| event | [<code>PseudoEvent</code>](#PseudoEvent) | 

<a name="PseudoEventListener+stopPropagation"></a>

### pseudoEventListener.stopPropagation(event) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>PseudoEventListener</code>](#PseudoEventListener)  

| Param | Type |
| --- | --- |
| event | [<code>PseudoEvent</code>](#PseudoEvent) | 

<a name="PseudoEventListener+nonPassiveHalt"></a>

### pseudoEventListener.nonPassiveHalt(event) ⇒ <code>boolean</code> \| <code>\*</code>
**Kind**: instance method of [<code>PseudoEventListener</code>](#PseudoEventListener)  

| Param | Type |
| --- | --- |
| event | [<code>PseudoEvent</code>](#PseudoEvent) | 

<a name="PseudoEventListener+rejectEvent"></a>

### pseudoEventListener.rejectEvent(event) ⇒ <code>\*</code> \| <code>boolean</code>
**Kind**: instance method of [<code>PseudoEventListener</code>](#PseudoEventListener)  

| Param | Type |
| --- | --- |
| event | [<code>PseudoEvent</code>](#PseudoEvent) | 

<a name="PseudoEvent"></a>

## PseudoEvent
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
| composed | <code>boolean</code> | A Boolean value indicating whether or not the event can bubble across the boundary between the shadow Dom and the regular Dom. |
| currentTarget | <code>function</code> \| [<code>PseudoEventTarget</code>](#PseudoEventTarget) | A reference to the currently registered target for the event. This is the object to which the event is currently slated to be sent; it's possible this has been changed along the way through re-targeting. |
| defaultPrevented | <code>boolean</code> | Indicates whether or not event.preventDefault() has been called on the event. |
| immediatePropagationStopped | <code>boolean</code> | Flag that no further propagation should occur, including on current target. |
| propagationStopped | <code>boolean</code> | Flag that no further propagation should occur. |
| eventPhase | <code>int</code> | Indicates which phase of the event flow is being processed. Uses PseudoEvent constants. |
| target | <code>EventTarget</code> \| [<code>PseudoEventTarget</code>](#PseudoEventTarget) | A reference to the target to which the event was originally dispatched. |
| timeStamp | <code>int</code> | The time at which the event was created (in milliseconds). By specification, this value is time since epoch, but in reality browsers' definitions vary; in addition, work is underway to change this to be a DomHighResTimeStamp instead. |
| type | <code>string</code> | The name of the event (case-insensitive). |
| isTrusted | <code>boolean</code> | Indicates whether or not the event was initiated by the browser (after a user click for instance) or by a script (using an event creation method, like event.initEvent) |


* [PseudoEvent](#PseudoEvent)
    * [new PseudoEvent(typeArg, bubbles, cancelable, composed)](#new_PseudoEvent_new)
    * _instance_
        * [.composedPath()](#PseudoEvent+composedPath) ⇒ [<code>Array.&lt;PseudoEventTarget&gt;</code>](#PseudoEventTarget)
        * [.preventDefault()](#PseudoEvent+preventDefault) ⇒ <code>null</code>
        * [.stopImmediatePropagation()](#PseudoEvent+stopImmediatePropagation) ⇒ <code>null</code>
        * [.stopPropagation()](#PseudoEvent+stopPropagation) ⇒ <code>null</code>
    * _static_
        * [.getParentNodesFromAttribute(attr, value, node)](#PseudoEvent.getParentNodesFromAttribute) ⇒ [<code>Array.&lt;PseudoNode&gt;</code>](#PseudoNode)
        * [.getParentNodes(node)](#PseudoEvent.getParentNodes) ⇒ [<code>Array.&lt;PseudoNode&gt;</code>](#PseudoNode)

<a name="new_PseudoEvent_new"></a>

### new PseudoEvent(typeArg, bubbles, cancelable, composed)

| Param |
| --- |
| typeArg | 
| bubbles | 
| cancelable | 
| composed | 

<a name="PseudoEvent+composedPath"></a>

### pseudoEvent.composedPath() ⇒ [<code>Array.&lt;PseudoEventTarget&gt;</code>](#PseudoEventTarget)
Return an array of targets that will have the event executed open them. The order is based on the eventPhase

**Kind**: instance method of [<code>PseudoEvent</code>](#PseudoEvent)  
<a name="PseudoEvent+preventDefault"></a>

### pseudoEvent.preventDefault() ⇒ <code>null</code>
Cancels the event (if it is cancelable).

**Kind**: instance method of [<code>PseudoEvent</code>](#PseudoEvent)  
<a name="PseudoEvent+stopImmediatePropagation"></a>

### pseudoEvent.stopImmediatePropagation() ⇒ <code>null</code>
For this particular event, no other listener will be called.Neither those attached on the same element, nor those attached on elements which will be traversed later (incapture phase, for instance)

**Kind**: instance method of [<code>PseudoEvent</code>](#PseudoEvent)  
<a name="PseudoEvent+stopPropagation"></a>

### pseudoEvent.stopPropagation() ⇒ <code>null</code>
Stops the propagation of events further along in the Dom.

**Kind**: instance method of [<code>PseudoEvent</code>](#PseudoEvent)  
<a name="PseudoEvent.getParentNodesFromAttribute"></a>

### PseudoEvent.getParentNodesFromAttribute(attr, value, node) ⇒ [<code>Array.&lt;PseudoNode&gt;</code>](#PseudoNode)
A selector function for retrieving existing parent PseudoNode from the given child item.This function will check all the parents starting from node, and scan the attributesproperty for matches. The return array contains all matching parent ancestors.WARNING: This is a recursive function.

**Kind**: static method of [<code>PseudoEvent</code>](#PseudoEvent)  

| Param | Type |
| --- | --- |
| attr | <code>string</code> | 
| value | <code>number</code> \| <code>string</code> | 
| node | [<code>PseudoNode</code>](#PseudoNode) | 

<a name="PseudoEvent.getParentNodes"></a>

### PseudoEvent.getParentNodes(node) ⇒ [<code>Array.&lt;PseudoNode&gt;</code>](#PseudoNode)
A helper selector function for retrieving all parent PseudoNode for the given child node.

**Kind**: static method of [<code>PseudoEvent</code>](#PseudoEvent)  

| Param | Type |
| --- | --- |
| node | [<code>PseudoNode</code>](#PseudoNode) | 

<a name="PseudoElement"></a>

## PseudoElement ⇐ [<code>PseudoNode</code>](#PseudoNode)
Simulate the behaviour of the Element Class when there is no DOM available.

**Kind**: global class  
**Extends**: [<code>PseudoNode</code>](#PseudoNode)  
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


* [PseudoElement](#PseudoElement) ⇐ [<code>PseudoNode</code>](#PseudoNode)
    * [new PseudoElement([tagName], [attributes], [parent], [children])](#new_PseudoElement_new)
    * [.applyDefaultEvent()](#PseudoElement+applyDefaultEvent) ⇒ <code>function</code>
    * [.appendChild(childElement)](#PseudoElement+appendChild) ⇒ [<code>PseudoNode</code>](#PseudoNode)
    * [.hasAttribute(attributeName)](#PseudoElement+hasAttribute) ⇒ <code>boolean</code>
    * [.setAttribute(attributeName, attributeValue)](#PseudoElement+setAttribute) ⇒ <code>undefined</code>
    * [.getAttribute(attributeName)](#PseudoElement+getAttribute) ⇒ <code>string</code> \| <code>Object</code>
    * [.removeAttribute(attributeName)](#PseudoElement+removeAttribute) ⇒ <code>null</code>
    * [.removeChild(childElement)](#PseudoNode+removeChild) ⇒ [<code>PseudoNode</code>](#PseudoNode)
    * [.runEvents(event)](#PseudoEventTarget+runEvents) ⇒ <code>boolean</code>
    * [.setDefaultEvent(type, callback)](#PseudoEventTarget+setDefaultEvent)
    * [.runDefaultEvent(event)](#PseudoEventTarget+runDefaultEvent) ⇒ <code>boolean</code>
    * [.startEvents(eventType)](#PseudoEventTarget+startEvents) ⇒ <code>boolean</code>
    * [.addEventListener(type, callback, [useCapture])](#PseudoEventTarget+addEventListener)
    * [.removeEventListener(type, callback)](#PseudoEventTarget+removeEventListener)
    * [.dispatchEvent(event, target)](#PseudoEventTarget+dispatchEvent) ⇒ <code>boolean</code>

<a name="new_PseudoElement_new"></a>

### new PseudoElement([tagName], [attributes], [parent], [children])
Simulate the Element object when the Dom is not available


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [tagName] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | The |
| [attributes] | <code>array</code> | <code>[]</code> |  |
| [parent] | [<code>PseudoNode</code>](#PseudoNode) \| <code>Object</code> | <code>{}</code> |  |
| [children] | <code>Array</code> | <code>[]</code> |  |

<a name="PseudoElement+applyDefaultEvent"></a>

### pseudoElement.applyDefaultEvent() ⇒ <code>function</code>
**Kind**: instance method of [<code>PseudoElement</code>](#PseudoElement)  
<a name="PseudoElement+appendChild"></a>

### pseudoElement.appendChild(childElement) ⇒ [<code>PseudoNode</code>](#PseudoNode)
**Kind**: instance method of [<code>PseudoElement</code>](#PseudoElement)  
**Overrides**: [<code>appendChild</code>](#PseudoNode+appendChild)  

| Param | Type |
| --- | --- |
| childElement | [<code>PseudoNode</code>](#PseudoNode) \| [<code>PseudoElement</code>](#PseudoElement) | 

<a name="PseudoElement+hasAttribute"></a>

### pseudoElement.hasAttribute(attributeName) ⇒ <code>boolean</code>
Check if an attribute is assigned to this element.

**Kind**: instance method of [<code>PseudoElement</code>](#PseudoElement)  

| Param | Type | Description |
| --- | --- | --- |
| attributeName | <code>string</code> | The attribute name to check |

<a name="PseudoElement+setAttribute"></a>

### pseudoElement.setAttribute(attributeName, attributeValue) ⇒ <code>undefined</code>
Assign a new attribute or overwrite an assigned attribute with name and value.

**Kind**: instance method of [<code>PseudoElement</code>](#PseudoElement)  

| Param | Type | Description |
| --- | --- | --- |
| attributeName | <code>string</code> | The name key of the attribute to append |
| attributeValue | <code>string</code> \| <code>Object</code> | The value of the attribute to append |

<a name="PseudoElement+getAttribute"></a>

### pseudoElement.getAttribute(attributeName) ⇒ <code>string</code> \| <code>Object</code>
Retrieve the value of the specified attribute from the Element

**Kind**: instance method of [<code>PseudoElement</code>](#PseudoElement)  

| Param | Type | Description |
| --- | --- | --- |
| attributeName | <code>string</code> | A string representing the name of the attribute to be retrieved |

<a name="PseudoElement+removeAttribute"></a>

### pseudoElement.removeAttribute(attributeName) ⇒ <code>null</code>
Remove an assigned attribute from the Element

**Kind**: instance method of [<code>PseudoElement</code>](#PseudoElement)  

| Param | Type | Description |
| --- | --- | --- |
| attributeName | <code>string</code> | The string name of the attribute to be removed |

<a name="PseudoNode+removeChild"></a>

### pseudoElement.removeChild(childElement) ⇒ [<code>PseudoNode</code>](#PseudoNode)
**Kind**: instance method of [<code>PseudoElement</code>](#PseudoElement)  
**Overrides**: [<code>removeChild</code>](#PseudoNode+removeChild)  

| Param | Type |
| --- | --- |
| childElement | [<code>PseudoNode</code>](#PseudoNode) | 

<a name="PseudoEventTarget+runEvents"></a>

### pseudoElement.runEvents(event) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>PseudoElement</code>](#PseudoElement)  
**Overrides**: [<code>runEvents</code>](#PseudoEventTarget+runEvents)  

| Param | Type |
| --- | --- |
| event | [<code>PseudoEvent</code>](#PseudoEvent) | 

<a name="PseudoEventTarget+setDefaultEvent"></a>

### pseudoElement.setDefaultEvent(type, callback)
**Kind**: instance method of [<code>PseudoElement</code>](#PseudoElement)  
**Overrides**: [<code>setDefaultEvent</code>](#PseudoEventTarget+setDefaultEvent)  

| Param | Type |
| --- | --- |
| type | <code>string</code> | 
| callback | <code>function</code> | 

<a name="PseudoEventTarget+runDefaultEvent"></a>

### pseudoElement.runDefaultEvent(event) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>PseudoElement</code>](#PseudoElement)  
**Overrides**: [<code>runDefaultEvent</code>](#PseudoEventTarget+runDefaultEvent)  

| Param | Type |
| --- | --- |
| event | [<code>PseudoEvent</code>](#PseudoEvent) | 

<a name="PseudoEventTarget+startEvents"></a>

### pseudoElement.startEvents(eventType) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>PseudoElement</code>](#PseudoElement)  
**Overrides**: [<code>startEvents</code>](#PseudoEventTarget+startEvents)  

| Param | Type |
| --- | --- |
| eventType | [<code>PseudoEvent</code>](#PseudoEvent) | 

<a name="PseudoEventTarget+addEventListener"></a>

### pseudoElement.addEventListener(type, callback, [useCapture])
**Kind**: instance method of [<code>PseudoElement</code>](#PseudoElement)  
**Overrides**: [<code>addEventListener</code>](#PseudoEventTarget+addEventListener)  

| Param | Type | Default |
| --- | --- | --- |
| type | <code>string</code> |  | 
| callback | <code>function</code> \| <code>Object</code> |  | 
| [useCapture] | <code>boolean</code> \| <code>Object</code> | <code>false</code> | 

<a name="PseudoEventTarget+removeEventListener"></a>

### pseudoElement.removeEventListener(type, callback)
**Kind**: instance method of [<code>PseudoElement</code>](#PseudoElement)  
**Overrides**: [<code>removeEventListener</code>](#PseudoEventTarget+removeEventListener)  

| Param | Type |
| --- | --- |
| type | <code>string</code> | 
| callback | <code>function</code> | 

<a name="PseudoEventTarget+dispatchEvent"></a>

### pseudoElement.dispatchEvent(event, target) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>PseudoElement</code>](#PseudoElement)  
**Overrides**: [<code>dispatchEvent</code>](#PseudoEventTarget+dispatchEvent)  

| Param | Type |
| --- | --- |
| event | <code>Event</code> \| [<code>PseudoEvent</code>](#PseudoEvent) | 
| target | <code>EventTarget</code> \| [<code>PseudoEventTarget</code>](#PseudoEventTarget) | 

<a name="root"></a>

## root
Store a reference to this scope which will be Window if rendered via browser

**Kind**: global constant  
<a name="previousPseudoDom"></a>

## previousPseudoDom : <code>module</code> \| <code>\*</code>
Store reference to any pre-existing module of the same name

**Kind**: global constant  
