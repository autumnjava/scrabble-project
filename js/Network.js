import Game from "./Game.js";
import Store from 'https://network-lite.nodehill.com/store';
import Player from "./Player.js";

export default class NetWork {

  constructor(game) {
    this.game = game;
  }

  listenForNetworkChanges() {
    console.log('listener active');
    // if statement if it is not my turn dont listen to changes
    if (this.networkStore.currentPlayerIndex === this.game.meIndex && !this.networkStore.players[this.networkStore.currentPlayerIndex].inEndPage) {
      this.game.render();
      this.game.wordCheckerInstance.newWordsToCheck();
    }

    let allPlayersCalculated = this.networkStore.players.every(player => player.calculated);
    let allPlayersInEndPage = this.networkStore.players.every(player => player.inEndPage);
    if (this.networkStore.exitPressed || this.game.gameEnder.checkGameEnd()) {
      if (!this.networkStore.players[this.networkStore.currentPlayerIndex].inEndPage) { // i'm not in endpage
        if (allPlayersCalculated) { // all calculated
          this.game.gameEnder.endTheGame(true); // end and render endPage
          this.game.gameEnder.render(); // här kommer inEndPage bli true
          this.changePlayer();
        }
        else {
          this.game.gameEnder.endTheGame(true); //calculate
          this.changePlayer();
        }
      }
      else if (!allPlayersInEndPage) {
        this.changePlayer();
      }
    }
  }

  async preStart() {
    let key = await this.createNetworkKey();
    let $keyDiv = $('.keyHolder');
    $keyDiv.css({ display: 'block' });
    $keyDiv.text('Detta är nyckeln : ' + key);
    this.connectToStore(key, () => {
      console.log('Something changed...');
    });
  }

  async createNetworkKey() {
    return await Store.createNetworkKey();
  }

  async connectToStore(key) {
    this.networkStore = await Store.getNetworkStore(key, () => this.listenForNetworkChanges());

    let store = this.networkStore;
    window.store = store;
    console.log(store, 'connected to store')

    // add player names,the board and points to the network
    store.players = store.players || [];
    if (store.players.length < 4) {
      let player = {
        "playerName": this.game.getName(),
        "points": 0,
        "attemptCounter": 0,
        "minusPoints": 0,
        "inEndPage": false,
        "calculated": false
      };
      store.board = store.board || this.game.createBoard();
      store.tiles = store.tiles || await this.game.tilesFromFile();
      store.exitPressed = false;
      this.game.createPlayers();
      this.game.meIndex = store.players.length;
      store.players.push(player);
      store.currentPlayerIndex = 0;
      this.game.startGame();
    }
    else {
      this.game.gameStarter.message.text('Spelrummet är redan fullt!');
    }
  }

  changePlayer() {
    let store = this.networkStore;
    if (store.currentPlayerIndex < store.players.length - 1) {
      store.currentPlayerIndex++;
    }
    else { store.currentPlayerIndex = 0; }
  }


  set board(x) {
    this.networkStore.board = x;
  }
  get board() {
    return this.networkStore.board;
  }
  get tiles() {
    return this.networkStore.tiles;
  }
  set tiles(x) {
    this.networkStore.tiles = x;
  }






}