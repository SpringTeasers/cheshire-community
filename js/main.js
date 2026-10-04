/* ==========================================================================
   Cheshire Community Directory — main.js
   Progressive enhancement only. The site is fully usable with JS disabled:
   the header nav is a plain list of links in the markup, and every page's
   content is static HTML.
   ========================================================================== */
(function () {
  "use strict";

  /* Signal that JS is available. The CSS collapse of the mobile nav is keyed
     off `html.js`, so without JS the nav stays a plain visible link list. */
  document.documentElement.classList.add("js");

  /* ----------------------------------------------------------------------
     1. Mobile navigation toggle
     Markup contract:
       <button class="nav-toggle" aria-expanded="false" aria-controls="site-nav">
       <nav class="site-nav" id="site-nav">
     On small screens .site-nav is display:none until .is-open is added.
     ---------------------------------------------------------------------- */
  var MOBILE_MAX = 899; // px — matches the CSS `min-width: 900px` nav breakpoint

  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("site-nav");
    if (!toggle || !nav) return;

    var label = toggle.querySelector(".nav-toggle__label");

    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (label) {
        label.textContent = open ? "Close" : "Menu";
      }
    }

    function close() { setOpen(false); }

    function isOpen() { return toggle.getAttribute("aria-expanded") === "true"; }

    toggle.addEventListener("click", function () {
      setOpen(!isOpen());
    });

    /* Escape closes the menu and returns focus to the toggle. */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) {
        close();
        toggle.focus();
      }
    });

    /* Click outside the nav closes it (mobile only). */
    document.addEventListener("click", function (e) {
      if (!isOpen()) return;
      if (window.innerWidth > MOBILE_MAX) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      close();
    });

    /* Following an in-page link closes the menu. */
    nav.addEventListener("click", function (e) {
      var link = e.target.closest ? e.target.closest("a") : null;
      if (link && window.innerWidth <= MOBILE_MAX) close();
    });

    /* Crossing to the desktop breakpoint resets state so the two nav
       presentations never disagree (e.g. aria-expanded="true" while the
       horizontal nav is showing). */
    var resizeTimer = null;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        if (window.innerWidth > MOBILE_MAX && isOpen()) close();
      }, 150);
    });
  }

  /* ----------------------------------------------------------------------
     2. Header shadow once the page is scrolled (§5.1)
     ---------------------------------------------------------------------- */
  function initHeaderShadow() {
    var header = document.querySelector(".site-header");
    if (!header) return;

    var ticking = false;
    function update() {
      ticking = false;
      if (window.scrollY > 4) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    }
    window.addEventListener("scroll", function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }, { passive: true });
    update();
  }

  /* ----------------------------------------------------------------------
     3. Current year in every footer
     Markup contract: <span data-current-year>2025</span>
     Static fallback text stays in the HTML if JS never runs.
     ---------------------------------------------------------------------- */
  function initYear() {
    var nodes = document.querySelectorAll("[data-current-year]");
    if (!nodes.length) return;
    var year = String(new Date().getFullYear());
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = year;
    }
  }

  /* ----------------------------------------------------------------------
     4. Boot
     ---------------------------------------------------------------------- */
  function boot() {
    initNav();
    initHeaderShadow();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
