//Declare basic operations
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

function remainder(num1, num2) {
    return num1%num2;
}

//Grab all key DOM elements
const calcKeys = document.querySelectorAll("#buttons");
const userInput = document.querySelector('#expression');
userInput.textContent = '0'; // Set initial display to 0
const calculator = document.querySelector('#calculator');
const displayResult = document.querySelector("#result");
//check for states
let isEqualsPressed = false;
let equation = '';
let checkforDecimal = 0;
let isInversePressed = 0;
//addEventListeners
calcKeys.forEach((key) => {
    key.addEventListener('click', (event) =>{
        //Event logic will come here
        //Ignore clicks outside of buttons
        if(!event.target.closest('button')) return;
            
        //Extract button info;
            
        const key = event.target.closest('button');
        const keyValue = key.textContent;
        const { type } = key.dataset;
        const value = key.getAttribute('value');  // Safely get button's value
        let inputDisplay = userInput.textContent;
        const {previousKeyType} = calculator.dataset

        //If any number button is pressed
        if(type === 'number' && !isEqualsPressed){ 
            if(inputDisplay === '0' || equation === '') {
                userInput.textContent = keyValue;
                equation = key.value;
                checkforDecimal = keyValue;
            } else {
                if(checkforDecimal.length >=19){
                    var replaceNumber = checkforDecimal;
                    checkforDecimal = Number(checkforDecimal).toExponential(2);
                    userInput.textContent = inputDisplay.replace(replaceNumber, checkforDecimal);
                }else{
                    userInput.textContent = userInput.textContent.includes('N')? 'NaN' :
                                                        userInput.textContent.includes('I')? 'Infinity': inputDisplay+keyValue;
                                                        equation = equation + key.value;
                                                        checkforDecimal = checkforDecimal + keyValue;
                }
            }
        }

    /*1. Check if operator is pressed AND Equals To (=) is not yet pressed
    2. AND Display does not include Infinity
    3. Replace checkforDecimal with blank to store next number
*/

        if (type === 'operator') {
            // Only calculate if the last key was a number or equals (not another operator)
            if (
                previousKeyType !== 'operator' &&
                !isEqualsPressed &&
                !inputDisplay.includes('Infinity') &&
                equation.trim() !== '' &&
                !inputDisplay.endsWith('√')
            ) {
                // Calculate the current result
                let currentResult = handleEquation(equation);
                displayResult.textContent =
                    typeof currentResult === 'number'
                        ? (!Number.isInteger(currentResult)
                            ? currentResult.toFixed(2)
                            : (currentResult.toString().length < 16)
                                ? currentResult
                                : currentResult.toExponential(2))
                        : currentResult;

                // Use the result as the start of the next equation
                userInput.textContent = currentResult + keyValue;
                equation = currentResult + ' ' + key.value + ' ';
                checkforDecimal = '';
                isEqualsPressed = false;
                calculator.dataset.previousKeyType = type;
                return;
            }

            // If first operator or after another operator, just append as before
            if (previousKeyType !== 'operator' && keyValue === '-') {
                userInput.textContent += keyValue;
                equation += key.value;
                calculator.dataset.previousKeyType = type;
                return;
            }

            if (
                previousKeyType !== 'operator' &&
                !isEqualsPressed &&
                !inputDisplay.includes('Infinity')
            ) {
                checkforDecimal = "";
                userInput.textContent = inputDisplay + '' + keyValue + '';
                equation = equation + ' ' + key.value + ' ';
                calculator.dataset.previousKeyType = type;
                return;
            }
        }
    /* 
    1. Check if Decimal button is pressed AND Equals To is not yet pressed
    2. AND check if the previously pressed button a number or was display a 0
    3. #2 is required so that if user presses decimal after operator, it is not displayed
    4. check if number already contains a decimal
    */
   
    if (
        type === 'decimal' &&
        !isEqualsPressed &&
        !inputDisplay.includes('Infinity') &&
        (
            previousKeyType === 'number' ||
            inputDisplay === '0' ||
            inputDisplay.endsWith('√') // Allow decimal after √
        )
    ) {
        if (!checkforDecimal.includes('.')) {
            userInput.textContent = inputDisplay + keyValue;
            equation = equation + key.value;
            checkforDecimal = checkforDecimal + keyValue;
        }
    }

    if((type === 'backspace'|| type === 'reset') && inputDisplay !==0){
        if(type === 'backspace' && !isEqualsPressed) {
            userInput.textContent = inputDisplay.substring(0,inputDisplay.length-1);
            equation = equation.substring(0, equation.length-1);
            checkforDecimal = checkforDecimal.substring(0, checkforDecimal.length-1);
        }else {
            inputDisplay = '0'; // Show 0 after reset
            userInput.textContent = inputDisplay;
            displayResult.innerHTML = '&nbsp;';
            isEqualsPressed = false;
            equation = ''; // Clean slate for equation
            checkforDecimal = '';
        }
    }

    if (type === 'sqrt') {
        // Prevent multiple consecutive square roots
        if (userInput.textContent.endsWith('√')) {
            return;
        }
        // If starting fresh, just set to √
        if (userInput.textContent === '0' || userInput.textContent === '') {
            userInput.textContent = value;
            equation = value;
        } else {
            userInput.textContent += value;
            equation += value;
        }
        checkforDecimal = ''; // Reset for new number after root
        return;
    }


    //Send equation for calculation after Equals To (=) is pressed
    if(type === 'equal') {
        console.log('Equal button is pressed. Equation is:', equation);
        //Perform a calculation
        isEqualsPressed = true;
        const finalResult = handleEquation(equation);
        console.log(finalResult);
        if(typeof finalResult === 'number') {
            displayResult.textContent = (!Number.isInteger(finalResult))?finalResult.toFixed(2):(finalResult.toString().length<16)?finalResult:finalResult.toExponential(2);    
        } else {
            displayResult.textContent = finalResult;
        }
    }

    calculator.dataset.previousKeyType = type;   
    });
});

