const CONTACT_WEBHOOK_URL = "https://n8n.wildpear.school/webhook/contact-form";

function handleFormSubmit() {
  const form = document.querySelector("#contact-form-us");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const recaptchaError = document.querySelector("#recaptcha-error-us");
      const submitError = document.querySelector("#submit-error-us");
      const submitSuccess = document.querySelector("#submit-success-us");
      const submitButton = document.querySelector("#contact-submit-us");
      const recaptchaSolved =
        typeof grecaptcha === "undefined" || grecaptcha.getResponse().length > 0;

      if (recaptchaError) {
        recaptchaError.classList.toggle("hidden", recaptchaSolved);
      }

      if (!recaptchaSolved) {
        return;
      }

      submitError?.classList.add("hidden");
      submitSuccess?.classList.add("hidden");

      const formData = new FormData(form);
      const formValues = Object.fromEntries(formData.entries());

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
      }

      try {
        const response = await fetch(CONTACT_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValues),
        });

        if (!response.ok) {
          throw new Error(`Webhook responded with ${response.status}`);
        }

        form.reset();
        submitSuccess?.classList.remove("hidden");
      } catch (err) {
        console.error("Contact form submission failed:", err);
        submitError?.classList.remove("hidden");
      } finally {
        if (typeof grecaptcha !== "undefined") {
          grecaptcha.reset();
        }
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = "Send Message";
        }
      }
    });
  }
}

handleFormSubmit();

document.addEventListener("astro:after-swap", handleFormSubmit);
