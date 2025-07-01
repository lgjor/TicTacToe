// TODO: Implementar a função renderBoard
// Esta função deve atualizar a interface do usuário com base no estado atual do tabuleiro.
function renderBoard(board){}

// TODO: Implementar a função ShowMessage
// Esta função deve exibir uma mensagem na interface do usuário.
// Ela pode ser usada para mostrar mensagens de vitória, derrota ou empate.
function showMessage(texto){}

// Função reset
// Esta função deve redefinir a interface do usuário para o estado inicial.
function resetUI(){
  board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  $("td").css("background-color", "transparent");
}