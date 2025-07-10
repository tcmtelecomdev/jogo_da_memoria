// Objeto 'game' que contém todas as funcionalidades do jogo
let game = {
  // Lista de tecnologias (pares de cartas) disponíveis no jogo
  techs: [
    "tcm100rn",
    "800megas",
    "cameras",
    "globoplay",
    "premiere",
    "tcmmovel",
    "tcmtv",
    "telecine",
    "telefoniafixa",
    "wifiicon"
  ],
  
  // Array que armazenará todas as cartas do jogo
  cards: null,

  // Método para criar todas as cartas com base nas tecnologias disponíveis
  createCardsFromTechs: function () {
    // Inicializa o array de cartas
    this.cards = [];
    // Para cada tecnologia, cria um par de cartas e adiciona ao array de cartas
    this.techs.forEach((tech) => {
      this.cards.push(this.createPairFromTech(tech));
    });
    // Concatena os pares de cartas em um único array e embaralha
    this.cards = this.cards.flatMap((pair) => pair);
    this.shuffleCards();
    // Retorna todas as cartas criadas
    return this.cards;
  },

  // Método para criar um par de cartas com base em uma tecnologia
  createPairFromTech: function (tech) {
    // Retorna um array com duas cartas idênticas (mesma tecnologia)
    return [
      {
        id: this.createIdWithTech(tech),
        icon: tech,
        flipped: false,
      },
      {
        id: this.createIdWithTech(tech),
        icon: tech,
        flipped: false,
      },
    ];
  },

  // Método para criar um ID único para uma carta com base em uma tecnologia
  createIdWithTech: function (tech) {
    // Gera um ID único combinando o nome da tecnologia com um número aleatório
    return tech + parseInt(Math.random() * 1000);
  },

  // Método para embaralhar as cartas no array
  shuffleCards: function (cards) {
    let currentIndex = this.cards.length;
    let randomIndex = 0;

    // Enquanto ainda houver elementos para embaralhar
    while (currentIndex !== 0) {
      // Seleciona um índice aleatório dentro do array
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // Troca o elemento atual com o elemento aleatório selecionado
      [this.cards[randomIndex], this.cards[currentIndex]] = [
        this.cards[currentIndex],
        this.cards[randomIndex],
      ];
    }
  },

  // Variáveis de controle de estado do jogo
  lockMode: false, // Modo de travamento para evitar interações indesejadas durante o processamento
  firstCard: null, // Primeira carta virada durante uma jogada
  secondCard: null, // Segunda carta virada durante uma jogada

  // Método para virar uma carta
  setCard: function (id) {
    // Filtra a carta correspondente ao ID fornecido
    let card = this.cards.filter((card) => card.id === id)[0];

    // Verifica se a carta já está virada ou se o jogo está no modo de travamento
    if (card.flipped || this.lockMode) {
      return false;
    }

    // Se não houver carta virada, define esta carta como a primeira carta virada
    if (!this.firstCard) {
      this.firstCard = card;
      this.firstCard.flipped = true;
      return true;
    } else {
      // Se já houver uma carta virada, define esta carta como a segunda carta virada
      this.secondCard = card;
      this.secondCard.flipped = true;
      this.lockMode = true; // Ativa o modo de travamento
      return true;
    }
  },

  // Método para verificar se as duas cartas viradas são iguais
  checkMatch: function () {
    // Verifica se ambas as cartas estão viradas e têm o mesmo ícone
    if (!this.firstCard || !this.secondCard) {
      return false;
    }
    return this.firstCard.icon === this.secondCard.icon;
  },

  // Método para limpar as cartas viradas
  clearCards: function () {
    // Limpa as variáveis de controle de cartas e desativa o modo de travamento
    this.firstCard = null;
    this.secondCard = null;
    this.lockMode = false;
  },

  // Método para desvirar as cartas viradas se não forem correspondentes
  unflipCards() {
    // Desvira as duas cartas e limpa as variáveis de controle de cartas
    this.firstCard.flipped = false;
    this.secondCard.flipped = false;
    this.clearCards();
  },

  // Método para verificar se todas as cartas foram viradas (fim do jogo)
  checkGameOver() {
    // Retorna verdadeiro se não houver mais nenhuma carta não virada
    return this.cards.filter((card) => !card.flipped).length == 0;
  },
};
