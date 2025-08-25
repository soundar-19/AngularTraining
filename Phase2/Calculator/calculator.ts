interface Elements {
  history: HTMLElement;
  result: HTMLElement;
  keys: HTMLElement;
}

interface State {
  current: string;
  previous: string | null;
  operator: string | null;
  overwrite: boolean;
}

const el: Elements = {
  history: document.getElementById('history')!,
  result: document.getElementById('result')!,
  keys: document.getElementById('keys')!,
};

const state: State = {
  current: '0',
  previous: null,
  operator: null,
  overwrite: true,
};

function updateDisplay(): void {
  el.result.textContent = state.current;
  const h = (state.previous !== null && state.operator)
    ? `${state.previous} ${symbolFor(state.operator)}`
    : '\u00A0';
  el.history.textContent = h;
}

function symbolFor(op: string): string {
  return op === '*' ? '×' : op === '/' ? '÷' : op;
}

function inputDigit(d: string): void {
  if (state.overwrite) {
    state.current = d;
    state.overwrite = false;
  } else {
    state.current = state.current === '0' ? d : state.current + d;
  }
  updateDisplay();
}

function inputDecimal(): void {
  if (state.overwrite) {
    state.current = '0.';
    state.overwrite = false;
  } else if (state.current.indexOf('.') === -1) {
    state.current += '.';
  }
  updateDisplay();
}

function toggleSign(): void {
  if (state.current === '0') return;
  if (state.current.charAt(0) === '-') state.current = state.current.slice(1);
  else state.current = '-' + state.current;
  updateDisplay();
}

function chooseOperator(op: string): void {
  if (state.operator && !state.overwrite) {
    compute();
  }
  state.operator = op;
  state.previous = state.current;
  state.overwrite = true;
  updateDisplay();
}

function compute(): void {
  const a = parseFloat(state.previous!);
  const b = parseFloat(state.current);
  if (!isFinite(a) || !isFinite(b) || state.operator === null) return;

  let out: number;
  switch (state.operator) {
    case '+': out = a + b; break;
    case '-': out = a - b; break;
    case '*': out = a * b; break;
    case '/':
      if (b === 0) {
        flashError('Cannot divide by 0');
        clearAll();
        return;
      }
      out = a / b; break;
    default: return;
  }
  state.current = format(out);
  state.previous = null;
  state.operator = null;
  state.overwrite = true;
  updateDisplay();
}

function format(num: number): string {
  const rounded = Math.round(num * 1e12) / 1e12;
  return String(rounded);
}

function clearAll(): void {
  state.current = '0';
  state.previous = null;
  state.operator = null;
  state.overwrite = true;
  updateDisplay();
}

function deleteLast(): void {
  if (state.overwrite) return;
  if (state.current.length <= 1 || (state.current.length === 2 && state.current.charAt(0) === '-')) {
    state.current = '0';
    state.overwrite = true;
  } else {
    state.current = state.current.slice(0, -1);
  }
  updateDisplay();
}

function flashError(msg: string): void {
  el.history.textContent = msg;
  el.history.style.color = '#fca5a5';
  setTimeout(() => { el.history.style.color = ''; updateDisplay(); }, 1200);
}

el.keys.addEventListener('click', (e: Event) => {
  const t = (e.target as Element).closest('button');
  if (!t) return;
  const digit = t.getAttribute('data-digit');
  const op = t.getAttribute('data-op');
  const action = t.getAttribute('data-action');

  if (digit) return inputDigit(digit);
  if (op) return chooseOperator(op);

  switch (action) {
    case 'decimal': return inputDecimal();
    case 'equals': return compute();
    case 'all-clear': return clearAll();
    case 'delete': return deleteLast();
    case 'sign': return toggleSign();
  }
});

document.addEventListener('keydown', (e: KeyboardEvent) => {
  const { key } = e;
  if (/^[0-9]$/.test(key)) return inputDigit(key);
  if (key === '.') return inputDecimal();
  if (key === '+' || key === '-' || key === '*' || key === '/') return chooseOperator(key);
  if (key === 'Enter' || key === '=') return compute();
  if (key === 'Backspace') return deleteLast();
  if (key === 'Delete') return clearAll();
});

updateDisplay();