import { Game, Status } from './engine/engine.js'
import { renderBoard, showMessage, hideMessage, resetUI } from './ui/renderer.js'

const appContainer = document.querySelector('.app');
const game = new Game('P', 'C'); // Instância única do jogo
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
    game.setDifficulty(level.toLowerCase()); // Define a dificuldade na instância do jogo
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
    game.reset(); // Reseta o estado do jogo
    appContainer.classList.remove('game-started');
    isColorChosen = false;
    isGameLevel = false;

    // Reseta a UI para o estado inicial
    pChooseLevel.innerText = 'Select level';
    introText.style.visibility = 'visible';
    options.style.visibility = 'visible';

    document.body.style.pointerEvents = 'auto'; // Garante que os cliques estejam liberados
    resetUI(); // Limpa o modal de fim de jogo
    renderBoard(game.board, { P: huColor, C: aiColor }); // Limpa o tabuleiro
  }

  function startGame() {
     if (!isGameLevel || !isColorChosen) return;
     appContainer.classList.add('game-started');
      game.reset();
      renderBoard(game.board, { P: huColor, C: aiColor });
      hideMessage();
  }  

  function onCellClick(e) {
    // A classe Game já impede a jogada se não for a vez do jogador.
    // Apenas verificamos se o jogo já começou.
    if (!isGameLevel || !isColorChosen || game.status !== Status.PLAYING) return;

    const idx = Number(e.currentTarget.id);
    
    // 1. Tenta a jogada do jogador
    const madeMove = game.playerMove(idx); // Renomeado para consistência

    // Se a jogada não foi válida (célula ocupada ou não é a vez do jogador), não faz nada
    if (!madeMove) return;

    // 2. Atualiza a UI com a jogada do jogador
    renderBoard(game.board, { P: huColor, C: aiColor });

    // 3. Verifica o status do jogo após a jogada do jogador
    if (game.status !== Status.PLAYING) {
      endGame(game.status);
      return; // O jogo acabou, não chama a IA
    }

    // 4. Dispara a jogada da IA com um atraso
    triggerAiMove();
  }

  function triggerAiMove(){
    // Bloqueia a interface para impedir cliques enquanto a IA "pensa"
    document.body.style.pointerEvents = 'none';

    setTimeout(() => {
      // A classe Game agora lida com a dificuldade internamente.
      game.aiMove();
      renderBoard(game.board, { P: huColor, C: aiColor });
      document.body.style.pointerEvents = 'auto'; // Libera a interface
      const status = game.status;
      if (status !== Status.PLAYING) {
        endGame(status);
      }
    }, AI_DELAY);
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