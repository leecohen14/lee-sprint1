'use strict'

function resetLamps() {
    document.querySelector('.lamp1').innerText = '💡';
    document.querySelector('.lamp2').innerText = '💡';
    document.querySelector('.lamp3').innerText = '💡';
    gHints = 3;
}

function resetLives() {
    document.querySelector('.livesSpan').innerText = '🖤🖤🖤';
    gLives = 3;
}

function resetSafeClicks() {
    gSafeClicksLeft = 3;
    document.querySelector('.safeClickSpan').innerText = gSafeClicksLeft;
    document.querySelector('button').disabled = false;
}