const sidebar = document.querySelector(".right-sidebar");

document.querySelectorAll(".right-sidebar a").forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.hash);
    if (!target || !sidebar || !document.startViewTransition) {
        return;
    }

    event.preventDefault();

    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior = reducedMotion ? "instant" : "smooth";

    document.startViewTransition(() => {
        // Update the URL and scroll position as the transition's DOM update.
        history.pushState(null, "", link.hash);
        target.scrollIntoView({ behavior, block: "start" });
    });
  });
});
