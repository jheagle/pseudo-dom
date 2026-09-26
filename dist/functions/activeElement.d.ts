/**
 * Find the element which has the focus in a tree.
 * @param root The root node of the tree
 */
export declare const getActiveElement: (root: object) => any | null;
/**
 * Remember the element which has the focus in a tree.
 * @param root The root node of the tree
 * @param element The element which now has the focus, or null when nothing has it
 */
export declare const setActiveElement: (root: object, element: any | null) => void;
