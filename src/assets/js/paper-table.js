(function () {
  var tbody = document.getElementById('paper-tbody');
  if (!tbody || !window.PAPERS) return;

  var data = window.PAPERS;
  var sort = { col: 'year', dir: -1 };

  function render() {
    var rows = data.slice().sort(function (a, b) {
      var av = sort.col === 'tags' ? a.tags.join() : a[sort.col];
      var bv = sort.col === 'tags' ? b.tags.join() : b[sort.col];
      if (av < bv) return sort.dir; if (av > bv) return -sort.dir; return 0;
    });
    tbody.innerHTML = rows.map(function (p) {
      return '<tr>' +
        '<td><div class="pt-title">' + p.title + '</div></td>' +
        '<td class="pt-author">' + p.author + '</td>' +
        '<td class="pt-year">' + p.year + '</td>' +
        '<td class="pt-topic">' + p.topic + '</td>' +
        '<td class="pt-journal">' + p.journal + '</td>' +
        '<td class="pt-topic">' + p.country + '</td>' +
        '<td><div class="pt-tags">' + p.tags.map(function (t) { return '<span class="pt-tag">' + t + '</span>'; }).join('') + '</div></td>' +
        '</tr>';
    }).join('');
  }

  var countEl = document.getElementById('paper-count');
  if (countEl) countEl.textContent = data.length + ' entries';

  document.querySelectorAll('#paper-table th.sortable').forEach(function (th) {
    th.addEventListener('click', function () {
      var col = th.dataset.col;
      if (sort.col === col) { sort.dir *= -1; } else { sort.col = col; sort.dir = 1; }
      document.querySelectorAll('#paper-table th.sortable').forEach(function (h) {
        h.classList.remove('sorted');
        h.querySelector('.sort-arr').textContent = '↕';
      });
      th.classList.add('sorted');
      th.querySelector('.sort-arr').textContent = sort.dir === 1 ? '↑' : '↓';
      render();
    });
  });

  document.querySelector('#paper-table th[data-col="year"]').classList.add('sorted');
  render();
})();
