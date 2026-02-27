// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FEXGROUP MAIN.JS — clean single-source build
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── WAVE CANVAS ───────────────────────────────
function WaveCanvas(canvasId, opts){
  const c = document.getElementById(canvasId);
  if(!c) return;
  const ctx = c.getContext('2d');
  const o = Object.assign({
    alpha:0.055, lineCount:6, color:'42,128,204',
    speed:0.006, ampBase:40, ampVar:30,
    freqBase:0.003, freqVar:0.003
  }, opts);
  let W, H;
  const waves = Array.from({length:o.lineCount},(_,i)=>({
    amp: o.ampBase + Math.random()*o.ampVar,
    freq: o.freqBase + Math.random()*o.freqVar,
    phase: (i/o.lineCount)*Math.PI*2,
    speed: o.speed*(0.6+Math.random()*0.8),
    y: 0.2+(i/o.lineCount)*0.7,
    alpha: (0.4+Math.random()*0.6)*o.alpha*18
  }));
  function resize(){
    if(c.id==='wave-canvas'){ W=c.width=window.innerWidth; H=c.height=window.innerHeight; }
    else { W=c.width=c.offsetWidth; H=c.height=c.offsetHeight; }
  }
  resize();
  if(c.id==='wave-canvas') window.addEventListener('resize',resize);
  function draw(){
    requestAnimationFrame(draw);
    ctx.clearRect(0,0,W,H);
    waves.forEach(w=>{
      w.phase+=w.speed;
      ctx.beginPath();
      for(let x=0;x<=W;x+=4){
        const y=(w.y*H)+Math.sin(x*w.freq+w.phase)*w.amp+Math.sin(x*w.freq*2.3+w.phase*1.4)*(w.amp*0.4);
        x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      ctx.strokeStyle=`rgba(${o.color},${w.alpha})`;
      ctx.lineWidth=1.5; ctx.stroke();
    });
  }
  draw();
}

// ── CTA WAVE (SVG) ────────────────────────────
function initCtaWave(){
  ['cta-wave','cta-wave2'].forEach(function(id){
    const old=document.getElementById(id);
    if(!old) return;
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('id',id);
    svg.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible;';
    const configs=[
      {amp:28,freq:0.0018,speed:0.009,y:0.12,alpha:0.12},
      {amp:38,freq:0.0024,speed:0.007,y:0.25,alpha:0.18},
      {amp:44,freq:0.0016,speed:0.011,y:0.38,alpha:0.22},
      {amp:36,freq:0.0028,speed:0.008,y:0.50,alpha:0.28},
      {amp:42,freq:0.0020,speed:0.010,y:0.62,alpha:0.22},
      {amp:32,freq:0.0022,speed:0.006,y:0.75,alpha:0.18},
      {amp:26,freq:0.0017,speed:0.012,y:0.88,alpha:0.12},
    ];
    const waves=configs.map(function(cfg,i){
      const path=document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('fill','none');
      path.setAttribute('stroke','rgba(82,168,245,1)');
      path.setAttribute('stroke-width','1.5');
      path.style.opacity=cfg.alpha;
      svg.appendChild(path);
      return {el:path,cfg:cfg,phase:i*Math.PI*0.8};
    });
    old.replaceWith(svg);
    function animate(){
      requestAnimationFrame(animate);
      const W=svg.getBoundingClientRect().width||window.innerWidth;
      const H=svg.getBoundingClientRect().height||280;
      waves.forEach(function(w){
        w.phase+=w.cfg.speed;
        let d='';
        for(let x=0;x<=W+4;x+=4){
          const y=w.cfg.y*H+Math.sin(x*w.cfg.freq+w.phase)*w.cfg.amp+Math.sin(x*w.cfg.freq*2.1+w.phase*1.3)*(w.cfg.amp*0.35);
          d+=(x===0?'M':'L')+x.toFixed(1)+','+y.toFixed(1)+' ';
        }
        w.el.setAttribute('d',d);
      });
    }
    animate();
  });
}

// ── PAGE ROUTING ──────────────────────────────
function go(pg){
  closeMobile();
  document.querySelectorAll('.pg').forEach(el=>el.classList.remove('active'));
  const el=document.getElementById('pg-'+pg);
  if(el){ el.classList.add('active'); window.scrollTo({top:0,behavior:'instant'}); setTimeout(revealAll,80); }
  document.querySelectorAll('.nav-links a').forEach(a=>{
    a.classList.toggle('active', a.getAttribute('onclick') && a.getAttribute('onclick').indexOf("'"+pg+"'")!==-1);
  });
  return false;
}

// ── MOBILE NAV ────────────────────────────────
function openMobile(){ document.getElementById('mnav').classList.add('open'); document.body.style.overflow='hidden'; }
function closeMobile(){ document.getElementById('mnav').classList.remove('open'); document.body.style.overflow=''; }

// ── SCROLL REVEAL ─────────────────────────────
function revealAll(){
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); } });
  },{threshold:0.08});
  document.querySelectorAll('.pg.active .rv').forEach(el=>obs.observe(el));
}

