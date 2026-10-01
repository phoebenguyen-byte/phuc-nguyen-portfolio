/* ============================================================
   Shared behavior for every page: mobile nav, scroll-reveal,
   footer year, copy-to-clipboard buttons, project filtering.
   ============================================================ */
(function () {
  "use strict";

  // ---- Mobile nav toggle ----
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ---- Scroll reveal (progressive enhancement) ----
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    revealEls.forEach(function (el) { el.setAttribute("data-revealed", "false"); });
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-revealed", "true");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  }

  // ---- Footer year ----
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Copy-to-clipboard ----
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      var done = function () {
        var original = btn.textContent;
        btn.textContent = "Copied";
        btn.classList.add("is-copied");
        setTimeout(function () {
          btn.textContent = original;
          btn.classList.remove("is-copied");
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        done();
      }
    });
  });

  // ---- Project category filter (projects.html only) ----
  var filterRow = document.querySelector("[data-filter-row]");
  if (filterRow) {
    var cards = document.querySelectorAll("[data-project-card]");
    filterRow.querySelectorAll(".filter-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterRow.querySelectorAll(".filter-btn").forEach(function (b) {
          b.classList.remove("is-active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
        var cat = btn.getAttribute("data-filter");
        cards.forEach(function (card) {
          var match = cat === "all" || card.getAttribute("data-category") === cat;
          card.classList.toggle("is-hidden", !match);
        });
      });
    });
  }

  // ---- Hero photo swap (index.html only) ----
  var heroPhotos = document.getElementById("hero-photos");
  if (heroPhotos) {
    var photoA = document.getElementById("hero-photo-a");
    var photoB = document.getElementById("hero-photo-b");
    var heroLabels = {
      a: {
        large: "Currently large: presenting on stage. Click to bring the team photo to the front instead.",
        small: "Currently small: presenting on stage. Click to bring this photo to the front instead."
      },
      b: {
        large: "Currently large: with the Amazon Ads team at unBoxed on Tour, Shenzhen. Click to bring the other photo to the front instead.",
        small: "Currently small: with the Amazon Ads team at unBoxed on Tour, Shenzhen. Click to bring this photo to the front instead."
      }
    };
    var toggleHeroPhotos = function () {
      var swapped = heroPhotos.classList.toggle("is-swapped");
      photoA.setAttribute("aria-pressed", swapped ? "false" : "true");
      photoB.setAttribute("aria-pressed", swapped ? "true" : "false");
      photoA.setAttribute("aria-label", swapped ? heroLabels.a.small : heroLabels.a.large);
      photoB.setAttribute("aria-label", swapped ? heroLabels.b.large : heroLabels.b.small);
    };
    photoA.addEventListener("click", toggleHeroPhotos);
    photoB.addEventListener("click", toggleHeroPhotos);
  }
})();
