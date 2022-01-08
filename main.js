class Calculator {
    constructor() {
        this.data = {
            actualOperand: '0',
            previousOperand: '',
            operation: '',
            math: 0,
            sortType: 'default'
        }

        this.init();
    }

    init() { // устанавливает событие click на все кнопки 
        document.querySelectorAll('.button')
            .forEach(button => button.addEventListener('click', (e) => { this._router(e.target.innerText) }));
    }

    _router(char) { // запускает функции согласно символу на входе
        this.data = this.autoClear(this.data, char);
        switch (true) {
            case char.match(/\d|\./) !== null:
                if (this.data.actualOperand.length < 12) {
                    this.data.actualOperand = this.addSymbolChecker(this.data.actualOperand, char);
                } else alert('maximum number of digits reached');
                break;
            case char.match(/÷|\+|\-|x|%|=/) !== null && char.length == 1:
                let readyToCalculate = this.readyToCalculate(this.data);
                if (readyToCalculate) {
                    this.math = this.calculate(this.data);
                }
                this.data = this.sortData(this.data, char);
                break;
            case char.match(/(\+\/\-)/) !== null:
                this.data.actualOperand = this.changePrefix(this.data.actualOperand);
                break;
            case char.match(/DEL/) !== null:
                this.data.actualOperand = this.delete(this.data.actualOperand);
                break;
            case char.match(/C/) !== null:
                this.data = this.reset();
                break;
            default:
                console.log(`char: ${char} not recognized`);
        }

        this.outputOnDisplay(this.data);
    }

    addSymbolChecker(currentValue, addValue) { // проверка допустимых значений на ввод
        switch (true) {
            case currentValue === '0' && addValue.match(/\d/) !== null:
                return addValue;
            case currentValue.includes('.') && addValue === '.':
                return currentValue;
            default:
                return currentValue + addValue;
        }
    }

    formatter(value) { // форматирует число согласно европейскому виду

        if (value) {
            let integer = value.split('.')[0]
            let formatted = []
            let j = 1;
            for (let i = integer.length - 1; i > -1; i--) {
                formatted.unshift(integer[i]);
                if (j == 3) {
                    formatted.unshift(' ');
                    j = 0;
                }
                j++;
            }
            const result = value.split('.').length > 1 ?
                formatted.join('').replace(/(?<=-)\s/, '') + '.' + value.split('.')[1] :
                formatted.join('').replace(/(?<=-)\s/, '');
            return result;
        } else return '';

    }

    outputOnDisplay(obj) { // выводит изображение на экран калькулятора
        let formattedActualOperand = this.formatter(obj.actualOperand);
        let formattedPreviousOperand = this.formatter(obj.previousOperand);
        document.querySelector('.actual-screen').innerText = formattedActualOperand;
        document.querySelector('.memory-screen').innerText = formattedPreviousOperand + obj.operation;
    }

    reset() { // сбрасывает значения в состояние по дефолту
        return {
            actualOperand: '0',
            previousOperand: '',
            operation: '',
            math: 0,
            sortType: 'default'
        }
    }

    delete(value) { // удаляет по одному символу ввода
        value = value.slice(0, -1);
        if (value.length > 0 && value != '-') {
            return value;
        } else return '0';
    }

    autoClear(obj, char) { // очищает окно ввода после выполнения операции = при новом вводе
        if (obj.sortType === 'equals' && char.match(/\d/)) {
            obj = this.reset();
        } else obj.sortType = 'default';
        return obj;
    }

    changePrefix(actual) { // переводит число в отрицательное или положительное значение
        if (actual.includes('-')) {
            return actual.slice(1);
        } else if (actual != '0') {
            return '-' + actual;
        } else return actual;
    }

    calculate(obj) { // вычисляет значение
        switch (true) {
            case obj.operation.match(/\+/) !== null:
                obj.math = Number(obj.previousOperand) + Number(obj.actualOperand);
                break;
            case obj.operation.match(/\-/) !== null:
                obj.math = Number(obj.previousOperand) - Number(obj.actualOperand);
                break;
            case obj.operation.match(/÷/) !== null:
                obj.math = Number(obj.previousOperand) / Number(obj.actualOperand);
                break;
            case obj.operation.match(/x/) !== null:
                obj.math = Number(obj.previousOperand) * Number(obj.actualOperand);
                break;
            case obj.operation.match(/%/) !== null:
                obj.math = Number(obj.previousOperand) % Number(obj.actualOperand);
                break;
            default:
                console.log('error math');
        }
    }

    sortData(obj, operation) { // сортирует данные в объекте
        if (operation === '=') {
            obj.actualOperand = obj.math.toString();
            obj.previousOperand = '';
            obj.operation = '';
            obj.sortType = 'equals';
        } else if (obj.math == 0) {
            obj.previousOperand = obj.actualOperand;
            obj.actualOperand = '0';
            obj.operation = operation;
        } else if (operation !== '=') {
            obj.previousOperand = obj.math.toString();
            obj.actualOperand = '0';
            obj.operation = operation;
        }

        return obj;
    }

    readyToCalculate(obj) { // проверяет объект на готовность к расчету значения
        if (obj.actualOperand && obj.previousOperand && obj.operation && obj.actualOperand != '0') {
            return true;
        } else return false;
    }

}

const calculator = new Calculator();