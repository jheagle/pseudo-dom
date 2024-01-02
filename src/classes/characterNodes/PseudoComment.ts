import PseudoCharacterData from '../PseudoCharacterData'

class PseudoComment extends PseudoCharacterData {
  public constructor (aString: string = '') {
    super()
    this.data = aString
  }
}

export default PseudoComment
