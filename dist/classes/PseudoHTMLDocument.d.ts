/**
 * @file Substitute for the DOM HTMLDocument Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
/**
 *
 * @type {PseudoHTMLElement}
 */
import { HTMLElementService as PseudoHTMLElement } from '../services/HTMLElementService';
import { TextService, CommentService } from '../services/NodeService';
import { DocumentFragmentService } from '../services/DocumentFragmentService';
import { PseudoNode } from '../interfaces/PseudoNode';
/**
 * Simulate the behaviour of the HTMLDocument Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments PseudoHTMLElement
 * @property {PseudoHTMLElement} head - A reference to the Head child element
 * @property {PseudoHTMLElement} body - A reference to the Body child element
 * @property {function} createElement - Generate a new PseudoHTMLElement (which is not in the document until it is appended)
 */
declare class PseudoHTMLDocument extends PseudoHTMLElement {
    private head;
    private body;
    /**
     * The root HTML element is acts as the parent to all HTML elements in the document.
     * @constructor
     */
    constructor();
    get nodeName(): string;
    get nodeType(): number;
    get textContent(): string | null;
    set textContent(text: string | null);
    /**
     * Make an element of the given type which belongs to this document but is not added anywhere until it is appended.
     * @param {string} tagName - Tag Name is a string representing the type of Dom element this represents
     * @returns {PseudoHTMLElement}
     */
    createElement(tagName?: string): PseudoHTMLElement;
    /**
     * Make a text node which belongs to this document.
     * @param {string} [data=''] The text
     * @returns {TextService}
     */
    createTextNode(data?: string): TextService;
    /**
     * Make a comment which belongs to this document.
     * @param {string} [data=''] The comment
     * @returns {CommentService}
     */
    createComment(data?: string): CommentService;
    /**
     * Make an empty document fragment which belongs to this document, a container for nodes which can be built up and
     * then inserted in one go.
     * @returns {DocumentFragmentService}
     */
    createDocumentFragment(): DocumentFragmentService;
    /**
     * Make a copy of this document. The copy has no parent or listeners, and a deep copy has copies of everything in the
     * document (a shallow one is an empty document).
     * @param {boolean} [deep=false] Copy everything in the document as well
     * @returns {PseudoNode}
     */
    cloneNode(deep?: boolean): PseudoNode;
}
export default PseudoHTMLDocument;
