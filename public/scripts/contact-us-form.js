function handleFormSubmit() {
  const form = document.querySelector("#contact-form-us");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const recaptchaError = document.querySelector("#recaptcha-error-us");
      const recaptchaSolved =
        typeof grecaptcha === "undefined" || grecaptcha.getResponse().length > 0;

      if (recaptchaError) {
        recaptchaError.classList.toggle("hidden", recaptchaSolved);
      }

      if (!recaptchaSolved) {
        return;
      }

      const formData = new FormData(form);
      const formValues = Object.fromEntries(formData.entries());

      // demo form data logging
      console.log("Contact form:", formValues);

      if (typeof grecaptcha !== "undefined") {
        grecaptcha.reset();
      }
    });
  }
}

handleFormSubmit();

document.addEventListener("astro:after-swap", handleFormSubmit);
