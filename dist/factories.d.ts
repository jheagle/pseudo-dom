declare const _default: {
    generateNode: () => typeof import("./factories/generateNode").NodeFactory;
    nodeListFactory: (innerList?: import("collect-your-stuff/dist/collections/linked-tree-list/TreeLinker").TreeLinker | null) => import("./classes/PseudoNodeList").PseudoNodeList;
    createEvent: (type: string, init?: {
        [option: string]: any;
    }, { browser, trusted }?: import("./factories/createEvent").CreateEventOptions) => import("./main").PseudoEvent;
    eventDefaults: {
        [type: string]: import("./factories/eventDefaults").EventDefinition;
    };
};
export default _default;
