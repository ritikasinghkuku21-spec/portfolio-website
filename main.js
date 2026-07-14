// Mobile nav toggle
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var list = document.querySelector('.primary-nav ul');
  if (!toggle || !list) return;

  toggle.addEventListener('click', function () {
    var isOpen = list.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
})();

// Accessible contact form handling
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var status = document.getElementById('form-status');

  function setFieldError(field, message) {
    var errorEl = document.getElementById(field.id + '-error');
    if (!errorEl) return;
    if (message) {
      errorEl.textContent = message;
      field.setAttribute('aria-invalid', 'true');
      field.setAttribute('aria-describedby',
        [field.getAttribute('data-hint-id'), errorEl.id].filter(Boolean).join(' ').trim());
    } else {
      errorEl.textContent = '';
      field.removeAttribute('aria-invalid');
      var hintId = field.getAttribute('data-hint-id');
      field.setAttribute('aria-describedby', hintId || '');
    }
  }

  function validateField(field) {
    if (field.hasAttribute('required') && !field.value.trim()) {
      setFieldError(field, 'This field is required.');
      return false;
    }
    if (field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
      setFieldError(field, 'Enter a valid email address.');
      return false;
    }
    setFieldError(field, '');
    return true;
  }

  Array.prototype.forEach.call(form.querySelectorAll('input, textarea'), function (field) {
    field.addEventListener('blur', function () { validateField(field); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var fields = form.querySelectorAll('input, textarea');
    var valid = true;
    var firstInvalid = null;

    Array.prototype.forEach.call(fields, function (field) {
      var fieldValid = validateField(field);
      if (!fieldValid) {
        valid = false;
        if (!firstInvalid) firstInvalid = field;
      }
    });

    if (!valid) {
      status.setAttribute('data-state', 'error');
      status.textContent = 'Please fix the highlighted fields before submitting.';
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    status.setAttribute('data-state', 'success');
    status.textContent = 'Thanks — your message looks good and is ready to send. (This is a static demo form; connect it to a backend or form service to send email.)';
    form.reset();
  });
})();
