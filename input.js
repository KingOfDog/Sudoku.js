class Input {
    constructor(value, parentElement, sudoku) {
        this.value = value;
        this.style = sudoku.board.getStyle(this.value);

        this.element = document.createElement('button');
        this.element.innerText = value;
        this.element.classList.add('sudokuInput');
        parentElement.appendChild(this.element);

        this.element.addEventListener('click', () => this.clickEvent(sudoku));
    }

    clickEvent(sudoku) {
        const pos = sudoku.cursor.pos;
        sudoku.board.enterNumber(pos.x, pos.y, this.value);
        sudoku.setActiveCell(pos);
    }

    setDisabled(isDisabled) {
        if(isDisabled) {
            this.element.classList.add('disabled');
            this.element.style.backgroundImage = "";
            this.element.style.color = "";
        } else {
            this.element.classList.remove('disabled');
            this.element.style.backgroundImage = this.style.bg;
            this.element.style.color = this.style.fg;
        }
    }
}