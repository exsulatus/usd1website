/* -------------------------
   DOM helpers and setup
   ------------------------- */
const wrapRainbow = (el) => {
  // wrap the element's text content into colored spans
  const text = el.textContent.trim();
  el.innerHTML = "";
  const colors = ['c0','c1','c2','c3','c4','c5','c6'];
  for(let i=0;i<text.length;i++){
    const ch = text[i] === ' ' ? '\u00A0' : text[i];
    const span = document.createElement('span');
    span.className = `rainbow-letter ${colors[i % colors.length]}`;
    span.textContent = ch;
    el.appendChild(span);
  }
};

// Apply rainbow to headings (text-only parts) - headings are all-caps in HTML
document.querySelectorAll('.rainbow-heading').forEach(h => {
  // remove any existing wrapped text nodes first
  const textNode = Array.from(h.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
  if (textNode && textNode.textContent.trim().length){
    const wrapper = document.createElement('span');
    wrapper.className = 'rainbow-plain';
    wrapper.textContent = textNode.textContent.trim();
    h.insertBefore(wrapper, textNode);
    h.removeChild(textNode);
    wrapRainbow(wrapper);
  }
});

/* -------------------------
   NAV (hamburger toggle)
   ------------------------- */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

/* close menu when link clicked (mobile) */
document.querySelectorAll('#navLinks a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* -------------------------
   Fade on scroll (IntersectionObserver)
   ------------------------- */
const sections = document.querySelectorAll('.fade-section');
const obs = new IntersectionObserver((entries) => {
  entries.forEach(ent => { if(ent.isIntersecting) ent.target.classList.add('visible'); });
}, { threshold: 0.18 });
sections.forEach(s => obs.observe(s));

/* -------------------------
   Copy Contract
   ------------------------- */
document.getElementById('copyCA').addEventListener('click', async () => {
  const ca = document.getElementById('contractAddress').textContent.trim();
  try {
    await navigator.clipboard.writeText(ca);
    showToast('Contract copied to clipboard');
  } catch (e) {
    alert('Contract: ' + ca);
  }
});

function showToast(msg){
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.position = 'fixed';
  t.style.bottom = '22px';
  t.style.left = '50%';
  t.style.transform = 'translateX(-50%)';
  t.style.background = 'linear-gradient(90deg,#ff9cff,#6ef0ff)';
  t.style.color = '#000';
  t.style.padding = '10px 16px';
  t.style.borderRadius = '999px';
  t.style.zIndex = 600;
  t.style.fontWeight = 700;
  document.body.appendChild(t);
  setTimeout(()=>{ t.style.transition='opacity .5s'; t.style.opacity=0; setTimeout(()=>t.remove(),500); },1500);
}

/* How to Buy toggle */
document.getElementById('howToBuyBtn').addEventListener('click', () => {
  document.getElementById('howToBuy').classList.toggle('hidden');
});

/* -------------------------
   CANVAS: Stars + Rainbow Shooting Stars
   ------------------------- */
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');

function resizeCanvas(){
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

/* pulsing static stars (bigger/brighter now) */
let stars = [];
function buildStars(count = 220){
  stars.length = 0;
  for(let i=0;i<count;i++){
    stars.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      r: Math.random()*2.8 + 0.8,      // larger radius
      alpha: Math.random()*0.9 + 0.15, // brighter baseline
      d: -0.015 + Math.random()*0.03   // faster subtle pulse
    });
  }
}
buildStars();

/* shooting stars (random, tapered streaks) */
let shooting = [];
function spawnShooting(){
  // subtle spawn rate; keep them sporadic
  if(Math.random() < 0.012){
    const startX = Math.random() * canvas.width * 0.9;
    const startY = Math.random() * canvas.height * 0.45;
    shooting.push({
      x: startX,
      y: startY,
      vx: (Math.random()*1.0 + 2.0),
      vy: (Math.random()*1.0 + 2.0),
      len: (Math.random()*80 + 90), // moderate length
      life: 1,
      hue: Math.random()*360,
      thickness: Math.random()*1.2 + 0.8
    });
  }
}

function drawShooting(s){
  const ex = s.x - s.len * 0.8;
  const ey = s.y + s.len * 0.8;

  ctx.save();
  ctx.lineCap = 'round';

  // gradient along the streak
  const g = ctx.createLinearGradient(s.x, s.y, ex, ey);
  g.addColorStop(0, `hsla(${s.hue},100%,85%,${s.life})`);
  g.addColorStop(0.45, `hsla(${s.hue},100%,70%,${Math.max(0.5, s.life - 0.15)})`);
  g.addColorStop(1, `hsla(${s.hue},100%,60%,0)`);

  ctx.strokeStyle = g;
  ctx.lineWidth = Math.max(1, s.thickness * 2.2);
  ctx.shadowColor = `hsla(${s.hue},100%,70%,0.6)`;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(s.x, s.y);
  ctx.lineTo(ex, ey);
  ctx.stroke();

  // head glow
  ctx.beginPath();
  ctx.fillStyle = `hsla(${s.hue},100%,92%,${s.life})`;
  ctx.arc(s.x, s.y, s.thickness*3 + 1.5, 0, Math.PI*2);
  ctx.fill();

  ctx.restore();
}

/* main frame loop */
function frame(){
  // dark translucent clear to produce trailing effect
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // draw pulsing stars
  for(const st of stars){
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${Math.max(0.06, Math.min(1, st.alpha))})`;
    ctx.arc(st.x, st.y, st.r, 0, Math.PI*2);
    ctx.fill();
    st.alpha += st.d;
    if(st.alpha <= 0.06 || st.alpha >= 0.98) st.d *= -1;
  }

  // shoot stars occasionally
  spawnShooting();

  // draw shooting stars and update positions
  for(let i = shooting.length - 1; i >= 0; i--){
    const s = shooting[i];
    drawShooting(s);
    s.x += s.vx;
    s.y += s.vy;
    s.life -= 0.01;
    if(s.x > canvas.width + 200 || s.y > canvas.height + 200 || s.life <= 0) shooting.splice(i,1);
  }

  requestAnimationFrame(frame);
}
frame();

/* ensure stars rebuild on large resizes */
let resizeTimeout;
window.addEventListener('resize', ()=> {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(()=> buildStars(Math.max(120, Math.floor((innerWidth*innerHeight)/8000))), 250);
});

/* increase social button tactile size */
document.querySelectorAll('.nav-socials .social').forEach(a => {
  a.style.fontSize = '15px';
  a.style.padding = '10px 14px';
});

/* ensure the FAQ icon only exists next to the FAQ heading (already set in HTML) */
/* wrapped headings are done at top */
