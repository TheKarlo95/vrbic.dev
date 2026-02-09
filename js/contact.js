/**
 * Contact form: client-side validation + mailto: link construction
 */
(function () {
  'use strict';

  var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var TARGET_EMAIL = 'vrbic.karlo@gmail.com';

  function validateField(input) {
    var parent = input.closest('.md-text-field');
    var errorEl = parent.querySelector('.field-error');
    var value = input.value.trim();
    var error = '';

    if (input.required && !value) {
      error = 'This field is required.';
    } else if (input.type === 'email' && value && !EMAIL_REGEX.test(value)) {
      error = 'Please enter a valid email address.';
    } else if (input.name === 'name' && value && value.length < 2) {
      error = 'Name must be at least 2 characters.';
    } else if (input.name === 'message' && value && value.length < 10) {
      error = 'Message must be at least 10 characters.';
    }

    if (error) {
      parent.classList.add('error');
      errorEl.textContent = error;
      return false;
    } else {
      parent.classList.remove('error');
      errorEl.textContent = '';
      return true;
    }
  }

  function validateForm(form) {
    var inputs = form.querySelectorAll('input, textarea');
    var valid = true;
    inputs.forEach(function (input) {
      if (!validateField(input)) valid = false;
    });
    return valid;
  }

  function buildMailto(data) {
    var subject = encodeURIComponent(data.subject || 'Contact from website');
    var body = encodeURIComponent(
      'Hi Karlo,\n\n' +
      data.message + '\n\n' +
      '---\n' +
      'From: ' + data.name + '\n' +
      'Email: ' + data.email
    );
    return 'mailto:' + TARGET_EMAIL + '?subject=' + subject + '&body=' + body;
  }

  window.contactManager = {
    init: function () {
      var form = document.getElementById('contact-form');
      if (!form) return;

      // Real-time validation on blur
      var inputs = form.querySelectorAll('input, textarea');
      inputs.forEach(function (input) {
        input.addEventListener('blur', function () {
          if (input.value.trim()) validateField(input);
        });
        // Clear error on input
        input.addEventListener('input', function () {
          var parent = input.closest('.md-text-field');
          if (parent.classList.contains('error')) {
            validateField(input);
          }
        });
      });

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!validateForm(form)) return;

        var data = {
          name: form.querySelector('#contact-name').value.trim(),
          email: form.querySelector('#contact-email').value.trim(),
          subject: form.querySelector('#contact-subject').value.trim(),
          message: form.querySelector('#contact-message').value.trim()
        };

        window.location.href = buildMailto(data);
      });
    }
  };
})();
