document.addEventListener("mouseenter");

function createTooltip() {
  const tooltip = document.createElement("div");
  tooltip.classList.add("tooltip");
  tooltip.textContent = "User Registration";

  tooltip.addEventListener("mouseenter", () => {
    tooltip.style.opacity = 1;
  });
  return tooltip;
}
