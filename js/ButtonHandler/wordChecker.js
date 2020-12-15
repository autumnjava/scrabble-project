import SAOLchecker from "../SAOLchecker.js";
import MessageBox from "./MessageBox.js"
import { changePossibleToMoveToFalse, removeTilesFromBoard } from "../Helpers/BoardHelper.js";
import { tilesWithPossibleToMove } from "../Helpers/BoardHelper.js";

export default class WordChecker {


  constructor(game) {
    this.game = game;
    this.wordToCheck = '';
    this.isWordCorrect = false;
    this.oldWords = [];
    this.messageBox = new MessageBox('OGILTIGT DRAG', 'invalidMove');
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
    this.allPositionsX = allPositionsX;
    this.allPositionsY = allPositionsY;

    // Check if word is horizontal or vertical - returns true or false
    let allXAreSame = allPositionsX.every(x => x === allPositionsX[0]);
    let allYAreSame = allPositionsY.every(x => x === allPositionsY[0]);
    this.allXAreSame = allXAreSame;
    this.allYAreSame = allYAreSame;



    let allPositionsYSorted = [];
    let allPositionsXSorted = [];
    // Sort so the positions comes i order
    this.invalidMove = (!allYAreSame && !allXAreSame)
    console.log("invalidMove false=x,y same", this.invalidMove);
  }

  clickOnEventHandler() {
    this.checkEmptySpace();
    console.log("T start", this.checkIfWordIsOnStartSquare());
    console.log("F invalidMove", this.checkIfCorrectPosition());
    console.log("F gaps", this.gaps);
    if (this.checkIfWordIsOnStartSquare() && !this.checkIfCorrectPosition() && !this.gaps) {
      this.checkWordWithSAOL();
    }
    else {
      this.wordFailed();
    }
  }

  clickOnEventHandler() {


    if (!this.invalidMove) {
      this.invalidMove = (this.checkEmptySpace() || this.checkIfCorrectPosition()); //om en av dem är true, så blir invalidMove true
      console.log('are there any gaps?', this.gaps)
      console.log('not touching old tiles?', this.testFailed)
      //this.gaps = true betyder finns gaps
      //this.testFailed = true tiles ligger inte bradvid varandra
      console.log("X and Y same, but gaps or no tiles between F", this.invalidMove);
      if (this.checkIfWordIsOnStartSquare() && !this.invalidMove) {
        this.checkWordWithSAOL();
      }
      else {
        this.invalidMove = true; // just make sure invalidMove is true
        this.wordFailed();
      }
    }
    else {
      this.wordFailed();
    }
  }

  checkIfWordIsOnStartSquare() {
    return !(!this.game.networkInstance.board[7][7].tile);
  }

  removeFromPlayerTilesPlaced(oldObject, player) {
    for (let i = 0; i < player.tilesPlaced.length; i++) {
      if (player.tilesPlaced[i] === oldObject) {
        // if the object in the index position matches the oldObject,
        // remove it from players tilesPlaced
        player.tilesPlaced.splice(i, 1);
      }
    }
  }


  isBoardEmpty() {
    return this.game.networkInstance.board.flat().every(x => !x.tile);
  }

  collectWords() {
    let wordObjects = [];
    // Loop through the rows
    for (let row = 0; row < 15; row++) {
      let chars = '';
      let points = [];
      let specialValues = [];
      for (let col = 0; col < 15; col++) {
        if (this.game.networkInstance.board[row][col].tile) {
          chars += this.game.networkInstance.board[row][col].tile.char; // if the square has a tile, add the property char to the string chars
          points.push(this.game.networkInstance.board[row][col].tile.points);
          specialValues.push(this.game.networkInstance.board[row][col].specialValue ? this.game.networkInstance.board[row][col].specialValue : 0);
          if (col >= 14 && chars.length > 1) {
            wordObjects.push({ chars, points, specialValues });
            chars = '';
            points = [];
            specialValues = [];
          }
        }
        else if (chars) {
          if (this.isBoardEmpty() || chars.length > 1) {
            wordObjects.push({ chars, points, specialValues }); // push the string chars into the array of words
          }
          chars = '';
          points = [];
          specialValues = [];
        }
      }
    }
    // Loop through the columns
    for (let col = 0; col < 15; col++) {
      let chars = '';
      let points = [];
      let specialValues = [];
      for (let row = 0; row < 15; row++) {
        if (this.game.networkInstance.board[row][col].tile) {
          chars += this.game.networkInstance.board[row][col].tile.char; // if the square has a tile, add the property char to the string chars
          points.push(this.game.networkInstance.board[row][col].tile.points);
          specialValues.push(this.game.networkInstance.board[row][col].specialValue ? this.game.networkInstance.board[row][col].specialValue : 0);
          if (row >= 14 && chars.length > 1) {
            wordObjects.push({ chars, points, specialValues });
            chars = '';
            points = [];
            specialValues = [];
          }
        }
        else if (chars) {
          if (this.isBoardEmpty() || chars.length > 1) {
            wordObjects.push({ chars, points, specialValues }); // push the string chars into the array of words
          }
          chars = '';
          points = [];
          specialValues = [];
        }
      }
    }
    return wordObjects; // an object {chars, points, specialValue}
  }

