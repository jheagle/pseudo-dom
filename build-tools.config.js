module.exports = {
  // The name to use for the browser-bundled output file (.js will be appended).
  browserName: 'pseudo-dom',

  // Location of files to use for compiling documentation into the readme.
  readmeSearch: 'dist/**/!(*.min).js',

  // The path the tsconfig file for running typescript or false if no ts file given.
  useTsConfig: 'tsconfig.json'
}
