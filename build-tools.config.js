module.exports = {
  browser: {
    name: 'pseudo-dom'
  },
  readme: {
    from: 'dist/**/!(*.min).js'
  },
  typescript: {
    config: 'tsconfig.json',
    enabled: true
  }
}
