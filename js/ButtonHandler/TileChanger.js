import { getTileDivDatasetAsObject } from "../Helpers/TileHelper.js";
import { getTileDivInnerHtmlAsObject } from "../Helpers/TileHelper.js";
import { getTileDivInnerTextAsObject } from "../Helpers/TileHelper.js";


export default class TileChanger {

  constructor(game) {
    this.game = game;
    this.changeTilesDiv = $('.changeTiles');
    this.button = $('.changeTilesButton');
    this.square = $('.changeTiles .changeTilesSquare');
    this.inSquareTiles = [];
  }


  clickOnEventHandler() {
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
    if (this.game.tiles.length < minTilesToShow) {
      this.changeTilesDiv.hide();
    }
  }

  hideButton(minTilesToShow) {
    if (this.game.tiles.length < minTilesToShow) {
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

  addTileDiv(tileDiv) {
    let tileIndex = getTileDivDatasetAsObject(tileDiv).tile;
    let tile = this.game.currentPlayer.currentTiles[tileIndex];
    if (!tile) {
      //if tile is being dragged from the board i.e 'tile is undefined'
      let oldY = Math.floor(tileIndex / 15);
      let oldX = tileIndex % 15;
      tile = this.game.board[oldY][oldX].tile;
      delete this.game.board[oldY][oldX].tile; //delete .tile from the board
    }

    if (!this.inSquareTiles.includes(tile)) {
      this.inSquareTiles.push(tile);
    }
  }

  isTilesOnBoard(tileDiv) { 
    console.log("isTileOnBoard");
  }

  returnTileToPlayer(tileDiv) { 
    let tileInfo = getTileDivInnerTextAsObject(tileDiv).split('');
    tileInfo = [tileInfo[0], tileInfo[2]];
    let tile = {char: tileInfo[0], points: +tileInfo[1]}
    this.game.currentPlayer.currentTiles.push(tile);
    console.log(this.game.currentPlayer.currentTiles);
    console.log('before', this.inSquareTiles);
    if (this.inSquareTiles.includes(tile)) {
      this.inSquareTiles = this.inSquareTiles.split(this.inSquareTiles.indexOf(tile), 1);
    }
    console.log('after', this.inSquareTiles);

  }

}