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
    store.board = store.board || this.game.createBoard();
    store.currentPlayer = 0;
    // add player names and points to the network

    this.start();
  }
  start() {
    console.log('start the game')
  }





}