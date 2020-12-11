import { tilesWithPossibleToMove } from "../Helpers/BoardHelper.js";
import { removeTilesFromBoard } from "../Helpers/BoardHelper.js";

export default class Exit {

  constructor(game) {
    this.game = game;
    this.initial();
  }

  initial() {
    this.button = $('#exitButton');
    this.buttonDiv = $('.exitButton');
    this.gameEnder = this.game.gameEnder;

    $('.gamePage').append(this.createPopupBox());
    this.popupBox = $('#exitPopupBox');
    this.closeSpan = $('#exitPopupClose');
    this.yesButton = $("#exitButtonYes");
    this.noButton = $("#exitButtonNo");
    this.buttonHandlers();
  }

  clickOnEventHandler() {
    this.showPopup();
  }

  createPopupBox() {
    return `
      <div id="exitPopupBox">
        <div id="exitPopupBoxContent">
          <span class="popupClose" id="exitPopupClose">&times;</span><br>
          <p>Vill du lämna spelet?</p>
            <button class="exitButtonYes" name="exitButtonYes" id="exitButtonYes">Ja</button>
            <button class="exitButtonNo" name="exitButtonNo" id="exitButtonNo">Nej</button>
        </div>
      </div>
    `
  }

  showPopup() {
    $('body .tile').css({ "zIndex": "3", "position": "static" });
    this.popupBox.css({ display: 'block' });
  }

  hidePopup() {
    $('body .tile').css({ "zIndex": "1", "position": "relative" });
    $('.board .tile').css({ "position": "absolute" });
    this.popupBox.css({ display: 'none' });
  }

  buttonHandlers() {
    let that = this;
    this.closeSpan.click(() => {
      that.hidePopup();
    });

    this.yesButton.click(function () {
      console.log("YES button pressed");
      that.hidePopup();
      that.moveTilesOnBoardToPlayer();
      that.gameEnder.endTheGame(true); // just calculates and sort player list
      that.game.networkInstance.networkStore.exitPressed = true; // set it to true
      that.game.networkInstance.changePlayer();
    });

    this.noButton.click(() => {
      console.log("NO button pressed");
      that.hidePopup();
    });
  }

  moveTilesOnBoardToPlayer() {
    let tilesOnBoard = tilesWithPossibleToMove(this.game.networkInstance.board);
    if (tilesOnBoard.length > 0) {
      this.game.networkInstance.board = removeTilesFromBoard(this.game.networkInstance.board);
      this.game.currentPlayer.currentTiles = [...this.game.currentPlayer.currentTiles, ...tilesOnBoard];
    }
  }
}