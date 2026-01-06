let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let chart;

// Show input box when "Others" is selected
function showOtherInput() {
    let categorySelect = document.getElementById("categorySelect");
    let existingInput = document.getElementById("otherCategory");

    if (categorySelect.value === "others") {
        if (!existingInput) {
            categorySelect.insertAdjacentHTML("afterend", `
                <input type="text" id="otherCategory" placeholder="Enter category"
                       style="width:48%; padding:10px; margin-top:10px;
                              background:#222; border:1px solid #666; color:white;">
            `);
        }
    } else {
        if (existingInput) existingInput.remove();
    }
}


// Add Expense
function addExpense() {
    let amount = document.getElementById("amount").value;
    let categorySelect = document.getElementById("categorySelect");
    let category = categorySelect.value;

    if (!amount) {
        alert("Enter amount!");
        return;
    }

    if (category === "others") {
        let otherInput = document.getElementById("otherCategory");
        if (!otherInput || otherInput.value.trim() === "") {
            alert("Enter custom category!");
            return;
        }
        category = otherInput.value.trim();
    }

    expenses.push({ amount: Number(amount), category });
    localStorage.setItem("expenses", JSON.stringify(expenses));

    document.getElementById("amount").value = "";

    renderTable();
    updateChart();
}

// Render Expenses Table
function renderTable() {
    let table = document.getElementById("expenseTable");
    table.innerHTML = `
        <tr>
            <th>Amount (₹)</th>
            <th>Category</th>
        </tr>
    `;

    expenses.forEach((exp) => {
        table.innerHTML += `
            <tr>
                <td>₹${exp.amount}</td>
                <td>${exp.category}</td>
            </tr>
        `;
    });
}

// Update Pie Chart
function updateChart() {
    let totals = {};

    expenses.forEach(exp => {
        if (!totals[exp.category]) totals[exp.category] = 0;
        totals[exp.category] += exp.amount;
    });

    let labels = Object.keys(totals);
    let data = Object.values(totals);

    if (chart) chart.destroy(); // Remove old chart

    chart = new Chart(document.getElementById("pieChart"), {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                data: data
            }]
        }
    });
}

// Load everything on start
renderTable();
updateChart();

function clearAll() {
    if (confirm("Delete all saved expenses?")) {
        expenses = [];
        localStorage.removeItem("expenses");
        renderTable();
        updateChart();
    }
}
