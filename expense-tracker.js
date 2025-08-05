const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

//constants
const expenseTypes = ["food", "transport", "entertainment"];
let expenses = [];
let newId = 1;

//Add Expense
function addExpense() {
  readline.question("Enter amount: ", (amountInput) => {
    const amount = parseFloat(amountInput);

    if (isNaN(amount)) {
      console.error("Error: Enter a valid number");
      return addExpense();
    }

    if (amount <= 0) {
      console.error("Error: Amount have to be positive");
      return addExpense();
    }

    readline.question(
      "Enter expense type (food/transport/entertainment): ",
      (expenseTypeInput) => {
        const expenseType = expenseTypeInput.trim().toLowerCase();

        if (!expenseTypes.includes(expenseType)) {
          console.error("Error: Invalid category\n");
          return addExpense();
        }

        readline.question("Enter description: ", (description) => {
          const newExpense = {
            id: newId++,
            amount: amount,
            category: expenseType.toUpperCase(),
            description: description.trim(),
            date: new Date().toISOString().split("T")[0],
          };

          expenses.push(newExpense);
          console.log(`Expense added successfully! ID: ${newExpense.id}`);
          showMenu();
        });
      }
    );
  });
}

//View All Expense
function viewAllExpense() {
  if (expenses.length === 0) {
    console.log("No expenses recorded yet");
    return;
  }
  console.log("All Expenses:");

  expenses.forEach((expense) => {
    let id = expense.id;
    let amount = expense.amount.toFixed(2);
    let category = expense.category;
    let description = expense.description;
    let date = expense.date;
    console.log(
      `ID: ${id} | $${amount} | ${category} | ${description} | ${date}`
    );
  });
}

//View By Category
function viewByCategory() {
  readline.question("Enter category: ", (categoryInput) => {
    const category = categoryInput.trim().toLowerCase();

    if (!expenseTypes.includes(category)) {
      console.error("Error: Invalid category\n");
      return viewByCategory;
    }

    const categoryExpenses = expenses.filter(
      (expense) => expense.category.toLowerCase() === category
    );

    if (categoryExpenses.length === 0) {
      console.log("No expenses in this category");
      return;
    }
    console.log(`${category.toUpperCase()} Expenses:`);

    let categoryTotal = 0;

    categoryExpenses.forEach((expense) => {
      let id = expense.id;
      let amount = expense.amount.toFixed(2);
      let description = expense.description;
      let date = expense.date;
      console.log(`ID: ${id} | $${amount} | ${description} | ${date}`);
      categoryTotal += expense.amount;
    });
    console.log(`Category Total: $${categoryTotal.toFixed(2)}`);
    showMenu();
  });
}

//Calculate Total
function calculateTotal() {
  if (expenses.length === 0) {
    console.log("No expenses yet.");
    return 0;
  }

  let total = 0;
  expenses.forEach((expense) => (total += expense.amount));
  console.log(`\nTOTAL EXPENSES: $${total.toFixed(2)}`);
}

//Remove Expense
function removeExpense() {
  viewAllExpense();

  if (expenses.length === 0) {
    console.log("No expenses");
    return;
  }

  readline.question("Enter ID of expense to remove: ", (input) => {
    const id = parseInt(input);

    const expenseIndex = expenses.findIndex((exp) => exp.id === id);

    if (expenseIndex === -1) {
      console.error(`Error: No expense found with ID ${id}`);
    } else {
      const expense = expenses[expenseIndex];
      expenses.splice(expenseIndex, 1);
      let id = expense.id;
      let amount = expense.amount.toFixed(2);
      let category = expense.category;
      let description = expense.description;
      let date = expense.date;
      console.log(
        `Removed expense ID ${id}: $${amount} | ${category} | ${description}`
      );
      console.log(`Total expenses remaining: ${expenses.length}`);
      viewAllExpense();
    }
    showMenu();
  });
}

function generateReport() {
  if (expenses.length === 0) {
    console.log("No expenses to generate report.");
    return;
  }

  const reportDate = new Date();
  const monthYear = reportDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  console.log(`EXPENSE REPORT - ${monthYear.toUpperCase()}`);

  const categorySummary = {};
  let grandTotal = 0;
  let totalExpenses = 0;

  expenseTypes.forEach((category) => {
    const categoryExpenses = expenses.filter(
      (exp) => exp.category.toLowerCase() === category
    );

    if (categoryExpenses.length > 0) {
      const categoryTotal = categoryExpenses.reduce(
        (sum, exp) => sum + exp.amount,
        0
      );
      categorySummary[category] = {
        total: categoryTotal,
        count: categoryExpenses.length,
      };
      grandTotal += categoryTotal;
      totalExpenses += categoryExpenses.length;
    }
  });

  for (const [category, data] of Object.entries(categorySummary)) {
    console.log(
      `${category.toUpperCase()}: $${data.total.toFixed(2)} (${data.count} ${
        data.count === 1 ? "expense" : "expenses"
      })`
    );
  }

  console.log(`TOTAL: $${grandTotal.toFixed(2)} (${totalExpenses} expenses)`);
  console.log(
    `AVERAGE: $${(grandTotal / totalExpenses).toFixed(2)} per expense`
  );
}

//Menu
function showMenu() {
  console.log(`
        === EXPENSE TRACKER ===
        1. Add Expense
        2. View All Expenses  
        3. View by Category
        4. Calculate Total
        5. Remove Expense
        6. Generate Report
        7. Exit
        `);
  readline.question("Choose option (1-7):", (choice) => {
    switch (choice) {
      case "1": //Add Expense
        addExpense();
        break;

      case "2": //View All Expenses
        viewAllExpense();
        showMenu();
        break;

      case "3": //View by Category
        viewByCategory();
        break;

      case "4": // Calculate Total
        calculateTotal();
        showMenu();
        break;

      case "5": // Remove Expense
        removeExpense();
        break;

      case "6": // Generate Report
        generateReport();
        showMenu();
        break;

      case "7": //Break
        console.log("Goodbye!");
        readline.close();
        break;

      default: //Wrong Input
        console.log("Wrong input! Input should be from (1-7.");
        showMenu();
    }
  });
}

showMenu();
