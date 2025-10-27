// --- Fade on scroll ---
const sections = document.querySelectorAll('.fade-section');
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.2 });
sections.forEach(sec => fadeObserver.observe(sec));

// --- Copy Contract Address ---
document.getElementById('copyCA').addEventListener('click', () => {
  const ca = document.getElementById('contractAddress').innerText;
  navigator.clipboard.writeText(ca);
  alert('Contract address copied!');
});

// --- Toggle How To Buy ---
document.getElementById('howToBuyBtn').addEventListener('click', () => {
  const box = document.getElementById('howToBuy');
  box.classList.toggle('hidden');
});

// --- Canvas Starfield ---
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let stars = [], shootingStars = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createStars() {
  stars = [];
  for (let i = 0; i < 150; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8,
      alpha: Math.random(),
      dAlpha: (Math.random() * 0.02) - 0.01
    });
  }
}
createStars();

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let s of stars) {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
    ctx.fill();
    s.alpha += s.dAlpha;
    if (s.alpha <= 0 || s.alpha >= 1) s.dAlpha *= -1;
  }
}

function createShootingStar() {
  if (Math.random() < 0.02) {
    const startX = Math.random() * canvas.width;
    shootingStars.push({
      x: startX,
      y: 0,
      len: Math.random() * 200 + 100,
      speed: Math.random() * 6 + 4,
      color: `hsl(${Math.random() * 360}, 100%, 70%)`
    });
  }
}

function drawShootingStars() {
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const s = shootingStars[i];
    ctx.strokeStyle = s.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x - s.len, s.y + s.len);
    ctx.stroke();
    s.x += s.speed;
    s.y += s.speed;
    if (s.y > canvas.height || s.x > canvas.width) shootingStars.splice(i, 1);
  }
}

function animate() {
  drawStars();
  createShootingStar();
  drawShootingStars();
  requestAnimationFrame(animate);
}
animate();
