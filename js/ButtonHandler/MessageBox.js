export default class MessageBox { 
  constructor(message) {
    this.message = message;
    this.box = this.createBox(message);
  }

  createBox(message) { 
    return `
    <div class="messageBox" id="messageBox">
      <p>${message}</p>
    </div>
    `
  }

}