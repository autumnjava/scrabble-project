import Game from "./Game.js";
import Store from 'https://network-lite.nodehill.com/store';

export default class NetWork {

  constructor(game) {
    this.game = game;
  }


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

}