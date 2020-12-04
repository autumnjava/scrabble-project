import SAOLchecker from "../SAOLchecker.js";
import { changePossibleToMoveToFalse, removeTilesFromBoard } from "../Helpers/BoardHelper.js";
import { tilesWithPossibleToMove } from "../Helpers/BoardHelper.js";

export default class WordChecker {


  constructor(game) {
    this.game = game;
    this.wordToCheck = '';
    this.tilePointsOfWord = 0;
    this.isWordCorrect = false;
    this.oldWords = [];
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
    this.invalidMove = (!allYAreSame && !allXAreSame)

    console.log(player.tilesPlaced, ' tiles placed');

  }

  checkIfWordIsOnStartSquare() {
    if (!this.game.board[7][7].tile) {
      this.invalidMove = true;
    }
  }

  removeFromPlayerTilesPlaced(oldObject, player) {
    for (let i = 0; i < player.tilesPlaced.length; i++) {
      if (player.tilesPlaced[i] === oldObject) {
        // if the object in the index position matches the oldObject,
        // remove it from players tilesPlaced
        player.tilesPlaced.splice(i, 1);
      }
    }
    console.log(player.tilesPlaced, ' after splice');
  }







  isBoardEmpty() {
    return this.game.board.flat().every(x => !x.tile);
  }

  collectWords() {
    let words = [];
    // Loop through the rows
    for (let row = 0; row < 15; row++) {
      let chars = '';
      for (let col = 0; col < 15; col++) {
        if (this.game.board[row][col].tile) {
          chars += this.game.board[row][col].tile.char; // if the square has a tile, add the property char to the string chars
        }
        else if (chars) {
          if (this.isBoardEmpty() || chars.length > 1) {
            words.push(chars); // push the string chars into the array of words
          }
          chars = '';
        }
      }
    }
    // Loop through the columns
    for (let col = 0; col < 15; col++) {
      let chars = '';
      for (let row = 0; row < 15; row++) {
        if (this.game.board[row][col].tile) {
          chars += this.game.board[row][col].tile.char; // if the square has a tile, add the property char to the string chars
        }
        else if (chars) {
          if (this.isBoardEmpty() || chars.length > 1) {
            words.push(chars); // Push the string chars into the array of words
          }
          chars = '';
        }
      }
    }
    return words;
  }

  newWordsToCheck() {
    let words = this.collectWords();
    this.myWords = words;
    console.log(words, ' words');
    console.log(this.oldWords, ' old words');

    let newWords = words.slice(); // Create a copy
    while (this.oldWords.length) {
      let index = newWords.indexOf(this.oldWords.shift());
      if (index >= 0) {
        newWords.splice(index, 1); // Remove old words from the copy, so only new words are left
      }
    }

    this.oldWords = words;
    return newWords;
  }





  calculatePoints(player) {
    //method for calcuating how many point a player should
    //get from a correct placed word
    let dw = false;
    let tw = false;
    //at the moment this method does not count points for the letters that have been placed BEFORE.
    for (let tile of player.tilesPlaced) {
      let special = this.game.board[tile.positionY][tile.positionX].specialValue;
      for (let key in tile) {
        let val = tile[key];
        if (special !== 'dw' || special !== 'tw') {
          if (key === 'points' && special === 'dl') { //double letter square
            this.tilePointsOfWord += val * 2;
          } else if (key === 'points' && special === 'start') { //letter in start square
            this.tilePointsOfWord += val * 2;
          } else if (key === 'points' && special === 'tl') { //triple letter square
            this.tilePointsOfWord += val * 3;
          } else if (key === 'points' && special === undefined) { //regular square, no specialvalue
            this.tilePointsOfWord += val;
          }
        }

        if (key === 'points' && special === 'dw') { //double word square
          this.tilePointsOfWord += val;
          dw = true;
        } else if (key === 'points' && special === 'tw') { //triple word square
          this.tilePointsOfWord += val;
          tw = true;
        }
      }
    }

    if (dw) {
      this.tilePointsOfWord = this.tilePointsOfWord * 2;
      console.log('points of tiles DW situation', this.tilePointsOfWord);
    } else if (tw) {
      this.tilePointsOfWord = this.tilePointsOfWord * 3;
      console.log('points of tiles TW situation', this.tilePointsOfWord);
    } else {
      console.log('points of tiles (not in DW or TW situation)', this.tilePointsOfWord);
    }
  }

