class InputButtons {
    constructor(size, instance) {
        this.container = document.getElementsByClassName('sudokuContainer')[0];
        this.inputContainer = document.createElement('div');
        this.container.appendChild(this.inputContainer);

        this.inputs = [];
        for(let i = 1; i <= size; i++) {
            const input = new Input(i, this.inputContainer, instance);

            this.inputs.push(input);
        }
    }

    setAllowedInputs(allowedValues) {
        for(let input of this.inputs) {
            const isDisabled = allowedValues.indexOf(input.value) === -1;
            input.setDisabled(isDisabled);
        }
    }
}