  newWordsToCheck() {
    this.wordObjects = this.collectWords();
    let words = this.wordObjects.map(word => word.chars);

    let newWords = words.slice(); // Create a copy
    while (this.oldWords.length) {
      let index = newWords.indexOf(this.oldWords.shift());
      if (index >= 0) {
        newWords.splice(index, 1); // Remove old words from the copy, so only new words are left
        this.wordObjects.splice(index, 1);
      }
    }

    this.oldWords = words;

    return newWords;
  }



  calculatePoints() {
    //method for calcuating how many point a player should
    //get from a correct placed word
    let allPoints = 0;
    let dw = false;
    let tw = false;
    //here, the words shall be valid "this.allOK" = true
    for (let tile of tilesWithPossibleToMove(this.game.networkInstance.board)) {
      delete this.game.networkInstance.board[tile.positionY][tile.positionX].specialValue;
    }

    console.log("collected new wordObjs", this.wordObjects);

    for (let wordObject of this.wordObjects) {
      let tilePointsOfWord = 0;
      let chars = wordObject.chars.split('');
      for (let i = 0; i < chars.length; i++) {
        let points = wordObject.points[i];
        let special = wordObject.specialValues[i];

        if (special === 'tw')
          tw = true;
        else if (special === 'dw')
          dw = true;

        if (special === 'dl' || special === 'start') {
          tilePointsOfWord += points * 2;
        }
        else if (special === 'tl') {
          tilePointsOfWord += points * 3;
        }
        else {
          tilePointsOfWord += points;
        }
      }

      if (dw) {
        tilePointsOfWord *= 2;
      }
      else if (tw) {
        tilePointsOfWord *= 3;
      }
      allPoints += tilePointsOfWord;
    }
    return allPoints;
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


    //Problem: stannar på den första iterationen och går inte vidare
    //Check if none of tiles placed are on start square
    this.allTilesNotAtStart = this.game.currentPlayer.tilesPlaced.some(x => x.positionY == 7 && x.positionX == 7);



    if (!this.allTilesNotAtStart) {
      for (let tile of tilesWithPossibleToMove(this.game.networkInstance.board)) {
        console.log('tilen som vi kollar på nu är', tile)
        //Check div above, below, on right and left of every placed tile
        if (tile.positionY !== 14 && tile.positionY !== 0 && tile.positionX !== 14 && tile.positionX !== 0) {
          this.divBelow = this.game.networkInstance.board[tile.positionY + 1][tile.positionX].tile;
          this.divAbove = this.game.networkInstance.board[tile.positionY - 1][tile.positionX].tile;
          this.divOnRight = this.game.networkInstance.board[tile.positionY][tile.positionX + 1].tile;
          this.divOnLeft = this.game.networkInstance.board[tile.positionY][tile.positionX - 1].tile;
          //If found other player's tile above or below test has not been failed
          if (!tilesWithPossibleToMove(this.game.networkInstance.board).includes(this.divBelow) && this.divBelow !== undefined) {
            console.log('found div below')
            this.testFailed = false;
            return this.testFailed;

            //Funkar inte när alla nya tiles är endast above?
          }
          else if (!tilesWithPossibleToMove(this.game.networkInstance.board).includes(this.divAbove) && this.divAbove !== undefined) {
            console.log('found div above')
            this.testFailed = false;
            return this.testFailed;
          }
          //Same as before when it comes to other player's tile on right and left side
          else if (!tilesWithPossibleToMove(this.game.networkInstance.board).includes(this.divOnRight) && this.divOnRight !== undefined) {
            console.log('found div on right')
            this.testFailed = false;
            return this.testFailed;

          }
          else if (!tilesWithPossibleToMove(this.game.networkInstance.board).includes(this.divOnLeft) && this.divOnLeft !== undefined) {
            console.log('found div on left')
            this.testFailed = false;
            return this.testFailed;

          }
          //If there is none of other player's tile around my tile, test has been failed and move is invalid
          else {
            this.testFailed = true;
          }
        }
        else if (tile.positionY == 0 && tile.positionX == 0) {
          this.divBelow = this.game.networkInstance.board[tile.positionY + 1][tile.positionX].tile;
          this.divOnRight = this.game.networkInstance.board[tile.positionY][tile.positionX + 1].tile;
          if (!tilesWithPossibleToMove(this.game.networkInstance.board).includes(this.divBelow) && this.divBelow !== undefined) {
            this.testFailed = false;
            return this.testFailed;
          }
          else if (!tilesWithPossibleToMove(this.game.networkInstance.board).includes(this.divOnRight) && this.divOnRight !== undefined) {
            this.testFailed = false;
            return this.testFailed;
          }
          else {
            this.testFailed = true;
          }

        }
        else if (tile.positionY == 14 && tile.positionX == 14) {
          this.divAbove = this.game.networkInstance.board[tile.positionY - 1][tile.positionX].tile;
          this.divOnLeft = this.game.networkInstance.board[tile.positionY][tile.positionX - 1].tile;
          if (!tilesWithPossibleToMove(this.game.networkInstance.board).includes(this.divAbove) && this.divAbove !== undefined) {
            this.testFailed = false;
            return this.testFailed;
          }
          else if (!tilesWithPossibleToMove(this.game.networkInstance.board).includes(this.divOnLeft) && this.divOnLeft !== undefined) {
            this.testFailed = false;
            return this.testFailed;
          }
          else {
            this.testFailed = true;
          }

        }
        else if (tile.positionY == 0 && tile.positionX == 14) {
          this.divBelow = this.game.networkInstance.board[tile.positionY + 1][tile.positionX].tile;
          this.divOnLeft = this.game.networkInstance.board[tile.positionY][tile.positionX - 1].tile;
          if (!tilesWithPossibleToMove(this.game.networkInstance.board).includes(this.divBelow) && this.divBelow !== undefined) {
            this.testFailed = false;
            return this.testFailed;
          }
          else if (!tilesWithPossibleToMove(this.game.networkInstance.board).includes(this.divOnLeft) && this.divOnLeft !== undefined) {
            this.testFailed = false;
            return this.testFailed;

          }
          else {
            this.testFailed = true;
          }

        }
        else if (tile.positionY == 14 && tile.positionX == 0) {
          this.divAbove = this.game.networkInstance.board[tile.positionY - 1][tile.positionX].tile;
          this.divOnRight = this.game.networkInstance.board[tile.positionY][tile.positionX + 1].tile;
          if (!tilesWithPossibleToMove(this.game.networkInstance.board).includes(this.divAbove) && this.divAbove !== undefined) {
            this.testFailed = false;
            return this.testFailed;
          }
          else if (!tilesWithPossibleToMove(this.game.networkInstance.board).includes(this.divOnRight) && this.divOnRight !== undefined) {
            this.testFailed = false;
            return this.testFailed;
          }
          else {
            this.testFailed = true;
          }

        }
        else if (tile.positionX == 14) {
          this.divBelow = this.game.networkInstance.board[tile.positionY + 1][tile.positionX].tile;
          this.divAbove = this.game.networkInstance.board[tile.positionY - 1][tile.positionX].tile;
          this.divOnLeft = this.game.networkInstance.board[tile.positionY][tile.positionX - 1].tile;
          if (!tilesWithPossibleToMove(this.game.networkInstance.board).includes(this.divBelow) && this.divBelow !== undefined) {
            this.testFailed = false;
            return this.testFailed;
          }
          else if (!tilesWithPossibleToMove(this.game.networkInstance.board).includes(this.divAbove) && this.divAbove !== undefined) {
            this.testFailed = false;
            return this.testFailed;
          }
          else if (!tilesWithPossibleToMove(this.game.networkInstance.board).includes(this.divOnLeft) && this.divOnLeft !== undefined) {
            this.testFailed = false;
            return this.testFailed;
          }
          //If there is none of other player's tile around my tile, test has been failed and move is invalid
          else {
            this.testFailed = true;
          }
        }
        else if (tile.positionX == 0) {
          this.divBelow = this.game.networkInstance.board[tile.positionY + 1][tile.positionX].tile;
          this.divAbove = this.game.networkInstance.board[tile.positionY - 1][tile.positionX].tile;
          this.divOnRight = this.game.networkInstance.board[tile.positionY][tile.positionX + 1].tile;
          if (!tilesWithPossibleToMove(this.game.networkInstance.board).includes(this.divBelow) && this.divBelow !== undefined) {
            this.testFailed = false;
            return this.testFailed;
          }
          else if (!tilesWithPossibleToMove(this.game.networkInstance.board).includes(this.divAbove) && this.divAbove !== undefined) {
            this.testFailed = false;
            return this.testFailed;
          }
          else if (!tilesWithPossibleToMove(this.game.networkInstance.board).includes(this.divOnRight) && this.divOnRight !== undefined) {
            return this.testFailed;
          }
          else {
            this.testFailed = true;
          }
        }
        else if (tile.positionY == 0) {
          this.divBelow = this.game.networkInstance.board[tile.positionY + 1][tile.positionX].tile;
          this.divOnRight = this.game.networkInstance.board[tile.positionY][tile.positionX + 1].tile;
          this.divOnLeft = this.game.networkInstance.board[tile.positionY][tile.positionX - 1].tile;
          if (!tilesWithPossibleToMove(this.game.networkInstance.board).includes(this.divBelow) && this.divBelow !== undefined) {
            this.testFailed = false;
            return this.testFailed;
          }
          else if (!tilesWithPossibleToMove(this.game.networkInstance.board).includes(this.divOnRight) && this.divOnRight !== undefined) {
            this.testFailed = false;
            return this.testFailed;
          }
          else if (!tilesWithPossibleToMove(this.game.networkInstance.board).includes(this.divOnLeft) && this.divOnLeft !== undefined) {
            this.testFailed = false;
            return this.testFailed;
          }
          else {
            this.testFailed = true;
          }
        }
        else if (tile.positionY == 14) {
          this.divAbove = this.game.networkInstance.board[tile.positionY - 1][tile.positionX].tile;
          this.divOnRight = this.game.networkInstance.board[tile.positionY][tile.positionX + 1].tile;
          this.divOnLeft = this.game.networkInstance.board[tile.positionY][tile.positionX - 1].tile;
          if (!tilesWithPossibleToMove(this.game.networkInstance.board).includes(this.divAbove) && this.divAbove !== undefined) {
            this.testFailed = false;
            return this.testFailed;
          }
          else if (!tilesWithPossibleToMove(this.game.networkInstance.board).includes(this.divOnRight) && this.divOnRight !== undefined) {
            this.testFailed = false;
            return this.testFailed;
          }
          else if (!tilesWithPossibleToMove(this.game.networkInstance.board).includes(this.divOnLeft) && this.divOnLeft !== undefined) {
            this.testFailed = false;
            return this.testFailed;
          }
          else {
            this.testFailed = true;
          }
        }
      }
      return this.testFailed;
    }

    //Returns true if word has not correct position and false if everything is ok
  }



