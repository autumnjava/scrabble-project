export default class Instructions {

  constructor(game) {
    this.game = game;
    this.initial();
  }

  initial() {
    $('.gamePage').append(this.createPopupBox());
    this.instructionsBox = $('#instructionsBox');
    this.closeSpan = $("#instructionsClose");
    this.buttonHandlers();
  }

  //Create div for message
  createPopupBox() {
    return `
      <div id="instructionsBox">
        <div id="instructionsBoxContent">
          <span class="instructionsClose" id="instructionsClose">&times;</span>
          <p><span class=tilesSpan> Bokstavsbrickorna </span> Totalt finns 100 bokstavsbrickor, varav två blanka. Varje bokstav förekommer i ett visst antal och är värd en viss poäng som finns angiven i brickans nedre högra hörn. De blanka brickorna har inget poängvärde, 
          men en blank bricka fungerar som en ”joker” och kan användas som vilken bokstav som helst. Den bokstav som den blanka brickan tilldelas kan inte ändras under det fortsatta spelet.

          Den bokstav som den blanka brickan tilldelas kan inte ändras under det fortsatta spelet.
          <span class=boardSpan>Spelbrädet</span> Spelbrädet består av ett rutmönster med 15x15 rutor. På spelbrädet finns speciella 
          bonusrutor (vars placering och antal beror på valet av spelbräde). Dessa rutor ger dubbla respektive tredubbla bokstavspoängen för den bricka som placeras på någon av dessa rutor.

            Dessa rutor ger dubbel respektive tredubbel ordpoäng när en bricka läggs på någon av dessa rutor. OBSERVERA: Bonuspoängen gäller bara första gången en bricka läggs på någon av dessa rutor. Därefter får brickan sitt ”vanliga” bokstavsvärdet.
            
            <span class=turnsSpan> Spelomgång </span> Varje spelare börjar med sju brickor på hand. Övriga brickor finns så länge i ”brickpåsen”. 
            Amtalet brickor hos varje spelare förblir därefter sju under spelet, tills det inte längre finns några brickor kvar att fylla 
            på med från påsen. I varje omgång kan spelaren på tur välja mellan att byta brickor, stå över (passa) eller lägga ut 
            bokstavsbrickor på spelplanen. Du kan endast byta brickor om det finns minst sju brickor kvar i ”brickpåsen”. För att 
            byta placerar du ut de bokstäver du vill byta någonstans på spelplanen och trycker sedan på knappen ”Byt brickor". 
            Passar gör du genom att trycka på knappen ”Pass”. Om spelaren väljer att lägga ut brickor fås poäng för varje nytt 
            ord som bildas. Varje nytt ords poäng fås genom att de i ordet ingående bokstavsbrickornas poäng summeras 
            (med hänsyn tagen till om någon bricka läggs på en bonusruta).

            <span class=wordsSpan> Vilka är ord är godkända? </span> Alla ord i den 14:e upplagan av Svenska Akademiens Ordlista (SAOL14) som står som 
            egna uppslagsord i fetstil och är minst två bokstäver långa är godkända.

            <span class=endSpan> Spelets slut </span> Spelet är slut när inga brickor längre finns kvar i ”påsen” och en av 
            spelarna lagt ut alla brickorna som han/hon har på hand. Spelet avslutas också om samtliga spelare passar, byter
             eller misslyckas lägga något ord tre gånger i rad.

             <span class=pointsSpan> Poängavdrag </span> Den spelare som har brickor kvar när spelet är 
             slut får poängavdrag för de brickor som han/hon har kvar. Ett Z och ett S kvar på hand ger 
             t.ex 10+1=11 poängs avdrag. Den spelare som lagt ut alla sina brickor får ett poängtillägg svarande mot summan
              av övriga spelares poängavdrag.
            </p>
        </div>
      </div>
    `
  }

  //Shows message
  showInstructions() {
    this.instructionsBox.css({ display: 'block' });
  }

  //Hides message
  hideInstructions() {
    this.instructionsBox.css({ display: 'none' });
  }

  buttonHandlers() {
    let that = this;
    this.closeSpan.click(function () {
      that.hideInstructions();
      that.game.render();
    });
  }

}