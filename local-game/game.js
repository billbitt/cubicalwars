
const inquirer = require('inquirer');
const prompt = inquirer.prompt;

const logger = require('winston');
const logLevel = 'debug';
require('../helpers/logging/loggerSetup.js')(logger, logLevel);

function Card (name, attack, defense, earnings, cost, inGameCardId) {
  this.name = name;
  this.attack = attack;
  this.defense = defense;
  this.earnings = earnings;
  this.cost = cost;
  this.inGameCardId = inGameCardId;
};

function createDeck (cardIdList, cardLibrary) {
  let deck = [];
  for (var i = 0; i < cardIdList.length; i++) {
    const name = cardLibrary[cardIdList[i]].name;
    const attack = cardLibrary[cardIdList[i]].attack;
    const defense = cardLibrary[cardIdList[i]].defense;
    const earnings = cardLibrary[cardIdList[i]].earnings;
    const cost = cardLibrary[cardIdList[i]].cost;
    const inGameCardId = i;
    deck.push(new Card(name, attack, defense, earnings, cost, inGameCardId));
  };
  return deck;
}

function makeChoicesArray (cards) {
  let choicesArray = [];
  for (let i = 0; i < cards.length; i++) {
    choicesArray.push({
      name : cards[i].name,
      value: i,
    });
  }
  choicesArray.push({
    name : 'none (I am done)',
    value: null,
  });
  return choicesArray;
}

// methods for getting decisions from the player
function chooseCardFromHand (player) {
  const choicesArray = makeChoicesArray(player.cardsInHand);
  logger.debug('choices array:', choicesArray);
  prompt({
    message: `${player.name}: Which cards do you want to put in play?`,
    type   : 'list',
    name   : 'cardIndex',
    choices: choicesArray,
  })
  .then((response) => {
    if (response.cardIndex === null) {  // catch for if 'none' is selected
      return null;
    }
    // remove the card from the hand
    const chosenCard = player.cardsInHand.slice(response.cardIndex, 1);
    // return the card
    return chosenCard;
  });
};

function chooseCardsFromInPlay (player) {
  prompt({
    message: `${player.name} which of these cards do you want to attack with?`,
    type   : 'checkbox',
    name   : 'cardsIndexList',
    choices: makeChoicesArray(player.cardsInHand),
  })
  .then((response) => {
    if (response.cardsIndexList === null) {  // catch for if 'none' is selected
      return null;
    }
    // remove the card(s) from the hand
    let chosenCardList = [];
    response.cardsIndexList.forEach((cardIndex, index) => {
      const chosenCard = player.cardsInPlay[cardIndex];
      chosenCardList.push(chosenCard);
    });
    return chosenCardList;
  });
};

function Player (name, cardIdList, health, cardLibrary) {
  this.name = name;
  this.cardsInDeck = createDeck(cardIdList, cardLibrary);
  this.cardsInHand = [];
  this.cardsInPlay = [];
  this.cardsInDiscard = [];
  this.health = health;
  this.decreaseHealth = function (amount) {
    this.health -= amount;
  };
  this.increaseHealth = function (amount) {
    this.health += amount;
  };
  this.drawCard = function () {
    logger.debug('drawing a card');
    const card = this.cardsInDeck.pop();
    this.cardsInHand.push(card);
  };
}

