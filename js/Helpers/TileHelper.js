export const getTileDivDatasetAsObject = (clickedTile) => { 
  return clickedTile[0].dataset;
}

export const getTileDivInnerHtmlAsObject = (clickedTile) => {
  return clickedTile[0].innerHTML;
}

export const getTileDivInnerTextAsObject = (clickedTile) => {
  return clickedTile[0].innerText;
}

export const getTileDivAsATileObject = (clickedTile) => { 
  let tileInfo = getTileDivInnerTextAsObject(clickedTile).split('');
  tileInfo = [tileInfo[0], (tileInfo[2] === NaN ? 0 : tileInfo[2])];
  return { char: tileInfo[0], points: +tileInfo[1] };
}

