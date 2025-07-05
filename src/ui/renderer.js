// recebe um map de cores por símbolo: { P: humanColor, C: aiColor }
export function renderBoard(board, colors) {
  const appContainer = document.querySelector('.app');
  const gameStarted = appContainer.classList.contains('game-started');

  board.forEach((cell, idx) => {
    const td = document.getElementById(idx)
    // Se a célula estiver ocupada, usa a cor do jogador.
    // Se estiver vazia, a cor de fundo depende se o jogo começou ou não.
    td.style.backgroundColor = colors[cell] || (gameStarted ? 'transparent' : 'white');
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
  const levels = document.querySelectorAll('.level');
      levels.forEach(l => {
          l.style.display = 'block';
          l.style.backgroundColor = '';
      });
  // escondemos o overlay sempre que recomeçamos
  hideMessage()
}