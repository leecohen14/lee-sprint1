'use strict'

function revealNegs(location) {
    var iIdx = location.i;
    var jIdx = location.j;
    for (var i = 0; i < 3; i++) {
        if (!(iIdx - 1 + i >= 0 && iIdx - 1 + i <= gBoard.length - 1)) continue;
        for (var j = 0; j < 3; j++) {
            if (!(jIdx - 1 + j >= 0 && jIdx - 1 + j <= gBoard[0].length - 1)) continue;
            var checkedCell = gBoard[iIdx - 1 + i][jIdx - 1 + j];
            var currCellLocation = { i: iIdx - 1 + i, j: jIdx - 1 + j }
            if (checkedCell.content === MINE) return;
            if (checkedCell.content === EMPTY) {
                if (checkedCell.minesNegsCount === 0) {
                    // gBoard[iIdx - 1 + i][jIdx - 1 + j].isShown = true;
                    if (checkedCell.isShown) continue;
                    renderCell(currCellLocation);
                    if (currCellLocation.i === location.i && currCellLocation.j === location.j) continue;
                    revealNegs(currCellLocation);
                } else {
                    gBoard[iIdx - 1 + i][jIdx - 1 + j].isShown = true;
                    renderCell(currCellLocation);

                }
            }
        }
    }
    return;
}