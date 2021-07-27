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
<dt><a href="#PseudoElement">PseudoElement</a> ⇐ <code><a href="#PseudoNode">PseudoNode</a></code></dt>
<dd><p>Simulate the behaviour of the Element Class when there is no DOM available.</p>
</dd>
<dt><a href="#PseudoEvent">PseudoEvent</a></dt>
<dd><p>Simulate the behaviour of the Event Class when there is no DOM available.</p>
</dd>
<dt><a href="#PseudoEventListener">PseudoEventListener</a></dt>
<dd></dd>
<dt><a href="#PseudoEventTarget">PseudoEventTarget</a></dt>
<dd><p>Simulate the behaviour of the EventTarget Class when there is no DOM available.</p>
</dd>
<dt><a href="#PseudoHTMLDocument">PseudoHTMLDocument</a> ⇐ <code><a href="#PseudoHTMLElement">PseudoHTMLElement</a></code></dt>
<dd><p>Simulate the behaviour of the HTMLDocument Class when there is no DOM available.</p>
</dd>
<dt><a href="#PseudoHTMLElement">PseudoHTMLElement</a> ⇐ <code><a href="#PseudoElement">PseudoElement</a></code></dt>
<dd><p>Simulate the behaviour of the HTMLElement Class when there is no DOM available.</p>
</dd>
<dt><a href="#PseudoNode">PseudoNode</a> ⇐ <code><a href="#PseudoEventTarget">PseudoEventTarget</a></code></dt>
<dd><p>Simulate the behaviour of the Node Class when there is no DOM available.</p>
</dd>
<dt><a href="#PseudoNodeAttached">PseudoNodeAttached</a> ⇐ <code><a href="#PseudoEventTarget">PseudoEventTarget</a></code></dt>
<dd><p>Simulate the behaviour of the Node Class when there is no DOM available.</p>
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
Construct the Pseudo Dom to provide access to Dom objects which are otherwise not available outside of the browser
context.

**Kind**: inner method of [<code>pseudoDom/objects</code>](#module_pseudoDom/objects)  

| Param | Type |
| --- | --- |
| root | <code>Object</code> | 
| context | <code>Object</code> | 

<a name="module_pseudoDom/objects..noConflict"></a>

### pseudoDom/objects~noConflict() ⇒ <code>pseudoDom</code>
Return a reference to this library while preserving the original same-named library

**Kind**: inner method of [<code>pseudoDom/objects</code>](#module_pseudoDom/objects)  
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
    * [new exports.PseudoEventListener()](#new_PseudoEventListener_new)
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

### new exports.PseudoEventListener()
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

<a name="root"></a>

## root
Store a reference to this scope which will be Window if rendered via browser

**Kind**: global constant  
<a name="previousPseudoDom"></a>

## previousPseudoDom : <code>module</code> \| <code>\*</code>
Store reference to any pre-existing module of the same name

**Kind**: global constant  
