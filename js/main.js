(function () {
  var D = window.HALDEN, $ = function (s) { return document.querySelector(s); };
  var PAGES = [['index.html', 'Home'], ['projects.html', 'Projects'], ['studio.html', 'Studio'], ['contact.html', 'Contact']];
  var here = location.pathname.split('/').pop() || 'index.html';

  /* ---------- Shared header and footer ---------- */
  var links = PAGES.map(function (p) { return '<a href="' + p[0] + '"' + (p[0] === here ? ' aria-current="page"' : '') + '>' + p[1] + '</a>'; }).join('');
  var logo = '<svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><path d="M2 24V8l11-6 11 6v16M9 24V13h8v11" fill="none" stroke="currentColor" stroke-width="2.4"/></svg>Halden';
  var hd = $('[data-header]');
  hd.className = 'top';
  hd.innerHTML = '<div class="wrap bar"><a class="logo" href="index.html" aria-label="Halden home">' + logo + '</a><nav id="nav" aria-label="Main">' + links +
    '</nav><button class="tg" id="tg" type="button" aria-label="Change colour theme"></button><a class="btn sm" href="contact.html">Start a project</a>' +
    '<button class="menu" id="mb" type="button" aria-expanded="false">Menu</button></div>';
  $('[data-footer]').innerHTML = '<div class="wrap"><div class="fg"><div><a class="logo" href="index.html" style="padding:0">' + logo + '</a><p style="color:var(--muted);max-width:34ch">An independent architecture studio designing housing, culture, workplaces and schools.</p></div>' +
    '<div><h4>Pages</h4>' + links.replace(' aria-current="page"', '') + '</div><div><h4>Contact</h4><a href="contact.html">studio@halden.example</a><a href="contact.html">+00 123 456 789</a></div></div>' +
    '<div class="copy">© ' + new Date().getFullYear() + ' Halden Architects. Fictional studio and projects, created as a design example.</div></div>';
  $('#mb').onclick = function () { var o = hd.classList.toggle('open'); this.setAttribute('aria-expanded', o); };

  /* ---------- Theme ---------- */
  var root = document.documentElement, tg = $('#tg');
  function dark() { var t = root.getAttribute('data-theme'); return t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches; }
  function lab() { tg.textContent = dark() ? 'Light' : 'Dark'; }
  try { var sv = localStorage.getItem('hd-theme'); if (sv) root.setAttribute('data-theme', sv); } catch (e) {}
  tg.onclick = function () { var n = dark() ? 'light' : 'dark'; root.setAttribute('data-theme', n); try { localStorage.setItem('hd-theme', n); } catch (e) {} lab(); };
  lab();

  /* ---------- Generative elevation drawings ---------- */
  function rng(s) { s = s * 9301 + 49297; return function () { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
  function art(seed, animate) {
    var r = rng(seed), g = 252, x = 36 + r() * 24, d = 0, out = [], door = Math.floor(r() * 3), n = 0;
    function p(dstr) { out.push('<path class="' + (animate ? 'ln' : '') + '" pathLength="1" style="--d:' + (d++) + '" d="' + dstr + '"/>'); }
    while (x < 300 && n < 3) {
      var w = 70 + r() * 90, h = 70 + r() * 130, roof = Math.floor(r() * 3), t = g - h;
      p('M' + x + ' ' + g + 'V' + t + 'H' + (x + w) + 'V' + g);
      if (roof === 1) p('M' + x + ' ' + t + 'L' + (x + w) + ' ' + (t - 22));
      if (roof === 2) p('M' + x + ' ' + t + 'L' + (x + w / 2) + ' ' + (t - 30) + 'L' + (x + w) + ' ' + t);
      var cols = 2 + Math.floor(r() * 3), rows = Math.max(1, Math.floor((h - 40) / 38)), cw = w / cols;
      for (var i = 0; i < cols; i++) for (var j = 0; j < rows; j++) {
        var wx = x + i * cw + cw * .25, wy = t + 16 + j * 38;
        p('M' + wx + ' ' + wy + 'h' + cw * .5 + 'v22h-' + cw * .5 + 'z');
      }
      if (n === door) out.push('<rect class="ac" x="' + (x + w / 2 - 9) + '" y="' + (g - 34) + '" width="18" height="34"/>');
      x += w + 8 + r() * 24; n++;
    }
    p('M10 ' + g + 'H390');
    return '<svg viewBox="0 0 400 290" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" role="img" aria-label="Elevation drawing">' + out.join('') + '</svg>';
  }
  function card(pr) {
    return '<button class="card" type="button" data-id="' + pr.id + '"><div class="thumb paper">' + art(pr.seed) + '</div><div class="cap"><b>' + pr.name + '</b><span>' + pr.type + ', ' + pr.year + '</span></div></button>';
  }

  /* ---------- Home ---------- */
  if ($('#heroart')) { $('#heroart').innerHTML = art(7, true); }
  if ($('#featured')) { $('#featured').innerHTML = D.projects.slice(0, 3).map(card).join(''); }

  /* ---------- Projects: filter and detail dialog ---------- */
  var grid = $('#grid');
  if (grid) {
    var types = ['All'].concat(D.projects.map(function (p) { return p.type; }).filter(function (v, i, a) { return a.indexOf(v) === i; }));
    $('#filters').innerHTML = types.map(function (t, i) { return '<button type="button" aria-pressed="' + (i === 0) + '">' + t + '</button>'; }).join('');
    function show(f) {
      grid.innerHTML = D.projects.filter(function (p) { return f === 'All' || p.type === f; }).map(card).join('');
    }
    show('All');
    $('#filters').onclick = function (e) {
      if (e.target.tagName !== 'BUTTON') return;
      Array.prototype.forEach.call(this.children, function (b) { b.setAttribute('aria-pressed', b === e.target); });
      show(e.target.textContent);
    };
  }
  var dlg = $('#dlg');
  document.addEventListener('click', function (e) {
    var c = e.target.closest && e.target.closest('.card');
    if (c && dlg) {
      var pr = D.projects.filter(function (p) { return p.id === c.getAttribute('data-id'); })[0];
      dlg.innerHTML = '<div class="dg"><div class="thumb paper">' + art(pr.seed, true) + '</div><div class="in"><button class="btn ghost sm x" type="button" id="dx">Close</button><h3>' + pr.name +
        '</h3><p style="color:var(--muted);margin:0">' + pr.desc + '</p><dl><dt>Type</dt><dd>' + pr.type + '</dd><dt>Place</dt><dd>' + pr.place + '</dd><dt>Year</dt><dd>' + pr.year + '</dd><dt>Area</dt><dd>' + pr.area + '</dd></dl><a class="btn" href="contact.html">Discuss a similar project</a></div></div>';
      dlg.showModal(); $('#dx').onclick = function () { dlg.close(); };
    } else if (e.target === dlg) { dlg.close(); }
  });

  /* ---------- Studio ---------- */
  if ($('#team')) {
    $('#team').innerHTML = D.team.map(function (m) {
      return '<div><div class="mono" aria-hidden="true">' + m[0].split(' ').map(function (w) { return w[0]; }).join('') + '</div><b>' + m[0] + '</b><span>' + m[1] + '</span></div>';
    }).join('');
  }

  /* ---------- Contact form (demo, nothing is sent) ---------- */
  var f = $('#cf');
  if (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var n = $('#cn').value.trim(), m = $('#ce').value.trim(), t = $('#cm').value.trim(), er = $('#er');
      if (!n) { er.textContent = 'Enter your name.'; $('#cn').focus(); return; }
      if (!/^\S+@\S+\.\S+$/.test(m)) { er.textContent = 'Enter a valid email address, like you@example.com.'; $('#ce').focus(); return; }
      if (t.length < 20) { er.textContent = 'Tell us a little more about the project (at least 20 characters).'; $('#cm').focus(); return; }
      f.outerHTML = '<div class="ok" role="status"><h3>Thank you, ' + n.replace(/</g, '&lt;') + '.</h3><p style="margin:0;color:var(--muted)">We’ll reply within two working days. This is a demo form, so nothing was actually sent.</p></div>';
    });
  }
})();
