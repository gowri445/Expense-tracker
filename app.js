const form = document.getElementById("form");
const list = document.getElementById("list");
const totalEl = document.getElementById("total");
const filterCategory = document.getElementById("filterCategory");
const fromEl = document.getElementById("from");
const toEl = document.getElementById("to");

let expenses = JSON.parse(localStorage.getItem("expenses") || "[]");

function save() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function visible() {
  return expenses.filter((e) => {
    if (filterCategory.value && e.category !== filterCategory.value) return false;
    if (fromEl.value && e.date < fromEl.value) return false;
    if (toEl.value && e.date > toEl.value) return false;
    return true;
  });
}

function render() {
  const items = visible().sort((a, b) => b.date.localeCompare(a.date));
  list.innerHTML = "";
  let total = 0;
  for (const e of items) {
    total += e.amount;
    const li = document.createElement("li");
    const info = document.createElement("div");
    info.textContent = `${e.title} - ₹${e.amount.toFixed(2)}`;
    const meta = document.createElement("small");
    meta.textContent = `${e.category} | ${e.date}`;
    info.appendChild(meta);
    const del = document.createElement("button");
    del.textContent = "Delete";
    del.onclick = () => {
      expenses = expenses.filter((x) => x.id !== e.id);
      save();
      render();
    };
    li.append(info, del);
    list.appendChild(li);
  }
  totalEl.textContent = total.toFixed(2);
}

form.addEventListener("submit", (ev) => {
  ev.preventDefault();
  expenses.push({
    id: Date.now(),
    title: document.getElementById("title").value.trim(),
    amount: parseFloat(document.getElementById("amount").value),
    category: document.getElementById("category").value,
    date: document.getElementById("date").value,
  });
  save();
  form.reset();
  render();
});

[filterCategory, fromEl, toEl].forEach((el) => el.addEventListener("change", render));
render();
