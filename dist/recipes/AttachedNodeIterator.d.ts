import { NodeFactory } from '../factories/generateNode';
/**
 * Class TreeLinkerIterator returns the next value taking a left-first approach down a tree.
 */
declare class AttachedNodeIterator implements Iterator<NodeFactory> {
    private current;
    private valueRule;
    constructor(current: NodeFactory, valueRule?: Function | null);
    next(): IteratorResult<NodeFactory>;
}
export default AttachedNodeIterator;
