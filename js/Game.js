//import Player from "./Player.js";
export default class Game {

  async start() {
    // show the start page first
    this.showFrontPage();
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
    let boardWithTiles = [];
    (await $.get('boardTiles.txt')).split('\r').join('')
      .split('\n').forEach(x => {
        x = x.split('|');
        console.log(x);
      });
  }
}
