import Rack from "./Rack.js";
import Tile from "./Tile.js";

export default class Player {
  rack = new Rack();

  constructor(name) {
    this.name = name;
    this.points = 0;
    this.correctWordCounter = 0;
    this.attemptCounter = 0;
    this.tilePoints = 0;
    this.tilesPlaced = [];
  }

  async render() {
    $('player').remove();
    let player = $(`<player></player>`);
    let panel = $(`<panel></panel>`);

    player.append(panel);

    this.rack.render(panel);

    panel.append(`
      <name>Player: ${this.name}</name>
      <points>Points: ${this.points}</points>
    `);
    /*
    return `<div class="stand">
      ${this.currentTiles.map((x, i) => `<div 
          class="tile ${x.char ? '' : 'none'}"
          data-player="${this.myGame.players.indexOf(this)}"
          data-tile="${i}"
        >
        ${x.char || ''}
        <span>${x.points || ''}</span>
      </div>`).join('')}
      </div>
    
      
       <div class="player-icon">

      <div class="icon"><i class="fas fa-user fa-3x"></i></div>
       <div class="pname">${this.name}  </div>
      </div>
     
      `;
      */
    $('game right').append(player);
  }

  getName() { return this.name; }

  addTiles(tiles) {
    if (this.rack.tiles.length + tiles.length <= 7) {
      this.rack.addTiles(tiles);
    }
    this.render();
  }
}