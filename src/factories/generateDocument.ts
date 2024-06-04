import PseudoEventTarget from '../interfaces/PseudoEventTarget'
import PseudoNode from '../interfaces/PseudoNode'
import PseudoElement from '../interfaces/PseudoElement'
import PseudoHTMLElement from '../interfaces/PseudoHTMLElement'
import PseudoHTMLDocument from '../classes/PseudoHTMLDocument'

/**
 * Construct the Pseudo Dom to provide access to Dom objects which are otherwise not available outside the browser
 * context.
 * @function generateDocument
 * @param {Object} root
 * @param {Object} context
 * @returns {Window|PseudoEventTarget}
 */
const generateDocument = (root: Window | any, context: object = {}): Window | PseudoEventTarget => {
  /**
   *
   * @type {Window|PseudoEventTarget}
   */
  const newWindow: Window | PseudoEventTarget | any = typeof root.document === 'undefined' ? root : new PseudoEventTarget()

  /**
   * @type {Node|PseudoNode}
   */
  const Node = root.Node || new PseudoNode()
  if (typeof newWindow.Node === 'undefined') {
    newWindow.Node = Node
  }

  /**
   *
   * @type {Element|PseudoElement}
   */
  const Element = root.Element || new PseudoElement()
  if (typeof newWindow.Element === 'undefined') {
    newWindow.Element = Element
  }

  /**
   * Create an instance of HTMLElement if not available
   * @type {HTMLElement|PseudoHTMLElement}
   */
  const HTMLElement = root.HTMLElement || new PseudoHTMLElement()
  if (typeof newWindow.HTMLElement === 'undefined') {
    newWindow.HTMLElement = HTMLElement
  }

  /**
   * Define document when not available
   * @type {Document|PseudoHTMLDocument}
   */
  const document = root.document || new PseudoHTMLDocument()
  if (typeof newWindow.document === 'undefined') {
    newWindow.document = document
  }

  return context ? Object.assign(context, newWindow) : Object.assign(root, newWindow)
}

export default generateDocument