// ── STAT COUNTER ──────────────────────────────
function countUp(el,target,suffix){
  let start=0,dur=1400,step=16;
  const inc=target/(dur/step);
  const t=setInterval(()=>{
    start+=inc;
    if(start>=target){ clearInterval(t); el.textContent=target+(suffix||''); return; }
    el.textContent=Math.floor(start)+(suffix||'');
  },step);
}

// ── IMAGE WHEEL ───────────────────────────────
var wheelIdx=0, wheelTimer=null;
function wheelGo(n){
  const slides=document.querySelectorAll('.wheel-slide');
  const dots=document.querySelectorAll('.wheel-dot');
  if(!slides.length) return;
  slides[wheelIdx].className='wheel-slide prev';
  wheelIdx=(n+slides.length)%slides.length;
  slides[wheelIdx].className='wheel-slide active';
  setTimeout(()=>{ document.querySelectorAll('.wheel-slide.prev').forEach(s=>s.className='wheel-slide next'); },800);
  dots.forEach((d,i)=>d.classList.toggle('active',i===wheelIdx));
  const lbl=document.getElementById('wheel-label');
  if(lbl) lbl.textContent=WHEEL_LABELS[wheelIdx];
  clearInterval(wheelTimer);
  wheelTimer=setInterval(wheelNext,4000);
}
function wheelNext(){ wheelGo(wheelIdx+1); }
function wheelPrev(){ wheelGo(wheelIdx-1); }

// ── LOGISTICS CANVAS ──────────────────────────
function initLogCanvas(){
  const canvas=document.getElementById('log-canvas');
  const diag=document.getElementById('log-diagram');
  if(!canvas||!diag) return;
  const ctx=canvas.getContext('2d');
  let t=0, nodeX=[], W=0;
  const CY=40, H=80;
  function measure(){
    const dr=diag.getBoundingClientRect();
    nodeX=Array.from(diag.querySelectorAll('.log-node')).map(n=>{
      const r=n.getBoundingClientRect();
      return r.left-dr.left+r.width/2;
    });
    W=dr.width; canvas.width=W; canvas.height=H; canvas.style.height=H+'px';
  }
  new ResizeObserver(measure).observe(diag);
  measure();
  function draw(){
    requestAnimationFrame(draw);
    t=(t+0.006)%1.08;
    if(!nodeX.length||W<10) return;
    ctx.clearRect(0,0,W,H);
    const x0=nodeX[0], x3=nodeX[nodeX.length-1], span=x3-x0;
    for(let i=0;i<nodeX.length-1;i++){
      ctx.beginPath(); ctx.setLineDash([6,9]);
      ctx.strokeStyle='rgba(42,128,204,0.22)'; ctx.lineWidth=1.5;
      ctx.moveTo(nodeX[i],CY); ctx.lineTo(nodeX[i+1],CY); ctx.stroke();
    }
    ctx.setLineDash([]);
    nodeX.forEach(nx=>{
      [0,1,2].forEach(ci=>{
        const p=(t+ci/3)%1.08;
        const ax=x0+Math.min(p,1.0)*span;
        const dist=Math.abs(ax-nx);
        if(dist<22){
          const intensity=1-dist/22;
          ctx.beginPath(); ctx.arc(nx,CY,10*intensity,0,Math.PI*2);
          ctx.fillStyle='rgba(82,168,245,'+(0.18*intensity)+')'; ctx.fill();
        }
      });
    });
    [0,1,2].forEach(ci=>{
      const p=(t+ci/3)%1.08;
      if(p>1.0) return;
      const absX=x0+p*span, tailLen=80, tailX=Math.max(x0,absX-tailLen);
      const g=ctx.createLinearGradient(tailX,CY,absX,CY);
      g.addColorStop(0,'rgba(42,128,204,0)'); g.addColorStop(0.4,'rgba(82,168,245,0.2)'); g.addColorStop(1,'rgba(82,168,245,0.85)');
      ctx.beginPath(); ctx.strokeStyle=g; ctx.lineWidth=2.8;
      ctx.moveTo(tailX,CY); ctx.lineTo(absX,CY); ctx.stroke();
      const rg=ctx.createRadialGradient(absX,CY,0,absX,CY,14);
      rg.addColorStop(0,'rgba(255,255,255,0.95)'); rg.addColorStop(0.3,'rgba(82,168,245,0.85)'); rg.addColorStop(1,'rgba(42,128,204,0)');
      ctx.beginPath(); ctx.arc(absX,CY,14,0,Math.PI*2); ctx.fillStyle=rg; ctx.fill();
      ctx.beginPath(); ctx.arc(absX,CY,3,0,Math.PI*2); ctx.fillStyle='#fff'; ctx.fill();
    });
  }
  draw();
}

