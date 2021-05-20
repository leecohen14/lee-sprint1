'use strict'

function createMine(board, i, j) {
    var mine = {
        content: MINE,
        location: {
            i,
            j
        },
        isShown: false,
        isFlagged: false,
        minesNegsCount: null
    };
    if (board[mine.location.i][mine.location.j].content === MINE || board[mine.location.i][mine.location.j].isShown) //already has a mine there or the first cell picked
    {
        createMine(gBoard, getRandomIntInclusive(0, gBoard.length - 1), getRandomIntInclusive(0, gBoard[0].length - 1));
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
        createMine(gBoard, getRandomIntInclusive(0, gBoard.length - 1), getRandomIntInclusive(0, gBoard[0].length - 1));
    }
    // console.table(gBoard);
}