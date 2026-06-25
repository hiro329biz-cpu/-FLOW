const progress = document.querySelector(".progress");
const revealTargets = document.querySelectorAll("[data-reveal]");
const floatTargets = document.querySelectorAll("[data-float]");
const magneticTargets = document.querySelectorAll(".magnetic");
const tiltTargets = document.querySelectorAll(".service-card, .work-card, .strength-card, .price-card");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (!prefersReducedMotion.matches) {
  const spotlight = document.createElement("div");
  spotlight.className = "cursor-spotlight";
  spotlight.setAttribute("aria-hidden", "true");
  document.body.append(spotlight);

  window.addEventListener(
    "pointermove",
    (event) => {
      document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
      document.documentElement.style.setProperty("--spotlight-opacity", "1");
    },
    { passive: true }
  );

  window.addEventListener("pointerleave", () => {
    document.documentElement.style.setProperty("--spotlight-opacity", "0");
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14, rootMargin: "0px 0px -70px 0px" }
);

revealTargets.forEach((target, index) => {
  target.style.setProperty("--reveal-delay", `${Math.min((index % 6) * 70, 350)}ms`);
  observer.observe(target);
});

function updateScrollUi() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const amount = max > 0 ? (window.scrollY / max) * 100 : 0;
  progress.style.setProperty("--progress", `${amount}%`);
  document.body.classList.toggle("has-scrolled", window.scrollY > 24);

  floatTargets.forEach((target) => {
    const speed = Number(target.dataset.float || 0);
    const rect = target.getBoundingClientRect();
    const offset = rect.top + rect.height / 2 - window.innerHeight / 2;
    target.style.setProperty("--float-y", `${offset * speed}`);
  });
}

let scrollTicking = false;
window.addEventListener(
  "scroll",
  () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        updateScrollUi();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  },
  { passive: true }
);

window.addEventListener("resize", updateScrollUi);
updateScrollUi();

magneticTargets.forEach((target) => {
  target.addEventListener("pointermove", (event) => {
    if (prefersReducedMotion.matches) return;

    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    target.style.transform = `translate(${x * 0.08}px, ${y * 0.12}px)`;
  });

  target.addEventListener("pointerleave", () => {
    target.style.transform = "";
  });
});

tiltTargets.forEach((target) => {
  target.addEventListener("pointermove", (event) => {
    if (prefersReducedMotion.matches) return;

    const rect = target.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    target.style.setProperty("--tilt-x", `${y * -5}deg`);
    target.style.setProperty("--tilt-y", `${x * 6}deg`);
  });

  target.addEventListener("pointerleave", () => {
    target.style.setProperty("--tilt-x", "0deg");
    target.style.setProperty("--tilt-y", "0deg");
  });
});
