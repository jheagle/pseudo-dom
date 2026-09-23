import { NodeService, TextService, CommentService } from './NodeService';
import { PseudoDocument } from '../interfaces/PseudoDocument';
import { PseudoElement } from '../interfaces/PseudoElement';
import { DocumentFragmentService } from './DocumentFragmentService';
/**
 * Simulate the behaviour of the Document Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments NodeService
 */
export declare class DocumentService extends NodeService implements PseudoDocument {
    get nodeName(): string;
    get nodeType(): number;
    get textContent(): string | null;
    set textContent(text: string | null);
    /**
     * The first element, in tree order, whose id matches the given value, or null when there is none.
     * @param {string} id
     * @returns {PseudoElement|null}
     */
    getElementById(id: string): PseudoElement | null;
    /**
     * Make an element of the given type which belongs to this document but is not added anywhere until it is appended.
     * @param {string} [tagName='div'] The type of element to create
     * @returns {PseudoElement}
     */
    createElement(tagName?: string): PseudoElement;
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
}
