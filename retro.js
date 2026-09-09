/* ══════════════════════════════════════════════════════════════════
   prajj.com — shared behaviour for /articles/ and /fintech/ pages.
   The home page carries its own copy of this inline.
   ══════════════════════════════════════════════════════════════ */
(function(){
  var $  = function(s,r){return (r||document).querySelector(s)};
  var $$ = function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var root = document.documentElement;

  /* ── status bar ───────────────────────────────────────────────── */
  var statusEl = $("#statustext"), stopped = false;
  function setStatus(t){ if(statusEl) statusEl.textContent = t; }
  var IDLE = ["Done","Done — 47 items remaining","Opening page...","Done",
              "Transferring data from prajj.com...","Done"], idx = 0;
  setTimeout(function(){
    setInterval(function(){ if(!stopped) setStatus(IDLE[idx++ % IDLE.length]) }, 5200);
  }, 2600);
  $$("a[href]").forEach(function(a){
    a.addEventListener("mouseenter",function(){ setStatus(a.href) });
    a.addEventListener("mouseleave",function(){ setStatus("Done") });
  });

  /* ── toolbar buttons (they actually work) ─────────────────────── */
  function on(id,fn){ var e=$(id); if(e) e.addEventListener("click",fn) }
  on("#tb-back",   function(){ history.back() });
  on("#tb-fwd",    function(){ history.forward() });
  on("#tb-refresh",function(){ location.reload() });
  on("#tb-print",  function(){ window.print() });
  on("#tb-stop",   function(){
    stopped = true;
    $$(".rainbow,.divider,.throb,article hr").forEach(function(m){ m.style.animationPlayState="paused" });
    setStatus("Stopped");
  });
  var addr = $("#addr");
  if(addr) addr.addEventListener("keydown",function(e){
    if(e.key === "Enter"){ e.preventDefault(); setStatus("Cannot find server or DNS Error"); addr.blur(); }
  });

  /* ── skins, shared with the home page via localStorage ────────── */
  var SKINS = ["geocities","myspace","win98","matrix"];
  var LABEL = {geocities:"GEOCiTiES",myspace:"MYSPACE",win98:"WiNDOWS 98",matrix:"MATRiX"};
  function current(){ return root.getAttribute("data-skin") || "geocities" }
  function apply(s){
    if(s === "geocities") root.removeAttribute("data-skin");
    else root.setAttribute("data-skin", s);
    try{ localStorage.setItem("pc-skin", s) }catch(e){}
    paint(); setStatus("Applied skin: " + s);
  }
  var cycler = $("#themebtn");
  function paint(){ if(cycler) cycler.textContent = "◒ " + LABEL[current()] }
  if(cycler){
    cycler.title = "Change the page skin";
    cycler.setAttribute("aria-label","Change the page skin");
    paint();
    cycler.addEventListener("click",function(){
      apply(SKINS[(SKINS.indexOf(current()) + 1) % SKINS.length]);
    });
  }
  $$(".skinbar button").forEach(function(b){
    b.addEventListener("click",function(){ apply(b.getAttribute("data-skin")) });
  });

  /* ── sparkle cursor trail ─────────────────────────────────────── */
  (function(){
    var layer = $("#trail"); if(!layer) return;
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if(window.matchMedia("(pointer: coarse)").matches) return;
    var last = 0;
    document.addEventListener("mousemove",function(e){
      var now = Date.now(); if(now - last < 42) return; last = now;
      var s = document.createElement("i");
      s.style.left = e.clientX + "px"; s.style.top = e.clientY + "px";
      layer.appendChild(s);
      setTimeout(function(){ if(s.parentNode) s.parentNode.removeChild(s) }, 760);
    },{passive:true});
  })();

  /* ── index-page search (kept from the old build) ──────────────── */
  var filter = $("#filter");
  if(filter){
    var cards = $$("a.card"), groups = $$("h2.grp"), none = $("#noresults");
    function run(){
      var q = filter.value.trim().toLowerCase();
      cards.forEach(function(c){
        c.style.display = (!q || c.textContent.toLowerCase().indexOf(q) >= 0) ? "" : "none";
      });
      var any = false;
      groups.forEach(function(g){
        var list = g.nextElementSibling, shown = 0;
        if(list) $$("a.card",list).forEach(function(c){ if(c.style.display !== "none") shown++ });
        g.style.display = shown ? "" : "none";
        if(list) list.style.display = shown ? "" : "none";
        if(shown) any = true;
      });
      if(none) none.style.display = any ? "none" : "block";
    }
    filter.addEventListener("input", run);
    document.addEventListener("keydown",function(e){
      var typing = document.activeElement && /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName);
      if(e.key === "/" && !typing){ e.preventDefault(); filter.focus() }
      else if(e.key === "Escape" && document.activeElement === filter){ filter.value=""; run(); filter.blur() }
    });
  }

  /* ── GoatCounter ──────────────────────────────────────────────── */
  var s = document.createElement("script");
  s.async = true; s.src = "//gc.zgo.at/count.js";
  s.setAttribute("data-goatcounter","https://pjdurden.goatcounter.com/count");
  document.head.appendChild(s);
})();

/* ══════════════════════════════════════════════════════════════════
   Pointer-driven motion for these pages.

   Only /articles/ and /fintech/ load this file — the home page has its
   own script tags and /retro.html carries its own inline script — so
   no guard is needed here. The cursor elements do not exist in the
   page source, so they are created on the fly rather than editing 158
   files to add two empty divs.
   ══════════════════════════════════════════════════════════════ */
(function(){
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  ["cursor","cursor-dot"].forEach(function(id){
    if(document.getElementById(id)) return;
    var el = document.createElement("div");
    el.id = id;
    el.className = id;
    el.setAttribute("aria-hidden","true");
    document.body.appendChild(el);
  });

  var m = document.createElement("script");
  m.src = "/motion.js";
  m.defer = true;
  document.head.appendChild(m);
})();
