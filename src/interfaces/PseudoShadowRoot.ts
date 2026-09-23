import { PseudoDocumentFragment } from './PseudoDocumentFragment'
import { PseudoElement } from './PseudoElement'

export interface PseudoShadowRoot extends PseudoDocumentFragment {
  /**
   * The element this shadow root is attached to.
   */
  get host (): PseudoElement

  /**
   * 'open' (reachable via element.shadowRoot) or 'closed' (not).
   */
  get mode (): string
}
