import Game from "./Game.js";
import Store from 'https://network-lite.nodehill.com/store';

export default class NetWork {

  constructor(game) {
    this.game = game;

  }

  /*
    async connectToStore() {
      this.store = await Store.getNetworkStore(this.networkKey, () => this.listenForNetworkChanges());
      console.log('connected!');
    }
  
    listenForNetworkChanges() {
      this.game.render();
    }
  
    async getNetworkKey() {
      this.networkKey = await Store.createNetworkKey();
      $('.startPage').append('<p>Give your friend this network key: ' + this.networkKey + '</p><p>When he/she has entered it the games starts!</p>');
      $('.startGameButton').prop('disabled', true);
      console.log(this.networkKey, 'network Key')
      this.connectToStore();
    }
    */

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

  async connectToStore(key, listener) {
    this.networkStore = await Store.getNetworkStore(key, listener);
    console.log(this.networkStore, 'connected to store')
    this.start();
  }
  start() {
    console.log('start the game')
  }

}