const TOKEN="5H1jkA7erRxwD8uqH8KimMD74ctjUYBd32rbp2jubonk";
document.getElementById('caButton')?.addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(TOKEN);alert('Copied Contract!');}catch(e){alert(TOKEN);}
});
const howToggle=document.getElementById('howToggle');const howContent=document.getElementById('howContent');
howToggle?.addEventListener('click',()=>howContent.classList.toggle('hidden'));
document.querySelectorAll('.faq-q').forEach(q=>{
  q.addEventListener('click',()=>{const a=q.nextElementSibling;a.classList.toggle('hidden');});
});
(function(){
  const c=document.querySelector('.carousel');if(!c)return;
  const items=[...c.querySelectorAll('.carousel-item')];
  const prev=document.querySelector('.carousel-btn.prev');
  const next=document.querySelector('.carousel-btn.next');
  let i=0;function show(n){items.forEach((it,idx)=>it.classList.toggle('active',idx===n));i=n;}
  function nxt(){show((i+1)%items.length);}
  function prv(){show((i-1+items.length)%items.length);}
  next?.addEventListener('click',nxt);prev?.addEventListener('click',prv);
  setInterval(nxt,4000);
})();
const canvas=document.getElementById('stars');const ctx=canvas.getContext('2d');
function resize(){canvas.width=innerWidth;canvas.height=innerHeight;}resize();addEventListener('resize',resize);
let stars=Array.from({length:200},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.5,a:Math.random(),d:(Math.random()-.5)*.02}));
function frame(){
  ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(0,0,canvas.width,canvas.height);
  for(const s of stars){ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,255,${s.a})`;ctx.fill();s.a+=s.d;if(s.a<=.1||s.a>=1)s.d*=-1;}
  requestAnimationFrame(frame);
}frame();
