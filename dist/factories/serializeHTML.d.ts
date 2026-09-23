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
export { serializeChildren, serializeOuter };
