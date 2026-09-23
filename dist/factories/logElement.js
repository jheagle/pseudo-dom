'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
/**
 * @file Prints an element (or any node) to the console, readably - the point of pseudo-dom running headlessly is
 * usually to watch what code does to a tree without a real browser to look at.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
const serializeHTML_1 = require('./serializeHTML')
/**
 * Print a node's markup to the console, indented for readability (see prettyPrint).
 * @memberOf module:factories
 * @param {*} node
 * @param {string} [label=''] A label printed above the markup, to identify this log call
 * @returns {undefined}
 */
const logElement = (node, label = '') => {
  console.log(`${label ? `${label}\n` : ''}${(0, serializeHTML_1.prettyPrint)(node)}`)
}
exports.default = logElement
