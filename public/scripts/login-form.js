function handleFormSubmit() {
  const form = document.querySelector("#signin-form-01");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const password = formData.get("password");
      const errorEl = form.querySelector("#signin-error-01");
      const passwordInput = form.querySelector("#login-password-01");
      const sharedPassword = form.dataset.sharedPassword;
      const redirectHref = form.dataset.redirectHref;

      if (sharedPassword && password === sharedPassword) {
        errorEl?.classList.add("hidden");
        passwordInput?.removeAttribute("aria-invalid");
        window.location.href = redirectHref;
      } else {
        errorEl?.classList.remove("hidden");
        passwordInput?.setAttribute("aria-invalid", "true");
      }
    });
  }
}

handleFormSubmit();

document.addEventListener("astro:after-swap", handleFormSubmit);
