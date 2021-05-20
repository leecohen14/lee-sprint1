'use strict'


var gMines = [];
var gManualMode = false;

function cellClickedInManualMode(elCell) {
    // get coords
    //add class
    var cellClass = elCell.classList;
    var location = getLocationFromClass(cellClass);
    gMines.push({ i: location.i, j: location.j });
    addClass(elCell, 'manualMine');
}

function changeManualMode() {
    if (gManualMode) {
        renderManualMines();
        renderBoard();
    }
    gManualMode = !gManualMode;
    console.log('manualMode is: :>> ', gManualMode);
}

function renderManualMines() {
    console.log('rendering manual mines :>> ');
    for (var i = 0; i < gMines.length; i++) {
        createMine(gBoard, gMines[i].i, gMines[i].j);
    }
    gFlagsLeft = gMines.length;
    document.querySelector('.flagsLeft span').innerText = gFlagsLeft;
    console.log('gMines :>> ', gMines);
}