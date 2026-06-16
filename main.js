/* ═══════════════════════════════════════════════════════════
   MWX Digilabs IT Solutions — main.js
   - Navbar scroll state + mobile menu
   - Reveal-on-scroll animations
   - Section-aware active nav link
   - Contact form submission via Formspree (AJAX)
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Year stamp ────────────────────────────────────────────
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Navbar scroll + active link ──────────────────────────
  var navbar = document.getElementById('navbar');
  var navLinks = document.querySelectorAll('.nav-link');
  var sections = document.querySelectorAll('section[id]');

  function onScroll() {
    if (!navbar) return;
    if (window.scrollY > 24) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    var current = '';
    var scrollY = window.scrollY + 120;
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollY && sec.offsetTop + sec.offsetHeight > scrollY) {
        current = sec.id;
      }
    });
    if (current) {
      navLinks.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
      });
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Mobile burger ────────────────────────────────────────
  var burger = document.getElementById('navBurger');
  var menu = document.getElementById('navLinks');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.classList.toggle('active', open);
      burger.setAttribute('aria-expanded', String(open));
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── Reveal on scroll ─────────────────────────────────────
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  // ── Contact form → Formspree (AJAX, no email client) ─────
  var form = document.getElementById('contactForm');
  var statusEl = document.getElementById('formStatus');
  var submitBtn = document.getElementById('cfSubmit');

  function setStatus(message, kind) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.remove('success', 'error');
    if (kind) statusEl.classList.add(kind);
    statusEl.classList.add('visible');
  }

  function setLoading(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    var labelEl = submitBtn.querySelector('.btn-label');
    if (labelEl) labelEl.textContent = loading ? 'Sending…' : 'Send Inquiry';
  }

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Basic native validation
      if (!form.checkValidity()) {
        setStatus('Please fill in your name, email, and message.', 'error');
        form.reportValidity();
        return;
      }

      setLoading(true);
      setStatus('Sending your inquiry…', null);

      var endpoint = form.getAttribute('action');
      var formData = new FormData(form);

      try {
        var res = await fetch(endpoint, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          setStatus('Thanks! Your inquiry has been sent. We\u2019ll get back to you at the email you provided.', 'success');
          form.reset();
        } else {
          var data = await res.json().catch(function () { return null; });
          var msg = 'We couldn\u2019t send your message. Please try again, or email support@mwxdigilabs.com directly.';
          if (data && data.errors && data.errors.length) {
            msg = data.errors.map(function (er) { return er.message; }).join(' ');
          }
          setStatus(msg, 'error');
        }
      } catch (err) {
        setStatus('Network issue \u2014 please check your connection and try again, or email support@mwxdigilabs.com directly.', 'error');
      } finally {
        setLoading(false);
      }
    });
  }
})();
