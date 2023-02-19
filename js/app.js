let client = {
  table: "",
  hour: "",
  order: [],
};

const categories = {
  1: "Food",
  2: "Drinks",
  3: "Desserts",
};

const btnSafaClient = document
  .querySelector("#safe-client")
  .addEventListener("click", safeClient);

function safeClient() {
  const table = document.querySelector("#table").value;
  const hour = document.querySelector("#hour").value;

  // validate is there are empty fields
  const emptyFields = [table, hour].some((field) => field === "");

  if (emptyFields) {
    // verify is already there is an alert
    const checkAlert = document.querySelector(".invalid-feedback");
    if (checkAlert) return;

    const alert = document.createElement("DIV");
    alert.classList.add("invalid-feedback", "d-block", "text-center");
    alert.textContent = "All fields are required";

    // add alert
    const modal = document.querySelector(".modal-body form");
    modal.appendChild(alert);

    // remove alert
    setTimeout(() => {
      // modal.removeChild(modal.lastChild);
      alert.remove();
    }, 3000);

    return;
  }

  /* document.querySelector("#table").value = "";
  document.querySelector("#hour").value = ""; */

  // take data
  client = { ...client, table, hour };

  // hide modal
  const formModal = document.querySelector("#form");
  const bootstrapModal = bootstrap.Modal.getInstance(formModal);

  bootstrapModal.hide();

  // show Secctions
  showSecctions();

  // get API dishes
  getDishes();
}

function showSecctions() {
  const hideSecctions = document.querySelectorAll(".d-none");
  hideSecctions.forEach((secction) => secction.classList.remove("d-none"));
}

function getDishes() {
  const url = "http://localhost:3000/dishes";

  fetch(url)
    .then((res) => res.json())
    .then((data) => showDishes(data))
    .catch((error) => console.log(error));
}

function showDishes(dishes) {
  const content = document.querySelector("#dishes .content");

  dishes.forEach((dish) => {
    const row = document.createElement("DIV");
    row.classList.add("row", "py-3", "border-top");

    const name = document.createElement("DIV");
    name.classList.add("col-md-4");
    name.textContent = dish.name;

    const price = document.createElement("DIV");
    price.classList.add("col-md-3", "fw-bold");
    price.textContent = `$ ${dish.price}`;

    const category = document.createElement("DIV");
    category.classList.add("col-md-3");
    category.textContent = categories[dish.category];

    const quantityInput = document.createElement("INPUT");
    quantityInput.type = "number";
    quantityInput.min = 0;
    quantityInput.value = 0;
    quantityInput.id = `product-${dish.id}`;
    quantityInput.classList.add("form-control");

    const addInput = document.createElement("DIV");
    addInput.classList.add("col-md-2");
    addInput.appendChild(quantityInput);
    addInput.onchange = (e) => addDish({ ...dish, quantity: e.target.value });

    row.appendChild(name);
    row.appendChild(price);
    row.appendChild(category);
    row.appendChild(addInput);
    content.appendChild(row);
  });
}

function addDish(product) {
  let { order } = client;

  if (product.quantity > 0) {
    const checkOrder = order.findIndex((o) => o.id === product.id);

    if (checkOrder >= 0) order[checkOrder].quantity = product.quantity;
    else client.order = [...order, product];
  } else {
    client.order = [...order.filter((o) => o.id !== product.id)];
  }

  // clean last summary
  cleanHTML();

  // show summary
  updateSummary();
}

function updateSummary() {
  const content = document.querySelector("#summary .content");

  const summary = document.createElement("DIV");
  summary.classList.add("col-md-6", 'card', 'py-5', 'px-3', 'shadow');

  const table = document.createElement("P");
  table.textContent = "Table: ";
  table.classList.add("fw-bold");

  const tableSpan = document.createElement("SPAN");
  tableSpan.textContent = client.table;
  tableSpan.classList.add("fw-normal");

  const hour = document.createElement("P");
  hour.textContent = "Hour: ";
  hour.classList.add("fw-bold");

  const hourSpan = document.createElement("SPAN");
  hourSpan.textContent = client.hour;
  hourSpan.classList.add("fw-normal");

  table.appendChild(tableSpan);
  hour.appendChild(hourSpan);

  // title
  const heading = document.createElement('H3')
  heading.textContent = 'Dishes Consumed'
  heading.classList.add('my-4', 'text-center')

  summary.appendChild(table);
  summary.appendChild(hour);
  summary.appendChild(heading);

  content.appendChild(summary);
}

function cleanHTML() {
  const content = document.querySelector("#summary .content");
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
}
