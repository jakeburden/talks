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
