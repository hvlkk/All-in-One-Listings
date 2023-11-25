// Input selectors.
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
// Button selectors.
const btnReset = document.querySelector("button.btn-reset");
const pageSelector = document.querySelector(".pages");

// Form selectors.
const forms = document.querySelectorAll("form");

// Page selectors.
const pages = document.querySelector(".pages").children;
// Page index.
let pageIndex = 0;

// Fill form with test data.
fillForm();

// Page Change Event.
pageSelector.addEventListener("click", (ev) => {
  const temp = ev.target.getAttribute("data-index");
  if (temp === pageIndex || temp === undefined || temp === null) {
    return;
  }
  pageIndex = temp;
  for (let i = 0; i < pages.length; i++) {
    if (i == pageIndex) {
      pages[i].classList.add("selected");
    } else {
      pages[i].classList.remove("selected");
    }
  }
});

form.addEventListener("submit", (ev) => {
  if (!ev.target.checkValidity()) {
    ev.preventDefault();
    console.log("Form is invalid - prevent submit");
  }
  ev.preventDefault();
  console.log("Form is valid - submit");
});

btnReset.addEventListener("click", (ev) => {
  ev.preventDefault();
  console.log(inEmail.checkValidity());
});

inConfirmPassword.addEventListener("input", checkPasswordMatch);
inPassword.addEventListener("input", checkPasswordMatch);

function checkPasswordMatch() {
  if (inPassword.value != inConfirmPassword.value) {
    inConfirmPassword.setCustomValidity("Password mismatch");
  } else {
    inConfirmPassword.setCustomValidity("");
  }
}

function showForm(index) {
  for (let i = 0; i < pages.length; i++) {
    if (i == index) {
      pages[i].classList.add("selected");
    } else {
      forms[i].classLi;
      pages[i].classList.remove("selected");
    }
  }
}

// Fill form with test data.
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
  inConfirmPassword.value = "password1";
}
