'use strict'

function createMine(board) {
    var mine = {
        content: MINE,
        location: {
            i: getRandomIntInclusive(0, gBoard.length - 1),
            j: getRandomIntInclusive(0, gBoard[0].length - 1)
        },
        isShown: false,
        isFlagged: false,
    };
    if (board[mine.location.i][mine.location.j].content === MINE || board[mine.location.i][mine.location.j].isShown) //already has a mine there or the first cell picked
    {
        createMine(gBoard);
    } else board[mine.location.i][mine.location.j] = mine;

}

function renderMines(sizeOfMat) {
    var mineAmount;
    switch (sizeOfMat) {
        case 4:
            mineAmount = 2;
            break;
        case 8:
            mineAmount = 12;
            break;
        case 12:
            mineAmount = 30;
            break;
    }
    for (var i = 0; i < mineAmount; i++) {
        createMine(gBoard);
    }
    // console.table(gBoard);
}