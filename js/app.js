'use strict'
const noRightClick = document.querySelector(".board-container"); // to use right click
noRightClick.addEventListener("contextmenu", e => e.preventDefault());

const FLAG = '🇮🇱';
const EMPTY = '';
const MINE = '💣';
const LIVES = '🖤';
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


function init(size = gSize) {
    gSize = size; // size of the matrix (4=4*4)
    resetAll(); // reset things on init -- this is after gZie=size cause it depends on it
    gBoard = buildBoard(size); // build board full oof EMPTY cells
    printMat(gBoard, '.board-container'); // print matrix with all EMPTY cells
    gGame.isOn = true; //when all ready
    // console.table(gBoard);
    changeSmile('play'); //change smile on init game
    firstCheckLocalStorage(); // show the current best record that in the local storage
    updateBestScoreDom(); // show the current best record that in the local storage

}

function resetAll() {
    gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 }; //not in use except of isOn
    clicksCounter = 0; // to spread mines after first click
    clearInterval(gclockInterval); //stop watch if change level while game is on
    resetLamps(); //bring all lamps back and reset the hint counter
    resetLives(); //bring all lives back and reset the lives counter
    resetSafeClicks(); //rest safe click counter and able the btn back
    resetWatch(); //reset watch variables
    setFlagsLeft(); // set in the span how many flags should be used
    gManualMode = false;
    gMines = [];
}

function cellClicked(elCell) {
    if (!gGame.isOn) return; //to stop response after game ends
    if (gManualMode) {
        cellClickedInManualMode(elCell);
        return;
    }
    var cellClass = elCell.classList;
    var location = getLocationFromClass(cellClass);
    var currCell = gBoard[location.i][location.j];
    if (clicksCounter === 0) { //start the clock
        gTimeStart = Date.now();
        gclockInterval = setInterval(stopWatch, 1000); // start the stopWatch on screen
        clicksCounter++; //helps to now if it was the first click
        if (gMines.length === 0) {
            renderMines(gSize); // create and render mines to the model and to the dom
        }
        setMinesNegsCount(); // check and update how many mines negs every EMPTY cell has
    }

    if (gHintMode) { // if clicked for show a hint
        showHintCells(location);
        return;
    }

    if (currCell.isFlagged) return;
    if (currCell.minesNegsCount === 0 && currCell.content === EMPTY) revealNegs(location);

    if (currCell.content === MINE) {
        if (gLives > 0) { // if he has lives
            updateGLives();
            warningColor(elCell); // when hit a mine and still have life

        } else { //if he doesnt have lives than he lose
            renderCell(location);
            gameOver();
        }

    } else { //if just regular emtpy cell with more than 0 negs
        renderCell(location);
        checkIfWIn(); //if reveal the last empty cell and all the flags set correctly than should check win
    }
}

function flagCell(elCell) {
    if (!gGame.isOn) return; //to not be able to flag cells after game over

    var cellClass = elCell.classList;
    var location = getLocationFromClass(cellClass);
    var currCell = gBoard[location.i][location.j]; //wasnt sure if this way is a deep copy or only a pointer- CHECK LATER
    if (gFlagsLeft === 0 && !currCell.isFlagged) return; //if is trying to flage an unflagged cell and no flags left

    gBoard[location.i][location.j].isFlagged = !currCell.isFlagged; //flag cell if is unflagged and unflagged if is flagged
    var cellIsFlagged = gBoard[location.i][location.j].isFlagged;
    if (cellIsFlagged) { // if the change flagged the cell- Do:
        elCell.innerHTML = FLAG;
        gFlagsLeft--;
        document.querySelector('.flagsLeft span').innerText = gFlagsLeft;
    } else { // if the change unflagged the cell - Do:
        gBoard[location.i][location.j].isFlagged = false;
        elCell.innerHTML = EMPTY;
        gFlagsLeft++;
        document.querySelector('.flagsLeft span').innerText = gFlagsLeft;
    }
    checkIfWIn(); //in case all empty cells reveals and the last mine has flagged now
}

function renderCell(location) {
    // Select the elCell and set the value
    var cell = gBoard[location.i][location.j];
    var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
    if (cell.content === EMPTY) {
        cell.isShown = true;
        elCell.classList += ' -marked ';
        if (cell.minesNegsCount === 0) {
            elCell.innerHTML = '';
        } else elCell.innerHTML = cell.minesNegsCount;
    } else {
        cell.isShown = true;
        elCell.innerHTML = MINE;
    }
}

function renderBoard(board = gBoard) {
    printMat(board, '.board-container');
}

function gameOver() {
    //stop time
    clearInterval(gclockInterval); //stop the watch when lose
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].content === MINE) {
                gBoard[i][j].isShown = true;
            }
        }
    }
    console.log('game Over :>> ');
    renderBoard();
    changeSmile('lose'); //change smile to sad
    gGame.isOn = false;
    // getAndCheckScore();
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

    changeSmile('win'); //change smile to sunglasses
    getAndCheckScore(); //check if this score is the best for this level
    gGame.isOn = false;
    clearInterval(gclockInterval);
    return true;
}