// ── YOUTUBE ───────────────────────────────────
function loadYT(){
  const wrap=document.getElementById('vid-right');
  const thumb=document.getElementById('vid-thumb');
  if(!wrap||!thumb) return;
  thumb.remove(); wrap.onclick=null; wrap.style.cursor='default';
  const iframe=document.createElement('iframe');
  iframe.src='https://www.youtube.com/embed/nueViw0-Plw?autoplay=1&rel=0&modestbranding=1';
  iframe.style.cssText='position:absolute;inset:0;width:100%;height:100%;border:none';
  iframe.allow='accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture';
  iframe.allowFullscreen=true;
  wrap.appendChild(iframe);
}

// ── CONTACT FORM ──────────────────────────────
// To activate email delivery: sign up at formspree.io,
// create a form, paste your endpoint ID below.
var FORMSPREE_ID = 'YOUR_FORMSPREE_ID';

async function handleForm(e){
  e.preventDefault();
  const form=e.target, resp=document.getElementById('fr');
  if(form.website.value!=='') return;
  if((Date.now()-parseInt(document.getElementById('ft').value))/1000<3) return;
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.em.value)){
    resp.style.display='block'; resp.className='form-resp err';
    resp.textContent='Please enter a valid email address.'; return;
  }
  const btn=form.querySelector('.form-btn');
  const origText=btn.textContent;
  btn.textContent='Sending\u2026'; btn.disabled=true; resp.style.display='none';
  if(FORMSPREE_ID!=='YOUR_FORMSPREE_ID'){
    try{
      const res=await fetch('https://formspree.io/f/'+FORMSPREE_ID,{
        method:'POST',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify({
          firstName:form.fn.value, lastName:form.ln.value,
          email:form.em.value, phone:form.ph.value,
          company:form.co.value, interest:form.inq.value,
          message:form.msg.value
        })
      });
      if(res.ok){
        resp.style.display='block'; resp.className='form-resp ok';
        resp.textContent='Thank you \u2014 we\'ll respond within one business day.';
        form.reset(); document.getElementById('ft').value=Date.now();
      } else { throw new Error(); }
    } catch(err){
      resp.style.display='block'; resp.className='form-resp err';
      resp.textContent='Something went wrong. Please call 740.535.8148.';
    }
  } else {
    resp.style.display='block'; resp.className='form-resp ok';
    resp.textContent='Thank you \u2014 we\'ll respond within one business day.';
    form.reset(); document.getElementById('ft').value=Date.now();
  }
  btn.textContent=origText; btn.disabled=false;
  resp.scrollIntoView({behavior:'smooth',block:'nearest'});
}

// ── INIT (runs after DOM ready) ───────────────
document.addEventListener('DOMContentLoaded',function(){
  // Waves
  new WaveCanvas('wave-canvas',{alpha:1,lineCount:7,ampBase:50,ampVar:40,speed:0.005});
  new WaveCanvas('hero-wave',{alpha:1,lineCount:5,color:'82,168,245',ampBase:35,ampVar:25,speed:0.007});
  initCtaWave();

  // Nav scroll state + float CTA
  window.addEventListener('scroll',function(){
    document.getElementById('nav').classList.toggle('stuck',window.scrollY>60);
    var fc=document.getElementById('float-cta');
    if(fc) fc.classList.toggle('visible',window.scrollY>400);
  });

  // Initial reveal + active nav
  revealAll();
  document.querySelectorAll('.nav-links a').forEach(function(a){
    if(a.getAttribute('onclick')&&a.getAttribute('onclick').indexOf("'home'")!==-1) a.classList.add('active');
  });

  // Stat counters
  setTimeout(function(){
    document.querySelectorAll('.stat-n[data-count]').forEach(function(el){
      countUp(el,parseInt(el.dataset.count),'+');
    });
  },400);

  // Wheel labels + timer
  var WHEEL_LABELS=['International Port Operations','Natural Rock Gypsum','Port Crane Loading','Ocean Vessel Loading'];
  window.WHEEL_LABELS=WHEEL_LABELS;
  wheelTimer=setInterval(wheelNext,4000);

  // Logistics canvas
  setTimeout(initLogCanvas,500);

  // Form timestamp
  var ft=document.getElementById('ft');
  if(ft) ft.value=Date.now();
});
