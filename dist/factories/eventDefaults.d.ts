/**
 * @file The standard event types of the browser, and how the browser creates them.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
/**
 * How the browser creates an event of a standard type: whether it bubbles, whether it can be cancelled, whether it
 * crosses the boundary of a shadow tree, and which kind of event object it is.
 * @typedef {Object} EventDefinition
 * @property {boolean} bubbles - After the target, the event goes back up through the ancestors (the capture phase, going down, always happens)
 * @property {boolean} cancelable - preventDefault() can stop the default action
 * @property {boolean} composed - The event crosses the boundary of a shadow tree
 * @property {string} interface - The kind of event object: Event, UIEvent, MouseEvent, PointerEvent, KeyboardEvent, FocusEvent, InputEvent or CustomEvent
 */
export type EventDefinition = {
    bubbles: boolean;
    cancelable: boolean;
    composed: boolean;
    interface: 'Event' | 'UIEvent' | 'MouseEvent' | 'PointerEvent' | 'KeyboardEvent' | 'FocusEvent' | 'InputEvent' | 'CustomEvent';
};
/**
 * The events which the browser itself creates (for a user action, or for something like element.click()) have these
 * options. A script which creates an event with the constructor gets none of them (everything is false) unless it asks
 * for them, which is why createEvent only uses this table when it is told the browser is creating the event.
 * The values follow the UI Events, HTML, Pointer Events, Clipboard, Drag and Drop, Touch and CSS specifications.
 * @type {Object.<string, EventDefinition>}
 */
export declare const eventDefaults: {
    [type: string]: EventDefinition;
};
export default eventDefaults;
