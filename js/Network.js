import Game from "./Game.js";
import Store from 'https://network-lite.nodehill.com/store';
import Player from "./Player.js";

export default class NetWork {

  constructor(game) {
    this.game = game;
  }

  listenForNetworkChanges() {
    // if statement if it is not my turn dont listen to changes
    this.game.render();
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
    console.log(store, 'connected to store')

    // add player names,the board and points to the network
    store.players = store.players || [];
    let player = { "playerName": this.game.getName(), "points": 0 };
    store.board = store.board || this.game.createBoard();
    store.tiles = store.tiles || await this.game.tilesFromFile();
    this.game.createPlayers();
    this.game.meIndex = store.players.length;
    store.players.push(player);
    store.currentPlayerIndex = 0;
    this.game.startGame();
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