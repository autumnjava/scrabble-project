import { tilesWithPossibleToMove } from "../Helpers/BoardHelper.js";
import { removeTilesFromBoard } from "../Helpers/BoardHelper.js";

export default class TurnSkipper {

  constructor(game) {
    this.game = game;
    this.button = $("#skipButton");
  }

  clickOnEventHandler() {
    this.moveTilesOnBoardToPlayer();
    let store = this.game.networkInstance.networkStore;
    store.players[store.currentPlayerIndex].attemptCounter += 1;
  }

  moveTilesOnBoardToPlayer() {
    let tilesOnBoard = tilesWithPossibleToMove(this.game.networkInstance.board);
    if (tilesOnBoard.length > 0) {
      this.game.networkInstance.board = removeTilesFromBoard(this.game.networkInstance.board);
      this.game.currentPlayer.currentTiles = [...this.game.currentPlayer.currentTiles, ...tilesOnBoard];
    }
  }
}