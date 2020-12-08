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
    $('#' + this.id).show();
  }

  hideMessage() {
    $('#' + this.id).hide();
  }

}