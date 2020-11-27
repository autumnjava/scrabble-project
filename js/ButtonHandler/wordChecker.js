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
    let allPositionsX = player.tilesPlaced.map(tile => tile.positionX);

    // Check if word is horizontal or vertical - returns true or false
    let allXAreSame = allPositionsX.every(x => x === allPositionsX[0]);
    let allYAreSame = allPositionsY.every(x => x === allPositionsY[0]);

    let allPositionsYSorted = [];
    let allPositionsXSorted = [];
    // Sort so the positions comes i order
    if (!allYAreSame && !allXAreSame) {
      // Should not be a valid move
      // Should place all tiles back to stand?
      console.log('not a valid move');
      return;
    }
    else if (!allYAreSame) {
      allPositionsYSorted = player.tilesPlaced.sort((a, b) => a.positionY < b.positionY ? -1 : 1);
    }
    else if (!allXAreSame) {
      allPositionsXSorted = player.tilesPlaced.sort((a, b) => a.positionX < b.positionX ? -1 : 1);
    }
    /*
    let gaps = true;
    if (allXAreSame) {
      gaps = !allPositionsYSorted.every((y, i) => i === 0 || y - 1 === allPositionsYSorted[i - 1]);
      console.log(gaps, 'kontroll');
      if (!gaps) {
        console.log(this.game.board[y][x].tile);
        let missingTile = this.game.board[y - 1][x].tile;

        console.log(missingTile, ' the missing tile? ');
      }
    }
    else if (allYAreSame) {
      gaps = !allPositionsXSorted.every((x, i) =>
        i === 0 || x - 1 === allPositionsXSorted[i - 1]
      );
    }
    */
    // Get the tiles around the tile placed on board by player
    this.tileAbove = this.game.board[tile.positionY - 1][tile.positionX];
    this.tileRight = this.game.board[tile.positionY][tile.positionX + 1];
    this.tileLeft = this.game.board[tile.positionY][tile.positionX - 1];
    this.tileBelow = this.game.board[tile.positionY + 1][tile.positionX];

    // If the specific tile has property tile, write the tiles property char to the console
    if (this.tileAbove.hasOwnProperty('tile')) {
      console.log(this.tileAbove.tile.char, 'tile char');
    }

    console.log(player.tilesPlaced);

  }

  missingTiles() {

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

    if (this.isWordCorrect) {
      console.log(this.wordToCheck);
      console.log('word was a word!');

      //give player points for correct word
      //also empty the tilesplaced array for next round of currentplayer
      this.game.currentPlayer.points += this.tilePointsOfWord;
      console.log('correct word points: ', this.game.currentPlayer.points);
      let newTiles = [...playerTiles, ...this.game.getTiles(this.game.currentPlayer.tilesPlaced.length)];
      this.game.currentPlayer.currentTiles = newTiles;
      this.game.currentPlayer.tilesPlaced.splice(0, this.game.currentPlayer.tilesPlaced.length);
      this.game.changePlayer();
      this.game.render();
    }
    else {
      console.log('word was not a word');
      this.game.currentPlayer.correctWordCounter++;
      // push back tiles to players currentTiles, 
      for (let tile of this.game.currentPlayer.tilesPlaced) {
        this.game.currentPlayer.currentTiles.push(tile);
        //console.log(this.game.board[tile.positionX][tile.positionY], ' tile ');
      }

      this.game.currentPlayer.tilesPlaced.splice(0, this.game.currentPlayer.tilesPlaced.length);
      this.game.render();
    }
    //resetting for next move
    this.wordToCheck = '';
    this.tilePointsOfWord = 0;
  }


}