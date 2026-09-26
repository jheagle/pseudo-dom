/**
 * The standard event types of the browser, and how the browser creates them.
 */
/**
 * How the browser creates an event of a standard type: whether it bubbles, whether it can be cancelled, whether it
 * crosses the boundary of a shadow tree, and which kind of event object it is.
 */
export type EventDefinition = {
    /** After the target, the event goes back up through the ancestors (the capture phase, going down, always happens) */
    bubbles: boolean;
    /** preventDefault() can stop the default action */
    cancelable: boolean;
    /** The event crosses the boundary of a shadow tree */
    composed: boolean;
    /** The kind of event object: Event, UIEvent, MouseEvent, PointerEvent, KeyboardEvent, FocusEvent, InputEvent or CustomEvent */
    interface: 'Event' | 'UIEvent' | 'MouseEvent' | 'PointerEvent' | 'KeyboardEvent' | 'FocusEvent' | 'InputEvent' | 'CustomEvent';
};
/**
 * The events which the browser itself creates (for a user action, or for something like element.click()) have these
 * options. A script which creates an event with the constructor gets none of them (everything is false) unless it asks
 * for them, which is why createEvent only uses this table when it is told the browser is creating the event.
 * The values follow the UI Events, HTML, Pointer Events, Clipboard, Drag and Drop, Touch and CSS specifications.
 */
export declare const eventDefaults: {
    [type: string]: EventDefinition;
};
export default eventDefaults;
