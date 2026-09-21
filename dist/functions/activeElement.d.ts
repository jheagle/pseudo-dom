/**
 * Find the element which has the focus in a tree.
 * @function getActiveElement
 * @param {Object} root The root node of the tree
 * @returns {Object|null}
 */
export declare const getActiveElement: (root: object) => any | null;
/**
 * Remember the element which has the focus in a tree.
 * @function setActiveElement
 * @param {Object} root The root node of the tree
 * @param {Object|null} element The element which now has the focus, or null when nothing has it
 */
export declare const setActiveElement: (root: object, element: any | null) => void;
