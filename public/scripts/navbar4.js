function initNavbar4() {
  // Watch for sheet open state changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "attributes" && mutation.attributeName === "data-state") {
        const target = mutation.target;
        const isOpen = target.getAttribute("data-state") === "open";
        const navLinks = target.querySelectorAll("[data-nav-link]");

        if (isOpen) {
          // Wait for sheet animation to complete (500ms), then animate links
          setTimeout(() => {
            navLinks.forEach((link) => {
              link.classList.add("animate-in");
            });
          }, 425);
        } else {
          // Reset animation state when sheet closes
          navLinks.forEach((link) => {
            link.classList.remove("animate-in");
          });
        }
      }
    });
  });

  // Observe the specific sheet content element
  const sheetContent = document.getElementById("navbar-4-sheet-content");
  if (sheetContent) {
    observer.observe(sheetContent, { attributes: true });
  }
}

initNavbar4();
document.addEventListener("astro:after-swap", initNavbar4);

// Handle scroll-based navbar styling
function initNavbarScroll() {
  const navbar = document.querySelector("[data-navbar-4]");
  if (!navbar) return;

  // Find the scrollable parent container
  const scrollContainer = navbar.closest(".overflow-y-auto, .overflow-y-scroll") || window;

  const updateNavbarStyle = () => {
    const scrollTop =
      scrollContainer === window ? window.scrollY : scrollContainer.scrollTop;

    if (scrollTop > 10) {
      navbar.setAttribute("data-scrolled", "");
    } else {
      navbar.removeAttribute("data-scrolled");
    }
  };

  // Initial check
  updateNavbarStyle();

  // Listen for scroll events
  scrollContainer.addEventListener("scroll", updateNavbarStyle, { passive: true });
}

initNavbarScroll();
document.addEventListener("astro:after-swap", initNavbarScroll);

// Reveal the overlay navbar once the user scrolls past the first viewport height
function initNavbarReveal() {
  const navbar = document.querySelector("[data-navbar-4][data-overlay]");
  if (!navbar) return;

  const scrollContainer = navbar.closest(".overflow-y-auto, .overflow-y-scroll") || window;

  const updateRevealState = () => {
    const scrollTop =
      scrollContainer === window ? window.scrollY : scrollContainer.scrollTop;
    const threshold = window.innerHeight * 0.9;

    if (scrollTop > threshold) {
      navbar.setAttribute("data-revealed", "");
    } else {
      navbar.removeAttribute("data-revealed");
    }
  };

  updateRevealState();
  scrollContainer.addEventListener("scroll", updateRevealState, { passive: true });
  window.addEventListener("resize", updateRevealState);
}

initNavbarReveal();
document.addEventListener("astro:after-swap", initNavbarReveal);
