/**
 * Main initialization - orchestrates all modules
 */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  if (window.themeManager) window.themeManager.init();
  if (window.navigationManager) window.navigationManager.init();
  if (window.animationsManager) window.animationsManager.init();
  if (window.contactManager) window.contactManager.init();
});
