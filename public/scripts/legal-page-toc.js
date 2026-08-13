function initLegalPage02Toc() {
  const content = document.getElementById("legal-page-02-content");
  const tocList = document.getElementById("legal-page-02-toc-list");
  if (!content || !tocList) return;

  // Clear existing TOC entries
  tocList.innerHTML = "";

  // Scan for headings in the prose content
  const headings = content.querySelectorAll("h2, h3");
  if (headings.length === 0) return;

  // Ensure each heading has an ID
  headings.forEach((heading, index) => {
    if (!heading.id) {
      heading.id = `legal-02-heading-${index}`;
    }

    const li = document.createElement("li");
    if (heading.tagName === "H3") {
      li.classList.add("pl-4");
    }

    const a = document.createElement("a");
    a.href = `#${heading.id}`;
    a.textContent = heading.textContent;
    a.className =
      "text-muted-foreground hover:text-foreground data-[active]:text-foreground transition-colors data-[active]:font-medium";
    a.setAttribute("data-toc-link", "");
    li.appendChild(a);
    tocList.appendChild(li);
  });

  // Set up intersection observer for active heading tracking
  const links = tocList.querySelectorAll("[data-toc-link]");

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          links.forEach((link) => link.removeAttribute("data-active"));
          const activeLink = tocList.querySelector(`[href="#${entry.target.id}"]`);
          activeLink?.setAttribute("data-active", "");
        }
      }
    },
    { rootMargin: "0px 0px -70% 0px", threshold: 0 },
  );

  headings.forEach((heading) => observer.observe(heading));
}

initLegalPage02Toc();
document.addEventListener("astro:after-swap", initLegalPage02Toc);
