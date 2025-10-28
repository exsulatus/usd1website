/* ============================
   Wrappers & helpers
   ============================ */
const TOKEN = "5H1jkA7erRxwD8uqH8KimMD74ctjUYBd32rbp2jubonk";

/* wrap rainbow letters for any element with class .rainbow-letters or #brandRainbow */
function applyRainbowText(selector){
  const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if(!el) return;
  const text = el.textContent.trim();
  el.innerHTML = '';
  const colors = ['c0','c1','c2','c3','c4','c5','c6'];
  for(let i=0;i<text.length;i++){
    const span = document.createElement('span');
    span.className = `rainbow-letter ${colors[i % colors.length]}`;
    span.textContent = text[i];
    el.appendChild(span);
  }
}
applyRainbowText('.rainbow-letters');     // section titles
applyRainbowText('#brandRainbow');        // brand title

/* ============================
   CA copy (button + toast)
   ============================ */
const caButton = document.getElementById('caButton');
const toastRoot = document.getElementById('toast-root');

function showRainbowToast(msg){
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.position = 'fixed';
  t.style.left = '50%';
  t.style.bottom = '28px';
  t.style.transform = 'translateX(-50%)';
  t.style.padding = '10px 18px';
  t.style.borderRadius = '999px';
  t.style.zIndex = 9999;
  t.style.fontWeight = '800';
  t.style.color = '#000';
  t.style.background = 'linear-gradient(90deg,#ff005e,#ff7a00,#ffd100,#3cff6a,#00d2ff,#5a6bff,#b84cff)';
  t.style.backgroundSize = '400% 100%';
  t.style.animation = 'rainbowMove 6s linear infinite';
  document.body.appendChild(t);
  setTimeout(()=> { t.style.transition = 'opacity .4s'; t.style.opacity = 0; setTimeout(()=> t.remove(),450); }, 1600);
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
   How to Buy expand/collapse
   ============================ */
const howToggle = document.getElementById('howToggle');
const howContent = document.getElementById('howContent');
if(howToggle && howContent){
  howToggle.addEventListener('click', () => {
    const open = howContent.classList.toggle('hidden') ? false : true;
    howToggle.setAttribute('aria-expanded', String(!howContent.classList.contains('hidden')));
    const arrow = howToggle.querySelector('.how-arrow') || document.querySelector('.how-arrow');
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
    if(!open){
      a.style.display = 'block';
    } else {
      a.style.display = 'none';
    }
  });
});

/* ============================
   Canvas: pulsing stars + meteors
   - Still stars pulse
   - Meteors spawn randomly and more often on scroll
   ============================ */
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let W=innerWidth, H=innerHeight;
function resize(){ W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
window.addEventListener('resize', resize);
resize();

/* pulsing still stars */
let stars = [];
function buildStars(n=180){
  stars = [];
  for(let i=0;i<n;i++){
    stars.push({
      x: Math.random()*W,
      y: Math.random()*H,
      r: Math.random()*1.8 + 0.6,
      alpha: Math.random()*0.9 + 0.1,
      d: -0.01 + Math.random()*0.02
    });
  }
}
buildStars();

/* meteors list */
let meteors = [];
function spawnMeteor(force=false){
  // base spawn prob very small; if force true (scroll) increase probability
  const chance = force ? 0.12 : 0.01;
  if(Math.random() < chance){
    const sx = Math.random()*W*0.9;
    const sy = Math.random()*H*0.4;
    meteors.push({
      x: sx, y: sy,
      vx: (Math.random()*1.4 + 2.2),
      vy: (Math.random()*0.6 + 1.6),
      len: Math.random()*60 + 40,
      hue: Math.random()*360,
      life: 1,
      size: Math.random()*2 + 1.4
    });
  }
}

/* draw star-shaped head helper */
function drawStar(x,y, r, fill){
  ctx.save();
  ctx.beginPath();
  for(let i=0;i<5;i++){
    ctx.lineTo(x + r*Math.cos((18 + i*72)*Math.PI/180), y - r*Math.sin((18 + i*72)*Math.PI/180));
    ctx.lineTo(x + (r/2)*Math.cos((54 + i*72)*Math.PI/180), y - (r/2)*Math.sin((54 + i*72)*Math.PI/180));
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.restore();
}

function draw(){
  // subtle transparent clear for trails
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(0,0,W,H);

  // draw pulsing stars
  for(const s of stars){
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${Math.max(0.06, Math.min(1, s.alpha))})`;
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    ctx.fill();
    s.alpha += s.d;
    if(s.alpha <= 0.06 || s.alpha >= 0.98) s.d *= -1;
  }

  // spawn some meteors occasionally
  spawnMeteor();

  // update meteors from end to start
  for(let i=meteors.length-1;i>=0;i--){
    const m = meteors[i];
    // trail gradient
    const ex = m.x - m.len*0.6;
    const ey = m.y + m.len*0.6;
    const g = ctx.createLinearGradient(m.x,m.y,ex,ey);
    g.addColorStop(0, `hsla(${m.hue},100%,85%,${m.life})`);
    g.addColorStop(1, `hsla(${m.hue},100%,60%,0)`);
    ctx.strokeStyle = g;
    ctx.lineWidth = Math.max(1,m.size);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(m.x,m.y);
    ctx.lineTo(ex,ey);
    ctx.stroke();
    drawStar(m.x, m.y, Math.max(1.8, m.size*1.6), `hsla(${m.hue},100%,90%,${m.life})`);
    m.x += m.vx;
    m.y += m.vy;
    m.life -= 0.012;
    if(m.x > W + 200 || m.y > H + 200 || m.life <= 0) meteors.splice(i,1);
  }

  requestAnimationFrame(draw);
}
draw();

/* spawn extra meteors while scrolling */
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const now = Date.now();
  // throttle
  if(now - lastScroll > 120){
    spawnMeteor(true);
    lastScroll = now;
  }
});

/* rebuild stars on resize */
window.addEventListener('resize', ()=> { clearTimeout(window._sb); window._sb = setTimeout(()=> buildStars(Math.max(120, Math.floor((innerWidth*innerHeight)/8000)) ), 250); });

/* ============================
   Make footer links actually clickable (just ensure anchors)
   ============================ */
/* nothing needed — links are normal anchors and open in new tab via target="_blank" */

