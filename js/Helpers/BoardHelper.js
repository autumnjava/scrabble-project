export const tilesWithPossibleToMove = (board) => {
  let tiles = [];
  board.flat().forEach(square => {
    if (square.tile !== undefined) {
      if (square.tile.possibleToMove) { 
        tiles.push(square.tile);
      }
    }
  })
  return tiles;
}