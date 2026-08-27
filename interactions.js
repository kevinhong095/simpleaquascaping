(function () {
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Reading progress bar (inner pages only — element is absent on the homepage) ---- */
  function initProgressBar() {
    var bar = document.getElementById('progressBar');
    if (!bar) return;
    function update() {
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      bar.style.width = pct + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---- Sticky nav frosted glass on scroll ---- */
  function initNavScroll() {
    var nav = document.querySelector('.nav');
    if (!nav) return;
    function update() {
      nav.classList.toggle('nav-scrolled', window.scrollY > 50);
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---- Active section highlighting — only matches on the homepage, where nav
     links are same-page "#id" hashes and section ids exist; inner pages use
     "index.html#id" hrefs so the map stays empty and this is a no-op there. ---- */
  function initActiveNav() {
    var sections = document.querySelectorAll('main section[id]');
    var navLinks = document.querySelectorAll('.nav-links a');
    if (!sections.length || !navLinks.length || !('IntersectionObserver' in window)) return;

    var map = {};
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href') || '';
      if (href.charAt(0) === '#') map[href.slice(1)] = link;
    });
    if (!Object.keys(map).length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = map[entry.target.id];
        if (!link || !entry.isIntersecting) return;
        navLinks.forEach(function (l) { l.classList.remove('active'); });
        link.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ---- Scroll-triggered fade-ins ---- */
  function initReveal() {
    if (reducedMotion || !('IntersectionObserver' in window)) return;
    var targets = document.querySelectorAll(
      '.card, .phase-card, .link-card, .channel-chip, .stat-tile, .soon-item, ' +
      '.section-head, .page-header, .content-section, .manifesto p, .callout'
    );
    if (!targets.length) return;

    targets.forEach(function (el) { el.classList.add('reveal'); });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(function (el) { observer.observe(el); });
  }

  /* ---- Card hover tilt ---- */
  function initTilt() {
    if (reducedMotion) return;
    var MAX_TILT = 3;
    var cards = document.querySelectorAll('.card, .phase-card, .link-card, .channel-chip');

    cards.forEach(function (card) {
      function onMove(e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -MAX_TILT;
        var rotateY = ((x - rect.width / 2) / (rect.width / 2)) * MAX_TILT;
        card.style.transition = 'transform 0.1s ease-out';
        card.style.transform =
          'perspective(600px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) translateY(-2px)';
      }
      card.addEventListener('mouseenter', onMove);
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', function () {
        card.style.transition = 'transform 0.4s ease';
        card.style.transform = '';
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initProgressBar();
    initNavScroll();
    initActiveNav();
    initReveal();
    initTilt();
  });
})();
