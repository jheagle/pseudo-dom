import { NodeService } from './NodeService';
import { PseudoDocumentFragment } from '../interfaces/PseudoDocumentFragment';
import { PseudoElement } from '../interfaces/PseudoElement';
/**
 * Simulate the behaviour of the DocumentFragment Class when there is no DOM available: a container for nodes which is
 * not part of a tree, when it is inserted its children are moved into the tree instead.
 */
export declare class DocumentFragmentService extends NodeService implements PseudoDocumentFragment {
    get nodeName(): string;
    get nodeType(): number;
    /**
     * The first element, in tree order, whose id matches the given value, or null when there is none (the DOM's
     * NonElementParentNode mixin, which Document and DocumentFragment both implement).
     * @param id
     */
    getElementById(id: string): PseudoElement | null;
}
