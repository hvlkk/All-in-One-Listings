const form = document.querySelector("form");
const inEmail = document.getElementById("email-txt");
const inFirstName = document.getElementById("first-name-txt");
const inLastName = document.getElementById("last-name-txt");
const inPhone = document.getElementById("telephone-txt");
const inDOB = document.getElementById("date-of-birth");
const inAddress1 = document.getElementById("address-line-1");
const inAddress2 = document.getElementById("address-line-2");
const inCity = document.getElementById("city");
const inCountry = document.getElementById("country");
const inPostCode = document.getElementById("postal-code");
const inUsername = document.getElementById("username");
const inPassword = document.getElementById("password");
const inConfirmPassword = document.getElementById("password-confirmation");

const btnReset = document.querySelector("button.btn-reset");

fillForm();

form.addEventListener("submit", (ev) => {
  if (!ev.target.checkValidity()) {
    ev.preventDefault();
    console.log("Form is invalid - prevent submit");
  }
});

btnReset.addEventListener("click", (ev) => {
  ev.preventDefault();
  console.log(inEmail.checkValidity());
});

function fillForm() {
  inEmail.value = "papatzopoulos@gmail.com";
  inFirstName.value = "John";
  inLastName.value = "Papatzopoulos";
  inPhone.value = "1234567890";
  inDOB.value = "1990-01-01";
  inAddress1.value = "123 Main Street";
  inAddress2.value = "Apt 1";
  inCity.value = "Toronto";
  inCountry.value = "Canada";
  inPostCode.value = "M1M 1M1";
  inUsername.value = "johnp";
  inPassword.value = "password";
  inConfirmPassword.value = "password";
}
