export default class PlayerList {

  constructor(game) {
    this.game = game;
    this.updatePlayerList();
    $('.gamePage').append(this.createPlayeList());
  }


  createPlayeList() {
    return `
    <div class="playerList"></div>
    `
  }

  updatePlayerList() {
    this.list = this.game.networkInstance.networkStore.players;
    console.log(this.list, 'PlayersListfrom network, PlayerList');
  }

  updateAndShowPlayerList() {
    this.updatePlayerList();
    console.log('in show list');
    //$('.playerList').html('');
    for (let player of this.list) {
      if (this.game.meIndex !== this.list.indexOf(player)) {
        console.log('condition met');
        let playerSpan = '<span class="playerListSpan">' + player.playerName + ': ' + player.points + '</span>';
        $('.playerList').append(playerSpan);
      }
    }
  }

}