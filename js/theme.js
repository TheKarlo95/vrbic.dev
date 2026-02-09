/**
 * Theme management: light/dark toggle + color scheme cycling (green/blue/purple)
 */
(function () {
  'use strict';

  var SCHEMES = ['green', 'blue', 'purple'];
  var SCHEME_LABELS = { green: 'Green', blue: 'Blue', purple: 'Purple' };
  var STORAGE_THEME = 'theme';
  var STORAGE_SCHEME = 'color-scheme';

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function getStoredTheme() {
    return localStorage.getItem(STORAGE_THEME);
  }

  function getStoredScheme() {
    return localStorage.getItem(STORAGE_SCHEME);
  }

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
    if (icon) {
      icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
    }
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
    var next = SCHEMES[(idx + 1) % SCHEMES.length];
    applyScheme(next);
  }

  // Public API
  window.themeManager = {
    init: function () {
      var theme = getStoredTheme() || getSystemTheme();
      var scheme = getStoredScheme() || 'green';

      applyTheme(theme);
      applyScheme(scheme);

      var themeToggle = document.getElementById('theme-toggle');
      if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
      }

      var schemeToggle = document.getElementById('scheme-toggle');
      if (schemeToggle) {
        schemeToggle.addEventListener('click', cycleScheme);
      }

      // Listen for system theme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        if (!getStoredTheme()) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  };
})();
