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

  if (client.order.length) {
    // show summary
    updateSummary();
  } else {
    // add message
    emptyOder();
  }
}

function updateSummary() {
  const content = document.querySelector("#summary .content");

  const summary = document.createElement("DIV");
  summary.classList.add("col-md-6");

  const summaryDiv = document.createElement("DIV");
  summaryDiv.classList.add("card", "py-2", "px-3", "shadow");

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
  const heading = document.createElement("H3");
  heading.textContent = "Dishes Consumed";
  heading.classList.add("my-4", "text-center");

  // go throught the order's array
  const group = document.createElement("UL");
  group.classList.add("list-group");

  const { order } = client;

  // add orders
  order.forEach((dish) => {
    const { id, name, quantity, price } = dish;

    const list = document.createElement("LI");
    list.classList.add("list-group-item");

    const dishName = document.createElement("H4");
    dishName.classList.add("my-4");
    dishName.textContent = name;

    //QUANTITY
    const dishQuantity = document.createElement("P");
    dishQuantity.classList.add("fw-bold");
    dishQuantity.textContent = "Quantity: ";

    const dishQuantityValue = document.createElement("SPAN");
    dishQuantityValue.classList.add("fw-normal");
    dishQuantityValue.textContent = quantity;

    // PRICE
    const dishPrice = document.createElement("P");
    dishPrice.classList.add("fw-bold");
    dishPrice.textContent = "Price: ";

    const dishPriceValue = document.createElement("SPAN");
    dishPriceValue.classList.add("fw-normal");
    dishPriceValue.textContent = `$${price}`;

    // SUBTOTAL (price * quantity)
    const subTotalDish = document.createElement("P");
    subTotalDish.classList.add("fw-bold");
    subTotalDish.textContent = "Subtotal: ";

    const subTotalDishValue = document.createElement("SPAN");
    subTotalDishValue.classList.add("fw-normal");
    subTotalDishValue.textContent = `$${calculateSubtotal(price, quantity)}`;

    // buton to delete
    const btnDelete = document.createElement("BUTTON");
    btnDelete.classList.add("btn", "btn-danger");
    btnDelete.textContent = "Delete order";
    // function to delete order
    btnDelete.onclick = () => {
      deleteOrder(id);
    };

    // add children to their parents
    dishQuantity.appendChild(dishQuantityValue);
    dishPrice.appendChild(dishPriceValue);
    subTotalDish.appendChild(subTotalDishValue);

    // add elements to the LI
    list.appendChild(dishName);
    list.appendChild(dishQuantity);
    list.appendChild(dishPrice);
    list.appendChild(subTotalDish);
    list.appendChild(btnDelete);

    // add list to the main group
    group.appendChild(list);
  });

  // add content
  summaryDiv.appendChild(heading);
  summaryDiv.appendChild(table);
  summaryDiv.appendChild(hour);
  summaryDiv.appendChild(group);

  summary.appendChild(summaryDiv);

  content.appendChild(summary);

  // show tips form
  tipsForm();
}

function cleanHTML() {
  const content = document.querySelector("#summary .content");
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
}

function calculateSubtotal(price, quantity) {
  return price * quantity;
}

function deleteOrder(id) {
  const { order } = client;
  const result = order.filter((article) => article.id !== id);
  client.order = [...result];

  // clean last summary
  cleanHTML();

  if (client.order.length) {
    // show summary
    updateSummary();
  } else {
    // add message
    emptyOder();
  }

  // product delete, reset input
  const productInput = `#product-${id}`;
  const productDeleted = document.querySelector(productInput);
  productDeleted.value = 0;
}

function emptyOder() {
  const content = document.querySelector("#summary .content");

  const text = document.createElement("P");
  text.classList.add("text-center");
  text.textContent = "Add the order elements";

  content.appendChild(text);
}

function tipsForm() {
  const content = document.querySelector("#summary .content");

  const form = document.createElement("DIV");
  form.classList.add("col-md-6", "form");

  const divForm = document.createElement("DIV");
  divForm.classList.add("card", "py-2", "px-3", "shadow");

  const heading = document.createElement("H3");
  heading.classList.add("my-4", "text-center");
  heading.textContent = "Tip";

  // radio btns
  // 10%
  const radio10 = document.createElement("INPUT");
  radio10.type = "radio";
  radio10.name = "tip";
  radio10.value = "10";
  radio10.classList.add("form-check-input");
  radio10.onclick = calculateTip;

  const radio10Label = document.createElement("LABEL");
  radio10Label.textContent = "10%";
  radio10Label.classList.add("form-check-label");

  const radio10Div = document.createElement("DIV");
  radio10Div.classList.add("form-check");

  radio10Div.appendChild(radio10);
  radio10Div.appendChild(radio10Label);
  // 28%
  const radio25 = document.createElement("INPUT");
  radio25.type = "radio";
  radio25.name = "tip";
  radio25.value = "25";
  radio25.classList.add("form-check-input");
  radio25.onclick = calculateTip;

  const radio25Label = document.createElement("LABEL");
  radio25Label.textContent = "25%";
  radio25Label.classList.add("form-check-label");

  const radio25Div = document.createElement("DIV");
  radio25Div.classList.add("form-check");

  radio25Div.appendChild(radio25);
  radio25Div.appendChild(radio25Label);
  // 50%
  const radio50 = document.createElement("INPUT");
  radio50.type = "radio";
  radio50.name = "tip";
  radio50.value = "50";
  radio50.classList.add("form-check-input");
  radio50.onclick = calculateTip;

  const radio50Label = document.createElement("LABEL");
  radio50Label.textContent = "50%";
  radio50Label.classList.add("form-check-label");

  const radio50Div = document.createElement("DIV");
  radio50Div.classList.add("form-check");

  radio50Div.appendChild(radio50);
  radio50Div.appendChild(radio50Label);

  divForm.appendChild(heading);
  divForm.appendChild(radio10Div);
  divForm.appendChild(radio25Div);
  divForm.appendChild(radio50Div);

  form.appendChild(divForm);

  content.appendChild(form);
}

function calculateTip() {
  const { order } = client;
  let subtotal = 0;

  // calculate subtotal
  order.forEach((dish) => {
    const { price, quantity } = dish;
    subtotal += calculateSubtotal(price, quantity);
  });

  // select tip
  const tipSelected = document.querySelector('[name="tip"]:checked').value;

  // calculate tip
  const tip = (subtotal * parseInt(tipSelected)) / 100;

  // calculate total
  const total = subtotal + tip;
}
