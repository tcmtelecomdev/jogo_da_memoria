// Constantes para representar as classes CSS dos elementos do jogo
const FRONT = "card_front"; // Classe CSS para a face frontal da carta
const BACK = "card_back";   // Classe CSS para a face traseira da carta
const CARD = "card";        // Classe CSS para o elemento carta
const ICON = "icon";        // Classe CSS para o ícone da carta

// Selecionando os elementos relevantes do HTML
const cardClick = document.getElementById("card-click"); // Som ao clicar em uma carta
const cardCheck = document.getElementById("card-check"); // Som de verificação de par
const cardWin = document.getElementById("card-win");     // Som de vitória
const cardStart = document.getElementById("card-start"); // Som de início do jogo

// Função para iniciar o jogo
function startGame() {
  // Esconde a tela de início do jogo
  let gameStartLayer = document.getElementById("gameStart");
  gameStartLayer.style.display = "none";

  // ✅ Limpa o tabuleiro antes de criar novas cartas
  document.getElementById("gameBoard").innerHTML = "";

  // Inicia a trilha sonora do jogo
  cardStart.play();

  // Funções relacionadas ao tempo do jogo
  stopTime();         // Para o tempo
  verificarLocalStorage(); // Verifica se há registros no armazenamento local
  startTime();        // Inicia o tempo

  // Inicializa as cartas do jogo
  initializeCards(game.createCardsFromTechs()); // Cria e exibe as cartas
}

// Função para inicializar as cartas do jogo
function initializeCards(cards) {
  let gameBoard = document.getElementById("gameBoard"); // Elemento contendo as cartas
  gameBoard.innerHTML = ""; // Limpa o conteúdo existente

  // Para cada carta, cria um elemento HTML correspondente
  game.cards.forEach((card) => {
    let cardElement = document.createElement("div"); // Cria um elemento de carta
    cardElement.id = card.id;                        // Define um ID único para a carta
    cardElement.classList.add(CARD);                 // Adiciona a classe CSS "card"
    cardElement.dataset.icon = card.icon;            // Define o ícone da carta

    // Adiciona uma classe "flip" às cartas, para animação
    setTimeout(() => {
      cardElement.classList.add("flip"); // Adiciona a classe de virada para animação
    }, 300);
    setTimeout(() => {
      cardElement.classList.remove("flip"); // Remove a classe de virada após um tempo
    }, 2000);

    // Cria o conteúdo da carta (frente e verso)
    createCardContent(card, cardElement); // Cria o conteúdo da carta
    cardElement.addEventListener("click", flipCard); // Adiciona evento de clique
    gameBoard.appendChild(cardElement); // Adiciona a carta ao tabuleiro
  });
}

// Função para criar o conteúdo de uma carta
function createCardContent(card, cardElement) {
  createCardFace(FRONT, card, cardElement); // Cria a face frontal da carta
  createCardFace(BACK, card, cardElement);  // Cria a face traseira da carta
}

// Função para criar a face de uma carta (frente ou verso)
function createCardFace(face, card, element) {
  let cardElementFace = document.createElement("div"); // Cria um elemento para a face da carta
  cardElementFace.classList.add(face);                // Adiciona a classe correspondente (frente ou verso)
  if (face === FRONT) {
    // Se a face for a frente da carta, cria e adiciona a imagem do ícone
    let iconElement = document.createElement("img"); // Cria um elemento de imagem
    iconElement.classList.add(ICON);                 // Adiciona a classe de ícone
    iconElement.src = "./assets/img/" + card.icon + ".png"; // Define a fonte da imagem do ícone
    cardElementFace.appendChild(iconElement); // Adiciona o ícone à face da carta
  } else {
    // Se a face for o verso da carta, cria e adiciona a imagem padrão do verso
    let iconElement = document.createElement("img"); // Cria um elemento de imagem
    iconElement.classList.add(ICON);                 // Adiciona a classe de ícone
    iconElement.src = "./assets/img/card.png";       // Define a fonte da imagem do verso
    cardElementFace.appendChild(iconElement); // Adiciona o verso à face da carta
  }
  element.appendChild(cardElementFace); // Adiciona a face criada ao elemento da carta
}

