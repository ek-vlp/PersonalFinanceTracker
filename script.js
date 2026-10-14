const form = document.getElementById("transactionForm");
const transactionList = document.getElementById("transactionList");

const incomeDisplay = document.getElementById("totalIncome");
const expensesDisplay = document.getElementById("totalExpenses");
const balanceDisplay = document.getElementById("balance");
const totalTransactionsDisplay = document.getElementById("totalTransactions");
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
      
    totalTransactionsDisplay.textContent = transactions.length;

    updateIncomeExpenseChart();
}

function displayTransactions() {
    transactionList.innerHTML = "";

    const categoryFilter =
    document.getElementById("categoryFilter").value;

    const searchText = document
        .getElementById("searchInput")
        .value.toLowerCase()
        .trim();

    const filteredTransactions = transactions.filter(function(item) {
        const matchesCategory =
            categoryFilter === "all" ||
            (item.category || "Other") === categoryFilter;

        const matchesSearch =
            item.description.toLowerCase().includes(searchText);

        return matchesCategory && matchesSearch;
    });
    
    if (filteredTransactions.length === 0) {
        transactionList.innerHTML =
            "<li>No transactions found. Try another search or filter.</li>";
        return;
    }

    
    const sortOrder = document.getElementById("sortOrder").value;

    filteredTransactions.sort(function(a, b) {
        const dateA = a.date || "";
        const dateB = b.date || "";

        if (dateA === dateB) {
            return sortOrder === "newest"
                ? transactions.indexOf(b) - transactions.indexOf(a)
                : transactions.indexOf(a) - transactions.indexOf(b);
        }

        return sortOrder === "newest"
            ? dateB.localeCompare(dateA)
           : dateA.localeCompare(dateB);
    });


    filteredTransactions.forEach(function(item) {
        const transaction = document.createElement("li");
        transaction.classList.add(item.type);

        transaction.appendChild(document.createTextNode(
            item.description + " - ₹" +
            item.amount.toFixed(2) + " (" + item.type + ")" +
            " - category:" + (item.category || "Other") +
            (item.date ? " - " + item.date : "") + " "
        ));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {
            const originalIndex = transactions.indexOf(item);
            transactions.splice(originalIndex, 1);


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
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    const description =
        document.getElementById("description").value.trim();

    const amount = Number(document.getElementById("amount").value);

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
        category: category,
        description: description,
        amount: amount,
        date: date
    });

    saveTransactions();
    displayTransactions();
    updateDashboard();
    form.reset();
    document.getElementById("date").value =
        new Date().toLocaleDateString("en-CA");
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

document.getElementById("searchInput").addEventListener("input", function() {
    displayTransactions();
});

document.getElementById("categoryFilter").addEventListener("change", function() {
    displayTransactions();
});

document.getElementById("sortOrder").addEventListener("change", function() {
    displayTransactions();
}); 

const chartCanvas = document.getElementById("incomeExpenseChart");
const chartContext = chartCanvas.getContext("2d");

const incomeExpenseChart = new Chart(chartContext, {
    type: "bar",
    data: {
        labels: ["Income", "Expenses"],
        datasets: [{
            label: "Amount (₹)",
            data: [55500, 24300],
            backgroundColor: ["#22c55e", "#ef4444"]
        }]
    },
    options: {
        responsive: true,
        
        scales: {
           y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                         return "₹" + value.toLocaleString("en-IN");
                    }
                }
            }
        }

    }
});

function updateIncomeExpenseChart() {
    incomeExpenseChart.data.datasets[0].data = [
        Number(incomeDisplay.textContent.replace(/[₹,]/g, "")),
        Number(expensesDisplay.textContent.replace(/[₹,]/g, ""))
    ];

    incomeExpenseChart.update();
}

updateDashboard();
