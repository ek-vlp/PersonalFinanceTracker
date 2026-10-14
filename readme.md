# Personal Finance Tracker

A lightweight personal finance dashboard built with plain HTML, CSS, and JavaScript. It helps you track monthly income and expenses, calculate your balance, and manage transactions in one place.

## Features

- Add income and expense transactions
- Enter description, amount, and date for each transaction
- View total income, total expenses, and remaining balance
- Keep transactions saved in the browser using localStorage
- Delete transactions from the list
- Simple and responsive dashboard layout

## Project Structure

- `index.html` – Main page structure and transaction form
- `style.css` – Styling for the dashboard and form
- `script.js` – Logic for adding, deleting, calculating, and saving transactions
- `favicon.svg` – App icon
- `LICENSE` – MIT license

## How to Run

Because this is a static web app, there is no build step required.

### Option 1: Open directly in a browser

1. Open `index.html` in your browser.
2. Start tracking your finances immediately.

### Option 2: Run a local server

From the project directory, you can also serve it locally:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Usage

1. Select the transaction type: Income or Expense.
2. Enter a description such as Salary, Rent, Groceries, or Freelance Work.
3. Add the amount in INR.
4. Choose the transaction date.
5. Click Add Transaction.
6. Your dashboard totals update automatically.

## Notes

- The app stores transactions in the browser's localStorage, so data persists between refreshes on the same browser.
- The default dashboard includes example starting values of ₹25,000 income and ₹10,000 expenses.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
