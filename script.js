const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const mobileBackdrop = document.querySelector("[data-mobile-backdrop]");
const mobileMenuLinks = document.querySelectorAll("[data-menu-link]");
const topButton = document.querySelector("[data-top-button]");
const pageHeader = document.querySelector("header");

const syncFirstViewHeight = () => {
  if (!pageHeader) return;

  const headerHeight = pageHeader.getBoundingClientRect().height;
  const firstViewHeight = Math.max(0, Math.ceil(window.innerHeight - headerHeight + 2));

  document.documentElement.style.setProperty(
    "--header-height",
    `${headerHeight}px`,
  );
  document.documentElement.style.setProperty("--first-view-height", `${firstViewHeight}px`);
};

syncFirstViewHeight();
window.addEventListener("load", syncFirstViewHeight);

const setMobileMenu = (isOpen) => {
  if (!menuToggle || !mobileMenu || !mobileBackdrop) return;

  menuToggle.dataset.open = String(isOpen);
  mobileMenu.dataset.open = String(isOpen);
  mobileBackdrop.dataset.open = String(isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
  document.body.style.overflow = isOpen ? "hidden" : "";
};

menuToggle?.addEventListener("click", () => {
  setMobileMenu(menuToggle.dataset.open !== "true");
});

mobileBackdrop?.addEventListener("click", () => {
  setMobileMenu(false);
});

mobileMenuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setMobileMenu(false);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMobileMenu(false);
  }
});

const setTopButtonVisibility = () => {
  if (!topButton) return;

  const heroHeight = document.querySelector("#hero")?.offsetHeight ?? 420;
  const isVisible = window.scrollY > heroHeight * 0.55;

  topButton.dataset.visible = String(isVisible);
  topButton.tabIndex = isVisible ? 0 : -1;
  topButton.setAttribute("aria-hidden", String(!isVisible));
};

topButton?.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

window.addEventListener("scroll", setTopButtonVisibility, { passive: true });
window.addEventListener("resize", () => {
  syncFirstViewHeight();
  setTopButtonVisibility();
});
setTopButtonVisibility();

document.querySelectorAll("[data-faq]").forEach((item) => {
  const button = item.querySelector("[data-faq-button]");
  const panel = item.querySelector("[data-faq-panel]");
  const icon = item.querySelector("[data-faq-icon]");

  button.addEventListener("click", () => {
    const isOpen = item.dataset.open === "true";

    document.querySelectorAll("[data-faq]").forEach((other) => {
      other.dataset.open = "false";
      other.querySelector("[data-faq-panel]").style.maxHeight = "0px";
      other.querySelector("[data-faq-icon]").textContent = "+";
    });

    if (!isOpen) {
      item.dataset.open = "true";
      panel.style.maxHeight = `${panel.scrollHeight}px`;
      icon.textContent = "-";
    }
  });
});
