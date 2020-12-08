import Player from "./Player.js";
import SAOLchecker from "./SAOLchecker.js";
import WordChecker from "./ButtonHandler/WordChecker.js";
import { getTileDivDatasetAsObject } from "./Helpers/TileHelper.js";
import { changePossibleToMoveToFalse } from "./Helpers/BoardHelper.js";
import GameEnder from "./GameEnder.js";
import TileChanger from "./ButtonHandler/TileChanger.js"
import TurnSkipper from "./ButtonHandler/TurnSkipper.js"
import Store from 'https://network-lite.nodehill.com/store';
import Network from "./Network.js";
class Game {

  players = [];
  lastClickedTile;
  tileChanger = new TileChanger(this);
  //currentPlayer = '';
  wordCheckerInstance = new WordChecker(this);
  gameEnder = new GameEnder(this);
  turnSkipper = new TurnSkipper(this)
  networkInstance = new Network(this);

  async start() {
    this.createStartPage();
    this.addEventListener();
    this.addButtonEvents();
  }

  startGame() {
    //do we really need this line?
    //this.createBoard();
    this.currentPlayer = this.players[0];
    // Add a pop-up telling the player that the game will start when atleast
    // two players are connected
    if (this.networkInstance.networkStore.players.length > 1) {
      this.render();
    }
  }


  createPlayers() {
    // create and save players in the game
    let player = new Player(this.getName(), this)
    this.players.push(player);
  }
  getName() {
    this.playerName = $('input[name="playerName"]').val();
    return this.playerName;
  }

  addEventListener() {

    $('body').on('click', '.startGameButton', async () => {
      // if (!getName()) { return; 
      this.networkInstance.preStart();
      // this.startGame();
    });

    $('body').on('click', '.connectGameButton', () => {
      //  if (!getName()) { return; }
      this.networkKey = prompt('Enter the network key from your friend:');
      this.networkInstance.connectToStore(this.networkKey, this.networkInstance.listener);
      // this.startGame();
    });
  }

  createStartPage() {
    $('#gamePage').hide();
    $('#endPage').hide();
    $('.startPage').html(/*html*/`
        <input class="nameInput" type="text" name="playerName" placeholder="Skriv ditt namn här" required>
        <button class="startGameButton">Start</button>
        <button class="connectGameButton">Anslut</button>
    `);
  }




  async tilesFromFile() {
    this.networkInstance.tiles = [];
    // Read the tile info from file
    (await $.get('tiles.txt'))
      .split('\r').join('') // 
      .split('\n').forEach(x => {
        x = x.split(' ');
        x[0] = x[0] === '_' ? ' ' : x[0];
        // add tiles to this.tiles
        while (x[2]--) {
          this.networkInstance.tiles.push({ char: x[0], points: +x[1] })
        }
      });
    // Shuffle in random order
    this.networkInstance.tiles.sort(() => Math.random() - 0.5);
    return this.networkInstance.tiles;
  }


  addButtonEvents() {
    let that = this;
    let breakButton = $('#breakButton');
    let checkWordButton = $('#checkWordButton');
    let skipButton = $('#skipButton');
    let changeTilesButton = $('#changeTilesButton');

    //Click on "skip" to skip the round

    skipButton.click(function () {
      if (that.networkInstance.networkStore.currentPlayerIndex === that.meIndex) {
        that.turnSkipper.clickOnEventHandler();
        that.networkInstance.changePlayer();
        changePossibleToMoveToFalse(that.networkInstance.board);
        that.render();
      }
    });

    //Click on "change tiles" to change tiles
    changeTilesButton.click(function () {
      if (that.networkInstance.networkStore.currentPlayerIndex === that.meIndex) {
        that.tileChanger.clickOnEventHandler();
        that.gameEnder.checkGameEnd();
        that.networkInstance.changePlayer();
        that.render();
      }
    });

    //Click on "Break button" too exit the game (in process)
    breakButton.click(function () {
      if (that.networkInstance.networkStore.currentPlayerIndex === that.meIndex) {

      }
    })

    checkWordButton.click(function () {
      if (that.networkInstance.networkStore.currentPlayerIndex === that.meIndex) {
        that.wordCheckerInstance.calculatePoints(that.currentPlayer);
        that.wordCheckerInstance.checkWordWithSAOL();
        that.gameEnder.checkGameEnd();
        that.render();
      }
    })


  }




