//import Player from "./Player.js";
export default class Game {

  async start() {
    // show the start page first
    this.showFrontPage();
    await this.tilesFromFile();
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

  async tilesFromFile() {
    this.tiles = [];
    // Read the tile info from file
    (await $.get('tiles.txt'))
      .split('\r').join('')
      .split('\n').forEach(x => {
        x = x.split(' ');
        x[0] = x[0] === '_' ? ' ' : x[0];
        // add tiles to this.tiles
        while (x[2]--) {
          this.tiles.push({ char: x[0], points: +x[1] })
        }
      });
    // Shuffle in random order
    this.tiles.sort(() => Math.random() - 0.5);

  }

}
//git
