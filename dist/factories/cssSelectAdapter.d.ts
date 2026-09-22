/**
 * Maps pseudo-dom's own Node / Element API onto the Adapter interface css-select needs to query a tree which is not
 * domutils' own (css-select's own Adapter<Node, ElementNode> type). Every method here is one pseudo-dom already has
 * under a different name; nothing here reimplements DOM behaviour.
 * @memberOf module:factories
 * @type {Object}
 */
export declare const cssSelectAdapter: {
    isTag: (node: any) => boolean;
    existsOne: (test: (elem: any) => boolean, elems: Array<any>) => boolean;
    getAttributeValue: (elem: any, name: string) => string | undefined;
    getChildren: (node: any) => Array<any>;
    getName: (elem: any) => string;
    getParent: (node: any) => any | null;
    getSiblings: (node: any) => Array<any>;
    prevElementSibling: (node: any) => any | null;
    getText: (node: any) => string;
    hasAttrib: (elem: any, name: string) => boolean;
    removeSubsets: (nodes: Array<any>) => Array<any>;
    findAll: (test: (elem: any) => boolean, nodes: Array<any>) => Array<any>;
    findOne: (test: (elem: any) => boolean, nodes: Array<any>) => any | null;
};
export default cssSelectAdapter;