function Game (player1, player2, cardLibrary) {
  this.players = [
    new Player(player1.name, player1.cardIdList, player1.health, cardLibrary),
    new Player(player2.name, player2.cardIdList, player2.health, cardLibrary),
  ];
  this.winner = null;
  this.turn = 0;
  this.startGame = function () {
    logger.debug('starting game');
    // put 5 cards in player 1's hand
    for (let i = 0; i < 5; i++) {
      this.players[0].drawCard();
    }
    // put 5 cards in player 1's hand
    for (let i = 0; i < 5; i++) {
      this.players[1].drawCard();
    }
    // logger.debug('player 0 cards in hand = ', this.players[0].cardsInHand);
    // logger.debug('player 1 cards in hand = ', this.players[1].cardsInHand);
    let gameOver = false;
    while (!gameOver) {
      // start first turn
      this.executeTurn();
      // trick it out of inifinte loop untill executeTurn works correctly.
      gameOver = false;
    }
  };
  this.executeTurn = function () {
    logger.debug('executing turn');
    let player;
    let opponent;
    if (this.turn === 0) {
      player = this.players[0];
      opponent = this.players[1];
    } else {
      player = this.players[1];
      opponent = this.players[0];
    }
    // draw one card and add it to the players hand
    player.drawCard();
    // 1. the player choses which cards from his hand to put in play (could be an instant card or a creature to place down in play)
    this.PlayerChosesCardsFromInHand(player);
    // 2. player choses which of the cards in play to attack with (or just to use, if we allow more than creatures down, like battle walls.)
    const playerCards = this.PlayerChosesCardsFromInPlay(player);
    // 3. player 2 decide which cards to use to block (dispay the results as they happen)
    this.executeCards(playerCards, opponent);
    this.switchTurn(); // switch turn
    this.executeTurn(); // next turn
  };
  this.PlayerChosesCardsFromInHand = function (player) {
    logger.debug('player will now chose a card from his hand');
    // let turnIsDone = false;
    // while (turnIsDone === false) {
    //   const chosenCard = chooseCardFromHand(player); // do a prompt to ask if the payer wants to chose a card or the 'end tern' option.  if end turn is chosen then null is returned.
    //   // ask the player if he wants to play a card or end turn.
    //   if (chosenCard === null) {
    //     turnIsDone = true;
    //   } else {
    //     // add the chosen card to the player.cardsInPlay array
    //     player.cardsInPlay.push(chosenCard);
    //   }
    // }
    const chosenCard = chooseCardFromHand(player); // do a prompt to ask if the payer wants to chose a card or the 'end tern' option.  if end turn is chosen then null is returned.
    logger.debug('chosen card =', chosenCard);
  };
  this.PlayerChosesCardsFromInPlay = function (player) {
    // let turnIsDone = false;
    // while (turnIsDone === false) {
    //   const chosenCard = chooseCardFromInPlay(player); // do a prompt to ask if the payer wants to chose a card or the 'end turn' option.  if end turn is chosen then null is returned.
    //   // ask the player if he wants to play a card or end turn.
    //   if (chosenCard) {
    //     turnIsDone = true;
    //   } else {
    //     // add the chosen card to the player.cardsInPlay array
    //     this.players[player].cardsInHand.push(chosenCard);
    //   }
    // }
    const chosenCardList = chooseCardsFromInPlay(player);
    console.log('chosen card list', chosenCardList);
  };
  this.executeCards = function (playerCards) {
    for (let i = 0; i < playerCards.length; i++) {
      logger.debug('I\'m executing a card!');
      // ask opponent for what they want to block with
      // apply the card
    }
  };
  // method for switching turns
  this.switchTurn = function () {
    if (this.turn === 0) { this.turn = 1 } else { this.turn = 0 }
  };
};

// create game variables.  will transfer to mysql later
const cardLibrary = [
  new Card('employee frank', 2, 1, 1, 1),  // able to quickly get some attack out but doesn't build payroll  // dept: customer service
  new Card('employee jerry', 3, 2, 1, 2),  // lvl 2: costs payroll but gives you more offense  // dept: human resources
  new Card('employee susan', 1, 2, 1, 1),  // able to quickly get some defense out but doesn't build payroll  // dept: human resources
  new Card('employee jerry', 2, 3, 1, 2),  // lvl 2: costs payroll but gives you more defense  // dept: human resources
  new Card('employee kathy', 1, 1, 2, 1),  // helps you build payroll  // dept: finance
  new Card('employee john', 1, 1, 4, 2),  // lvl 2: costs a little more, but helps you build even more payroll // dept: quality assurance
  new Card('anxiey ridden middle manager lauren', 0, 5, 4, 3),  // all defense, no 0
  new Card('hot shot middle manager steven', 6, 0, 4, 3),  // all offense, no D
  new Card('level headed middle manager steven', 4, 4, 4, 3),  // balanced
  new Card('CTO', 6, 6, 3, 9),
  new Card('CFO', 9, 3, 3, 12),
  new Card('COO', 1, 13, 3, 13),
  new Card('CEO', 2, 16, 1, 16),
];
const p1 = {
  name      : 'Tom',
  cardIdList: [0, 0, 0, 1, 1, 2, 5],
  health    : 5,
};
const p2 = {
  name      : 'Brandon',
  cardIdList: [0, 0, 0, 1, 2, 3, 4],
  health    : 5,
};

// set up a game
logger.debug('ready to create game');
const thisGame = new Game(p1, p2, cardLibrary);
// logger.debug('game >>', thisGame);
// logger.debug('card library >>', cardLibrary);

// start the game
thisGame.startGame();
