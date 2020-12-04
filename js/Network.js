import Game from "./Game.js";
import Store from 'https://network-lite.nodehill.com/store';
import Player from "./Player.js";

export default class NetWork {

  constructor(game) {
    this.game = game;

  }
  listenForNetworkChanges() {
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
    store.board = store.board || this.game.board;
    store.currentPlayer = 0;

    // add player names,the board and points to the network

    this.game.createPlayers();

    store.playerNames.push(this.game.getName());
    console.log(store.playerNames, 'networks playernames');
    console.log(store.board, 'the board of network');


    this.game.startGame();
  }
  start() {
    console.log('start the game')
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






}