class Sudoku {
    constructor() {
        this.container = document.getElementsByClassName('sudokuContainer')[0];
        this.cellContainer = document.getElementsByClassName('sudokuCells')[0];

        this.board = new Board(9, 3);
        this.cellSize = (window.innerWidth - 27) / 9;

        this.cursor = new Cursor(this.cellSize);

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
        }
    }

    init() {
        this.board.init();
        this.board.shuffle();
        this.board.createCellElements();
        this.board.clearCells();
        this.windowResizeEvent();
        this.addListeners();
        this.setActiveCell({x: 0, y: 0});
    }

    addListeners() {
        this.cellContainer.addEventListener('click', (e) => {
            this.setActiveCell(this.getPosition(e.pageX, e.pageY));
        });

        window.addEventListener('keydown', (e) => {
            const activeCell = this.cursor.pos;
            if (!isNaN(parseInt(e.key))) {
                const number = parseInt(e.key);
                if (number > 0) {
                    this.board.enterNumber(activeCell.x, activeCell.y, number);
                }
            } else if (e.key === "Backspace") {
                this.board.clearCell(activeCell.x, activeCell.y);
            } else if (e.key === "ArrowDown") {
                activeCell.y++;
            } else if (e.key === "ArrowUp") {
                activeCell.y--;
            } else if (e.key === "ArrowLeft") {
                activeCell.x--;
            } else if (e.key === "ArrowRight") {
                activeCell.x++;
            } else {
                return;
            }

            activeCell.x = Math.min(8, activeCell.x);
            activeCell.y = Math.min(8, activeCell.y);
            activeCell.x = Math.max(0, activeCell.x);
            activeCell.y = Math.max(0, activeCell.y);

            this.setActiveCell(activeCell);
        });

        window.addEventListener('resize', this.windowResizeEvent());
    }

    // TODO: Implement different gradients for active cells in HTML/CSS
    getStyle(x, y) {
        const activeCellNumber = this.board.getCellValue(this.activeCell);
        const colors = this.styles[activeCellNumber].colors;
        const gradient = this.ctx.createLinearGradient(x * this.cellSize, y * this.cellSize, (x + 1) * this.cellSize, (y + 1) * this.cellSize);
        for (let i in colors) {
            if(colors.hasOwnProperty(i)) {
                const color = colors[i];
                gradient.addColorStop(i / (colors.length - 1), color);
            }
        }

        return gradient;
    }

    getPosition(mouseX, mouseY) {
        mouseX -= this.container.offsetLeft - this.container.clientWidth / 2;
        mouseY -= this.container.offsetTop;

        let x = Math.floor(mouseX / this.cellSize);
        let y = Math.floor(mouseY / this.cellSize);

        x = Math.min(x, 8);
        y = Math.min(y, 8);

        return {x: x, y: y};
    }

    setActiveCell(pos) {
        this.cursor.setPosition(pos.x, pos.y);
        this.board.updateCells(pos);
    }

    windowResizeEvent() {
        this.container.style.width = this.board.size * 100 + "px";
        this.cellSize = this.container.clientWidth / this.board.size;
        this.cursor.cellSize = this.cellSize;
        this.cursor.setPosition(this.cursor.pos);
    }
}