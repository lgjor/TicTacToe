import { makeMove} from './engine/engine.js';

// Function that will be executed when HTML and the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeGameHandlers);

/**
 * @function initializeGameHandlers
 * @description Configura todos os manipuladores de eventos para as interações do jogo
 * assim que o documento estiver pronto.
 */
function initializeGameHandlers() {
    // Seleciona o botão de escolha do jogador "white"
    const dotsButton = document.querySelector(".dots");
    if (dotsButton) {
        dotsButton.addEventListener("click", function() {
            // Esconde as opções iniciais e o texto introdutório
            document.querySelectorAll(".options, p").forEach(element => {
                element.style.visibility = "hidden";
            });
            // Torna as células do tabuleiro visíveis para o jogo começar
            document.querySelectorAll("td").forEach(td => {
                td.style.visibility = "visible";
            });

            // Define as cores para o jogador da IA e para o jogador humano
            aiColor = "#333"; // Cor da IA (provavelmente preto ou cinza escuro)
            huColor = "white"; // Cor do jogador humano
            console.log("Player humano escolheu ser 'white'. Cores definidas.");
        });
    }

    // Seleciona o botão de escolha do jogador "black"
    const dots2Button = document.querySelector(".dots2");
    if (dots2Button) {
        dots2Button.addEventListener("click", function() {
            // Esconde as opções iniciais e o texto introdutório
            document.querySelectorAll(".options, p").forEach(element => {
                element.style.visibility = "hidden";
            });
            // Torna as células do tabuleiro visíveis para o jogo começar
            document.querySelectorAll("td").forEach(td => {
                td.style.visibility = "visible";
            });

            // Assume que as cores padrão (ou as já definidas globalmente) serão usadas.
            console.log("Player humano escolheu ser 'black'. Cores padrão ou pré-definidas em uso.");
        });
    }

    // Adiciona o manipulador de cliques a todas as células do tabuleiro (td)
    const gameCells = document.querySelectorAll("td");
    gameCells.forEach(cell => {
        cell.addEventListener("click", function() {
            // Chama a função 'move' para processar a jogada do jogador humano
            // 'this' refere-se à célula <td> que foi clicada
            makeMove(this, humanPlayer, huColor); // Use humanPlayer e huColor
            console.log("Célula do tabuleiro clicada. Tentando mover.");
        });
    });
}

// Inicializa variáveis globais (players, cores, turno atual)
let board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let humanPlayer = "P"; // Renomeado de huPlayer para humanPlayer para maior clareza
let aiPlayer = "C";
let iter = 0;
let round = 0;
let aiColor = "white"; // Renomeado de aiCo para aiColor
let huColor = "#333"; // Renomeado de huCo para huColor

// Objeto para simular um enum, prevenindo modificação acidental dos valores
const Status = Object.freeze({
    PLAYING: 'PLAYING',
    DRAW: 'DRAW',
    WIN_X: 'WIN_X',
    WIN_O: 'WIN_O'
});

