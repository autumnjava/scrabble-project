import { getTileDivDatasetAsObject } from "../Helpers/TileHelper.js";
import { tilesWithPossibleToMove } from "../Helpers/BoardHelper.js";
import { removeTilesFromBoard } from "../Helpers/BoardHelper.js";
import { getTileDivInnerHtmlAsObject } from "../Helpers/TileHelper.js";
import { getTileDivInnerTextAsObject } from "../Helpers/TileHelper.js";
import { getTileDivAsATileObject } from "../Helpers/TileHelper.js";




export default class TileChanger {

  constructor(game) {
    this.game = game;
    this.changeTilesDiv = $('.boxes');
    this.button = $('#changeTilesButton');
    this.square = $('.boxes .changeTilesSquare');
    this.inSquareTiles = [];
  }


  clickOnEventHandler() {
    this.moveTilesOnBoardToPlayer();

    let playerTiles = this.game.currentPlayer.currentTiles;
    if (this.inSquareTiles.length > 0) {
      for (let tileToRemove of this.inSquareTiles) {
        if (playerTiles.includes(tileToRemove)) {
          let tileToRemoveIndex = playerTiles.indexOf(tileToRemove);
          this.game.currentPlayer.currentTiles.splice(tileToRemoveIndex, 1);
        }
      }
      let newTiles = [...playerTiles, ...this.game.getTiles(this.inSquareTiles.length)];
      this.game.currentPlayer.currentTiles = newTiles;
      this.inSquareTiles = [];
      this.game.currentPlayer.attemptCounter += 1;
    }
    else {
      this.game.currentPlayer.currentTiles = [...this.game.getTiles(), ' '];
      this.game.currentPlayer.attemptCounter += 1;
    }
  }

  squareChangeClass(className, remove = false) {
    if (!remove) {
      this.square.addClass(className)
    }
    else this.square.removeClass(className);
  }

  hideChangeTiles(minTilesToShow) {
    if (this.game.networkInstance.tiles.length < minTilesToShow) {
      this.square.hide();
    }
  }

  hideButton(minTilesToShow) {
    if (this.game.networkInstance.tiles.length < minTilesToShow) {
      this.button.hide();
    }
  }

  isPointerInSquare(pointerX, pointerY) {
    let { top, left } = this.square.offset();
    let right = this.square.width() + left;
    let bottom = this.square.height() + top;
    return (pointerX > left && pointerX < right && pointerY < bottom && pointerY > top);
  }

  pointerInSquare(pointerX, pointerY) {
    if (this.isPointerInSquare(pointerX, pointerY)) {
      this.squareChangeClass('hover');
    } else {
      this.squareChangeClass('hover', true);
    }
  }

  addTileDivInSquare(tileDiv) { // assume  tile is moved from stand
    let tileIndex = getTileDivDatasetAsObject(tileDiv).tile;
    let tile = this.game.currentPlayer.currentTiles[tileIndex];

    if (!tileDiv.hasClass('onChangeTilesSquare')) {
      this.inSquareTiles.push(tile);
      tileDiv.addClass('onChangeTilesSquare');
    }
  }

  addTileDivInSquareFromBoard(tileDiv) { // assume tile is moved from board
    let newTile = getTileDivAsATileObject(tileDiv);
    if (!tileDiv.hasClass('onChangeTilesSquare')) { // do not add if allready on board
      this.inSquareTiles.push(newTile);
      this.returnTileToPlayer(newTile);
      tileDiv.addClass('onChangeTilesSquare');
    }
  }

  isTileInSquareTiles(tile) {
    if (!tile) {
      for (let t of this.inSquareTiles) {
        if (t.char === tile.char && t.points === tile.points) {
          return t;
        }
      }
    }
    return '';
  }

  removeAllTilesInSquare(tile) {
    this.inSquareTiles = [];
  }

  returnTileToPlayer(tile) {
    this.game.currentPlayer.currentTiles.push(tile);
  }
  moveTilesOnBoardToPlayer() {
    let tilesOnBoard = tilesWithPossibleToMove(this.game.networkInstance.board);
    if (tilesOnBoard.length > 0) {
      this.game.networkInstance.board = removeTilesFromBoard(this.game.networkInstance.board);
      this.game.currentPlayer.currentTiles = [...this.game.currentPlayer.currentTiles, ...tilesOnBoard];
    }
  }

}