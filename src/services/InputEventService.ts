/**
 * @file Substitute for the DOM InputEvent Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { UIEventInit, UIEventService } from './UIEventService'

/**
 * The options for creating an input event, on top of the ones every UI event has.
 * @typedef {Object} InputEventInit
 * @property {string|null} [data=null] The characters which were entered
 * @property {string} [inputType=''] What kind of change it was, such as insertText
 * @property {boolean} [isComposing=false]
 */
export type InputEventInit = UIEventInit & { data?: string | null, inputType?: string, isComposing?: boolean }

/**
 * Simulate the behaviour of the InputEvent Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments UIEventService
 * @property {string|null} data
 * @property {string} inputType
 * @property {boolean} isComposing
 */
export class InputEventService extends UIEventService {
  private readonly inputData: string | null
  private readonly kind: string
  private readonly composing: boolean

  /**
   * @param {string} [typeArg=''] The type of the event
   * @param {InputEventInit} [init={}] The options for the event
   * @constructor
   */
  constructor (typeArg: string = '', init: InputEventInit = {}) {
    super(typeArg, init)
    this.inputData = typeof init.data === 'string' ? init.data : null
    this.kind = init.inputType || ''
    this.composing = !!init.isComposing
  }

  get data (): string | null {
    return this.inputData
  }

  get inputType (): string {
    return this.kind
  }

  get isComposing (): boolean {
    return this.composing
  }
}
