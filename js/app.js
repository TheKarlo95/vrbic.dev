/* ============================================
   Combined JavaScript - vrbic.dev
   Order: Theme → Navigation → Animations → Contact → Init
   ============================================ */

/* ==================== THEME ==================== */
(function () {
  'use strict';
  var SCHEMES = ['green', 'blue', 'purple'];
  var SCHEME_LABELS = { green: 'Green', blue: 'Blue', purple: 'Purple' };
  var STORAGE_THEME = 'theme';
  var STORAGE_SCHEME = 'color-scheme';

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function getStoredTheme() { return localStorage.getItem(STORAGE_THEME); }
  function getStoredScheme() { return localStorage.getItem(STORAGE_SCHEME); }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_THEME, theme);
    updateThemeIcon(theme);
  }
  function applyScheme(scheme) {
    document.documentElement.setAttribute('data-scheme', scheme);
    localStorage.setItem(STORAGE_SCHEME, scheme);
    updateSchemeButton(scheme);
  }
  function updateThemeIcon(theme) {
    var toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    var icon = toggle.querySelector('.material-symbols-outlined');
    if (icon) icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
    toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
  function updateSchemeButton(scheme) {
    var toggle = document.getElementById('scheme-toggle');
    if (!toggle) return;
    toggle.setAttribute('aria-label', 'Color scheme: ' + SCHEME_LABELS[scheme] + '. Click to change.');
    toggle.setAttribute('title', 'Color: ' + SCHEME_LABELS[scheme]);
  }
  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }
  function cycleScheme() {
    var current = document.documentElement.getAttribute('data-scheme') || 'green';
    var idx = SCHEMES.indexOf(current);
    applyScheme(SCHEMES[(idx + 1) % SCHEMES.length]);
  }

  window.themeManager = {
    init: function () {
      applyTheme(getStoredTheme() || getSystemTheme());
      applyScheme(getStoredScheme() || 'green');
      var themeToggle = document.getElementById('theme-toggle');
      if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
      var schemeToggle = document.getElementById('scheme-toggle');
      if (schemeToggle) schemeToggle.addEventListener('click', cycleScheme);
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        if (!getStoredTheme()) applyTheme(e.matches ? 'dark' : 'light');
      });
    }
  };
})();

/* ==================== NAVIGATION ==================== */
(function () {
  'use strict';
  var drawer, scrim, menuToggle, closeBtn, navLinks, header;
  var sections = [], drawerLinks = [], lastFocusedElement = null;
  var currentSectionId = null;

  function openDrawer() {
    lastFocusedElement = document.activeElement;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    scrim.classList.add('active');
    scrim.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
    document.addEventListener('keydown', trapFocus);
    document.addEventListener('keydown', escapeClose);
  }
  function closeDrawer() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    scrim.classList.remove('active');
    scrim.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', trapFocus);
    document.removeEventListener('keydown', escapeClose);
    if (lastFocusedElement) lastFocusedElement.focus();
  }
  function escapeClose(e) { if (e.key === 'Escape') closeDrawer(); }
  function trapFocus(e) {
    if (e.key !== 'Tab') return;
    var els = drawer.querySelectorAll('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])');
    if (!els.length) return;
    var first = els[0], last = els[els.length - 1];
    if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
    else { if (document.activeElement === last) { e.preventDefault(); first.focus(); } }
  }
  function setActiveSection(id) {
    if (id === currentSectionId) return;
    currentSectionId = id;
    var href = '#' + id;
    navLinks.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === href); });
    drawerLinks.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === href); });
  }
  function updateHeaderElevation() {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }

  window.navigationManager = {
    init: function () {
      drawer = document.getElementById('mobile-nav');
      scrim = document.getElementById('nav-scrim');
      menuToggle = document.querySelector('.mobile-nav-toggle');
      closeBtn = document.querySelector('.nav-drawer__close');
      header = document.querySelector('.top-app-bar');
      navLinks = document.querySelectorAll('.top-app-bar__nav-links .nav-link');
      drawerLinks = document.querySelectorAll('.nav-drawer__link');
      sections = Array.from(document.querySelectorAll('main > section'));
      if (menuToggle) menuToggle.addEventListener('click', openDrawer);
      if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
      if (scrim) scrim.addEventListener('click', closeDrawer);
      drawerLinks.forEach(function (link) { link.addEventListener('click', closeDrawer); });
      var backToTop = document.querySelector('.back-to-top');
      if (backToTop) backToTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

      // Use IntersectionObserver for active section tracking (no layout reads on scroll)
      var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      }, { rootMargin: '-80px 0px -60% 0px', threshold: 0 });
      sections.forEach(function (s) { sectionObserver.observe(s); });

      // Header elevation only reads scrollY (no layout property), safe on scroll
      window.addEventListener('scroll', updateHeaderElevation, { passive: true });
      requestAnimationFrame(updateHeaderElevation);
    }
  };
})();

