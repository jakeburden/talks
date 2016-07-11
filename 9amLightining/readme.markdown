# sever-side rendering
# with client-side handoff
# in Node.js

---

# require('http')

- issues a new request and response object for every client
- req and res are streams
- streams are async

---

# require('fs')

- filesystem
- has sync and async filesystem methods
- fs.createReadStream / fs.createWriteStream

---

# require('url')

- parse the requested url
- passing 'true' to url.parse returns a parsed object

```js
url.parse('/?time=33', true).query.time
// => 33
```

---

# require('trumpet')

- npm i trumpet
- operate on DOM elements with Node.js

```js
const tr = trumpet()
const title = tr.select('.title').createWriteStream()
title.end('Title set with Node.js')

// => '<p class="title">Title set with Node.js</p>'
```

---

# server

## modules

```js
const http = require('http')
const fs = require('fs')
const url = require('url')

const trumpet = require('trumpet')
```

---

# server

## http server

```js
http.createServer((req, res) => {
  const p = url.parse(req.url, true)
  const html = fs.createReadStream('index.html')
```

---

# server

## routing

```js
if (req.url.startsWith('/?time')) {
  const tr = trumpet()
  const time = tr.select('.time').createWriteStream()
  time.end(p.query.time)

  html.pipe(tr).pipe(res)
}

if (req.url === '/') html.pipe(res)
if (req.url === '/browser.js') fs.createReadStream('browser.js').pipe(res)
```
---

# server

## listen

```js
}).listen(9090, () => {
  console.log('server running on http://localhost:9090')
})
```

---

# server

full code:

```js
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
```

---

# browser
### not much going on, one slide

```js
const ui = {
  time: document.querySelector('.time')
}

let time = 0

if (ui.time.textContent) {
  time = Number(ui.time.innerHTML)
}

update()
setInterval(update, 1000)

function update () {
  ui.time.innerHTML = time
  time += 1
}
```

---

# how to use this awesome app

- going to localhost:9090
-- starts counter at 0

- going to localhost:9090/?time=1000
-- starts count at 1000

---
