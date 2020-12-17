import Game from "./Game.js";
import GlobalDataHandler from "./GlobalDataHandler.js";
import Store from 'https://network-lite.nodehill.com/store';

export default class NetWork {

  highScoreList = new GlobalDataHandler(this.game);

  constructor(game) {
    this.game = game;
    this.clickedCreateKey = false;
  }

  listenForNetworkChanges() {
    // if statement if it is not my turn dont listen to changes
    let inGameConditions = ((this.networkStore.currentPlayerIndex === this.game.meIndex || this.networkStore.moveMade) && !this.networkStore.players[this.networkStore.currentPlayerIndex].inEndPage);
    if (this.networkStore.playerJoined > 0 || !this.onlyOnce || inGameConditions) {
      if (this.networkStore.playerJoined <= 0) {
        this.onlyOnce = true;
      }
      this.networkStore.playerJoined--;
      this.networkStore.moveMade = false;
      this.game.playerList.updateAndShowPlayerList();
      this.game.render();
      this.game.wordCheckerInstance.newWordsToCheck();
    }


    let allPlayersCalculated = this.networkStore.players.every(player => player.calculated);
    let allPlayersInEndPage = this.networkStore.players.every(player => player.inEndPage);
    if (this.networkStore.exitPressed || this.game.gameEnder.checkGameEnd()) {
      if (!this.networkStore.players[this.networkStore.currentPlayerIndex].inEndPage) { // i'm not in endpage
        if (allPlayersCalculated) { // all calculated
          for (let player of this.networkStore.players) {
            this.highScoreList.getHighScores(player);

          }
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
    while (!this.clickedCreateKey) {
      let key = await this.createNetworkKey();
      $('.createKeyButton').hide();
      //CHECK HERE IF ANOTHER PLAYER HAS JOINED THE GAME:
      $('.waitingForOtherPlayers').html(/*html*/`
      <p> Väntar på andra spelaren att joina<span>.</span><span>.</span><span>.</span></p>
      `);
      this.clickedCreateKey = true;

      let $keyDiv = $('.keyHolder');
      $keyDiv.css({ display: 'block' });
      $keyDiv.text('Detta är nyckeln: ' + key);
      this.connectToStore(key, () => {

      });
    }

  }

  async createNetworkKey() {
    return await Store.createNetworkKey();
  }

  async connectToStore(key) {
    this.networkStore = await Store.getNetworkStore(key, () => this.listenForNetworkChanges());
    let store = this.networkStore;
    window.store = store;

    // add player names,the board and points to the network
    store.gameStarted = store.gameStarted || false;
    if (!store.gameStarted) {
      store.players = store.players || [];
      if (store.players.length < 4) {
        let player = {
          "playerName": this.game.getName(),
          "points": 0,
          "attemptCounter": 0,
          "minusPoints": 0,
          "inEndPage": false,
          "calculated": false,
          "playerJoined": true
        };
        store.board = store.board || this.game.createBoard();
        store.tiles = store.tiles || await this.game.tilesFromFile();
        store.exitPressed = false;
        store.moveMade = false;
        this.game.createPlayers();
        this.game.meIndex = store.players.length;
        store.players.push(player);
        store.playerJoined = store.players.length;
        store.currentPlayerIndex = 0;
        this.game.startGame();
      }
      else {
        this.game.gameStarter.message.text('Spelrummet är redan fullt!');
      }
    }
    else {
      this.game.gameStarter.message.text('Spelet har redan startat!');

    }
  }

  changePlayer() {
    let store = this.networkStore;
    store.gameStarted = true;
    store.moveMade = true;
    this.game.playerList.updateAndShowPlayerList();
    this.game.render();
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