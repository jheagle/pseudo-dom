/**
 * The modifier keys which were held down when a mouse or keyboard event happened.
 * @typedef {Object} ModifierKeys
 * @property {boolean} ctrlKey
 * @property {boolean} shiftKey
 * @property {boolean} altKey
 * @property {boolean} metaKey
 */
export type ModifierKeys = {
    ctrlKey: boolean;
    shiftKey: boolean;
    altKey: boolean;
    metaKey: boolean;
};
/**
 * Pick the modifier keys out of the init object of an event.
 * @function modifierKeys
 * @param {Object} [init={}] The init of an event
 * @returns {ModifierKeys}
 */
export declare const modifierKeys: (init?: any) => ModifierKeys;
/**
 * Answer getModifierState for a set of held modifier keys.
 * @function modifierState
 * @param {ModifierKeys} keys The modifier keys which were held down
 * @param {string} key The name of the modifier (Control, Shift, Alt or Meta)
 * @returns {boolean}
 */
export declare const modifierState: (keys: ModifierKeys, key: string) => boolean;
