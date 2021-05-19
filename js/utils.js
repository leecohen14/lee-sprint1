function printMat(mat, selector) {
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
            strHTML += `<td class="${className}" oncontextmenu="flagCell(this)" onclick="cellClicked(this, '${cellContent}')" >`;
            if (cell.isFlagged) {
                strHTML += `${FLAG}</td>`;
            }

            if (cell.isShown && cellContent === EMPTY) {
                strHTML += `${cellMinesNegsCount}</td>`;
            }

            if (!cell.isShown && cellContent === EMPTY) strHTML += `${cellContent}</td>`;
            if (cellContent === MINE) {
                if (cell.isFlagged) {
                    strHTML += `${FLAG}</td>`;
                    continue;
                } else if (cell.isShown) {
                    strHTML += `${MINE}</td>`;
                } else strHTML += `${EMPTY}</td>`;

            }
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
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

var gclockInterval;
var gHour, gMin, gSec, gHelper;
var timeStart, timeEnd;

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
    document.querySelector(".stopWatch").innerText = '00:00:00';
    // clearInterval(gclockInterval);
}