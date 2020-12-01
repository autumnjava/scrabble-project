export default class Board {
  constructor() {
    this.createBoard();
  }

  render() {
    $('board').remove();
    let board = this.getBoard();
    let $board = $('<board></board>');
    $board.hide();
    let id = 0;
    $board.html(
      board.flat().map(x => `
        <div id="${id++}" class="square ${x.specialValue ? 'special-' + x.specialValue : ''}">
        ${x.tile ? `<div class="tile">${x.tile.char}</div>` : ''} 
        </div>
      `)
    );

    $('game left').append($board);
    $board.fadeIn(1000);
    console.log(board);
  }

  createBoard() {
    // Two dimensional array with object and correct property values
    this.board = [...new Array(15)]
      .map(x => [...new Array(15)].map(x => ({})));
    [[0, 0], [0, 7], [0, 14], [7, 0], [7, 14], [14, 0], [14, 7], [14, 14]]
      .forEach(([y, x]) => {
        this.board[y][x].specialValue = 'tw',
          this.board[y][x].tileValue = 3
      });
    [[1, 1], [1, 13], [2, 2], [2, 12], [3, 3], [3, 11], [4, 4], [4, 10],
    [10, 4], [10, 10], [11, 3], [11, 11], [12, 2], [12, 12], [13, 1],
    [13, 13]]
      .forEach(([y, x]) => {
        this.board[y][x].specialValue = 'dw',
          this.board[y][x].tileValue = 2
      });
    [[0, 3], [0, 11], [2, 6], [2, 8], [3, 0], [3, 7], [3, 14], [6, 2],
    [6, 6], [6, 8], [6, 12], [7, 3], [7, 11], [8, 2], [8, 6], [8, 6], [8, 8],
    [8, 12], [11, 0], [11, 7], [11, 14], [12, 6], [12, 6], [12, 8], [13, 0], [13, 11]]
      .forEach(([y, x]) => {
        this.board[y][x].specialValue = 'dl',
          this.board[y][x].tileValue = 2
      });
    [[1, 5], [1, 9], [5, 1], [5, 5], [5, 9], [5, 13], [9, 1], [9, 5],
    [9, 9], [9, 13], [13, 5], [13, 9]]
      .forEach(([y, x]) => {
        this.board[y][x].specialValue = 'tl',
          this.board[y][x].tileValue = 3
      });
    [[7, 7]].forEach(([y, x]) => {
      this.board[y][x].specialValue = 'start',
        this.board[y][x].tileValue = 2
    });
  }

  getBoard() { return this.board; }
}