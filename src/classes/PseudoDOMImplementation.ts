import PseudoHTMLDocument from './PseudoHTMLDocument'
import PseudoXMLDocument from './PseudoXMLDocument'
import PseudoNode from './PseudoNode'

export interface PseudoDocumentTypeInterface {
  readonly name: string
  readonly publicId: string
  readonly systemId: string

  after (...params: Array<PseudoNode | string>): undefined

  before (...params: Array<PseudoNode | string>): undefined

  remove (): undefined

  replaceWith (...nodes: PseudoNode[]): undefined
}

class PseudoDOMImplementation {
  createDocument (namespaceURI: string, qualifiedNameStr: string, documentType: PseudoDocumentTypeInterface | null = null): PseudoXMLDocument {
    return new PseudoXMLDocument()
  }

  createDocumentType (qualifiedNameStr: string, publicId: string, systemId: string): PseudoDocumentTypeInterface {
    class PseudoDocumentType extends PseudoNode implements PseudoDocumentTypeInterface {
      public readonly name: string = qualifiedNameStr
      public readonly publicId: string = publicId
      readonly systemId: string = systemId

      public after (...params: Array<PseudoNode | string>): undefined {

      }

      public before (...params: Array<PseudoNode | string>): undefined {

      }

      public remove (): undefined {

      }

      public replaceWith (...nodes: PseudoNode[]): undefined {
        // can throw new PseudoDOMException('PseudoDocumentType.replaceWith: Cannot insert a DocumentType as a child of a DocumentFragment', 'HierarchyRequestError') when node cannot be placed here
      }
    }

    return new PseudoDocumentType()
  }

  createHTMLDocument (title: string = ''): PseudoHTMLDocument {
    return new PseudoHTMLDocument()
  }
}

export default PseudoDOMImplementation
