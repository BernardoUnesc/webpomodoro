const circleElement = document.querySelector(".circle");
const timeElement = document.querySelector(".time");
const timeModeElement = document.querySelector(".time-mode");
const turnElement = document.querySelector(".turns");
const controlButton = document.querySelector(".timer-control");
const resetButton = document.querySelector(".reset-button");
const titleElement = document.querySelector(".title");
const clickSound = document.querySelector("#click");
const notificationSound = document.querySelector("#notification");
const plusElement = document.querySelector("#plus");
const minusElement = document.querySelector("#minus");

clickSound.volume = 0.2;
notificationSound.volume = 0.2;

let isRunning,
    isBreakTime,
    workTime,
    breakTime,
    longBreakTime,
    totalTurns,
    currentTurn,
    totalTime,
    timeRemaining,
    timer;
setValues();

function setValues() {
    isRunning = false;
    isBreakTime = false;
    workTime = 1 * 5;
    breakTime = 1 * 5;
    longBreakTime = 1 * 5;
    totalTurns = 1;
    currentTurn = 1;
    totalTime = workTime;
    timeRemaining = totalTime;
    timer = null;
}

controlButton.addEventListener("click", toggleStartPause);
controlButton.addEventListener("click", TurnsOptions);
resetButton.addEventListener("click", alertReset);
plusElement.addEventListener("mousedown", addTurn);
minusElement.addEventListener("click", removeTurn);

function TurnsOptions() {
    if (isRunning) {
        plusElement.style.visibility = "hidden";
        minusElement.style.visibility = "hidden";
    } else {
        plusElement.style.visibility = "visible";
        minusElement.style.visibility = "visible";
    }
}

function addTurn() {
    totalTurns += 1;
    drawTurn();
}

function removeTurn() {
    totalTurns > 1 ? (totalTurns -= 1) : (totalTurns = 1);
    drawTurn();
}

function alertReset() {
    clickSound.play();
    if (confirm("Deseja mesmo reiniciar?")) {
        reset();
    }
}

function toggleStartPause() {
    clickSound.play();
    isRunning ? pause() : start();
}

function start() {
    isRunning = true;
    controlButton.innerHTML =
        '<img src="assets/img/16px/pause.png"></img>' + " Pausar";
    timer = setInterval(updateTimer, 1000);
}

function pause() {
    isRunning = false;
    controlButton.innerHTML =
        '<img src="assets/img/16px/play-button.png">' + " Iniciar";
    clearInterval(timer);
}

function updateTimer() {
    if (timeRemaining > 0) {
        timeRemaining--;
    } else {
        finishTurn();
    }
    drawTime();
}

function finishTurn() {
    pause();
    notificationSound.play();
    nextTurn();
    drawTurn();
}

function nextTurn() {
    isBreakTime = !isBreakTime;
    if (!isBreakTime) {
        currentTurn++;
    }
    if (currentTurn <= totalTurns) {
        if (isBreakTime) {
            if (currentTurn < totalTime) {
                totalTime = breakTime;
            } else {
                totalTime = longBreakTime;
            }
        } else {
            totalTime = workTime;
        }
        timeRemaining = totalTime;
    } else {
        reset();
    }
}

function reset() {
    pause();
    setValues();
    drawTime();
    drawTurn();
    TurnsOptions();
}

function drawTime() {
    const minutes = Math.floor(timeRemaining / 60)
        .toString()
        .padStart(2, "0");
    const seconds = Math.floor(timeRemaining % 60)
        .toString()
        .padStart(2, "0");

    timeElement.innerText = `${minutes}:${seconds}`;
    titleElement.textContent = "Web Pomodoro - " + `${minutes}:${seconds}`;
    setCirclePercent((timeRemaining / totalTime) * 100);
}

function drawTurn() {
    let timeMode = "Trabalho";
    if (isBreakTime) {
        timeMode = currentTurn < totalTurns ? "Descanso" : "Descanso Longo";
    }
    timeModeElement.innerText = timeMode;
    turnElement.innerText = `${currentTurn} / ${totalTurns}`;
}

function setCirclePercent(percent) {
    const circlePerimeter = 597;
    const dashoffset = circlePerimeter * (percent / 100);
    circleElement.style.setProperty(
        "--dash-offset",
        circlePerimeter - dashoffset
    );
}

reset();