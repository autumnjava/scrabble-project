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
    this.allXAreSame = allXAreSame;

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
      //console.log(this.tileAbove.tile.char, 'tile char');
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



    let currentWordWithoutOtherPlayersChar = [];
    this.checkLetterBool = false;
    this.myBoolTileBelow = false; //Boolean that shows if word is placed in right angle with other word

    // Loop through the sorted array, take the value of property char and 
    // convert it into a string
    for (let tile of player.tilesPlaced) {

      //If all letters have same x position

      if (this.allXAreSame) {
        this.divBelow = this.game.board[tile.positionY + 1][tile.positionX]; //Position of tile below the last placed tile





        //If div below the last placed tile contains tile that is not current player's placed tiles
        // Select char of the below tile and make boolean true
        if (this.divBelow.tile != undefined && !player.tilesPlaced.includes(this.divBelow.tile) && player.tilesPlaced.length > 1) {



          this.myBoolTileBelow = true;
          let i = 0;
          let j = 1;
          let myDivRight = '';
          let myDivLeft = '';
          this.otherPlayersWord = [];


          this.anotherPlayerTileCharBelow = this.divBelow.tile.char; //First char below my char




          //Both of these do while loops loop through same x axis and build up another player's word
          do {
            myDivRight = this.game.board[tile.positionY + 1][tile.positionX + i].tile;
            if (myDivRight != undefined) {
              this.otherPlayersWord.push(myDivRight.char);

            }
            i++;
          }
          while (myDivRight != undefined)

          do {
            myDivLeft = this.game.board[tile.positionY + 1][tile.positionX - j].tile;
            if (myDivLeft != undefined) {

              this.otherPlayersWord.splice(0, 0, myDivLeft.char);

            }
            j++;
          }
          while (myDivLeft != undefined)




        }



      }


      for (let key in tile) {
        let val = tile[key];
        if (key === 'char') {
          //If other player's tile found below current player's tile add last added tile's char and another playe's char
          if (this.myBoolTileBelow) {
            this.wordToCheck += val;
            this.wordToCheck += this.anotherPlayerTileCharBelow; //PROBLEM: adderar bokstav 2 ggr eller mer


            currentWordWithoutOtherPlayersChar.push(val);


          }
          //Otherwise add only the last added tile's char
          /*else {
            this.wordToCheck += val;
            currentWordWithoutOtherPlayersChar.push(val);
          }*/
        }
      }
    }


    if (!this.myBoolTileBelow) {


      this.myBoolTileAbove = false;
      for (let tile of player.tilesPlaced) {

        if (this.allXAreSame) {

          this.divAbove = this.game.board[tile.positionY - 1][tile.positionX];

          if (this.divAbove.tile != undefined && !player.tilesPlaced.includes(this.divAbove.tile) && player.tilesPlaced.length > 1) {
            this.myBoolTileAbove = true;
            let i = 0;
            let j = 1;
            let myDivRight = '';
            let myDivLeft = '';
            this.otherPlayersWord = [];

            this.anotherPlayerTileCharAbove = this.divAbove.tile.char;

            do {
              myDivRight = this.game.board[tile.positionY - 1][tile.positionX + i].tile;
              if (myDivRight != undefined) {
                this.otherPlayersWord.push(myDivRight.char);

              }
              i++;
            }
            while (myDivRight != undefined)

            do {
              myDivLeft = this.game.board[tile.positionY + 1][tile.positionX - j].tile;
              if (myDivLeft != undefined) {

                this.otherPlayersWord.splice(0, 0, myDivLeft.char);

              }
              j++;
            }
            while (myDivLeft != undefined)
            console.log('other players word is', this.otherPlayersWord);

          }

        }


        for (let key in tile) {
          let val = tile[key];
          if (key === 'char') {
            //If other player's tile found below current player's tile add last added tile's char and another playe's char
            if (this.myBoolTileAbove) {
              //this.wordToCheck += this.anotherPlayerTileCharAbove;
              this.wordToCheck += val;


              currentWordWithoutOtherPlayersChar.push(val);


            }

            //Otherwise add only the last added tile's char
            else {
              this.wordToCheck += val;
              currentWordWithoutOtherPlayersChar.push(val);
            }
          }
        }
      }

    }




    console.log('To String', this.wordToCheck); //writing a whole word that will be checked
    console.log('current word without other players char is', currentWordWithoutOtherPlayersChar);  //Current player's word without another player's char
    console.log('other players word is', this.otherPlayersWord);
    if (this.otherPlayersWord != undefined) {
      for (let letter of currentWordWithoutOtherPlayersChar) {
        if (this.otherPlayersWord.some(x => x == letter)) {
          console.log('found matching letter');
          this.checkLetterBool = false; //Returns false if matching letter is foud and everything is correct
          break;
        }
        else {
          this.checkLetterBool = true;  // Returns true if matching letter is not found
        }
      }
    }
  }


  async checkWordWithSAOL() {
    this.isWordCorrect = await SAOLchecker.scrabbleOk(this.wordToCheck);
    let playerTiles = this.game.currentPlayer.currentTiles;


    if (this.checkLetterBool) {
      alert('Du saknar minst ett bokstav från en annan spelarens ord');
    }
    else {
      if (this.isWordCorrect) {


        console.log(this.wordToCheck);
        console.log('word was a word!');

        //give player points for correct word
        //also empty the tilesplaced array for next round of currentplayer
        this.game.currentPlayer.points += this.tilePointsOfWord;
        console.log('correct word points: ', this.game.currentPlayer.points);
        let newTiles = [...playerTiles, ...this.game.getTiles(this.game.currentPlayer.tilesPlaced.length)];
        this.game.currentPlayer.currentTiles = newTiles;
        console.log('tilesplaced', this.game.currentPlayer.tilesPlaced);
        this.game.currentPlayer.tilesPlaced.splice(0, this.game.currentPlayer.tilesPlaced.length);

        console.log('tilesplaced', this.game.currentPlayer.tilesPlaced);
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
    }
    //resetting for next move
    this.wordToCheck = '';
    this.tilePointsOfWord = 0;
  }


}