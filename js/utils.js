// var _ = require('lodash');
var gState = [];

function storeState(board) {
    gState.push(_.cloneDeep(board)); //lodash 
}

function popState() {
    return gState.pop();
}

function getState() {
    return gState[gState.length - 1];
}

function printMat(x, selector) {
    var mat = getState();
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            var cellContent = cell.content;
            var cellMinesNegsCount = cell.minesNegsCount
            var className = 'cell cell-' + i + '-' + j;
            if (cell.isShown && cellContent === EMPTY) className += ' -marked ';
            if (cell.isShown && cellContent === MINE) className += ' mineShown ';
            strHTML += `<td class="${className}" oncontextmenu="flagCell(this)" onclick="cellClicked(this)" >`;

            if (cell.isFlagged) {
                strHTML += `${FLAG}</td>`;
                continue;
            }

            if (cellContent === EMPTY) {
                if (!cell.isShown || cellMinesNegsCount === 0) strHTML += `${cellContent}</td>`
                else strHTML += `${cellMinesNegsCount}</td>`;
            }

            if (cellContent === MINE) { strHTML += (cell.isShown) ? `${MINE}</td>` : `${EMPTY}</td>`; }
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}

function buildBoard(size = 4) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                content: EMPTY,
                location: { i, j },
                isShown: false,
                isFlagged: false,
                minesNegsCount: 0
            };
        }
    }
    return board;
}

//--------- get location, random colors, random int, and classes name
function getLocationFromClass(cellClass) {
    var arr = cellClass.value.split('-');
    var location = { i: +arr[1], j: +arr[2] };
    return location;
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}

// -------- stop Watch stuffs ---------------
var gclockInterval;
var gHour, gMin, gSec, gHelper;
var gTimeStart, gTimeEnd;

function stopWatch() {
    if (gHour === 23 && gMin === 59 && gSec === 59) { //increasing the watch
        gHour = 0;
        gMin = 0;
        gSec = 0;
    } else if (gMin === 59 && gSec === 59) {
        gHour++;
        gMin = 0;
        gSec = 0;
    } else if (gSec === 59) {
        gMin++;
        gSec = 0;
    } else {
        gSec++;
    }

    if (gHour < 10 && gMin < 10 && gSec < 10) { //adding zero to show 2 digits
        document.querySelector(".stopWatch").innerText = "0" + gHour + ":0" + gMin + ":0" + gSec;
    } else if (gHour < 10 && gMin < 10) {
        document.querySelector(".stopWatch").innerText = "0" + gHour + ":0" + gMin + ":" + gSec;
    } else if (gHour < 10) {
        document.querySelector(".stopWatch").innerText = "0" + gHour + ":" + gMin + ":" + gSec;
    } else if (gMin < 10 && gSec < 10) {
        document.querySelector(".stopWatch").innerText = gHour + ":0" + gMin + ":0" + gSec;
    } else if (gMin < 10) {
        document.querySelector(".stopWatch").innerText = gHour + ":0" + gMin + ":" + gSec;
    } else if (gSec < 10) {
        document.querySelector(".stopWatch").innerText = gHour + ":" + gMin + ":0" + gSec;
    } else {
        document.querySelector(".stopWatch").innerText = gHour + ":" + gMin + ":" + gSec;
    }



}

function resetWatch() { //reseting the watch and the counting
    gHour = 0;
    gMin = 0;
    gSec = 0;
    gHelper = 0;
    gTimeStart = null;
    gTimeEnd = null;
    document.querySelector(".stopWatch").innerText = '00:00:00';
}

//------ local storage and updating dom on best record --------
var gBestScore4;
var gBestScore8;
var gBestScore12;

var gCurrScore;

function getAndCheckScore() { //?????????? ???? ???????????? ????????????, ???????????? ???? ???????? ??????????
    gTimeEnd = Date.now();
    gCurrScore = (gTimeEnd - gTimeStart) / 1000;
    checkIfNewBestScore();
}

function checkIfNewBestScore() {
    switch (gSize) {
        case 4:
            if (gCurrScore < gBestScore4 || +gBestScore4 === 0) {
                localStorage.setItem('bestScore4', gCurrScore);
                gBestScore4 = gCurrScore;
                console.log('new best record!');

            }
            break;
        case 8:
            if (gCurrScore < gBestScore8 || +gBestScore8 === 0) {
                localStorage.setItem('bestScore8', gCurrScore);
                gBestScore4 = gCurrScore;
                console.log('new best record!');
            }
            break;
        case 12:
            if (gCurrScore < gBestScore12 || +gBestScore12 === 0) {
                localStorage.setItem('bestScore12', gCurrScore);
                gBestScore4 = gCurrScore;
                console.log('new best record!');
            }
            break;
    }
    firstCheckLocalStorage();
    updateBestScoreDom(); //to update dom

}

function firstCheckLocalStorage() {
    //part1: check if there is something in local storage - if not put zero.
    if (!localStorage.getItem(`bestScore4`)) { //if empty
        localStorage.setItem(`bestScore4`, 0);
        gBestScore4 = localStorage.getItem(`bestScore4`);
    } else {
        gBestScore4 = localStorage.getItem(`bestScore4`);
    }

    if (!localStorage.getItem(`bestScore8`)) { //if empty
        localStorage.setItem(`bestScore8`, 0);
        gBestScore8 = localStorage.getItem(`bestScore8`);

    } else {
        gBestScore8 = localStorage.getItem(`bestScore8`);
    }

    if (!localStorage.getItem(`bestScore12`)) { //if empty
        localStorage.setItem(`bestScore12`, 0);
        gBestScore8 = localStorage.getItem(`bestScore8`);
    } else {
        gBestScore12 = localStorage.getItem(`bestScore12`);
    }

}

function updateBestScoreDom() {
    switch (gSize) { //update the dom due to the current level
        case 4:
            document.querySelector('.bestScoreSpan').innerText = gBestScore4;
            break;
        case 8:
            document.querySelector('.bestScoreSpan').innerText = gBestScore8;
            break;
        case 12:
            document.querySelector('.bestScoreSpan').innerText = gBestScore12;
            break;
    }
}
//------ remove and add classes--------
function addClass(el, className) {
    if (el.classList)
        el.classList.add(className)
    else if (!hasClass(el, className))
        el.className += " " + className;
}

function removeClass(el, className) {
    if (el.classList)
        el.classList.remove(className)
    else if (hasClass(el, className)) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
        el.className = el.className.replace(reg, ' ');
    }
}