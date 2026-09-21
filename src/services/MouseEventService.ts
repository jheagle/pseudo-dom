/**
 * @file Substitute for the DOM MouseEvent Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { UIEventInit, UIEventService } from './UIEventService'
import { ModifierKeys, modifierKeys, modifierState } from '../functions/modifierState'
import { PseudoEventTarget } from '../interfaces/PseudoEventTarget'

/**
 * The options for creating a mouse event, on top of the ones every UI event has.
 * @typedef {Object} MouseEventInit
 * @property {number} [screenX=0]
 * @property {number} [screenY=0]
 * @property {number} [clientX=0]
 * @property {number} [clientY=0]
 * @property {boolean} [ctrlKey=false]
 * @property {boolean} [shiftKey=false]
 * @property {boolean} [altKey=false]
 * @property {boolean} [metaKey=false]
 * @property {number} [button=0] The button which changed (0 is the main button)
 * @property {number} [buttons=0] The buttons which are down
 * @property {PseudoEventTarget|null} [relatedTarget=null] The other target involved (the one the mouse came from or went to)
 */
export type MouseEventInit = UIEventInit & {
  screenX?: number,
  screenY?: number,
  clientX?: number,
  clientY?: number,
  ctrlKey?: boolean,
  shiftKey?: boolean,
  altKey?: boolean,
  metaKey?: boolean,
  button?: number,
  buttons?: number,
  relatedTarget?: PseudoEventTarget | null
}

/**
 * Simulate the behaviour of the MouseEvent Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments UIEventService
 * @property {number} screenX
 * @property {number} screenY
 * @property {number} clientX
 * @property {number} clientY
 * @property {number} button
 * @property {number} buttons
 * @property {PseudoEventTarget|null} relatedTarget
 */
export class MouseEventService extends UIEventService {
  private readonly position: { screenX: number, screenY: number, clientX: number, clientY: number }
  private readonly modifiers: ModifierKeys
  private readonly buttonPressed: number
  private readonly buttonsDown: number
  private readonly related: PseudoEventTarget | null

  /**
   * @param {string} [typeArg=''] The type of the event
   * @param {MouseEventInit} [init={}] The options for the event
   * @constructor
   */
  constructor (typeArg: string = '', init: MouseEventInit = {}) {
    super(typeArg, init)
    this.position = {
      screenX: init.screenX || 0,
      screenY: init.screenY || 0,
      clientX: init.clientX || 0,
      clientY: init.clientY || 0
    }
    this.modifiers = modifierKeys(init)
    this.buttonPressed = init.button || 0
    this.buttonsDown = init.buttons || 0
    this.related = init.relatedTarget || null
  }

  get screenX (): number {
    return this.position.screenX
  }

  get screenY (): number {
    return this.position.screenY
  }

  get clientX (): number {
    return this.position.clientX
  }

  get clientY (): number {
    return this.position.clientY
  }

  get x (): number {
    return this.position.clientX
  }

  get y (): number {
    return this.position.clientY
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

  get button (): number {
    return this.buttonPressed
  }

  get buttons (): number {
    return this.buttonsDown
  }

  get relatedTarget (): PseudoEventTarget | null {
    return this.related
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
