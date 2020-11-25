import SAOLchecker from "../SAOLchecker.js";
export default class WordChecker {


  constructor(game) {
    this.game = game;
    this.wordToCheck = '';
    this.tilePointsOfWord = 0;
    this.isWordCorrect = false;
  }

  sortTiles(tile, x, y, player) {
    // In progress - save & check word
    // Add property values y and x to tile object
    tile.positionY = y;
    tile.positionX = x;

    player.tilesPlaced.push(tile);

    // Makes copies of the tilesPlaced-array only showing position Y and X
    let allPositionsY = player.tilesPlaced.map(tile => tile.positionY);
    console.log('allPositionY: ', allPositionsY);
    let allPositionsX = player.tilesPlaced.map(tile => tile.positionX);
    console.log('allPositionX: ', allPositionsX);

    // Check if word is horizontal or vertical - returns true or false
    let allXAreSame = allPositionsX.every(x => x === allPositionsX[0]);
    let allYAreSame = allPositionsY.every(x => x === allPositionsY[0]);

    // Sort so the positions comes i order
    if (!allYAreSame && !allXAreSame) {
      // Should not be a valid move
      // Should place all tiles back to stand?
      console.log('not a valid move');
      return;
    }
    else if (!allYAreSame) {
      player.tilesPlaced.sort((a, b) => a.positionY < b.positionY ? -1 : 1);
    }
    else if (!allXAreSame) {
      player.tilesPlaced.sort((a, b) => a.positionX < b.positionX ? -1 : 1);
    }

    console.log(player.tilesPlaced);

  }
  calculatePoints(player) {
    //method for calcuating how many point a player should
    //get from a correct placed word
    for (let tile of player.tilesPlaced) {
      for (let key in tile) {
        let val = tile[key];
        if (key === 'points') {
          this.tilePointsOfWord += val;
        }
      }
    }
    console.log('points of tiles', this.tilePointsOfWord);
  }

  convertToString(player) {
    // Loop through the sorted array, take the value of property char and 
    // convert it into a string
    for (let tile of player.tilesPlaced) {
      for (let key in tile) {
        let val = tile[key];
        if (key === 'char') {
          this.wordToCheck += val;
        }
      }
    }
    console.log('To String', this.wordToCheck);
  }
  async checkWordWithSAOL() {
    this.isWordCorrect = await SAOLchecker.scrabbleOk(this.wordToCheck);
    let playerTiles = this.game.currentPlayer.currentTiles;

    console.log(this.isWordCorrect);
    if (this.isWordCorrect) {
      console.log(this.wordToCheck);
      console.log('word was a word!');

      //give player points for correct word
      //also empty the tilesplaced array for next round of currentplayer
      this.game.currentPlayer.points += this.tilePointsOfWord;
      console.log(this.game.currentPlayer.points);
      let newTiles = [...playerTiles, ...this.game.getTiles(this.game.currentPlayer.tilesPlaced.length)];
      this.game.currentPlayer.currentTiles = newTiles;
      this.game.currentPlayer.tilesPlaced.splice(0, this.game.currentPlayer.tilesPlaced.length);
      this.game.changePlayer();
      this.game.render();
    }
    else {
      console.log('word was not a word');
      this.game.currentPlayer.correctWordCounter++;

      this.game.currentPlayer.tilesPlaced.splice(0, this.game.currentPlayer.tilesPlaced.length);

    }
    //resetting for next move
    this.wordToCheck = '';
    this.tilePointsOfWord = 0;
  }


}