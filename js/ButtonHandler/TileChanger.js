import { getTileDivDatasetAsObject } from "../Helpers/TileHelper.js";

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
      console.log("tile removed");
      console.log(this.inSquareTiles);
      let newTiles = [...playerTiles, ...this.game.getTiles(this.inSquareTiles.length)];
      this.game.currentPlayer.currentTiles = newTiles;
      this.inSquareTiles = [];
    }
    else {
      this.game.currentPlayer.currentTiles = [...this.game.getTiles(), ' '];
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
    if (!this.inSquareTiles.includes(tile)) { 
      this.inSquareTiles.push(tile);
    }
  }

}