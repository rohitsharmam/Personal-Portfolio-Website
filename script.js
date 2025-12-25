/* ---------- Small helpers ---------- */
const q = sel => document.querySelector(sel);
const qa = sel => Array.from(document.querySelectorAll(sel));

/* ---------- Smooth scroll & active nav ---------- */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.getElementById('viewProjectsBtn').addEventListener('click', () => scrollToSection('projects'));
qa('nav a').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const t = a.getAttribute('data-target');
    scrollToSection(t);
  });
});

// highlight nav link on scroll
const sections = qa('section[id]');
window.addEventListener('scroll', () => {
  const y = window.scrollY + 120;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    const id = sec.id;
    const link = document.querySelector(`nav a[data-target="${id}"]`);
    if (!link) return;
    if (y >= top && y < bottom) {
      qa('nav a').forEach(n => n.classList.remove('active'));
      link.classList.add('active');
    }
  });
});

/* ---------- Profile photo click interaction ---------- */
const profilePhoto = q('#profilePhoto');
if (profilePhoto) {
  profilePhoto.addEventListener('click', () => {
    const t = document.createElement('div');
    t.textContent = "Hello! Thanks for visiting my portfolio 😊";
    t.style.position = 'fixed';
    t.style.right = '18px';
    t.style.bottom = '18px';
    t.style.padding = '12px 14px';
    t.style.background = 'rgba(11,99,255,0.95)';
    t.style.color = 'white';
    t.style.borderRadius = '10px';
    t.style.boxShadow = '0 8px 30px rgba(11,99,255,0.18)';
    t.style.zIndex = 9999;
    document.body.appendChild(t);
    setTimeout(()=> t.remove(), 2200);
  });
}

/* ---------- Contact form (local demo) ---------- */
(function contactDemo(){
  const formBtn = q('#sendMsg');
  const note = q('#contactNote');
  if(!formBtn) return;
  formBtn.addEventListener('click', () => {
    const n = q('#contactName').value.trim();
    const e = q('#contactEmail').value.trim();
    const m = q('#contactMsg').value.trim();
    if(!n || !e || !m){
      note.style.color = 'crimson';
      note.textContent = 'Please fill all fields.';
      return;
    }
    note.style.color = 'green';
    note.textContent = 'Message received! (demo — not actually sent)';
    q('#contactName').value = q('#contactEmail').value = q('#contactMsg').value = '';
    setTimeout(()=> note.textContent = '', 3200);
  });
})();

/* ---------- small accessibility + keyboard support ---------- */
document.addEventListener('keydown', (e) => {
  if(e.key.toLowerCase() === 'p') scrollToSection('projects');
});
