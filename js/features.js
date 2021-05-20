'use strict'

function onUndo() {
    console.log('tried to undo :>> ');
    //--- DIDNT WORK WELL ----
    // console.log(gLastBoards);
    // copy to gBoard
    // copyBoard(gLastBoards[gLastBoards.length - 1], gBoard);
    // renderBoard();
}

function copyBoard(fromBoard, toBoard) { //deep copy array to array
    toBoard = [];
    for (var i = 0; i < fromBoard.length; i++) {
        toBoard[i] = [];
        for (var j = 0; j < fromBoard[0].length; j++) {
            toBoard[i][j] = {
                content: fromBoard[i][j].content,
                location: { i: fromBoard[i][j].location.i, j: fromBoard[i][j].location.j },
                isShown: fromBoard[i][j].isShown,
                isFlagged: fromBoard[i][j].isFlagged,
                minesNegsCount: fromBoard[i][j].minesNegsCount
            };
        }
    }
}

function onSafeClick() {
    if (gSafeClicksLeft === 0) return; //later just disable the button after 3rd click

    var location = {
        i: getRandomIntInclusive(0, gBoard.length - 1),
        j: getRandomIntInclusive(0, gBoard[0].length - 1)
    }

    if (gBoard[location.i][location.j].content === EMPTY && !gBoard[location.i][location.j].isShown) {
        //do
        var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
        console.log('elCell :>> ', elCell);
        addClass(elCell, 'safe');
        setInterval(() => {
            removeClass(elCell, 'safe');
        }, 1500);
        gSafeClicksLeft--;
        document.querySelector('.safeClickSpan').innerText = gSafeClicksLeft;
        if (gSafeClicksLeft === 0) {
            document.querySelector('button').disabled = true;
        }

    } else {
        onSafeClick();
    }
}

function hintOn(elLamp) {
    gElLamp = elLamp;
    if (gHints === 0) return;
    gHintMode = true;
    // show hint

    // add lampOn class 
    lampLightOn(elLamp);
    // clean inner text after 1 second

    // hide the hint
    // whattodo??

}

function lampLightOn(elLamp) {
    addClass(elLamp, 'lampOn');


}

function showHintCells(location) {
    //negs loop , change the html to the content or negsnum and render back the board
    var cellsArr = [];
    var iIdx = location.i;
    var jIdx = location.j;
    for (var i = 0; i < 3; i++) {
        if (!(iIdx - 1 + i >= 0 && iIdx - 1 + i <= gBoard.length - 1)) continue;
        for (var j = 0; j < 3; j++) {
            if (!(jIdx - 1 + j >= 0 && jIdx - 1 + j <= gBoard[0].length - 1)) continue;
            if (!gBoard[iIdx - 1 + i][jIdx - 1 + j].isShown) {
                cellsArr.push({ i: iIdx - 1 + i, j: jIdx - 1 + j });
                gBoard[iIdx - 1 + i][jIdx - 1 + j].isShown = true;
                renderCell({ i: iIdx - 1 + i, j: jIdx - 1 + j });
                console.log('cells rendered');
            }
        }
    }
    renderBoard();
    setTimeout(() => {

        cleanHintCells(cellsArr);
    }, 1000)
    gHintMode = false;
}

function cleanHintCells(cellsArr) {
    for (var i = 0; i < cellsArr.length; i++) {
        gBoard[cellsArr[i].i][cellsArr[i].j].isShown = false;
    }
    renderBoard();
    removeClass(gElLamp, 'lampOn');
    gElLamp.innerHTML = '';
}

function warningColor(elCell) {
    addClass(elCell, 'warning');
    setTimeout(() => {
        removeClass(elCell, 'warning')
    }, 1000)
}

function updateGLives() {
    gLives--;
    switch (gLives) {
        case 0:
            gLivesStr = '';
            break;
        case 1:
            gLivesStr = '🖤';
            break;
        case 2:
            gLivesStr = '🖤🖤';
            break;

    }

    document.querySelector('.livesSpan').innerText = gLivesStr;
}

function setMinesNegsCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var location = { i: i, j: j };
            if (gBoard[i][j].content === EMPTY) {
                var negsAmount = getMinesNegs(location);
                gBoard[i][j].minesNegsCount = negsAmount;
            }
        }
    }
}

function getMinesNegs(location) {
    var count = 0;
    var iIdx = location.i;
    var jIdx = location.j;
    for (var i = 0; i < 3; i++) {
        if (!(iIdx - 1 + i >= 0 && iIdx - 1 + i <= gBoard.length - 1)) continue;
        for (var j = 0; j < 3; j++) {
            if (!(jIdx - 1 + j >= 0 && jIdx - 1 + j <= gBoard[0].length - 1)) continue;
            if (gBoard[iIdx - 1 + i][jIdx - 1 + j].content === MINE) {
                count++
            }
        }
    }
    return count;
}

function changeSmile(mode) {
    var elSmile = document.querySelector(".modeImage");
    switch (mode) {
        case 'win':
            elSmile.innerHTML = '😎';
            break;
        case 'lose':
            elSmile.innerHTML = '😫';
            break;
        case 'play':
            elSmile.innerHTML = '😀';
            break;

    }
}

function setFlagsLeft() {

    switch (gSize) {
        case 4:
            gFlagsLeft = 2;
            break;
        case 8:
            gFlagsLeft = 12;
            break;
        case 12:
            gFlagsLeft = 30;
            break;
    }
    document.querySelector('.flagsLeft span').innerText = gFlagsLeft;

}

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