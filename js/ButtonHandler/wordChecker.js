import SAOLchecker from "../SAOLchecker.js";
export default class WordChecker {


  constructor(game) {
    this.game = game;
    this.wordToCheck = '';
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
    // Loop through the sorted array, take the value of property char and 
    // convert it into a string

  }

  convertToString(player) {
    for (let tile of player.tilesPlaced) {
      for (let key in tile) {
        let val = tile[key];
        if (key === 'char') {
          this.wordToCheck += val;
        }
      }
    }
    console.log('in dragevent', this.wordToCheck);
  }

  checkWordWithSAOL() {

    console.log(this.wordToCheck);

    if (SAOLchecker.scrabbleOk(this.wordToCheck)) {
      console.log(this.wordToCheck);
      console.log('word was a word!');
    }
    else {
      console.log('word was not a word');
      this.game.currentPlayer.attemptCounter++;
    }
  }
  /*
    reverseWordToCheck(reversedWord) {
      reversedWord = '';
      function reverseString(str) {
        var newString = "";
        for (var i = str.length - 1; i >= 0; i--) {
          newString += str[i];
        }
        return newString;
      }
      reverseString(reversedWord);
      console.log(reversedWord);
      SAOLchecker.scrabbleOk(reversedWord);
    }
    */

}