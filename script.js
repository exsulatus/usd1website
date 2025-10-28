/* CONFIG */
const TOKEN_ADDRESS = "5H1jkA7erRxwD8uqH8KimMD74ctjUYBd32rbp2jubonk";
const STREAMFLOW_DASHBOARD = "https://app.streamflow.finance/token-dashboard/solana/mainnet/" + TOKEN_ADDRESS;

/* SMALL HELPERS */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* RAINBOW HEADINGS - wrap letters (keep behavior) */
function wrapRainbow(el){
  const textNode = Array.from(el.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
  if(!textNode) return;
  const text = textNode.textContent.trim();
  if(!text) return;
  const colors = ['c0','c1','c2','c3','c4','c5','c6'];
  const wrapper = document.createElement('span');
  wrapper.className = 'rainbow-plain';
  for(let i=0;i<text.length;i++){
    const ch = text[i] === ' ' ? '\u00A0' : text[i];
    const sp = document.createElement('span');
    sp.className = `rainbow-letter ${colors[i % colors.length]}`;
    sp.textContent = ch;
    wrapper.appendChild(sp);
  }
  el.insertBefore(wrapper, textNode);
  el.removeChild(textNode);
}
$$('.rainbow-heading').forEach(h => wrapRainbow(h));

/* NAV: hamburger */
const hamburger = $('#hamburger');
const navLinks = $('#navLinks');
if(hamburger) hamburger.addEventListener('click', ()=> navLinks.classList.toggle('open'));
$$('#navLinks a').forEach(a => a.addEventListener('click', ()=> navLinks.classList.remove('open')));

/* FADE on scroll */
const fades = document.querySelectorAll('.fade-section');
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, {threshold:0.18});
fades.forEach(f => obs.observe(f));

/* Copy CA (header and home buttons) */
async function copyToClipboard(text){
  try{
    await navigator.clipboard.writeText(text);
    showToast("Contract copied to clipboard");
  }catch(e){
    alert("Contract: " + text);
  }
}
const copyBtn = $('#copyCA');
const headerBtn = $('#headerCA');
if(copyBtn) copyBtn.addEventListener('click', ()=> copyToClipboard(TOKEN_ADDRESS));
if(headerBtn) headerBtn.addEventListener('click', ()=> copyToClipboard(TOKEN_ADDRESS));

/* show toast with rainbow gradient */
function showToast(msg){
  const root = $('#toast-root');
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  Object.assign(t.style, {
    position: 'fixed', bottom:'22px', left:'50%', transform:'translateX(-50%)',
    padding:'10px 18px', borderRadius:'999px', fontWeight:'800', zIndex:9999, color:'#000',
    background:'linear-gradient(90deg,#ff7a00,#ffd100,#00d2ff,#5a6bff)'
  });
  document.body.appendChild(t);
  setTimeout(()=> { t.style.transition='opacity .4s'; t.style.opacity='0'; setTimeout(()=>t.remove(),450) }, 1500);
}

/* HOW TO BUY expandable with smooth slide */
const howBtn = $('#howToBuyBtn');
const howBox = $('#howToBuy');
if(howBtn && howBox){
  howBtn.addEventListener('click', () => {
    howBox.classList.toggle('open');
    const expanded = howBox.classList.contains('open');
    howBtn.setAttribute('aria-expanded', String(expanded));
    const arrow = howBtn.querySelector('.arrow');
    if(arrow) arrow.style.transform = expanded ? 'rotate(180deg)' : 'rotate(0deg)';
  });
}

/* FAQ expand/collapse smooth */
$$('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const a = btn.nextElementSibling;
    const toggle = btn.querySelector('.faq-toggle');
    const isOpen = a.classList.toggle('open');
    btn.classList.toggle('collapsed', !isOpen);
    if(toggle) toggle.textContent = isOpen ? '▴' : '▾';
  });
});

/* =========================
   Canvas: natural starfall (circular meteors with trailing glow)
   ========================= */
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');

/* resize & star/meteor builders */
function resizeCanvas(){ canvas.width = innerWidth; canvas.height = innerHeight; }
window.addEventListener('resize', ()=> { resizeCanvas(); buildStars(Math.max(140, Math.floor((innerWidth*innerHeight)/10000))); });
resizeCanvas();

