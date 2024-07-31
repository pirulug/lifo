// Función para convertir la expresión infija a RPN
function infixToRPN(expression) {
  const precedence = { "+": 1, "-": 1, "*": 2, "/": 2, "^": 3 };
  const operators = [];
  const output = [];
  const tokens = expression.match(/\d+|[\+\-\*/\^\(\)]/g);

  tokens.forEach((token) => {
    if (/\d/.test(token)) {
      output.push(token);
    } else if ("+-*/^".includes(token)) {
      while (
        operators.length > 0 &&
        operators[operators.length - 1] !== "(" &&
        precedence[token] <= precedence[operators[operators.length - 1]]
      ) {
        output.push(operators.pop());
      }
      operators.push(token);
    } else if (token === "(") {
      operators.push(token);
    } else if (token === ")") {
      while (operators.length > 0 && operators[operators.length - 1] !== "(") {
        output.push(operators.pop());
      }
      operators.pop(); // pop '('
    }
  });

  while (operators.length > 0) {
    output.push(operators.pop());
  }

  return output.join(" ");
}

// Función para evaluar la expresión RPN
function evaluateRPN(expression) {
  const stack = [];
  const tokens = expression.split(" ");
  const actions = [];

  tokens.forEach((token) => {
    if (/\d/.test(token)) {
      stack.push(parseInt(token));
      actions.push({ type: "push", value: token });
    } else {
      const right = stack.pop();
      const left = stack.pop();
      let result;
      switch (token) {
        case "+":
          result = left + right;
          break;
        case "-":
          result = left - right;
          break;
        case "*":
          result = left * right;
          break;
        case "/":
          result = left / right;
          break;
        case "^":
          result = Math.pow(left, right);
          break;
      }
      stack.push(result);
      actions.push({ type: "apply_operation", operator: token });
      actions.push({ type: "stack_state", stack: [...stack] });
    }
  });

  return { result: stack[0], actions };
}

// Función para iniciar la animación
function startAnimation() {
  const expression = document.getElementById("expression").value;
  const rpn = infixToRPN(expression);
  const { result, actions } = evaluateRPN(rpn);

  const animationDiv = document.getElementById("animation");
  animationDiv.innerHTML = ""; // Clear previous animations

  // Mostrar la notación polaca inversa
  const rpnParagraph = document.createElement("p");
  rpnParagraph.textContent = `Notación Polaca Inversa: ${rpn}`;
  rpnParagraph.style.fontWeight = "bold";
  animationDiv.appendChild(rpnParagraph);

  let step = 0;

  function update() {
    if (step >= actions.length) return;

    const action = actions[step];
    const p = document.createElement("p");

    if (action.type === "push") {
      p.textContent = `Empujar ${action.value}`;
      p.style.color = "green";
    } else if (action.type === "apply_operation") {
      p.textContent = `Aplicar operación ${action.operator}`;
      p.style.color = "purple";
    } else if (action.type === "stack_state") {
      p.textContent = `Pila: ${action.stack.join(", ")}`;
      p.style.color = "black";
    }

    animationDiv.appendChild(p);
    step++;

    setTimeout(update, 1000); // Ajustar el intervalo según sea necesario
  }

  update();

  document.getElementById("result").textContent = `El resultado es: ${result}`;
}