  checkEmptySpace() {

    //Problem! Om man placerar endast en tile på brädet blir allXAreSame true och allYAreSame true
    this.addOldTiles();

    // Sort (do not know if you need this or if they 
    // always are sorted from small to big numbers?)
    let allPositionsXSorted = this.allPositionsX.sort((a, b) => a > b ? 1 : -1);


    let allPositionsYSorted = this.allPositionsY.sort((a, b) => a > b ? 1 : -1);

    this.gaps = true;


    if (this.allXAreSame) {
      this.gaps = !allPositionsYSorted.every((y, i) =>
        i === 0 || y - 1 === allPositionsYSorted[i - 1] || y === allPositionsYSorted[i - 1]
        //Om det är bara en enda tile på brädet blir gaps false
        //Om gaps är false och allaX och allaY är true --> 
      );

    }
    else if (this.allYAreSame) {
      this.gaps = !allPositionsXSorted.every((x, i) =>
        i === 0 || x - 1 === allPositionsXSorted[i - 1] || x === allPositionsXSorted[i - 1]

        //4 ===

      );


    }

    return this.gaps;



  }

  addOldTiles() {

    if (!this.allTilesNotAtStart) {
      for (let tile of this.game.currentPlayer.tilesPlaced) {
        if (tile.positionY !== 14 && tile.positionY !== 0 && tile.positionX !== 14 && tile.positionX !== 0) {
          let divBelow = this.game.networkInstance.board[tile.positionY + 1][tile.positionX].tile;
          let divAbove = this.game.networkInstance.board[tile.positionY - 1][tile.positionX].tile;
          let divOnRight = this.game.networkInstance.board[tile.positionY][tile.positionX + 1].tile;
          let divOnLeft = this.game.networkInstance.board[tile.positionY][tile.positionX - 1].tile;

          if (divBelow != undefined && !this.game.currentPlayer.tilesPlaced.includes(divBelow)) {
            if (!this.allPositionsX.includes(divBelow.positionX) || !this.allPositionsY.includes(divBelow.positionY)) {
              this.allPositionsX.push(divBelow.positionX)
              this.allPositionsY.push(divBelow.positionY)
            }

            continue;

          }

          else if (divAbove != undefined && !this.game.currentPlayer.tilesPlaced.includes(divAbove)) {
            if (!this.allPositionsX.includes(divAbove.positionX) || !this.allPositionsY.includes(divAbove.positionY)) {
              this.allPositionsX.push(divAbove.positionX)
              this.allPositionsY.push(divAbove.positionY)
            }

            continue;

          }


          else if (divOnRight != undefined && !this.game.currentPlayer.tilesPlaced.includes(divOnRight)) {

            if (!this.allPositionsX.includes(divOnRight.positionX) || !this.allPositionsY.includes(divOnRight.positionY)) {
              this.allPositionsX.push(divOnRight.positionX)
              this.allPositionsY.push(divOnRight.positionY)
            }
            if (this.game.currentPlayer.tilesPlaced.length === 1) {
              this.allXAreSame = false;
            }

            continue;


          }

          else if (divOnLeft !== undefined && !this.game.currentPlayer.tilesPlaced.includes(divOnLeft)) {
            if (!this.allPositionsX.includes(divOnLeft.positionX) || !this.allPositionsY.includes(divOnLeft.positionY)) {
              this.allPositionsX.push(divOnLeft.positionX)
              this.allPositionsY.push(divOnLeft.positionY)
            }
            if (this.game.currentPlayer.tilesPlaced.length === 1) {
              this.allXAreSame = false;
            }




          }

        }

        else if (tile.positionX === 14 && tile.positionY === 0) {
          let divBelow = this.game.networkInstance.board[tile.positionY + 1][tile.positionX].tile;
          let divOnLeft = this.game.networkInstance.board[tile.positionY][tile.positionX - 1].tile;

          if (divOnLeft !== undefined && !this.game.currentPlayer.tilesPlaced.includes(divOnLeft)) {
            if (!this.allPositionsX.includes(divOnLeft.positionX) || !this.allPositionsY.includes(divOnLeft.positionY)) {
              this.allPositionsX.push(divOnLeft.positionX)
              this.allPositionsY.push(divOnLeft.positionY)
            }
            if (this.game.currentPlayer.tilesPlaced.length === 1) {
              this.allXAreSame = false;
            }




          }

          if (divBelow != undefined && !this.game.currentPlayer.tilesPlaced.includes(divBelow)) {
            if (!this.allPositionsX.includes(divBelow.positionX) || !this.allPositionsY.includes(divBelow.positionY)) {
              this.allPositionsX.push(divBelow.positionX)
              this.allPositionsY.push(divBelow.positionY)
            }

            continue;

          }



        }

        else if (tile.positionX === 0 && tile.positionY === 14) {
          let divAbove = this.game.networkInstance.board[tile.positionY - 1][tile.positionX].tile;
          let divOnRight = this.game.networkInstance.board[tile.positionY][tile.positionX + 1].tile;


          if (divAbove != undefined && !this.game.currentPlayer.tilesPlaced.includes(divAbove)) {
            if (!this.allPositionsX.includes(divAbove.positionX) || !this.allPositionsY.includes(divAbove.positionY)) {
              this.allPositionsX.push(divAbove.positionX)
              this.allPositionsY.push(divAbove.positionY)
            }

            continue;

          }


          else if (divOnRight != undefined && !this.game.currentPlayer.tilesPlaced.includes(divOnRight)) {

            if (!this.allPositionsX.includes(divOnRight.positionX) || !this.allPositionsY.includes(divOnRight.positionY)) {
              this.allPositionsX.push(divOnRight.positionX)
              this.allPositionsY.push(divOnRight.positionY)
            }
            if (this.game.currentPlayer.tilesPlaced.length === 1) {
              this.allXAreSame = false;
            }

            continue;


          }




        }

        else if (tile.positionY === 0 && tile.positionX === 0) {

          let divOnRight = this.game.networkInstance.board[tile.positionY][tile.positionX + 1].tile;
          let divBelow = this.game.networkInstance.board[tile.positionY + 1][tile.positionX].tile;
          if (divBelow != undefined && !this.game.currentPlayer.tilesPlaced.includes(divBelow)) {
            if (!this.allPositionsX.includes(divBelow.positionX) || !this.allPositionsY.includes(divBelow.positionY)) {
              this.allPositionsX.push(divBelow.positionX)
              this.allPositionsY.push(divBelow.positionY)
            }

            continue;

          }

          else if (divOnRight != undefined && !this.game.currentPlayer.tilesPlaced.includes(divOnRight)) {

            if (!this.allPositionsX.includes(divOnRight.positionX) || !this.allPositionsY.includes(divOnRight.positionY)) {
              this.allPositionsX.push(divOnRight.positionX)
              this.allPositionsY.push(divOnRight.positionY)
            }
            if (this.game.currentPlayer.tilesPlaced.length === 1) {
              this.allXAreSame = false;
            }

            continue;


          }

        }

        else if (tile.positionY === 14 && tile.positionX === 14) {
          let divAbove = this.game.networkInstance.board[tile.positionY - 1][tile.positionX].tile;
          let divOnLeft = this.game.networkInstance.board[tile.positionY][tile.positionX - 1].tile;

          if (divAbove != undefined && !this.game.currentPlayer.tilesPlaced.includes(divAbove)) {
            if (!this.allPositionsX.includes(divAbove.positionX) || !this.allPositionsY.includes(divAbove.positionY)) {
              this.allPositionsX.push(divAbove.positionX)
              this.allPositionsY.push(divAbove.positionY)
            }

            continue;

          }


          else if (divOnLeft !== undefined && !this.game.currentPlayer.tilesPlaced.includes(divOnLeft)) {
            if (!this.allPositionsX.includes(divOnLeft.positionX) || !this.allPositionsY.includes(divOnLeft.positionY)) {
              this.allPositionsX.push(divOnLeft.positionX)
              this.allPositionsY.push(divOnLeft.positionY)
            }
            if (this.game.currentPlayer.tilesPlaced.length === 1) {
              this.allXAreSame = false;
            }

          }
        }

        else if (tile.positionX === 14) {
          let divBelow = this.game.networkInstance.board[tile.positionY + 1][tile.positionX].tile;
          let divAbove = this.game.networkInstance.board[tile.positionY - 1][tile.positionX].tile;
          let divOnLeft = this.game.networkInstance.board[tile.positionY][tile.positionX - 1].tile;


          if (divBelow != undefined && !this.game.currentPlayer.tilesPlaced.includes(divBelow)) {
            if (!this.allPositionsX.includes(divBelow.positionX) || !this.allPositionsY.includes(divBelow.positionY)) {
              this.allPositionsX.push(divBelow.positionX)
              this.allPositionsY.push(divBelow.positionY)
            }

            continue;




          }

          else if (divAbove != undefined && !this.game.currentPlayer.tilesPlaced.includes(divAbove)) {
            if (!this.allPositionsX.includes(divAbove.positionX) || !this.allPositionsY.includes(divAbove.positionY)) {
              this.allPositionsX.push(divAbove.positionX)
              this.allPositionsY.push(divAbove.positionY)
            }

            continue;

          }

          else if (divOnLeft !== undefined && !this.game.currentPlayer.tilesPlaced.includes(divOnLeft)) {
            if (!this.allPositionsX.includes(divOnLeft.positionX) || !this.allPositionsY.includes(divOnLeft.positionY)) {
              this.allPositionsX.push(divOnLeft.positionX)
              this.allPositionsY.push(divOnLeft.positionY)
            }
            if (this.game.currentPlayer.tilesPlaced.length === 1) {
              this.allXAreSame = false;
            }
          }



        }

        else if (tile.positionX === 0) {
          let divBelow = this.game.networkInstance.board[tile.positionY + 1][tile.positionX].tile;
          let divAbove = this.game.networkInstance.board[tile.positionY - 1][tile.positionX].tile;
          let divOnRight = this.game.networkInstance.board[tile.positionY][tile.positionX + 1].tile;
          if (divBelow != undefined && !this.game.currentPlayer.tilesPlaced.includes(divBelow)) {
            if (!this.allPositionsX.includes(divBelow.positionX) || !this.allPositionsY.includes(divBelow.positionY)) {
              this.allPositionsX.push(divBelow.positionX)
              this.allPositionsY.push(divBelow.positionY)
            }

            continue;




          }

          else if (divAbove != undefined && !this.game.currentPlayer.tilesPlaced.includes(divAbove)) {
            if (!this.allPositionsX.includes(divAbove.positionX) || !this.allPositionsY.includes(divAbove.positionY)) {
              this.allPositionsX.push(divAbove.positionX)
              this.allPositionsY.push(divAbove.positionY)
            }

            continue;

          }


          else if (divOnRight != undefined && !this.game.currentPlayer.tilesPlaced.includes(divOnRight)) {

            if (!this.allPositionsX.includes(divOnRight.positionX) || !this.allPositionsY.includes(divOnRight.positionY)) {
              this.allPositionsX.push(divOnRight.positionX)
              this.allPositionsY.push(divOnRight.positionY)
            }
            if (this.game.currentPlayer.tilesPlaced.length === 1) {
              this.allXAreSame = false;
            }

            continue;


          }
        }

        else if (tile.positionY === 0) {
          let divOnRight = this.game.networkInstance.board[tile.positionY][tile.positionX + 1].tile;
          let divOnLeft = this.game.networkInstance.board[tile.positionY][tile.positionX - 1].tile;
          let divBelow = this.game.networkInstance.board[tile.positionY + 1][tile.positionX].tile;


          if (divBelow != undefined && !this.game.currentPlayer.tilesPlaced.includes(divBelow)) {
            if (!this.allPositionsX.includes(divBelow.positionX) || !this.allPositionsY.includes(divBelow.positionY)) {
              this.allPositionsX.push(divBelow.positionX)
              this.allPositionsY.push(divBelow.positionY)
            }

            continue;




          }
          else if (divOnRight != undefined && !this.game.currentPlayer.tilesPlaced.includes(divOnRight)) {

            if (!this.allPositionsX.includes(divOnRight.positionX) || !this.allPositionsY.includes(divOnRight.positionY)) {
              this.allPositionsX.push(divOnRight.positionX)
              this.allPositionsY.push(divOnRight.positionY)
            }
            if (this.game.currentPlayer.tilesPlaced.length === 1) {
              this.allXAreSame = false;
            }

            continue;


          }

          else if (divOnLeft !== undefined && !this.game.currentPlayer.tilesPlaced.includes(divOnLeft)) {
            if (!this.allPositionsX.includes(divOnLeft.positionX) || !this.allPositionsY.includes(divOnLeft.positionY)) {
              this.allPositionsX.push(divOnLeft.positionX)
              this.allPositionsY.push(divOnLeft.positionY)
            }
            if (this.game.currentPlayer.tilesPlaced.length === 1) {
              this.allXAreSame = false;
            }

          }

        }

        else if (tile.positionY == 14) {
          let divAbove = this.game.networkInstance.board[tile.positionY - 1][tile.positionX].tile;
          let divOnRight = this.game.networkInstance.board[tile.positionY][tile.positionX + 1].tile;
          let divOnLeft = this.game.networkInstance.board[tile.positionY][tile.positionX - 1].tile;
          if (divAbove != undefined && !this.game.currentPlayer.tilesPlaced.includes(divAbove)) {
            if (!this.allPositionsX.includes(divAbove.positionX) || !this.allPositionsY.includes(divAbove.positionY)) {
              this.allPositionsX.push(divAbove.positionX)
              this.allPositionsY.push(divAbove.positionY)
            }

            continue;

          }


          else if (divOnRight != undefined && !this.game.currentPlayer.tilesPlaced.includes(divOnRight)) {

            if (!this.allPositionsX.includes(divOnRight.positionX) || !this.allPositionsY.includes(divOnRight.positionY)) {
              this.allPositionsX.push(divOnRight.positionX)
              this.allPositionsY.push(divOnRight.positionY)
            }
            if (this.game.currentPlayer.tilesPlaced.length === 1) {
              this.allXAreSame = false;
            }

            continue;


          }

          else if (divOnLeft !== undefined && !this.game.currentPlayer.tilesPlaced.includes(divOnLeft)) {
            if (!this.allPositionsX.includes(divOnLeft.positionX) || !this.allPositionsY.includes(divOnLeft.positionY)) {
              this.allPositionsX.push(divOnLeft.positionX)
              this.allPositionsY.push(divOnLeft.positionY)
            }
            if (this.game.currentPlayer.tilesPlaced.length === 1) {
              this.allXAreSame = false;
            }

          }
        }
      }


    }

  }

