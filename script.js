const form = document.getElementById("transactionForm");
const transactionList = document.getElementById("transactionList");

const incomeDisplay = document.getElementById("totalIncome");
const expensesDisplay = document.getElementById("totalExpenses");
const balanceDisplay = document.getElementById("balance");
const dateInput = document.getElementById("date");

dateInput.value = new Date().toLocaleDateString("en-CA");

const startingIncome = 25000;
const startingExpenses = 10000;

let transactions = [];

function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function updateDashboard() {
    let totalIncome = startingIncome;
    let totalExpenses = startingExpenses;

    transactions.forEach(function(item) {
        if (item.type === "income") {
            totalIncome += item.amount;
        } else {
            totalExpenses += item.amount;
        }
    });

    incomeDisplay.textContent =
        "₹" + totalIncome.toLocaleString("en-IN");

    expensesDisplay.textContent =
        "₹" + totalExpenses.toLocaleString("en-IN");

    balanceDisplay.textContent =
        "₹" + (totalIncome - totalExpenses).toLocaleString("en-IN");
}

function displayTransactions() {
    transactionList.innerHTML = "";

    transactions.forEach(function(item, index) {
        const transaction = document.createElement("li");
        transaction.classList.add(item.type);

        transaction.appendChild(document.createTextNode(
            item.description + " - ₹" +
            item.amount.toFixed(2) + " (" + item.type + ")" +
            (item.date ? " - " + item.date : "") + " "
        ));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {
            transactions.splice(index, 1);
            saveTransactions();
            displayTransactions();
            updateDashboard();
        });

        transaction.appendChild(deleteButton);
        transactionList.appendChild(transaction);
    });
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const type = document.getElementById("type").value;
    const description =
        document.getElementById("description").value.trim();
    const amount = Number(document.getElementById("amount").value);
    const date = document.getElementById("date").value;

    if (
        description === "" ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {
        alert("Enter a valid description and amount.");
        return;
    }

    transactions.push({
        type: type,
        description: description,
        amount: amount,
        date: date
    });

    saveTransactions();
    displayTransactions();
    updateDashboard();
    form.reset();
});

const savedTransactions = localStorage.getItem("transactions");

if (savedTransactions !== null) {
    try {
        const parsedTransactions = JSON.parse(savedTransactions);

        if (Array.isArray(parsedTransactions)) {
            transactions = parsedTransactions.filter(function(item) {
                return (
                    item &&
                    (item.type === "income" || item.type === "expense") &&
                    typeof item.description === "string" &&
                    typeof item.amount === "number" &&
                    Number.isFinite(item.amount) &&
                    item.amount > 0
                );
            });
        }
    } catch (error) {
        transactions = [];
    }
}

displayTransactions();
updateDashboard();