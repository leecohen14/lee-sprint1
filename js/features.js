'use strict'

function onUndo() {
    clicksCounter--;
    popState()
    var board = popState();
    gBoard = _.cloneDeep(board);
    renderBoard(board);
}

function undoBtnMode() {
    if (gState.length < 2) {
        document.querySelector('.undoBtn').disabled = true;
    } else document.querySelector('.undoBtn').disabled = false;
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
        addClass(elCell, 'safe');
        setTimeout(() => {
            removeClass(elCell, 'safe');
        }, 500);
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
    if (gElLamp.disabled) return;
    if (gHints === 0) return;
    gHintMode = true;
    lampLightOn(elLamp);
}

function lampLightOn(elLamp) {
    addClass(elLamp, 'lampOn');
    elLamp.disabled = true;


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
                updateCellInModel({ i: iIdx - 1 + i, j: jIdx - 1 + j });
                console.log('cells rendered');
            }
        }
    }
    renderBoard();
    popState();
    document.querySelector('.undoBtn').disabled = true;
    setTimeout(() => {

        cleanHintCells(cellsArr);
        document.querySelector('.undoBtn').disabled = false;
    }, 1000)
}

function cleanHintCells(cellsArr) {
    for (var i = 0; i < cellsArr.length; i++) {
        gBoard[cellsArr[i].i][cellsArr[i].j].isShown = false;
    }
    renderBoard();
    popState();
    removeClass(gElLamp, 'lampOn');
    addClass(gElLamp, 'lampOff')
    clicksCounter--; // we click to choose which cell negs to present and it isnt suppose to count as a click!
    gHintMode = false;

}

function removeAllLampsOffClass() {
    for (var i = 1; i <= 3; i++) {
        var elLamp = document.querySelector(`.lamp${i}`);
        removeClass(elLamp, 'lampOff');
        elLamp.disabled = false;

    }
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

function initFlagsLeft() {

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

function updateFlagsLeft() {
    //count mines every render
    var countMines = 0;
    var countFlags = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].content === MINE) countMines++;
            if (gBoard[i][j].isFlagged) countFlags++;
        }
    }
    gFlagsLeft = countMines - countFlags;
    if (clicksCounter === 0 && gFlagsLeft === 0 || countMines === 0) {
        initFlagsLeft();
        gFlagsLeft -= countFlags;
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
                    if (checkedCell.isShown) continue;
                    updateCellInModel(currCellLocation);
                    if (currCellLocation.i === location.i && currCellLocation.j === location.j) continue;
                    revealNegs(currCellLocation);
                } else {
                    updateCellInModel(currCellLocation);

                }
            }
        }
    }
    return;
}