export default class EmptyTileHandler { 

  constructor(game) {
    this.game = game;
  }

  //Check if empty tile is placed on board
  //in process
  checkIfEmptyTile() {
    let tile = this.game.board[this.game.y][this.game.x].tile;
    if (tile.char == " ") {
      console.log('Empty tile found')
      let myBool = false;
      while (!myBool) {

        let letter = prompt('Please write in 1 letter for empty tile', '');

        //Place letter in empty tile if: letter is not null, length of letter is 1 and letter is not a number
        if (letter != null && letter.length == 1 && Number.isNaN(parseInt(letter))) {
          letter = letter.toUpperCase();
          myBool = true;
          tile.char = letter;

          this.game.render();
          console.log('new tile on x and y:', tile)
        }
      }
    }
  }

}