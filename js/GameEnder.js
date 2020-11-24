export default class GameEnder{

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
        this.reason = 'All players attempt over 3';
        break;
      }
      if (player.currentTiles.length == 0 && this.game.tiles.length == 0) {
        this.endGame = true;
        this.reason = 'Ran out of tiles';
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
    for (let player of this.game.players) {
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
    }
  }

  render() { 
    let rankingDiv = $('<div class="ranking"></div>');
    let rankingList = $('<ol></ol>');
    for (let player of this.sortedPlayers) { 
      let playerList = $('<li></li>');
      playerList.append(`
      <p><span class="rank">${player.name}</span></p>
      `)
      rankingList.append(playerList);
    }
    rankingDiv.append(rankingList);
    this.page.append(rankingDiv);
    this.page.append(`<p>Hello</p>`);
    $('body').append(this.page);
  }

  showWinners() { 

  }

}