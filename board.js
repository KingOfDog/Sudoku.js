class Board {
    constructor(size, blockCount) {
        this.size = size;
        this.blockSize = Math.floor(this.size / blockCount);
        this.cells = [];

        this.cellContainer = document.getElementsByClassName('sudokuCells')[0];

        this.styles = {
            1: {
                colors: ["#f80759", "#bc4e9c"],
                textColor: '#fff',
            },
            2: {
                colors: ["#fe8c00", "#f83600"],
                textColor: '#fff',
            },
            3: {
                colors: ["#F4D03F", "#16A085"],
                textColor: '#fff',
            },
            4: {
                colors: ["#00C9FF", "#92FE9D"],
                textColor: '#fff',
            },
            5: {
                colors: ["#FDFC47", "#24FE41"],
                textColor: '#fff',
            },
            6: {
                colors: ["#00F260", "#0575E6"],
                textColor: '#fff',
            },
            7: {
                colors: ["#00d2ff", "#3a7bd5"],
                textColor: '#fff',
            },
            8: {
                colors: ["#FFAF7B", "#D76D77", "#3A1C71"],
                textColor: '#fff',
            },
            9: {
                colors: ["#3F5EFB", "#FC466B"],
                textColor: '#fff',
            },
        };
    }

    init() {
        let number = 0;

        for (let x = 0; x < this.size; x++) {
            this.cells.push([]);

            for (let y = 0; y < this.size; y++) {
                this.cells[x][y] = new Cell(number + 1);
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
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                this.cells[x][y].setMistake(!this.cells[x][y].isFixed && !this.checkCellValidity(x, y));
            }
        }
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
        this.cells[x][y].setNumber(null);
        this.cells[x][y].setFixed(false);
    }

    createCellElements() {
        for(let y = 0; y < this.size; y++) {
            for(let x = 0; x < this.size; x++) {
                this.cellContainer.appendChild(this.cells[x][y].createElement());
                this.cells[x][y].setFixed(true);
            }
        }
    }

    enterNumber(x, y, number) {
        if (!this.cells[x][y].isFixed) {
            this.cells[x][y].setNumber(number);
            this.checkValidity();
        }
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

    updateCells(activeCell) {
        const activeValue = this.getCellValue(activeCell);

        const gradientColors = activeValue !== null ? this.styles[activeValue].colors : [];
        const gradientHTML = `linear-gradient(135deg${generateHtmlGradient(gradientColors)})`;

        for(let x = 0; x < this.size; x++) {
            for(let y = 0; y < this.size; y++) {
                const isActive = activeValue !== null && this.cells[x][y].number === activeValue;
                this.cells[x][y].setActive(isActive, gradientHTML);
            }
        }
    }

}

function generateHtmlGradient(colors) {
    let result = "";

    for(let color of colors) {
        result += ", " + color;
    }

    return result;
}

function ranInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
