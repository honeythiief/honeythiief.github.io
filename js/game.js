const list = document.querySelector(".square-list"); // Список для квадратов

let level = Number(sessionStorage.getItem("level") || 1); // Уровень из хранилища, обнуление при отсутствии

let begSecond = 30; // Кол-во секунд при начале игры
let timerId = null;
let timer = document.querySelector('header .timer');
let curSecond =  sessionStorage.getItem("curSecond") || begSecond; // Кол-во секунд из хранилища, обнуление при отсутствии
timer.innerHTML = 'Время: ' + curSecond + ' сек.';

let width = getComputedStyle(document.querySelector(".playing-field")).getPropertyValue('--width-playing-field');
width = width.substr(0, width.length-2) - 20; // Ширина секции под квадратики

// Получение случайного числа в пределах 0~max
function getRandom(min, max) {
    return Math.floor(min + Math.random() * (max + 1 + min));
}

// Действие, происходящее после временного промежутка (1000мс)
function timeTick() {
    curSecond--;
    sessionStorage.setItem('curSecond', curSecond.toString());
    timer.innerHTML = 'Время: ' + curSecond + ' сек.';
    if (curSecond === 0) {
        doLose(); // Проигрыш при истечении времени
    }
}

// Действие при проигрыше
function doLose()
{
    clearInterval(timerId);
    alert("Вы проиграли!");
    sessionStorage.clear();
    level = 1;
    curSecond = begSecond;
    timerId = null;
    startGame();
}

function changeColor(color)
{
    color.r = getRandom(0, 205);
    color.g = getRandom(0, 205);
    color.b = getRandom(0, 205);
}

function addSquares()
{
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    } // Очистка листа

    let w = width / (level + 1) - 6; // Ширина одного квадрата

    let color = {r:0, g:0, b:0};
    changeColor(color);// Цвет квадратов

    const n = (level + 1) ** 2;// Количество квадратов

    goodCell = getRandom(0, n - 1);// Выбранный квадрат

    const styles = `flex: 0 0 auto; width: ${w}px; height: ${w}px; cursor: pointer; margin: 3px;`; // Стиль для квадратов


    for (let i = 0; i < n; i++) {
        let squareElem = document.createElement('li');
        let levelElem = document.querySelector('header .level');
        levelElem.innerHTML = 'Уровень ' + level;

        if (i === goodCell) {
            squareElem.style = `background-color: rgb( ${color.r + 50 / level}, ${color.g + 50 / level}, ${color.b + 50 / level}); ` + styles;
        }
        else {
            squareElem.style = `background-color: rgb(${color.r}, ${color.g}, ${color.b});` + styles;
        }

        // Функция, вызыв. при клике по квадрату 
        squareElem.onclick = function () {
            if (timerId == null)
                timerId = setInterval(timeTick, 1000); // Идентификация таймера после первого клика (начало игры)

            if (i === goodCell) {
                level++;
                sessionStorage.setItem('level', level.toString());
                addSquares();
            }
            else {
                doLose();
            }
        }

        list.append(squareElem);
    }
}

function startGame() {
    clearInterval(timerId);
    sessionStorage.setItem('level', level.toString());
    addSquares();
}

startGame();