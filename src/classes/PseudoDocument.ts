import PseudoNode from './PseudoNode'
import PseudoElement from './PseudoElement'
import PseudoEventTarget from '../recipes/PseudoEventTarget'
import PseudoDOMImplementation, { PseudoDocumentTypeInterface } from './PseudoDOMImplementation'
import PseudoHTMLElement from './PseudoHTMLElement'
import PseudoAttr from './PseudoAttr'
import PseudoCDATASection from './characterNodes/PseudoCDATASection'
import PseudoComment from './characterNodes/PseudoComment'
import PseudoNodeList from './PseudoNodeList'

export class PseudoCustomAttr extends PseudoAttr {
  public constructor ({ localName = '', namespaceURI = '', name = '' }: {
    localName?: string,
    namespaceURI?: string,
    name?: string
  } = {}) {
    super()
    this.localName = localName
    this.namespaceURI = namespaceURI
    this.name = name
    if (!name) {
      this.name = this.namespaceURI ? this.localName : `${this.namespaceURI}.${this.localName}`
    }
  }
}

export class PseudoDocumentFragment extends PseudoNode {
  public readonly childElementCount: number
  // TODO: create PseudoHTMLCollection
  public readonly children: PseudoElement[]
  public readonly firstElementChild: PseudoElement | null
  public readonly lastElementChild: PseudoElement | null

  public constructor () {
    super()
  }

  public append (...params: PseudoNode[]): void {

  }

  public prepend (...params: PseudoNode[]): void {

  }

  public querySelector (selectors: string): PseudoElement | null {
    return null
  }

  public querySelectorAll (selectors: string): PseudoNodeList {
    return new PseudoNodeList()
  }

  public replaceChildren (...params: Array<PseudoNode | string>): void {

  }

  public getElementById (id: string): PseudoElement | null {
    return null
  }
}

class PseudoDocument extends PseudoNode {
  public readonly activeElement: PseudoElement | null
  // TODO: create CSSStyleSheet array as the type
  public readonly adoptedStyleSheets: any[]
  // TODO: create HTMLBodyElement and HTMLFrameSetElement as the actual element options
  public body: PseudoElement | null
  public characterSet: string
  public readonly childElementCount: number
  // TODO: create HTMLCollection arrayable as the type
  public readonly children: PseudoElement[]
  public readonly compatMode: 'BackCompat' | 'CSS1Compat'
  public readonly contentType: string
  // TODO: create HTMLScriptElement which would indicate the currently running script that is not a 'module'
  public readonly currentScript: PseudoElement | null
  public readonly doctype: PseudoDocumentTypeInterface
  public readonly documentElement: PseudoElement
  public readonly documentURI: string
  // TODO: create HTMLCollection arrayable as the type, create HTMLEmbedElement as the items in the collection
  public readonly embeds: PseudoHTMLElement[]
  public readonly firstElementChild: PseudoElement | null
  // TODO: create FontFaceSet
  public fonts: PseudoEventTarget
  // TODO: create HTMLCollection arrayable as the type, create HTMLFormElement as the items in the collection
  public readonly forms: PseudoHTMLElement[]
  public readonly fullscreenElement: PseudoElement | null
  // TODO: create HTMLHeadElement
  public readonly head: PseudoHTMLElement
  public readonly hidden: boolean
  // TODO: create HTMLCollection arrayable as the type, create HTMLImageElement as the items in the collection
  public readonly images: PseudoHTMLElement[]
  public readonly implementation: PseudoDOMImplementation
  public readonly lastElementChild: PseudoElement | null
  // TODO: create HTMLCollection arrayable as the type, create HTMLAnchorElement and HTMLAreaElement as the items in the collection having 'href' attribute
  public readonly links: PseudoHTMLElement[]
  public readonly pictureInPictureElement: PseudoElement | null
  public readonly pictureInPictureEnabled: boolean
  // TODO: create HTMLCollection arrayable as the type, create HTMLEmbedElement as the items in the collection
  public readonly plugins: PseudoHTMLElement[]
  public readonly pointerLockElement: PseudoElement | null
  // TODO: create HTMLCollection arrayable as the type, create HTMLScriptElement as the items in the collection
  public readonly scripts: PseudoHTMLElement[]
  public readonly scrollingElement: PseudoElement
  // TODO: create StyleSheetList arrayable as the type, create CSSStyleSheet which extends StyleSheet as the items in the collection
  public readonly styleSheets: any[]
  // TODO: create DocumentTimeline which extends AnimationTimeline as the type
  public readonly timeline: any
  public readonly visibilityState: 'visible' | 'hidden'

  public adoptNode (externalNode: PseudoNode): PseudoNode {
    // TODO: add the node to this document
    return externalNode
  }

  public append (...params: PseudoNode[]): undefined {

  }

  // TODO: create CaretPosition to be returned
  public caretPositionFromPoint (x: number, y: number): any {
    return [x, y]
  }

  public createAttribute (name: string): PseudoAttr {
    return new PseudoCustomAttr({ localName: name })
  }

  public createAttributeNS (namespaceURI: string, qualifiedName: string) {
    return new PseudoCustomAttr({ namespaceURI: namespaceURI, name: qualifiedName })
  }

  public createCDATASection (data: string): PseudoCDATASection {
    return new PseudoCDATASection(data)
  }

  public createComment (data: string): PseudoComment {
    return new PseudoComment(data)
  }

  public createDocumentFragment (): PseudoDocumentFragment {
    return new PseudoDocumentFragment()
  }

  /**
   * Create and return a PseudoHTMLElement
   * @param {string} tagName - Tag Name is a string representing the type of Dom element this represents
   * @param {Object|null} [options=null]
   * @returns {PseudoHTMLElement}
   */
  public createElement (tagName: string = 'div', options: object | null = null): PseudoHTMLElement {
    const returnElement = new PseudoHTMLElement({ tagName })
    returnElement.parent = this
    return returnElement
  }

  createElementNS () {

  }

  createEvent () {

  }

  createNodeIterator () {

  }

  createProcessingInstruction () {

  }

  createRange () {

  }

  createTextNode () {

  }

  createTouch () {

  }

  createTouchList () {

  }

  createTreeWalker () {

  }

  elementFromPoint () {

  }

  elementsFromPoint () {

  }

  enableStyleSheetsForSet () {

  }

  exitFullscreen () {

  }

  exitPictureInPicture () {

  }

  exitPointerLock () {

  }

  getAnimations () {

  }

  getBoxQuads () {

  }

  getElementById () {

  }

  getElementsByClassName () {

  }

  getElementsByTagName () {

  }

  getElementsByTagNameNS () {

  }

  getSelection () {

  }

  hasStorageAccess () {

  }

  importNode () {

  }

  mozSetImageElement () {

  }

  prepend () {

  }

  querySelector () {

  }

  querySelectorAll () {

  }

  releaseCapture () {

  }

  releaseEvents () {

  }

  replaceChildren () {

  }

  requestStorageAccess () {

  }

  requestStorageAccessFor () {

  }

  startViewTransition () {

  }

  createExpression () {

  }

  createNSResolver () {

  }

  evaluate () {

  }
}

export default PseudoDocument
