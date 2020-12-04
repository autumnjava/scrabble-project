console.log("hello");

function EmptyTile() {
  this.render = function () {
    $("#emptyTilePopupBox").css({ display: block });
  }
  console.log("in function");
}
let temp = new EmptyTile();

function run() { 
  temp.render();
}

run();