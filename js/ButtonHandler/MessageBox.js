export default class MessageBox {
  constructor(message, messageEngWithCamelCase) {
    this.message = message;
    this.messageEngWithCamelCase = messageEngWithCamelCase;
    this.initial(message, messageEngWithCamelCase);
  }

  initial(message, messageEngWithCamelCase) {
    this.id = 'messageBox' + messageEngWithCamelCase;
    $('.boxes').append(this.createBox(message));
    this.box = $('#' + this.id);
  }

  createBox(message) {
    return `
    <div class="messageBox" id="${this.id}">
      <p>${message}</p>
    </div>
    `
  }

  showMessage() {
    $('#' + this.id).css({ 'display': 'block', 'opacity': '1' });
  }

  hideMessage() {
    $('#' + this.id).css({ 'display': 'none', 'transition': 'opacity 1s ease-out', 'opacity': '0' });
  }

}