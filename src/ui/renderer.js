// recebe um map de cores por símbolo: { P: humanColor, C: aiColor }
export function renderBoard(board, colors) {
  board.forEach((cell, idx) => {
    const td = document.getElementById(idx)
    td.style.backgroundColor = colors[cell] || 'transparent'
  })
}

export function showMessage(text) {
  const overlay = document.querySelector('.overlay')
  const title   = overlay.querySelector('.modal-title')
  title.textContent      = text
  overlay.classList.remove('hidden')
}

export function hideMessage() {
  const overlay = document.querySelector('.overlay')
  overlay.classList.add('hidden')
}

export function resetUI() {
  document.querySelectorAll('td').forEach(td => {
    td.style.backgroundColor = 'transparent'
  })
  // escondemos o overlay sempre que recomeçamos
  hideMessage()
}