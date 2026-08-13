function handleFormSubmit() {
  const form = document.querySelector("#contact-form-03");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const formValues = Object.fromEntries(formData.entries());

      // demo form data logging
      console.log("Contact form:", formValues);

      // You can add additional logic here like:
      // - Form validation
      // - API submission
      // - Success/error handling
    });
  }
}

handleFormSubmit();

function initServiceDropdown(dropdown) {
  const wrapper = dropdown.parentElement;
  const labelEl = wrapper?.querySelector("[data-service-trigger-label]");
  if (!wrapper || !labelEl) return;

  const placeholder = labelEl.textContent?.trim() ?? "";
  const hiddenInputs = Array.from(wrapper.querySelectorAll("[data-service-input]"));
  const items = Array.from(dropdown.querySelectorAll("[data-service-value]"));

  const updateLabel = () => {
    const selected = hiddenInputs.filter((input) => input.checked);
    if (selected.length === 0) {
      labelEl.textContent = placeholder;
      labelEl.classList.add("text-muted-foreground");
    } else {
      labelEl.textContent = selected
        .map((input) => {
          const item = items.find((el) => el.getAttribute("data-service-value") === input.value);
          return item?.textContent?.trim() ?? input.value;
        })
        .join(", ");
      labelEl.classList.remove("text-muted-foreground");
    }
  };

  dropdown.addEventListener("starwind-dropdown-checkbox:change", (e) => {
    const value = e.target.getAttribute("data-service-value");
    const input = hiddenInputs.find((el) => el.value === value);
    if (input) input.checked = e.detail.checked;
    updateLabel();
  });

  updateLabel();
}

function handleServiceDropdowns() {
  document.querySelectorAll("[data-service-dropdown]").forEach(initServiceDropdown);
}

handleServiceDropdowns();

document.addEventListener("astro:after-swap", () => {
  handleFormSubmit();
  handleServiceDropdowns();
});
