const selectTheme = document.getElementById("selectTheme");
const calcContainer = document.querySelector(".calcContainer");
const input = document.getElementById("calcInput");
const buttons = document.querySelectorAll("button");

let currentInput = "0";
let previousInput = "";
let currentOperator = null;
let shouldResetScreen = false;

// Theme switching
selectTheme.addEventListener("click", () => {
  calcContainer.classList.toggle("light-mode");
  const isLightMode = calcContainer.classList.contains("light-mode");
  selectTheme.textContent = isLightMode ? "☀️" : "⏾";
  localStorage.setItem("calculatorTheme", isLightMode ? "light" : "dark");
});

// Load saved theme
if (localStorage.getItem("calculatorTheme") === "light") {
  calcContainer.classList.add("light-mode");
  selectTheme.textContent = "☀️";
}

function updateDisplay() {
  input.value = currentInput;
}

function appendNumber(number) {
  if (currentInput === "0" || shouldResetScreen) {
    currentInput = number;
    shouldResetScreen = false;
  } else {
    currentInput += number;
  }
}

function addDecimal() {
  if (shouldResetScreen) {
    currentInput = "0.";
    shouldResetScreen = false;
    return;
  }
  if (!currentInput.includes(".")) {
    currentInput += ".";
  }
}

function handleOperator(operator) {
  // Convert input to number
  const inputValue = parseFloat(currentInput);

  if (previousInput === "") {
    // First operation
    previousInput = currentInput;
  } else if (currentOperator) {
    // Chain operations
    const result = calculate();
    currentInput = String(result);
    previousInput = currentInput;
    updateDisplay();
  }

  shouldResetScreen = true;
  currentOperator = operator;
}

function calculate() {
  const prev = parseFloat(previousInput);
  const current = parseFloat(currentInput);

  if (isNaN(prev) || isNaN(current)) return 0;

  switch (currentOperator) {
    case "+":
      return prev + current;
    case "-":
      return prev - current;
    case "x":
      return prev * current;
    case "÷":
      return prev / current;
    case "%":
      return prev % current;
    default:
      return current;
  }
}

function clearAll() {
  currentInput = "0";
  previousInput = "";
  currentOperator = null;
}

function deleteNumber() {
  if (currentInput.length === 1) {
    currentInput = "0";
  } else {
    currentInput = currentInput.slice(0, -1);
  }
}

// Button event listeners
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.id === "selectTheme") return;

    const buttonText = button.textContent;

    if (/[0-9]/.test(buttonText)) {
      appendNumber(buttonText);
    } else if (buttonText === ".") {
      addDecimal();
    } else if (["+", "-", "x", "÷", "%"].includes(buttonText)) {
      handleOperator(buttonText);
    } else if (buttonText === "=") {
      if (previousInput && currentOperator) {
        currentInput = String(calculate());
        previousInput = "";
        currentOperator = null;
        shouldResetScreen = true;
      }
    } else if (buttonText === "AC") {
      clearAll();
    } else if (button.querySelector(".material-icons")) {
      deleteNumber();
    }

    updateDisplay();
  });
});

// Initialize display
updateDisplay();
