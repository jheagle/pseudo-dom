import IsTree from 'collect-your-stuff/dist/recipes/IsTree';
import LinkedTreeList from 'collect-your-stuff/dist/collections/linked-tree-list/LinkedTreeList';
import { NodeFactory } from '../factories/generateNode';
import AttachedNodeIterator from '../recipes/AttachedNodeIterator';
declare class PseudoNodeList extends LinkedTreeList implements IsTree, Iterable<NodeFactory> {
    readonly classType: typeof PseudoNodeList;
    entries(): {
        [Symbol.iterator]: () => AttachedNodeIterator;
    };
    keys(): {
        [Symbol.iterator]: () => AttachedNodeIterator;
    };
    values(): {
        [Symbol.iterator]: () => AttachedNodeIterator;
    };
    /**
     * Be able to iterate over this class.
     * @returns {Iterator}
     */
    [Symbol.iterator](): Iterator<NodeFactory>;
    /**
     * Convert an array into a LinkedTreeList instance, return the new instance.
     * @param {Array} [values=[]] An array of values which will be converted to nodes in this tree-list
     * @param {NodeFactory} [nodeClass=NodeFactory] The class to use for each node
     * @param {IsArrayable<NodeFactory>} [classType=PseudoNodeList] Provide the type of IsArrayable to use.
     * @returns {PseudoNodeList}
     */
    static fromArray(values?: Array<any>, nodeClass?: typeof NodeFactory, classType?: any): PseudoNodeList;
}
export default PseudoNodeList;
