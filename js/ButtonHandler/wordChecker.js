import SAOLchecker from "../SAOLchecker.js";
import { changePossibleToMoveToFalse } from "../Helpers/BoardHelper.js";
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

  }

  isBoardEmpty() {
    return this.game.board.flat().every(x => !x.tile);
  }

  collectWords() {
    let words = [];
    for (let row = 0; row < 15; row++) {
      let chars = '';
      for (let col = 0; col < 15; col++) {
        if (this.game.board[row][col].tile) {
          chars += this.game.board[row][col].tile.char;
        }
        else if (chars) {
          if (this.isBoardEmpty() || chars.length > 1) {
            words.push(chars);
          }
          chars = '';
        }
      }
    }
    for (let col = 0; col < 15; col++) {
      let chars = '';
      for (let row = 0; row < 15; row++) {
        if (this.game.board[row][col].tile) {
          chars += this.game.board[row][col].tile.char;
        }
        else if (chars) {
          if (this.isBoardEmpty() || chars.length > 1) {
            words.push(chars);
          }
          chars = '';
        }
      }
    }
    return words;
  }

  newWordsToCheck() {
    let words = this.collectWords();
    console.log(words, ' words');
    console.log(this.oldWords, ' old words');

    let newWords = words.slice();
    while (this.oldWords.length) {
      let index = newWords.indexOf(this.oldWords.shift());
      if (index >= 0) {
        newWords.splice(index, 1);
      }
    }

    this.oldWords = words;
    return newWords;
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

  removeTilesFromBoard(player) {
    for (let tile of player.tilesPlaced) {
      let square = this.game.board[tile.positionY][tile.positionX];
      delete square.tile;
    }
  }

  async checkWordWithSAOL() {
    let checkedWithSAOL = [];
    for (let word of this.newWordsToCheck()) {
      checkedWithSAOL.push(await SAOLchecker.scrabbleOk(word));
    }
    let allOk = checkedWithSAOL.every(x => x);
    console.log(checkedWithSAOL, 'checked with saol', allOk, 'all ok');

  }

  wordsTrueOrFalse() {

    let playerTiles = this.game.currentPlayer.currentTiles;

    if (this.checkWordWithSAOL()) {
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
      this.game.render();
    }
    else {
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
        this.game.changePlayer();
        this.game.render();
      }
      this.game.render();
    }
    //resetting for next move
    this.wordToCheck = '';
    this.tilePointsOfWord = 0;
  }


}