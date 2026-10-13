/* ============================================================
   Shared behavior for every page: mobile nav, scroll-reveal,
   footer year, copy-to-clipboard buttons, project filtering,
   interactive photo-swap pairs.
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

  // ---- Interactive photo-swap pairs (generic, supports any number on a page) ----
  // Markup contract: a wrapper with [data-photo-swap] containing exactly two
  // .duo-photo buttons tagged data-slot="a" / data-slot="b", each carrying
  // data-label-large / data-label-small for the accessible label text.
  // Clicking either button swaps which one is displayed large via the
  // .is-swapped class on the wrapper — no IDs required, so this same
  // function wires up the homepage hero collage and any per-project
  // galleries (e.g. the Students Up! event photos) without collisions.
  document.querySelectorAll("[data-photo-swap]").forEach(function (wrap) {
    var buttons = wrap.querySelectorAll(".duo-photo");
    if (buttons.length < 2) return;
    var applyLabels = function () {
      var swapped = wrap.classList.contains("is-swapped");
      buttons.forEach(function (btn) {
        var isA = btn.getAttribute("data-slot") === "a";
        var isLarge = isA ? !swapped : swapped;
        btn.setAttribute("aria-pressed", isLarge ? "true" : "false");
        var label = isLarge ? btn.getAttribute("data-label-large") : btn.getAttribute("data-label-small");
        if (label) btn.setAttribute("aria-label", label);
      });
    };
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        wrap.classList.toggle("is-swapped");
        applyLabels();
      });
    });
    applyLabels();
  });
})();
