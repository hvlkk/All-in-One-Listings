// Input selectors.
const inPhone = document.getElementById("telephone-txt");
const inDOB = document.getElementById("date-of-birth");
const inPassword = document.getElementById("password");
const inConfirmPassword = document.getElementById("password-confirmation");
// Button selectors.
const pageSelector = document.querySelector(".pages");
const btnPrevious = document.getElementById("btn-previous");
const btnNext = document.getElementById("btn-next");
const btnSubmit = document.getElementById("btn-submit");
// Form selectors.
const forms = document.querySelectorAll("form");
// Page selector.
const pages = document.querySelector(".pages").children;
// Page index.
let pageIndex = 0;
// Required inputs.
const requiredInputs = document.querySelectorAll("input[required]");
// Input event Listeners.
inConfirmPassword.addEventListener("change", checkPasswordMatch);
inPassword.addEventListener("change", checkPasswordMatch);
inDOB.addEventListener("change", validateAge);
inPhone.addEventListener("change", validatePhone);
// Form changing event listeners.
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

// Validating required inputs. If all are valid, enable submit button.
requiredInputs.forEach((input) => {
  input.addEventListener("change", (ev) => {
    if ([...forms].every((form) => form.checkValidity())) {
      btnSubmit.disabled = false;
    } else {
      btnSubmit.disabled = true;
    }
  });
});

// Validating user age. Must be 18 or older.
// If the user is younger than 18, we are setting a custom validity message.
// If the user is 18 or older, we are removing the custom validity message.
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
    inDOB.parentNode.querySelector(".error")?.remove();
  }
}

// Validating phone number.
// If the phone number is invalid, we are setting a custom validity message.
// If the phone number is valid, we are removing the custom validity message.
function validatePhone() {
  if (!inPhone.checkValidity()) {
    if (inPhone.parentNode.querySelector(".error")) return;
    const div = document.createElement("div");
    div.classList.add("error");
    div.innerText = "Invalid phone number.";
    inPhone.parentNode.appendChild(div);
  } else {
    inPhone.parentNode.querySelector(".error")?.remove();
  }
}

// Complex form submission. Using FormData to submit all forms at once.
// We are retrieving all input values and appending them to the FormData object.
// We are then sending the FormData object to the server.
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

// Validating the password and confirm password fields.
// If they do not match, we are setting a custom validity message.
// If they do match, we are removing the custom validity message.
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

// Changing the form. We are hiding the current form and showing the new one.
// We are also changing the selected page button.
function changeForm(index) {
  const newIndex = +index;
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
  forms[newIndex].classList?.remove("hidden");
  pages[newIndex].classList.add("selected");
  pageIndex = newIndex;
}
