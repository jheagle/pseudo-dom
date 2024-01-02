import PseudoNode from './PseudoNode'
import PseudoElement from './PseudoElement'

class PseudoCharacterData extends PseudoNode {
  public data: string
  public readonly length: number
  public readonly nextElementSibling: PseudoElement
  public readonly previousElementSibling: PseudoElement

  public after (...nodes: PseudoNode[]): void {

  }

  public appendData (data: any): void {

  }

  public before (...nodes: PseudoNode[]): void {

  }

  public deleteData (offset: number, count: number): void {

  }

  public insertData (offset: number, data: any): void {

  }

  public remove (): void {

  }

  public replaceData (offset: number, count: number, data: any): void {

  }

  public replaceWith (...nodes: PseudoNode[]): void {

  }

  public substringData (offset: number, count: number): string {
    // TODO use the offset and count the retrieve a substring
    return this.data
  }
}

export default PseudoCharacterData
