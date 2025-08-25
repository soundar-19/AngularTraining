function calculate(operator: string): void {
    const num1 = parseFloat((document.getElementById("num1") as HTMLInputElement).value);
    const num2 = parseFloat((document.getElementById("num2") as HTMLInputElement).value);
    const resultElement = document.getElementById("result") as HTMLElement;

    let result: number | string;

    if (isNaN(num1) || isNaN(num2)) {
        result = "Invalid input";
    } else {
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

    resultElement.textContent = `Result: ${result}`;
}
function clearInputs(): void {
    (document.getElementById("num1") as HTMLInputElement).value = '';
    (document.getElementById("num2") as HTMLInputElement).value = '';
    (document.getElementById("result") as HTMLElement).textContent = 'Result: ';
}