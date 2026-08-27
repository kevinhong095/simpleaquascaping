(function () {
  var root = document.documentElement;
  var btn = document.getElementById('themeToggle');
  var iconSun = document.getElementById('iconSun');
  var iconMoon = document.getElementById('iconMoon');
  var STORAGE_KEY = 'ptg-theme';

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function applyIcons(mode) {
    if (!iconSun || !iconMoon) return;
    var isDark = mode === 'dark' || (mode !== 'light' && systemPrefersDark());
    iconSun.style.display = isDark ? 'none' : 'block';
    iconMoon.style.display = isDark ? 'block' : 'none';
  }

  function setTheme(mode) {
    if (mode === 'light' || mode === 'dark') {
      root.setAttribute('data-theme', mode);
    } else {
      root.removeAttribute('data-theme');
    }
    try {
      if (mode === 'light' || mode === 'dark') localStorage.setItem(STORAGE_KEY, mode);
      else localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    applyIcons(mode);
  }

  var saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
  setTheme(saved);

  if (btn) {
    btn.addEventListener('click', function () {
      var current = root.getAttribute('data-theme');
      var effectiveDark = current ? current === 'dark' : systemPrefersDark();
      setTheme(effectiveDark ? 'light' : 'dark');
    });
  }
})();
