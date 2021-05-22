'use strict'


var gMines = [];
var gManualMode = false;

function cellClickedInManualMode(elCell) {
    var cellClass = elCell.classList;
    var location = getLocationFromClass(cellClass);
    gMines.push({ i: location.i, j: location.j });
    addClass(elCell, 'manualMine');
}

function changeManualMode() {
    var elBtn = document.querySelector('.manualModeBtn');
    gManualMode = !gManualMode;
    if (!gManualMode) {
        storeState(buildBoard());
        renderManualMines();
        renderBoard(); // need to render 
        //remove class
        removeClass(elBtn, 'manualMode');
    } else {
        //add class
        addClass(elBtn, 'manualMode');
    }
    console.log('manualMode is: :>> ', gManualMode);
}

function renderManualMines() {
    console.log('rendering manual mines :>> ');
    for (var i = 0; i < gMines.length; i++) {
        createMine(gBoard, gMines[i].i, gMines[i].j);
    }
    console.log('gMines :>> ', gMines);
}