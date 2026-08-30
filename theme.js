(function () {
  var root = document.documentElement;
  var btn = document.getElementById('themeToggle');
  var label = document.getElementById('themeToggleLabel');
  var STORAGE_KEY = 'ptg-theme';

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function applyLabel(mode) {
    if (!label) return;
    var isDark = mode === 'dark' || (mode !== 'light' && systemPrefersDark());
    // Label shows the theme a click would switch TO, not the current one.
    label.textContent = isDark ? 'Light' : 'Dark';
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
    applyLabel(mode);
  }

  var saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
  if (saved === 'light' || saved === 'dark') {
    setTheme(saved);
  } else {
    // No explicit choice yet — default to dark regardless of OS/browser
    // preference, without persisting it as if the user had chosen it.
    root.setAttribute('data-theme', 'dark');
    applyLabel('dark');
  }

  if (btn) {
    btn.addEventListener('click', function () {
      var current = root.getAttribute('data-theme');
      var effectiveDark = current ? current === 'dark' : systemPrefersDark();
      setTheme(effectiveDark ? 'light' : 'dark');
    });
  }
})();
