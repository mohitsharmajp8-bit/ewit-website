/* East West Institute of Technology — site interactions */
(function () {
  "use strict";

  /* Current year */
  document.querySelectorAll("[id='year'], .js-year").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* Sticky header shadow */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 10);
    if (toTop) toTop.classList.toggle("show", window.scrollY > 500);
  }

  /* Back to top */
  var toTop = document.getElementById("toTop");
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Mobile navigation */
  var burger = document.getElementById("hamburger");
  var mobileNav = document.getElementById("mobileNav");
  if (burger && mobileNav) {
    burger.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileNav.classList.remove("open");
        burger.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* Highlight the active nav link for the current page */
  var here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a, .mobile-nav a").forEach(function (a) {
    var target = a.getAttribute("href");
    if (target === here) a.classList.add("active");
  });

  /* Reveal on scroll */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* Animated counters */
  function runCounter(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var dec = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var prefix = el.getAttribute("data-prefix") || "";
    var dur = 1500, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = (target * eased).toFixed(dec);
      el.innerHTML = prefix + val + (suffix ? '<small>' + suffix + "</small>" : "");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { runCounter(en.target); co.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(runCounter);
  }

  /* Tabs */
  document.querySelectorAll("[data-tabs]").forEach(function (group) {
    var btns = group.querySelectorAll(".tab-btn");
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-tab");
        btns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        group.querySelectorAll(".tab-panel").forEach(function (p) {
          p.classList.toggle("active", p.getAttribute("data-panel") === id);
        });
      });
    });
  });

  /* Accordion */
  document.querySelectorAll(".accordion").forEach(function (acc) {
    acc.querySelectorAll(".acc-item").forEach(function (item) {
      var q = item.querySelector(".acc-q");
      var a = item.querySelector(".acc-a");
      if (!q || !a) return;
      q.addEventListener("click", function () {
        var isOpen = item.classList.contains("open");
        acc.querySelectorAll(".acc-item").forEach(function (other) {
          other.classList.remove("open");
          var oa = other.querySelector(".acc-a");
          if (oa) oa.style.maxHeight = null;
        });
        if (!isOpen) {
          item.classList.add("open");
          a.style.maxHeight = a.scrollHeight + "px";
        }
      });
    });
  });

  /* Enquiry form validation (client-side only) */
  var form = document.getElementById("enquiryForm");
  if (form) {
    var status = document.getElementById("formStatus");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (form.querySelector("#f-name") || {}).value || "";
      var email = (form.querySelector("#f-email") || {}).value || "";
      var phone = (form.querySelector("#f-phone") || {}).value || "";
      var interest = (form.querySelector("#f-interest") || {}).value || "";
      name = name.trim(); email = email.trim(); phone = phone.trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      var phoneOk = phone === "" || /^[+0-9()\-\s]{8,}$/.test(phone);

      if (!name || !email || !interest) {
        status.style.color = "#b23a2f";
        status.textContent = "Please complete your name, email and programme of interest.";
        return;
      }
      if (!emailOk) {
        status.style.color = "#b23a2f";
        status.textContent = "That email address doesn't look valid.";
        return;
      }
      if (!phoneOk) {
        status.style.color = "#b23a2f";
        status.textContent = "Please enter a valid phone number, or leave it blank.";
        return;
      }
      status.style.color = "#1f7a4d";
      status.textContent = "Thank you, " + name.split(" ")[0] + ". Your enquiry has been noted — the admissions office will respond within one working day.";
      form.reset();
    });
  }

  onScroll();
})();
