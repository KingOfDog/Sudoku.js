class Cursor {
    constructor(cellSize) {
        this.cursorElement = document.getElementsByClassName('cursor')[0];
        this.cursorElement.style.width = this.cursorElement.style.height = cellSize - 6 + "px";

        this.cellSize = cellSize;
    }

    setPosition(x, y) {
        this.cursorElement.style.marginLeft = (x * this.cellSize) - 3 + "px";
        this.cursorElement.style.marginTop = (y * this.cellSize) - 3 + "px";
    }
}