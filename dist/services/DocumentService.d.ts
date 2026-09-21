import { NodeService } from './NodeService';
import { PseudoDocument } from '../interfaces/PseudoDocument';
/**
 * Simulate the behaviour of the Document Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments NodeService
 */
export declare class DocumentService extends NodeService implements PseudoDocument {
    get nodeName(): string;
    get nodeType(): number;
}
