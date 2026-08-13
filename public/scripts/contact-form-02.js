function handleFormSubmit() {
  const form = document.querySelector("#contact-form-02");

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

document.addEventListener("astro:after-swap", handleFormSubmit);
