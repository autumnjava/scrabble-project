import Game from "./Game.js";
import NetWork from "./Network.js";
import Store from 'https://network-lite.nodehill.com/store';
export default class GlobalDataHandler {

  constructor(game) {
    this.game = game;
    this.localStore = Store.getLocalStore();
    this.createHighScoreList();
  }

  createHighScoreList() {
    this.localStore.highScores = this.localStore.highScores || [];
    this.localStore.highScores.push('hej');
    this.localStore.highScores.push('tjena');
    console.log(this.localStore.highScores, 'localstore');
    localStorage.clear();
  }

  printHighScores() {




  }

  getHighScores() {

  }

}