export default class GameEnder{

  constructor(game) { 
    this.game = game;
    this.endGame = false;
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
        break;
      }
      if (player.currentTiles.length == 0 && this.tiles.length == 0) {
        this.endGame = true;
        break;
      }
      else {
        this.endGame = false;
      }
    }

    if (this.endGame) {
      this.removeCurrentTilesFromPlayer();
      this.sortByPoints();
      //If endGame is true sort players' points and rank them (in process)
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

  showWinners() { 

  }

}