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
    this.popupBox.css({ display: 'block' });
  }

  eventHandlers() { 
    let that = this;
    this.closeSpan.onclick = function () {
      that.popupBox.css({ display: 'none' });
      // move tile back to player
    }

    this.submitButton.click(function () { 
      console.log("pressed");
      let val = document.getElementById(emptyTileInput).value;
      console.log(val,"input value");
    })
  }

}