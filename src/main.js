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
let gameLevel;
let isGameLevel = false, isColorChosen = false;

document.addEventListener('DOMContentLoaded', () => {
  const introText = document.querySelector('.app > p')
  const options   = document.querySelector('.options')
  const dotsWhite = document.querySelector('.dots')
  const dotsBlack = document.querySelector('.dots2')
  const cells     = document.querySelectorAll('.cell')
  const btnPlay   = document.querySelector('.modal-btn')  // se existir
  const pChooseLevel = document.getElementById('chooseLevel')
  document.querySelectorAll('.level').forEach(level => {  // busca os levels
    level.addEventListener('click', (e) => {
      chooseLevel(e.target.textContent)
    })
  })

  // eventos iniciais
  dotsWhite.addEventListener('click', () => chooseColor(true))
  dotsBlack.addEventListener('click', () => chooseColor(false))
  cells.forEach(cell => cell.addEventListener('click', onCellClick))

  // reinicia o jogo ao clicar em "Play Again"
  if (btnPlay) {
    btnPlay.addEventListener('click', () => {
      resetGame();
    })
  }

  function chooseColor(humanIsWhite) {
    huColor = humanIsWhite ? 'white' : '#333'
    aiColor = humanIsWhite ? '#333'  : 'white'
    introText.style.visibility = 'hidden'
    options.style.visibility   = 'hidden'
    isColorChosen = true;
    if (isGameLevel) startGame();
  }

  function chooseLevel(level) {
    gameLevel = level;
    isGameLevel = true;
    pChooseLevel.innerText = `Level selected: ${level}`;

    const levels = document.querySelectorAll('.level');
    levels.forEach(l => {
      if (l.textContent !== level) {
        l.style.display = 'none';
      } else {
        l.style.backgroundColor = l.textContent === level ? '#f7aeb7' : '';
      }
    });
    if (isColorChosen) startGame();
  }

  function resetGame() {
    // Reseta o estado do jogo
    isColorChosen = false;
    isGameLevel = false;
    board = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    // Reseta a UI para o estado inicial
    pChooseLevel.innerText = 'Select level';
    introText.style.visibility = 'visible';
    options.style.visibility = 'visible';

    document.querySelectorAll('.level').forEach(l => {
      l.style.display = 'block';
      l.style.backgroundColor = '';
    });

    resetUI(); // Limpa o conteúdo das células e esconde o modal de fim de jogo
  }

  function startGame() {
     if (!isGameLevel || !isColorChosen) return;
      board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      renderBoard(board, { P: huColor, C: aiColor });
  }  

  function onCellClick(e) {
    // Impede o clique se o jogo não começou (cor e nível não escolhidos)
    if (!isGameLevel || !isColorChosen) return;

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
          let aiIdx;
          if (gameLevel === 'easy') {
              // Jogada aleatória para o nível fácil
              const availableMoves = board.filter(s => typeof s === 'number');
              aiIdx = availableMoves[Math.floor(Math.random() * availableMoves.length)];
          } else {
              let depth;
              if (gameLevel === 'normal') {
                  depth = 2;
              } else {
                  depth = 9;  // Profundidade máxima para o nível difícil (ou qualquer valor padrão)
              }
              const { index } = minimax(
                  board,
                  aiPlayer,
                  aiPlayer,
                  humanPlayer,
                  depth
              );
              aiIdx = index;
          }
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