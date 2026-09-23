/**
 * A node's children, serialized in order (this is what innerHTML returns).
 * @memberOf module:factories
 * @param {*} node
 * @returns {string}
 */
declare const serializeChildren: (node: any) => string;
/**
 * An element itself, serialized with its children (this is what outerHTML returns).
 * @memberOf module:factories
 * @param {*} element
 * @returns {string}
 */
declare const serializeOuter: (element: any) => string;
/**
 * A node's markup, indented one level per level of nesting - a real DOM's outerHTML / innerHTML has no line breaks
 * at all, which does not read well for a whole tree (a board full of cells, say). Useful for watching pseudo-dom-
 * driven code run headlessly, printed to a terminal - see also logElement, which does the printing too.
 * @memberOf module:factories
 * @param {*} node
 * @param {string} [indent='  '] The indentation used per level of nesting
 * @returns {string}
 */
declare const prettyPrint: (node: any, indent?: string) => string;
export { serializeChildren, serializeOuter, prettyPrint };
