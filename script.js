//program of the calculator

// First, let's create a helper function to prepare the function input
function prepareMathExpression(input) {
  // Replace exp(x) with Math.exp(x)
  let prepared = input.replace(/exp\s*\(/g, 'Math.exp(');
  
  // Replace other power operations (^)
  prepared = prepared.replace(/\^/g, '**');
  
  return prepared;
}

// Update your event listener
document.getElementById("dichotomy-form").addEventListener("submit", (e) => {
  e.preventDefault();

  // Get input values
  const funcInput = document.getElementById("function").value;
  const a = parseFloat(document.getElementById("a").value);
  const b = parseFloat(document.getElementById("b").value);
  const tolerance = parseFloat(document.getElementById("tolerance").value);

  // Prepare the function input
  const preparedFuncInput = prepareMathExpression(funcInput);
  
  // Create a function from the string
  const func = new Function("x", `return ${preparedFuncInput}`);

  try {
      const result = solveDichotomy(func, a, b, tolerance);
      document.getElementById("result").innerHTML = `
          <p><strong>Root:</strong> ${result.root.toFixed(6)}</p>
          <p><strong>Iterations:</strong> ${result.iterations}</p>
      `;
      document.getElementById("result").style.display = "block";
  } catch (error) {
      document.getElementById('result').innerHTML = `<p style="color: red;">${error.message}</p>`;
      document.getElementById('result').style.display = "block";
  }
});

 // Dichotomy function
 function solveDichotomy(func, a, b, tolerance = 1e-6) {
  // Check if the function has different signs at the endpoints
  if (func(a) * func(b) >= 0) {
    throw new Error("The function must have different signs at the endpoints a and b!");
  }

  let mid, n = 0; // Initialize mid-point and iteration counter

  // Iterative process
  while ((b - a) / 2 > tolerance) {
    mid = (a + b) / 2;
    n++;

    if (func(mid) === 0) {
      // Exact root found
      return { root: mid, iterations: n };
    } else if (func(a) * func(mid) < 0) {
      // Root lies in the left interval
      b = mid;
    } else {
      // Root lies in the right interval
      a = mid;
    }
  }

  // Return the approximate root and iteration count
  return { root: (a + b) / 2, iterations: n };
}