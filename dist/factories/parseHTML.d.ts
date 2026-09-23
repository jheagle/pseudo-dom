/**
 * Parse an HTML string into the nodes it describes (siblings at the top level, exactly like the DOM's own HTML
 * parsing does for innerHTML / insertAdjacentHTML - there is no single root unless the markup itself has one).
 * @memberOf module:factories
 * @param {string} html
 * @param {*} ownerDocument The document the new nodes belong to (matches what innerHTML etc. would set), or null
 * @param {function(new: *, {tagName: string})} ElementClass The class to build each parsed element with
 * @returns {Array<*>}
 */
declare const parseHTML: (html: string, ownerDocument: any, ElementClass: new (options: {
    tagName: string;
}) => any) => Array<any>;
export default parseHTML;
