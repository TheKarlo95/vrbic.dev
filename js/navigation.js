/**
 * Navigation: mobile drawer, smooth scroll, active section tracking, header scroll behavior
 */
(function () {
  'use strict';

  var drawer, scrim, menuToggle, closeBtn, navLinks, header;
  var sections = [];
  var drawerLinks = [];
  var focusableElements = [];
  var lastFocusedElement = null;

  function openDrawer() {
    lastFocusedElement = document.activeElement;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    scrim.classList.add('active');
    scrim.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    // Focus the close button
    if (closeBtn) closeBtn.focus();

    // Trap focus
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

    // Restore focus
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  function escapeClose(e) {
    if (e.key === 'Escape') closeDrawer();
  }

  function trapFocus(e) {
    if (e.key !== 'Tab') return;

    focusableElements = drawer.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    var first = focusableElements[0];
    var last = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function updateActiveSection() {
    var scrollY = window.scrollY + 120;

    for (var i = sections.length - 1; i >= 0; i--) {
      var section = sections[i];
      if (section.offsetTop <= scrollY) {
        // Update desktop nav
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + section.id) {
            link.classList.add('active');
          }
        });
        // Update drawer nav
        drawerLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + section.id) {
            link.classList.add('active');
          }
        });
        break;
      }
    }
  }

  function updateHeaderElevation() {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
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

      // Drawer open/close
      if (menuToggle) menuToggle.addEventListener('click', openDrawer);
      if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
      if (scrim) scrim.addEventListener('click', closeDrawer);

      // Close drawer on link click
      drawerLinks.forEach(function (link) {
        link.addEventListener('click', function () {
          closeDrawer();
        });
      });

      // Back to top
      var backToTop = document.querySelector('.back-to-top');
      if (backToTop) {
        backToTop.addEventListener('click', function () {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }

      // Scroll events
      window.addEventListener('scroll', function () {
        updateActiveSection();
        updateHeaderElevation();
      }, { passive: true });

      // Initial state
      updateActiveSection();
      updateHeaderElevation();
    }
  };
})();