  removeTilesFromBoard(player) {
    for (let tile of player.tilesPlaced) {
      let square = this.game.board[tile.positionY][tile.positionX];
      delete square.tile;
    }
  }

  async checkWordWithSAOL() {
    let checkedWithSAOL = [];
    // Loop through all words and check with SAOL if they are true or false
    for (let word of this.newWordsToCheck()) {
      checkedWithSAOL.push(await SAOLchecker.scrabbleOk(word));
    }
    this.allOk = checkedWithSAOL.every(x => x);
    this.wordsTrueOrFalse(this.allOk);
  }

  checkIfCorrectPosition() {

    this.testFailed = false;

    //Check if none of tiles placed are on start square
    let allTilesNotAtStart = this.game.currentPlayer.tilesPlaced.some(x => x.positionY == 7 && x.positionX == 7);


    if (!allTilesNotAtStart) {
      for (let tile of this.game.currentPlayer.tilesPlaced) {
        //Check div above, below, on right and left of every placed tile
        this.divBelow = this.game.board[tile.positionY + 1][tile.positionX].tile;
        this.divAbove = this.game.board[tile.positionY - 1][tile.positionX].tile;
        this.divOnRight = this.game.board[tile.positionY][tile.positionX + 1].tile;
        this.divOnLeft = this.game.board[tile.positionY][tile.positionX - 1].tile;

        //If found other player's tile above or below test has not been failed
        if (this.divBelow != undefined && !this.game.currentPlayer.tilesPlaced.includes(this.divBelow) ||
          this.divAbove != undefined && !this.game.currentPlayer.tilesPlaced.includes(this.divAbove)) {
          this.testFailed = false;
          break;

        }

        //Same as before when it comes to other player's tile on right and left side
        else if (this.divOnRight != undefined && !this.game.currentPlayer.tilesPlaced.includes(this.divOnRight) ||
          this.divOnLeft != undefined && !this.game.currentPlayer.tilesPlaced.includes(this.divOnLeft)) {
          this.testFailed = false;
          break;
        }

        //If there is none of other player's tile around my tile, test has been failed and move is invalid
        else {
          this.testFailed = true;
        }
      }

    }

    console.log('test failed', this.testFailed)
    return this.testFailed;  //Returns true if word has not correct position and false if everything is ok
  }


  wordsTrueOrFalse(words) {
    this.checkIfWordIsOnStartSquare();

    let playerTiles = this.game.currentPlayer.currentTiles;




    if (!words || this.invalidMove || this.checkIfCorrectPosition()) {

      console.log('word was not a word');
      this.game.currentPlayer.correctWordCounter++;
      this.removeTilesFromBoard(this.game.currentPlayer);

      // push back tiles to players currentTiles,
      for (let tile of this.game.currentPlayer.tilesPlaced) {
        this.game.currentPlayer.currentTiles.push(tile);
        // This is where the function that puts tiles back to stand should be added
      }
      this.game.currentPlayer.tilesPlaced.splice(0, this.game.currentPlayer.tilesPlaced.length);

      // If player has tried to check a word 3 times unsuccessfully, 
      // attemptCounter will increase, correctWordCounter will reset 0 & change player
      if (this.game.currentPlayer.correctWordCounter === 3) {
        this.game.currentPlayer.attemptCounter++;
        this.game.currentPlayer.correctWordCounter = 0;
        this.game.changePlayer();;
      }
    }
    else if (words) {
      console.log('word was a word!');

      this.game.currentPlayer.tilesPlaced = tilesWithPossibleToMove(this.game.board);
      this.game.board = changePossibleToMoveToFalse(this.game.board);

      //give player points for correct word
      //also empty the tilesplaced array for next round of currentplayer
      this.game.currentPlayer.points += this.tilePointsOfWord;
      this.game.currentPlayer.attemptCounter = 0; // Reset when correct
      this.game.currentPlayer.correctWordCounter = 0; // Reset when correct
      let newTiles = [...playerTiles, ...this.game.getTiles(this.game.currentPlayer.tilesPlaced.length)];
      this.game.currentPlayer.currentTiles = newTiles;
      this.game.currentPlayer.tilesPlaced.splice(0, this.game.currentPlayer.tilesPlaced.length);
      this.game.changePlayer();
    }
    //resetting for next move
    this.wordToCheck = '';
    this.tilePointsOfWord = 0;
    this.game.render();
  }


}