/* ==================== ANIMATIONS ==================== */
(function () {
  'use strict';
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.animationsManager = {
    init: function () {
      var elements = document.querySelectorAll('.animate-fade-up');
      if (prefersReducedMotion) {
        elements.forEach(function (el) { el.classList.add('visible'); });
        return;
      }
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var parent = entry.target.parentElement;
            if (parent) {
              var siblings = Array.from(parent.querySelectorAll(':scope > .animate-fade-up'));
              var index = siblings.indexOf(entry.target);
              if (index > 0) entry.target.style.transitionDelay = (index * 80) + 'ms';
            }
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
      elements.forEach(function (el) { observer.observe(el); });
    }
  };
})();

/* ==================== CONTACT ==================== */
(function () {
  'use strict';
  var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var TARGET_EMAIL = 'vrbic.karlo@gmail.com';

  function validateField(input) {
    var parent = input.closest('.md-text-field');
    var errorEl = parent.querySelector('.field-error');
    var value = input.value.trim();
    var error = '';
    if (input.required && !value) error = 'This field is required.';
    else if (input.type === 'email' && value && !EMAIL_REGEX.test(value)) error = 'Please enter a valid email address.';
    else if (input.name === 'name' && value && value.length < 2) error = 'Name must be at least 2 characters.';
    else if (input.name === 'message' && value && value.length < 10) error = 'Message must be at least 10 characters.';
    if (error) { parent.classList.add('error'); errorEl.textContent = error; return false; }
    parent.classList.remove('error'); errorEl.textContent = ''; return true;
  }
  function validateForm(form) {
    var valid = true;
    form.querySelectorAll('input, textarea').forEach(function (input) { if (!validateField(input)) valid = false; });
    return valid;
  }
  function buildMailto(data) {
    return 'mailto:' + TARGET_EMAIL + '?subject=' + encodeURIComponent(data.subject || 'Contact from website') +
      '&body=' + encodeURIComponent('Hi Karlo,\n\n' + data.message + '\n\n---\nFrom: ' + data.name + '\nEmail: ' + data.email);
  }

  window.contactManager = {
    init: function () {
      var form = document.getElementById('contact-form');
      if (!form) return;
      form.querySelectorAll('input, textarea').forEach(function (input) {
        input.addEventListener('blur', function () { if (input.value.trim()) validateField(input); });
        input.addEventListener('input', function () { if (input.closest('.md-text-field').classList.contains('error')) validateField(input); });
      });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validateForm(form)) return;
        window.location.href = buildMailto({
          name: form.querySelector('#contact-name').value.trim(),
          email: form.querySelector('#contact-email').value.trim(),
          subject: form.querySelector('#contact-subject').value.trim(),
          message: form.querySelector('#contact-message').value.trim()
        });
      });
    }
  };
})();

/* ==================== INIT ==================== */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';
  // Theme init runs first (changes data attributes, no layout reads)
  if (window.themeManager) window.themeManager.init();
  // Defer modules that read layout to next frame, after styles settle
  requestAnimationFrame(function () {
    if (window.navigationManager) window.navigationManager.init();
    if (window.animationsManager) window.animationsManager.init();
    if (window.contactManager) window.contactManager.init();
  });
});
