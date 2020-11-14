import Player from "./Player.js";
export default class Game {

  async start() {
    // show the start page first
    this.showFormInStartPage();


    //Create board
    this.createBoard();
    console.log(this.board);
    this.renderGamePage();


    console.log(this.board);


    // Click the button "start game" to start playing
    this.buttonWork();
    await this.tilesFromFile();
  }

  showFormInStartPage() {
    let formToFills = [
      { label: 'Player 1', id: 'playername1', required: true },
      { label: 'Player 2', id: 'playername2', required: true },
      { label: 'Player 3', id: 'playername3', required: false },
      { label: 'Player 4', id: 'playername4', required: false }
    ]
    let askPlayerNameFormDiv = $('<div class="form"></div>');
    let formTag = $('<form></form>');
    for (let formToFill of formToFills) {
      formTag.append(`
        <div>
        <label for="username">${formToFill.label}</lable>
        <input type="text" id="${formToFill.id}" placeholder="Write name here..." ${formToFill.required ? 'required' : ''}>
        </div>
      `)
    }
    formTag.append(`<button type="submit" class="formButton" name="submitbutton">Submit here</button>`);
    //formTag.append(`<button class="formButton">Submit form Button</button>`);
    askPlayerNameFormDiv.append(formTag);
    $('.startPage').append(askPlayerNameFormDiv);


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



  }
  createBoard() {
    this.board = [...new Array(15)].map(x => new Array(15).fill({
      specialValue: 'default',
      tile: undefined
    }));

  }


  renderGamePage() {
    // Create the board and players divs
    $('.board, .players').remove();
    let $board = $('<div class="board"/>').appendTo($('.gamePage'));
    let $players = $('<div class="players"/>').appendTo($('.gamePage'));
    // Render the board
    // (will be more code when we know how to represent 
    //  the special squares)
    this.board.flat().forEach(x => $board.append('<div/>'));
    // Render the players
    /*this.players.forEach(player =>
      $players.append(player.render()));
    this.addDragEvents();*/
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
    //OBS! start page also dissappears
    startButton.click(function () {
      startButton.toggle();
      $('.startPage').toggle();
      $('.not-show').css("display", "flex");

    })


    //Click on "skip turn" button and player skips turn (in process)
    skipButton.click(function () {

    })


  }



  //$('.formButton') --> button for submitting the form


}

