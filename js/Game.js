import Player from "./Player.js";
export default class Game {

  async start() {

    //this.createBoard();
    //await this.tilesFromFile();
    // console.table is a nice way
    // to log arrays and objects
    //console.log(this.board);
    //onsole.table(this.tiles);
    // create players
    //this.players = [

    //Create players according to desired amount of players, and their names
    //maybe a for loop to create players? Smth like if player wants to create 3 players and entered their names, then for loop to create 3 players
    //new Player(this, 'Player 1'),
    //new Player(this, 'Player 2')

    //];
    //console.table(this.players);
    // render the board + players
    //this.render();

    console.log('Starting the game.')
  }

  startButtonListener() {
    $('.button-start-game').click(() => alert('Here i will actually call the start() method'));
  }

}