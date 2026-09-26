import { EventService } from '../services/EventService';
/**
 * How the event is being created.
 */
export type CreateEventOptions = {
    /** The browser is creating the event (for a user action, or for something like element.click()), so the standard options for the type of event apply where the init does not give its own (default false) */
    browser?: boolean;
    /** The event comes from a real user action rather than from a script (isTrusted) (default false) */
    trusted?: boolean;
};
/**
 * Create an event of the kind which suits its type (a click is a MouseEvent, a keydown a KeyboardEvent, ...).
 * By default this is like using the constructor of the event in a script: nothing bubbles or can be cancelled unless
 * the init says so, and the event is not trusted. With browser: true the event is created the way the browser creates
 * it, using the standard options for its type (see eventDefaults), and trusted: true makes it look like it came from a
 * real user action (isTrusted).
 * @param type The type of the event, such as click
 * @param init The options for the event (bubbles, cancelable, composed and those of its kind of event)
 * @param options Whether the browser is creating the event, and whether it is trusted
 */
export declare const createEvent: (type: string, init?: {
    [option: string]: any;
}, { browser, trusted }?: CreateEventOptions) => EventService;
export default createEvent;