  createBoard() {
    // Two dimensional array with object and correct property values
    this.networkInstance.board = [...new Array(15)]
      .map(x => [...new Array(15)].map(x => ({})));
    [[0, 0], [0, 7], [0, 14], [7, 0], [7, 14], [14, 0], [14, 7], [14, 14]]
      .forEach(([y, x]) => {
        this.networkInstance.board[y][x].specialValue = 'tw',
          this.networkInstance.board[y][x].tileValue = 3
      });
    [[1, 1], [1, 13], [2, 2], [2, 12], [3, 3], [3, 11], [4, 4], [4, 10],
    [10, 4], [10, 10], [11, 3], [11, 11], [12, 2], [12, 12], [13, 1],
    [13, 13]]
      .forEach(([y, x]) => {
        this.networkInstance.board[y][x].specialValue = 'dw',
          this.networkInstance.board[y][x].tileValue = 2
      });
    [[0, 3], [0, 11], [2, 6], [2, 8], [3, 0], [3, 7], [3, 14], [6, 2],
    [6, 6], [6, 8], [6, 12], [7, 3], [7, 11], [8, 2], [8, 6], [8, 6], [8, 8],
    [8, 12], [11, 0], [11, 7], [11, 14], [12, 6], [12, 6], [12, 8], [14, 3], [14, 11]]
      .forEach(([y, x]) => {
        this.networkInstance.board[y][x].specialValue = 'dl',
          this.networkInstance.board[y][x].tileValue = 2
      });
    [[1, 5], [1, 9], [5, 1], [5, 5], [5, 9], [5, 13], [9, 1], [9, 5],
    [9, 9], [9, 13], [13, 5], [13, 9]]
      .forEach(([y, x]) => {
        this.networkInstance.board[y][x].specialValue = 'tl',
          this.networkInstance.board[y][x].tileValue = 3
      });
    [[7, 7]].forEach(([y, x]) => {
      this.networkInstance.board[y][x].specialValue = 'start',
        this.networkInstance.board[y][x].tileValue = 2
    });
    return this.networkInstance.board;
  }

  getTiles(howMany = 7) {
    return this.networkInstance.tiles.splice(0, howMany);
  }

  render() { //render board and player divs
    let that = this;

    $('.board, .players').remove();
    let $players = $('<div class="players"/>').appendTo('.gamePage');
    let $board = $('<div class="board"/>').appendTo('.gamePage');
    this.networkInstance.board.flat().forEach(x => $board.append('<div/>'));
    $('.board').html(
      this.networkInstance.board.flat().map((x, i) => `
        <div class="boardSquare ${x.specialValue ? 'special-' + x.specialValue : ''}">
        ${x.tile ? `<div class="tile ${x.tile.points == 0 ? 'empty' : x.tile.char}" 
        data-player="${that.networkInstance.networkStore.players.indexOf(that.networkInstance.networkStore.currentPlayer)}"
        data-tile="${i}"
        ${x.tile.possibleToMove === true ? 'data-possibletomove' : ''}
        > ${x.tile.char}
          <span>${x.tile.points || ''}</span>
          </div>` : ''} 
        </div>
      `).join('')

    );
    $('#gamePage').show();
    $('#startPage').hide();
    $players.append(this.currentPlayer.render());
    this.tileChanger.hideChangeTiles(7);

    $('.tiles').html(
      this.networkInstance.tiles.map(x => `<div>${x.char}</div>`).join('')
    );
    if (this.networkInstance.networkStore.currentPlayerIndex === this.meIndex) {
      this.addDragEvents();
      this.moveTilesAroundBoard();
    }


  }

  //Check if empty tile is placed on board
  //in process
  checkIfEmptyTile() {
    if (this.networkInstance.board[this.y][this.x].tile.char == " ") {
      console.log('Empty tile found')
      let myBool = false;
      while (!myBool) {

        let letter = prompt('Please write in 1 letter for empty tile', '');

        //Place letter in empty tile if: letter is not null, length of letter is 1 and letter is not a number
        if (letter != null && letter.length == 1 && Number.isNaN(parseInt(letter))) {
          letter = letter.toUpperCase();
          myBool = true;
          this.networkInstance.board[this.y][this.x].tile.char = letter;

          this.render();
          console.log('new tile on x and y:', this.networkInstance.board[this.y][this.x].tile)
        }
      }
    }
  }

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

import dragEvents from './GameDragEvents.js';
Object.assign(Game.prototype, dragEvents);
export default Game;