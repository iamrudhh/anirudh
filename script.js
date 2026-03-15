/* ──────────────────────────────────────────
   Bio Link — script.js
────────────────────────────────────────── */

/* ── Year ── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ── Theme Toggle ── */
const toggle = document.getElementById('themeToggle');
const icon   = toggle.querySelector('.toggle-icon');
applyTheme(localStorage.getItem('theme') || 'light');
toggle.addEventListener('click', () => {
  applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
});
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('theme', theme);
  icon.textContent = theme === 'dark' ? '☾' : '☀';
}

/* ── Typing Animation ── */
const phrases = [
  'Cybersecurity Enthusiast',
  'Bug Bounty Hunter',
  'Python Developer',
  'Linux Learner',
  'keep_learning...'
];
let pIdx = 0, cIdx = 0, deleting = false;
function runTyping() {
  const el = document.getElementById('typing');
  const word = phrases[pIdx];
  el.textContent = deleting ? word.slice(0, cIdx--) : word.slice(0, cIdx++);
  if (!deleting && cIdx > word.length)  { deleting = true;  setTimeout(runTyping, 1400); return; }
  if (deleting  && cIdx < 0)           { deleting = false; pIdx = (pIdx + 1) % phrases.length; }
  setTimeout(runTyping, deleting ? 55 : 115);
}
runTyping();

/* ── Ripple Effect ── */
document.querySelectorAll('[data-ripple]').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x    = e.clientX - rect.left  - size / 2;
    const y    = e.clientY - rect.top   - size / 2;
    const rip  = document.createElement('span');
    rip.className = 'ripple';
    Object.assign(rip.style, { width: size+'px', height: size+'px', left: x+'px', top: y+'px' });
    this.appendChild(rip);
    rip.addEventListener('animationend', () => rip.remove());
  });
});

/* ── Button Colour Tint on Hover ── */
document.querySelectorAll('.link-btn').forEach(btn => {
  const color = btn.dataset.color;
  if (!color) return;
  btn.addEventListener('mouseenter', () => { btn.style.background = color + '18'; });
  btn.addEventListener('mouseleave', () => { btn.style.background = ''; });
});

/* ── GitHub Repos ── */
fetch('https://api.github.com/users/iamrudhh')
  .then(r => r.json())
  .then(d => {
    if (d.public_repos != null)
      document.getElementById('repos').textContent = d.public_repos;
  })
  .catch(() => {});

/* ════════════════════════════════════════
   VISIT COUNTER
   Primary: countapi.xyz (persists globally)
   Fallback: localStorage (local counting)
════════════════════════════════════════ */
(function initVisits() {
  const LS_KEY  = 'iamrudhh_visits';
  const SES_KEY = 'iamrudhh_visited';

  function showVisits(n) {
    document.getElementById('visits').textContent = Number(n).toLocaleString();
  }

  fetch('https://api.countapi.xyz/hit/iamrudhh-biolinks-v1/visits')
    .then(r => r.json())
    .then(d => {
      if (d && d.value) {
        showVisits(d.value);
        localStorage.setItem(LS_KEY, d.value);
      }
    })
    .catch(() => {
      // Fallback: count unique sessions locally
      let count = parseInt(localStorage.getItem(LS_KEY) || '0');
      if (!sessionStorage.getItem(SES_KEY)) {
        count++;
        sessionStorage.setItem(SES_KEY, '1');
        localStorage.setItem(LS_KEY, count);
      }
      showVisits(count);
    });
})();

/* ════════════════════════════════════════
   REVIEW SYSTEM — localStorage
════════════════════════════════════════ */
const REVIEWS_KEY = 'iamrudhh_reviews_v1';

