const http = require('http')
const fs = require('fs')
const url = require('url')

const trumpet = require('trumpet')

http.createServer((req, res) => {
  const p = url.parse(req.url, true)
  const html = fs.createReadStream('index.html')

  if (req.url.startsWith('/?time')) {
    const tr = trumpet()
    const time = tr.select('.time').createWriteStream()
    time.end(p.query.time)

    html.pipe(tr).pipe(res)
  }

  if (req.url === '/') html.pipe(res)
  if (req.url === '/browser.js') fs.createReadStream('browser.js').pipe(res)

}).listen(9090, () => {
  console.log('server running on http://localhost:9090')
})