//Function to calculate result based on each operator
function operate(num1, operator, num2) {

    firstNumber = Number(num1);
    secondNumber = Number(num2);
    switch(operator) {
        case '+':
            return add(firstNumber,secondNumber);  
        case '-':
            return subtract(firstNumber,secondNumber);
        
        case '*':
            return multiply(firstNumber,secondNumber);
            
        case '/':
            return divide(firstNumber,secondNumber);
        case '%':
            return remainder(firstNumber,secondNumber);
    }
                        
}

function handleEquation(equation){
    // Split the equation into tokens
    equation = equation.split(" ");
    const operators = ['/', '*', '%', '+', '-'];
    let firstNumber;
    let secondNumber;
    let operator;
    let operatorIndex;
    let result;

    // Handle square root operator first
    for (let i = 0; i < equation.length; i++) {
        if (equation[i].startsWith('√')) {
            let num = Number(equation[i].slice(1));
            if (isNaN(num)) {
                // Try to handle cases like "√ 9"
                if (equation[i] === '√' && !isNaN(Number(equation[i+1]))) {
                    num = Number(equation[i+1]);
                    equation.splice(i, 2, Math.sqrt(num));
                    i--; // Stay at the same index for next iteration
                    continue;
                } else {
                    return "Error!";
                }
            }
            equation[i] = Math.sqrt(num);
        }
    }

    /*
        1. Perform calculations as per BODMAS method
        2. For that use operators array
        3. After calculations of numbers replace them with result
        4. Use splice method
    */
   for(var i=0; i< operators.length; i++){
        while(equation.includes(operators[i])) {
            operatorIndex = equation.findIndex(item => item === operators[i]);
            firstNumber = equation[operatorIndex-1];
            operator = equation[operatorIndex];
            secondNumber = equation[operatorIndex+1];
            result = operate(firstNumber,operator,secondNumber);
            equation.splice(operatorIndex-1,3,result);
        }
    }

    // If only one value remains, return it
    if (equation.length === 1) {
        return equation[0];
    }
    // Otherwise, return the last result (for safety)
    return result;
}
