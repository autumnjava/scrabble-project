//import Player from "./Player.js";
export default class Game {

  async start() {
    // show the start page first
    //this.showFrontPage();
    this.createBoard();
    console.log(this.board);
  }

  showFrontPage() {
    let formToFills = [
      { label: 'Player 1', required: 'true' },
      { label: 'Player 2', required: 'true' },
      { label: 'Player 3', required: 'false' },
      { label: 'Player 4', required: 'false' }
    ]
    let askPlayerNameFormDiv = $('<div class="form"></div>');
    let formTag = $('<form></form>');
    for (let formToFill of formToFills) {
      let keys = Object.keys(formToFill);
      formTag.append(`
        <div>
        <label for="username">${formToFill.label}</lable>
        <input type="text" id="playername" placeholder="username" ${(formToFill.required)}>
        </div>
      `)
    }
    formTag.append(`<input type="submit" value="Submit the form">`);




  }


  async createBoard() {
    // Two dimensional array with objects
    // NOTE: not the correct objects
    this.board = [...new Array(15)].map(x => new Array(15).fill(
      { specialValue: ' ', tile: undefined }));

    // Split txt-file into 15 different arrays
    // With specialValue position marked up
    this.specialTiles = [];
    (await $.get('boardTiles.txt'))
      .split('\r').join('')
      .split('\n')
      .forEach(x => {
        x = x.split('|');
        this.specialTiles.push(x);
      });

    // Loop through array and match the index from tiles-array to board-array
    this.specialTiles.flat().forEach((specialVal, i) => {
      if (specialVal === 'tw') {
        //console.log(specialVal, i);
        console.log(this.board.flat()[i]); // board shows the same index
        $('board').attr({ 'specialValue': specialVal }); // need to change value to same as from tiles-array


        let squar = $('.board').attr('specialValue');
        console.log(squar);
      }
    });
  }

  renderBoard() {
    $('.board').remove();
    let $board = $('<div class="board"/>').appendTo('body');
    this.board.flat().forEach(x => $board.append('<div/>'));
  }
}
