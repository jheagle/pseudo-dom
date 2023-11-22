/**
 * @file All of the Pseudo Dom classes for replicating DOM structure.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import PseudoEvent from '././classes/PseudoEvent';
import PseudoEventTarget from '././classes/PseudoEventTarget';
import PseudoNode from '././classes/PseudoNode';
import PseudoElement from '././classes/PseudoElement';
import PseudoHTMLElement from '././classes/PseudoHTMLElement';
import PseudoHTMLDocument from '././classes/PseudoHTMLDocument';
declare const _default: {
    PseudoEvent: typeof PseudoEvent;
    PseudoEventTarget: typeof PseudoEventTarget;
    PseudoNode: typeof PseudoNode;
    PseudoElement: typeof PseudoElement;
    PseudoHTMLElement: typeof PseudoHTMLElement;
    PseudoHTMLDocument: typeof PseudoHTMLDocument;
};
export default _default;
