// Sakshi Shirole portfolio: grid background, nav, typing, reveal, tilt, contact form
(function () {
  "use strict";

  var EMAIL = "sakshibshirole@gmail.com";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.getElementById("year").textContent = new Date().getFullYear();

  // ---------- animated grid background ----------
  var canvas = document.getElementById("grid");
  var ctx = canvas.getContext("2d");
  var mx = window.innerWidth / 2, my = window.innerHeight / 3;

  function sizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; drawGrid(); }
  function drawGrid() {
    var w = canvas.width, h = canvas.height, cell = 60;
    ctx.clearRect(0, 0, w, h);
    var ox = (mx / w - 0.5) * 20, oy = (my / h - 0.5) * 20;
    ctx.strokeStyle = "rgba(168,85,247,0.07)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (var x = (ox % cell) - cell; x < w + cell; x += cell) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
    for (var y = (oy % cell) - cell; y < h + cell; y += cell) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
    ctx.stroke();
    var g = ctx.createRadialGradient(mx, my, 0, mx, my, 320);
    g.addColorStop(0, "rgba(168,85,247,0.14)");
    g.addColorStop(0.5, "rgba(34,211,238,0.04)");
    g.addColorStop(1, "rgba(168,85,247,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }
  window.addEventListener("resize", sizeCanvas);
  if (!reduce) {
    var pending = false;
    window.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      if (!pending) { pending = true; requestAnimationFrame(function () { drawGrid(); pending = false; }); }
    });
  }
  sizeCanvas();

  // ---------- nav ----------
  var navWrap = document.querySelector(".nav-wrap");
  var burger = document.getElementById("burger");
  var links = document.getElementById("links");
  window.addEventListener("scroll", function () { navWrap.classList.toggle("scrolled", window.scrollY > 10); }, { passive: true });

  function setMenu(open) {
    links.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  burger.addEventListener("click", function () { setMenu(!links.classList.contains("open")); });
  links.addEventListener("click", function (e) { if (e.target.tagName === "A") setMenu(false); });

  // active link while scrolling
  var anchors = Array.prototype.slice.call(links.querySelectorAll('a[href^="#"]'));
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        anchors.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id); });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    anchors.forEach(function (a) { var s = document.querySelector(a.getAttribute("href")); if (s) spy.observe(s); });

    // reveal on scroll
    var rv = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); rv.unobserve(en.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(function (el) { rv.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  // ---------- typing line ----------
  var typed = document.getElementById("typed");
  var phrases = ["database-driven web apps.", "PHP and CodeIgniter 4 back ends.", "MERN stack products.", "AI-powered tools."];
  if (reduce) {
    typed.textContent = phrases[0];
  } else {
    var pi = 0, ci = 0, del = false;
    (function tick() {
      var p = phrases[pi];
      typed.textContent = p.slice(0, ci);
      var wait = del ? 35 : 75;
      if (!del && ci === p.length) { del = true; wait = 1500; }
      else if (del && ci === 0) { del = false; pi = (pi + 1) % phrases.length; wait = 350; }
      else ci += del ? -1 : 1;
      setTimeout(tick, wait);
    })();
  }

  // ---------- project card tilt (mouse only) ----------
  if (!reduce && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".tilt").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = "perspective(900px) rotateX(" + (-y * 5) + "deg) rotateY(" + (x * 5) + "deg) translateY(-4px)";
      });
      card.addEventListener("mouseleave", function () { card.style.transform = ""; });
    });
  }

  // ---------- contact form ----------
  var form = document.getElementById("contactForm");
  var statusEl = document.getElementById("formStatus");
  var sendBtn = document.getElementById("sendBtn");
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setError(name, msg) {
    form.elements[name].closest(".field").classList.toggle("bad", !!msg);
    form.querySelector('.err[data-for="' + name + '"]').textContent = msg || "";
  }
  function validate() {
    var n = form.elements.name.value.trim(), e = form.elements.email.value.trim(), m = form.elements.message.value.trim();
    setError("name", n ? "" : "Enter your name.");
    setError("email", emailRe.test(e) ? "" : "Enter a valid email address, like name@example.com.");
    setError("message", m.length >= 10 ? "" : "Write at least 10 characters so I know how to help.");
    return !!n && emailRe.test(e) && m.length >= 10;
  }
  function show(msg, type) { statusEl.textContent = msg; statusEl.className = "form-status " + (type || ""); }

  function mailtoFallback(d) {
    window.location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(d.subject) +
      "&body=" + encodeURIComponent(d.message + "\n\nFrom: " + d.name + " (" + d.email + ")");
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    show("", "");
    if (!validate()) {
      var f = form.querySelector(".field.bad input, .field.bad textarea");
      if (f) f.focus();
      return;
    }
    if (form.elements._honey.value) return;

    var d = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      subject: form.elements.subject.value.trim() || "Portfolio message from " + form.elements.name.value.trim(),
      message: form.elements.message.value.trim()
    };
    sendBtn.disabled = true;
    sendBtn.textContent = "Sending...";

    fetch("https://formsubmit.co/ajax/" + EMAIL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ name: d.name, email: d.email, message: d.message, _subject: d.subject, _replyto: d.email, _template: "table", _captcha: "false" })
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, body: j }; }); })
      .then(function (res) {
        if (res.ok && String(res.body.success) === "true") {
          show("Message sent. Thank you, " + d.name + ". I'll reply to " + d.email + ".", "ok");
          form.reset();
        } else { throw new Error("send failed"); }
      })
      .catch(function () {
        show("The message could not be sent from this page. Your email app will open with the message filled in.", "fail");
        setTimeout(function () { mailtoFallback(d); }, 1200);
      })
      .then(function () { sendBtn.disabled = false; sendBtn.textContent = "Send message"; });
  });

  ["name", "email", "message"].forEach(function (n) {
    form.elements[n].addEventListener("input", function () { setError(n, ""); });
  });
})();
