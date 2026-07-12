// Beste IPTV Nordic — shared front-end behavior

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
});
