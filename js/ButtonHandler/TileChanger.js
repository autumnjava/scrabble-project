export default class TileChanger { 

  constructor(game) { 
    this.game = game;
    this.button = $('.changeTilesButton');
    this.square = $('.changeTiles .changeTilesSquare');
  }


  clickOnEventHandler() { 
    console.log('Hellooooo');
  }

  squareChangeClass(className, remove = false) {
    if (!remove) {
      this.square.addClass(className)
    }
    else this.square.removeClass(className);
  }

  hideButton(minTilesToShow) { 
    if (this.game.tiles.length < minTilesToShow) {
      this.button.hide();
    }
  }

  pointerInSquare(pointerX, pointerY) {
    if (this.isPointerInSquare(pointerX, pointerY)) {
      this.squareChangeClass('hover')
    } else {
      this.squareChangeClass('hover', true);
    }
  }

  isPointerInSquare(pointerX, pointerY) { 
    let { top, left } = this.square.offset();
    let right = this.square.width() + left;
    let bottom = this.square.height() + top;
    return (pointerX > left && pointerX < right && pointerY < bottom && pointerY > top);
  }

}