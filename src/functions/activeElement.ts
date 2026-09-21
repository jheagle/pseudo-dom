/**
 * The element which has the focus, kept for each tree (the root node of the tree it is in), like document.activeElement.
 */
const focused: WeakMap<object, any> = new WeakMap()

/**
 * Find the element which has the focus in a tree.
 * @function getActiveElement
 * @param {Object} root The root node of the tree
 * @returns {Object|null}
 */
export const getActiveElement = (root: object): any | null => focused.get(root) || null

/**
 * Remember the element which has the focus in a tree.
 * @function setActiveElement
 * @param {Object} root The root node of the tree
 * @param {Object|null} element The element which now has the focus, or null when nothing has it
 */
export const setActiveElement = (root: object, element: any | null): void => {
  if (element === null) {
    focused.delete(root)
  } else {
    focused.set(root, element)
  }
}
