'use strict'
var gMyMines = []; //reset me every game
function createMine(board, i, j, forbiddenLocation = { i: -1, j: -1 }) {
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
    if (board[mine.location.i][mine.location.j].content === MINE ||
        board[mine.location.i][mine.location.j].isShown || //already has a mine there or the first cell picked
        (forbiddenLocation.i === i && forbiddenLocation.j === j)) {
        createMine(gBoard, getRandomIntInclusive(0, gBoard.length - 1), getRandomIntInclusive(0, gBoard[0].length - 1), forbiddenLocation);
    } else board[mine.location.i][mine.location.j] = mine;
    gMyMines.push({ i, j })
}

function renderMines(sizeOfMat, forbiddenLocation) {
    if (gMyMines.length) {
        for (var i = 0; i < gMyMines.length; i++) {
            var mine = {
                content: MINE,
                location: {
                    i: gMyMines[i].i,
                    j: gMyMines[i].j
                },
                isShown: false,
                isFlagged: false,
                minesNegsCount: null
            };
            gBoard[gMyMines[i].i][gMyMines[i].j] = mine;
        }
        console.log('gBoard :>> ', gBoard);
        return;
    }
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
        createMine(gBoard, getRandomIntInclusive(0, gBoard.length - 1), getRandomIntInclusive(0, gBoard[0].length - 1), forbiddenLocation);
    }
    // console.table(gBoard);
}