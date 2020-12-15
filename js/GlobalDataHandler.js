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
    let highScoreDiv = $('<div class="highScoreDiv"></div>');
    let highScoreTitle = $('<p class="topPlayers">Poängtoppen<p>');
    let highScoreList = $('<ol></ol>');
    let rankingNumber = 1;
    for (let player of this.topTen) {
      let playerList = $(`<li class="rank${rankingNumber}"></li>`);
      playerList.append(`
      <p><span class="highScorePosition${rankingNumber}">${player.playerName}</span> ${player.points}</p>
      `)
      rankingNumber++;
      highScoreList.append(playerList);
    }
    highScoreDiv.append(highScoreTitle)
    highScoreDiv.append(highScoreList);

    return highScoreDiv;
  }

  getHighScores(player) {
    this.localStore.highScores.push(player);
    this.sortAndSpliceHighScoreList();
    console.log(this.topTen, 'sorted highscore list');
  }

  sortAndSpliceHighScoreList() {
    this.topTen = this.localStore.highScores.slice().sort(
      (a, b) => {
        return a.points > b.points ? -1 : 1;
      }
    );
    this.topTen.splice(10);
  }

}