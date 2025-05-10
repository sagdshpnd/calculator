function add(num1, num2) {
    return num1+num2;
    
}

function subtract(num1, num2) {
    return num1-num2;
}

function multiply(num1, num2) {
    return num1*num2;
}

function divide(num1, num2) {
    if(num2 ===0) return "Error! Cant divide by zero!";
    return num1/num2;
}

let inputNumber1, operator, inputNumber2;

function operate(num1, operator, num2) {
    switch(operator) {
        case '+':
            add(num1, num2);
            break;
        case '-':
            subtract(num1, num2);
            break;
        case '*':
            multiply(num1, num2);
            break;
        case '/':
            divide(num1, num2);
    }
                        
}