function printMat(mat, selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            var cellContent = cell.content;
            var cellMinesNegsCount = cell.minesNegsCount
            var className = 'cell cell-' + i + '-' + j;
            if (cell.isShown && cellContent === EMPTY) className += ' marked ';
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

function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
}

function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}
var gclockTimeout;

function stopWatch() {
    if (hour < 10 && min < 10 && sec < 10) { //adding zero to show 2 digits
        document.querySelector(".stopWatch").innerText = "0" + hour + ":0" + min + ":0" + sec;
    } else if (hour < 10 && min < 10) {
        document.querySelector(".stopWatch").innerText = "0" + hour + ":0" + min + ":" + sec;
    } else if (hour < 10) {
        document.querySelector(".stopWatch").innerText = "0" + hour + ":" + min + ":" + sec;
    } else if (min < 10 && sec < 10) {
        document.querySelector(".stopWatch").innerText = hour + ":0" + min + ":0" + sec;
    } else if (min < 10) {
        document.querySelector(".stopWatch").innerText = hour + ":0" + min + ":" + sec;
    } else if (sec < 10) {
        document.querySelector(".stopWatch").innerText = hour + ":" + min + ":0" + sec;
    } else {
        document.querySelector(".stopWatch").innerText = hour + ":" + min + ":" + sec;
    }

    if (h === 1) { //helps to stop the watch
        return;
    }

    if (hour === 23 && min === 59 && sec === 59) { //increasing the watch
        hour = 0;
        min = 0;
        sec = 0;
    } else if (min === 59 && sec === 59) {
        hour++;
        min = 0;
        sec = 0;
    } else if (sec === 59) {
        min++;
        sec = 0;
    } else {
        sec++;
    }

    gclockTimeout = setTimeout("stopWatch()", 1000); //re-counting every second
}

function resetWatch() { //reseting the watch and the counting
    hour = 0;
    min = 0;
    sec = 0;
    h = 0;
    document.querySelector(".stopWatch").innerText = '00:00:00';
}