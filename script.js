// ===== Copy Contract =====
function copyContract() {
  navigator.clipboard.writeText("5H1jkA7erRxwD8uqH8KimMD74ctjUYBd32rbp2jubonk");
  const popup = document.getElementById("copy-popup");
  popup.style.opacity = 1;
  setTimeout(() => (popup.style.opacity = 0), 2000);
}

// ===== Expand / Collapse How to Buy =====
function toggleHowToBuy() {
  const content = document.getElementById("how-to-buy");
  const arrow = document.getElementById("arrow");
  if (content.classList.contains("hidden")) {
    content.classList.remove("hidden");
    arrow.textContent = "▲";
  } else {
    content.classList.add("hidden");
    arrow.textContent = "▼";
  }
}

// ===== FAQ Toggle =====
document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const answer = button.nextElementSibling;
    answer.style.display =
      answer.style.display === "block" ? "none" : "block";
  });
});

// ===== Shooting Stars Animation =====
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let w, h;
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

const stars = Array.from({ length: 80 }).map(() => ({
  x: Math.random() * w,
  y: Math.random() * h,
  size: Math.random() * 1.2,
  speed: 0.2 + Math.random() * 1.5,
  trail: Math.random() * 40 + 40
}));

function draw() {
  ctx.clearRect(0, 0, w, h);
  stars.forEach((s) => {
    const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.trail, s.y - s.trail);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size * 1.8, 0, Math.PI * 2);
    ctx.fill();

    s.x += s.speed;
    s.y -= s.speed * 0.4;
    if (s.x > w || s.y < 0) {
      s.x = Math.random() * w;
      s.y = h + 10;
    }
  });
  requestAnimationFrame(draw);
}
draw();
