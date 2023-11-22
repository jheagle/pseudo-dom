import PseudoEventTarget from '../classes/PseudoEventTarget';
/**
 * Construct the Pseudo Dom to provide access to Dom objects which are otherwise not available outside the browser
 * context.
 * @function generateDocument
 * @param {Object} root
 * @param {Object} context
 * @returns {Window|PseudoEventTarget}
 */
declare const generateDocument: (root: Window | any, context?: object) => Window | PseudoEventTarget;
export default generateDocument;
