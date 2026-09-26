/**
 * A node's children, serialized in order (this is what innerHTML returns).
 * @param node
 */
declare const serializeChildren: (node: any) => string;
/**
 * An element itself, serialized with its children (this is what outerHTML returns).
 * @param element
 */
declare const serializeOuter: (element: any) => string;
/**
 * A node's markup, indented one level per level of nesting - a real DOM's outerHTML / innerHTML has no line breaks
 * at all, which does not read well for a whole tree (a board full of cells, say). Useful for watching pseudo-dom-
 * driven code run headlessly, printed to a terminal - see also logElement, which does the printing too.
 * @param node
 * @param indent The indentation used per level of nesting
 */
declare const prettyPrint: (node: any, indent?: string) => string;
export { serializeChildren, serializeOuter, prettyPrint };
