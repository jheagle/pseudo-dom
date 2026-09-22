/**
 * All of the elements below (not including) scope which match the selector, in tree order.
 * @memberOf module:factories
 * @param {string} selector A CSS selector
 * @param {*} scope The node to search below
 * @returns {Array<*>}
 */
export declare const querySelectorAll: (selector: string, scope: any) => Array<any>;
/**
 * The first element below (not including) scope which matches the selector, in tree order, or null when there is none.
 * @memberOf module:factories
 * @param {string} selector A CSS selector
 * @param {*} scope The node to search below
 * @returns {*|null}
 */
export declare const querySelector: (selector: string, scope: any) => any | null;
/**
 * Whether an element itself (not its descendants) matches the selector.
 * @memberOf module:factories
 * @param {*} element The element to test
 * @param {string} selector A CSS selector
 * @returns {boolean}
 */
export declare const matches: (element: any, selector: string) => boolean;
/**
 * The nearest ancestor of an element (starting with the element itself) which matches the selector, or null when
 * none of them do.
 * @memberOf module:factories
 * @param {*} element The element to start from
 * @param {string} selector A CSS selector
 * @returns {*|null}
 */
export declare const closest: (element: any, selector: string) => any | null;
