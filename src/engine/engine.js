
// TODO: Implement the getAvailableMoves function
// This function should return an array of available moves on the board.
function getAvailableMoves(reboard){
    return reboard.filter(s => s != "P" && s != "C");
}

// TODO: Implement the makeMove function
// This function should update the board with the player's move.
export function makeMove(element, player, color) {
  console.log("element"+ element.id);
}

// TODO: Implement the checkWin function
// This function should check the board for a win condition.
// checkWin(board) → retorna Status.PLAYING | DRAW | WIN_X | WIN_O
// This function checks the current state of the board to determine if there is a winner or if the game is a draw.
// It should return one of the following statuses: Status.PLAYING, Status.DRAW,
function checkWin(board) {}

// TODO: Implement the minimax function
// This function should implement the Minimax algorithm to determine the best move for the AI player.
function minimax(board, player){}

function reset(){
  round = 0;
  resetUI();
}
