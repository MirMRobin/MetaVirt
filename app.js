// MetaVirt — shared interactions
document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu
  var toggle = document.getElementById("nav-toggle");
  var menu = document.getElementById("mobile-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", menu.classList.contains("is-open"));
    });
  }

  // Scroll reveal — restrained: only elements marked .rv
  var rvs = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window) {
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    rvs.forEach(function (el) { obs.observe(el); });
  } else {
    rvs.forEach(function (el) { el.classList.add("is-in"); });
  }

  // Product tabs (products.html)
  var tabs = document.querySelectorAll(".tab");
  var tabMap = null;
  if (tabs.length) {
    var panes = document.querySelectorAll(".tab-pane");
    tabMap = {};
    tabs.forEach(function (t) { tabMap[t.getAttribute("data-pane")] = t; });

    function showTab(id) {
      if (!tabMap[id]) return;
      panes.forEach(function (p) { p.classList.remove("is-active"); });
      var pane = document.getElementById(id);
      if (pane) pane.classList.add("is-active");
      tabs.forEach(function (t) {
        t.classList.toggle("is-active", t.getAttribute("data-pane") === id);
      });
      if (history.replaceState) history.replaceState(null, "", "#" + id);
    }
    window.__showTab = showTab;

    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        showTab(t.getAttribute("data-pane"));
      });
    });

    // Respect deep links and default to first tab
    var initial = location.hash.replace("#", "");
    var first = tabs[0].getAttribute("data-pane");
    showTab(initial && document.getElementById(initial) ? initial : first);

    window.addEventListener("popstate", function () {
      var h = location.hash.replace("#", "");
      if (h && document.getElementById(h)) showTab(h);
    });
  }

  // Anchor handling: same-page links either switch a product tab (products page)
  // or smooth-scroll with a fixed-header offset.
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (ev) {
      var href = this.getAttribute("href");
      var id = href.slice(1);
      var target = document.getElementById(id);
      if (tabMap && tabMap[id]) {
        ev.preventDefault();
        showTab(id);
        var tabsEl = document.getElementById("product-tabs") ||
          document.querySelector(".tabs");
        if (tabsEl) {
          var y = tabsEl.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      } else if (target) {
        ev.preventDefault();
        var yy = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: yy, behavior: "smooth" });
      }
    });
  });
});
