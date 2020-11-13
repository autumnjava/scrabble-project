import Player from "./Player.js";
export default class Game {

  async start() {
    // show the start page first
    this.showFrontPage();

    // Click the button "start game" to start playing
    this.buttonWork();
    await this.tilesFromFile();
  }

  showFrontPage() {
    let formToFills = [
      { label: 'Player 1', required: true },
      { label: 'Player 2', required: true },
      { label: 'Player 3', required: false },
      { label: 'Player 4', required: false }
    ]
    console.log('hej')
    let askPlayerNameFormDiv = $('<div class="form"></div>');
    let formTag = $('<form></form>');
    for (let formToFill of formToFills) {
      formTag.append(`
        <div>
        <label for="username">${formToFill.label}</lable>
        <input type="text" id="playername" placeholder="Write name here..." ${formToFill.required ? 'required' : ''}>
        </div>
      `)
    }
    formTag.append(`<input type="submit" value="Submit the form">`);
    askPlayerNameFormDiv.append(formTag);

    //this.createBoard();
    //await this.tilesFromFile();
    // console.table is a nice way
    // to log arrays and objects
    //console.log(this.board);
    //onsole.table(this.tiles);
    // create players
    //this.players = [

    //Create players according to desired amount of players, and their names
    //maybe a for loop to create players? Smth like if player wants to create 3 players and entered their names, then for loop to create 3 players
    //new Player(this, 'Player 1'),
    //new Player(this, 'Player 2')

    //];
    //console.table(this.players);
    // render the board + players
    //this.render();

    console.log('Starting the game.')
  }

  startButtonListener() {
    $('.button-start-game').click(() => alert('Here i will actually call the start() method'));
  }


  async tilesFromFile() {
    this.tiles = [];
    // Read the tile info from file
    (await $.get('tiles.txt'))
      .split('\r').join('') // 
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


  buttonWork() {
    let startButton = $('#startGameButton');
    let skipButton = $('#skipButton');

    //Click on "start game" button and it will dissappear
    startButton.click(function () {
      startButton.toggle();
    })


    //Click on "skip turn" button and player skips turn (in process)
    skipButton.click(function () {

    })


  }





}

