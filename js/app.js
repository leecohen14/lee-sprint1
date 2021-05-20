'use strict'
const noRightClick = document.querySelector(".board-container");
noRightClick.addEventListener("contextmenu", e => e.preventDefault());

const FLAG = '🇮🇱';
const EMPTY = '';
const MINE = '💣';
const LIVES = '💛';
const LAMP = '💡';

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
var gLives = 3;
var gLivesStr = LIVES + LIVES + LIVES;
document.querySelector('.livesSpan').innerText = gLivesStr;

var gHints = 3;
var gHintMode = false;

var gElLamp;
var gBoard;

var clicksCounter = 0; //helps to indicate the first click

var gSize = 4;
var gFlagsLeft;
var gSafeClicksLeft;
var gLastMoves = [];

function onUndo() {
    console.log(' undo accourd ');
    var lastMove = gLastMoves.pop();
    gBoard = lastMove;
    renderBoard();
}


function onSafeClick() {
    if (gSafeClicksLeft === 0) return; //later just disable the button after 3rd click

    var location = {
        i: getRandomIntInclusive(0, gBoard.length - 1),
        j: getRandomIntInclusive(0, gBoard[0].length - 1)
    }

    if (gBoard[location.i][location.j].content === EMPTY) {
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
        console.log('cellsArr[i].j :>> ', cellsArr[i].j);
        gBoard[cellsArr[i].i][cellsArr[i].j].isShown = false;
    }
    renderBoard();
    removeClass(gElLamp, 'lampOn');
    gElLamp.innerHTML = '';
}

function resetLamps() {
    document.querySelector('.lamp1').innerText = '💡';
    document.querySelector('.lamp2').innerText = '💡';
    document.querySelector('.lamp3').innerText = '💡';
    gHints = 3;
}

function resetLives() {
    document.querySelector('.livesSpan').innerText = '💛💛💛';
    gLives = 3;
}


function init(size = gSize) {
    gSize = size; // size of the matrix (4=4*4)
    gBoard = buildBoard(size); // build board full oof EMPTY cells
    printMat(gBoard, '.board-container'); // print matrix with all EMPTY cells
    resetAll(); // reset things on init
    gGame.isOn = true;
    console.table(gBoard);
    changeSmile('play');
    resetWatch();
    setFlagsLeft();
    checkLocalStorage();
}

function resetAll() {

    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    };
    clicksCounter = 0;
    clearInterval(gclockInterval);

    resetLamps();
    resetLives();

    gSafeClicksLeft = 3;
    document.querySelector('.safeClickSpan').innerText = gSafeClicksLeft;
    document.querySelector('button').disabled = false;

    gLastMoves = [];

}


function cellClicked(elCell) {
    // console.log('cellclikced\n', gBoard);
    var cellClass = elCell.classList;
    var location = getLocationFromClass(cellClass);
    if (!gGame.isOn) return; //to stop response after game ends

    if (gHintMode) {
        showHintCells(location);
        console.log(' show hint cells is on');
        return;
    }

    if (clicksCounter === 0) { //start the clock
        gTimeStart = Date.now();
        console.log('gTimeStart :>> ', gTimeStart);
        gclockInterval = setInterval(stopWatch, 1000); // start the stopWatch on screen
        clicksCounter++; //helps to now if it was the first click
        renderMines(gSize); // create and render mines to the model and to the dom
        setMinesNegsCount(); // check and update how many mines negs every EMPTY cell has
        renderBoard(); //render the board after 

    }

    if (gBoard[location.i][location.j].minesNegsCount === 0 && gBoard[location.i][location.j].content === EMPTY) revealNegs(location);

    if (gBoard[location.i][location.j].isFlagged) return;
    // if (cellContent === EMPTY) {
    //     renderCell(location);
    // }
    if (gBoard[location.i][location.j].content === MINE) {
        if (gLives > 0) {
            updateGLives();
            warningColor(elCell); // when hit a mine and still have life

        } else {
            renderCell(location);
            gameOver();

        }

    } else {
        renderCell(location);
    }
    gLastMoves.push(gBoard); //push after board rendered


    checkIfWIn();
}

function warningColor(elCell) {
    addClass(elCell, 'warning');
    setTimeout(() => {
        removeClass(elCell, 'warning')
    }, 1000)
}



function flagCell(elCell) {

    if (!gGame.isOn) return;
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
    checkIfWIn();
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


function updateGLives() {
    gLives--;
    switch (gLives) {
        case 0:
            gLivesStr = '';
            break;
        case 1:
            gLivesStr = '💛';
            break;
        case 2:
            gLivesStr = '💛💛';
            break;

    }

    document.querySelector('.livesSpan').innerText = gLivesStr;
}

function gameOver() {
    //stop time
    clearInterval(gclockInterval);
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
    getAndCheckScore();

    resetAll();
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
    getAndCheckScore();
    // checkBest();
    // gHelper = 1;
    clearInterval(gclockInterval);
    gGame.isOn = false;
    resetAll()

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
        elCell.classList += ' -marked ';
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