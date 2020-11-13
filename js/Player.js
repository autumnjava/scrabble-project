export default class Player {

  constructor(name, myGame) {
    this.name = name;
    this.myGame = myGame;
    this.tiles = [...this.myGame.getTiles(), ' '];
  }
}