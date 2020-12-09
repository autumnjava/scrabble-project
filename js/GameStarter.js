export default class GameStarter {

  constructor(game) {
    this.game = game;
    this.initial();
  }

  initial() {
    $('.startPage').append(this.createContent());
    this.popupBox = $('#connectToGamePopupBox');
    this.closeSpan = $("#connectPopupClose");
    this.submitButton = $("#connectToGameSubmitButton");
    this.buttonHandlers();
  }

  createContent() {
    return `
      <div id="connectToGamePopupBox">
        <div id="connectToGamePopupBoxContent">
          <span class="popupClose" id="connectPopupClose">&times;</span>
          <p>Var god och mata in nätverksnyckeln!</p>
          <br>
            <input type="text" id="connectToGameInput" placeholder="Skriv in nyckeln här" required}>
            <button class="connectToGameSubmitButton" name="connectToGameSubmitButton" id="connectToGameSubmitButton" type="submit">Okej</button>
        </div>
      </div>
    `
  }

  buttonHandlers() {
    let that = this;
    this.closeSpan.click(function () {
      that.hidePopup();
    });
    this.submitButton.click(function () {
      let networkKey = $('input[id="connectToGameInput"]').val();
      that.game.networkInstance.connectToStore(networkKey, that.game.networkInstance.listener);
    })
  }

  showPopup() {
    this.popupBox.css({ display: 'block' });
  }
  hidePopup() {
    this.popupBox.css({ display: 'none' });
    $('input[id=connectToGameInput]').val('');
  }

}