  additionalPoints() {
    if (this.game.currentPlayer.currentTiles.length === 1 && this.game.currentPlayer.tilesPlaced.length === 7) {
      return 50;
    }
    return 0;
  }

  wordsTrueOrFalse(words) {
    this.checkIfWordIsOnStartSquare();
    if (this.checkIfCorrectPosition()) {
      this.invalidMove = true;

    }

    this.checkEmptySpace();




    let playerTiles = this.game.currentPlayer.currentTiles;

    if (!words || this.invalidMove || this.gaps) {
      this.wordFailed();
    }
    else if (words) {
      this.messageBox.hideMessage();
      let store = this.game.networkInstance.networkStore;
      let points = this.calculatePoints();
      let addPoints = this.additionalPoints();
      console.log('word was a word!');

      this.game.currentPlayer.tilesPlaced = tilesWithPossibleToMove(this.game.networkInstance.board);
      this.game.networkInstance.board = changePossibleToMoveToFalse(this.game.networkInstance.board);

      //give player points for correct word
      //also empty the tilesplaced array for next round of currentplayer
      this.game.currentPlayer.points += points;
      this.game.currentPlayer.points += addPoints;
      if (store.currentPlayerIndex === this.game.meIndex) {
        store.players[store.currentPlayerIndex].points += points;
        store.players[store.currentPlayerIndex].points += addPoints;
      }
      this.game.currentPlayer.attemptCounter = 0; // Reset when correct
      this.game.currentPlayer.correctWordCounter = 0; // Reset when correct
      let newTiles = [...playerTiles, ...this.game.getTiles(this.game.currentPlayer.tilesPlaced.length)];
      this.game.currentPlayer.currentTiles = newTiles;
      this.game.currentPlayer.tilesPlaced.splice(0, this.game.currentPlayer.tilesPlaced.length);
      this.messageBox.hideMessage();
      this.game.networkInstance.changePlayer();
    }
    //resetting for next move
    this.wordToCheck = '';
    this.game.render();
  }

  wordFailed() {
    this.messageBox.showMessage();
    this.game.currentPlayer.correctWordCounter++;
    this.game.currentPlayer.currentTiles = [...this.game.currentPlayer.currentTiles, ...tilesWithPossibleToMove(this.game.networkInstance.board)];
    this.game.networkInstance.board = removeTilesFromBoard(this.game.networkInstance.board);

    this.game.currentPlayer.tilesPlaced.splice(0, this.game.currentPlayer.tilesPlaced.length);

    // If player has tried to check a word 3 times unsuccessfully, 
    // attemptCounter will increase, correctWordCounter will reset 0 & change player
    if (this.game.currentPlayer.correctWordCounter === 3) {
      this.game.currentPlayer.attemptCounter++;
      this.game.currentPlayer.correctWordCounter = 0;
      this.game.networkInstance.changePlayer();
      this.messageBox.hideMessage();
    }
  }
}