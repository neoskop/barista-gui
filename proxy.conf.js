module.exports = {
  '/_api/': {
    target: 'http://localhost:51966'
  },
  '/*/s/**': {
    target: 'http://localhost:51966'
  },
  '/events/': {
    target: 'http://localhost:51966',
    ws: true
  }
}
