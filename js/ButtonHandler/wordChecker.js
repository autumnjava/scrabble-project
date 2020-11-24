export default WordChecker {

  constructor(game) {
    this.game = game;
  }


  checkWordWithSAOL() {


    console.log(this.wordToCheck);

    if (SAOLchecker.scrabbleOk(this.wordToCheck)) {
      console.log(this.wordToCheck);
      console.log('word was a word!');
    }

    else if (this.reverseWordToCheck(this.wordToCheck)) {
      console.log('Word was a word but reversed')
    }
    else {
      console.log('word was not a word');
      this.currentPlayer.attemptCounter++;
    }
  }

  reverseWordToCheck(reversedWord) {
    reversedWord = '';
    function reverseString(str) {
      var newString = "";
      for (var i = str.length - 1; i >= 0; i--) {
        newString += str[i];
      }
      return newString;
    }
    reverseString(reversedWord);
    console.log(reversedWord);
    SAOLchecker.scrabbleOk(reversedWord);
  }

}