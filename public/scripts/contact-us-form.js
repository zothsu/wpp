function handleFormSubmit() {
  const form = document.querySelector("#contact-form-us");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const formValues = Object.fromEntries(formData.entries());

      // demo form data logging
      console.log("Contact form:", formValues);
    });
  }
}

handleFormSubmit();

document.addEventListener("astro:after-swap", handleFormSubmit);
