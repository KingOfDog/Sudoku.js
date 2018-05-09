const canvas = document.getElementById("sudoku");
const ctx = canvas.getContext('2d');

const cellSize = {x: 100, y: 100};
const colors = [
    "#ff0055", "#FF2A2B", "#ff5400", "#FFAA00", "#ffff00", "#80E600", "#00cc00", "#00E680", "#00ffff"
];

const sudoku = [];

let active = {x: 0, y: 0};
let activeNumber = null;

function initSudoku() {
    initGrid();

    shuffleGrid();

    removeCells();

    drawSudoku();
}

function initGrid() {
    let number = 0;
    for (let x = 0; x < 9; x++) {
        sudoku.push([]);
        for (let y = 0; y < 9; y++) {
            sudoku[x][y] = {number: number + 1};
            number = (number + 1) % 9;
        }
        number += 3;
        if ((x + 1) % 3 === 0)
            number++;
        number %= 9;
    }
}

function removeCells() {
    for (let i = 0; i < 60; i++) {
        const ranX = ranInt(0, 8);
        const ranY = ranInt(0, 8);

        sudoku[ranX][ranY] = {number: null, enteredNumber: null};
    }
}

function ranInt(min, max) {
    return Math.floor((Math.random() * (max + 1)) + min);
}

function shuffleGrid() {
    const amount = ranInt(10, 35);

    for (let i = 0; i < amount; i++) {
        shuffleStep(ranInt(0, 3));
    }
}

function shuffleStep(which) {
    const a = ranInt(0, 8);
    const b = (a - Math.floor(a / 3) * 3 + ranInt(1, 2)) % 3 + Math.floor(a / 3) * 3;

    const c = Math.floor(a / 3) * 3;
    const d = (c + ranInt(1, 2) * 3) % 9;

    switch (which) {
        case 0:
            shuffleRow(a, b);
            break;
        case 1:
            shuffleCol(a, b);
            break;
        case 2:
            shuffleRow(c, d);
            shuffleRow(c + 1, d + 1);
            shuffleRow(c + 2, d + 2);
            break;
        case 3:
            shuffleCol(c, d);
            shuffleCol(c + 1, d + 1);
            shuffleCol(c + 2, d + 2);
            break;
        default:
            break;
    }
}

function shuffleRow(row1, row2) {
    for (let x = 0; x < 9; x++) {
        [sudoku[x][row1], sudoku[x][row2]] = [sudoku[x][row2], sudoku[x][row1]];
    }
}

function shuffleCol(col1, col2) {
    [sudoku[col1], sudoku[col2]] = [sudoku[col2], sudoku[col1]];
}

function drawSpecialLines() {
    ctx.lineWidth = 5;
    for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 3 * cellSize.x, 0);
        ctx.lineTo(i * 3 * cellSize.x, 9 * cellSize.y);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(0, i * 3 * cellSize.y);
        ctx.lineTo(9 * cellSize.x, i * 3 * cellSize.y);
        ctx.stroke();
        ctx.closePath();
    }
}

function drawSudoku() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "black";
    ctx.font = "bold 50px Roboto";
    ctx.textAlign = "center";
    ctx.lineWidth = 1;

    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
            ctx.strokeStyle = "black";
            if (active.x === x && active.y === y) {
                ctx.fillStyle = "#ddd";
                ctx.fillRect(x * cellSize.x, y * cellSize.y, cellSize.x, cellSize.y);
            }
            ctx.fillStyle = "black";
            ctx.strokeRect(x * cellSize.x, y * cellSize.y, cellSize.x, cellSize.y);

            if(sudoku[x][y].number == null && sudoku[x][y].enteredNumber !== null) {
                ctx.fillStyle = "blue";
            }

            const text = sudoku[x][y].number || sudoku[x][y].enteredNumber;

            if(text === activeNumber)
                ctx.fillStyle = colors[activeNumber - 1];

            if (text !== null)
                ctx.fillText(text, (x + .5) * cellSize.x, (y + .66) * cellSize.y);
        }
    }

    drawSpecialLines();
}

function getPosition(windowX, windowY) {
    const x = windowX / (cellSize.x * 9);
    const y = windowY / (cellSize.y * 9);
    const fieldX = Math.floor(x * 9);
    const fieldY = Math.floor(y * 9);

    return {x: fieldX, y: fieldY};
}

function activeCellEvent() {
    activeNumber = sudoku[active.x][active.y].number || sudoku[active.x][active.y].enteredNumber;

}

canvas.addEventListener('click', (e) => {
    active = getPosition(e.x, e.y);

    console.log(active);

    activeCellEvent();

    drawSudoku();
});

window.addEventListener('keydown', (e) => {
    if (!isNaN(parseInt(e.key))) {
        const number = parseInt(e.key);
        if (number > 0) {
            sudoku[active.x][active.y].enteredNumber = number;
        }
    } else if (e.key === "Backspace") {
        sudoku[active.x][active.y].enteredNumber = null;
    } else if (e.key === "ArrowDown") {
        active.y++;
    } else if (e.key === "ArrowUp") {
        active.y--;
    } else if (e.key === "ArrowLeft") {
        active.x--;
    } else if (e.key === "ArrowRight") {
        active.x++;
    } else {
        return;
    }

    active.x = Math.min(8, active.x);
    active.y = Math.min(8, active.y);
    active.x = Math.max(0, active.x);
    active.y = Math.max(0, active.y);

    activeCellEvent();

    drawSudoku();
});

initSudoku();
console.log(sudoku);