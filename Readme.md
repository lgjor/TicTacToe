# Tic tac toe - Jogo da velha

Segue um roteiro de alto nível, em etapas bem definidas, para você evoluir o seu engine.js (e o jogo como um todo). Você fica responsável por codificar; aqui ficam apenas os “marcos” e dependências entre eles.

## Organização de Módulos

a) engine.js
• Estado do tabuleiro (board) e funções puras de lógica:
(X) getAvailableMoves(board)
– makeMove(board, index, player)
– checkWin(board) → retorna Status.PLAYING | DRAW | WIN_X | WIN_O
• Implementação do Minimax:
– minimax(board, player) → { index, score }

b) main.js
(X)  Inicializa variáveis globais (players, cores, turno atual)
(X) Conecta handlers de clique a células e botões de opção de cor
• Controla o fluxo: após jogada humana chama Minimax + atualiza tabuleiro
• Lida com fim de jogo (exibe mensagem e bloqueia cliques)

c) renderer.js (ou helpers em main.js)
• renderBoard(board) → atualiza DOM (texto, cores, classes .win)
• showMessage(texto) / hideMessage() → exibição de overlay ou alert
• resetUI() → limpa células, esconde mensagens, reativa cliques

## Fluxo Básico de Jogo

Player escolhe cor (white/black) → esconde opções e ativa tabuleiro
Apresenta turno humano (se “X” começa)
onCellClick → chama tryHumanMove(index)
• Se jogada válida:
– atualiza estado (makeMove)
– renderiza (renderBoard)
– verifica checkWin → se fim, aborta e exibe resultado
– senão chama computerTurn()
computerTurn() → chama minimax, faz makeMove, renderiza, verifica fim
Etapas de Implementação

## Etapa 1: Funções de jogo pura

Implementar e testar em console:
• getAvailableMoves
• makeMove (imutável ou mutável, mas consistente)
• checkWin (verifica linhas, colunas, diagonais)
Cobrir casos de empate e vitória de cada lado

## Etapa 2: Fluxo de turnos no main.js

Escrever move(cellElement, player, color) que:
• lê cellElement.id
• chama makeMove no board
• pinta a célula com color e insere símbolo (X/O)
• retorna status do jogo
Controlar alternância entre humanPlayer e aiPlayer

## Etapa 3: Integração do Minimax

Escrever função minimax(board, player) recursively:
• condição de parada: checkWin ou sem movimentos
• loop em getAvailableMoves
• simula makeMove, chama recursivamente, coleta score
• devolve { index, score } ótimo para o jogador atual
Testar no console: garantir que AI nunca perca
Etapa 4: Renderização e UI

Refatorar initializeGameHandlers para usar renderBoard e showMessage
Escrever renderBoard(board) que percorre array e atualiza cada <td>
Criar overlay/modal simples para mensagem de vitória/derrota/empate
Botão “Reiniciar” → limpa estado e UI, volta ao início

## Etapa 5: Refinamentos e extras

Placar (wins, losses, draws)
Níveis de dificuldade:
• Fácil → AI move random
• Médio → Minimax limitado a profundidade 2
• Difícil → Minimax completo
Animações CSS nas células vencedoras (.win com keyframes)
Undo de último movimento
Suporte a teclado (setas + Enter)
Dependências e Priorização
• Antes de Minimax, garanta que o fluxo humano → render → checkWin funcione 100%.
• Somente após checkWin robusto, passe para AI básica (random).
• Só então evolua para Minimax (assegura jogo sempre empatável ou vitória da AI).
• Por fim, trabalhe em usabilidade (mensagens, placar, animações).

Com este plano você consegue atacar cada bloco de funcionalidade de forma incremental e testável. Bom desenvolvimento!