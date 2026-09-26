/**
 * The modifier keys which were held down when a mouse or keyboard event happened.
 */
export type ModifierKeys = { ctrlKey: boolean, shiftKey: boolean, altKey: boolean, metaKey: boolean }

/**
 * Pick the modifier keys out of the init object of an event.
 * @param init The init of an event
 */
export const modifierKeys = (init: any = {}): ModifierKeys => ({
  ctrlKey: !!init.ctrlKey,
  shiftKey: !!init.shiftKey,
  altKey: !!init.altKey,
  metaKey: !!init.metaKey
})

/**
 * Answer getModifierState for a set of held modifier keys.
 * @param keys The modifier keys which were held down
 * @param key The name of the modifier (Control, Shift, Alt or Meta)
 */
export const modifierState = (keys: ModifierKeys, key: string): boolean => {
  switch (key) {
    case 'Control':
      return keys.ctrlKey
    case 'Shift':
      return keys.shiftKey
    case 'Alt':
      return keys.altKey
    case 'Meta':
      return keys.metaKey
    default:
      return false
  }
}
