export default class TileChanger { 

  constructor(game) { 
    this.game = game;
    this.button = $('.changeTilesButton');
  }


  clickOnEventHandler() { 

  }

  hideButton(minTilesToShow) { 
    if (this.game.tiles.length < minTilesToShow) {
      this.button.hide();
    }
  }
  
}