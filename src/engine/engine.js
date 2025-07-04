
// Objeto para simular um enum, prevenindo modificação acidental dos valores
export const Status = Object.freeze({
  PLAYING: 'PLAYING',
  DRAW:    'DRAW',
  WIN_P:   'WIN_P',
  WIN_C:   'WIN_C'
})

export class Game {
  constructor(humanPlayer = 'X', aiPlayer = 'O') {
    this.humanPlayer = humanPlayer;
    this.aiPlayer    = aiPlayer;
    this.reset();
  }
}

// This function should return an array of available moves on the board.
export function getAvailableMoves(reboard){
    return reboard.filter(s => s != "P" && s != "C");
}

// retorna um novo board com a jogada aplicada
export function makeMove(board, index, player) {
  if (typeof board[index] !== 'number') return board
  const next = board.slice();
  next[index] = player;
  return next;
}

// checa linhas/colunas/diagonais por vitória ou empate
export function checkWin(board) {
  const wins = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ]
  for (const [a,b,c] of wins) {
    const cell = board[a];
    if ((cell === 'P' || cell === 'C')
     && cell === board[b]
     && cell === board[c]
    ) {
      return cell === 'P'
        ? Status.WIN_P
        : Status.WIN_C;
    }
  }
  return getAvailableMoves(board).length === 0
    ? Status.DRAW
    : Status.PLAYING;
}

// Minimax puro. player = quem fará o próximo nó.
// aiPlayer, humanPlayer são passados para pontuar corretamente
export function minimax(board, player, aiPlayer, humanPlayer, depth) {
  const avail = getAvailableMoves(board);
  const state = checkWin(board);

  // Condição de parada: profundidade atingida ou fim de jogo
  if (depth === 0 || state !== Status.PLAYING) {
    // pontuação SEM depender de `player`
    if (state === Status.WIN_C) return { score: +10 }
    if (state === Status.WIN_P) return { score: -10 }
    return { score: 0 };
  }

  const moves = []
  for (const idx of avail) {
    const move = { index: idx };
    board[idx] = player;

    const nextPlayer = player === aiPlayer ? humanPlayer : aiPlayer;
    const result     = minimax(board, nextPlayer, aiPlayer, humanPlayer, depth - 1);
    move.score       = result.score;

    board[idx] = move.index;
    moves.push(move);
  }

  let bestMove
  if (player === aiPlayer) {
    let bestScore = -Infinity;
    for (const m of moves) {
      if (m.score > bestScore) {
        bestScore = m.score;
        bestMove  = m;
      }
    }
  } else {
    let bestScore = +Infinity
    for (const m of moves) {
      if (m.score < bestScore) {
        bestScore = m.score;
        bestMove  = m;
      }
    }
  }
  return bestMove;
}