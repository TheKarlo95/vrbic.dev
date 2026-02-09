/**
 * Scroll-triggered reveal animations via IntersectionObserver
 * Respects prefers-reduced-motion
 */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function revealElements() {
    var elements = document.querySelectorAll('.animate-fade-up');

    if (prefersReducedMotion) {
      // Show all immediately
      elements.forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Apply staggered delay for sibling elements
          var parent = entry.target.parentElement;
          if (parent) {
            var siblings = Array.from(parent.querySelectorAll(':scope > .animate-fade-up'));
            var index = siblings.indexOf(entry.target);
            if (index > 0) {
              entry.target.style.transitionDelay = (index * 80) + 'ms';
            }
          }

          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  window.animationsManager = {
    init: revealElements
  };
})();
