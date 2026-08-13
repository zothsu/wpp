function initEnrollmentForm() {
  const form = document.querySelector("#enroll-form");
  if (!form) return;

  let currentStep = 1;
  const totalSteps = document.querySelectorAll("[data-step]").length;

  const prevBtn = document.querySelector("#enroll-prev");
  const nextBtn = document.querySelector("#enroll-next");
  const submitBtn = document.querySelector("#enroll-submit");

  function updateStepVisibility() {
    document.querySelectorAll("[data-step]").forEach((panel) => {
      const stepNum = parseInt(panel.dataset.step || "0");
      panel.classList.toggle("hidden", stepNum !== currentStep);
    });

    document.querySelectorAll("[data-step-indicator]").forEach((indicator) => {
      const stepNum = parseInt(indicator.dataset.stepIndicator || "0");
      const circle = indicator.querySelector("div");
      const checkIcon = indicator.querySelector("svg");
      const numberSpan = indicator.querySelector("span:first-of-type");
      const labelSpan = indicator.querySelector("span:last-of-type");

      if (circle) {
        circle.dataset.active = String(stepNum === currentStep);
        circle.dataset.complete = String(stepNum < currentStep);
      }
      if (checkIcon) {
        checkIcon.dataset.complete = String(stepNum < currentStep);
      }
      if (numberSpan) {
        numberSpan.dataset.complete = String(stepNum < currentStep);
      }
      if (labelSpan) {
        labelSpan.dataset.active = String(stepNum === currentStep);
      }
    });

    document.querySelectorAll("[data-step-line]").forEach((line) => {
      const lineNum = parseInt(line.dataset.stepLine || "0");
      line.dataset.complete = String(lineNum < currentStep);
    });

    prevBtn.classList.toggle("invisible", currentStep === 1);
    nextBtn.classList.toggle("hidden", currentStep === totalSteps);
    submitBtn.classList.toggle("hidden", currentStep !== totalSteps);
    submitBtn.classList.toggle("flex", currentStep === totalSteps);

    form
      .querySelector(`[data-step="${currentStep}"] input, [data-step="${currentStep}"] select`)
      ?.scrollIntoView?.({ block: "nearest" });
  }

  function validateCurrentStep() {
    const currentPanel = document.querySelector(`[data-step="${currentStep}"]`);
    if (!currentPanel) return true;

    const inputs = currentPanel.querySelectorAll(
      "input[required], textarea[required], select[required]",
    );
    let valid = true;

    inputs.forEach((field) => {
      if (!field.checkValidity()) {
        field.reportValidity();
        valid = false;
      }
    });

    return valid;
  }

  prevBtn?.addEventListener("click", () => {
    if (currentStep > 1) {
      currentStep--;
      updateStepVisibility();
    }
  });

  nextBtn?.addEventListener("click", () => {
    if (validateCurrentStep() && currentStep < totalSteps) {
      currentStep++;
      updateStepVisibility();
    }
  });

  document.querySelectorAll("[data-step-indicator]").forEach((indicator) => {
    indicator.addEventListener("click", () => {
      const targetStep = parseInt(indicator.dataset.stepIndicator || "0");
      if (targetStep < currentStep) {
        currentStep = targetStep;
        updateStepVisibility();
      }
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    const formData = new FormData(form);
    const formValues = {};

    formData.forEach((value, key) => {
      if (key in formValues) {
        const existing = formValues[key];
        formValues[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
      } else {
        formValues[key] = value;
      }
    });

    // STUB: this just logs the payload for now. Swap this for a fetch() POST
    // to the n8n webhook once it's live - see docs/enrollment-form-plan.md.
    console.log(`${form.dataset.enrollmentLabel || "Enrollment"} submission:`, formValues);
  });

  updateStepVisibility();
}

initEnrollmentForm();

document.addEventListener("astro:after-swap", initEnrollmentForm);
