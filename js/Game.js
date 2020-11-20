import Player from "./Player.js";
export default class Game {

  players = [];
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


  //Check if empty tile is placed on board
  checkIfEmptyTile() {
    let that = this;
    var maxLength = 1;
    var myBool = false;
    if (($('#boardSquare .empty').length > 0)) {

      while (!myBool) {
        this.emptyTileLetter = prompt("Välj en bokstav för tomma brickan", "");
        if (maxLength == this.emptyTileLetter.length && this.emptyTileLetter.length != null) {
          myBool = true;
        }
        else {
          alert('Välj bara 1 bokstav')
        }
      }
      console.log('Empty tile letter is: ', this.emptyTileLetter);


    }
    let emptyTile = $('.empty')
    console.log(emptyTile);

  }





  addButtonEvents() {
    let that = this;
    let skipButton = $('#skipButton');
    let breakButton = $('#breakButton');
    let checkWordButton = $('#checkWordButton');

    //Click on "skip turn" button and player skips turn (in process)
    skipButton.click(function () {
      that.currentPlayer.attemptCounter++;
      that.checkGameEnd();
      changePlayer();
      that.render();
    })

    //Click on "Break button" too exit the game (in process)
    breakButton.click(function () {


    })

    checkWordButton.click(function () {
      // in process
      //if (scrabbleOk) {
      //  that.currentPlayer.attemptCounter = 0;
      //}

      that.checkIfEmptyTile();
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
        <div id="boardSquare" class="${x.specialValue ? 'special-' + x.specialValue : ''}">
        ${x.tile ? `<div class="tile ${x.tile.points == 0 ? 'empty' : ''}"> ${x.tile.char}</div>` : ''}

        </div>
      `).join('')
    );

    $players.append(this.currentPlayer.render());
    if (this.tiles.length < 7) {
      $('.changeTilesButton').hide();
    }

    $('.tiles').html(
      this.tiles.map(x => `<div>${x.char}</div>`).join('')
    );

    this.addDragEvents();
  }

  addDragEvents() {
    let that = this;

    // let tile in the stands be draggable
    $('.stand .tile').not('.none').draggabilly({ containment: 'body' })
      .on('dragStart', (e) => that.dragStart(e))
      .on('dragMove', (pointer) => that.dragMove(pointer))
      .on('dragEnd', (e, pointer) => that.dragEnd(e, pointer));
  }

  dragStart(e) {
    let me = $(e.currentTarget);
    $(me).css({ zIndex: 100 });
    $('.changeTiles .changeTilesSquare').addClass('hover');
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
  }

  dragEnd(e, pointer) {
    let { pageX, pageY } = pointer;
    let me = $(e.currentTarget);  //Tile that we are currently dragging.

    // reset the z-index
    me.css({ zIndex: '' });

    let $changeQuare = $('.changeTiles .changeTilesSquare');
    $changeQuare.removeClass('hover');
    let { top, left } = $changeQuare.offset();
    let right = $changeQuare.width() + left;
    let bottom = $changeQuare.height() + top;
    if (!(pageX > left && pageX < right && pageY < bottom && pageY > top)) {

      let player = this.players[+$(me).attr('data-player')];
      let tileIndex = +$(me).attr('data-tile');
      let tile = player.currentTiles[tileIndex];

      console.log(tileIndex, 'tileIndex');
      // drag the tiles in a different order in the stands
      let $stand = $(me).parent('.stand');
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

      this.render();
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

