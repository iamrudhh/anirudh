/* ──────────────────────────────────────────
   Bio Link — script.js
────────────────────────────────────────── */

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// ── Theme Toggle ──────────────────────────
const toggle = document.getElementById('themeToggle');
const icon   = toggle.querySelector('.toggle-icon');

const saved = localStorage.getItem('theme') || 'light';
applyTheme(saved);

toggle.addEventListener('click', () => {
  const current = document.documentElement.dataset.theme || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('theme', theme);
  icon.textContent = theme === 'dark' ? '☾' : '☀';
}

// ── Ripple Effect ─────────────────────────
document.querySelectorAll('[data-ripple]').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const rect  = this.getBoundingClientRect();
    const size  = Math.max(rect.width, rect.height);
    const x     = e.clientX - rect.left - size / 2;
    const y     = e.clientY - rect.top  - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    Object.assign(ripple.style, {
      width:  size + 'px',
      height: size + 'px',
      left:   x    + 'px',
      top:    y    + 'px',
    });
    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

// ── Button colour tint on hover ───────────
document.querySelectorAll('.link-btn').forEach(btn => {
  const color = btn.dataset.color;
  if (!color) return;

  btn.addEventListener('mouseenter', () => {
    btn.style.background = color + '18'; // 10% tint
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.background = '';
  });
});
