/**
 * Substitute for the DOM FocusEvent Class.
 */
import { UIEventInit, UIEventService } from './UIEventService'
import { PseudoEventTarget } from '../interfaces/PseudoEventTarget'

/**
 * The options for creating a focus event, on top of the ones every UI event has.
 */
export type FocusEventInit = UIEventInit & {
  /** The other target involved (the one losing or gaining the focus) (default null) */
  relatedTarget?: PseudoEventTarget | null
}

/**
 * Simulate the behaviour of the FocusEvent Class when there is no DOM available.
 */
export class FocusEventService extends UIEventService {
  private readonly related: PseudoEventTarget | null

  /**
   * @param typeArg The type of the event
   * @param init The options for the event
   */
  constructor (typeArg: string = '', init: FocusEventInit = {}) {
    super(typeArg, init)
    this.related = init.relatedTarget || null
  }

  get relatedTarget (): PseudoEventTarget | null {
    return this.related
  }
}
