/**
 * Click an element the way a user does: pointerdown and mousedown, then the focus moves to the nearest element which
 * can have it (or is taken away from the one which had it) unless mousedown was cancelled, then pointerup, mouseup
 * and finally click. Every event is trusted and has the options the browser gives it. A disabled element gets nothing.
 * @function click
 * @param {*} element The element to click
 * @param {Object} [init={}] Options for the events (for example clientX, clientY, shiftKey)
 * @returns {boolean} False when the click was cancelled (or the element is disabled), so its default action did not happen
 */
export declare const click: (element: any, init?: {
    [option: string]: any;
}) => boolean;
/**
 * Press and release a key on an element (the element which has the focus, or one given): keydown and then keyup.
 * @function keyPress
 * @param {*} element The element which gets the key
 * @param {string} key The value of the key, such as a or Enter
 * @param {Object} [init={}] Options for the events (for example code, shiftKey)
 * @returns {boolean} False when keydown was cancelled, so its default action did not happen
 */
export declare const keyPress: (element: any, key: string, init?: {
    [option: string]: any;
}) => boolean;
declare const _default: {
    click: (element: any, init?: {
        [option: string]: any;
    }) => boolean;
    keyPress: (element: any, key: string, init?: {
        [option: string]: any;
    }) => boolean;
};
export default _default;
