/**
 * @file Substitute for the DOM HTMLDocument Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { HTMLElementService as PseudoHTMLElement } from '../services/HTMLElementService';
import { DocumentService } from '../services/DocumentService';
import { NodeService } from '../services/NodeService';
/**
 * Simulate the behaviour of the HTMLDocument Class when there is no DOM available. Like the real HTMLDocument, this
 * only adds the html/head/body structure on top of what Document already gives (createElement, createTextNode,
 * createComment, createDocumentFragment, getElementById, textContent always null).
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments DocumentService
 * @property {PseudoHTMLElement} head - A reference to the Head child element
 * @property {PseudoHTMLElement} body - A reference to the Body child element
 */
declare class PseudoHTMLDocument extends DocumentService {
    head: PseudoHTMLElement | null;
    body: PseudoHTMLElement | null;
    /**
     * The root HTML element is acts as the parent to all HTML elements in the document.
     * @constructor
     */
    constructor();
    /**
     * A copy of this document with none of its html/head/body (cloneNode, from the inherited cloneShallow hook, fills
     * them back in, deep copies own document's, empty otherwise - see cloneNode).
     * @returns {PseudoHTMLDocument}
     */
    protected cloneShallow(): NodeService;
    /**
     * Make a copy of this document. The copy has no parent or listeners, and a deep copy has copies of everything in
     * the document (a shallow one is an empty document).
     * @param {boolean} [deep=false] Copy everything in the document as well
     * @returns {PseudoHTMLDocument}
     */
    cloneNode(deep?: boolean): PseudoHTMLDocument;
}
export default PseudoHTMLDocument;
