/* ============================
   Globals & config
   ============================ */
const TOKEN = "5H1jkA7erRxwD8uqH8KimMD74ctjUYBd32rbp2jubonk";

/* ============================
   Rainbow-per-letter (brand)
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
    ch.style.fontWeight = 900;
    ch.textContent = text[i];
    el.appendChild(ch);
  }
}
applyRainbowPerLetter('#brandRainbow');

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
  setTimeout(()=> { t.style.transition='opacity .4s'; t.style.opacity=0; setTimeout(()=> t.remove(),400); }, 1500);
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
   HOW TO BUY toggle (collapsed default)
   ============================ */
const howToggle = document.getElementById('howToggle');
const howContent = document.getElementById('howContent');
if(howToggle && howContent){
  howContent.classList.add('hidden');
  howToggle.setAttribute('aria-expanded', 'false');
  howToggle.addEventListener('click', () => {
    howContent.classList.toggle('hidden');
    howToggle.setAttribute('aria-expanded', String(!howContent.classList.contains('hidden')));
    const arrow = howToggle.querySelector('.how-arrow');
    if(arrow) arrow.style.transform = howContent.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';

    // slide animation
    if(!howContent.classList.contains('hidden')){
      howContent.style.display = 'block';
      howContent.style.height = '0px';
      const full = howContent.scrollHeight + 'px';
      requestAnimationFrame(()=> {
        howContent.style.transition = 'height 320ms ease';
        howContent.style.height = full;
      });
      setTimeout(()=> { howContent.style.height = ''; howContent.style.transition = ''; }, 360);
    } else {
      const curH = howContent.scrollHeight + 'px';
      howContent.style.height = curH;
      requestAnimationFrame(()=> {
        howContent.style.transition = 'height 260ms ease';
        howContent.style.height = '0px';
      });
      setTimeout(()=> { howContent.style.display = 'none'; howContent.style.height = ''; howContent.style.transition = ''; }, 300);
    }
  });
}

/* ============================
   FAQ accordion (stacked layout)
   ============================ */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const a = btn.nextElementSibling;
    if(!a) return;
    a.classList.toggle('hidden');
    a.style.display = a.classList.contains('hidden') ? 'none' : 'block';
  });
});

/* ============================
   Canvas: pulsing white stars + colored meteor dots
   top-left -> bottom-right with matching trail
   ============================ */
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let W = innerWidth, H = innerHeight;
function resize(){ W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
window.addEventListener('resize', resize);
resize();

/* still stars */
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

/* meteors */
let meteors = [];
function spawnMeteor(force=false){
  const prob = force ? 0.14 : 0.012;
  if(Math.random() < prob){
    const sx = Math.random()*W*0.6;
    const sy = Math.random()*H*0.35;
    const speed = Math.random()*1.8 + 2.8;
    const vx = speed + Math.random()*0.4;
    const vy = speed * (0.5 + Math.random()*0.7);
    meteors.push({
      x: sx, y: sy, vx: vx, vy: vy, len: Math.random()*30 + 40,
      hue: Math.floor(Math.random()*360), life: 1, size: Math.random()*2 + 1.6
    });
  }
}

/* draw meteor dot + short trail in same direction */
function drawMeteor(m){
  const ex = m.x - m.vx * (m.len/ (m.vx + m.vy));
  const ey = m.y - m.vy * (m.len/ (m.vx + m.vy));
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

  ctx.beginPath();
  ctx.fillStyle = `hsla(${m.hue},100%,90%,${m.life})`;
  ctx.arc(m.x, m.y, Math.max(1.6, m.size*1.6), 0, Math.PI*2);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = `hsla(${m.hue},100%,80%,${0.28*m.life})`;
  ctx.arc(m.x, m.y, Math.max(3, m.size*3.5), 0, Math.PI*2);
  ctx.fill();
}

/* main loop */
function frame(){
  ctx.fillStyle = 'rgba(0,0,0,0.16)';
  ctx.fillRect(0,0,W,H);

  for(const s of stars){
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${Math.max(0.06, Math.min(1, s.alpha))})`;
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    ctx.fill();
    s.alpha += s.d;
    if(s.alpha <= 0.06 || s.alpha >= 0.98) s.d *= -1;
  }

  spawnMeteor();

  for(let i=meteors.length-1;i>=0;i--){
    const m = meteors[i];
    drawMeteor(m);
    m.x += m.vx; m.y += m.vy; m.life -= 0.01;
    if(m.x > W + 200 || m.y > H + 200 || m.life <= 0) meteors.splice(i,1);
  }

  requestAnimationFrame(frame);
}
frame();

window.addEventListener('scroll', () => { spawnMeteor(true); });

/* rebuild stars on resize */
let resizeTimer;
window.addEventListener('resize', ()=> {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(()=> buildStars(Math.max(120, Math.floor((innerWidth*innerHeight)/9000))), 200);
});

/* ============================
   Carousel autoslide + arrows
   ============================ */
const slides = document.querySelectorAll('.carousel-item');
const nextBtn = document.querySelector('.carousel-btn.next');
const prevBtn = document.querySelector('.carousel-btn.prev');
let idx = 0;

function showSlide(n){
  slides.forEach((s,i)=> s.classList.toggle('active', i===n));
}
if(nextBtn && prevBtn && slides.length){
  nextBtn.addEventListener('click', ()=>{
    idx = (idx + 1) % slides.length;
    showSlide(idx);
  });
  prevBtn.addEventListener('click', ()=>{
    idx = (idx - 1 + slides.length) % slides.length;
    showSlide(idx);
  });
  setInterval(()=>{
    idx = (idx + 1) % slides.length;
    showSlide(idx);
  }, 4000);
}
