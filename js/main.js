// ─── Mobile Nav Toggle ─────────────────────────
function toggleNav() {
  document.querySelector('.nav-links').classList.toggle('open');
}
document.addEventListener('click', (e) => {
  const nav = document.querySelector('.nav-links');
  const toggle = document.getElementById('nav-toggle');
  if (nav && nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
    nav.classList.remove('open');
  }
});

// ─── Accordion ───────────────────────────────────
function toggleAccordion(id) {
  const row = document.getElementById(id);
  row.classList.toggle('open');
}

// ─── Scroll Reveal ───────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ─── Showreel scroll scale ────────────────────────
const showreelObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    const s = e.intersectionRatio;
    const scale = 0.95 + s * 0.05;
    e.target.style.transform = `scale(${scale})`;
  });
}, { threshold: Array.from({length: 20}, (_, i) => i / 20) });

document.querySelectorAll('.showreel-container').forEach(el => showreelObs.observe(el));

// ─── Counter Animation ────────────────────────────
function animateCounter(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || (el.textContent.includes('$') ? '$' : '');
  const duration = 1600;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = target * ease;
    el.textContent = prefix + (target >= 10 ? Math.round(current) : current.toFixed(1)) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ─── Live spend ticker ────────────────────────────
let spend = 0;
const liveSpendEl = document.getElementById('live-spend');
if (liveSpendEl) {
  setInterval(() => {
    spend += Math.floor(Math.random() * 8000 + 2000);
    liveSpendEl.textContent = 'KES ' + spend.toLocaleString();
  }, 3200);
}

// ─── Process nav active state ─────────────────────
document.querySelectorAll('.process-nav-item').forEach((item, i) => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.process-nav-item').forEach(n => n.classList.remove('active'));
    item.classList.add('active');
  });
});

// ─── Case Study Filter ────────────────────────
function filterCS(cat, btn) {
  document.querySelectorAll('.cs-filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.cs-card').forEach(card => {
    const match = cat === 'all' || card.dataset.category === cat;
    card.classList.toggle('hidden', !match);
  });
}

// ─── Form Steps ───────────────────────────────
let currentStep = 1;
const stepLabels = ['','Corporate Profile','Diagnostic','Capital Allocation'];

function formNext() {
  if (currentStep < 3) {
    document.getElementById('step-' + currentStep).classList.remove('active');
    document.getElementById('si-' + currentStep).classList.remove('active');
    document.getElementById('si-' + currentStep).classList.add('done');
    currentStep++;
    document.getElementById('step-' + currentStep).classList.add('active');
    document.getElementById('si-' + currentStep).classList.add('active');
    document.getElementById('form-progress').textContent = 'Step ' + currentStep + ' of 3 — ' + stepLabels[currentStep];
    document.getElementById('back-btn').style.display = 'block';
    if (currentStep === 3) {
      document.getElementById('next-btn').textContent = '';
      document.getElementById('next-btn').innerHTML = 'Submit Application <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6H10M7 3L10 6L7 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/></svg>';
    }
  } else {
    document.getElementById('next-btn').innerHTML = 'Submitted \u2014 We\'ll be in touch';
    document.getElementById('next-btn').disabled = true;
  }
}

function formBack() {
  if (currentStep > 1) {
    document.getElementById('step-' + currentStep).classList.remove('active');
    document.getElementById('si-' + currentStep).classList.remove('active');
    currentStep--;
    document.getElementById('step-' + currentStep).classList.add('active');
    document.getElementById('si-' + currentStep).classList.add('active');
    document.getElementById('si-' + (currentStep)).classList.remove('done');
    document.getElementById('form-progress').textContent = 'Step ' + currentStep + ' of 3 — ' + stepLabels[currentStep];
    document.getElementById('next-btn').innerHTML = 'Continue <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6H10M7 3L10 6L7 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/></svg>';
    if (currentStep === 1) document.getElementById('back-btn').style.display = 'none';
  }
}

function selectScale(btn, groupId, multi) {
  if (!multi) {
    document.querySelectorAll('#' + groupId + ' .scale-option').forEach(b => b.classList.remove('selected'));
  }
  btn.classList.toggle('selected');
}