/* Stars with depth layers */
let stars = [];
function buildStars(count = 220){
  stars = [];
  // create layers by depth: 0 = close (fast/bright), 2 = far (slow/dim)
  for(let i=0;i<count;i++){
    const depth = Math.random() < 0.6 ? 0 : (Math.random() < 0.6 ? 1 : 2); // bias toward closer
    const baseSpeed = depth === 0 ? 0.02 : depth === 1 ? 0.01 : 0.004;
    const baseAlpha = depth === 0 ? (0.5 + Math.random()*0.5) : depth === 1 ? (0.25 + Math.random()*0.4) : (0.08 + Math.random()*0.16);
    stars.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      r: Math.random()*1.8 + (depth === 0 ? 1.2 : 0.6),
      a: Math.random()*0.9 + 0.05,
      d: (Math.random()*baseSpeed) * (Math.random() < 0.5 ? -1 : 1),
      depth,
      baseAlpha
    });
  }
}
buildStars();

/* Meteors: circular glowing particles leaving short trails */
let meteors = [];
function spawnMeteor(){
  // spawn chance varied so they appear staggered like a shower
  if(Math.random() < 0.016){
    const startX = Math.random() * canvas.width * 0.9;
    const startY = Math.random() * canvas.height * 0.5;
    meteors.push({
      x: startX,
      y: startY,
      vx: (Math.random()*0.6 + 1.6) * (Math.random() < 0.5 ? 1 : -1), // some go left/right
      vy: Math.random()*1.2 + 1.6,
      life: 1,
      hue: Math.floor(Math.random()*60) + 40, // warm hues
      size: Math.random()*3 + 2,
      trail: [] // store previous positions for a soft tail
    });
  }
}

/* draw a soft glowing circle */
function drawGlowCircle(x,y,r,hue,alpha){
  const g = ctx.createRadialGradient(x,y,0,x,y,r*2);
  g.addColorStop(0, `hsla(${hue},100%,85%,${alpha})`);
  g.addColorStop(0.4, `hsla(${hue},95%,70%,${alpha*0.45})`);
  g.addColorStop(1, `rgba(0,0,0,0)`);
  ctx.beginPath();
  ctx.fillStyle = g;
  ctx.arc(x,y,r*1.2,0,Math.PI*2);
  ctx.fill();
}

/* draw meteor with trailing soft dots */
function drawMeteor(m){
  // draw trailing small glows from oldest->newest
  const step = Math.max(2, Math.floor(m.trail.length / 8));
  for(let i = 0; i < m.trail.length; i += step){
    const p = m.trail[i];
    const tAlpha = (i / m.trail.length) * m.life * 0.6;
    drawGlowCircle(p.x, p.y, m.size * (0.7 + (i / m.trail.length)), m.hue, tAlpha);
  }
  // main head
  drawGlowCircle(m.x, m.y, m.size * 1.6, m.hue, m.life);
}

/* animation frame */
function frame(){
  // slightly translucent clear for subtle trails
  ctx.fillStyle = 'rgba(0,0,0,0.14)';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // update & render stars
  for(const s of stars){
    // twinkle
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${Math.max(0.03, Math.min(1, s.baseAlpha * Math.abs(s.a)))})`;
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    ctx.fill();
    s.a += s.d;
    // gentle drifting horizontally to mimic parallax
    s.x += (s.depth === 2 ? 0.02 : s.depth === 1 ? 0.06 : 0.12) * (Math.random() < 0.5 ? -1 : 1);
    // wrap
    if(s.x < -10) s.x = canvas.width + 10;
    if(s.x > canvas.width + 10) s.x = -10;
    if(s.a <= 0.02 || s.a >= 1) s.d *= -1;
  }

  // spawn meteors occasionally
  spawnMeteor();

  // draw meteors
  for(let i = meteors.length-1; i >= 0; i--){
    const m = meteors[i];
    // add previous pos to trail
    m.trail.push({x: m.x, y: m.y});
    if(m.trail.length > 26) m.trail.shift();

    // move
    m.x += m.vx;
    m.y += m.vy;
    m.life -= 0.009;

    drawMeteor(m);

    // if out of bounds or dead -> remove
    if(m.x < -200 || m.x > canvas.width + 200 || m.y > canvas.height + 200 || m.life <= 0){
      meteors.splice(i,1);
    }
  }

  requestAnimationFrame(frame);
}
frame();

/* =========================
   Static Tokenomics UI
   ========================= */
const supplyEl = $('#supplyValue');
const holdersEl = $('#holdersValue');
const updatedEl = $('#updatedAt');

if(supplyEl) supplyEl.textContent = '1,000,000,000';
if(holdersEl) holdersEl.textContent = '—';
if(updatedEl) updatedEl.textContent = new Date().toLocaleString();

/* =========================
   Misc UI tweaks on load
   ========================= */
$$('.nav-socials .social').forEach(a => { a.style.fontSize = '15px'; a.style.padding = '10px 14px'; });

/* ensure interactive aria states */
if(headerBtn) headerBtn.setAttribute('aria-pressed', 'false');
if(copyBtn) copyBtn.setAttribute('aria-pressed', 'false');
