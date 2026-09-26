/**
 * A live DOMStringMap-like object for an element's data-* attributes.
 * @param element The element whose data-* attributes this reflects
 */
declare const createDataset: (element: any) => {
    [key: string]: string;
};
export default createDataset;
