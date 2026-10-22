(function () {
  var mapRoot = document.getElementById('charity-map');
  var svgElement = document.getElementById('charity-map-svg');
  var popup = document.getElementById('charity-map-popup');

  if (!mapRoot || !svgElement || !popup || typeof d3 === 'undefined') {
    return;
  }

  var countryAliases = {
    'United States of America': 'us',
    'United States': 'us',
    USA: 'us',
    Canada: 'canada',
    'United Kingdom': 'uk',
    England: 'uk',
    Scotland: 'uk',
    Wales: 'uk',
    'Northern Ireland': 'uk',
    Britain: 'uk',
    Ireland: 'ireland',
    Australia: 'australia',
  };

  var panelMap = {};
  mapRoot.querySelectorAll('[data-country-panel]').forEach(function (panel) {
    panelMap[panel.dataset.countryPanel] = panel.innerHTML;
  });

  var svg = d3.select(svgElement);
  var width = 920;
  var height = 460;

  svg
    .append('ellipse')
    .attr('class', 'map-ocean')
    .attr('cx', width / 2)
    .attr('cy', height / 2)
    .attr('rx', 430)
    .attr('ry', 200);

  fetch('/assets/data/world.geojson')
    .then(function (res) { return res.json(); })
    .then(function (geojson) {
      var projection = d3.geoNaturalEarth1().fitExtent([[28, 30], [892, 430]], geojson);
      var path = d3.geoPath(projection);

      svg
        .append('g')
        .selectAll('path')
        .data(geojson.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('class', function (d) {
          var countryId = countryAliases[d.properties.name];
          return countryId ? 'map-country map-country--active' : 'map-country map-country--inactive';
        })
        .attr('data-country', function (d) {
          return countryAliases[d.properties.name] || null;
        })
        .attr('tabindex', function (d) {
          return countryAliases[d.properties.name] ? '0' : null;
        })
        .attr('aria-label', function (d) {
          return d.properties.name || 'country';
        });

      var updatePopup = function (countryId) {
        if (panelMap[countryId]) {
          popup.innerHTML = panelMap[countryId];
        }
      };

      mapRoot.querySelectorAll('.map-country--active[data-country]').forEach(function (countryEl) {
        countryEl.addEventListener('mouseenter', function () {
          updatePopup(countryEl.dataset.country);
        });

        countryEl.addEventListener('focus', function () {
          updatePopup(countryEl.dataset.country);
        });
      });
    })
    .catch(function () {
      popup.innerHTML = '<div class="charity-map-popup-title">Map unavailable</div><p class="charity-map-popup-note">Could not load world map data.</p>';
    });
})();
