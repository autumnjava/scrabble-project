export default class GameEnder {

  constructor(game) {
    this.game = game;
    this.endGame = false;
    this.reason = '';
    this.page = $('<div class="endPage"></div>');
  }

  endTheGame() {
    this.hideEverything();
    this.removeCurrentTilesFromPlayer();
    this.sortByPoints();
    this.showPage();
    this.render();
    //If endGame is true sort players' points and rank them (in process)
  }

  showPage() {
    $('header').animate({ "font-size": "40px", "padding": "10px" });
    $('footer').animate({ "font-size": "small", "padding": "10px" });
  }

  hideEverything() {
    $('.startPage').hide();
    $('.gamePage').hide();
  }

  checkGameEnd() {
    let countedPlayers = 0;
    for (let player of this.game.players) {
      if (player.attemptCounter >= 3) {
        countedPlayers++;
      }
      if (countedPlayers === this.game.players.length) {
        this.endGame = true;
        this.reason = 'Alla spelare har försökt minst 3 gånger';
        break;
      }
      if (player.currentTiles.length == 0 && this.game.tiles.length == 0) {
        this.endGame = true;
        this.reason = 'Inga brickor kvar';
        break;
      }
      else {
        this.endGame = false;
      }
    }
    if (this.endGame) {
      this.endTheGame();
    }
    //return this.endGame; --> return boolean value if necessary 
  }

  sortByPoints() {
    this.sortedPlayers = this.game.players.slice().sort(
      (a, b) => {
        return a.points > b.points ? -1 : 1;
      }
    );
  }

  removeCurrentTilesFromPlayer() {
    let totalTilePoints = 0;
    let playersWithNoTiles = [];
    for (let player of this.game.players) {
      if (player.currentTiles.length === 0) {
        playersWithNoTiles.push(player);
        continue;
      }
      for (let tile of player.currentTiles) {
        for (let key in tile) {
          let val = tile[key];
          if (key === 'points') {
            player.tilePoints = (player.tilePoints + val);
          }
        }
      }
      // This will remove all tiles left in players array of tiles when game ends
      player.currentTiles.splice(0, player.currentTiles.length);
      // The sum of players tiles left will be decreased from players points
      player.points = (player.points - player.tilePoints);
      totalTilePoints += player.tilePoints;
    }
    for (let player of playersWithNoTiles) {
      player.points = player.points + totalTilePoints;
    }
  }

  render() {
    let rankingDiv = $('<div class="ranking"></div>');
    let rankingListTitle = $('<p class="topPlayers">Resultat:<p>');
    let rankingList = $('<ol></ol>');
    let rankingNumber = 1;
    for (let player of this.sortedPlayers) {
      let playerList = $(`<li class="rank${rankingNumber}"></li>`);
      playerList.append(`
      <p><span class="rank rank${rankingNumber}">${player.name}</span> ${player.points}</p>
      `)
      rankingNumber++;
      rankingList.append(playerList);
    }
    rankingDiv.append(rankingListTitle)
    rankingDiv.append(rankingList);
    this.page.append(rankingDiv);
    $('body').append(this.page);
  }

}