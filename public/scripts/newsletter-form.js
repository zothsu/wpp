function handleNewsletterSubmit() {
  const form = document.querySelector("#newsletter-form");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const formValues = Object.fromEntries(formData.entries());

      // demo form data logging
      console.log("Newsletter signup:", formValues);
    });
  }
}

handleNewsletterSubmit();

document.addEventListener("astro:after-swap", handleNewsletterSubmit);
