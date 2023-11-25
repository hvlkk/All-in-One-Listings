// document.addEventListener("mouseenter");

function createTooltip() {
  const tooltip = document.createElement("div");
  tooltip.classList.add("tooltip");
  tooltip.textContent = "User Registration";

  tooltip.addEventListener("mouseenter", () => {
    tooltip.style.opacity = 1;
  });
  return tooltip;
}

const el = document.querySelector("button.btn-reset");
const form = document.querySelector("form");

form.addEventListener("submit", (ev) => {
  console.log(ev);
  ev.preventDefault();
  console.log("Form submitted");
});

el.addEventListener("click", (ev) => {
  ev.preventDefault();
  console.log(form);
});

const mailInput = document.getElementById("email-txt");
