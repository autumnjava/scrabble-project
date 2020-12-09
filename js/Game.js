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
  tilesToChange = [];

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
  }

  async render() {
    await this.board.render();
    await this.currentPlayer.render();
    //this.changer.render();
    await this.menu.render();
    await $('game').show();
    this.addButtonListeners();
    this.addDragEvents();
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
        let playerToAdd = new Player(playerName);
        let tilesToAdd = this.bag.getRandomTiles(7);
        playerToAdd.addTiles(tilesToAdd);
        if (playerName.length > 0) { that.players.push(playerToAdd) };
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

  changeTiles() {
    let player = this.currentPlayer;
    let bag = this.bag;
    let toChange = this.tilesToChange;
    let newTiles = [];
    let playerTiles = player.rack.tiles;

    if (toChange.length > 0 && !player.hasChangedTiles) {
      newTiles = bag.getRandomTiles(toChange.length);
      for (let tile of toChange) {
        let pos = playerTiles.indexOf(tile);
        playerTiles[pos] = null;
      }
      player.addTiles(newTiles);
      toChange.splice(0, toChange.length);
      player.hasChangedTiles = true;
      this.render();
    } else if (toChange.length > 0 && player.hasChangedTiles) {
      alert("You can only change tiles once per round ...");
      this.render();
    }
  }

  addButtonListeners() {
    let that = this;
    let player = that.currentPlayer;
    let check = $('#check');
    let change = $('#change');
    let end = $('#end');
    let quit = $('#quit');

    check.click(function () { console.log("You clicked the check button ..."); });
    change.click(function () { that.changeTiles(); });
    end.click(function () { console.log("You clicked the end turn button ..."); });
    quit.click(function () { console.log("You clicked the quit button ..."); });
  }

  mouseOver(pointer, toCheck) {
    let { pageX: mouseX, pageY: mouseY } = pointer;
    let offset = toCheck.offset();
    if (mouseX > offset.left && mouseX < offset.left + toCheck.width() && mouseY > offset.top && mouseY < offset.top + toCheck.height()) {
      return true;
    }
    return false;
  }

  elementOver(element, over) {
    let elementOffset = element.offset();
    let overOffset = over.offset();
    if (elementOffset.left > overOffset.left && elementOffset.left + element.width() < overOffset.left + over.width() && elementOffset.top > overOffset.top && elementOffset.top + element.height() < overOffset.top + over.height()) {
      return true;
    }
    return false;
  }

  switchTiles(from, to) {
    let that = this;
    if (from != to) {
      let tiles = that.currentPlayer.rack.tiles;
      //Check if moving to empty slot, else switch positions
      if (!tiles[to]) { tiles[to] = tiles[from]; tiles[from] = null; } else {
        let temp = tiles[from];
        tiles[from] = tiles[to];
        tiles[to] = temp;
      }
    }
  }

  addDragEvents() {
    let that = this;
    $('.draggable').draggabilly({ containment: 'body' })
      .on('dragStart', (e) => that.dragStart(e))
      .on('dragMove', (e, pointer) => that.dragMove(e, pointer))
      .on('dragEnd', (e, pointer) => that.dragEnd(e, pointer));
  }

  dragStart(e) {
    let me = e.currentTarget;
    let $me = $(e.currentTarget);
    this.pickedUp = parseInt($me.attr('id'));
    $(me).css('z-index', 100);
    console.log("Picked up a tile ...");
  }

  dragMove(e, pointer) {
    let that = this;
    let target = $(e.currentTarget);
    let board = $('board');
    let rack = $('rack');
    let change = $('changer');
    let placeHolders = $('rack > div');

    //If over board
    if (that.elementOver(target, board)) {
      if (target.hasClass('over')) { target.removeClass('over'); }
      if (!target.hasClass('over-board')) { target.addClass('over-board'); }

      let squareWidth = $('board div:first-child').width();
      let squareHeight = $('board div:first-child').height();
      let charSize = (squareWidth * 0.75) + 'px';
      let pointSize = (squareWidth * 0.25) + 'px';

      if (target.width() != squareWidth) { target.width(squareWidth); }
      if (target.height != squareHeight) { target.height(squareHeight); }
      target.children('char').each(function () { $(this).css({ 'line-height': '120% ', 'height': charSize, 'font-size': charSize }); });
      target.children('points').each(function () { $(this).css({ 'line-height': pointSize, 'height': pointSize, 'font-size': pointSize }); });
      let squares = $('board > div');
      for (let square of squares) {
        let me = $(square);
        if (that.mouseOver(pointer, me)) {
          if (!me.hasClass('over')) { me.addClass('over'); }
        } else {
          if (me.hasClass('over')) { me.removeClass('over'); }
        }
      }
    }

    //If over rack
    if (this.mouseOver(pointer, rack)) {
      for (let placeHolder of placeHolders) {
        let me = $(placeHolder);
        let id = parseInt(me.attr('id'));
        let tile = $(`tile[id="${id}"]`);

        if (that.mouseOver(pointer, me)) {
          that.overID = parseInt(me.attr('id'));
          console.log(that.overID);
          if (tile.hasClass('empty')) { tile.removeClass('empty'); tile.addClass('empty-over'); }
          if (!tile.hasClass('over')) { tile.addClass('over'); }
        } else {
          if (tile.hasClass('empty-over')) { tile.removeClass('empty-over'); tile.addClass('empty'); }
          if (tile.hasClass('over')) { tile.removeClass('over'); }
        }
      }
    }
    //If over tile changer
    if (that.elementOver(target, change)) {
      if (target.hasClass('over')) { target.removeClass('over'); }
    }
  }

  dragEnd(e, pointer) {
    let that = this;
    let player = that.currentPlayer;
    let me = $(e.currentTarget);
    let board = $('board');
    let rack = $('rack');
    let change = $('changer');

    //If tile is placed on board
    if (that.elementOver(me, board)) {
      console.log("You placed a tile on the board ...");
    }
    //If tile is placed in rack
    if (that.mouseOver(pointer, rack)) { that.switchTiles(that.pickedUp, that.overID); that.render(); }
    //If tile is placed in change tile area
    if (that.elementOver(me, change)) {
      let toAdd = player.rack.tiles[that.pickedUp];
      //Add to change array if not already in it ...
      if (that.tilesToChange.indexOf(toAdd) == -1) { that.tilesToChange.push(toAdd); }
    }
    //If tile is placed outside of any game containers, rerender the rack
    if (!that.elementOver(me, board) && !that.mouseOver(pointer, rack) && !that.elementOver(me, change)) { that.render(); }
  }
}