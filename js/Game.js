import Player from "./Player.js";
import SAOLchecker from "./SAOLchecker.js";
import WordChecker from "./ButtonHandler/WordChecker.js";

import { tilesWithPossibleToMove } from "./Helpers/BoardHelper.js";
import { getTileDivDatasetAsObject } from "./Helpers/TileHelper.js";
import { changePossibleToMoveToFalse } from "./Helpers/BoardHelper.js";
import GameEnder from "./GameEnder.js";
import EmptyTileHandler from "./EmptyTileHandler.js";
import TileChanger from "./ButtonHandler/TileChanger.js"
import TurnSkipper from "./ButtonHandler/TurnSkipper.js"
import Exit from "./ButtonHandler/Exit.js"
class Game {

  players = [];
  lastClickedTile;
  tileChanger = new TileChanger(this);
  //currentPlayer = '';
  wordCheckerInstance = new WordChecker(this);
  gameEnder = new GameEnder(this);
  turnSkipper = new TurnSkipper(this);
  exit = new Exit(this);
  emptyTileHandler = new EmptyTileHandler(this);

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
      { label: 'Spelare 1', id: 'playername1', required: true },
      { label: 'Spelare 1', id: 'playername2', required: true },
      { label: 'Spelare 1', id: 'playername3', required: false },
      { label: 'Spelare 1', id: 'playername4', required: false }
    ]
    let askPlayerNameFormDiv = $('<div class="form"></div>');
    let formTag = $('<form id="form"></form>');
    for (let formToFill of formToFills) {
      formTag.append(`
        <div>
        <label for="username"><span>${formToFill.label}</span></lable>
        <input type="text" id="${formToFill.id}" placeholder="Skriv ditt namn här.." minlength="2" ${formToFill.required ? 'required' : ''}>
        </div>
      `)
    }
    formTag.append(`<button class="startGameButton" name="startGameButton" id="startGameButton" type="submit">Starta</button>`);
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


  addButtonEvents() {
    let that = this;
    let exitButton = $('#exitButton');
    let checkWordButton = $('#checkWordButton');
    let skipButton = $('#skipButton');
    let changeTilesButton = $('#changeTilesButton');

    //Click on "skip" to skip the round
    skipButton.click(function () {
      that.turnSkipper.clickOnEventHandler();
      that.changePlayer();
      that.board = changePossibleToMoveToFalse(that.board);
      that.render();
    });

    //Click on "change tiles" to change tiles
    changeTilesButton.click(function () {
      that.tileChanger.clickOnEventHandler();
      that.gameEnder.checkGameEnd();
      that.changePlayer();
      that.render();
    });

    //Click on "Break button" too exit the game (in process)
    exitButton.click(function () {
      that.exit.clickOnEventHandler();
    })

    checkWordButton.click(function () {

      //that.wordCheckerInstance.calculatePoints(that.currentPlayer);
      that.wordCheckerInstance.checkWordWithSAOL();
      that.gameEnder.checkGameEnd();
      that.render();
    })


  }

  changePlayer() {
    if (this.players.indexOf(this.currentPlayer) < this.players.length - 1) {
      this.currentPlayer = this.players[this.players.indexOf(this.currentPlayer) + 1];
    }
    else this.currentPlayer = this.players[0];
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
    [8, 12], [11, 0], [11, 7], [11, 14], [12, 6], [12, 6], [12, 8], [14, 3], [14, 11]]
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

  render() { //render board and player divs
    let that = this;

    $('.board, .players').remove();
    let $players = $('<div class="players"/>').appendTo('.gamePage');
    let $board = $('<div class="board"/>').appendTo('.gamePage');
    this.board.flat().forEach(x => $board.append('<div/>'));
    $('.board').html(
      this.board.flat().map((x, i) => `
        <div class="boardSquare ${x.specialValue ? 'special-' + x.specialValue : ''}">
        ${x.tile ? `<div class="tile ${x.tile.points == 0 ? 'empty' : x.tile.char}" 
        data-player="${that.players.indexOf(that.currentPlayer)}"
        data-tile="${i}"
        ${x.tile.possibleToMove === true ? 'data-possibletomove' : ''}
        > ${x.tile.char}
          <span>${x.tile.points || ''}</span>
          </div>` : ''} 
        </div>
      `).join('')
    );

    $players.append(this.currentPlayer.render());
    this.tileChanger.hideChangeTiles(7);

    $('.tiles').html(
      this.tiles.map(x => `<div>${x.char}</div>`).join('')
    );

    this.addDragEvents();
    this.moveTilesAroundBoard();
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