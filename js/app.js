let client = {
  table: "",
  hour: "",
  order: [],
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

  // take data
  client = { ...client, table, hour };

  // hide modal
  const formModal = document.querySelector("#form");
  const bootstrapModal = bootstrap.Modal.getInstance(formModal);

  bootstrapModal.hide();
  client = { ...client, table: "", hour: "" };

  // show Secctions
  showSecctions()
}

function showSecctions() {
  const hideSecctions = document.querySelectorAll('.d-none')
  hideSecctions.forEach(secction => secction.classList.remove('d-none'))

}