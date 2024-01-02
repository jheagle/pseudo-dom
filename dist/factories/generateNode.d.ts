import IsTreeNode from 'collect-your-stuff/dist/recipes/IsTreeNode';
import TreeLinker from 'collect-your-stuff/dist/collections/linked-tree-list/TreeLinker';
export declare class NodeFactory extends TreeLinker {
    readonly classType: typeof NodeFactory;
    /**
     * Create the new TreeLinker instance, provide the data and optionally set references for next, prev, parent, or children.
     * @param {Object} [settings={}]
     * @param {*} [settings.data=null] The data to be stored in this tree node
     * @param {TreeLinker} [settings.next=null] The reference to the next linker if any
     * @param {TreeLinker} [settings.prev=null] The reference to the previous linker if any
     * @param {LinkedTreeList} [settings.children=null] The references to child linkers if any
     * @param {TreeLinker} [settings.parent=null] The reference to a parent linker if any
     * @param {IsArrayable<IsTreeNode>} listClass Give the type of list to use for storing the children
     */
    constructor({ data, next, prev, children, parent, listClass }?: {
        data?: any;
        next?: IsTreeNode;
        prev?: IsTreeNode;
        children?: Array<any>;
        parent?: IsTreeNode;
        listClass?: any;
    });
}
declare const generateNode: () => typeof NodeFactory;
export default generateNode;