function toggleCheck(el) {
  el.classList.toggle('checked');
}

function selectBudget(el) {
  document.querySelectorAll('#budget-selector .budget-option').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
}

// ─── FAQ Toggle ───────────────────────────────
function toggleFaq(id) {
  const item = document.getElementById(id);
  item.classList.toggle('open');
}

// ─── Calendar ─────────────────────────────────
let calYear = 2025, calMonth = 5;
const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
let selectedCalDate = null;
let selectedSlot = null;

function renderCal() {
  document.getElementById('cal-month-label').textContent = monthNames[calMonth] + ' ' + calYear;
  const grid = document.getElementById('cal-days');
  if (!grid) return;
  grid.innerHTML = '';
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const today = new Date();
  for (let i = 0; i < offset; i++) {
    const d = document.createElement('div');
    d.className = 'cal-day empty';
    grid.appendChild(d);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement('div');
    const date = new Date(calYear, calMonth, d);
    const dow = date.getDay();
    const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isWeekend = dow === 0 || dow === 6;
    cell.className = 'cal-day' + (isPast || isWeekend ? ' unavailable' : ' available');
    if (date.toDateString() === today.toDateString()) cell.classList.add('today');
    if (selectedCalDate && date.toDateString() === selectedCalDate.toDateString()) cell.classList.add('selected');
    cell.textContent = d;
    if (!isPast && !isWeekend) {
      cell.onclick = () => selectCalDay(date, cell);
    }
    grid.appendChild(cell);
  }
}

function selectCalDay(date, cell) {
  document.querySelectorAll('.cal-day').forEach(c => c.classList.remove('selected'));
  cell.classList.add('selected');
  selectedCalDate = date;
  const fmt = date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  const el = document.getElementById('cal-selected-date');
  if (el) el.textContent = fmt;
  updateConfirmBtn();
}

function calNav(dir) {
  calMonth += dir;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  if (calMonth < 0) { calMonth = 11; calYear--; }
  renderCal();
}

function selectSlot(el) {
  document.querySelectorAll('.cal-slot').forEach(s => s.classList.remove('booked'));
  el.classList.add('booked');
  selectedSlot = el.textContent;
  updateConfirmBtn();
}

function updateConfirmBtn() {
  const btn = document.getElementById('cal-confirm-btn');
  if (!btn) return;
  if (selectedCalDate && selectedSlot) {
    const fmt = selectedCalDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    btn.textContent = 'Confirm: ' + fmt + ' at ' + selectedSlot;
    btn.style.background = '#F6871F';
  }
}

function confirmBooking() {
  const btn = document.getElementById('cal-confirm-btn');
  if (selectedCalDate && selectedSlot && btn) {
    btn.textContent = 'Booking confirmed — Check your email';
    btn.style.background = 'var(--border-bright)';
    btn.style.color = 'var(--text-primary)';
  }
}

// ─── Article thumbnail cursor follow ─────────
document.querySelectorAll('.article-row').forEach(row => {
  const thumb = row.querySelector('.article-thumb');
  if (!thumb) return;
  row.addEventListener('mousemove', (e) => {
    const rect = row.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    thumb.style.left = x + 'px';
    thumb.style.top = y + 'px';
  });
});

// ─── Sync time display ────────────────────────
function updateSyncTime() {
  const el = document.getElementById('sync-time');
  if (el) {
    const now = new Date();
    el.textContent = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }
}
updateSyncTime();
setInterval(updateSyncTime, 60000);

// ─── Theme Toggle ───────────────────────────────
function initTheme() {
  const saved = localStorage.getItem('eclipx-theme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  const btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.textContent = saved === 'dark' ? '\u2600' : '\u263E';
    btn.addEventListener('click', function() {
      const html = document.documentElement;
      const isDark = html.getAttribute('data-theme') === 'dark';
      if (isDark) {
        html.removeAttribute('data-theme');
        localStorage.setItem('eclipx-theme', 'light');
        btn.textContent = '\u263E';
      } else {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('eclipx-theme', 'dark');
        btn.textContent = '\u2600';
      }
    });
  }
}

// Init calendar on load
renderCal();
