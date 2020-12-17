export default class PlayerList {

  constructor(game) {
    this.game = game;
    this.updatePlayerList();
    $('.playerGameContent').prepend(this.createPlayeList());
  }


  createPlayeList() {
    return `
    <div class="playerList"></div>
    `
  }

  updatePlayerList() {
    this.list = this.game.networkInstance.networkStore.players;
  }

  updateAndShowPlayerList() {
    this.updatePlayerList();
    $('.playerList').html('');
    for (let player of this.list) {
      if (this.game.meIndex !== this.list.indexOf(player)) {
        let playerSpan = '<span class="playerListSpan">' + this.truncatePlayerNames(player.playerName) + ': ' + player.points + '</span>';
        $('.playerList').append(playerSpan);
      }
    }
  }

  truncatePlayerNames(playerName) { 
    let length = 3;
    return playerName.substring(0, length) + (playerName.length <=3 ? '': '.');
  }

}