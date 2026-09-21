declare const _default: {
    generateNode: () => typeof import("./factories/generateNode").NodeFactory;
    nodeListFactory: (innerList?: import("collect-your-stuff/dist/collections/linked-tree-list/TreeLinker").TreeLinker | null) => import("./classes/PseudoNodeList").PseudoNodeList;
};
export default _default;
