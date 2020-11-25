import Player from "./Player.js";
import { getTileDivDatasetAsObject } from "./Helpers/TileHelper.js";
import TileChanger from "./ButtonHandler/TileChanger.js"
export default class Game {

  players = [];
  lastClickedTile;
  tileChanger = new TileChanger(this);
  //currentPlayer = '';

  async start() {
    this.createFormAndShowInStartPage();
    this.startGameButtonListener();
    this.addButtonEvents();
    await this.tilesFromFile();
  }

  startGame() {
    this.createBoard();
    this.currentPlayer = this.players[0];
    this.render();
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





  //Sorting player array by points
  SortByPoints() {
    this.sortedPlayers = this.players.slice().sort(
      (a, b) => {
        return a.points > b.points ? -1 : 1;
      }
    );

    //console.log(this.sortedPlayers);

  }



  addButtonEvents() {
    let that = this;
    let skipButton = $('#skipButton');
    let breakButton = $('#breakButton');
    let changeTilesButton = this.tileChanger.button;
    let checkWordButton = $('#checkWordButton');

    //Click on "skip turn" button and player skips turn (in process)
    skipButton.click(function () {
      that.currentPlayer.attemptCounter++;
      that.checkGameEnd();
      changePlayer();
      that.render();
    })

    changeTilesButton.click(function () {
      that.tileChanger.clickOnEventHandler();
      console.log(that.currentPlayer.currentTiles);
      that.render();
      //changePlayer();

    });

    //Click on "Break button" too exit the game (in process)
    breakButton.click(function () {


    })

    checkWordButton.click(function () {

      // in process
      //if (scrabbleOk) {
      //  that.currentPlayer.attemptCounter = 0;
      //}


      if (that.currentPlayer.checkWordButton >= 3) {
        that.currentPlayer.attemptCounter++;
      }
      that.checkGameEnd();
      changePlayer();
      that.render();
    })

    function changePlayer() {
      if (that.players.indexOf(that.currentPlayer) < that.players.length - 1) {
        that.currentPlayer = that.players[that.players.indexOf(that.currentPlayer) + 1];
      }
      else that.currentPlayer = that.players[0];
    }

  }

  checkGameEnd() {

    this.endGame = '';
    let countedPlayers = 0;

    for (let player of this.players) {
      if (player.attemptCounter >= 3) {
        countedPlayers++;
      }
      // If all players attemptCounters are >= 3 the game will end
      if (countedPlayers === this.players.length) {
        this.endGame = true;
        break;
      }
      if (player.currentTiles.length == 0 && this.tiles.length == 0) {
        this.endGame = true;
        break;
      }
      else {
        this.endGame = false;
      }
    }

    if (this.endGame) {
      this.currentTilePoints();
      this.SortByPoints(); //Sorting players' array by points
      //If endGame is true sort players' points and rank them (in process)
    }
    //return this.endGame; --> return boolean value if necessary 
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

  getTiles(howMany = 7) {
    return this.tiles.splice(0, howMany);
  }

  render() {
    // render board and player divs
    $('.board, .players').remove();
    let $players = $('<div class="players"/>').appendTo('.gamePage');
    let $board = $('<div class="board"/>').appendTo('.gamePage');
    this.board.flat().forEach(x => $board.append('<div/>'));
    $('.board').html(
      this.board.flat().map(x => `
        <div class="boardSquare ${x.specialValue ? 'special-' + x.specialValue : ''}">
        ${x.tile ? `<div class="tile">${x.tile.char}</div>` : ''} 

        </div>
      `).join('')
    );

    $players.append(this.currentPlayer.render());
    this.tileChanger.hideChangeTiles(7);

    $('.tiles').html(
      this.tiles.map(x => `<div>${x.char}</div>`).join('')
    );

    this.addDragEvents();
  }

  //Check if empty tile is placed on board
  //in process
  checkIfEmptyTile() {
    if (this.board[this.y][this.x].tile.char == " ") {
      console.log('Empty tile found')
      let myBool = false;
      while (!myBool) {

        let letter = prompt('Please write in 1 letter for empty tile', '');

        //Place letter in empty tile if: letter is not null, length of letter is 1 and letter is not a number
        if (letter != null && letter.length == 1 && Number.isNaN(parseInt(letter))) {
          letter = letter.toUpperCase();
          myBool = true;
          this.board[this.y][this.x].tile.char = letter;

          this.render();
          console.log('new tile on x and y:', this.board[this.y][this.x].tile)
        }
      }
    }
  }


  addDragEvents() {
    let that = this;

    // let tile in the stands be draggable
    $('.stand .tile').not('.none').draggabilly({ containment: 'body' })
      .on('dragStart', (e) => that.dragStart(e))
      .on('dragMove', (pointer) => that.dragMove(pointer))
      .on('dragEnd', (e, pointer) => that.dragEnd(e, pointer));
  }

  //lastClickedTile; --> ?


  dragStart(e) {
    let me = $(e.currentTarget);
    this.lastClickedTile = me;
    $(me).css({ zIndex: 100 });
    $('.changeTiles .changeTilesSquare').addClass('hover');
    this.lastClickedTile = me;
  }


  dragMove(pointer) {
    let pageX = pointer.pageX;
    let pageY = pointer.pageY; // 2 lines above same as: let { pageX, pageY } = pointer;

    let $squares = $('.board > div');
    for (let square of $squares) {
      let squareTop = $(square).offset().top;
      let squareLeft = $(square).offset().left;
      let squareRight = squareLeft + $(square).width();
      let squareBottom = squareTop + $(square).height();

      if (pageX > squareLeft && pageX < squareRight && pageY < squareBottom && pageY > squareTop && !$(square).find('.tile').length) {
        $(square).addClass('hover');
      } else {
        $(square).removeClass('hover');
      }
    }
    let $changeQuare = $('.changeTiles .changeTilesSquare');
    let { top, left } = $changeQuare.offset();
    let right = $changeQuare.width() + left;
    let bottom = $changeQuare.height() + top;
    if (pageX > left && pageX < right && pageY < bottom && pageY > top) {
      $changeQuare.addClass('hover');
    } else {
      $changeQuare.removeClass('hover');
    }
    this.tileChanger.pointerInSquare(pageX, pageY);
  }

  dragEnd(e, pointer) {

    let { pageX, pageY } = pointer;



    // reset the z-index
    this.lastClickedTile.css({ zIndex: '' });
    this.tileChanger.squareChangeClass('hover', true);
    if (this.tileChanger.isPointerInSquare(pageX, pageY)) {
      this.lastClickedTile.addClass('onChangeTilesSquare');


      this.tileChanger.addTileDiv(this.lastClickedTile);
    }
    else {

      this.lastClickedTile.removeClass('onChangeTilesSquare');


      let player = this.players[+this.lastClickedTile.attr('data-player')];
      let tileIndex = +this.lastClickedTile.attr('data-tile');
      let tile = player.currentTiles[tileIndex];

      console.log(tileIndex, 'tileIndex');
      // drag the tiles in a different order in the stands
      let $stand = this.lastClickedTile.parent('.stand');
      console.log($stand);
      let { top, left } = $stand.offset();
      let bottom = top + $stand.height();
      let right = left + $stand.width();
      // if dragged within the limit of the stand
      if (pageX > left && pageX < right
        && pageY > top && pageY < bottom) {
        let newIndex = Math.floor(8 * (pageX - left) / $stand.width());
        let pt = player.currentTiles;
        // move around
        pt.splice(tileIndex, 1, ' ');
        pt.splice(newIndex, 0, tile);
        //preserve the space where the tile used to be
        while (pt.length > 8) { pt.splice(pt[tileIndex > newIndex ? 'indexOf' : 'lastIndexOf'](' '), 1); }
      }

      // if you have moved a tile to a square on the board
      // (add the square to the board, remove it from the stand)
      let $dropZone = $('.hover');
      if (!$dropZone.length) { this.render(); return; }

      let squareIndex = $('.board > div').index($dropZone);

      // convert to y and x coords in this.board
      this.y = Math.floor(squareIndex / 15);
      this.x = squareIndex % 15;

      // put the tile on the board and re-render
      console.log(player.currentTiles, 'player.currentTIles');

      this.board[this.y][this.x].tile = player.currentTiles.splice(tileIndex, 1)[0];
      console.log('tile on x and y:', this.board[this.y][this.x].tile)



      this.render();
      this.checkIfEmptyTile();
    }
  }

  /*  moveTilesAroundBoard() {
     //NOTE: can only be done on those tiles that are placed during CURRENT round.
     $('.board .tile').draggabilly({ containment: 'body' })
       .on('dragStart', () => this.dragStart()) //NOTE zIndex shall be more than 100!
       .on('dragMove', () => this.dragMove())
       .on('dragEnd', () => this.dragEnd());
   } */


  currentTilePoints() {
    for (let player of this.players) {
      for (let tile of player.currentTiles) {
        for (let key in tile) {
          let val = tile[key];
          if (key === 'points') {
            player.tilePoints = (player.tilePoints + val);
          }
        }
      }
      // This will remove all tiles left in players array of tiles when game ends
      player.currentTiles.splice(0, player.currentTiles.length);
      // The sum of players tiles left will be decreased from players points
      player.points = (player.points - player.tilePoints);
    }
  }


}

