/**
 * Substitute for the DOM MouseEvent Class.
 */
import { UIEventInit, UIEventService } from './UIEventService'
import { ModifierKeys, modifierKeys, modifierState } from '../functions/modifierState'
import { PseudoEventTarget } from '../interfaces/PseudoEventTarget'

/**
 * The options for creating a mouse event, on top of the ones every UI event has.
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
  /** The button which changed (0 is the main button) (default 0) */
  button?: number,
  /** The buttons which are down (default 0) */
  buttons?: number,
  /** The other target involved (the one the mouse came from or went to) (default null) */
  relatedTarget?: PseudoEventTarget | null
}

/**
 * Simulate the behaviour of the MouseEvent Class when there is no DOM available.
 */
export class MouseEventService extends UIEventService {
  private readonly position: { screenX: number, screenY: number, clientX: number, clientY: number }
  private readonly modifiers: ModifierKeys
  private readonly buttonPressed: number
  private readonly buttonsDown: number
  private readonly related: PseudoEventTarget | null

  /**
   * @param typeArg The type of the event
   * @param init The options for the event
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
   * @param key Control, Shift, Alt or Meta
   */
  public getModifierState (key: string): boolean {
    return modifierState(this.modifiers, key)
  }
}
