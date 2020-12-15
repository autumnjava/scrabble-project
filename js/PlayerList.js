export default class PlayerList {

  constructor(game) {
    this.game = game;
    this.updatePlayerList();
  }

  updatePlayerList() {
    this.list = this.game.networkInstance.networkStore.players;
    console.log(this.list, 'PlayersListfrom network, PlayerList');
  }
}