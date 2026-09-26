import { PseudoAttr } from '../interfaces/PseudoAttr'
import { PseudoElement } from '../interfaces/PseudoElement'
import { NodeService } from './NodeService'

/**
 * Simulate the behaviour of the Attr Class when there is no DOM available.
 */
export class AttrService extends NodeService implements PseudoAttr {
  public value: string
  private readonly attributeName: string
  private readonly element: PseudoElement | null
  private readonly namespace: string
  private readonly namespacePrefix: string | null

  /**
   * @param name The name of the attribute
   * @param value The value of the attribute
   * @param ownerElement The element which has this attribute
   * @param namespaceURI The namespace of the attribute
   * @param prefix The namespace prefix of the attribute
   */
  constructor (name: string = '', value: string = '', ownerElement: PseudoElement | null = null, namespaceURI: string = '', prefix: string | null = null) {
    super()
    this.attributeName = name
    this.value = value
    this.element = ownerElement
    this.namespace = namespaceURI
    this.namespacePrefix = prefix
    this.nodeNameValue = name
  }

  protected get acceptsChildren (): boolean {
    return false
  }

  get nodeValue (): string | null {
    return this.value
  }

  set nodeValue (value: string | null) {
    this.value = value === null ? '' : String(value)
  }

  get textContent (): string | null {
    return this.value
  }

  set textContent (text: string | null) {
    this.value = text === null ? '' : String(text)
  }

  protected cloneShallow (): NodeService {
    return new AttrService(this.localName, this.value, null, this.namespaceURI, this.prefix)
  }

  get nodeType (): number {
    return NodeService.ATTRIBUTE_NODE
  }

  get localName (): string {
    return this.attributeName
  }

  get name (): string {
    return this.namespacePrefix ? `${this.namespacePrefix}:${this.attributeName}` : this.attributeName
  }

  get namespaceURI (): string {
    return this.namespace
  }

  get ownerElement (): PseudoElement | null {
    return this.element
  }

  get prefix (): string | null {
    return this.namespacePrefix
  }
}
