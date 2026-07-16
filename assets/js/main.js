/* ==========================================================================
   AURELINE — main.js
   Sticky header state, mobile nav toggle, smooth-scroll anchors,
   active nav-link marking, current year in footer.
   ========================================================================== */

(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var navToggle = document.querySelector(".nav__toggle");
  var navLinks = document.querySelector(".nav__links");

  /* Sticky header shadow on scroll */
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Mobile nav toggle */
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      navLinks.classList.toggle("is-open", !isOpen);
      document.body.style.overflow = !isOpen ? "hidden" : "";
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navToggle.setAttribute("aria-expanded", "false");
        navLinks.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  /* Mark current page in the nav as aria-current */
  var currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav__links a, .footer__links a").forEach(function (link) {
    var href = link.getAttribute("href");
    if (href === currentPath) {
      link.setAttribute("aria-current", "page");
    }
  });

  /* Footer year */
  var yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
