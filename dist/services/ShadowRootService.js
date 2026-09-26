'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.ShadowRootService = void 0
const DocumentFragmentService_1 = require('./DocumentFragmentService')
/**
 * Simulate the behaviour of the ShadowRoot Class when there is no DOM available: a DocumentFragment attached to an
 * element via attachShadow, which sets host and mode.
 */
class ShadowRootService extends DocumentFragmentService_1.DocumentFragmentService {
  constructor () {
    super(...arguments)
    /** The element this shadow root is attached to. Set by attachShadow. */
    this.host = null
    /** 'open' (reachable via element.shadowRoot) or 'closed' (not). Set by attachShadow. */
    this.mode = 'open'
  }
}
exports.ShadowRootService = ShadowRootService
