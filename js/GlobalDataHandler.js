import Game from "./Game.js";
import NetWork from "./Network.js";
import Store from 'https://network-lite.nodehill.com/store';
export default class GlobalDataHandler {

  constructor(game) {
    this.game = game;
    this.localStore = Store.getLocalStore();
    this.createHighScoreList();
    //this.getHighScores(player);
  }

  createHighScoreList() {
    this.localStore.highScores = this.localStore.highScores || [];
    //localStorage.clear();
  }

  printHighScores() {




  }

  getHighScores(player) {
    this.localStore.highScores.push(player);
    console.log(this.localStore.highScores, ' THE HIGHSCORELIST');
  }

}