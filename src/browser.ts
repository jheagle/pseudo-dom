/**
 * The browser bundle entry: the pseudoDom global holds everything once, by name.
 */

// `export *` re-exports every named export but never the default one, so the global does not hold everything a
// second time under `default` (browserify's standalone wrapper exposes module.exports as the global as it is).
export * from './main'
