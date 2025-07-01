import {
  Status,
  makeMove,
  checkWin,
  minimax
} from './engine/engine.js'
import { renderBoard, showMessage, hideMessage, resetUI } from './ui/renderer.js'

let board;
const humanPlayer = 'P';
const aiPlayer    = 'C';
const AI_DELAY    = 500;
let huColor, aiColor;

document.addEventListener('DOMContentLoaded', () => {
  const introText = document.querySelector('.app > p')
  const options   = document.querySelector('.options')
  const dotsWhite = document.querySelector('.dots')
  const dotsBlack = document.querySelector('.dots2')
  const cells     = document.querySelectorAll('.cell')
  const btnPlay   = document.querySelector('.modal-btn')  // se existir

  // eventos iniciais
  dotsWhite.addEventListener('click', () => chooseColor(true))
  dotsBlack.addEventListener('click', () => chooseColor(false))
  cells.forEach(cell => cell.addEventListener('click', onCellClick))

  // reinicia o jogo ao clicar em "Play Again"
  if (btnPlay) {
    btnPlay.addEventListener('click', () => {
      hideMessage();
      startGame();
    })
  }

  function chooseColor(humanIsWhite) {
    huColor = humanIsWhite ? 'white' : '#333'
    aiColor = humanIsWhite ? '#333'  : 'white'
    introText.style.visibility = 'hidden'
    options.style.visibility   = 'hidden'
    cells.forEach(td => td.style.visibility = 'visible')
    startGame()
  }

  function startGame() {
    board = [0,1,2,3,4,5,6,7,8];
    resetUI();
    renderBoard(board, { P: huColor, C: aiColor });
  }

  

  function onCellClick(e) {
    const idx = Number(e.currentTarget.id);

    // 1) bloqueia célula ocupada
    if (typeof board[idx] !== 'number') return;

    // 2) tenta a jogada humana
    const statusH = humanMove(idx);
    if (statusH == null) return;   // jogada inválida → sem nada

    if (statusH !== Status.PLAYING) return;   // vitória/empate no humano

    // 3) faz a IA jogar
    aiMove();
  }

  function humanMove(idx) {
    board = makeMove(board, idx, humanPlayer);
    renderBoard(board, { P: huColor, C: aiColor });

    const status = checkWin(board);
    if (status !== Status.PLAYING) {
      endGame(status);
    }
    return status;
  }

  function aiMove() {
    setTimeout(() => {
      const { index: aiIdx } = minimax(
        board,
        aiPlayer,
        aiPlayer,
        humanPlayer
      )
      board = makeMove(board, aiIdx, aiPlayer);
      renderBoard(board, { P: huColor, C: aiColor });

      const status = checkWin(board);
      if (status !== Status.PLAYING) {
        endGame(status);
      }
    }, AI_DELAY)
  }

  function endGame(status) {
  let msg = '';
  switch (status) {
    case Status.DRAW:
      msg = '⏳ Empate!';
      break;
    case Status.WIN_P:
      msg = '🎉 Você venceu!';
      break;
    case Status.WIN_C:
      msg = '💥 A IA venceu!';
      break;
    default:
      console.warn('status inesperado', status);
      return;
  }
  showMessage(msg);
}
})