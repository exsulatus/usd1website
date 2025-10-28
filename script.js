/* CONFIG */
const CONFIG_SOLSCAN_KEY = ""; // optional later; public endpoints used by default
const TOKEN_ADDRESS = "5H1jkA7erRxwD8uqH8KimMD74ctjUYBd32rbp2jubonk";
const STREAMFLOW_DASHBOARD = "https://app.streamflow.finance/token-dashboard/solana/mainnet/" + TOKEN_ADDRESS;

/* SMALL HELPERS */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* RAINBOW HEADINGS - wrap letters */
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
hamburger.addEventListener('click', ()=> navLinks.classList.toggle('open'));
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
$('#copyCA').addEventListener('click', ()=> copyToClipboard(TOKEN_ADDRESS));
$('#headerCA').addEventListener('click', ()=> copyToClipboard(TOKEN_ADDRESS));

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

/* HOW TO BUY expandable */
const howBtn = $('#howToBuyBtn');
const howBox = $('#howToBuy');
howBtn.addEventListener('click', () => {
  const open = howBox.classList.toggle('hidden') ? false : true;
  howBtn.setAttribute('aria-expanded', String(!howBox.classList.contains('hidden')));
  const arrow = howBtn.querySelector('.arrow');
  if(arrow) arrow.style.transform = howBox.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
});

/* FAQ expand/collapse */
$$('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const a = btn.nextElementSibling;
    a.classList.toggle('hidden');
    btn.classList.toggle('collapsed');
    const toggle = btn.querySelector('.faq-toggle');
    if(toggle) toggle.textContent = a.classList.contains('hidden') ? '▾' : '▴';
  });
});

/* =========================
   Canvas: stars + meteors
   ========================= */
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
function resizeCanvas(){ canvas.width = innerWidth; canvas.height = innerHeight; }
window.addEventListener('resize', ()=> { resizeCanvas(); buildStars(Math.max(120, Math.floor((innerWidth*innerHeight)/8000))); });
resizeCanvas();

/* pulsing white stars (bigger/brighter) */
let stars = [];
function buildStars(count = 220){
  stars = [];
  for(let i=0;i<count;i++){
    stars.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      r: Math.random()*2.8 + 0.9,
      a: Math.random()*0.9 + 0.1,
      d: -0.015 + Math.random()*0.03
    });
  }
}
buildStars();

/* shooting meteors (star-shaped head, short tapered trail) */
let meteors = [];
function spawnMeteor(){
  if(Math.random() < 0.012){
    const sx = Math.random() * canvas.width * 0.9;
    const sy = Math.random() * canvas.height * 0.45;
    meteors.push({
      x: sx, y: sy, vx: (Math.random()*1.0 + 2.0), vy: (Math.random()*0.8 + 1.8),
      len: Math.random()*70 + 40, life:1, hue: Math.random()*360, size: Math.random()*3 + 2
    });
  }
}

/* draw small star shape */
function drawStarShape(x,y,r,fill){
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

function drawMeteor(m){
  // trail: short tapered triangle/gradient
  const ex = m.x - m.len*0.6;
  const ey = m.y + m.len*0.6;
  const g = ctx.createLinearGradient(m.x, m.y, ex, ey);
  g.addColorStop(0, `hsla(${m.hue},100%,85%,${m.life})`);
  g.addColorStop(1, `hsla(${m.hue},100%,60%,0)`);
  ctx.save();
  ctx.strokeStyle = g;
  ctx.lineWidth = Math.max(1, m.size);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(m.x, m.y);
  ctx.lineTo(ex, ey);
  ctx.stroke();
  // star head
  drawStarShape(m.x, m.y, Math.max(1.6, m.size*1.2), `hsla(${m.hue},100%,90%,${m.life})`);
  ctx.restore();
}

/* animation loop */
function frame(){
  // semi-transparent clear for trails
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // pulsing stars
  for(const s of stars){
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${Math.max(0.06, Math.min(1, s.a))})`;
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    ctx.fill();
    s.a += s.d;
    if(s.a <= 0.06 || s.a >= 0.98) s.d *= -1;
  }

  // spawn meteors
  spawnMeteor();

  // draw meteors
  for(let i = meteors.length-1;i>=0;i--){
    const m = meteors[i];
    drawMeteor(m);
    m.x += m.vx; m.y += m.vy; m.life -= 0.012;
    if(m.x > canvas.width + 200 || m.y > canvas.height + 200 || m.life <= 0) meteors.splice(i,1);
  }

  requestAnimationFrame(frame);
}
frame();

/* =========================
   Solscan public API polling
   ========================= */
const supplyEl = $('#supplyValue');
const holdersEl = $('#holdersValue');
const updatedEl = $('#updatedAt');

async function fetchSolscanMeta(){
  try{
    // prefer public API
    const metaUrl = `https://public-api.solscan.io/token/meta?address=${TOKEN_ADDRESS}`;
    const holdersUrl = `https://public-api.solscan.io/token/holders?address=${TOKEN_ADDRESS}&page=1&page_size=1`;
    const [metaR, holdersR] = await Promise.all([ fetch(metaUrl), fetch(holdersUrl) ]);
    if(!metaR.ok || !holdersR.ok) throw new Error('public API error');
    const metaJ = await metaR.json();
    const holdersJ = await holdersR.json();
    // metaJ may include data.supply (raw) or supply, decimals
    const supply = metaJ?.data?.supply ?? metaJ?.supply ?? null;
    const decimals = metaJ?.data?.decimals ?? metaJ?.decimals ?? 0;
    const totalSupply = supply !== null ? Number(supply) / Math.pow(10, decimals) : null;
    const holders = holdersJ?.data?.total ?? (Array.isArray(holdersJ?.data?.rows) ? holdersJ.data.rows.length : null);

    if(totalSupply !== null){
      supplyEl.textContent = Intl.NumberFormat().format(totalSupply);
    } else {
      supplyEl.textContent = "Unavailable";
    }
    if(holders !== null){
      holdersEl.textContent = String(holders);
    } else {
      holdersEl.textContent = "Unavailable";
    }
    updatedEl.textContent = new Date().toLocaleString();
  }catch(e){
    console.warn('Solscan fetch failed', e);
    supplyEl.textContent = "Live data unavailable";
    holdersEl.textContent = "Live data unavailable";
    updatedEl.textContent = "—";
  }
}

// initial fetch and repeat
fetchSolscanMeta();
setInterval(fetchSolscanMeta, 30000);

/* =========================
   Misc UI tweaks on load
   ========================= */
$$('.nav-socials .social').forEach(a => { a.style.fontSize = '15px'; a.style.padding = '10px 14px'; });

/* ensure the FAQ icon only in FAQ heading (already in HTML) */

