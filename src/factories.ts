/**
 * @file All of the Pseudo Dom Helper functions for generating DOM objects.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import generateNode from './factories/generateNode'
import generateNodeList from './factories/generateNodeList'

export default {
  generateNode,
  nodeListFactory: generateNodeList
}
