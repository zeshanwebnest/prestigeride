/* ==========================================================================
   AURELINE — animations.js
   Reveal-on-scroll (IntersectionObserver), animated counters, light parallax.
   All effects are skipped under prefers-reduced-motion.
   ========================================================================== */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Reveal on scroll ---- */
  var revealEls = document.querySelectorAll("[data-reveal]");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else if (revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ---- Animated counters ---- */
  var counters = document.querySelectorAll("[data-counter]");

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-counter"));
    var suffix = el.getAttribute("data-counter-suffix") || "";
    var duration = 1600;
    var start = null;

    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }

    function step(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.floor(eased * target);
      el.textContent = value + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
        el.classList.add("is-done");
      }
    }

    window.requestAnimationFrame(step);
  }

  if (counters.length) {
    if (!("IntersectionObserver" in window)) {
      counters.forEach(animateCounter);
    } else {
      var counterObserver = new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach(function (el) {
        counterObserver.observe(el);
      });
    }
  }

  /* ---- Subtle hero parallax ---- */
  var parallaxEls = document.querySelectorAll("[data-parallax]");
  if (parallaxEls.length && !reduceMotion) {
    var ticking = false;

    function updateParallax() {
      var scrollY = window.scrollY;
      parallaxEls.forEach(function (el) {
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0.15;
        /* Image is top-flush with 20%+ of buffer height below it (see inline
           height:120%+), so only ever shift UPWARD — shifting down would
           expose the section background above the image. Capped well below
           the smallest section's buffer so the bottom edge never runs out. */
        var offset = -Math.min(scrollY * speed, 50);
        el.style.transform = "translateY(" + offset + "px) scale(1.08)";
      });
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(updateParallax);
          ticking = true;
        }
      },
      { passive: true }
    );
  }
})();
