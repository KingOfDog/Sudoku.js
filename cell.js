class Cell {
    constructor(value) {
        this.number = value;
        this.isFixed = true;
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.classList.add('cell');
        this.updateNumberElement();

        return this.element;
    }

    setActive(isActive, activeBackground) {
        if(isActive) {
            this.element.classList.add('active');
            this.element.style.backgroundImage = activeBackground;
        } else {
            this.element.classList.remove('active');
            this.element.style.backgroundImage = "";
        }
    }

    setFixed(isFixed) {
        this.isFixed = isFixed;
        if(isFixed)
            this.element.classList.add('is-fixed');
        else
            this.element.classList.remove('is-fixed');
    }

    setMistake(hasMistake) {
        if(hasMistake)
            this.element.classList.add('has-mistake');
        else
            this.element.classList.remove('has-mistake');
    }

    setNumber(number) {
        this.number = number;
        this.updateNumberElement();
    }

    updateNumberElement() {
        if(this.element)
            this.element.innerHTML = `<h1>${this.number !== null ? this.number : ''}</h1>`;
    }
}