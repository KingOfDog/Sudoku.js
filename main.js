class Sudoku {
    constructor() {
        this.canvas = document.getElementById('sudoku');
        this.ctx = this.canvas.getContext('2d');

        this.board = new Board(9, 3);
        this.cellSize = 100;
        this.activeCell = {x: 0, y: 0};

        this.colors = [
            "#ff0055", "#FF2A2B", "#ff5400", "#FFAA00", "#ffff00", "#80E600", "#00cc00", "#00E680", "#00ffff"
        ];
    }

    init() {
        this.board.init();
        this.board.shuffle();
        this.board.clearCells();
        this.draw();
        this.addListeners()
    }

    activeCellEvent() {

    }

    addListeners() {
        this.canvas.addEventListener('click', (e) => {
            this.activeCell = this.getPosition(e.x, e.y);

            this.activeCellEvent();

            this.draw();
        });

        window.addEventListener('keydown', (e) => {
            if (!isNaN(parseInt(e.key))) {
                const number = parseInt(e.key);
                if (number > 0) {
                    this.board.enterNumber(this.activeCell.x, this.activeCell.y, number);
                }
            } else if (e.key === "Backspace") {
                this.board.clearCell(this.activeCell.x, this.activeCell.y);
            } else if (e.key === "ArrowDown") {
                this.activeCell.y++;
            } else if (e.key === "ArrowUp") {
                this.activeCell.y--;
            } else if (e.key === "ArrowLeft") {
                this.activeCell.x--;
            } else if (e.key === "ArrowRight") {
                this.activeCell.x++;
            } else {
                return;
            }

            this.activeCell.x = Math.min(8, this.activeCell.x);
            this.activeCell.y = Math.min(8, this.activeCell.y);
            this.activeCell.x = Math.max(0, this.activeCell.x);
            this.activeCell.y = Math.max(0, this.activeCell.y);

            this.activeCellEvent();

            this.draw();
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.strokeStyle = 'black';
        this.ctx.font = 'bold 50px Roboto';
        this.ctx.textAlign = 'center';
        this.ctx.lineWidth = 1;

        this.drawNumbers();
        this.drawStrokes();
        this.drawBoldStrokes();
        this.drawActiveCell();
        this.drawMistakes();
    }

    drawActiveCell() {
        this.ctx.strokeStyle = 'yellow';
        this.ctx.lineWidth = 5;
        this.ctx.strokeRect(this.activeCell.x * this.cellSize, this.activeCell.y * this.cellSize, this.cellSize, this.cellSize);
    }

    drawMistakes() {
        const mistakes = this.board.checkValidity();
        for(let mistake of mistakes) {
            this.ctx.fillStyle = 'red';
            this.ctx.beginPath();
            this.ctx.arc((mistake.x + .5) * this.cellSize, (mistake.y + .5) * this.cellSize, .25 * this.cellSize, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.closePath();

            this.drawNumber(mistake.x, mistake.y, this.board.cells[mistake.x][mistake.y].number, '#fff');
        }
    }

    drawNumbers() {
        for(let x = 0; x < this.board.size; x++) {
            for(let y = 0; y < this.board.size; y++) {
                let color = '#000';

                if(!this.board.cells[x][y].isFixed) {
                    color = '#00f';
                } else {
                    this.ctx.fillStyle = '#ddd';
                    this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
                }

                const number = this.board.cells[x][y].number;

                if(number === this.board.getCellValue(this.activeCell)) {
                    color = this.colors[this.board.getCellValue(this.activeCell) - 1];
                }

                if(number !== null) {
                    this.drawNumber(x, y, number, color);
                }
            }
        }
    }

    drawNumber(x, y, value, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillText(value, (x + .5) * this.cellSize, (y + .66) * this.cellSize);
    }

    drawStrokes() {
        this.ctx.strokeStyle = '#000';
        for (let x = 0; x < this.board.size; x++) {
            for(let y = 0; y < this.board.size; y++) {
                this.ctx.strokeRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
            }
        }
    }

    drawBoldStrokes() {
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 5;
        for(let i = 0; i <= this.board.blockSize; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.board.blockSize * this.cellSize, 0);
            this.ctx.lineTo(i * this.board.blockSize * this.cellSize, this.board.size * this.cellSize);
            this.ctx.stroke();
            this.ctx.closePath();

            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.board.blockSize * this.cellSize);
            this.ctx.lineTo(this.board.size * this.cellSize, i * this.board.blockSize * this.cellSize);
            this.ctx.stroke();
            this.ctx.closePath();
        }
    }

    getPosition(mouseX, mouseY) {
        const x = Math.floor(mouseX / this.cellSize);
        const y = Math.floor(mouseY / this.cellSize);
        return {x: x, y: y};
    }
}

class Board {
    constructor(size, blockCount) {
        this.size = size;
        this.blockSize = Math.floor(this.size / blockCount);
        this.cells = [];
    }

    init() {
        let number = 0;

        for (let x = 0; x < this.size; x++) {
            this.cells.push([]);

            for (let y = 0; y < this.size; y++) {
                this.cells[x][y] = {number: number + 1, isFixed: true};
                number = (number + 1) % this.size;
            }

            number += this.blockSize;
            if ((x + 1) % this.blockSize === 0) {
                number++;
            }
            number %= this.size;
        }
    }

    checkValidity() {
        const errorCells = [];
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                if (!this.cells[x][y].isFixed && !this.checkCellValidity(x, y)) {
                    errorCells.push({x: x, y: y});
                }
            }
        }
        return errorCells;
    }

    checkCellValidity(cellX, cellY) {
        const cellValue = this.cells[cellX][cellY].number;

        if(cellValue === null) {
            return true;
        }

        for (let x = 0; x < 9; x++) { // Check same row
            if (x === cellX) {
                continue;
            }
            if (this.cells[x][cellY].number === cellValue) {
                return false;
            }
        }

        for (let y = 0; y < 9; y++) { // Check same column
            if (y === cellY) {
                continue;
            }
            if (this.cells[cellX][y].number === cellValue) {
                return false;
            }
        }

        const blockX = Math.floor(cellX / 3);
        const blockY = Math.floor(cellY / 3);
        for (let innerX = 0; innerX < 3; innerX++) {
            for (let innerY = 0; innerY < 3; innerY++) {
                const x = blockX * 3 + innerX;
                const y = blockY * 3 + innerY;
                if (x === cellX && y === cellY) {
                    continue;
                }

                if (this.cells[x][y].number === cellValue) {
                    return false;
                }
            }
        }

        return true;
    }

    clearCells() {
        for (let i = 0; i < .8 * this.size ** 2; i++) {
            const ranX = ranInt(0, this.size);
            const ranY = ranInt(0, this.size);
            this.clearCell(ranX, ranY);
        }
    }

    clearCell(x, y) {
        console.log(x, y);
        this.cells[x][y].number = null;
        this.cells[x][y].isFixed = false;
    }

    enterNumber(x, y, number) {
        if (!this.cells[x][y].isFixed)
            this.cells[x][y].number = number;
    }

    getCellValue(cell) {
        return this.cells[cell.x][cell.y].number;
    }

    shuffle() {
        const shuffleAmount = ranInt(10, 35);

        for (let i = 0; i < shuffleAmount; i++) {
            this.shuffleStep(ranInt(0, 3));
        }
    }

    shuffleStep(shuffleType) {
        const a = ranInt(0, 8);
        const b = (a - Math.floor(a / 3) * 3 + ranInt(1, 2)) % 3 + Math.floor(a / 3) * 3;

        const c = Math.floor(a / 3) * 3;
        const d = (c + ranInt(1, 2) * 3) % 9;

        switch (shuffleType) {
            case 0:
                this.shuffleRow(a, b);
                break;
            case 1:
                this.shuffleCol(a, b);
                break;
            case 2:
                this.shuffleRow(c, d);
                this.shuffleRow(c + 1, d + 1);
                this.shuffleRow(c + 2, d + 2);
                break;
            case 3:
                this.shuffleCol(c, d);
                this.shuffleCol(c + 1, d + 1);
                this.shuffleCol(c + 2, d + 2);
                break;
            default:
                break;
        }
    }

    shuffleRow(row1, row2) {
        for (let x = 0; x < 9; x++) {
            [this.cells[x][row1], this.cells[x][row2]] = [this.cells[x][row2], this.cells[x][row1]];
        }
    }

    shuffleCol(col1, col2) {
        [this.cells[col1], this.cells[col2]] = [this.cells[col2], this.cells[col1]];
    }

}

new Sudoku().init();

function ranInt(min, max) {
    return Math.floor((Math.random() * (max - 1)) + min);
}
