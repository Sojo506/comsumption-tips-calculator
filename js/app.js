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
  console.log("🚀 ~ file: app.js:17 ~ safeClient ~ emptyFields", emptyFields)

  if (emptyFields) console.log("at least an empty field");
  else console.log("good");
}
