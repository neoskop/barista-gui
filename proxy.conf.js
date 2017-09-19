module.exports = {
  '/_api/': {
    target: 'http://localhost:51966'
  },
  '/*/s/**.json': {
    target: 'http://localhost:51966'
  }
}
