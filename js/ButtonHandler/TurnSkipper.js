import { tilesWithPossibleToMove } from "../Helpers/BoardHelper.js";
import { removeTilesFromBoard } from "../Helpers/BoardHelper.js";

export default class TurnSkipper {

  constructor(game) {
    this.game = game;
    this.button = $("#skipButton");
  }

  clickOnEventHandler() {
    this.moveTilesOnBoardToPlayer();
    this.game.currentPlayer.attemptCounter++;
    this.game.gameEnder.checkGameEnd();
  }

  moveTilesOnBoardToPlayer() {
    let tilesOnBoard = tilesWithPossibleToMove(this.game.networkInstance.board);
    if (tilesOnBoard.length > 0) {
      this.game.networkInstance.board = removeTilesFromBoard(this.game.networkInstance.board);
      this.game.currentPlayer.currentTiles = [...this.game.currentPlayer.currentTiles, ...tilesOnBoard];
    }
  }
}