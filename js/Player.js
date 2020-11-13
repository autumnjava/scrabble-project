
export default class Player {


  //Constructor for player class
  constructor(name, myGame) {
    this.name = name;
    this.myGame = myGame;
    this.currentTiles = [...this.myGame.getTiles(), ' '];
    this.points = 0;
  }


  //Method to write information about player and tiles
  render() {

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
      <div class="pname">${this.name}</div>
      `;
  }


}