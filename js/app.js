'use strict'
const noRightClick = document.querySelector(".board-container"); // to use right click
noRightClick.addEventListener("contextmenu", e => e.preventDefault());

//const symbols
const FLAG = '🇮🇱';
const EMPTY = '';
const MINE = '💣';
const LIVES = '🖤';
const LAMP = '💡';

var gBoard;
var clicksCounter = 0; //helps to indicate the first click and if we should render the first board when using undo
var gSize = 4; //size of mat 4 => 4*4
var gFlagsLeft; // how many flags left to place on board

// --lives feature
var gLives = 3; //lives feature
var gLivesStr = LIVES + LIVES + LIVES;
document.querySelector('.livesSpan').innerText = gLivesStr;

// --hints feature
var gHints = 3; //hints feature
var gHintMode = false;
var gElLamp; //current used lamp on hints

// --safe clicks feature
var gSafeClicksLeft; // safe clicks feature

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function init(size = gSize) {
    gSize = size; // size of the matrix (4=4*4)
    resetAll(); // reset things on init -- this is after gZie=size cause it depends on it
    gBoard = buildBoard(size); // build board full oof EMPTY cells
    renderBoard(gBoard); // print matrix with all EMPTY cells
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
    initFlagsLeft(); // set in the span how many flags should be used
    gManualMode = false; //place manual mines
    gMines = [];
    gMyMines = [];
    gState = [];
    removeAllLampsOffClass(); //change lamps back from black to regular

    var elBtn = document.querySelector('.manualModeBtn'); //if restart when manual mode is on placing mines
    removeClass(elBtn, 'manualMode');
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
    if (currCell.isShown) return;
    if (clicksCounter === 0) { //start the clock
        if (!gTimeStart) {
            gTimeStart = Date.now();
            gclockInterval = setInterval(stopWatch, 1000);
        } // start the stopWatch on screen
        if (gMines.length === 0) { //if not 0 than other function in mine.js render the mines
            renderMines(gSize, location); // create and render mines to the model and to the dom
        }
        setMinesNegsCount(); // check and update how many mines negs every EMPTY cell has
    }
    clicksCounter++;
    if (gHintMode) { // if clicked for show a hint
        showHintCells(location);
        return;
    }

    if (currCell.isFlagged) return;
    if (currCell.minesNegsCount === 0 && currCell.content === EMPTY) {
        revealNegs(location);
        renderBoard();
        checkIfWIn();
        return;
    }

    if (currCell.content === MINE) {
        if (gLives > 0) { // if he has lives
            updateGLives();
            warningColor(elCell); // when hit a mine and still have life
            clicksCounter--;
            return;

        } else { //if he doesnt have lives than he lose
            // renderCell(location);
            gameOver();
        }

    } else { //if just regular emtpy cell with more than 0 negs
        updateCellInModel(location);
        checkIfWIn(); //if reveal the last empty cell and all the flags set correctly than should check win
    }
    // storeState(gBoard);
    renderBoard();
}

function updateCellInModel(location) { //update model and dom !
    var cell = gBoard[location.i][location.j];
    cell.isShown = true;
}

function flagCell(elCell) {
    if (!gGame.isOn) return; //to not be able to flag cells after game over

    var cellClass = elCell.classList;
    var location = getLocationFromClass(cellClass);
    var currCell = gBoard[location.i][location.j]; //wasnt sure if this way is a deep copy or only a pointer- CHECK LATER
    if ((gFlagsLeft === 0 && !currCell.isFlagged) || currCell.isShown || gManualMode) return; //if is trying to flage an unflagged cell and no flags left

    currCell.isFlagged = !currCell.isFlagged; //flag cell if is unflagged and unflagged if is flagged
    var cellIsFlagged = currCell.isFlagged;
    if (cellIsFlagged) { // if the change flagged the cell- Do:
        clicksCounter++;
    } else { // if the change unflagged the cell - Do:
        currCell.isFlagged = false;
        clicksCounter--;
    }
    checkIfWIn(); //in case all empty cells reveals and the last mine has flagged now
    renderBoard();
}

function renderBoard(board = gBoard) {
    console.log('board :>> ', board);
    storeState(board);
    printMat(null, '.board-container');
    updateFlagsLeft();
    undoBtnMode();
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