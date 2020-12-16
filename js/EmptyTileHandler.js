import { tilesWithPossibleToMove } from "./Helpers/BoardHelper.js";

export default class EmptyTileHandler {

  constructor(game) {
    this.game = game;
    this.initial();
  }

  initial() {
    $('.gamePage').append(this.createPopupBox());
    this.popupBox = $('#emptyTilePopupBox');
    this.closeSpan = $("#popupClose");
    this.submitButton = $("#emptySubmitButton");
    this.buttonHandlers();
  }

  checkIfEmptyTile(tile) {
    let isEmptyTile = this.isTileEmptyTile(tile);
    if (isEmptyTile) {
      this.emptyTile = tile;
      this.showPopup();
    }
    return isEmptyTile;
  }

  isTileEmptyTile(tile) {
    if (tile) {
      return tile.char === " ";
    }
    return false;
  }

  createPopupBox() {
    return `
      <div id="emptyTilePopupBox">
        <div id="emptyTilePopupBoxContent">
          <span class="popupClose" id="popupClose">&times;</span>
          <p>Var god och mata in en bokstav till den tomma brickan!</p>
          <br>
            <input type="text" id="emptyTileInput" placeholder="Skriv in bokstaven här" minlength="1" maxlength="1" required>
            <button class="emptyTileSubmitButton" name="emptyTileSubmitButton" id="emptySubmitButton" type="submit">Okej</button>
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
    $('input[id=emptyTileInput]').val('');
    $('input[id=emptyTileInput]').attr('placeholder', 'Skriv in bokstaven här');

  }

  buttonHandlers() {
    let that = this;
    this.closeSpan.click(function () {
      that.moveTileBackToPlayer();
      that.hidePopup();
      that.game.render();
    });

    this.submitButton.click(function () {
      let letter = document.getElementById("emptyTileInput").value;
      $('input[id=emptyTileInput]').val('');
      that.checkInputValidAndChange(letter);
    })
  }

  checkInputValidAndChange(letter) {
    let isValid = letter.length === 1 && (letter.match(/^[a-zåÅäÄöÖ]+$/i));
    if (isValid) {
      this.emptyTile.char = letter.toUpperCase();
      this.hidePopup();
      this.game.render();
    }
    else {
      this.tryAgain();
    }
  }

  tryAgain() {
    $('input[id=emptyTileInput]').val('');
    $('input[id=emptyTileInput]').attr('placeholder', 'Försök igen!');
  }

  moveTileBackToPlayer() {
    delete this.emptyTile.possibleToMove;
    delete this.game.networkInstance.board[this.game.y][this.game.x].tile;
    this.game.currentPlayer.currentTiles.push(this.emptyTile);
  }
}