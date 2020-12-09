import { removeTilesFromBoard } from "./Helpers/BoardHelper.js";
import { tilesWithPossibleToMove } from "./Helpers/BoardHelper.js";


export default {
  addDragEvents() {
    let that = this;

    // let tile in the stands be draggable
    $('.stand .tile').not('.none').draggabilly({ containment: 'body' })
      .on('dragStart', (e) => that.dragStart(e))
      .on('dragMove', (pointer) => that.dragMove(pointer))
      .on('dragEnd', (e, pointer) => that.dragEnd(e, pointer));
  },

  dragStart(e) {
    let me = $(e.currentTarget); //Tile that we are currently dragging.
    $(me).css({ zIndex: 2 });
    $('.changeTiles .changeTilesSquare').addClass('hover');
    this.lastClickedTile = me;
  },

  dragMove(pointer) {
    let { pageX, pageY } = pointer;

    let $squares = $('.board > div');
    for (let square of $squares) {
      let { top: squareTop, left: squareLeft } = $(square).offset();
      let squareRight = squareLeft + $(square).width();
      let squareBottom = squareTop + $(square).height();

      if (pageX > squareLeft && pageX < squareRight && pageY < squareBottom && pageY > squareTop && !$(square).find('.tile').length) {
        $(square).addClass('hover');
      } else {
        $(square).removeClass('hover');
      }
    }
    this.tileChanger.pointerInSquare(pageX, pageY);
  },

  dragEnd(e, pointer) {
    let { pageX, pageY } = pointer;
    let me = $(e.currentTarget);

    // reset the z-index
    me.css({ zIndex: '' });
    this.tileChanger.squareChangeClass('hover', true);
    if (this.tileChanger.isPointerInSquare(pageX, pageY)) {
      let tilesOnBoard = tilesWithPossibleToMove(this.board);
      if (tilesOnBoard.length > 0) {
        this.currentPlayer.currentTiles = [...this.currentPlayer.currentTiles, ...tilesOnBoard]
        // if there are tiles on the board already
        removeTilesFromBoard(this.board);
        this.render();
        return;
      }
      this.tileChanger.addTileDivInSquare(me);
    }
    else {
      let player = this.players[+$(me).attr('data-player')];
      let tileIndex = +$(me).attr('data-tile');
      let tile = player.currentTiles[tileIndex];

      me.removeClass('onChangeTilesSquare');
      this.tileChanger.removeAllTilesInSquare(); //  because of render()

      // drag the tiles in a different order in the stands
      let $stand = $('.stand');
      let { top, left } = $stand.offset();
      let bottom = top + $stand.height();
      let right = left + $stand.width();
      // if dragged within the limit of the stand
      if (pageX > left && pageX < right && pageY > top && pageY < bottom) {
        let newIndex = Math.floor(8 * (pageX - left) / $stand.width());
        let pt = player.currentTiles;
        // move around
        pt.splice(tileIndex, 1, ' ');
        pt.splice(newIndex, 0, tile);
        //preserve the space where the tile used to be
        while (pt.length > 8) { pt.splice(pt[tileIndex > newIndex ? 'indexOf' : 'lastIndexOf'](' '), 1); }
      }

      // if you have moved a tile to a square on the board
      // (add the square to the board, remove it from the stand)
      let $dropZone = $('.hover');
      if (!$dropZone.length) { this.render(); return; }

      let squareIndex = $('.board > div').index($dropZone);

      // convert to y and x coords in this.board
      this.y = Math.floor(squareIndex / 15);
      this.x = squareIndex % 15;

      // put the tile on the board and re-render
      this.networkInstance.board[this.y][this.x].tile = player.currentTiles.splice(tileIndex, 1)[0];
      this.networkInstance.board[this.y][this.x].tile.possibleToMove = true;
      this.wordCheckerInstance.sortTiles(tile, this.x, this.y, this.currentPlayer);
      this.render();
      this.emptyTileHandler.checkIfEmptyTile(this.board[this.y][this.x].tile);
    }
    this.lastClickedTile = me;
  },

  moveTilesAroundBoard() {
    //NOTE: can only be done on those tiles that are placed during CURRENT round (ie before skipping round).
    $('.board .tile').filter("[data-possibletomove]").draggabilly({ containment: 'body' })
      .on('dragStart', (e) => this.dragStart(e))
      .on('dragMove', (pointer) => this.dragMove(pointer))
      .on('dragEnd', (e, pointer) => this.boardDragEnd(e, pointer));
  },

  boardDragEnd(e, pointer) {
    let { pageX, pageY } = pointer;
    let that = this;
    let me = $(e.currentTarget);
    let oldIndex = +$(me).attr('data-tile');
    let oldY = Math.floor(oldIndex / 15);
    let oldX = oldIndex % 15;
    let oldObject = this.networkInstance.board[oldY][oldX].tile;
    let oldSquare = this.networkInstance.board[oldY][oldX];

    // reset the z-index
    me.css({ zIndex: '' });
    this.tileChanger.squareChangeClass('hover', true);
    if (this.tileChanger.isPointerInSquare(pageX, pageY)) { // if dropped on change tiles square
      if (tilesWithPossibleToMove(this.board).length > 0) {
        // if there are tiles on the board already
        removeTilesFromBoard(this.board);
      }
      this.tileChanger.addTileDivInSquareFromBoard(me); // add tile back to player (still on board)
      this.lastClickedTile = me;
      return;
    }
    else {

      me.removeClass('onChangeTilesSquare');
      this.tileChanger.removeAllTilesInSquare();

      //IF USER WANTS TO PUT IT BACK TO THE STAND:
      let $stand = $('.stand');
      let { top, left } = $stand.offset();
      let bottom = top + $stand.height();
      let right = left + $stand.width();
      let player = that.players[+$(me).attr('data-player')];
      // if dragged within the limit of the stand
      // NOTE: Later maybe need to check if the stand is not full. at the moment not needed
      if (pageX > left && pageX < right
        && pageY > top && pageY < bottom) {
        let newIndex = Math.floor(8 * (pageX - left) / $stand.width());
        let pt = player.currentTiles;
        // move around
        pt.splice(newIndex, 0, oldObject); //add back to stand
        this.wordCheckerInstance.removeFromPlayerTilesPlaced(oldObject, player);
        delete oldSquare.tile; //delete property tile from oldSquare
      }

      // if you have moved a tile to a square on the board
      let $dropZone = $('.hover');
      if (!$dropZone.length) { this.render(); return; }
      let squareIndex = $('.board > div').index($dropZone);

      // convert to y and x coords in this.board
      let newY = Math.floor(squareIndex / 15);
      let newX = squareIndex % 15;

      delete oldSquare.tile;
      this.networkInstance.board[newY][newX].tile = oldObject;
      this.lastClickedTile = me;
      this.render();
    }
  }

} //end of export default