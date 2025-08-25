function calculate(operator) {
    var num1 = parseFloat(document.getElementById("num1").value);
    var num2 = parseFloat(document.getElementById("num2").value);
    var resultElement = document.getElementById("result");
    var result;
    if (isNaN(num1) || isNaN(num2)) {
        result = "Invalid input";
    }
    else {
        switch (operator) {
            case '+':
                result = num1 + num2;
                break;
            case '-':
                result = num1 - num2;
                break;
            case '*':
                result = num1 * num2;
                break;
            case '/':
                result = num2 !== 0 ? num1 / num2 : "Cannot divide by zero";
                break;
            default:
                result = "Invalid operator";
        }
    }
    resultElement.textContent = "Result: ".concat(result);
}
function clearInputs() {
    document.getElementById("num1").value = '';
    document.getElementById("num2").value = '';
    document.getElementById("result").textContent = 'Result: ';
}
