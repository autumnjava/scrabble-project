export default class GameEnder {

  constructor(game) {
    this.game = game;
    this.endGame = false;
    this.reason = '';
    this.page = $('<div class="endPage"></div>');
  }

  endTheGame(gameOver) {
    if (gameOver) {
      this.removeCurrentTilesFromPlayer();
      this.sortByPoints();
      this.endGame = true;
    }
    //If endGame is true sort players' points and rank them (in process)
  }

  showPage() {
    $('header').animate({ "font-size": "15px" });
    $('footer').animate({ "font-size": "10px" });
  }

  hideEverything() {
    $('.startPage').hide();
    $('.gamePage').addClass('gameFinish');
  }

  checkGameEnd() {
    let countedPlayers = 0;
    let store = this.game.networkInstance.networkStore;
    let endGame = false;
    for (let player of store.players) {
      if (player.attemptCounter >= 3) {
        countedPlayers++;
      }
      if (countedPlayers === store.players.length) {
        endGame = true;
        this.reason = 'Alla spelare har försökt minst 3 gånger';
        break;
      }
      if (this.game.networkInstance.tiles.length == 0) {
        endGame = true;
        this.reason = 'Inga brickor kvar';
        break;
      }
      else {
        endGame = false;
      }
    }
    return endGame;
  }

  sortByPoints() {
    this.sortedPlayers = this.game.networkInstance.networkStore.players.slice().sort(
      (a, b) => {
        return a.points > b.points ? -1 : 1;
      }
    );
  }

  removeCurrentTilesFromPlayer() {
    // only applies to currentPlayer and calculates if player has not been calculated
    let store = this.game.networkInstance.networkStore;

    if (!store.players[this.game.meIndex].calculated) {
      let totalMinusPoints = 0;
      if (this.game.currentPlayer.currentTiles.length > 0) {
        for (let tile of this.game.currentPlayer.currentTiles) {
          for (let key in tile) {
            let val = tile[key];
            if (key === 'points') {
              totalMinusPoints += val;
            }
          }
        }
        // This will remove all tiles left in players array of tiles when game ends
        this.game.currentPlayer.currentTiles.splice(0, this.game.currentPlayer.currentTiles.length);
        // The sum of players tiles left will be decreased from players points
        this.game.currentPlayer.points -= totalMinusPoints;
        store.players[this.game.meIndex].points -= totalMinusPoints;
        store.players[this.game.meIndex].minusPoints += totalMinusPoints;
        store.players[this.game.meIndex].calculated = true;
      }
      else if (this.game.currentPlayer.currentTiles.length === 0 && store.players[this.game.meIndex].minusPoints === 0) {
        store.players[this.game.meIndex].calculated = true;
        if (store.players.every(player => player.calculated)) {
          for (let player of this.networkStore.players) {
            store.players[this.game.meIndex].points += player.minusPoints;
          }
        }
        else {
          store.players[this.game.meIndex].calculated = false;
        }


      }
    }
  }

  render() {
    this.showPage();
    this.hideEverything();
    this.page.html(''); // empty the endPage just in case
    let rankingDiv = $('<div class="ranking"></div>');
    let rankingListTitle = $('<p class="topPlayers">Resultat<p>');
    let rankingList = $('<ol></ol>');
    let rankingNumber = 1;
    for (let player of this.sortedPlayers) {
      let playerList = $(`<li class="rank${rankingNumber}"></li>`);
      playerList.append(`
      <p><span class="rank rank${rankingNumber}">${player.playerName}</span> ${player.points}</p>
      `)
      rankingNumber++;
      rankingList.append(playerList);
    }
    rankingDiv.append(rankingListTitle)
    rankingDiv.append(rankingList);
    this.page.append(rankingDiv);
    let topTen = this.game.networkInstance.highScoreList.printHighScores();

    this.page.append(topTen);
    $('.endPageEmpty').css('display', 'flex');
    $('.endPageEmpty').append(this.page);
    this.game.networkInstance.networkStore.players[this.game.networkInstance.networkStore.currentPlayerIndex].inEndPage = true;
  }

}