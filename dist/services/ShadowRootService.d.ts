import { DocumentFragmentService } from './DocumentFragmentService';
import { PseudoShadowRoot } from '../interfaces/PseudoShadowRoot';
import { PseudoElement } from '../interfaces/PseudoElement';
/**
 * Simulate the behaviour of the ShadowRoot Class when there is no DOM available: a DocumentFragment attached to an
 * element via attachShadow, which sets host and mode.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments DocumentFragmentService
 */
export declare class ShadowRootService extends DocumentFragmentService implements PseudoShadowRoot {
    /** The element this shadow root is attached to. Set by attachShadow. */
    host: PseudoElement | null;
    /** 'open' (reachable via element.shadowRoot) or 'closed' (not). Set by attachShadow. */
    mode: string;
}
