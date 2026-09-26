/**
 * Substitute for the DOM PointerEvent Class.
 */
import { MouseEventInit, MouseEventService } from './MouseEventService'

/**
 * The options for creating a pointer event, on top of the ones every mouse event has.
 */
export type PointerEventInit = MouseEventInit & {
  pointerId?: number,
  width?: number,
  height?: number,
  pressure?: number,
  /** mouse, pen or touch (default '') */
  pointerType?: string,
  isPrimary?: boolean
}

/**
 * Simulate the behaviour of the PointerEvent Class when there is no DOM available.
 */
export class PointerEventService extends MouseEventService {
  private readonly pointer: { pointerId: number, width: number, height: number, pressure: number, pointerType: string, isPrimary: boolean }

  /**
   * @param typeArg The type of the event
   * @param init The options for the event
   */
  constructor (typeArg: string = '', init: PointerEventInit = {}) {
    super(typeArg, init)
    this.pointer = {
      pointerId: init.pointerId || 0,
      width: typeof init.width === 'number' ? init.width : 1,
      height: typeof init.height === 'number' ? init.height : 1,
      pressure: init.pressure || 0,
      pointerType: init.pointerType || '',
      isPrimary: !!init.isPrimary
    }
  }

  get pointerId (): number {
    return this.pointer.pointerId
  }

  get width (): number {
    return this.pointer.width
  }

  get height (): number {
    return this.pointer.height
  }

  get pressure (): number {
    return this.pointer.pressure
  }

  get pointerType (): string {
    return this.pointer.pointerType
  }

  get isPrimary (): boolean {
    return this.pointer.isPrimary
  }
}
