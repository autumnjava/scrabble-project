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

    // add player names,the board and points to the network
    store.players = store.players || [];


    let player = { "playerName": this.game.getName(), "points": 0 };




    store.board = store.board || this.game.createBoard();
    store.tiles = store.tiles || await this.game.tilesFromFile();
    this.game.createPlayers();
    this.game.meIndex = store.players.length;
    store.players.push(player);
    store.currentPlayerIndex = 0;


    console.log(store.board, 'the board of network');
    console.log(store.players, 'the players of network');



    this.game.startGame();

  }
  start() {
    console.log('start the game')
  }

  changePlayer() {
    let store = this.networkStore;

    if (store.currentPlayerIndex < store.players.length - 1) {
      store.currentPlayerIndex++;
    }
    else { store.currentPlayerIndex = 0; }


    console.log(store.players[store.currentPlayerIndex], 'current player');
    console.log(store.players.length, 'length of store.players');
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