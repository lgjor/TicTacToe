
// Objeto para simular um enum, prevenindo modificação acidental dos valores
export const Status = Object.freeze({
  PLAYING: 'PLAYING',
  DRAW:    'DRAW',
  WIN_P:   'WIN_P',
  WIN_C:   'WIN_C'
});

export class Game {
  // Propriedades privadas para encapsular o estado do jogo
  #board;
  #status;
  #turn;
  #difficulty;

  constructor(humanPlayer = 'P', aiPlayer = 'C', difficulty = 'hard') {
    this.humanPlayer = humanPlayer;
    this.aiPlayer    = aiPlayer;
    this.#difficulty = difficulty;
    this.reset();
  }

  // Getters para expor o estado de forma segura (somente leitura)
  get board() {
    return this.#board;
  }

  get status() {
    return this.#status;
  }

  get isPlayerTurn() {
    return this.#turn === this.humanPlayer && this.#status === Status.PLAYING;
  }

  // --- MÉTODOS PÚBLICOS (Interface da classe) ---

  /**
   * Define o nível de dificuldade da IA.
   * @param {'easy' | 'normal' | 'hard'} level - O nível de dificuldade.
   */
  setDifficulty(level) {
    this.#difficulty = level;
  }

  reset() {
    this.#board = Array.from(Array(9).keys()); // [0, 1, 2, 3, 4, 5, 6, 7, 8]
    this.#status = Status.PLAYING;
    // O jogador humano sempre começa
    this.#turn = this.humanPlayer;
  }

  /**
   * Processa a jogada do jogador.
   * Retorna true se a jogada foi válida, false caso contrário.
   */
  playerMove(index) {
    // Impede a jogada se não for a vez do jogador, o jogo acabou, ou a célula está ocupada
    if (!this.isPlayerTurn || typeof this.#board[index] !== 'number') {
      return false;
    }

    this.#board[index] = this.humanPlayer;
    this.#status = this.#checkWin(this.#board);
    if (this.#status === Status.PLAYING) {
      this.#turn = this.aiPlayer; // Passa a vez para a IA
    }
    return true;
  }

  /**
   * Calcula e executa a jogada da IA.
   * Retorna o índice da célula onde a IA jogou, ou undefined se não puder jogar.
   */
  aiMove() {
    if (this.isPlayerTurn || this.#status !== Status.PLAYING) {
      return undefined;
    }

    const availableMoves = this.#getAvailableMoves(this.#board);
    if (availableMoves.length === 0) return undefined;

    let moveIndex;

    switch (this.#difficulty) {
      case 'easy': {
        // Escolhe uma jogada aleatória das disponíveis
        moveIndex = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        break;
      }
      case 'normal': {
        // Minimax com profundidade limitada a 2
        const depth = Math.min(2, availableMoves.length);
        const move = this.#minimax(this.#board, this.aiPlayer, depth);
        if (move) moveIndex = move.index;
        break;
      }
      case 'hard':
      default: {
        // Minimax com profundidade máxima (invencível)
        const depth = availableMoves.length;
        const move = this.#minimax(this.#board, this.aiPlayer, depth);
        if (move) moveIndex = move.index;
        break;
      }
    }

    if (typeof moveIndex === 'number') {
      this.#board[moveIndex] = this.aiPlayer;
      this.#status = this.#checkWin(this.#board);
      if (this.#status === Status.PLAYING) {
        this.#turn = this.humanPlayer; // Devolve a vez para o jogador
      }
      return moveIndex;
    }
    return undefined;
  }

  // --- MÉTODOS PRIVADOS (Lógica interna do jogo) ---

  #getAvailableMoves(board) {
    return board.filter(s => typeof s === 'number');
  }

  #checkWin(board) {
    const wins = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
      [0, 4, 8], [2, 4, 6]             // Diagonais
    ];

    for (const [a, b, c] of wins) {
      if (board[a] === board[b] && board[a] === board[c]) {
        if (board[a] === this.humanPlayer) return Status.WIN_P;
        if (board[a] === this.aiPlayer) return Status.WIN_C;
      }
    }

    return this.#getAvailableMoves(board).length === 0
      ? Status.DRAW
      : Status.PLAYING;
  }

  #minimax(board, player, depth) {
    const availableMoves = this.#getAvailableMoves(board);
    const currentState = this.#checkWin(board);

    if (depth === 0 || currentState !== Status.PLAYING) {
      if (currentState === Status.WIN_C) return { score: 10 };
      if (currentState === Status.WIN_P) return { score: -10 };
      return { score: 0 };
    }

    const moves = [];
    for (const index of availableMoves) {
      const move = { index };
      // Cria uma cópia do tabuleiro para não modificar o original durante a recursão
      const nextBoard = board.slice();
      nextBoard[index] = player;

      const nextPlayer = (player === this.aiPlayer) ? this.humanPlayer : this.aiPlayer;
      const result = this.#minimax(nextBoard, nextPlayer, depth - 1);
      move.score = result.score;

      moves.push(move);
    }

    let bestMove;
    if (player === this.aiPlayer) {
      let bestScore = -Infinity;
      for (const move of moves) {
        if (move.score > bestScore) {
          bestScore = move.score;
          bestMove = move;
        }
      }
    } else {
      let bestScore = Infinity;
      for (const move of moves) {
        if (move.score < bestScore) {
          bestScore = move.score;
          bestMove = move;
        }
      }
    }
    return bestMove;
  }
}