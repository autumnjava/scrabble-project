import Board from "./Board.js";
import TileBag from "./TileBag.js";
import TileChanger from "./TileChanger.js";
import Player from "./Player.js";
import Menu from "./Menu.js";
import Tile from "./Tile.js";

export default class Game {
  board = new Board();
  bag = new TileBag();
  changer = new TileChanger();
  menu = new Menu();
  players = [];
  running = false;

  constructor() { this.init(); }

  async init() {
    await this.bag.init();
    $('header').hide();
    $('start').hide();
    $('footer').hide();
    this.start();
  }

  update() {
    this.numberOfPlayers = this.players.length;
    this.currentRound = 1;
    this.currentTurn = 1;
    this.currentPlayer = this.getPlayer(0);

    if (this.currentRound == 1) {
      let tilesToAdd = this.bag.getRandomTiles(7);
      this.currentPlayer.addTiles(tilesToAdd);
    }
  }

  async render() {
    await this.board.render();
    await this.currentPlayer.render();
    this.changer.render();
    await this.menu.render();
    $('game').show();
  }

  async start() {
    let that = this;
    let start = $('start');
    let inputFields = [
      { label: 'Player 1', id: 'player_1', required: true },
      { label: 'Player 2', id: 'player_2', required: true },
      { label: 'Player 3', id: 'player_3', required: false },
      { label: 'Player 4', id: 'player_4', required: false }
    ];

    let form = $('<form></form>');
    let table = $('<table></table>');
    for (let field of inputFields) {
      table.append(`
        <tr>
          <td><label for="${field.id}">${field.label}</label></td>
          <td><input type="text" id="${field.id}" placeholder="Write name here..." minlength="2" ${field.required ? 'required' : ''}></td>
        </tr>
      `)
    }
    table.append(`<tr><td colspan="2"><button name="start_game" type="submit">start game</button></td></tr>`);
    form.append(table);

    start.append(form);
    $('header').slideDown(500, function () {
      $('footer').slideDown(500, function () {
        start.fadeIn(1000);
      });
    });

    let startGame = document.querySelector('button');

    startGame.addEventListener('click', (event) => {
      event.preventDefault();
      let playerIDs = ['player_1', 'player_2', 'player_3', 'player_4'];
      that.players = [];
      for (let playerID of playerIDs) {
        let playerName = $('#' + playerID).val();
        if (playerName.length > 0) { that.players.push(new Player(playerName)) };
      }
      if (that.getPlayers().length >= 2) {
        $('start').fadeOut(500, function () {
          $('footer').slideUp(250, function () {
            $('header').slideUp(250, function () {
              that.game();
            });
          });
        });
      } else {
        alert("You need at least two players to start a new game.");
      }
    });
  }

  async game() {
    this.update();
    this.render();
  }

  getPlayers() { return this.players; }
  getPlayer(id) { return this.players[id]; }
}