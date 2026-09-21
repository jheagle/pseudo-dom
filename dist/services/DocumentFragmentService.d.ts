import { NodeService } from './NodeService';
import { PseudoDocumentFragment } from '../interfaces/PseudoDocumentFragment';
/**
 * Simulate the behaviour of the DocumentFragment Class when there is no DOM available: a container for nodes which is
 * not part of a tree, when it is inserted its children are moved into the tree instead.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments NodeService
 */
export declare class DocumentFragmentService extends NodeService implements PseudoDocumentFragment {
    get nodeName(): string;
    get nodeType(): number;
}
