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
    // Two dimensional array with object and correct property values
    this.board = [...new Array(15)]
      .map(x => [...new Array(15)].map(x => ({})));
    [[0, 0], [0, 7], [0, 14], [7, 0], [7, 14], [14, 0], [14, 7], [14, 14]]
      .forEach(([y, x]) => this.board[y][x].specialValue = 'tw');
    [[1, 1], [1, 13], [2, 2], [2, 12], [3, 3], [3, 11], [4, 4], [4, 10],
    [7, 7], [10, 4], [10, 10], [11, 3], [11, 11], [12, 2], [12, 12], [13, 1],
    [13, 13]]
      .forEach(([y, x]) => this.board[y][x].specialValue = 'dw');
    [[0, 3], [0, 11], [2, 6], [2, 8], [3, 0], [3, 7], [3, 14], [6, 2],
    [6, 6], [6, 8], [6, 12], [7, 3], [7, 11], [8, 6], [8, 6], [8, 8],
    [8, 12], [11, 0], [11, 7], [11, 14], [12, 6], [12, 6], [13, 0], [13, 11]]
      .forEach(([y, x]) => this.board[y][x].specialValue = 'dl');
    [[1, 5], [1, 9], [5, 1], [5, 5], [5, 9], [5, 13], [9, 1], [9, 5],
    [9, 9], [9, 13], [13, 5], [13, 9]]
      .forEach(([y, x]) => this.board[y][x].specialValue = 'tl');

  }

  renderBoard() {
    $('.board').remove();
    let $board = $('<div class="board"/>').appendTo('body');
    this.board.flat().forEach(x => $board.append('<div/>'));
    $('.board').html(
      this.board.flat().map(x => `
        <div class="${x.special ? 'special-' + x.special : ''}">
         ${x.tile ? `<div class="tile">${x.tile.char}</div>` : ''}
        </div>
      `).join('')
    );
  }
}
