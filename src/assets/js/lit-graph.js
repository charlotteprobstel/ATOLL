(function () {
  var canvas = document.getElementById('lit-graph-canvas');
  var tip = document.getElementById('graph-tooltip');
  if (!canvas || !window.PAPERS) return;
  var ctx = canvas.getContext('2d');
  var container = canvas.parentElement;

  var papers = window.PAPERS.map(function (p, i) {
    return {
      id: i,
      title: p.title,
      meta: p.author + ' · ' + p.journal + ' · ' + p.year,
      tags: p.tags,
    };
  });

  var links = [];
  for (var i = 0; i < papers.length; i++) {
    for (var j = i + 1; j < papers.length; j++) {
      var shared = papers[i].tags.filter(function (t) { return papers[j].tags.indexOf(t) >= 0; });
      if (shared.length) links.push({ s: i, t: j, w: shared.length });
    }
  }

  function resize() {
    var W = container.offsetWidth, H = 480;
    var dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);
    return { W: W, H: H };
  }

  var dim = resize();
  var W = dim.W, H = dim.H;

  var nodes = papers.map(function (p, i) {
    var angle = (i / papers.length) * Math.PI * 2;
    var r = Math.min(W, H) * 0.3;
    return {
      id: p.id, title: p.title, meta: p.meta, tags: p.tags,
      x: W / 2 + r * Math.cos(angle) + (Math.random() - 0.5) * 40,
      y: H / 2 + r * Math.sin(angle) + (Math.random() - 0.5) * 40,
      vx: 0, vy: 0,
      r: 11 + p.tags.length * 3.5,
    };
  });

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function tick() {
    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var dx = nodes[j].x - nodes[i].x, dy = nodes[j].y - nodes[i].y;
        var d = Math.sqrt(dx * dx + dy * dy) || 1;
        var f = 2200 / (d * d);
        nodes[i].vx -= f * dx / d; nodes[i].vy -= f * dy / d;
        nodes[j].vx += f * dx / d; nodes[j].vy += f * dy / d;
      }
    }
    for (var k = 0; k < links.length; k++) {
      var a = nodes[links[k].s], b = nodes[links[k].t];
      var dx = b.x - a.x, dy = b.y - a.y;
      var d = Math.sqrt(dx * dx + dy * dy) || 1;
      var tgt = 130, f = (d - tgt) * 0.028 * links[k].w;
      a.vx += f * dx / d; a.vy += f * dy / d;
      b.vx -= f * dx / d; b.vy -= f * dy / d;
    }
    for (var n = 0; n < nodes.length; n++) {
      nodes[n].vx += (W / 2 - nodes[n].x) * 0.008;
      nodes[n].vy += (H / 2 - nodes[n].y) * 0.008;
      nodes[n].vx *= 0.85; nodes[n].vy *= 0.85;
      nodes[n].x += nodes[n].vx; nodes[n].y += nodes[n].vy;
      nodes[n].x = Math.max(nodes[n].r + 6, Math.min(W - nodes[n].r - 6, nodes[n].x));
      nodes[n].y = Math.max(nodes[n].r + 6, Math.min(H - nodes[n].r - 6, nodes[n].y));
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    var accent = cssVar('--accent') || '#6E4C63';
    var ink = cssVar('--ink') || '#22302A';

    for (var k = 0; k < links.length; k++) {
      var a = nodes[links[k].s], b = nodes[links[k].t];
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = accent + '44';
      ctx.lineWidth = links[k].w;
      ctx.stroke();
    }
    for (var n = 0; n < nodes.length; n++) {
      var nd = nodes[n];
      ctx.beginPath(); ctx.arc(nd.x, nd.y, nd.r, 0, Math.PI * 2);
      ctx.fillStyle = accent + '1A'; ctx.fill();
      ctx.strokeStyle = accent; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = ink;
      ctx.font = 'italic 500 ' + Math.max(8, nd.r * 0.5) + 'px Fraunces, serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      var words = nd.title.split(' ');
      ctx.fillText(words.slice(0, 2).join(' '), nd.x, nd.y - (nd.r > 16 ? 0.5 : 0));
      if (nd.r > 14 && words.length > 2) {
        ctx.font = '500 ' + Math.max(7, nd.r * 0.42) + 'px Inter,sans-serif';
        ctx.fillText(words.slice(2, 4).join(' '), nd.x, nd.y + nd.r * 0.55);
      }
    }
  }

  var frame = 0;
  function loop() {
    tick(); draw(); frame++;
    if (frame < 280) requestAnimationFrame(loop);
    else setTimeout(function () { frame = 265; requestAnimationFrame(loop); }, 60);
  }
  loop();

  canvas.addEventListener('mousemove', function (e) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left, y = e.clientY - rect.top;
    var hit = null;
    for (var n = 0; n < nodes.length; n++) {
      if (Math.hypot(x - nodes[n].x, y - nodes[n].y) < nodes[n].r + 4) { hit = nodes[n]; break; }
    }
    if (hit) {
      tip.innerHTML = '<div class="gtt-title">' + hit.title + '</div><div class="gtt-meta">' + hit.meta + '</div><div class="gtt-tags">' + hit.tags.map(function (t) { return '<span class="gtt-tag">' + t + '</span>'; }).join('') + '</div>';
      tip.classList.add('visible');
      var tx = x + 16, ty = y - 14;
      if (tx + 240 > W) tx = x - 256;
      if (ty < 0) ty = 4;
      tip.style.left = tx + 'px'; tip.style.top = ty + 'px';
      canvas.style.cursor = 'pointer';
    } else {
      tip.classList.remove('visible');
      canvas.style.cursor = 'grab';
    }
  });
  canvas.addEventListener('mouseleave', function () { tip.classList.remove('visible'); });

  var dragging = null, ox = 0, oy = 0;
  canvas.addEventListener('mousedown', function (e) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left, y = e.clientY - rect.top;
    for (var n = 0; n < nodes.length; n++) {
      if (Math.hypot(x - nodes[n].x, y - nodes[n].y) < nodes[n].r + 4) {
        dragging = nodes[n]; ox = x - nodes[n].x; oy = y - nodes[n].y; break;
      }
    }
  });
  canvas.addEventListener('mousemove', function (e) {
    if (!dragging) return;
    var rect = canvas.getBoundingClientRect();
    dragging.x = e.clientX - rect.left - ox;
    dragging.y = e.clientY - rect.top - oy;
    dragging.vx = 0; dragging.vy = 0;
  });
  canvas.addEventListener('mouseup', function () { dragging = null; });

  var obs = new MutationObserver(function () { draw(); });
  obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
})();
