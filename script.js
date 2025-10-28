/* ====== Config ====== */
const CONTRACT = "5H1jkA7erRxwD8uqH8KimMD74ctjUYBd32rbp2jubonk";

/* ====== Copy to clipboard (header $USD1 + home CA button) ====== */
function showToast(msg){
  const t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style, {
    position:'fixed', left:'50%', bottom:'26px', transform:'translateX(-50%)',
    padding:'10px 16px', borderRadius:'999px', fontWeight:'900', zIndex:9999,
    color:'#000',
    background:'linear-gradient(90deg,#ff005e,#ff7a00,#ffd100,#3cff6a,#00d2ff,#5a6bff,#b84cff)',
    backgroundSize:'400% 100%',
    animation:'rainbowMove 6s linear infinite'
  });
  document.body.appendChild(t);
  setTimeout(()=>{ t.style.transition='opacity .35s'; t.style.opacity='0'; setTimeout(()=> t.remove(), 380); }, 1400);
}

function copyCA(){
  navigator.clipboard.writeText(CONTRACT).then(()=> showToast('Contract copied to clipboard'));
}

document.getElementById('headerUsdCopy')?.addEventListener('click', copyCA);
document.getElementById('homeCaCopy')?.addEventListener('click', copyCA);

/* ====== HOW TO BUY toggle (collapsed by default) ====== */
const howToggle = document.getElementById('howToggle');
const howContent = document.getElementById('howContent');
if(howToggle && howContent){
  // ensure collapsed start
  howContent.classList.add('hidden');
  howToggle.addEventListener('click', () => {
    const isHidden = howContent.classList.contains('hidden');
    if(isHidden){
      // expand
      howContent.classList.remove('hidden');
      howContent.style.display = 'block';
      howContent.style.height = '0px';
      const full = howContent.scrollHeight + 'px';
      requestAnimationFrame(()=>{
        howContent.style.transition = 'height 300ms ease';
        howContent.style.height = full;
      });
      setTimeout(()=>{ howContent.style.height=''; howContent.style.transition=''; }, 320);
      howToggle.querySelector('.arrow').style.transform = 'rotate(180deg)';
    }else{
      // collapse
      const h = howContent.scrollHeight + 'px';
      howContent.style.height = h;
      requestAnimationFrame(()=>{
        howContent.style.transition = 'height 260ms ease';
        howContent.style.height = '0px';
      });
      setTimeout(()=>{ howContent.classList.add('hidden'); howContent.style.display='none'; howContent.style.height=''; howContent.style.transition=''; }, 280);
      howToggle.querySelector('.arrow').style.transform = 'rotate(0deg)';
    }
  });
}

/* ====== FAQ accordion ====== */
document.querySelectorAll('.faq-q').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const a = btn.parentElement.querySelector('.faq-a');
    const hidden = a.classList.contains('hidden');
    if(hidden){
      a.classList.remove('hidden');
      a.style.display = 'block';
    }else{
      a.classList.add('hidden');
      a.style.display = 'none';
    }
  });
});

/* ====== Starfield (pulsing stars + shooting stars) ====== */
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let W = innerWidth, H = innerHeight;
function resize(){ W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
addEventListener('resize', resize); resize();

/* Still stars */
let stars = [];
function buildStars(n=200){
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

/* Shooting meteors (top-left -> bottom-right) */
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
      x: sx, y: sy, vx, vy,
      len: Math.random()*30 + 40,
      hue: Math.floor(Math.random()*360),
      life: 1,
      size: Math.random()*2 + 1.6
    });
  }
}
function drawMeteor(m){
  const ex = m.x - m.vx * (m.len/(m.vx+m.vy));
  const ey = m.y - m.vy * (m.len/(m.vx+m.vy));
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
  // head
  ctx.beginPath();
  ctx.fillStyle = `hsla(${m.hue},100%,90%,${m.life})`;
  ctx.arc(m.x, m.y, Math.max(1.6, m.size*1.6), 0, Math.PI*2);
  ctx.fill();
  // glow
  ctx.beginPath();
  ctx.fillStyle = `hsla(${m.hue},100%,80%,${0.28*m.life})`;
  ctx.arc(m.x, m.y, Math.max(3, m.size*3.5), 0, Math.PI*2);
  ctx.fill();
}
function frame(){
  ctx.fillStyle = 'rgba(0,0,0,0.16)';
  ctx.fillRect(0,0,W,H);

  // still stars pulse
  for(const s of stars){
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${Math.max(0.06, Math.min(1, s.alpha))})`;
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    ctx.fill();
    s.alpha += s.d;
    if(s.alpha <= 0.06 || s.alpha >= 0.98) s.d *= -1;
  }

  // spawn occasional meteors
  spawnMeteor();

  // draw meteors
  for(let i=meteors.length-1;i>=0;i--){
    const m = meteors[i];
    drawMeteor(m);
    m.x += m.vx; m.y += m.vy; m.life -= 0.01;
    if(m.x > W + 180 || m.y > H + 180 || m.life <= 0) meteors.splice(i,1);
  }

  requestAnimationFrame(frame);
}
frame();

// extra meteors while scrolling
let lastScroll = 0;
addEventListener('scroll', ()=>{
  const now = Date.now();
  if(now - lastScroll > 80){ spawnMeteor(true); lastScroll = now; }
});

// rebuild stars density on resize
let resizeTimer;
addEventListener('resize', ()=>{
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(()=> buildStars(Math.max(120, Math.floor((innerWidth*innerHeight)/9000))), 200);
});
