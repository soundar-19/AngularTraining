var el = {
    history: document.getElementById('history'),
    result: document.getElementById('result'),
    keys: document.getElementById('keys'),
};
var state = {
    current: '0',
    previous: null,
    operator: null,
    overwrite: true,
};
function updateDisplay() {
    el.result.textContent = state.current;
    var h = (state.previous !== null && state.operator)
        ? "".concat(state.previous, " ").concat(symbolFor(state.operator))
        : '\u00A0';
    el.history.textContent = h;
}
function symbolFor(op) {
    return op === '*' ? '×' : op === '/' ? '÷' : op;
}
function inputDigit(d) {
    if (state.overwrite) {
        state.current = d;
        state.overwrite = false;
    }
    else {
        state.current = state.current === '0' ? d : state.current + d;
    }
    updateDisplay();
}
function inputDecimal() {
    if (state.overwrite) {
        state.current = '0.';
        state.overwrite = false;
    }
    else if (state.current.indexOf('.') === -1) {
        state.current += '.';
    }
    updateDisplay();
}
function toggleSign() {
    if (state.current === '0')
        return;
    if (state.current.charAt(0) === '-')
        state.current = state.current.slice(1);
    else
        state.current = '-' + state.current;
    updateDisplay();
}
function chooseOperator(op) {
    if (state.operator && !state.overwrite) {
        compute();
    }
    state.operator = op;
    state.previous = state.current;
    state.overwrite = true;
    updateDisplay();
}
function compute() {
    var a = parseFloat(state.previous);
    var b = parseFloat(state.current);
    if (!isFinite(a) || !isFinite(b) || state.operator === null)
        return;
    var out;
    switch (state.operator) {
        case '+':
            out = a + b;
            break;
        case '-':
            out = a - b;
            break;
        case '*':
            out = a * b;
            break;
        case '/':
            if (b === 0) {
                flashError('Cannot divide by 0');
                clearAll();
                return;
            }
            out = a / b;
            break;
        default: return;
    }
    state.current = format(out);
    state.previous = null;
    state.operator = null;
    state.overwrite = true;
    updateDisplay();
}
function format(num) {
    var rounded = Math.round(num * 1e12) / 1e12;
    return String(rounded);
}
function clearAll() {
    state.current = '0';
    state.previous = null;
    state.operator = null;
    state.overwrite = true;
    updateDisplay();
}
function deleteLast() {
    if (state.overwrite)
        return;
    if (state.current.length <= 1 || (state.current.length === 2 && state.current.charAt(0) === '-')) {
        state.current = '0';
        state.overwrite = true;
    }
    else {
        state.current = state.current.slice(0, -1);
    }
    updateDisplay();
}
function flashError(msg) {
    el.history.textContent = msg;
    el.history.style.color = '#fca5a5';
    setTimeout(function () { el.history.style.color = ''; updateDisplay(); }, 1200);
}
el.keys.addEventListener('click', function (e) {
    var t = e.target.closest('button');
    if (!t)
        return;
    var digit = t.getAttribute('data-digit');
    var op = t.getAttribute('data-op');
    var action = t.getAttribute('data-action');
    if (digit)
        return inputDigit(digit);
    if (op)
        return chooseOperator(op);
    switch (action) {
        case 'decimal': return inputDecimal();
        case 'equals': return compute();
        case 'all-clear': return clearAll();
        case 'delete': return deleteLast();
        case 'sign': return toggleSign();
    }
});
document.addEventListener('keydown', function (e) {
    var key = e.key;
    if (/^[0-9]$/.test(key))
        return inputDigit(key);
    if (key === '.')
        return inputDecimal();
    if (key === '+' || key === '-' || key === '*' || key === '/')
        return chooseOperator(key);
    if (key === 'Enter' || key === '=')
        return compute();
    if (key === 'Backspace')
        return deleteLast();
    if (key === 'Delete')
        return clearAll();
});
updateDisplay();
