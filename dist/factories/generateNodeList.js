'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
const PseudoNodeList_1 = require('../classes/PseudoNodeList')
/**
 * Create a PseudoNodeList, optionally starting from an existing chain of linkers.
 * @param innerList
 */
const generateNodeList = (innerList = null) => new PseudoNodeList_1.PseudoNodeList().initialize(innerList)
exports.default = generateNodeList
