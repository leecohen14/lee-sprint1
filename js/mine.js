'use strict'


var gMines = [];

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
    if (board[mine.location.i][mine.location.j].content === MINE || board[mine.location.i][mine.location.j].isShown) //already has a mine there
    {
        // console.log('tried to put mine on taken cell', mine.location); // just to know if happened
        createMine(gBoard);
    } else board[mine.location.i][mine.location.j] = mine;

    // var mine2 = {
    //     location: {
    //         i: 1,
    //         j: 1
    //     },
    //     content: MINE,
    //     isShown: false,
    //     isFlagged: false,
    // };
    // board[mine2.location.i][mine2.location.j] = mine2;


}

function renderMines(sizeOfMat) {
    var length;
    switch (sizeOfMat) {
        case 4:
            length = 2;
            break;
        case 8:
            length = 12;
            break;
        case 12:
            length = 30;
            break;
    }
    for (var i = 0; i < length; i++) {
        createMine(gBoard);
    }
    console.table(gBoard);
}