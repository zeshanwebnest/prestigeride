/* ==========================================================================
   AURELINE — components.js
   FAQ accordion, testimonial carousel, and form validation stubs.
   ========================================================================== */

(function () {
  "use strict";

  /* ---- FAQ Accordion ---- */
  document.querySelectorAll(".accordion").forEach(function (accordion) {
    var triggers = accordion.querySelectorAll(".accordion-item__trigger");

    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var panel = document.getElementById(trigger.getAttribute("aria-controls"));
        var isOpen = trigger.getAttribute("aria-expanded") === "true";

        triggers.forEach(function (other) {
          if (other !== trigger) {
            other.setAttribute("aria-expanded", "false");
            var otherPanel = document.getElementById(other.getAttribute("aria-controls"));
            if (otherPanel) otherPanel.setAttribute("data-open", "false");
          }
        });

        trigger.setAttribute("aria-expanded", String(!isOpen));
        if (panel) panel.setAttribute("data-open", String(!isOpen));
      });
    });
  });

  /* ---- Testimonial carousel ---- */
  document.querySelectorAll("[data-carousel]").forEach(function (carousel) {
    var track = carousel.querySelector("[data-carousel-track]");
    var slides = track ? Array.from(track.children) : [];
    var prevBtn = carousel.querySelector("[data-carousel-prev]");
    var nextBtn = carousel.querySelector("[data-carousel-next]");
    var dotsWrap = carousel.querySelector("[data-carousel-dots]");
    var index = 0;

    if (!track || slides.length === 0) return;

    var dots = [];
    if (dotsWrap) {
      slides.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", "Go to testimonial " + (i + 1));
        dot.addEventListener("click", function () {
          goTo(i);
        });
        dotsWrap.appendChild(dot);
        dots.push(dot);
      });
    }

    function render() {
      track.style.transform = "translateX(-" + index * 100 + "%)";
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      render();
    }

    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(index + 1); });
    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(index - 1); });

    var autoplay = window.setInterval(function () { goTo(index + 1); }, 6500);
    carousel.addEventListener("mouseenter", function () { window.clearInterval(autoplay); });

    render();
  });

  /* ---- Form validation (contact / booking) ---- */
  document.querySelectorAll("form[data-validate]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var valid = true;

      form.querySelectorAll("[required]").forEach(function (field) {
        var isEmpty = !field.value || !field.value.trim();
        field.setAttribute("aria-invalid", String(isEmpty));
        if (isEmpty) valid = false;
      });

      var successEl = form.querySelector(".form-success");

      if (valid) {
        form.reset();
        if (successEl) {
          successEl.classList.add("is-visible");
          successEl.setAttribute("role", "status");
          window.setTimeout(function () {
            successEl.classList.remove("is-visible");
          }, 6000);
        }
      }
    });
  });
})();
