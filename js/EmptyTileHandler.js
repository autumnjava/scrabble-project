export default class EmptyTileHandler { 

  constructor(game) {
    this.game = game;
    this.initial();
  }

  initial() {
    $('.gamePage').append(this.createPopupBox());
    this.popupBox = $('#emptyTilePopupBox');
    this.closeSpan = document.getElementsByClassName("popupClose")[0];
    this.submitButton = $("#emptySubmitButton");
  }

  checkIfEmptyTile(tile) {
    let isEmptyTile = this.isTileEmptyTile(tile);
    if (isEmptyTile) {
      this.emptyTile = tile;
      this.showPopup();
      this.eventHandlers();
      //this.changeTileChar(tile);
    }
  }

  isTileEmptyTile(tile) {
    if (tile) {
      return tile.char === " ";
    }
    return false;
  }

  changeTileChar(tile){
    if (tile.char === " ") {
      console.log('Empty tile found')

      let myBool = false;
      while (!myBool) {

        let letter = prompt('Please write in 1 letter for empty tile', '');

        //Place letter in empty tile if: letter is not null, length of letter is 1 and letter is not a number
        if (letter != null && letter.length == 1 && Number.isNaN(parseInt(letter))) {
          letter = letter.toUpperCase();
          myBool = true;
          tile.char = letter;

          this.game.render();
          console.log('new tile on x and y:', tile)
        }
      }
    }
  }

  createPopupBox() { 
    return `
      <div id="emptyTilePopupBox">
        <div id="emptyTilePopupBoxContent">
          <span class="popupClose">&times;</span>
          <p>Var god och mata in en bokstav till den tomma brickan!</p>
            <input type="text" id="emptyTileInput" placeholder="Skriv in bokstaven här" minlength="1" maxlength="1" required}>
            <button class="emptyTileSubmitButton" name="emptyTileSubmitButton" id="emptySubmitButton" type="submit">Okej</button>
        </div>
      </div>
    `
  }

  showPopup() { 
    console.log("showing popup");
    $('body .tile').css({ "zIndex": "3", "position": "static" });
    this.popupBox.css({ display: 'block' });
  }

  hidePopup() {
    console.log("hide popup");
    $('body .tile').css({ "zIndex": "1", "position": "relative" });
    $('.board .tile').css({ "position": "absolute" });
    this.popupBox.css({ display: 'none' });
  }

  eventHandlers() {
    let that = this;
    this.closeSpan.onclick = function () {
      that.hidePopup();
      // move tile back to player
    }

    this.submitButton.click(function () {
      let input = document.getElementById("emptyTileInput").value;
      console.log(input, "1");
      $('input[id=emptyTileInput]').val('');
      console.log(input,"2");
      that.checkInputValidAndChange(input);
    })
  }

  checkInputValidAndChange(letter) { 
    let isValid = letter.length === 1 && letter.match(/[a-z]/i);
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
    $('input[id=emptyTileInput]').attr('placeholder','Försök igen!');
  }
}