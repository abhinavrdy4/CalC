let runningTotal = 0;
let buffer = "0";
let previousOperator;
let clickSound = new Audio("pop.mp3");
let currentOperatorButton = null;

let isMenuOpen = false;
let isSoundOn = true;
let theme = "light";
let history = [];
let isCollapsed = false;

const screen = document.querySelector('.screen');


function buttonClick(value) {
    if (isSoundOn) {
        clickSound.play();
    }
    if (isNaN(value)) {
        handleSymbol(value);
    } else {
        handleNumber(value);
    }
    screen.innerText = buffer;
}


function handleSymbol(symbol) {
    switch (symbol) {
        case 'C':
            buffer = '0';
            runningTotal = 0;
            if (currentOperatorButton) {
                currentOperatorButton.classList.remove('operator-selected');
            }
            break;
        case '=':
            if (previousOperator == null) {
                return;
            }
            flushOperation(parseInt(buffer));

            saveHistory(`${buffer} ${previousOperator} ${runningTotal} = ${runningTotal}`);
            previousOperator = null;
            buffer = runningTotal.toString();
            runningTotal = 0;
            if (currentOperatorButton) {
                currentOperatorButton.classList.remove('operator-selected');
            }
            break;
        case '←':
            if (buffer.length === 1) {
                buffer = '0';
            } else {
                buffer = buffer.slice(0, -1);
            }
            break;
        case '+':
        case '−':
        case '×':
        case '÷':
            handleMath(symbol);
            break;
    }
}


function handleMath(symbol) {
    if (buffer === '0') {
        return;
    }

    const intBuffer = parseInt(buffer);


    if (currentOperatorButton) {
        currentOperatorButton.classList.remove('operator-selected');
    }


    if (runningTotal === 0) {
        runningTotal = intBuffer;
    } else {
        flushOperation(intBuffer);
    }


    const operatorButtons = document.querySelectorAll('.calc-button');
    operatorButtons.forEach(button => {
        if (button.innerText === symbol) {
            button.classList.add('operator-selected');
            currentOperatorButton = button;
        }
    });

    previousOperator = symbol;
    buffer = '0';
}


function flushOperation(intBuffer) {
    if (previousOperator === '+') {
        runningTotal += intBuffer;
    } else if (previousOperator === '−') {
        runningTotal -= intBuffer;
    } else if (previousOperator === '×') {
        runningTotal *= intBuffer;
    } else if (previousOperator === '÷') {
        runningTotal /= intBuffer;
    }
}


function handleNumber(numberString) {
    if (buffer === "0") {
        buffer = numberString;
    } else {
        buffer += numberString;
    }
}


function init() {
    document.querySelector('.calc-buttons').addEventListener('click', function (event) {
        buttonClick(event.target.innerText);
    });
}

init();


function toggleMenu() {
    const menu = document.querySelector('.menu-bar');
    const hamburgerIcon = document.querySelector('.hamburger');


    menu.classList.toggle('open');
    hamburgerIcon.classList.toggle('hidden');

    isMenuOpen = !isMenuOpen;
}



function toggleSound() {
    isSoundOn = !isSoundOn;

    console.log('Sound:', isSoundOn ? 'On' : 'Off');
    const soundButton = document.querySelector('#sound-toggle-button');
    soundButton.innerText = isSoundOn ? 'Sound: On' : 'Sound: Off';
}


function toggleTheme() {
    const body = document.body;
    if (theme === "light") {
        body.classList.add("dark-theme");
        theme = "dark";
    } else {
        body.classList.remove("dark-theme");
        theme = "light";
    }
}


function changeBackground() {
    const backgrounds = ["url('background1.jpg')", "url('background2.jpg')", "url('background3.jpg')"];
    const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    document.body.style.backgroundImage = randomBackground;
}


function saveHistory(calculation) {
    if (history.length >= 5) {
        history.shift();
    }
    history.push(calculation);


    const historyList = document.querySelector('.history-list');
    historyList.innerHTML = '';
    history.forEach(item => {
        const li = document.createElement('li');
        li.innerText = item;
        historyList.appendChild(li);
    });
}


function toggleHistory() {
    const historyList = document.querySelector('.history-list');
    historyList.classList.toggle('hidden');
}


function toggleBackgroundUpload() {
    const backgroundList = document.getElementById('background-upload-list');
    backgroundList.classList.toggle('show');
}


function uploadBackgroundImage() {
    const fileInput = document.getElementById('background-upload');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();


        reader.onload = function (event) {
            const backgroundImage = event.target.result;
            document.body.style.backgroundImage = `url(${backgroundImage})`;
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundPosition = "center";
        };

        reader.readAsDataURL(file);
    } else {
        alert("No file selected.");
    }
}
