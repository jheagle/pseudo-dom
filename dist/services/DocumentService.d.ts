import { NodeService } from './NodeService';
import { PseudoDocument } from '../interfaces/PseudoDocument';
import { PseudoElement } from '../interfaces/PseudoElement';
/**
 * Simulate the behaviour of the Document Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments NodeService
 */
export declare class DocumentService extends NodeService implements PseudoDocument {
    get nodeName(): string;
    get nodeType(): number;
    /**
     * The first element, in tree order, whose id matches the given value, or null when there is none.
     * @param {string} id
     * @returns {PseudoElement|null}
     */
    getElementById(id: string): PseudoElement | null;
}
