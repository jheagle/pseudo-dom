/**
 * All of the elements below (not including) scope which match the selector, in tree order.
 * @param selector A CSS selector
 * @param scope The node to search below
 */
export declare const querySelectorAll: (selector: string, scope: any) => Array<any>;
/**
 * The first element below (not including) scope which matches the selector, in tree order, or null when there is none.
 * @param selector A CSS selector
 * @param scope The node to search below
 */
export declare const querySelector: (selector: string, scope: any) => any | null;
/**
 * Whether an element itself (not its descendants) matches the selector.
 * @param element The element to test
 * @param selector A CSS selector
 */
export declare const matches: (element: any, selector: string) => boolean;
/**
 * The nearest ancestor of an element (starting with the element itself) which matches the selector, or null when
 * none of them do.
 * @param element The element to start from
 * @param selector A CSS selector
 */
export declare const closest: (element: any, selector: string) => any | null;
