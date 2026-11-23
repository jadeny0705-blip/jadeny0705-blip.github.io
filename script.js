const header = document.querySelector("[data-header]");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const progressBar = document.querySelector(".page-progress span");
const sections = [...document.querySelectorAll("main section[id]")];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 18);

  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const scrollProgress = scrollable > 0 ? window.scrollY / scrollable : 0;
  progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, scrollProgress))})`;
};

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

navToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("menu-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "关闭导航菜单" : "打开导航菜单");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("menu-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "打开导航菜单");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && header.classList.contains("menu-open")) {
    header.classList.remove("menu-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.focus();
  }
});

const revealItems = document.querySelectorAll(".reveal");

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const activeLink = document.querySelector(`.site-nav a[href="#${entry.target.id}"]`);
        if (!activeLink) return;

        navLinks.forEach((link) => link.classList.toggle("is-active", link === activeLink));
      });
    },
    { rootMargin: "-28% 0px -62% 0px" },
  );

  sections.forEach((section) => navObserver.observe(section));
}

const filterButtons = document.querySelectorAll("[data-filter]");
const projectGrid = document.querySelector(".project-grid");
const projectCards = document.querySelectorAll("[data-category]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    let visibleCount = 0;

    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    projectCards.forEach((card) => {
      const visible = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-filtered", !visible);
      if (visible) {
        visibleCount += 1;
        card.classList.add("is-visible");
      }
    });

    projectGrid.classList.toggle("is-single", filter !== "all" && visibleCount === 1);
  });
});

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});
