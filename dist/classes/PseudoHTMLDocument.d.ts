/**
 * Substitute for the DOM HTMLDocument Class.
 */
import { HTMLElementService as PseudoHTMLElement } from '../services/HTMLElementService';
import { DocumentService } from '../services/DocumentService';
import { NodeService } from '../services/NodeService';
/**
 * Simulate the behaviour of the HTMLDocument Class when there is no DOM available. Like the real HTMLDocument, this
 * only adds the html/head/body structure on top of what Document already gives (createElement, createTextNode,
 * createComment, createDocumentFragment, getElementById, textContent always null).
 */
declare class PseudoHTMLDocument extends DocumentService {
    /** A reference to the Head child element */
    head: PseudoHTMLElement | null;
    /** A reference to the Body child element */
    body: PseudoHTMLElement | null;
    /**
     * The root HTML element is acts as the parent to all HTML elements in the document.
     */
    constructor();
    /**
     * A copy of this document with none of its html/head/body (cloneNode, from the inherited cloneShallow hook, fills
     * them back in, deep copies own document's, empty otherwise - see cloneNode).
     */
    protected cloneShallow(): NodeService;
    /**
     * Make a copy of this document. The copy has no parent or listeners, and a deep copy has copies of everything in
     * the document (a shallow one is an empty document).
     * @param deep Copy everything in the document as well
     */
    cloneNode(deep?: boolean): PseudoHTMLDocument;
}
export default PseudoHTMLDocument;
