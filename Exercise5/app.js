// Input selectors.
const inEmail = document.getElementById("email-txt");
const inFirstName = document.getElementById("first-name-txt");
const inLastName = document.getElementById("last-name-txt");
const inPhone = document.getElementById("telephone-txt");
const inDOB = document.getElementById("date-of-birth");
// Form 2.
const inAddress1 = document.getElementById("address-line-1");
const inAddress2 = document.getElementById("address-line-2");
const inCity = document.getElementById("city");
const inCountry = document.getElementById("country");
const inPostCode = document.getElementById("postal-code");
// Form 3.
const inUsername = document.getElementById("username");
const inPassword = document.getElementById("password");
const inConfirmPassword = document.getElementById("password-confirmation");
// Form 4.
const inCheckboxAds = document.getElementById("advertisements-checkbox");
const inCheckboxNews = document.getElementById("updates-checkbox");
const inCheckboxSMS = document.getElementById("sms-checkbox");
const inCheckboxEmail = document.getElementById("email-checkbox");
const inCheckboxViber = document.getElementById("viber-checkbox");
const inCheckboxWhatsApp = document.getElementById("whatsapp-checkbox");
const inCheckboxTerms = document.getElementById("terms-checkbox");
// Form 5.

// Button selectors.
const pageSelector = document.querySelector(".pages");
const btnPrevious = document.getElementById("btn-previous");
const btnNext = document.getElementById("btn-next");
const btnSubmit = document.getElementById("btn-submit");

// Form selectors.
const forms = document.querySelectorAll("form");

// Page selectors.
const pages = document.querySelector(".pages")?.children;
// Page index.
let pageIndex = 0;
// Required inputs.
const requiredInputs = document.querySelectorAll("input[required]");

// Fill form with test data.
if (forms.length) {
  fillForm();
}

inConfirmPassword.addEventListener("change", checkPasswordMatch);
inPassword.addEventListener("change", checkPasswordMatch);
inDOB.addEventListener("change", validateAge);
inPhone.addEventListener("change", validatePhone);

requiredInputs.forEach((input) => {
  input.addEventListener("change", (ev) => {
    if ([...forms].every((form) => form.checkValidity())) {
      btnSubmit.disabled = false;
    } else {
      btnSubmit.disabled = true;
    }
  });
});

// Page Change Event.
pageSelector.addEventListener("click", (ev) => {
  const temp = ev.target.getAttribute("data-index");
  changeForm(temp);
});

btnPrevious.addEventListener("click", (ev) => {
  changeForm(pageIndex - 1);
});

btnNext.addEventListener("click", (ev) => {
  changeForm(pageIndex + 1);
});

btnSubmit.addEventListener("click", (ev) => {
  ev.preventDefault();
  onSubmit();
});

function validateAge() {
  const today = new Date();
  const birthDate = new Date(inDOB.value);
  const age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate()))
    age--;
  if (age < 18) {
    inDOB.setCustomValidity("You must be 18 years or older to register.");
    if (inDOB.parentNode.querySelector(".error")) return;
    const div = document.createElement("div");
    div.classList.add("error");
    div.innerText = "You must be 18 years or older to register.";
    inDOB.parentNode.appendChild(div);
  } else {
    inDOB.setCustomValidity("");
    inDOB.parentNode.querySelector(".error").remove();
  }
}

function validatePhone() {
  if (!inPhone.checkValidity()) {
    if (inPhone.parentNode.querySelector(".error")) return;
    const div = document.createElement("div");
    div.classList.add("error");
    div.innerText = "Invalid phone number.";
    inPhone.parentNode.appendChild(div);
  } else {
    inPhone.parentNode.querySelector(".error").remove();
  }
}

function onSubmit() {
  const formData = new FormData();
  forms.forEach((form) => {
    form.querySelectorAll("input").forEach((input) => {
      if (input.type === "checkbox") formData.append(input.name, input.checked);
      else if (input.type === "radio") {
        if (input.checked) formData.append(input.name, input.id);
      } else {
        formData.append(input.name, input.value);
      }
    });

    form.querySelectorAll("textarea").forEach((txt) => {
      formData.append(txt.name, txt.value);
    });
  });

  fetch("http://localhost:8080/api/submit", {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err))
    .finally(() => {
      window.location.href =
        "http://localhost:5500/Exercise5/registration-success.html";
    });
}

function checkPasswordMatch() {
  if (inPassword.value != inConfirmPassword.value) {
    inConfirmPassword.setCustomValidity("Password mismatch");
    if (inConfirmPassword.parentNode.querySelector(".error")) return;
    const div = document.createElement("div");
    div.classList.add("error");
    div.innerText = "Password mismatch";
    inConfirmPassword.parentNode.appendChild(div);
  } else {
    inConfirmPassword.setCustomValidity("");
    inConfirmPassword.parentNode.querySelector(".error").remove();
  }
}

function changeForm(newIndex) {
  if (
    newIndex === pageIndex ||
    newIndex === undefined ||
    newIndex === null ||
    newIndex < 0 ||
    newIndex >= pages.length
  )
    return;
  if (forms[pageIndex].checkValidity()) {
    pages[pageIndex].classList.add("valid");
    pages[pageIndex].classList.remove("invalid");
  } else {
    pages[pageIndex].classList.remove("valid");
    pages[pageIndex].classList.add("invalid");
  }
  pages[pageIndex].classList.remove("selected");
  forms[pageIndex].classList.add("hidden");
  forms[newIndex].classList.remove("hidden");
  pages[newIndex].classList.add("selected");
  pageIndex = newIndex;
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
