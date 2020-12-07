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
    this.closeSpan = document.getElementsByClassName("popupClose")[0];
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
          <span class="popupClose">&times;</span>
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
    this.closeSpan.onclick = () => {
      that.hidePopup();
    }

    this.yesButton.click(function () {
      that.hidePopup();
      that.moveTilesOnBoardToPlayer();
      that.gameEnder.endTheGame();
    });

    this.noButton.click(() => {
      that.hidePopup();
    });
  }

  moveTilesOnBoardToPlayer() {
    let tilesOnBoard = tilesWithPossibleToMove(this.game.board);
    if (tilesOnBoard.length > 0) {
      this.game.board = removeTilesFromBoard(this.game.board);
      this.game.currentPlayer.currentTiles = [...this.game.currentPlayer.currentTiles, ...tilesOnBoard];
    }
  }
}