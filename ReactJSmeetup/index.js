const React = require('react')
const ReactDOM = require('react-dom')

const level = require('level')
const hyperlog = require('hyperlog')
const wswarm = require('webrtc-swarm')
const signalhub = require('signalhub')
const concat = require('concat-stream')

const hubs = ['192.168.1.133:9091']
const swarm = wswarm(signalhub('react', hubs))
const db = level('db')
const log = hyperlog(db, {
  valueEncoding: 'json'
})

const state = {
  reweets: []
}

read()
log.on('add', read)

swarm.on('peer', peer => {
 const replicate = log.replicate({
   live: true
 })
 
 peer.pipe(replicate).pipe(peer)
})

function read () {
  const stream = log.createReadStream()
  stream.pipe(concat(body => {
    state.reweets = body
    ReactDOM.render(render(state), document.getElementById('app'))
  }))
}

function render (state) {
  
  const app = <section>
    <h1>reweets</h1>
    <form onSubmit={publish}>
      <input type='text' name='reweet' placeholder='compose reweet' />
      <button type='submit'>publish</button>
    </form>
    <ul>
      {state.reweets.map(reweet => {
        return <li>{reweet.value}</li> 
      })}
    </ul>
  </section>
  
  return app

  function publish (e) {
    e.preventDefault()
    log.append(document.querySelector('input').value, err => {
      if (err) console.error(err)
    })
  }

}

