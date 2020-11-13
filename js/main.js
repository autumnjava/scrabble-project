import Game from './Game.js';

const startGameButton = $('#startGameButton');
console.log(startGameButton.position());
new Game().start();
