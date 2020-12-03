export const tilesWithPossibleToMove = (board) => {
  let tiles = [];
  board.flat().forEach(square => {
    if (square.tile !== undefined) {
      if (square.tile.possibleToMove) {
        tiles.push(square.tile);
      }
    }
  });
  return tiles;
}

export const removeTilesFromBoard = (board) => {
  let newBoard = board;
  newBoard.flat().forEach(square => {
    if (square.tile !== undefined) {
      if (square.tile.possibleToMove) {
        delete square.tile;
      }
    }
  })
  return newBoard;
}

export const changePossibleToMoveToFalse = (board) => {
  let newBoard = board;
  newBoard.flat().map((x) => {
    if (x.tile) { // same as if(typeof x.tile !== "undefined")
      x.tile.possibleToMove = false;
    }
  });
  return newBoard;
}