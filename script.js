const display = document.getElementById("calc-display");
const buttons = document.querySelectorAll(".btn");
const historyElement = document.getElementById("calculation-history");
const historyContainer = document.querySelector(".history"); // Seleciona o container do histórico

const historyDiv = document.querySelector(".history");

let currentInput = "0";
let previousInput = ""; // Armazena o número anterior
let currentOperation = ""; // Armazena a operação
let isNewNumber = true; // Controla se devemos começar um novo número
let lastCalculations = [];

// Adiciona evento de clique para cada botão
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.innerText;

    // Operações especiais
    if (value === "=") {
      calculate(); // Função para calcular o resultado
    } else if (value === "C") {
      clearDisplay(); // Função para limpar o display
    } else if (value === "%") {
      percentage(); // Função para porcentagem
    } else if (value === "^") {
      exponentiation(); // Função para exponenciação
    } else if (["+", "-", "*", "/"].includes(value)) {
      setOperation(value); // Define a operação
    } else {
      addToDisplay(value); // Adiciona número ou ponto
    }
  });
});

// Função para adicionar números ao display
function addToDisplay(value) {
  if (isNewNumber) {
    currentInput = value === "." ? "0." : value; // Evitar ponto sem número
    isNewNumber = false;
  } else {
    if (value === "." && currentInput.includes(".")) return; // Evitar múltiplos pontos
    currentInput += value; // Adiciona o número ou ponto
  }
  updateDisplay();
}

// Atualiza o display com o valor atual
function updateDisplay() {
  display.value = currentInput;
}

// Define a operação a ser realizada
function setOperation(operator) {
  if (currentOperation && !isNewNumber) {
    calculate(); // Calcula o resultado anterior se houver uma operação pendente
  }
  previousInput = currentInput; // Armazena o número atual como o número anterior
  currentOperation = operator;
  isNewNumber = true; // Após selecionar a operação, começaremos um novo número
}

// Função para calcular o resultado
function calculate() {
  if (!currentOperation || isNewNumber) return; // Se não houver operação ou novo número, não faz nada

  const num1 = parseFloat(previousInput);
  const num2 = parseFloat(currentInput);
  let result = 0;

  switch (currentOperation) {
    case "+":
      result = num1 + num2;
      break;
    case "-":
      result = num1 - num2;
      break;
    case "*":
      result = num1 * num2;
      break;
    case "/":
      result = num1 / num2;
      break;
    default:
      return;
  }

  currentInput = String(result); // Atualiza o valor atual com o resultado
  addCalculation(result); // Armazena o cálculo na lista de últimos cálculos
  currentOperation = ""; // Limpa a operação
  updateDisplay();
  isNewNumber = true; // Prepara para o próximo número
}

// Função para limpar o display
function clearDisplay() {
  currentInput = "0";
  previousInput = "";
  currentOperation = "";
  isNewNumber = true;
  updateDisplay();
}

// Função para calcular a porcentagem no contexto de soma, subtração, multiplicação e divisão
function percentage() {
  if (!previousInput || !currentOperation) return; // Garante que haja um número e uma operação

  const num1 = parseFloat(previousInput);
  const num2 = parseFloat(currentInput);

  let result = 0;

  // Verifica a operação atual para aplicar a porcentagem corretamente
  switch (currentOperation) {
    case "+":
      result = num1 + (num1 * num2) / 100; // Soma com a porcentagem
      break;
    case "-":
      result = num1 - (num1 * num2) / 100; // Subtrai a porcentagem
      break;
    case "*":
      result = num1 * (num2 / 100); // Multiplica por porcentagem
      break;
    case "/":
      result = num1 / (num2 / 100); // Divide por porcentagem
      break;
    default:
      return;
  }

  currentInput = String(result); // Atualiza o valor atual com o resultado da porcentagem
  addCalculation(result); // Adiciona o cálculo ao histórico
  currentOperation = ""; // Limpa a operação
  updateDisplay();
  isNewNumber = true; // Prepara para o próximo número
}

// Função para exponenciação
function exponentiation() {
  if (!currentInput) return;
  currentInput = String(Math.pow(parseFloat(currentInput), 2)); // Eleva ao quadrado o número atual
  updateDisplay();
  isNewNumber = true;
}

function addCalculation(result) {
  lastCalculations.push(result);

  if (lastCalculations.length > 10) {
    lastCalculations.shift();
  }

  updateHistory();
  console.log("Últimos 10 cálculos: ", lastCalculations);
}
// Função para exibir os últimos 10 cálculos na página
function updateHistory() {
  historyElement.innerHTML = ""; // Limpa o histórico anterior
  lastCalculations.forEach((calc, index) => {
    const li = document.createElement("li");
    li.innerText = `${index + 1}: ${calc}`;
    historyElement.appendChild(li);
  });
}
// Função para imprimir em PDF e exibir o histórico temporariamente
const printButton = document.getElementById("print-btn");
printButton.addEventListener("click", () => {
  // Exibe o histórico antes de abrir a janela de impressão
  historyDiv.style.display = "block"; // Mostra o histórico antes de imprimir

  setTimeout(() => {
    window.print(); // Abre o diálogo de impressão do navegador

    setTimeout(() => {
      // Aguarda um momento para que o conteúdo seja renderizado corretamente antes de ocultar
      historyDiv.style.display = "none"; // Esconde o histórico após imprimir
    }, 1000);
  }, 300);
});

// Garante que o histórico esteja oculto quando a página for recarregada
window.onload = () => {
  historyDiv.style.display = "none";
};
