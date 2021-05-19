'use strict'
const noRightClick = document.querySelector(".board-container");
noRightClick.addEventListener("contextmenu", e => e.preventDefault());

const FLAG = '🇮🇱';
const EMPTY = '';
const MINE = '💣';

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gBoard;

var clicksCounter = 0; //helps to start the clock
var timeStart, timeEnd;

var hour = 0;
var min = 0;
var sec = 0;
var h = 0;
var gSize = 4;
var gFlagsLeft;

function init(size = gSize) {
    gSize = size;
    gGame.isOn = true;
    changeSmile('play')
    gBoard = buildBoard(size);
    printMat(gBoard, '.board-container');
    setFlagsLeft();
    console.table(gBoard);
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    };
    clicksCounter = 0;
    resetWatch();
}

function cellClicked(elCell) {
    // start the clock on first click
    if (clicksCounter === 0) { //start the clock
        timeStart = Date.now();
        stopWatch();
        clicksCounter++;
        renderMines(gSize);
        setMinesNegsCount();
        renderBoard();

    }

    var cellClass = elCell.classList;
    var location = getLocationFromClass(cellClass);
    if (gBoard[location.i][location.j].minesNegsCount === 0 && gBoard[location.i][location.j].content === EMPTY) revealNegs(location);

    if (gBoard[location.i][location.j].isFlagged) return;
    // if (cellContent === EMPTY) {
    //     renderCell(location);
    // }
    if (gBoard[location.i][location.j].content === MINE) gameOver();
    renderCell(location);
    checkIfWIn();
}

function flagCell(elCell) {
    // console.log('mose right work');
    var cellClass = elCell.classList;
    var location = getLocationFromClass(cellClass);
    if (gFlagsLeft === 0 && !gBoard[location.i][location.j].isFlagged) return;

    gBoard[location.i][location.j].isFlagged = !gBoard[location.i][location.j].isFlagged;
    var cellIsFlagged = gBoard[location.i][location.j].isFlagged;
    if (cellIsFlagged) {
        elCell.innerHTML = FLAG;
        gFlagsLeft--;
        document.querySelector('.flagsLeft span').innerText = gFlagsLeft;
    } else {
        gBoard[location.i][location.j].isFlagged = false;
        elCell.innerHTML = EMPTY;
        gFlagsLeft++;
        document.querySelector('.flagsLeft span').innerText = gFlagsLeft;
        // renderCell(location);
    }
}

function buildBoard(size = 4) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                content: EMPTY,
                isShown: false,
                isFlagged: false,
                minesNegsCount: 0
            };
        }
    }

    return board;
}



function gameOver() {
    //stop time
    //לרוץ על כל המערך, לשנות לכל המוקשים את האיז שואון לטרו ואז לרנדר
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].content === MINE) {
                gBoard[i][j].isShown = true;
            }
        }
    }
    console.log('game Over :>> ');
    renderBoard();
    gGame.isOn = false;
    //change smile to sad
    changeSmile('lose');
    timeEnd = Date.now();
    h = 1;
    stopWatch();
    clearTimeout(gclockTimeout);
}

function checkIfWIn() {

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (!(gBoard[i][j].content === EMPTY && gBoard[i][j].isShown || gBoard[i][j].content === MINE && gBoard[i][j].isFlagged)) {
                return false;
            }
        }
    }
    console.log('win :>> ');
    //change smile to sunglasses
    changeSmile('win');
    timeEnd = Date.now();
    checkBest();
    h = 1;
    stopWatch();
    return true;
}

function getLocationFromClass(cellClass) {
    var arr = cellClass.value.split('-');
    var location = { i: +arr[1], j: +arr[2] };
    return location;
}
// location such as: {i: 2, j: 7}
function renderCell(location) {
    // Select the elCell and set the value
    var cell = gBoard[location.i][location.j];
    var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
    if (cell.content !== MINE) {
        cell.isShown = true;
        elCell.innerHTML = cell.minesNegsCount;
        elCell.classList += ' marked ';
    } else {
        cell.isShown = true;
        elCell.innerHTML = MINE;
    }
}


function renderBoard() {
    printMat(gBoard, '.board-container');
}




function setMinesNegsCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var location = { i: i, j: j };
            if (gBoard[i][j].content === EMPTY) {
                var negsAmount = getMinesNegs(location);
                // gBoard[i][j].content = negsAmount;
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