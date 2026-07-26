// Beste IPTV Norge — shared front-end behavior

document.addEventListener("DOMContentLoaded", function () {
  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", nav.classList.contains("open"));
    });
  }

  // Live "now watching" viewer counter — interactive live-stream visual effect
  var viewersEl = document.querySelector("[data-viewers]");
  if (viewersEl) {
    var count = parseInt(viewersEl.getAttribute("data-viewers"), 10) || 62810;
    setInterval(function () {
      var delta = Math.floor(Math.random() * 37) - 14;
      count = Math.max(58000, count + delta);
      viewersEl.textContent = count.toLocaleString("nb-NO");
    }, 2600);
  }

  // Rotate "now playing" channel on the hero live visual
  var nowTitle = document.querySelector("[data-now-title]");
  var nowSub = document.querySelector("[data-now-sub]");
  if (nowTitle && nowSub) {
    var channels = [
      { title: "Eliteserien: Rosenborg – Molde", sub: "Sportskanalen 1" },
      { title: "Premier League: Arsenal – Liverpool", sub: "Sportskanalen 2" },
      { title: "Kinopremiere: Nordlys", sub: "FilmMax" },
      { title: "Kveldsnytt direkte", sub: "NyheterNord" }
    ];
    var i = 0;
    setInterval(function () {
      i = (i + 1) % channels.length;
      nowTitle.style.opacity = 0;
      nowSub.style.opacity = 0;
      setTimeout(function () {
        nowTitle.textContent = channels[i].title;
        nowSub.querySelector("[data-channel-name]").textContent = channels[i].sub;
        nowTitle.style.opacity = 1;
        nowSub.style.opacity = 1;
      }, 300);
    }, 4200);
    nowTitle.style.transition = "opacity 0.3s ease";
    nowSub.style.transition = "opacity 0.3s ease";
  }

  // Cursor-tracking glow spotlight on the setup guide cards
  var spotlightCards = document.querySelectorAll(".guide-card");
  spotlightCards.forEach(function (card) {
    card.addEventListener("pointermove", function (e) {
      var rect = card.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mx", x + "%");
      card.style.setProperty("--my", y + "%");
    });
    card.addEventListener("pointerenter", function () {
      card.classList.add("is-active");
    });
    card.addEventListener("pointerleave", function () {
      card.classList.remove("is-active");
    });
  });

  // Recommended IPTV apps carousel — arrows + "Slide X of Y", synced to manual scroll/swipe.
  // Scrolls only the track's own scrollLeft via track.scrollTo() — deliberately never
  // element.scrollIntoView(), which walks every scrollable ancestor (including the page
  // itself) and previously caused the whole window to jump/snap.
  var appsTrack = document.getElementById("appsTrack");
  if (appsTrack) {
    var appsSlides = Array.prototype.slice.call(appsTrack.querySelectorAll(".apps-slide"));
    var appsPrevBtn = document.querySelector('.apps-arrow[data-dir="-1"]');
    var appsNextBtn = document.querySelector('.apps-arrow[data-dir="1"]');
    var appsCurrentEl = document.getElementById("appsSlideCurrent");
    var appsTotalEl = document.getElementById("appsSlideTotal");
    var appsActiveIndex = 0;

    if (appsTotalEl) appsTotalEl.textContent = appsSlides.length;

    function appsSetIndicator(i) {
      appsActiveIndex = i;
      if (appsCurrentEl) appsCurrentEl.textContent = i + 1;
    }

    function appsCenterSlide(i, behavior) {
      var slide = appsSlides[i];
      var left = slide.offsetLeft - (appsTrack.clientWidth - slide.clientWidth) / 2;
      appsTrack.scrollTo({ left: left, behavior: behavior || "smooth" });
    }

    function appsGoTo(i) {
      i = (i + appsSlides.length) % appsSlides.length;
      appsCenterSlide(i);
      appsSetIndicator(i);
    }

    if (appsPrevBtn) appsPrevBtn.addEventListener("click", function () { appsGoTo(appsActiveIndex - 1); });
    if (appsNextBtn) appsNextBtn.addEventListener("click", function () { appsGoTo(appsActiveIndex + 1); });

    function appsGetCenterMostIndex() {
      var trackRect = appsTrack.getBoundingClientRect();
      var trackCenter = trackRect.left + trackRect.width / 2;
      var closestIdx = 0;
      var closestDist = Infinity;
      appsSlides.forEach(function (slide, idx) {
        var r = slide.getBoundingClientRect();
        var dist = Math.abs(r.left + r.width / 2 - trackCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = idx;
        }
      });
      return closestIdx;
    }

    var appsScrollTimer;
    appsTrack.addEventListener("scroll", function () {
      clearTimeout(appsScrollTimer);
      appsScrollTimer = setTimeout(function () {
        appsSetIndicator(appsGetCenterMostIndex());
      }, 100);
    });

    // Advance the carousel every five seconds. Pause while the visitor is
    // interacting with it or when the tab is not visible.
    var appsAutoSlideTimer;
    function appsStartAutoSlide() {
      if (appsSlides.length < 2 || appsAutoSlideTimer) return;
      appsAutoSlideTimer = setInterval(function () {
        appsGoTo(appsActiveIndex + 1);
      }, 5000);
    }

    function appsStopAutoSlide() {
      clearInterval(appsAutoSlideTimer);
      appsAutoSlideTimer = null;
    }

    appsTrack.addEventListener("pointerenter", appsStopAutoSlide);
    appsTrack.addEventListener("pointerleave", appsStartAutoSlide);
    appsTrack.addEventListener("focusin", appsStopAutoSlide);
    appsTrack.addEventListener("focusout", appsStartAutoSlide);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) appsStopAutoSlide();
      else appsStartAutoSlide();
    });

    appsCenterSlide(0, "auto");
    appsSetIndicator(0);
    appsStartAutoSlide();
  }
});
