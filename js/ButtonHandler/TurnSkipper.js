import { tilesWithPossibleToMove } from "../Helpers/BoardHelper.js";
import { removeTilesFromBoard } from "../Helpers/BoardHelper.js";

export default class TileChanger { 

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
    let tilesOnBoard = tilesWithPossibleToMove(this.game.board);
    if (tilesOnBoard.length > 0) { 
      this.game.board = removeTilesFromBoard(this.game.board);
      this.game.currentPlayer.currentTiles = [...this.game.currentPlayer.currentTiles, ...tilesOnBoard];
    }
  }
}