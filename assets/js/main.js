/* East West Institute of Technology — site interactions */
(function () {
  "use strict";

  /* ---------- Current year ---------- */
  document.querySelectorAll("#year, .js-year").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Header + back to top ---------- */
  var header = document.getElementById("siteHeader");
  var toTop = document.getElementById("toTop");
  if (toTop) toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Mobile navigation ---------- */
  var burger = document.getElementById("hamburger");
  var mobileNav = document.getElementById("mobileNav");
  function closeMobile() {
    if (mobileNav) mobileNav.classList.remove("open");
    if (burger) { burger.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }
    document.body.style.overflow = "";
  }
  if (burger && mobileNav) {
    burger.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMobile);
    });
  }

  /* ---------- Active nav link ---------- */
  var here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a, .mobile-nav a").forEach(function (a) {
    if (a.getAttribute("href") === here) a.classList.add("active");
  });
  document.querySelectorAll(".nav-item.has-drop").forEach(function (item) {
    if (item.querySelector('.drop a[href="' + here + '"]')) {
      var top = item.querySelector(":scope > a");
      if (top) top.classList.add("active");
    }
  });

  /* ---------- Dropdown menus (touch fallback) ---------- */
  var noHover = window.matchMedia("(hover: none)").matches;
  if (noHover) {
    document.querySelectorAll(".nav-item.has-drop > a").forEach(function (a) {
      a.addEventListener("click", function (e) {
        var item = a.parentNode;
        if (!item.classList.contains("open")) {
          e.preventDefault();
          document.querySelectorAll(".nav-item.open").forEach(function (o) { o.classList.remove("open"); });
          item.classList.add("open");
        }
      });
    });
    document.addEventListener("click", function (e) {
      document.querySelectorAll(".nav-item.open").forEach(function (it) {
        if (!it.contains(e.target)) it.classList.remove("open");
      });
    });
  }

  /* ---------- Robust scroll reveal ----------
     Position-based rather than IntersectionObserver so a fast flick can
     never leave a section stuck invisible. */
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  function viewportH() { return window.innerHeight || document.documentElement.clientHeight; }

  function revealPass() {
    var vh = viewportH();
    for (var i = 0; i < reveals.length; i++) {
      var el = reveals[i];
      if (el.classList.contains("in")) continue;
      var r = el.getBoundingClientRect();
      if (r.top < vh - 30) el.classList.add("in");
    }
  }

  /* ---------- Animated counters ---------- */
  var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
  function runCounter(el) {
    if (el.getAttribute("data-ran")) return;
    el.setAttribute("data-ran", "1");
    var target = parseFloat(el.getAttribute("data-count"));
    var dec = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var prefix = el.getAttribute("data-prefix") || "";
    var dur = 1500, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.innerHTML = prefix + (target * eased).toFixed(dec) + (suffix ? "<small>" + suffix + "</small>" : "");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function counterPass() {
    var vh = viewportH();
    for (var i = 0; i < counters.length; i++) {
      var el = counters[i];
      if (el.getAttribute("data-ran")) continue;
      var r = el.getBoundingClientRect();
      if (r.top < vh - 20) runCounter(el);
    }
  }

  var ticking = false;
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 10);
    if (toTop) toTop.classList.toggle("show", window.scrollY > 500);
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      revealPass(); counterPass();
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  /* debounced pass after scrolling stops — belt and braces against missed frames */
  var endTimer;
  window.addEventListener("scroll", function () {
    clearTimeout(endTimer);
    endTimer = setTimeout(function () { revealPass(); counterPass(); }, 160);
  }, { passive: true });
  window.addEventListener("resize", function () { revealPass(); counterPass(); });
  window.addEventListener("load", function () { revealPass(); counterPass(); });
  /* safety passes so nothing can ever stay hidden */
  [120, 500, 1200, 2500].forEach(function (t) {
    setTimeout(function () { revealPass(); counterPass(); }, t);
  });

  /* ---------- Tabs ---------- */
  document.querySelectorAll("[data-tabs]").forEach(function (group) {
    group.querySelectorAll(".tab-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-tab");
        group.querySelectorAll(".tab-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        group.querySelectorAll(".tab-panel").forEach(function (p) {
          p.classList.toggle("active", p.getAttribute("data-panel") === id);
        });
      });
    });
  });

  /* ---------- Accordion ---------- */
  document.querySelectorAll(".accordion").forEach(function (acc) {
    acc.querySelectorAll(".acc-item").forEach(function (item) {
      var q = item.querySelector(".acc-q"), a = item.querySelector(".acc-a");
      if (!q || !a) return;
      q.addEventListener("click", function () {
        var isOpen = item.classList.contains("open");
        acc.querySelectorAll(".acc-item").forEach(function (other) {
          other.classList.remove("open");
          var oa = other.querySelector(".acc-a");
          if (oa) oa.style.maxHeight = null;
        });
        if (!isOpen) { item.classList.add("open"); a.style.maxHeight = a.scrollHeight + "px"; }
      });
    });
  });

  /* ---------- Gallery lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  if (lightbox) {
    var holder = lightbox.querySelector(".lb-holder");
    function closeLb() {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
      if (holder) holder.innerHTML = "";
    }
    document.querySelectorAll(".g-item").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var svg = btn.querySelector("svg");
        if (!svg || !holder) return;
        holder.innerHTML = "";
        var clone = svg.cloneNode(true);
        clone.removeAttribute("style");
        holder.appendChild(clone);
        lightbox.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox || (e.target.closest && e.target.closest(".lb-close"))) closeLb();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLb(); });
  }

  /* ---------- Enquiry forms ---------- */
  document.querySelectorAll("form.js-enquiry").forEach(function (form) {
    var status = form.querySelector(".form-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var val = function (n) { var el = form.querySelector('[name="' + n + '"]'); return el ? el.value.trim() : ""; };
      var name = val("name"), email = val("email"), phone = val("phone"), interest = val("interest");
      if (!status) return;
      if (!name || !email || !interest) {
        status.style.color = "#b23a2f";
        status.textContent = "Please complete your name, email and programme of interest.";
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        status.style.color = "#b23a2f";
        status.textContent = "That email address doesn't look valid.";
        return;
      }
      if (phone && !/^[+0-9()\-\s]{8,}$/.test(phone)) {
        status.style.color = "#b23a2f";
        status.textContent = "Please enter a valid phone number, or leave it blank.";
        return;
      }
      status.style.color = "#1f7a4d";
      status.textContent = "Thank you, " + name.split(" ")[0] + ". Your enquiry has been noted — the office will respond within one working day.";
      form.reset();
    });
  });

  onScroll();
  revealPass();
  counterPass();
})();
