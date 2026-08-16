(function () {
  if (localStorage.getItem('atoll-fluor')) {
    document.body.classList.add('fluorescent');
  }

  var fluorBtn = document.getElementById('fluor-toggle');
  if (fluorBtn) {
    fluorBtn.addEventListener('click', function () {
      var on = document.body.classList.toggle('fluorescent');
      localStorage.setItem('atoll-fluor', on ? '1' : '');
    });
  }

  var widgetBtn = document.getElementById('widget-btn');
  var widgetPanel = document.getElementById('widget-panel');
  if (widgetBtn && widgetPanel) {
    widgetBtn.addEventListener('click', function () {
      widgetPanel.classList.toggle('open');
    });
  }

  document.querySelectorAll('.wtab').forEach(function (tabBtn) {
    tabBtn.addEventListener('click', function () {
      var tab = tabBtn.dataset.tab;
      document.querySelectorAll('.wtab').forEach(function (t) { t.classList.remove('active'); });
      document.querySelectorAll('.widget-tab-body').forEach(function (t) { t.style.display = 'none'; });
      tabBtn.classList.add('active');
      document.getElementById('wtab-' + tab).style.display = 'block';
    });
  });

  var form = document.getElementById('feedback-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var formId = form.dataset.formspreeId;
      var successEl = document.getElementById('feedback-success');
      var errorEl = document.getElementById('feedback-error');
      var submitBtn = form.querySelector('.widget-submit');

      errorEl.style.display = 'none';
      errorEl.textContent = '';

      if (!formId) {
        console.warn('ATOLL: no Formspree ID configured (src/_data/site.json → formspreeId). The message below was not actually sent anywhere.');
        form.style.display = 'none';
        successEl.style.display = 'block';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      fetch('https://formspree.io/f/' + formId, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed');
          form.style.display = 'none';
          successEl.style.display = 'block';
        })
        .catch(function () {
          errorEl.textContent = 'Something went wrong sending that — please try again in a moment.';
          errorEl.style.display = 'block';
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send feedback →';
        });
    });
  }
})();
