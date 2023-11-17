"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/esnext.async-iterator.map.js");
require("core-js/modules/esnext.iterator.map.js");
require("core-js/modules/esnext.async-iterator.for-each.js");
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.for-each.js");
/**
 * @file Substitute for the NodeList interface.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
class PseudoNodeList {
  #innerList = [];
  #initialized = false;
  initialize() {
    let innerList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    if (this.#initialized) {
      return this;
    }
    this.#innerList = innerList;
    this.#initialized = true;
    return this;
  }
  get length() {
    return this.#innerList.length;
  }
  get entries() {
    return Array.from(this);
  }
  get keys() {
    return Array.from(this.#innerList).keys;
  }
  get values() {
    return Array.from(this.#innerList).map(item => item.data).values;
  }
  item(index) {
    return this.#innerList.item(index);
  }
  forEach(callback) {
    return Array.from(this.#innerList).map(item => item.data).forEach(callback);
  }
  [Symbol.iterator]() {
    let current = this.#innerList.first;
    return {
      next: () => {
        const result = {
          value: current ? current.data : null,
          done: !current
        };
        current = current ? current.next : null;
        return result;
      }
    };
  }
}
var _default = exports.default = PseudoNodeList;