// Função para virar uma carta ao clicar nela
function flipCard() {
  if (game.setCard(this.id)) { // Verifica se a carta pode ser virada
    this.classList.add("flip"); // Adiciona a classe de virada à carta
    cardClick.play();           // Toca o som de clique na carta

    if (game.secondCard) {
      if (game.checkMatch()) { // Verifica se as cartas viradas são iguais
        game.clearCards();     // Limpa as cartas viradas
        cardCheck.play();      // Toca o som de verificação de par

        if (game.checkGameOver()) {
          // Se o jogo acabou, exibe a tela de fim de jogo
          let gameOverLayer = document.getElementById("gameOver");
          gameOverLayer.style.display = "flex";

          // Toca o som de vitória e pausa o tempo
          cardWin.play();
          pauseTime();

          // Exibe o resultado do jogo
          let resultadoP = document.getElementById("resultado");
          resultadoP.innerHTML = `Parabéns! 🥳<br><br>Tempo de jogo ${calculateTime(time)} ⏱️`;

          // Compara o tempo atual com o recorde anterior
          compararTime(time);
          // Volta para tela inicial após 3 segundos
          setTimeout(() => {
            restart();
          }, 5000);
        }
      } else {
        // Se as cartas viradas não forem iguais, vira as cartas de volta após 1 segundo
        setTimeout(() => {
          let firstCardView = document.getElementById(game.firstCard.id);
          let secondCardView = document.getElementById(game.secondCard.id);

          firstCardView.classList.remove("flip");
          secondCardView.classList.remove("flip");
          game.unflipCards();
        }, 1000);
      }
    }
  }
}

// Função para reiniciar o jogo
function restart() {
  game.clearCards();          // Limpa as cartas
  compararTime(time);         // Atualiza o recorde se necessário
  pauseTime();                // Para o tempo atual
  stopTime();                 // Reseta o contador
  time = 0;                   // Zera a variável de tempo

  // Oculta a tela de game over
  let gameOverLayer = document.getElementById("gameOver");
  gameOverLayer.style.display = "none";

  // Exibe a tela inicial novamente
  let gameStartLayer = document.getElementById("gameStart");
  gameStartLayer.style.display = "flex";

  // ✅ Atualiza o recorde exibido na tela inicial
  verificarLocalStorage();

  // ✅ Limpa o tabuleiro de cartas
  document.getElementById("gameBoard").innerHTML = "";
}

// Funções relacionadas ao tempo do jogo
let interval;             // Variável para o intervalo de tempo
let time = 0;             // Tempo inicial
let timeP = document.getElementById("time"); // Elemento para exibir o tempo

function startTime() {
  let startTime = Date.now() - time; // Inicia o tempo de contagem a partir do tempo anterior
  interval = setInterval(() => {
    time = Date.now() - startTime; // Calcula o tempo decorrido
    timeP.textContent = calculateTime(time); // Atualiza o tempo exibido na tela
  }, 1000); // Atualiza a cada segundo
}

function pauseTime() {
  clearInterval(interval); // Pausa o intervalo de tempo
  timeP.textContent = calculateTime(time); // Atualiza o tempo exibido na tela
}

function stopTime() {
  time = 0; // Reseta o tempo para zero
  clearInterval(interval); // Para o intervalo de tempo
  timeP.textContent = "00:00"; // Reinicia o texto exibido na tela para zero
}

function calculateTime(time) {
  let totalSeconds = Math.floor(time / 1000); // Calcula o total de segundos
  let totalMinutes = Math.floor(totalSeconds / 60); // Calcula o total de minutos

  let displaySeconds = (totalSeconds % 60).toString().padStart(2, "0"); // Formata os segundos
  let displayMinutes = totalMinutes.toString().padStart(2, "0"); // Formata os minutos

  return `${displayMinutes}:${displaySeconds}`; // Retorna o tempo formatado como string
}

// Funções para verificar e comparar o tempo do jogo com o recorde armazenado
function verificarLocalStorage() {
  if (localStorage.length) {
    let timeStorage = localStorage.getItem("time"); // Obtém o tempo armazenado localmente
    let recorde = document.getElementById("recorde"); // Elemento para exibir o recorde
    recorde.textContent = timeStorage; // Exibe o recorde na tela
  } else {
    let recorde = document.getElementById("recorde"); // Elemento para exibir o recorde
    recorde.textContent = "00:00"; // Exibe zero se não houver recorde armazenado
  }
}

function compararTime(time) {
  const tempoAtual = calculateTime(time); // Ex: "00:05"
  const tempoSalvo = localStorage.getItem("time");

  const recorde = document.getElementById("recorde");

  if (!tempoSalvo) {
    // Primeiro recorde
    localStorage.setItem("time", tempoAtual);
    recorde.textContent = tempoAtual;
    return;
  }

  // Convertendo tempos para segundos
  const [minA, segA] = tempoAtual.split(":").map(Number);
  const [minB, segB] = tempoSalvo.split(":").map(Number);

  const segundosAtual = minA * 60 + segA;
  const segundosSalvo = minB * 60 + segB;

  // Salva o novo tempo se for menor
  if (segundosAtual < segundosSalvo) {
    localStorage.setItem("time", tempoAtual);
    recorde.textContent = tempoAtual;
  } else {
    recorde.textContent = tempoSalvo;
  }
}

// Função de inicialização quando a página é carregada
document.addEventListener("DOMContentLoaded", function () {
  verificarLocalStorage(); // ← exibe o tempo recorde salvo
});

document.getElementById("resetRecorde").addEventListener("click", function () {
  localStorage.removeItem("time");
  verificarLocalStorage(); // Atualiza a exibição do recorde
});

