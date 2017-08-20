const logger = require('winston');
var prompt = inquirer.createPromptModule();

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
  this.drawCard = function() {
    const card = this.cardsInDeck.pop();
    this.cardsInHand.push(card);
  }
}

function Game (player1, player2, cardLibrary) {
  this.players = [
    new Player(player1.name, player1.cardIdList, player1.health, cardLibrary),
    new Player(player2.name, player2.cardIdList, player2.health, cardLibrary),
  ]
  this.winner = null;
  this.turn = 0;
  this.startGame = function () {
    // put 5 cards in player 1's hand
    for (let i = 0; i < 5; i++){
      players[0].drawCard();
    }
    // put 5 cards in player 1's hand
    for (let i = 0; i < 5; i++){
      players[1].drawCard();
    }
    // start first turn
    this.executeturn();
  };
  this.executeTurn = function () {
    let player;
    let opponent;
    if (this.turn === 0){
      player = this.players[0];
      opponent = this.players[1];
    } else {
      player = this.players[1];
      opponent = this.players[0];
    }
    // draw one card and add it to the players hand
    player.drawCard();
    // 1. the player choses which cards from his hand to put in play (could be an instant card or a creature to place down in play)
    PlayerChosesCardsFromInHand(player)  
    // 2. player choses which of the cards in play to attack with (or just to use, if we allow more than creatures down, like battle walls.)
    .then(playerCards => {
      return PlayerChosesCardsFromInPlay(playerCards);  
    })
    // 3. player 2 decide which cards to use to block (dispay the results as they happen)
    .then(playerCards => {
      return executeCards(playerCards);  
    })
    .then(() => {
      this.switchTurn(); // switch turn
      this.executeTurn(); // next turn
    })
    .catch(error => {
      console.log(error);
    });
  };
  this.PlayerChosesCardsFromInHand = function (player) {
    return new Promise((resolve, reject) {
      let turnIsDone = false;
      while (turnIsDone === false) {
        const chosenCard = this.chooseCardFromHand(player); // do a prompt to ask if the payer wants to chose a card or the 'end tern' option.  if end turn is chosen then null is returned.
        // ask the player if he wants to play a card or end turn.
        if (chosenCard) {
          turnIsDone = true;
        } else {
          // add the chosen card to the player.cardsInPlay array
          this.players[player].cardsInPlay.push(chosenCard);
        }

      }
      resolve()
    });
  };
  this.PlayerChosesCardsFromInPlay = function (player) {
    return new Promise((resolve, reject) {
      let turnIsDone = false;
      while (turnIsDone === false) {
        const chosenCard = this.chooseCardFromInPlay(player); // do a prompt to ask if the payer wants to chose a card or the 'end turn' option.  if end turn is chosen then null is returned.
        // ask the player if he wants to play a card or end turn.
        if (chosenCard) {
          turnIsDone = true;
        } else {
          // add the chosen card to the player.cardsInPlay array
          this.players[player].cardsInHand.push(chosenCard);
        }

      }
      resolve()
    });
  };
  this.executeCards = function (playerCards) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < playerCards.length; i++) {
        // ask opponent for what they want to block with
        // apply the card
      }
      resolve(results);
    });
  };
  // methods for getting decisions from the player
  this.chooseCardFromHand = function (player) {
    function makeChoicesArray(cards){
      let choicesArray = [];
      for (let i = 0; i < cards.length; i++){
        choicesArray.push({
          name : cards[i].name,
          value: i,
        })
      }
      choicesArray.push({
        name: 'none (I am done)',
        value: null,
      })
    }
    return new Promise((resolve, reject) => {
      prompt({
        message: 'which of these cards in your hand do you want to put in play?',
        type: 'list',
        name: cardIndex,
        choices: makeChoicesArray(player.cardsInHand),
      })
      .then((response) => {
        if (response.cardIndex === null) {  // catch for if 'none' is selected
          return resolve(null);
        }
        // remove the card from the hand
        const chosenCard = player.cardsInHand.slice(response.cardIndex, 1)
        // return the card
        resolve(chosenCard);
      });
    })
  };
  this.chooseCardfromInPlay = function (player) {
    function makeChoicesArray(cards){
      let choicesArray = [];
      for (let i = 0; i < cards.length; i++){
        choicesArray.push({
          name : cards[i].name,
          value: i,
        })
      }
      choicesArray.push({
        name: 'none (I am done)',
        value: null,
      })
    }
    return new Promise((resolve, reject) => {
      prompt({
        message: 'which of these cards in your hand do you want to put in play?',
        type: 'checkbox',
        name: cardsIndexs,
        choices: makeChoicesArray(player.cardsInHand),
      })
      .then((response) => {
        if (response.cardsIndexs === null) {  // catch for if 'none' is selected
          return resolve(null);
        }
        // remove the card(s) from the hand
        const chosenCards = [];
        response.cardsIndexs.forEach((cardIndex, index) => {
          const chosenCard = player.cardsInPlay[cardIndex];
          chosenCards.push[chosenCard];
        })
        // return the card(s)
        resolve(chosenCards);
      });
    })
  };
  this.shouldWeEndTurn()
  // method for switching turns
  this.switchTurn = function () {
    if (this.turn === 0) { this.turn = 1 }
    else { this.turn = 0 }
  };
};

module.exports = app => {
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

  const thisGame = new Game(p1, p2, cardLibrary);
  logger.verbose('game >>', thisGame);
  logger.verbose('card library >>', cardLibrary);

  app.get('/', ({ originalUrl, params }, res) => {
    logger.debug(`GET request on ${originalUrl}`);
    res.status(200).render('index', { thisGame });
  });

  app.get('*', ({ originalUrl, params }, res) => {
    logger.debug(`GET request on ${originalUrl} returned 404`);
    res.status(404).json({error: {msg: '404 that page does not exist'}});
  });
};
