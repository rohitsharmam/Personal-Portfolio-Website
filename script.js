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
    // friendly toast-like UI using temporary element
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

/* ---------- Image Slider Logic ---------- */
(function initSlider(){
  const slidesWrap = q('#slides');
  if(!slidesWrap) return;
  const slides = qa('#slides img');
  let idx = 0;
  const total = slides.length;

  // create dots
  const dotsWrap = q('#sliderDots');
  for(let i=0;i<total;i++){
    const d = document.createElement('button');
    d.className = 'dot';
    d.style.width = '10px';
    d.style.height = '10px';
    d.style.border = 'none';
    d.style.borderRadius = '50%';
    d.style.background = i===0 ? '#0b63ff' : '#d1d5db';
    d.style.cursor = 'pointer';
    d.dataset.i = i;
    d.addEventListener('click', (e)=> { idx = Number(e.target.dataset.i); update(); });
    dotsWrap.appendChild(d);
  }

  function update(){
    slidesWrap.style.transform = `translateX(-${idx * 100}%)`;
    // update dots
    qa('#sliderDots button').forEach((b,i)=> b.style.background = i===idx ? '#0b63ff' : '#d1d5db');
  }

  q('#prevSlide').addEventListener('click', ()=> { idx = (idx-1+total) % total; update(); });
  q('#nextSlide').addEventListener('click', ()=> { idx = (idx+1) % total; update(); });

  // autoplay
  let autoplay = setInterval(()=> { idx = (idx+1) % total; update(); }, 4000);
  // pause on hover
  q('#slider').addEventListener('mouseenter', ()=> clearInterval(autoplay));
  q('#slider').addEventListener('mouseleave', ()=> autoplay = setInterval(()=> { idx = (idx+1) % total; update(); }, 4000));
})();

/* ---------- Todo App (with localStorage) ---------- */
(function initTodo(){
  const input = q('#todoInput');
  const addBtn = q('#addTodoBtn');
  const list = q('#todoList');
  const clearAll = q('#clearAll');
  const clearCompleted = q('#clearCompleted');

  let todos = JSON.parse(localStorage.getItem('todos_v1') || '[]');

  function save(){ localStorage.setItem('todos_v1', JSON.stringify(todos)); }
  function render(){
    list.innerHTML = '';
    todos.forEach((t, i) => {
      const li = document.createElement('li');
      li.className = 'todo-item' + (t.done ? ' done' : '');
      li.innerHTML = `
        <input type="checkbox" ${t.done ? 'checked' : ''} data-idx="${i}" />
        <div style="flex:1">${escapeHtml(t.text)}</div>
        <button data-del="${i}" class="btn small ghost">Delete</button>
      `;
      list.appendChild(li);
    });
  }

  function escapeHtml(s){ return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }

  addBtn.addEventListener('click', () => {
    const v = input.value.trim();
    if(!v) return input.focus();
    todos.push({ text:v, done:false });
    input.value = '';
    save();
    render();
  });

  // toggle and delete via event delegation
  list.addEventListener('click', (e) => {
    if(e.target.matches('button[data-del]')){
      const i = Number(e.target.dataset.del);
      todos.splice(i,1);
      save(); render();
    }
  });

  list.addEventListener('change', (e) => {
    if(e.target.matches('input[type="checkbox"]')){
      const i = Number(e.target.dataset.idx);
      todos[i].done = e.target.checked;
      save(); render();
    }
  });

  clearAll.addEventListener('click', ()=> { todos=[]; save(); render(); });
  clearCompleted.addEventListener('click', ()=> { todos = todos.filter(t => !t.done); save(); render(); });

  // on load:
  render();
})();

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
    // simple demo: show success and clear form (in real app send to server)
    note.style.color = 'green';
    note.textContent = 'Message received! (demo — not actually sent)';
    q('#contactName').value = q('#contactEmail').value = q('#contactMsg').value = '';
    setTimeout(()=> note.textContent = '', 3200);
  });
})();

/* ---------- small accessibility + keyboard support ---------- */
document.addEventListener('keydown', (e) => {
  // allow pressing "P" to jump to projects
  if(e.key.toLowerCase() === 'p') scrollToSection('projects');
});
