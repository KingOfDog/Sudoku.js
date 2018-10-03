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

function ranInt(min, max) {
    return Math.floor((Math.random() * (max - 1)) + min);
}