function getReviews() {
  try { return JSON.parse(localStorage.getItem(REVIEWS_KEY)) || []; }
  catch { return []; }
}
function saveReviews(arr) {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(arr));
}
function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function makeStars(n) {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

/* Render all reviews + stats bars */
function renderReviews() {
  const reviews = getReviews();
  const list    = document.getElementById('reviewList');
  const bigRat  = document.getElementById('bigRating');
  const starsDis = document.getElementById('starsDisplay');
  const countEl = document.getElementById('reviewCount');
  const avgEl   = document.getElementById('avgRating');

  /* Stats */
  if (!reviews.length) {
    bigRat.textContent   = '—';
    starsDis.textContent = '☆☆☆☆☆';
    countEl.textContent  = 'Be the first!';
    avgEl.textContent    = '—';
    [1,2,3,4,5].forEach(n => { document.getElementById('b'+n).style.width = '0%'; });
    list.innerHTML = '<div class="review-empty">No reviews yet — leave the first! ✨</div>';
    return;
  }

  const total = reviews.length;
  const sum   = reviews.reduce((s, r) => s + r.stars, 0);
  const avg   = (sum / total).toFixed(1);

  bigRat.textContent   = avg;
  starsDis.textContent = makeStars(Math.round(avg));
  countEl.textContent  = total + ' review' + (total > 1 ? 's' : '');
  avgEl.textContent    = avg;

  // Distribution bars
  [1,2,3,4,5].forEach(n => {
    const pct = (reviews.filter(r => r.stars === n).length / total) * 100;
    document.getElementById('b'+n).style.width = pct + '%';
  });

  // Review cards — newest first
  list.innerHTML = '';
  [...reviews].reverse().forEach((rv, i) => {
    const el = document.createElement('div');
    el.className = 'review-item';
    el.style.animationDelay = (i * 0.06) + 's';
    el.innerHTML = `
      <div class="review-top">
        <span class="review-author">${escapeHTML(rv.name)}</span>
        <span class="review-stars">${makeStars(rv.stars)}</span>
        <span class="review-date">${rv.date}</span>
      </div>
      <p class="review-msg">${escapeHTML(rv.msg)}</p>`;
    list.appendChild(el);
  });
}

/* ── Star Picker ── */
let selectedStars = 0;
const starEls = document.querySelectorAll('#starPicker .star');

starEls.forEach(star => {
  const val = parseInt(star.dataset.val);

  star.addEventListener('mouseenter', () => highlightStars(val, true));
  star.addEventListener('mouseleave', () => highlightStars(selectedStars, false));
  star.addEventListener('click', () => {
    selectedStars = val;
    highlightStars(val, false);
  });
});

function highlightStars(n, isHover) {
  starEls.forEach(s => {
    const v = parseInt(s.dataset.val);
    s.classList.toggle('active', !isHover && v <= n);
    s.classList.toggle('hover',   isHover && v <= n);
  });
}

/* ── Submit Review ── */
document.getElementById('submitReview').addEventListener('click', () => {
  const name = document.getElementById('rName').value.trim();
  const msg  = document.getElementById('rMsg').value.trim();

  if (!name)          { shakeEl('rName');       return; }
  if (!selectedStars) { shakeEl('starPicker');  return; }
  if (!msg)           { shakeEl('rMsg');         return; }

  const reviews = getReviews();
  const date    = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: '2-digit'
  });

  reviews.push({ name, stars: selectedStars, msg, date });
  saveReviews(reviews);

  // Reset form
  document.getElementById('rName').value = '';
  document.getElementById('rMsg').value  = '';
  selectedStars = 0;
  highlightStars(0, false);

  renderReviews();

  // Scroll list to top to see new review
  setTimeout(() => {
    const list = document.getElementById('reviewList');
    list.scrollTo({ top: 0, behavior: 'smooth' });
  }, 100);
});

function shakeEl(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('shake');
  void el.offsetWidth; // reflow
  el.classList.add('shake');
  el.addEventListener('animationend', () => el.classList.remove('shake'), { once: true });
}

/* Initial render */
renderReviews();
