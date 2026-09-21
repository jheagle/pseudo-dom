'use strict'

require('core-js/modules/esnext.weak-map.delete-all.js')
Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.setActiveElement = exports.getActiveElement = void 0
/**
 * The element which has the focus, kept for each tree (the root node of the tree it is in), like document.activeElement.
 */
const focused = new WeakMap()
/**
 * Find the element which has the focus in a tree.
 * @function getActiveElement
 * @param {Object} root The root node of the tree
 * @returns {Object|null}
 */
const getActiveElement = root => focused.get(root) || null
exports.getActiveElement = getActiveElement
/**
 * Remember the element which has the focus in a tree.
 * @function setActiveElement
 * @param {Object} root The root node of the tree
 * @param {Object|null} element The element which now has the focus, or null when nothing has it
 */
const setActiveElement = (root, element) => {
  if (element === null) {
    focused.delete(root)
  } else {
    focused.set(root, element)
  }
}
exports.setActiveElement = setActiveElement
