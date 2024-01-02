import PseudoNode from './PseudoNode'
import PseudoElement from './PseudoElement'

class PseudoAttr extends PseudoNode {
  public readonly localName: string
  public readonly name: string
  public readonly namespaceURI: string | null
  public readonly ownerElement: PseudoElement
  public readonly prefix: string | null
  public value: string
}

export default PseudoAttr
