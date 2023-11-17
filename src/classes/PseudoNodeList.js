/**
 * @file Substitute for the NodeList interface.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
class PseudoNodeList {
  #innerList = []
  #initialized = false

  initialize (innerList = []) {
    if (this.#initialized) {
      return this
    }
    this.#innerList = innerList
    this.#initialized = true
    return this
  }

  get length () {
    return this.#innerList.length
  }

  get entries () {
    return Array.from(this)
  }

  get keys () {
    return Array.from(this.#innerList).keys
  }

  get values () {
    return Array.from(this.#innerList).map(item => item.data).values
  }

  item (index) {
    return this.#innerList.item(index)
  }

  forEach (callback) {
    return Array.from(this.#innerList).map(item => item.data).forEach(callback)
  }

  [Symbol.iterator] () {
    let current = this.#innerList.first
    return {
      next: () => {
        const result = { value: (current ? current.data : null), done: !current }
        current = (current ? current.next : null)
        return result
      }
    }
  }
}

export default PseudoNodeList
