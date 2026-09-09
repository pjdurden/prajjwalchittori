/* ══════════════════════════════════════════════════════════════════════
   prajj.com — pointer-driven motion, shared by the home page and every
   page under /articles/ and /fintech/.

   Scroll-linked motion is not here: reveals, wipes, counters, numeral
   drift and the progress bars all run on CSS scroll timelines, on the
   compositor. This file is only the part CSS cannot do — inertial
   scrolling, a cursor that trails the pointer, and magnetic controls.

   Everything below is decorative and is switched off entirely for
   visitors who ask for reduced motion or who are on a touch device.
   /retro.html deliberately does not load this.
   ══════════════════════════════════════════════════════════════════ */
(function(){
  var $  = function(s,r){return (r||document).querySelector(s)};
  var $$ = function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};

  var calm = window.matchMedia("(prefers-reduced-motion: reduce)");
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  if(calm.matches) return;

  /* ── inertial scrolling ────────────────────────────────────────────
     Lenis drives the real scroll position rather than transforming a
     wrapper, so position:sticky and the CSS scroll timelines keep
     working untouched. */
  function startLenis(){
    if(!window.Lenis) return;
    var lenis = new Lenis({
      duration:1.05,
      easing:function(t){ return Math.min(1, 1.001 - Math.pow(2, -10 * t)) },
      smoothWheel:true,
      syncTouch:false          /* native scrolling on touch, which is better */
    });
    (function raf(time){ lenis.raf(time); requestAnimationFrame(raf) })(0);

    /* in-page anchors have to go through Lenis or they fight it */
    $$('a[href^="#"]').forEach(function(a){
      a.addEventListener("click",function(e){
        var id = a.getAttribute("href");
        if(id.length < 2) return;
        var target = document.querySelector(id);
        if(!target) return;
        e.preventDefault();
        lenis.scrollTo(target, {offset:-84});
        history.pushState(null, "", id);
      });
    });
  }
  if(window.Lenis) startLenis();
  else {
    var ls = document.createElement("script");
    ls.src = "/vendor/lenis.min.js";
    ls.onload = startLenis;
    document.head.appendChild(ls);
  }

  if(!fine.matches) return;

  /* ── cursor ────────────────────────────────────────────────────────
     A ring that trails the pointer and a dot that tracks it exactly.
     The system cursor is deliberately left visible: hiding it makes a
     site feel broken the moment anything here fails. */
  var ring = $("#cursor"), dot = $("#cursor-dot");
  if(ring && dot){
    var mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, seen = false;

    window.addEventListener("mousemove", function(e){
      mx = e.clientX; my = e.clientY;
      dot.style.translate = mx + "px " + my + "px";
      if(!seen){ seen = true; rx = mx; ry = my; ring.classList.add("on"); dot.classList.add("on") }
    }, {passive:true});

    document.addEventListener("mouseleave", function(){
      ring.classList.remove("on"); dot.classList.remove("on");
    });

    (function follow(){
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.translate = rx + "px " + ry + "px";
      requestAnimationFrame(follow);
    })();

    var HOT = "a, button, summary, input, .friend, .feature, a.card";
    document.addEventListener("mouseover", function(e){
      if(e.target.closest && e.target.closest(HOT)) ring.classList.add("hot");
    });
    document.addEventListener("mouseout", function(e){
      if(e.target.closest && e.target.closest(HOT)) ring.classList.remove("hot");
    });
  }

  /* ── magnetic controls ─────────────────────────────────────────────
     Small controls only. Big surfaces like article cards are left
     alone: pulling a whole paragraph around reads as a glitch. */
  $$(".links a, .links button, .findbtn, .skinbar a, .friend, .jump a, .back, footer .more a")
    .forEach(function(el){
      el.classList.add("magnetic");
      var pull = el.classList.contains("friend") ? 0.14 : 0.3;
      el.addEventListener("mousemove", function(e){
        var r = el.getBoundingClientRect();
        el.style.transition = "none";
        el.style.translate = ((e.clientX - (r.left + r.width  / 2)) * pull).toFixed(1) + "px "
                           + ((e.clientY - (r.top  + r.height / 2)) * pull).toFixed(1) + "px";
      });
      el.addEventListener("mouseleave", function(){
        el.style.transition = "";
        el.style.translate = "0px 0px";
      });
    });
})();
