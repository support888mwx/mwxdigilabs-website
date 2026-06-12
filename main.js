/* MWX Digilabs IT Solutions — site interactions */
(function () {
  'use strict';

  /* ── Sticky nav state ───────────────────────────── */
  var navbar = document.getElementById('navbar');
  var onScroll = function () {
    if (window.scrollY > 24) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile menu ────────────────────────────────── */
  var burger = document.getElementById('navBurger');
  var links = document.getElementById('navLinks');
  burger.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    burger.classList.toggle('active', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      links.classList.remove('open');
      burger.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ── Active link highlighting ───────────────────── */
  var sections = ['home', 'services', 'projects', 'process', 'about', 'contact'];
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navAnchors.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });

  /* ── Scroll reveal animations ───────────────────── */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(function (el, i) {
    el.style.transitionDelay = Math.min(i % 4 * 80, 240) + 'ms';
    revealObserver.observe(el);
  });

  /* ── Contact form (static site: mailto handoff) ─── */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('cf-name').value.trim();
    var email = document.getElementById('cf-email').value.trim();
    var type = document.getElementById('cf-type').value;
    var message = document.getElementById('cf-message').value.trim();

    if (!name || !email || !message) {
      status.textContent = 'Please fill in your name, email, and message.';
      status.className = 'form-status error';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.textContent = 'Please enter a valid email address.';
      status.className = 'form-status error';
      return;
    }

    var subject = 'Project Inquiry — ' + (type || 'General') + ' — ' + name;
    var body = 'Name: ' + name + '\nEmail: ' + email + '\nProject Type: ' + (type || 'Not specified') + '\n\nMessage:\n' + message;
    window.location.href = 'mailto:hello@mwxdigilabs.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

    status.textContent = 'Opening your email app… If nothing happens, email us directly at hello@mwxdigilabs.com.';
    status.className = 'form-status success';
    form.reset();
  });

  /* ── Footer year ────────────────────────────────── */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
