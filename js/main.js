/* Patitas Felices · interacciones: animaciones de entrada, menú móvil,
   calculadora de vacunas y botón para copiar el número. */
(function () {
  document.documentElement.classList.add('js');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* entrances */
  var rises = [].slice.call(document.querySelectorAll('.rise'));
  rises.forEach(function (el) { if (el.getBoundingClientRect().top < innerHeight) el.classList.add('in'); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    rises.forEach(function (el) { if (!el.classList.contains('in')) io.observe(el); });
  }
  setTimeout(function () { rises.forEach(function (el) { el.classList.add('in'); }); }, 2500);

  /* mobile menu */
  var top = document.getElementById('top'), mb = document.getElementById('menuBtn');
  mb.addEventListener('click', function () { var o = top.classList.toggle('is-open'); mb.setAttribute('aria-expanded', o); });
  [].forEach.call(document.querySelectorAll('#nav a'), function (a) { a.addEventListener('click', function () { top.classList.remove('is-open'); mb.setAttribute('aria-expanded', 'false'); }); });

  /* vaccine calculator */
  var VAC = { perro: ['Antirrábica', 'Séxtuple canina', 'Óctuple canina', 'Bordetella'], gato: ['Antirrábica', 'Triple felina', 'Leucemia felina'], conejo: ['Mixomatosis'] };
  var MES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','setiembre','octubre','noviembre','diciembre'];
  var sel = document.getElementById('vacuna'), fecha = document.getElementById('fecha'), box = document.getElementById('result');
  var rDate = document.getElementById('r-date'), rLeft = document.getElementById('r-left');
  function sp() { return document.querySelector('input[name="sp"]:checked').value; }
  function fill() {
    var cur = sel.value; sel.innerHTML = '';
    VAC[sp()].forEach(function (v) { var o = document.createElement('option'); o.textContent = v; sel.appendChild(o); });
    if (VAC[sp()].indexOf(cur) > -1) sel.value = cur;
    calc();
  }
  function calc() {
    var v = fecha.value;
    box.classList.remove('is-late', 'is-soon');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) { rDate.textContent = 'Elige una fecha'; rLeft.textContent = ''; return; }
    var p = v.split('-').map(Number);
    var due = new Date(p[0] + 1, p[1] - 1, p[2]); if (due.getMonth() !== p[1] - 1) due = new Date(p[0] + 1, p[1], 0);
    var t = new Date(); t.setHours(0, 0, 0, 0);
    var days = Math.round((due - t) / 86400000);
    rDate.textContent = due.getDate() + ' de ' + MES[due.getMonth()] + ' de ' + due.getFullYear();
    if (days < 0) { box.classList.add('is-late'); rLeft.textContent = 'Se pasó hace ' + (-days) + ' días: conviene aplicarla pronto'; }
    else if (days <= 30) { box.classList.add('is-soon'); rLeft.textContent = days === 0 ? 'Es hoy' : 'Faltan ' + days + ' días: resérvala ya'; }
    else rLeft.textContent = 'Faltan ' + days + ' días';
  }
  [].forEach.call(document.querySelectorAll('input[name="sp"]'), function (r) { r.addEventListener('change', fill); });
  sel.addEventListener('change', calc); fecha.addEventListener('input', calc);
  fill();
  document.getElementById('go-vac').addEventListener('click', function () {
    var txt = 'Hola, quiero reservar el refuerzo de ' + sel.value.toLowerCase() + ' para mi ' + sp() + '.';
    this.href = 'https://wa.me/51944000123?text=' + encodeURIComponent(txt); this.target = '_blank'; this.rel = 'noopener';
  });

  /* copy phone */
  document.getElementById('copy').addEventListener('click', function () {
    var b = this, lab = b.lastChild, num = document.getElementById('tel').textContent.replace(/\s/g, '');
    function ok() { lab.textContent = 'Número copiado'; setTimeout(function () { lab.textContent = 'Copiar número'; }, 2000); }
    function fb() { var r = document.createRange(); r.selectNodeContents(document.getElementById('tel')); var s = getSelection(); s.removeAllRanges(); s.addRange(r); lab.textContent = 'Número seleccionado'; }
    try { navigator.clipboard.writeText(num).then(ok, fb); } catch (e) { fb(); }
  });
})();
