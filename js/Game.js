//import Player from "./Player.js";
export default class Game {


  async start() {
    // show the start page first
    this.showFrontPage();
    // Click the button "start game" to start playing
    this.buttonWork();
  }

  showFrontPage() {
    let formToFills = [
      { label: 'Player 1', required: true },
      { label: 'Player 2', required: true },
      { label: 'Player 3', required: false },
      { label: 'Player 4', required: false }
    ]
    console.log('hej')
    let askPlayerNameFormDiv = $('<div class="form"></div>');
    let formTag = $('<form></form>');
    for (let formToFill of formToFills) {
      formTag.append(`
        <div>
        <label for="username">${formToFill.label}</lable>
        <input type="text" id="playername" placeholder="Write name here..." ${formToFill.required ? 'required' : ''}>
        </div>
      `)
    }
    formTag.append(`<input type="submit" value="Submit the form">`);
    askPlayerNameFormDiv.append(formTag);

    //${ formToFill.required ? 'required' : '' }
    $('body').append(askPlayerNameFormDiv);
  }


  //Click on a button "start game" and it will dissappear
  buttonWork() {

    let startGameButton = $('#startGameButton');
    startGameButton.on('click', () => {
      $('#startGameButton').css("display", "none");
    });
  }


}






