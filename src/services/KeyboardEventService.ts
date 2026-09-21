/**
 * @file Substitute for the DOM KeyboardEvent Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { UIEventInit, UIEventService } from './UIEventService'
import { ModifierKeys, modifierKeys, modifierState } from '../functions/modifierState'

/**
 * The options for creating a keyboard event, on top of the ones every UI event has.
 * @typedef {Object} KeyboardEventInit
 * @property {string} [key=''] The value of the key, such as a or Enter
 * @property {string} [code=''] The physical key, such as KeyA or Enter
 * @property {number} [location=0] Where on the keyboard the key is (0 standard, 1 left, 2 right, 3 numeric pad)
 * @property {boolean} [repeat=false] The key is being held down
 * @property {boolean} [isComposing=false]
 * @property {boolean} [ctrlKey=false]
 * @property {boolean} [shiftKey=false]
 * @property {boolean} [altKey=false]
 * @property {boolean} [metaKey=false]
 */
export type KeyboardEventInit = UIEventInit & {
  key?: string,
  code?: string,
  location?: number,
  repeat?: boolean,
  isComposing?: boolean,
  ctrlKey?: boolean,
  shiftKey?: boolean,
  altKey?: boolean,
  metaKey?: boolean
}

/**
 * Simulate the behaviour of the KeyboardEvent Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments UIEventService
 * @property {string} key
 * @property {string} code
 * @property {number} location
 * @property {boolean} repeat
 * @property {boolean} isComposing
 */
export class KeyboardEventService extends UIEventService {
  private readonly keyValue: string
  private readonly keyCode: string
  private readonly keyLocation: number
  private readonly held: boolean
  private readonly composing: boolean
  private readonly modifiers: ModifierKeys

  /**
   * @param {string} [typeArg=''] The type of the event
   * @param {KeyboardEventInit} [init={}] The options for the event
   * @constructor
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
   * @param {string} key Control, Shift, Alt or Meta
   * @returns {boolean}
   */
  public getModifierState (key: string): boolean {
    return modifierState(this.modifiers, key)
  }
}
