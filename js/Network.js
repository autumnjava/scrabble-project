import Game from "./Game.js";
import Store from 'https://network-lite.nodehill.com/store';
import Player from "./Player.js";

export default class NetWork {

  constructor(game) {
    this.game = game;

  }
  listenForNetworkChanges() {
    let store = this.networkStore;
    // if (store.currentPlayer !== this.playerIndex()) { return; }
    this.game.render();

  }

  async preStart() {
    let key = await this.createNetworkKey();
    console.log('Key', key);
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

    store.playerNames = store.playerNames || [];
    store.board = store.board || this.game.createBoard();
    store.tiles = store.tiles || await this.game.tilesFromFile();

    // add player names,the board and points to the network
    this.game.createPlayers();

    store.playerNames.push(this.game.getName());
    store.currentPlayer = store.playerNames[0];

    console.log(store.playerNames, 'networks playernames');
    console.log(store.board, 'the board of network');
    console.log(store.currentPlayer, 'currentplayer in network')


    this.game.startGame();

  }
  start() {
    console.log('start the game')
  }

  changePlayer() {
    let store = this.networkStore;

    if (store.playerNames.indexOf(store.currentPlayer) < store.playerNames.length - 1) {
      store.currentPlayer = store.playerNames[store.playerNames.indexOf(store.currentPlayer) + 1];
    }
    else { store.currentPlayer = store.playerNames[0]; }

    console.log()
  }

  playerIndex() {
    let store = this.networkStore;
    let playerIndex = store.playerNames.indexOf(store.currentPlayer);
    return playerIndex;
  }

  // Whenever you change the value of this.board 
  // this setter method will be called 
  // setting the value of board in the networkStore
  set board(x) {
    this.networkStore.board = x;
  }

  // Whenever you read this.board this getter method
  // will be called returning board from the networkStore
  get board() {
    return this.networkStore.board;
  }
  // Whenever you read this.tileSack this getter method
  // will be called returning tileSack from the networkStore
  get tiles() {
    return this.networkStore.tiles;
  }

  // Whenever you change the value of this.tileSack 
  // this setter method will be called 
  // setting the value of tileSack in the networkStore
  set tiles(x) {
    this.networkStore.tiles = x;
  }






}