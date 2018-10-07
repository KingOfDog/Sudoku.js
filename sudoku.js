class Sudoku {
    constructor() {
        this.container = document.getElementsByClassName('sudokuContainer')[0];
        this.cellContainer = document.getElementsByClassName('sudokuCells')[0];

        this.board = new Board(9, 3);
        this.cellSize = (window.innerWidth - 27) / 9;

        this.cursor = new Cursor(this.cellSize);

        this.input = new InputButtons(9, this);
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
        this.input.setAllowedInputs(this.board.getAllowedValues(pos));
    }

    windowResizeEvent() {
        this.container.style.width = this.board.size * 100 + "px";
        this.cellSize = this.container.clientWidth / this.board.size;
        this.cursor.cellSize = this.cellSize;
        this.cursor.setPosition(this.cursor.pos);
    }
}