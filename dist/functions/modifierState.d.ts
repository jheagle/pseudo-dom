/**
 * The modifier keys which were held down when a mouse or keyboard event happened.
 */
export type ModifierKeys = {
    ctrlKey: boolean;
    shiftKey: boolean;
    altKey: boolean;
    metaKey: boolean;
};
/**
 * Pick the modifier keys out of the init object of an event.
 * @param init The init of an event
 */
export declare const modifierKeys: (init?: any) => ModifierKeys;
/**
 * Answer getModifierState for a set of held modifier keys.
 * @param keys The modifier keys which were held down
 * @param key The name of the modifier (Control, Shift, Alt or Meta)
 */
export declare const modifierState: (keys: ModifierKeys, key: string) => boolean;
