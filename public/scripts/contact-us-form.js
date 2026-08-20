const CONTACT_WEBHOOK_URL = "https://n8n.wildpear.school/webhook/contact-form";

function handleFormSubmit() {
  const form = document.querySelector("#contact-form-us");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitError = document.querySelector("#submit-error-us");
      const successPanel = document.querySelector("#contact-success-us");
      const submitButton = document.querySelector("#contact-submit-us");
      const siteKey = form.dataset.recaptchaSiteKey;

      submitError?.classList.add("hidden");

      const formData = new FormData(form);
      const formValues = Object.fromEntries(formData.entries());

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
      }

      try {
        if (typeof grecaptcha === "undefined" || !siteKey) {
          throw new Error("reCAPTCHA failed to load");
        }

        const token = await new Promise((resolve, reject) => {
          grecaptcha.ready(() => {
            grecaptcha.execute(siteKey, { action: "contact_form" }).then(resolve, reject);
          });
        });
        formValues["g-recaptcha-response"] = token;

        const response = await fetch(CONTACT_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValues),
        });

        if (!response.ok) {
          throw new Error(`Webhook responded with ${response.status}`);
        }

        form.reset();
        form.classList.add("hidden");
        successPanel?.classList.remove("hidden");
        successPanel?.classList.add("flex");
      } catch (err) {
        console.error("Contact form submission failed:", err);
        submitError?.classList.remove("hidden");
      } finally {
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
