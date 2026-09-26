/**
 * Substitute for the DOM KeyboardEvent Class.
 */
import { UIEventInit, UIEventService } from './UIEventService'
import { ModifierKeys, modifierKeys, modifierState } from '../functions/modifierState'

/**
 * The options for creating a keyboard event, on top of the ones every UI event has.
 */
export type KeyboardEventInit = UIEventInit & {
  /** The value of the key, such as a or Enter (default '') */
  key?: string,
  /** The physical key, such as KeyA or Enter (default '') */
  code?: string,
  /** Where on the keyboard the key is (0 standard, 1 left, 2 right, 3 numeric pad) (default 0) */
  location?: number,
  /** The key is being held down (default false) */
  repeat?: boolean,
  isComposing?: boolean,
  ctrlKey?: boolean,
  shiftKey?: boolean,
  altKey?: boolean,
  metaKey?: boolean
}

/**
 * Simulate the behaviour of the KeyboardEvent Class when there is no DOM available.
 */
export class KeyboardEventService extends UIEventService {
  private readonly keyValue: string
  private readonly keyCode: string
  private readonly keyLocation: number
  private readonly held: boolean
  private readonly composing: boolean
  private readonly modifiers: ModifierKeys

  /**
   * @param typeArg The type of the event
   * @param init The options for the event
   */
  constructor (typeArg: string = '', init: KeyboardEventInit = {}) {
    super(typeArg, init)
    this.keyValue = init.key || ''
    this.keyCode = init.code || ''
    this.keyLocation = init.location || 0
    this.held = !!init.repeat
    this.composing = !!init.isComposing
    this.modifiers = modifierKeys(init)
  }

  get key (): string {
    return this.keyValue
  }

  get code (): string {
    return this.keyCode
  }

  get location (): number {
    return this.keyLocation
  }

  get repeat (): boolean {
    return this.held
  }

  get isComposing (): boolean {
    return this.composing
  }

  get ctrlKey (): boolean {
    return this.modifiers.ctrlKey
  }

  get shiftKey (): boolean {
    return this.modifiers.shiftKey
  }

  get altKey (): boolean {
    return this.modifiers.altKey
  }

  get metaKey (): boolean {
    return this.modifiers.metaKey
  }

  /**
   * Whether a modifier key was held down when the event happened.
   * @param key Control, Shift, Alt or Meta
   */
  public getModifierState (key: string): boolean {
    return modifierState(this.modifiers, key)
  }
}
