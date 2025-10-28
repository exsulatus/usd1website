/* ============================
   Globals & config
   ============================ */
const TOKEN = "5H1jkA7erRxwD8uqH8KimMD74ctjUYBd32rbp2jubonk";

/* ============================
   Rainbow-per-letter (brand & any element with .brand-rainbow)
   ============================ */
function applyRainbowPerLetter(selector){
  const el = document.querySelector(selector);
  if(!el) return;
  const text = el.textContent.trim();
  el.innerHTML = "";
  const colors = ['#ff005e','#ff7a00','#ffd100','#3cff6a','#00d2ff','#5a6bff','#b84cff'];
  for(let i=0;i<text.length;i++){
    const ch = document.createElement('span');
    ch.style.color = colors[i % colors.length];
    ch.textContent = text[i];
    ch.style.fontWeight = 900;
    el.appendChild(ch);
  }
}
applyRainbowPerLetter('#brandRainbow');
/* also make section titles all-white already in CSS */

/* ============================
   CA copy + rainbow toast
   ============================ */
const caButton = document.getElementById('caButton');
function showRainbowToast(msg){
  const t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style, {
    position:'fixed', left:'50%', bottom:'28px', transform:'translateX(-50%)',
    padding:'10px 18px', borderRadius:'999px', fontWeight:800, zIndex:9999, color:'#000',
    background:'linear-gradient(90deg,#ff005e,#ff7a00,#ffd100,#3cff6a,#00d2ff,#5a6bff,#b84cff)',
    backgroundSize:'400% 100%', animation:'rainMove 6s linear infinite'
  });
  document.body.appendChild(t);
  setTimeout(()=> { t.style.transition='opacity .4s'; t.style.opacity=0; setTimeout(()=> t.remove(),400); }, 1600);
}
if(caButton){
  caButton.addEventListener('click', async () => {
    try{
      await navigator.clipboard.writeText(TOKEN);
      showRainbowToast('Contract copied to clipboard');
    }catch(e){
      alert('Contract: ' + TOKEN);
    }
  });
}

/* ============================
   HOW TO BUY toggle
   ============================ */
const howToggle = document.getElementById('howToggle');
const howContent = document.getElementById('howContent');
if(howToggle && howContent){
  // start collapsed
  howContent.classList.add('hidden');
  howToggle.setAttribute('aria-expanded', 'false');
  howToggle.addEventListener('click', () => {
    const open = howContent.classList.toggle('hidden');
    howToggle.setAttribute('aria-expanded', String(!howContent.classList.contains('hidden')));
    const arrow = howToggle.querySelector('.how-arrow');
    if(arrow) arrow.style.transform = howContent.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
  });
}

/* ============================
   FAQ accordion
   ============================ */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const a = btn.nextElementSibling;
    if(!a) return;
    const open = a.classList.toggle('hidden');
    a.style.display = a.classList.contains('hidden') ? 'none' : 'block';
  });
});

/* ============================
   Canvas: pulsing white stars + colored meteor dots
   - meteors move top-left -> bottom-right (so vx positive, vy positive)
   - trail follows in same direction (short, faded)
   ============================ */
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let W = innerWidth, H = innerHeight;
function resize(){ W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
window.addEventListener('resize', resize);
resize();

/* static pulsing stars */
let stars = [];
function buildStars(n = 200){
  stars = [];
  for(let i=0;i<n;i++){
    stars.push({
      x: Math.random()*W,
      y: Math.random()*H,
      r: Math.random()*1.8 + 0.6,
      alpha: Math.random()*0.8 + 0.1,
      d: -0.01 + Math.random()*0.02
    });
  }
}
buildStars();

/* meteors (colored dot heads with trailing gradient in same direction) */
let meteors = [];
function spawnMeteor(force=false){
  const prob = force ? 0.14 : 0.012;
  if(Math.random() < prob){
    // spawn near top-left to top area for natural look
    const sx = Math.random()*W*0.6; // more left bias
    const sy = Math.random()*H*0.35; // top quadrant bias
    const speed = Math.random()*1.8 + 2.8;
    const angleJitter = (Math.random()*0.12 - 0.06); // tiny jitter
    const vx = speed + Math.random()*0.4;
    const vy = speed * (0.5 + Math.random()*0.7); // ensure downwards component
    meteors.push({
      x: sx, y: sy,
      vx: vx*(1+angleJitter), vy: vy*(1+angleJitter),
      len: Math.random()*30 + 40,
      hue: Math.floor(Math.random()*360),
      life: 1,
      size: Math.random()*2 + 1.6
    });
  }
}

/* draw small circular head + short tapered trail in same direction */
function drawMeteor(m){
  const ex = m.x - m.vx * (m.len/ (m.vx + m.vy));
  const ey = m.y - m.vy * (m.len/ (m.vx + m.vy));
  // trail gradient from head to tail
  const g = ctx.createLinearGradient(m.x, m.y, ex, ey);
  g.addColorStop(0, `hsla(${m.hue},100%,85%,${m.life})`);
  g.addColorStop(0.6, `hsla(${m.hue},100%,70%,${0.45*m.life})`);
  g.addColorStop(1, `hsla(${m.hue},100%,60%,0)`);
  ctx.strokeStyle = g;
  ctx.lineWidth = Math.max(1, m.size*1.6);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(m.x, m.y);
  ctx.lineTo(ex, ey);
  ctx.stroke();

  // draw bright circular head
  ctx.beginPath();
  ctx.fillStyle = `hsla(${m.hue},100%,90%,${m.life})`;
  ctx.arc(m.x, m.y, Math.max(1.6, m.size*1.6), 0, Math.PI*2);
  ctx.fill();

  // small glow
  ctx.beginPath();
  ctx.fillStyle = `hsla(${m.hue},100%,80%,${0.28*m.life})`;
  ctx.arc(m.x, m.y, Math.max(3, m.size*3.5), 0, Math.PI*2);
  ctx.fill();
}

/* main loop */
function frame(){
  // subtle translucent fill for gentle trails
  ctx.fillStyle = 'rgba(0,0,0,0.16)';
  ctx.fillRect(0,0,W,H);

  // pulsing still stars
  for(const s of stars){
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${Math.max(0.06, Math.min(1, s.alpha))})`;
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    ctx.fill();
    s.alpha += s.d;
    if(s.alpha <= 0.06 || s.alpha >= 0.98) s.d *= -1;
  }

  // spawn meteors occasionally
  spawnMeteor();

  // draw meteors
  for(let i=meteors.length-1;i>=0;i--){
    const m = meteors[i];
    drawMeteor(m);
    m.x += m.vx;
    m.y += m.vy;
    m.life -= 0.01;
    if(m.x > W + 200 || m.y > H + 200 || m.life <= 0) meteors.splice(i,1);
  }

  requestAnimationFrame(frame);
}
frame();

/* spawn extra meteors on scroll (throttled) */
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const now = Date.now();
  if(now - lastScroll > 80){
    spawnMeteor(true);
    lastScroll = now;
  }
});

/* rebuild stars on resize with throttling */
let resizeTimer;
window.addEventListener('resize', ()=> {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(()=> buildStars(Math.max(120, Math.floor((innerWidth*innerHeight)/9000))), 200);
});

/* ensure links open normally (anchors use target="_blank" where appropriate) */
/* READY */
