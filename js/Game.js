import Player from "./Player.js";
export default class Game {

  players = [];

  async start() {
    this.createFormAndShowInStartPage();
    this.startGameButtonListener();
    this.buttonWork();
    await this.tilesFromFile();
    if (!this.players.length) {
      this.createBoard();
      this.renderBoard();
    }
  }

  createFormAndShowInStartPage() {
    let formToFills = [
      { label: 'Player 1', id: 'playername1', required: true },
      { label: 'Player 2', id: 'playername2', required: true },
      { label: 'Player 3', id: 'playername3', required: false },
      { label: 'Player 4', id: 'playername4', required: false }
    ]
    let askPlayerNameFormDiv = $('<div class="form"></div>');
    let formTag = $('<form id="form"></form>');
    for (let formToFill of formToFills) {
      formTag.append(`
        <div>
        <label for="username"><span>${formToFill.label}</span></lable>
        <input type="text" id="${formToFill.id}" placeholder="Write name here..." minlength="2" ${formToFill.required ? 'required' : ''}>
        </div>
      `)
    }
    formTag.append(`<button class="startGameButton" name="startGameButton" id="startGameButton" type="submit">start game here</button>`);
    askPlayerNameFormDiv.append(formTag);
    $('.startPage').append(askPlayerNameFormDiv);
  }

  startGameButtonListener() {
    let that = this;

    function submitForm(event) {
      event.preventDefault();
      let playerIds = ['playername1', 'playername2', 'playername3', 'playername4'];
      for (let playerId of playerIds) {
        let playerName = document.getElementById(playerId).value;
        if (playerName.length <= 0) {
          if (playerIds.indexOf(playerId) === 0 || playerIds.indexOf(playerId) === 1) {
            that.players = [];
            return;
          }
          continue;
        }
        else that.players.push(new Player(playerName, that));
      }
      $('.startPage').addClass("not-show");
      $('.gamePage').removeClass("not-show");
      $('.board').show();
      $('header').animate({ "font-size": "15px", "padding": "5px" });
      $('footer').animate({ "font-size": "10px", "padding": "3px" });
      that.startGame();
    }

    let form = document.getElementById('form');
    form.addEventListener('submit', submitForm);
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
    let skipButton = $('#skipButton');
    let breakButton = $('#breakButton');
    let checkWordButton = $('#checkWordButton');

    //Click on "skip turn" button and player skips turn (in process)
    skipButton.click(function () {

    })

    //Click on "Break button" too exit the game (in process)
    breakButton.click(function () {

    })

    checkWordButton.click(function () {

    })
  }

  async createBoard() {
    // Two dimensional array with objects
    // NOTE: not the correct objects
    this.board = [...new Array(15)].map(x => new Array(15).fill(
      { specialValue: undefined, tile: undefined }));

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
    console.log(this.specialTiles);
  }


  getTiles(howMany = 7) {
    // Return a number of tiles (and remove from this.tiles)
    return this.tiles.splice(0, howMany);
  }

  renderBoard() {
    console.log("hereeesss", this.players);
    // render board and player divs
    $('.board, .players').remove();
    let $players = $('<div class="players"/>').appendTo('.gamePage');
    let $board = $('<div class="board"/>').appendTo('.gamePage');
    this.board.flat().forEach(x => $board.append('<div/>'));
    //render all the players
    this.players.forEach(player =>
      $players.append(player.render()));

    this.addDragEvents();
  }


  addDragEvents() {
    let that = this;
    // let tile in the stands be draggable
    $('.stand .tile').not('.none').draggabilly({ containment: 'body' })
      .on('dragStart', function () {
        // set a high z-index so that the tile being drag
        // is on top of everything  
        $(this).css({ zIndex: 100 });
      })
      .on('dragMove', function (e, pointer) {
        //$(this).css('background-color', 'blue');

        //let { pageX, pageY } = pointer;
        let pageX = pointer.pageX;
        let pageY = pointer.pageY;

        let $squares = $('.board > div');
        for (let square of $squares) {
          let squareTop = $(square).offset().top;
          let squareLeft = $(square).offset().left;
          let squareRight = $(square).offset().left + $(square).width();
          let squareBottom = $(square).offset().top + $(square).height();

          if (pageX > squareLeft && pageX < squareRight && pageY < squareBottom && pageY > squareTop) {
            $(square).css('background-color', 'orange');
          } else {
            $(square).css('background-color', '');
          }
        }


        /* //This works very fine until you drag a tile at the same time...
                $('.board').children().each(function () {
                  $(this).hover(function () {
                    $(this).css('background-color', 'orange');
                  }, function () {
                    $(this).css('background-color', '');
                  });
                }); */

        // we will need code that reacts
        // if you have moved a tile to a square on the board
        // (light it up so the player knows where the tile will drop)
        // but that code is not written yet ;)

      })
      .on('dragEnd', function (e, pointer) {
        let { pageX, pageY } = pointer;
        let me = $(this);

        // reset the z-index
        me.css({ zIndex: '' });

        let player = that.players[+$(this).attr('data-player')];
        let tileIndex = +$(this).attr('data-tile');
        let tile = player.tiles[tileIndex];

        // we will need code that reacts
        // if you have moved a tile to a square on the board
        // (add the square to the board, remove it from the stand)
        // but that code is not written yet ;)

        // but we do have the code that let you
        // drag the tiles in a different order in the stands
        let $stand = $(this).parent('.stand');
        let { top, left } = $stand.offset();
        let bottom = top + $stand.height();
        let right = left + $stand.width();
        // if dragged within the limit of the stand
        if (pageX > left && pageX < right
          && pageY > top && pageY < bottom) {
          let newIndex = Math.floor(8 * (pageX - left) / $stand.width());
          let pt = player.tiles;
          // move around
          pt.splice(tileIndex, 1, ' ');
          pt.splice(newIndex, 0, tile);
          //preserve the space where the tile used to be
          while (pt.length > 8) { pt.splice(pt[tileIndex > newIndex ? 'indexOf' : 'lastIndexOf'](' '), 1); }
        }
        that.renderBoard();
      });
  }
}

