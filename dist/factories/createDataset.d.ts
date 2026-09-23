/**
 * A live DOMStringMap-like object for an element's data-* attributes.
 * @memberOf module:factories
 * @param {*} element The element whose data-* attributes this reflects
 * @returns {Object.<string, string>}
 */
declare const createDataset: (element: any) => {
    [key: string]: string;
};
export default createDataset;
