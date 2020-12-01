import Board from "./Board.js";
import TileBag from "./TileBag.js";
import TileChanger from "./TileChanger.js";
import Player from "./Player.js";
import Menu from "./Menu.js";

export default class Game {
  board = new Board();
  bag = new TileBag();
  changer = new TileChanger();
  menu = new Menu();
  players = [];
  running = false;

  constructor() { this.init(); }

  init() {
    $('start').hide();
    this.start();
  }

  update() {
    this.numberOfPlayers = this.players.length;
    this.currentRound = 1;
    this.currentTurn = 1;
    this.currentPlayer = this.getPlayer(0);

    console.log(this.currentPlayer.getName());
  }

  render() {
    this.board.render();
    this.currentPlayer.render();
    this.changer.render();
    this.menu.render();
    /*
    $players.append(this.currentPlayer.render());
    if (this.tiles.length < 7) {
      $('#changeTilesButton').hide();
    }

    $('.tiles').html(
      this.tiles.map(x => `<div>${x.char}</div>`).join('')
    );

    this.addDragEvents();
    */
  }

  start() {
    let that = this;
    let pointer = $('start');
    let inputFields = [
      { label: 'Player 1', id: 'player_1', required: true },
      { label: 'Player 2', id: 'player_2', required: true },
      { label: 'Player 3', id: 'player_3', required: false },
      { label: 'Player 4', id: 'player_4', required: false }
    ];

    let form = $('<form></form>');
    for (let field of inputFields) {
      form.append(`
        <div>
        <label for="${field.id}">${field.label}</label>
        <input type="text" id="${field.id}" placeholder="Write name here..." minlength="2" ${field.required ? 'required' : ''}>
        </div>
      `)
    }
    form.append(`<div><button name="start_game" type="submit">start game</button></div>`);

    pointer.append(form);
    pointer.show();

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
        $('start').hide();
        $('game').show();
        $('header').animate({ "font-size": "15px", "padding": "5px" });
        $('footer').animate({ "font-size": "10px", "padding": "3px" });
        that.game();
      } else {
        alert("You need at least two players to start a new game.");
      }
    });
  }

  game() {
    this.update();
    this.render();
  }


  getPlayers() { return this.players; }
  getPlayer(id) { return this.getPlayers()[id]; }
}