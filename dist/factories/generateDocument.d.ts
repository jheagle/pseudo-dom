import PseudoEventTarget from '../services/EventTargetService';
/**
 * Construct the Pseudo Dom to provide access to Dom objects which are otherwise not available outside the browser
 * context.
 * @param root
 * @param context
 */
declare const generateDocument: (root: Window | any, context?: object) => Window | PseudoEventTarget;
export default generateDocument;
